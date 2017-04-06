var SPREAD_ID = "1hiXezat1grusGnXnJBr1eMzMHcyoMtKTEfbdEuaGHqA";  // ログ一覧

function doGet(e) {
  Logger.log("doGet() Run");

  setLog(e);
  var template = HtmlService.createTemplateFromFile('Test');
  return template.evaluate();
}

function setLog(e) {
  Logger.log("setLog() Run");

  var mySpread = SpreadsheetApp.openById(SPREAD_ID);
  var mySheet = mySpread.getSheetByName("ログ一覧");

  var row = 3;
  
  Logger.log("row:" + row);
  while(mySheet.getRange("B" + row).getValue() != "") {
    row = row + 1;
    Logger.log("row:" + row);
  }
  
  var kind = "";
  Logger.log("kind:" + e.parameter.kind);
  if(e.parameter.kind == undefined) {
    kind = undefined;
  } else {
    kind = e.parameter.kind;
  }
  var dt = new Date();
  
  mySheet.getRange("B" + row).setValue(dt);
  mySheet.getRange("C" + row).setValue(kind);
}
