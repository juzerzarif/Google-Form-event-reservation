function createEvent(event, avObj) {
    var calendar = CalendarApp.getDefaultCalendar();
    var eventName = "["+event.organizer.split(" ")[0]+"] "+event.name;
    if (event.recurrenceBool == "No") {
        //create a single event
        calendar.createEvent(eventName, event.start, event.end, {description: event.description});  
    } else {
        //create recurring events
        var startDate = event.start;
        var endDate = event.end;
        var duration = endDate - startDate;
        var freeDates = avObj.availableDates;
        
      var recurrence = CalendarApp.newRecurrence().setTimeZone("America/Chicago");
        for (var i=0; i<freeDates.length; i++) {
            var startTime = freeDates[i];
//            var endTime = new Date(startTime.getTime() + duration);
            
            recurrence.addDate(startTime);
//            calendar.createEvent(eventName, startTime, endTime, {description: event.description});
        }
        calendar.createEventSeries(event.name, event.start, event.end, recurrence);

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