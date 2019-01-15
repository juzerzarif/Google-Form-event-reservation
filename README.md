# Create a Google Calendar event automatically from a Google Form

Note: If you are here because you live in Stephenson and something has gone wrong and you are trying to figure out how to fix it, please see the wiki.

Hi all! This is a sweet script that will let you automatically create a Google Calendar event when someone submits a Google Form. But there's like a million of these apps on the internet so why would I make my own script and waste my time. Two reasons: 
- My time is worthless and I have boat loads of it
- I wanted something that could create recurring events and then I added a couple little special features for my specific use case (I'll go more into it later)

[](form.gif)

So as I said before, the main feature I was looking for was the ability to add recurring events from a form and none of the solutions I found really offered that. Another detail you may notice when you look at the form is that it doesn't specify when to stop the recurring events - now that is because of my use case of this script. I've primarily created this script so we can use it to reserve the rec room in the on campus housing facility where I live on KU's campus, Stephenson Scholarship Hall. So anyone that wants a recurring event wants it to recur till the end of the semester (Stop Day) and so asking people to specify that date seemed kind of user-unfriendly(? Is that a phrase?). But I also can't hardcode the value in unless I plan on updating the script every semester which I don't plan to do (I'm lazy and I'm graduating) so I need to somehow update that value automatically. This is done by the function `updateCache` in the file of the same name. I use the script cache to store the Stop Day date which I fetch from the KU registrar's academic calendar webpage - this updates every 6 hours mostly because that's the maximum amount of time before a cache expires. 

If you need to fetch a date from a different source, you can update the function `updateCache` to work for you or you can simplify your script by straight up asking for the recurrence end date in the form itself (you'll obviously need to adapt the code to do that). So this isn't really a ready-to-go add-on which is also why I haven't published it as one but rather a showcase of how I fixed a problem I had in the hope that it may help someone else one day.  