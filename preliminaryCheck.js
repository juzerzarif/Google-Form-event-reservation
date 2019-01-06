function preliminaryCheck(event) {

    var stopDay = CacheService.getScriptCache().get("stopDayDate");
    if (stopDay == null) {
        //requests are not being processes during the summer
        sendEmail(event, "Unfortunately, reservation requests are not being processed over break. " +
            "Please retry submitting your reservation request 48 hours prior to the start of classes at the earliest. " +
            "Thank you for your patience.");
        return false;
    }

    var TWO_DAYS = 48 * 60 * 60 * 1000;
    var delta_t = event.start - (new Date());
    if (delta_t < TWO_DAYS) {
        sendEmail(event, "Unfortunately, your reservation request has been denied. You must submit a rec room reservation request atleast 48 hours prior to the start time of your event. " +
            "You are however still welcome to use the rec room for an event if it is free at the time and as long as it does not inconvinience any Lylemen.");
        return false;
    }

    var dateTimeSanityCheck = (event.end - event.start > 0) &&
        (event.start - (new Date()) > 0);
    if (!dateTimeSanityCheck) {
        sendEmail(event, "Unfortunately, your reservation request cannot be processed. There seems to be a problem with the event start and/or end times. " +
            "Please resubmit the reservation request with the appropriate changes.");
        return false;
    }

    var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(event.organizerEmail)) {
        sendEmail(event, false);
        return false;
    }

    if (event.recurrenceBool == "Yes") {
        if (event.recurrenceType == "") {
            sendEmail(event, "Unfortunately, your reservation request cannot be processed. You need to specify the nature of the recurrence of your event.");
            return false;
        }

        var recurrenceTest = (event.recurrenceType == GLOBAL.RECURRENCE.option3 && event.monthRecurrence.length == 0);
        if (recurrenceTest) {
            sendEmail(event, "Unfortunately, your reservation request cannot be processed. You need to specify the monthly recurrence of your event.");
            return false;
        }

        var recur = event.recurrenceType;
        if (recur != GLOBAL.RECURRENCE.option1 && recur != GLOBAL.RECURRENCE.option2 && recur != GLOBAL.RECURRENCE.option3) {
            sendEmail(event, false);
            return false;
        }
    }

    if (/wilbur/i.test(event.organizer) && /nether/i.test(event.organizer)) {
        sendEmail(event, "Wilbur Nether, our lord and savior is welcome to use the rec room as and when he pleases. The submission of a request form is beneath you Your Highness and we apologize if we implied the need to do so.");
        return false;
    }

    return true;
}