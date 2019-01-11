/*
* Creates an event or EventSeries in the default calendar given an event and an availability object for that event
*/
function createEvent(event, avObj) {
    var calendar = CalendarApp.getDefaultCalendar();
    var eventName = "["+event.organizer.split(" ")[0]+"] "+event.name;
    var daylightDate = new Date(PropertiesService.getScriptProperties().getProperty("daylightSavingsDate")); //yay...
    
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
        //creating the EventSeries
        var seriesId = calendar.createEventSeries(eventName, event.start, event.end, recurrence, {description: event.description}).getId();
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // If you thought that the RecurrenceRule object accounts for daylight savings time because Google is a    //
        // software giant and would never leave a silly bug like this in their function, you'd be wrong (it's not  // 
        // that big a bug, I'm just bitching because I had to fix it). This if block works towards fixing that.    //
        // What happens is that it doesn't account for daylight savings but only in March/November, it works just  //
        // fine for every other month. So I just go in and manually fix all the events that fall in those months.  //
        // The events will still retain their id which means they are still part of the event series and retain    // 
        // all the conveniences that come with that.                                                               //
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (startDate < daylightDate) {
            var toFixDates = freeDates.filter(function(date) { return date.getMonth() == daylightDate.getMonth(); });
            
            for (var i=0; i<toFixDates.length; i++) {

                var eventList = calendar.getEventsForDay(toFixDates[i], {search: eventName});
                
                eventList.forEach(function(e) {  
                    if(e.getId() == seriesId) {
                        var start = toFixDates[i]; // I'm using the date from the array in the availability object because 
                                                   // we already accounted for daylight savings in checkAvailability
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