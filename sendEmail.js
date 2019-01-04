//  0 = Name
//  1 = Email
//  2 = Event Name
//  3 = Event Start
//  4 = Event End 
//  5 = Is this a recurring event
//  6 = If so, explain the nature of recurrence
//  7 = Event Description
//  8 = Will you be using Rec Room facilities
//  9 = What facilities?

var itemTitles = {
    organizer: "Name",
    organizerEmail: "Email",
    name: "Event Name",
    start: "Event Start",
    end: "Event End",
    recurringBool: "Is this a recurring event?",
    recurringType: "If answered yes above, explain the nature of recurrence",
    monthRecurrence: "Monthly recurrence details",
    description: "Event Description",
    facilitiesBool: "Will you be using any of the facilities in the Rec Room?",
    facilitiesDescription: "If answered yes above, explain how and what facilities you will be using?"
};

function sendEmail(eventObj, reply) {
    var eventArr = Object.keys(eventObj).map(function (e) {
        return eventObj[e];
    });
    eventArr[3] = eventArr[3].toLocaleString();
    eventArr[4] = eventArr[4].toLocaleString();
    var titleArr = Object.keys(itemTitles).map(function (e) {
        return itemTitles[e];
    });

    var message = "<table style='border-collapse: collapse; border: 1px solid black' cellpadding='5'>";

    for (i = 0; i < titleArr.length; i++) {
        message += "<tr>";
        message += "<td style='border: 1px solid black'><b>" + titleArr[i] + " :</b></td>"
        message += "<td style='border: 1px solid black'> " + eventArr[i] + "</td>";
        message += "</tr>";
    }
    message += "</table>";

    var subjectLine = "Rec Room Reservation Form" + (reply ? " - Auto-reply" : " - Action required");
    GmailApp.sendEmail("stephensonscholhall52@gmail.com", subjectLine, "", {
        name: eventObj.organizer,
        replyTo: eventObj.organizerEmail,
        htmlBody: message
    });

    if (reply) {
        reply += 
        "\nExecutive Board"+
        "\nStephenson Scholarship Hall"+
        "\nUniversity of Kansas"+
        "\n~Ut Lyle Vivat~"+
        "\n\nThe president, vice-president, and social chairs of Stephenson Scholarship Hall hold the right to revoke this reservation at any time without prior notice.";
        try {
            Utilities.sleep(5000);
            var emailThreads = GmailApp.search("subject: Rec Room Reservation Form", 0, 1);
            var mostRecentEmail = emailThreads[0];
            mostRecentEmail.reply(reply);
        } catch (e) {
            Logger.log(e);
            return;
        }
    }
}

var event1 = {
    organizer: "Juzer Zarif",
    organizerEmail: "juzerapj@gmail.com",
    name: "Test Event",
    start: new Date(),
    end: new Date(),
    recurringBool: "Is this a recurring event?",
    recurringType: "If answered yes above, explain the nature of recurrence",
    description: "Event Description",
    facilitiesBool: "Will you be using any of the facilities in the Rec Room?",
    facilitiesDescription: "If answered yes above, explain how and what facilities you will be using?"
};

function update() {
  CacheService.getScriptCache().put("stopDayDate", "Friday, May 10, 2019");
}