function saveFormResponses(items) {
    var event = {};

    var eventStart = items[3].getResponse();
    var eventEnd = items[4].getResponse();

    event.organizer = items[0].getResponse();
    event.organizerEmail = items[1].getResponse();
    event.name = items[2].getResponse();
    event.start = new Date(eventStart.replace(/-/g, "/"));
    event.end = new Date(eventEnd.replace(/-/g, "/"));
    event.recurrenceBool = items[5].getResponse();
    event.recurrenceType = items[6].getResponse();
    if (event.recurrenceType != RECURRENCE.option3) {
        event.description = items[7].getResponse();
        event.facilitiesBool = items[8].getResponse();
        event.facilitiesDescription = items[9].getResponse();
    } else {
        event.monthRecurrence = items[7].getResponse();
        event.description = items[8].getResponse();
        event.facilitiesBool = items[9].getResponse();
        event.facilitiesDescription = items[10].getResponse();
    }
    return event;
}