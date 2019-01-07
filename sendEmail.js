function sendEmail(eventObj, reply) {
    var eventArr = Object.keys(eventObj).map(function (e) {
        return eventObj[e];
    });
    eventArr[3] = eventArr[3].toLocaleString();
    eventArr[4] = eventArr[4].toLocaleString();
    
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
    GmailApp.sendEmail("stephensonscholhall52@gmail.com", subjectLine, "", {
        name: eventObj.organizer,
        replyTo: eventObj.organizerEmail,
        htmlBody: message
    });
    
    if (reply) {
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

function addLabel() {
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
    if (allLabels.indexOf(labelName) == -1) {
        label = GmailApp.createLabel(labelName);
    } else {
        label = GmailApp.getUserLabelByName(labelName);
    }

    try {
        var thread = GmailApp.search("subject: Rec Room Reservation Form", 0, 1)[0];
        Logger.log(thread.getFirstMessageSubject());
        label.addToThread(thread);
        Logger.log(thread.getLabels().map(function(e){e.getName();}));
    } catch (e) {
        Logger.log(e);
    }

    debugger;
}

function update() {
  CacheService.getScriptCache().put("stopDayDate", "Friday, May 10, 2019");
}