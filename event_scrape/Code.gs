var SPREAD_ID = "1fEmIrbLa2uo273tsec10Gc0EyF2dQVeet-DOirBEtAE";  // イベント取得

function doGet(e) {
  Logger.log("doGet() Run");

  var data = "";
  data = getEvents(e);
  
  return ContentService.createTextOutput(data);
  //var template = HtmlService.createTemplateFromFile('Test');
  //return template.evaluate();
}

function doPost(e) {
  Logger.log("doPost() Run");

  var data = "";

  var date;
  var text = "";
  var sender = "";
  if(e.parameter.date == undefined) {
    date = undefined;
  } else {
    date = new Date(e.parameter.date);
  }
  if(e.parameter.text == undefined) {
    text = undefined;
  } else {
    text = e.parameter.text;
  }
  if(e.parameter.sender == undefined) {
    sender = undefined;
  } else {
    sender = e.parameter.sender;
  }
  //setEvent(date, 'idobata_mention', text);
  setEvent(date, 'idobata', text, sender);
  
  Logger.log("date:" + date);
  Logger.log("text:" + text);
  Logger.log("sender:" + sender);
  //return ContentService.createTextOutput(Utilities.formatDate(date, "JST", "HH:mm ") + ' ' + text);
  return ContentService.createTextOutput(Utilities.formatDate(date, "JST", "HH:mm ") + ' ' + text + ' ' + sender);
}

function getEvents(e) {
  Logger.log("getEvents() Run");
  
  var mySpread = SpreadsheetApp.openById(SPREAD_ID);
  var mySheet = mySpread.getSheetByName("イベント一覧");
  
  var row = 3;
  //var data = '{"events":[';
  var data = '{}';

  Logger.log("row:" + row);
  var chk_dt = new Date("2999/01/01 00:00:00");
  var get_row = 0;
  while(mySheet.getRange("F" + row).getValue().toString() != '') {
    if(mySheet.getRange("F" + row).getValue() != 0) {
      row = row + 1;
      continue;
    }
    else if(mySheet.getRange("C" + row).getValue() > chk_dt) {
      row = row + 1;
      continue;
    }
      
    //if(data.length != 11) {
    //  data = data + ',';
    //}
    data = '';  //イベント取得は、一番古い１件のみに対応。

    data = data + '{"event_type":"' + mySheet.getRange("D" + row).getValue() + '",';
    chk_dt = mySheet.getRange("C" + row).getValue();
    data = data +  '"text":"' + Utilities.formatDate(mySheet.getRange("C" + row).getValue(), "JST", "HH:mm ");
    data = data + '\\r\\n';
    //if(mySheet.getRange("D" + row).getValue() == 'mtg') {
    if(mySheet.getRange("D" + row).getValue() == 'schedule') {
      //data = data + '会議で～す。';
    }
    else if(mySheet.getRange("D" + row).getValue() == 'mail') {
      //data = data + 'メールで～す。';
    }
    //else if(mySheet.getRange("D" + row).getValue() == 'idobata_mention') {
    else if(mySheet.getRange("D" + row).getValue() == 'idobata') {
      //data = data + 'idobataで～す。';
    }
    data = data + mySheet.getRange("E" + row).getValue().replace(/"/g, '\\"') + '"}';
    //mySheet.getRange("F" + row).setValue(1);
    get_row = row;
    
    row = row + 1;
    Logger.log("row:" + row);
  }
  //data = data + ']}';

  if(get_row > 0) {
    mySheet.getRange("F" + get_row).setValue(1);
  }
  
  return data;
}

//function setEvent(date, kind, text) {
function setEvent(date, kind, text, sender) {
  Logger.log("setEvent() Run");
  
  var mySpread = SpreadsheetApp.openById(SPREAD_ID);
  var mySheet = mySpread.getSheetByName("イベント一覧");

  var row = mySheet.getLastRow() + 1;
  mySheet.getRange("B" + row).setValue('xxxxxxxxxx');
  mySheet.getRange("C" + row).setValue(date);
  mySheet.getRange("D" + row).setValue(kind);
  //mySheet.getRange("E" + row).setValue(text);
  mySheet.getRange("E" + row).setValue(makeText(text, sender));
  mySheet.getRange("F" + row).setValue(0);
}
