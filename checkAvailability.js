/*
* Checks to see if there is availability for the event for every possible date (in case of recurring events)
* Returns true or false for non-recurring events. For recurring events, returns false if no dates are available
* and returns an availability object otherwise with info on available and busy dates
*/
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

        // The majority of my time designing this app was spent writing this gd while loop
        while (startDate < stopDay) {
            
            if(calendar.getEvents(startDate, endDate).length > 0) {
                availabilityObj.busyDates.push(startDate);
            } else {
                availabilityObj.availableDates.push(startDate);
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////// Increment startDate //////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Weekly and Biweekly recurring events
            if (event.recurrenceType == GLOBAL.RECURRENCE.option1 || event.recurrenceType == GLOBAL.RECURRENCE.option2) {

                var msOffset = event.recurrenceType == GLOBAL.RECURRENCE.option1 ? GLOBAL.WEEK : 2*GLOBAL.WEEK; //milliseconds between two recurring events
                startDate = new Date(startDate.getTime() + msOffset);

                //account for daylight savings time #fuckDaylightSavings
                if (!daylightFixDone && event.start < daylightDate && startDate > daylightDate) {
                    startDate.setHours(startDate.getHours() + daylightOffset);
                    daylightFixDone = true;
                }

            } 
            // Monthly recurring events
            else if (event.recurrenceType == GLOBAL.RECURRENCE.option3) {

                startDate = new Date(startDate.getFullYear(), startDate.getMonth()+1, 1, startDate.getHours(), startDate.getMinutes()); //first day of next month
                var initialDay = startDate.getDay();
                var targetDay = 0; //the day of the week we need to get to (First __________ of the month)
                var weekOffset = 0; //the week we need to get to (_______ Monday of the month)
                for (var i=0; i<event.monthRecurrence.length; i++) {
                    if (event.monthRecurrence[i] == null) { continue; }
                    var targetDay = GLOBAL.dayMap[event.monthRecurrence[i]];
                    var weekOffset = i;
                    break;
                }
                var daysOffset = initialDay <= targetDay ? (targetDay - initialDay) : (7 - (initialDay - targetDay)); //number of days we need to add to get to the first
                                                                                                                      //Monday/Tuesday/Wed... of the month. I use ternary operators
                                                                                                                      //because I hate people.
                startDate = new Date(startDate.getTime() + (daysOffset * GLOBAL.DAY));
                
                // Now we can just shift by how many ever weeks we need
                if (weekOffset == 4) { 
                    //Last ________ of the month (*special* case)
                    var tempDate = startDate;
                    while ((tempDate = new Date(startDate.getTime() + GLOBAL.WEEK)).getMonth() == startDate.getMonth()) {
                        startDate = new Date(tempDate.getTime() + GLOBAL.WEEK);
                    }
                } else { 
                    // First/Second/Third/Fourth ________ of the month
                    startDate = new Date(startDate.getTime() + (weekOffset * GLOBAL.WEEK));
                }

                // account for daylight savings time. Apparently you only need to do it in March/November and the Date object will take care of the other months
                // since we are using the default timezone (America/Chicago)
                if (!daylightFixDone && event.start < daylightDate && startDate.getMonth() == daylightDate.getMonth() && startDate > daylightDate) {
                    startDate.setHours(startDate.getHours() + daylightOffset);
                    daylightFixDone = true;
                }
            }

            endDate = new Date(startDate.getTime() + duration);
        }     

        // assign a value to the availability property in our return object. This will help later in createEvent.
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
