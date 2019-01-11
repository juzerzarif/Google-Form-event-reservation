/*
* Updates script properties for daylight savings time
* daylightSavingsDate = date when daylight savings kicks on/off (2nd Sunday of Mar, 1st Sunday of Nov)
* daylightSavingsOffset = is +-1 depending on whether an hour is supposed to be added or subtracted 
*/
function updateProperties() {
    var properties = PropertiesService.getScriptProperties();
    var now = new Date();
    var daylightSavings;
    var daylightOffset;

    if (now.getMonth() < 5) { //March
        daylightOffset = -1;
        daylightSavings = new Date(now.getFullYear(), 2, 1, 2);
        var initialOffset = daylightSavings.getDay() != 0? (7 - daylightSavings.getDay()) : 0; //get to the first Sunday of the month
        var offset = 7 + initialOffset; //add 7 to get to the second Sunday

        daylightSavings = new Date(daylightSavings.getTime() + (offset * GLOBAL.DAY));
        
    } else { //November
        daylightOffset = 1;
        daylightSavings = new Date(now.getFullYear(), 10, 1, 2);
        var offset = daylightSavings.getDay() != 0? (7 - daylightSavings.getDay()) : 0;

        daylightSavings = new Date(daylightSavings.getTime() + (offset * GLOBAL.DAY));
    }
    
    properties.setProperty("daylightSavingsDate", daylightSavings.toUTCString());
    properties.setProperty("daylightSavingsOffset", daylightOffset);
}