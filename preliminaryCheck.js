/*
* Performs multiple preliminary checks to determine whether the form response should be further processed
*/
function preliminaryCheck(event) {

    var stopDay = CacheService.getScriptCache().get("stopDayDate");

    // Checks for if a request is submitted during winter/summer break. The value for stopDayDate in the cache is set to
    // null for breaks.
    if (stopDay == null) {
        //requests are not being processes during breaks
        sendEmail(event, "Unfortunately, reservation requests are not being processed over break. " +
            "Please retry submitting your reservation request 48 hours prior to the start of classes at the earliest. " +
            "Thank you for your patience.");
        return false;
    }

    // Checks if there has been an error in updating the cache. Most probable cause is a change to the KU Registrar page.
    // Will have to manually process the request.
    if (stopDay == "ERROR") {
        sendEmail(event, "Reservation requests are not currently being automatically processed. "+
            "If you do not receive a response with the status of your request within 24 hours please contact the president of Stephenson Scholarship Hall. "+
            "Thank you for your patience.", true);
        return false;
    }

    var TWO_DAYS = 48 * 60 * 60 * 1000;
    var delta_t = event.start - (new Date());

    // Checks to see if a request has been submitted atleast 48 hours in advance
    if (delta_t < TWO_DAYS) {
        sendEmail(event, "Unfortunately, your reservation request has been denied. You must submit a rec room reservation request atleast 48 hours prior to the start time of your event. " +
            "You are however still welcome to use the rec room for an event if it is free at the time and as long as it does not inconvinience any Lylemen.");
        return false;
    }

    var dateTimeSanityCheck = (event.end - event.start > 0) &&
        (event.start - (new Date()) > 0);
    
    // Checks to see if the event start and end times makes sense. start time should be after current time (this is just for sanity's sake, this will get caught in the
    // 48 hour check anyway) and end time should be after start time.
    if (!dateTimeSanityCheck) {
        sendEmail(event, "Unfortunately, your reservation request cannot be processed. There seems to be a problem with the event start and/or end times. " +
            "Please resubmit the reservation request with the appropriate changes.");
        return false;
    }

    // Check to see if the email address makes sense. This regex was provided courtesy of _________ on <some website> because God knows I don't know enough about
    // the voodoo speak that is regex to write my own unless I absolutely have to. Since I can't auto reply to a broken email address, needs manual processing.
    var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(event.organizerEmail)) {
        sendEmail(event, false);
        return false;
    }

    // Only applies to recurring events
    if (event.recurrenceBool == "Yes") {

        // Check to see if the recurrence type question was left empty (selected 'Others' and typed nothing in).
        // EDIT: Found out that is not possible for a required question anyway.
        if (event.recurrenceType == "") {
            sendEmail(event, "Unfortunately, your reservation request cannot be processed. You need to specify the nature of the recurrence of your event.");
            return false;
        }

        // Checks to make sure the month recurrence question is answered if the recurrence type is Monthly
        var recurrenceTest = (event.recurrenceType == GLOBAL.RECURRENCE.option3 && !event.hasOwnProperty("monthRecurrence"));
        if (recurrenceTest) {
            sendEmail(event, "Unfortunately, your reservation request cannot be processed. You need to specify the monthly recurrence of your event.");
            return false;
        }

        // Checks to see if the 'Other' option was selected in the recurrence type question.
        // Will have to manually process the request.
        var recur = event.recurrenceType;
        if (recur != GLOBAL.RECURRENCE.option1 && recur != GLOBAL.RECURRENCE.option2 && recur != GLOBAL.RECURRENCE.option3) {
            sendEmail(event, false);
            return false;
        }
    }

    // If Wilbur Nether submits a request. Will have to include the words 'Wilbur' and 'Nether' in the Name field because only
    // plebians would address Wilbur on a first name basis for something this formal. Also because I didn't wanna screw over people
    // whose first name is Wilbur or last name is Nether. 
    if (/wilbur/i.test(event.organizer) && /nether/i.test(event.organizer)) {
        sendEmail(event, "Wilbur Nether, our lord and savior is welcome to use the rec room as and when he pleases. The submission of a request form is beneath you Your Highness and we apologize if we implied the need to do so.");
        return false;
    }

    return true;
}