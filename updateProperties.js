function updateProperties() {
    var properties = PropertiesService.getScriptProperties();
    var now = new Date();
    var daylightSavings;
    var daylightOffset;

    if (now.getMonth() < 5) {
        daylightOffset = -1;
        daylightSavings = new Date(now.getFullYear(), 2, 1, 2);
        var initialOffset = daylightSavings.getDay() != 0? (7 - daylightSavings.getDay()) : 0;
        var offset = 7 + initialOffset;

        daylightSavings = new Date(daylightSavings.getTime() + (offset * 24 * 60 * 60 * 1000));
        
    } else {
        daylightOffset = 1;
        daylightSavings = new Date(now.getFullYear(), 10, 1, 2);
        var offset = daylightSavings.getDay() != 0? (7 - daylightSavings.getDay()) : 0;

        daylightSavings = new Date(daylightSavings.getTime() + (offset * 24 * 60 * 60 * 1000));
    }
    
    properties.setProperty("daylightSavingsDate", daylightSavings.toUTCString());
    properties.setProperty("daylightSavingsOffset", daylightOffset);
}