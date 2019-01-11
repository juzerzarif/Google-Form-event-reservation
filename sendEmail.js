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
    eventArr[3] = eventArr[3].toLocaleString();
    eventArr[4] = eventArr[4].toLocaleString();
    if (eventObj.hasOwnProperty("monthRecurrence")) {
        var monthRecurrenceArr = eventObj.monthRecurrence;
        monthRecurrenceArr.some(function(day, i) {
            if (day != null) {
                eventArr[7] = monthRecurrenceMap[i] + " " + day;
                return true;
            }
        });
    }

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

    var subjectLine = "Rec Room Reservation Form" + (reply ? " - Auto-reply" : " - Action required");
    if(scriptError) {
        subjectLine = "Rec Room Reservation Form - Action required";
    }

    GmailApp.sendEmail("stephensonscholhall52@gmail.com", subjectLine, "", {
        name: eventObj.organizer,
        replyTo: eventObj.organizerEmail,
        htmlBody: message
    });
    
    addRecRoomLabel();
    
    if (reply) {
        reply = "Hello " + event.organizer + ",\n\n" + reply;
        reply += 
        "\n\nExecutive Board"+
        "\nStephenson Scholarship Hall"+
        "\nUniversity of Kansas"+
        "\n~Ut Lyle Vivat~"+
        "\n\nThe president, vice-president, and social chairs of Stephenson Scholarship Hall hold the right to revoke all rec room reservations at any time without prior notice.";
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

function addRecRoomLabel() {
    var now = new Date();
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
  debugger;
    if (allLabels.indexOf(labelName) == -1) {
        label = GmailApp.createLabel(labelName);
    } else {
        label = GmailApp.getUserLabelByName(labelName);
    }

    try {
        var thread = GmailApp.search("subject: Rec Room Reservation Form", 0, 1)[0];
        Logger.log(thread.getFirstMessageSubject());
        thread.addLabel(label);
        Logger.log(thread.getLabels().map(function(e){e.getName();}));
    } catch (e) {
        Logger.log(e);
    }

}