function checkAvailability(event) {
  var calendar = CalendarApp.getDefaultCalendar();
  
  if(event.recurrenceBool == "No")
  {
    if(calendar.getEvents(event.start, event.end).length > 0)
    {
      sendEmail(event, "Unfortunately your request has been denied due to a conflict with another event.");
      return false;
    }
    else { return true; }
  }
  else
  {
    var availabilityObj = {availability: "",
                           busyDates: [],
                           availableDates: []};
//    availabilityObj.availability = "full";
    
    if (event.recurrenceType == "Weekly (Same day every week)" || event.recurrenceType == "Biweekly (Same day every two weeks)")
    {
      var msOffset = event.recurrenceType == "Weekly (Same day every week)"? 7*24*60*60*1000 : 14*24*60*60*1000;
      
      var startDate = event.start;
      var endDate = event.end;
      var stopDay = new Date(CacheService.getScriptCache().get("stopDayDate"));
      
      while(startDate < stopDay)
      {
        if(calendar.getEvents(startDate, endDate).length > 0) { availabilityObj.busyDates.push(startDate); }
        else { availabilityObj.availableDates.push(startDate); }
        
        if (availabilityObj.busyDates.length == 0) { availabilityObj.availability = "full"; }
        else if (availabilityObj.availableDates.length == 0) 
        { 
          availabilityObj.availability = "none"; 
          sendEmail(event, "no availability for your event");
          return false;
        }
        else { availabilityObj.availability = "partial"; }
        
        startDate = new Date(startDate.getTime() + msOffset);
      }
    }
    
    else if (event.recurrenceType == "Monthly (Same date every month)")
    {
      var startDate = event.start;
      var endDate = event.end;
      var stopDay = new Date(CacheService.getScriptCache().get("stopDayDate"));
            
    }
    
    return availabilityObj;
  }
}
