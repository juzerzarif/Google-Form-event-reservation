/*
* Runs on form submit. Gets most recent response from the form, checks for availability,
* and creates a calendar event.
*/
function formSubmit() {

    var testForm = FormApp.openById("1JK2oTlp-uzfqfRGBqA1DPbMzLqZWAW0HsUuo3bDpfOk");

    var responseArr = testForm.getResponses();
    var items = responseArr[responseArr.length - 1].getItemResponses();

    var event = saveFormResponses(items);

    if (!preliminaryCheck(event)) {
        return;
    }

    var availObj = checkAvailability(event);
    if (!availObj) {
        //spot not available
        return;
    }

    createEvent(event, availObj);
}

function update() {
  CacheService.getScriptCache().put("stopDayDate", "Friday, May 10, 2019");
}
