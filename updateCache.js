function updateCache() {
    var url = "";
    var registrarPage = "";
    var cache = CacheService.getScriptCache();
    var TWO_DAYS = 48 * 60 * 60 * 1000; //ms 

    var now = new Date();
    var semester = "";
    var year = now.getFullYear();

    if (now.getMonth() >= 0 && now.getMonth() <= 4) {
        semester = "spring";
    } else if (now.getMonth() >= 7 && now.getMonth() <= 11) {
        semester = "fall";
    } else {
        cache.put("stopDayDate", null, 6 * 60 * 60);
        return;
    }
    
    url = "https://registrar.ku.edu/" + semester + "-" + year + "-academic-calendar-date";
    try {
        registrarPage = UrlFetchApp.fetch(url).getContentText();
        
        var start = new Date(findDate(registrarPage, "First day of classes"));
        start = new Date(start.getTime() - TWO_DAYS);
        
        var end = new Date(findDate(registrarPage, "Stop Day"));
    } catch(e) {
        var errorMessage = "There was an error updating the stop day cache for the Rec Room reservation script. The error details are as follows:\n\n"+
        e+"\n\nPlease manually update the cache to allow the script to run without further errors.";

        GmailApp.sendEmail("stephensonscholhall52@gmail.com", "Error updating script cache", errorMessage);
        cache.put("stopDayDate", "ERROR", 6 * 60 * 60);
        return;
    }

    if (now >= start && now <= end) {
        cache.put("stopDayDate", end, 6 * 60 * 60);
    } else {
        cache.put("stopDayDate", null, 6 * 60 * 60);
    }

}

function findDate(webpage, label) {
    var regex = new RegExp('[\\w\\s,]+</td>\\s+<td[^<]*>'+label+'</td>');
    var partial = webpage.match(regex);

    if (partial == null) {
        throw new Error("Couldn't find date on webpage");
    } else {
        var date = partial[0].substring(0, partial[0].indexOf('</td>'));
        return date;
    }
}
