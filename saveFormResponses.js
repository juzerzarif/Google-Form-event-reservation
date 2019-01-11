/*
* Saves the form responses in an event object given the ItemResponse array from the form
*/
function saveFormResponses(items) {
    var event = {};

    for (var i=0; i<items.length; i++) {
        var propName = (_.invert(GLOBAL.itemTitles))[items[i].getItem().getTitle()]; // This is literally the only thing I loaded the Underscore library for
                                                                                     // because I'm lazy and didn't wanna write two objects that were just 
                                                                                     // inverses of each other. Probably should've found a lighter solution...
        event[propName] = items[i].getResponse();
    }

    event.start = new Date(event.start.replace(/-/g, "/")); // Converting the event start and end times from Strings to Date objects
    event.end = new Date(event.end.replace(/-/g, "/"));
  
    return event;
}
