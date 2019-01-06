//  0 = Name
//  1 = Email
//  2 = Event Name
//  3 = Event Start
//  4 = Event End 
//  5 = Is this a recurring event
//  6 = If so, explain the nature of recurrence
//  7 = Event Description
//  8 = Will you be using Rec Room facilities
//  9 = What facilities?

function OnSubmit() {

    var testForm = FormApp.openById("1JK2oTlp-uzfqfRGBqA1DPbMzLqZWAW0HsUuo3bDpfOk");

    var responseArr = testForm.getResponses();
    var items = responseArr[responseArr.length - 1].getItemResponses();

    var event = saveFormResponses(items);
    debugger;

    if (!preliminaryCheck(event)) {
        return;
    }

    var availObj = checkAvailability(event);
    if (!availObj) {
        //spot not available
        return;
    }

    createEvent(event, availObj);

    debugger;
}
