
function saveFormResponses(items) {
    var event = {};

    for (var i=0; i<items.length; i++) {
        var propName = (_.invert(GLOBAL.itemTitles))[items[i].getItem().getTitle()];
        event[propName] = items[i].getResponse();
    }

    event.start = new Date(event.start.replace(/-/g, "/"));
    event.end = new Date(event.end.replace(/-/g, "/"));
  
    return event;
}
