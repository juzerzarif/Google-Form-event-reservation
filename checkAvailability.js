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
        
        var startDate = event.start;
        var endDate = event.end;
        var duration = endDate - startDate;
        var stopDay = new Date(CacheService.getScriptCache().get("stopDayDate"));
        var daylightDate = new Date(PropertiesService.getScriptProperties().getProperty("daylightSavingsDate"));
        var daylightOffset = PropertiesService.getScriptProperties().getProperty("daylightSavingsOffset") - 0; //typecasting as a number
        var availabilityObj = {
            availability: "",
            busyDates: [],
            availableDates: []
        };
                
        var daylightFixDone = false;

        while (startDate < stopDay) {
            
            if(calendar.getEvents(startDate, endDate).length > 0) {
                availabilityObj.busyDates.push(startDate);
            } else {
                availabilityObj.availableDates.push(startDate);
            }

            if (event.recurrenceType == RECURRENCE.option1 || event.recurrenceType == RECURRENCE.option2) {

                var msOffset = event.recurrenceType == RECURRENCE.option1 ? 7 * 24 * 60 * 60 * 1000 : 14 * 24 * 60 * 60 * 1000;
                startDate = new Date(startDate.getTime() + msOffset);

            } else if (event.recurrenceType == RECURRENCE.option3) {

                startDate = new Date(startDate.getFullYear(), startDate.getMonth()+1, 1, startDate.getHours(), startDate.getMinutes());
                var initialDay = startDate.getDay();
                var targetDay = 0;
                var weekOffset = 0;
                for (var i=0; i<event.monthRecurrence.length; i++) {
                    if (event.monthRecurrence[i] == null) { continue; }
                    var targetDay = dayMap[event.monthRecurrence[i]];
                    var weekOffset = i;
                    break;
                }
                var daysOffset = initialDay <= targetDay ? (targetDay - initialDay) : (7 - (initialDay - targetDay));
                startDate = new Date(startDate.getTime() + (daysOffset * 24 * 60 * 60 * 1000));
                
                if (weekOffset == 4) { //Last x of the month
                    var tempDate = startDate;
                    while (tempDate.getMonth() == startDate.getMonth()) {
                        startDate = new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000));
                    }
                    startDate = new Date(startDate.getTime() - (7 * 24 * 60 * 60 * 1000));
                } else {
                    startDate = new Date(startDate.getTime() + (weekOffset * 7 * 24 * 60 * 60 * 1000));
                }
            }

            if (event.start < daylightDate) {
                if (startDate > daylightDate) {
                    if (!daylightFixDone) {
                        startDate.setHours(startDate.getHours() + daylightOffset);
                        daylightFixDone = true;
                    }
                }
            }

            endDate = new Date(startDate.getTime() + duration);
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

        return availabilityObj;
    }
}

var dayMap = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
}
