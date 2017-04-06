function searchContactMail() {
  Logger.log("searchContactMail() Run");
  
  var mySpread = SpreadsheetApp.openById(SPREAD_ID);
  var mySheet = mySpread.getSheetByName("イベント一覧");

  //var strTerms = '("退避データの年度毎の振り分けについて" OR '
  //                + '"退避データの年度毎の振り分けについて")';
  var strTerms = 'from:(h-haneda@esm.co.jp OR t-kunou@esm.co.jp OR t-nakanishi@esm.co.jp)';
  //var strTerms = '';
  //var myThreads = GmailApp.search(strTerms, 0, 30); //条件にマッチしたスレッドを取得
  var myThreads = GmailApp.getInboxThreads(0, 10); //受信箱からメールを取得する
  var myMsgs = GmailApp.getMessagesForThreads(myThreads); //スレッドからメールを取得する　→二次元配列で格納
 
  for(var i = 0; i < myMsgs.length; i++){
    //for(var j = 0; j < myMsgs[i].length; j++){
    for(var j = 0; j < 1; j++){
      var row = 3;
      while(mySheet.getRange("B" + row).getValue() != "") {
        if(mySheet.getRange("B" + row).getValue() == myMsgs[i][j].getId()) {
          break;
        }
        row++;
      }
      if(mySheet.getRange("B" + row).getValue() == "") {
        mySheet.getRange("B" + row).setValue(myMsgs[i][j].getId());
        mySheet.getRange("C" + row).setValue(myMsgs[i][j].getDate());
        mySheet.getRange("D" + row).setValue("mail");
        //mySheet.getRange("E" + row).setValue(myMsgs[i][j].getFrom());
        mySheet.getRange("E" + row).setValue(makeText(myMsgs[i][j].getSubject(), myMsgs[i][j].getFrom()));
        mySheet.getRange("F" + row).setValue(0);
        Logger.log("[" + i + "][" + j + "]:" + myMsgs[i][j].getDate()); 
        Logger.log("[" + i + "][" + j + "]:" + myMsgs[i][j].getFrom());
      }
    }
  }
}

function makeText(text, sender) {
  var work = '';

  if(text.length <= 25) {
    work = text;
  }
  else if(text.length <= 50) {
    work = text.slice(0, 25) + '\\r\\n';
    work = work + text.slice(25);
  }
  else if(text.length > 50) {
    work = text.slice(0, 25) + '\\r\\n';
    work = work + text.slice(25, 50) + '…';
  }
  work = work + '\\r\\n';
  work = work + sender;

  return work;
}

function searchSchedule() {
  Logger.log("searchSchedule() Run");
  
  var mySpread = SpreadsheetApp.openById(SPREAD_ID);
  var mySheet = mySpread.getSheetByName("イベント一覧");

  //var date = new Date('2017/04/03');
  var date = new Date();
  var events = CalendarApp.getDefaultCalendar().getEventsForDay(date);
  
  for(var i = 0; i < events.length; i++) {
    var row = 3;
    while(mySheet.getRange("B" + row).getValue() != "") {
      if(mySheet.getRange("B" + row).getValue() == events[i].getId()) {
        break;
      }
      row++;
    }
    if(mySheet.getRange("B" + row).getValue() == "") {
      mySheet.getRange("B" + row).setValue(events[i].getId());
      mySheet.getRange("C" + row).setValue(events[i].getStartTime());
      mySheet.getRange("D" + row).setValue("schedule");
      mySheet.getRange("E" + row).setValue(events[i].getTitle());
      mySheet.getRange("F" + row).setValue(0);
      Logger.log('StartTime:' + events[i].getStartTime());
      Logger.log('Title:' + events[i].getTitle());
    }
  }
}
