# Sporty

Deployed on Heroku at [Sporty](https://sporto-app.herokuapp.com/)

This is a web app I created to help with my job at the YMCA, specifically with the youth sports leagues I run there.  I found that as league registration increased, the number of teams increased, and scheduling games manually was becoming complicated.  In addition, I didn't have a good way of tracking game results, and it was always a scramble at the end of the season to determine final rankings for seeding tournaments.

So, I came up with the idea for this app.  The main function of it is to solve the two problems mentioned above.  Unregistered users are able to generate a season schedule based on number of teams and number of games, but they cannot save the season for tracking purposes.  All saved seasons must also be tied to an organization.  Registered users can have various permission levels:  super admins who can create and edit all organizations, seasons, and users.  Local admins who can edit their own organization, create and edit seasons for their organization, and edit user permissions for their organization.  And local editors who can create and edit seasons for their organization.  Any registered user can create an organization and will automatically become that organization's admin.  Super admins can also create organizations and assign users admin privileges for that organization.

Anyone with organizational permissions can create a season either through the season generator, or by manually entering the games.  Teams can be either named manually, or assigned numbered names like Team 1, Team 2, etc.  Teams can also be assigned a color, which will show up as the team's background color in rankings and games.  Once a season has been saved, it can be viewed by anybody.  So it is also a good way for youth athletes and their parents to check schedules and results.  In order to find a season, outside of a direct link, it can also be found under the associated organization.  Any user associated with any organizations has a My Organizations tab on their homepage, which will bring up a list of the organizations they are associated with, along with an icon showing their permission level for each organization.  Also, anyone can search for an organization, with the search results returning up to the ten closest results.  Once under the correct organization, hit the View Seasons tab to see a list of links to each season associated with the organization.

Following the link to a season will show a list of teams and each team's record, ordered by overall ranking.  Under the list of teams is the list of games, including who is playing, each team's score if applicable, date, time, location, and any notes.  Clicking on a team at the top of the page will show only the games that that team plays in.  Users with editing permissions can quickly pull up their season, scroll down to the appropriate game, and add the score as each game is played in real time.

A sample account does exist for anyone who would like to play around with the editing functionality.  To log in, use the following credentials:  
Email: sample@sporty.com  
Password:  SportySample23

**Update 11/16/22**
Added tournament feature.  Users with editing permissions can go into a completed (or in progress) season and hit a tournament create button, and a single elimination tournament will be automatically generated and seeded based on the current team rankings for that season.  If user chooses to save the tournament to the database, they can then add scores to the tournament games and subsequent rounds will be automatically populated, all the way up to the tournament winner.  Tournaments for an organization are listed alongside that organization's seasons.

---

## Tech
The frontend was built using hooks based React, initialized with Create React App.  Styling and responsiveness are done primarily using React Bootstrap, along with some pretty basic CSS files.

The backend is also deployed on Heroku.  The backend was built using Node.js with Express, with a PostgreSQL database.  Backend files are available at [Sporty-backend](https://github.com/bpruitt63/sporty-backend)

---

## TODOS
The backend *should be* complete, unless I find bugs or decide to add additional functionality.

The frontend **is not** complete.  I deployed early because I wanted to run a private beta test on my spring youth soccer season.  However, frontend testing is still incomplete.  I also have some minor UI elements I want to improve before I'm ready to call it a fully working app.  One additional feature I would also like to add in the future is a function to use a completed season to automatically seed and schedule an end-of-season tournament.

**Updated 11/16/22**
The tournament feature has been added in its basic form.  I still intend to add the ability to choose tournament types other than single elimination, as well as the ability to create a tournament that is not associated with a specific season.