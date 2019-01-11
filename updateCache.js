/*
* Updates the cached value for the stop day date by fetching it from the KU Registrar's webpage. Welcome to the
* biggest and most probable point of failure in this whole app. Will need to be fixed if the registrar.ku.edu
* decides to change their layout.
*/
function updateCache() {
    var url = "";
    var registrarPage = "";
    var cache = CacheService.getScriptCache();
    var TWO_DAYS = 48 * 60 * 60 * 1000; //ms 

    var now = new Date();
    var semester = "";
    var year = now.getFullYear();

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 1: Figure out what semester is going on based on the month of the year
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (now.getMonth() >= 0 && now.getMonth() <= 4) {
        semester = "spring";
    } else if (now.getMonth() >= 7 && now.getMonth() <= 11) {
        semester = "fall";
    } else {
        cache.put("stopDayDate", null, 6 * 60 * 60);
        return;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 2: Get the KU registrar academic calendar for that semester
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    url = "https://registrar.ku.edu/" + semester + "-" + year + "-academic-calendar-date";
    try {
        registrarPage = UrlFetchApp.fetch(url).getContentText(); //get the entire HTML document tree for the webpage
        
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 3: Figure out when the first day of classes and stop day are from that webpage
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var start = new Date(findDate(registrarPage, "First day of classes"));
        start = new Date(start.getTime() - TWO_DAYS); // offset start by two days so people can submit requests two days before classes start
        
        var end = new Date(findDate(registrarPage, "Stop Day"));
    } catch(e) {
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 3.1: Handle errors if step 3, or 2 for that matter, go sideways
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Uh oh...
        var errorMessage = "There was an error updating the stop day cache for the Rec Room reservation script. The error details are as follows:\n\n"+
        e+"\n\nPlease manually update the cache to allow the script to run without further errors.";

        GmailApp.sendEmail("stephensonscholhall52@gmail.com", "Error updating script cache", errorMessage);
        cache.put("stopDayDate", "ERROR", 6 * 60 * 60);
        return;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 4: Update the cached value for the stop day date if a semester is actively underway
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (now >= start && now <= end) {
        // If school is in session update the stop day date
        cache.put("stopDayDate", end, 6 * 60 * 60);
    } else {
        cache.put("stopDayDate", null, 6 * 60 * 60);
    }

}

/*
* Finds the date for a given label in the KU registrar's academic calendar webpage. Will have to fix this function if the 
* registrar's webpage changes.
*/
function findDate(webpage, label) {

    // I learned how to write a regex (spent 2 whole hours of my life on that shit) so I could figure this out.
    // I still don't entirely know how to do it, I quit as soon as I had gained the very basic knowledge of regex
    // required to get this done.
    var regex = new RegExp('[\\w\\s,]+</td>\\s+<td[^<]*>'+label+'</td>');
    var partial = webpage.match(regex); // Found a match but it's got gross HTML tags attached to it!

    if (partial == null) {
        throw new Error("Couldn't find date on webpage"); // But what if you didn't find a match?
    } else {
        var date = partial[0].substring(0, partial[0].indexOf('</td>')); // Get rid of the aforementioned HTML tags
        return date;
    }
}
