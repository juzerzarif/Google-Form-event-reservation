var _ = Underscore.load();

var GLOBAL = {
    
    itemTitles: {
        organizer: "Name",
        organizerEmail: "Email",
        name: "Event Name",
        start: "Event Start",
        end: "Event End",
        recurringBool: "Is this a recurring event?",
        recurringType: "Explain the nature of recurrence",
        monthRecurrence: "For monthly events, which day of the month would you like to repeat your event?",
        description: "Event Description",
        facilitiesBool: "Will you be using any of the facilities in the Rec Room?",
        facilitiesDescription: "If answered yes above, explain how and what facilities you will be using?"
    },

    dayMap: {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
    },

    RECURRENCE: {
        option1: "Weekly (Same day every week)",
        option2: "Biweekly (Same day every two weeks)",
        option3: "Monthly"
    }
}