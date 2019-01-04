function createEvent(event, avObj) {
    var calendar = CalendarApp.getDefaultCalendar();

    if (event.recurrenceBool == "No") {
        //create a single event
        calendar.createEvent(event.name, event.start, event.end, {description: event.description});  
    } else {
        //create recurring events
        var startDate = event.start;
        var endDate = event.end;
        var duration = endDate - startDate;
        var freeDates = avObj.availableDates;

        for (var i=0; i<freeDates.length; i++) {
            var startTime = freeDates[i];
            var endTime = new Date(startTime.getTime() + duration);

            calendar.createEvent(event.name, startTime, endTime, {description: event.description});
        }

        var freeDateStrings = freeDates.map(function(e) { return e.toDateString(); });
        var busyDateStrings = avObj.busyDates.map(function(e) { return e.toDateString(); });

        var reply = "";
        if (avObj.availability == "full") {
            reply = "Congratulations, your reservation request has been successfully approved!";
        } else if (avObj.availability == "partial") {
            reply = "Congratulations, your reservation request has been partially approved! You have reserved the rec room successfully for the following dates:\n";
            for (var i=0; i<freeDateStrings.length; i++) {
                reply += freeDateStrings[i]+"\n";
            }
            reply += "There were conflicts with other events at the other dates.";
        }

        sendEmail(event, reply);
    }

}