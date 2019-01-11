/*
* Sends an email with the event details to the stephenson email and also sends a reply if that parameter is specified
*/
function sendEmail(eventObj, reply, scriptError) {
    var monthRecurrenceMap = {
        0: "First",
        1: "Second",
        2: "Third",
        3: "Fourth",
        4: "Last"
    }
    
    var eventArr = Object.keys(eventObj).map(function (e) {
        return eventObj[e];
    });
    eventArr[3] = eventArr[3].toLocaleString(); // Converting the start and end dates from Date objects to Strings
    eventArr[4] = eventArr[4].toLocaleString();

    // Converting the repsonse from the month recurrence multiple choice grid to a String that makes sense
    if (eventObj.hasOwnProperty("monthRecurrence")) {
        var monthRecurrenceArr = eventObj.monthRecurrence;
        monthRecurrenceArr.some(function(day, i) {
            if (day != null) {
                eventArr[7] = monthRecurrenceMap[i] + " " + day;
                return true;
            }
        });
    }
    
    // An array with the question titles used in the form
    var titleArr = Object.keys(eventObj).map(function (e) {
        return GLOBAL.itemTitles[e];
    });

    var message = "<table style='border-collapse: collapse; border: 1px solid black' cellpadding='5'>";

    for (i = 0; i < titleArr.length; i++) {
        message += "<tr>";
        message += "<td style='border: 1px solid black'><b>" + titleArr[i] + " :</b></td>"
        message += "<td style='border: 1px solid black'> " + eventArr[i] + "</td>";
        message += "</tr>";
    }
    message += "</table>";

    var subjectLine = "Rec Room Reservation Form" + (reply ? " - Auto-reply" : " - Action required"); // #ternaryOperatorSquad
    // If there is a script error, action is always required
    if(scriptError) {
        subjectLine = "Rec Room Reservation Form - Action required";
    }

    GmailApp.sendEmail("stephensonscholhall52@gmail.com", subjectLine, "", {
        name: eventObj.organizer,
        replyTo: eventObj.organizerEmail,
        htmlBody: message
    });
    
    addRecRoomLabel(); // I don't know if this actually helps with Inbox management but eh...
    
    if (reply) {
        reply = "Hello " + event.organizer + ",\n\n" + reply; // I've been expecting you...
        reply += 
        "\n\nExecutive Board"+
        "\nStephenson Scholarship Hall"+
        "\nUniversity of Kansas"+
        "\n~Ut Lyle Vivat~"+
        "\n\nThe president, vice-president, and social chairs of Stephenson Scholarship Hall hold the right to revoke all rec room reservations at any time without prior notice.";
        try {
            Utilities.sleep(5000); // wait just in case, I mean email IS a best effort service
            var emailThreads = GmailApp.search("subject: Rec Room Reservation Form", 0, 1); // starting from the most recent (0), search for 1 thread that meets the search criteria
            var mostRecentEmail = emailThreads[0]; 
            mostRecentEmail.reply(reply);
        } catch (e) {
            Logger.log(e);
            doc_log(e);
            var errMessage = "There was an error while sending an auto reply in the Rec Room Reservation app. The error details are as follows:\n\n" + e;
            GmailApp.sendEmail("stephensonscholhall52@gmail.com", "Error in sendEmail - Rec Room Form app", errMessage); 
            return;
        }
    }
}

/*
* Adds the year appropriate 'Rec Room Reservation Requests/20XX-XX' label to the most recent request email 
*/
function addRecRoomLabel() {
    var now = new Date();

    // Figure out which academic year we're in
    var yearLabel;
    if (now.getMonth() < 5) {
        yearLabel = (now.getFullYear() - 1) + "-" + (now.getFullYear() % 100);
    } else {
        yearLabel = now.getFullYear() + "-" + ((now.getFullYear() + 1) % 100);
    }
    var labelName = "Rec Room Reservation Requests/" + yearLabel;

    var allLabels = GmailApp.getUserLabels().map(function (e) {
        return e.getName();
    });

    var label;
    if (allLabels.indexOf(labelName) == -1) {
        // If the label doesn't already exist make a new one. Also means this is the first reservation request of the year
        // and that people actually used this thing for more than the one semester I made them do it.
        label = GmailApp.createLabel(labelName);
    } else {
        // If label already exists, just cool I guess...
        label = GmailApp.getUserLabelByName(labelName);
    }

    try {
        var thread = GmailApp.search("subject: Rec Room Reservation Form", 0, 1)[0]; //most recent email that satisfies the search criteria
        thread.addLabel(label); // this doesn't always work and I don't know why...
    } catch (e) {
        Logger.log(e);
        doc_log(e);
        var errMessage = "There was an error while adding a label to an email thread in the Rec Room Reservation app. The error details are as follows:\n\n" + e;
        GmailApp.sendEmail("stephensonscholhall52@gmail.com", "Error in addRecRoomlabel - Rec Room Form app", errMessage);
    }

}