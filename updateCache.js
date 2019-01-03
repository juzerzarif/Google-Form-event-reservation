function updateCache() {
    var url = "";
    var registrarPage = "";
    var cache = CacheService.getScriptCache();
    var TWO_DAYS = 48 * 60 * 60 * 1000; //ms 

    var now = new Date();
    var fallStart = new Date(now.getFullYear(), 7, 1);
    var fallEnd = new Date(now.getFullYear(), 11, 31);
    var springStart = new Date(now.getFullYear(), 0, 1);
    var springEnd = new Date(now.getFullYear(), 4, 31);

    var semester = "";
    var year = now.getFullYear();

    if (now > springStart && now < springEnd) {
        url = "https://registrar.ku.edu/spring-" + year + "-academic-calendar-date";
        registrarPage = UrlFetchApp.fetch(url).getContentText();
        springStart = new Date(findDate(registrarPage, "First day of classes"));
        springStart = new Date(springStart.getTime() - TWO_DAYS);
        springEnd = new Date(findDate(registrarPage, "Stop Day"));

        if (now >= springStart && now <= springEnd) {
            cache.put("stopDayDate", springEnd, 25 * 60 * 60);
        } else {
            cache.put("stopDayDate", null, 25 * 60 * 60);
        }

        return;
    } else if (now > fallStart && now < fallEnd) {
        url = "https://registrar.ku.edu/fall-" + year + "-academic-calendar-date";
        registrarPage = UrlFetchApp.fetch(url).getContentText();
        fallStart = new Date(findDate(registrarPage, "First day of classes"));
        fallStart = new Date(fallStart.getTime() - TWO_DAYS);
        fallEnd = new Date(findDate(registrarPage, "Stop Day"));

        if (now >= springStart && now <= springEnd) {
            cache.put("stopDayDate", fallEnd, 25 * 60 * 60);
        } else {
            cache.put("stopDayDate", null, 25 * 60 * 60);
        }

        return;
    } else {
        cache.put("stopDayDate", null, 25 * 60 * 60);
        return;
    }

}

function findDate(webpage, label) {
    var labelIndex = webpage.indexOf(label);
    var tagIndex = 0;
    var dateIndex = 0;

    var start = 0;
    var tempIndex = 0;
    while ((tempIndex = webpage.indexOf("</td>", start)) < labelIndex) {
        start = tempIndex + 5;
        tagIndex = tempIndex;
    }

    start = 0, tempIndex = 0;
    while ((tempIndex = webpage.indexOf(">", start)) < tagIndex) {
        start = tempIndex + 1;
        dateIndex = tempIndex + 1;
    }

    var date = webpage.substring(dateIndex, tagIndex);
    return date;
}


function blah() {
    CacheService.getScriptCache().put("stopDayDate", Friday, 10);
    //  Utilities.sleep(11000);
    Logger.log(CacheService.getScriptCache().get("stopDayDate"));
}