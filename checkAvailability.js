function checkAvailability(event) {
    var calendar = CalendarApp.getDefaultCalendar();

    if (event.recurrenceBool == "No") {
        if (calendar.getEvents(event.start, event.end).length > 0) {
            sendEmail(event, "Unfortunately your request has been denied due to a conflict with another event.");
            return false;
        } else {
            return true;
        }
    } else {
        var availabilityObj = {
            availability: "",
            busyDates: [],
            availableDates: []
        };
        //    availabilityObj.availability = "full";

        if (event.recurrenceType == RECURRENCE.option1 || event.recurrenceType == RECURRENCE.option2) {
            var msOffset = event.recurrenceType == RECURRENCE.option1 ? 7 * 24 * 60 * 60 * 1000 : 14 * 24 * 60 * 60 * 1000;

            var startDate = event.start;
            var endDate = event.end;
            var stopDay = new Date(CacheService.getScriptCache().get("stopDayDate"));

            while (startDate < stopDay) {
                if (calendar.getEvents(startDate, endDate).length > 0) {
                    availabilityObj.busyDates.push(startDate);
                } else {
                    availabilityObj.availableDates.push(startDate);
                }

                startDate = new Date(startDate.getTime() + msOffset);
                endDate = new Date(endDate.getTime() + msOffset);
            }
            
            if (availabilityObj.busyDates.length == 0) {
                availabilityObj.availability = "full";
            } else if (availabilityObj.availableDates.length == 0) {
                availabilityObj.availability = "none";
                sendEmail(event, "Unfortunately your reservation request has been denied. Your event conflicts with another event every week."); //TODO: write a better email
                return false;
            } else {
                availabilityObj.availability = "partial";
            }

        } else if (event.recurrenceType == RECURRENCE.option3) {
            var startDate = event.start;
            var endDate = event.end;
            var duration = event.end - event.start;
            var stopDay = new Date(CacheService.getScriptCache().get("stopDayDate"));

            while (startDate < stopDay) {
                if(calendar.getEvents(startDate, endDate) > 0) {
                    availabilityObj.busyDates.push(startDate);
                } else {
                    availabilityObj.availableDates.push(startDate);
                }

                startDate = new Date(startDate.getFullYear(), startDate.getMonth()+1, 1, startDate.getHours(), startDate.getMinutes());
                var n = startDate.getDay();
                var T = 0;
                var j = 0;
                for (var i=0; i<event.monthRecurrence.length; i++) {
                    if (event.monthRecurrence[i] == null) { continue; }
                    var T = dayMap[event.monthRecurrence[i]];
                    var j = i;
                    break;
                }
                var x = n <= T ? (T - n) : (7 - (n - T));
                startDate = startDate + (x * 24 * 60 * 60 * 1000);
                
                if (j == 4) {
                    var tempDate = startDate;
                    while (tempDate.getMonth() == startDate.getMonth()) {
                        startDate = startDate + (7 * 24 * 60 * 60 * 1000);
                    }
                    startDate = startDate - (7 * 24 * 60 * 60 * 1000);
                } else {
                    startDate = startDate + (j * 7 * 24 * 60 * 60 * 1000);
                }
                endDate = startDate + duration;
            }
        } 

        return availabilityObj;
    }
}
