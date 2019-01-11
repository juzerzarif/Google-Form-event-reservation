function createEvent(event, avObj) {
    var calendar = CalendarApp.getDefaultCalendar();
    var eventName = "["+event.organizer.split(" ")[0]+"] "+event.name;
    var daylightDate = new Date(PropertiesService.getScriptProperties().getProperty("daylightSavingsDate"));
    
    if (event.recurrenceBool == "No") {
        //create a single event
        calendar.createEvent(eventName, event.start, event.end, {description: event.description});
        sendEmail(event, "Congratulations, your reservation request has been successfully approved!");  
    } else {
        //create recurring events
        var startDate = event.start;
        var endDate = event.end;
        var duration = endDate - startDate;
        var freeDates = avObj.availableDates;
        
        var recurrence = CalendarApp.newRecurrence();
        for (var i=0; i<freeDates.length; i++) {
            var eventDate = freeDates[i];
            
            recurrence.addDate(eventDate);
        }
        var seriesId = calendar.createEventSeries(eventName, event.start, event.end, recurrence, {description: event.description}).getId();
        
        if (startDate < daylightDate) {
            var toFixDates = freeDates.filter(function(date) { return date.getMonth() == daylightDate.getMonth(); });
            
            for (var i=0; i<toFixDates.length; i++) {

                var eventList = calendar.getEventsForDay(toFixDates[i], {search: eventName});
                
                eventList.forEach(function(e) {  
                    if(e.getId() == seriesId) {
                        var start = toFixDates[i];
                        var end = new Date(start.getTime() + duration);
                        e.setTime(start, end);
                    }
                });
            }
        }

        var freeDateStrings = freeDates.map(function(e) { return e.toDateString(); });

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