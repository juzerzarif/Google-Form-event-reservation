/*
* Runs on form submit. Gets most recent response from the form, checks for availability,
* and creates a calendar event.
*/
function formSubmit() {

    var testForm = FormApp.openById("1JK2oTlp-uzfqfRGBqA1DPbMzLqZWAW0HsUuo3bDpfOk");

    // Get the most recent response to the form
    var responseArr = testForm.getResponses();
    var items = responseArr[responseArr.length - 1].getItemResponses();

    // save responses in an event object
    var event = saveFormResponses(items);

    // perform preliminary checks on the event object for correctness 
    if (!preliminaryCheck(event)) {
        return;
    }
    
    // Get the availability for the event and store it in an availability object
    var availObj = checkAvailability(event);
    if (!availObj) {
        return;
    }

    // Create a calendar event for the available dates
    createEvent(event, availObj);

}

function update() {
  CacheService.getScriptCache().put("stopDayDate", "Friday, May 10, 2019");
}
