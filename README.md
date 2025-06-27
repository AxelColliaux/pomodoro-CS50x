# POMODORO50
#### Video Demo:  [HERE](https://youtu.be/haus-YPrVOQ?si=x9Pdh46Nkty_QkFP)
#### Description:
The app allows users to manage their work and break time using the Pomodoro Technique, a time management method that promotes focus and productivity.

The principle is simple: alternate between periods of intense work (25 minutes by default) and short breaks (5 minutes by default). The application allows you to customize these durations and also offers the possibility of saving session history to track your progress over time

### The pomodoro main page :
- **Start/Resume** : Starts the timer for a work session or resumes counting after a pause.
- **Pause** : Allows you to temporarily pause the countdown without losing progress in the current session
- **Reset** : Completely stops the current session and resets the timer to its initial value. If a significant session was in progress (more than one minute), it is recorded in the history as "interrupted".
- **Settings** : Allows you to customize work and break durations according to user preferences. Durations are configurable in minutes, with a minimum of one minute for each phase.

#### User journey
Upon arrival, the user is greeted by a minimalist interface focused on the essentials: a large timer display, three control buttons (Start, Pause, Reset), and access to the settings. This intentional minimalism allows for immediate use without a learning curve.
The user can immediately start a work session by clicking the Start button, which will turn into a Resume button when paused. The current state (Focus or Break) is clearly indicated at the top of the screen, while the button states dynamically adapt to the context to intuitively guide the user. When a phase changes, a discreet visual notification informs the user without disturbing their concentration. For logged-in users, each session completed or interrupted generates a save confirmation message


### History page :
The History page provides a comprehensive and organized view of all recorded work sessions <br>
The history shows the following information:

- **A summary table** displaying for each session: the date, start time, actual duration (in minutes), planned duration and status (completed or interrupted).
- **Overall statistics** at the top of the page, including total number of sessions, number of sessions completed, and total working time (in minutes)
- The ability to **delete sessions** individually via a dedicated button
<br><br>
This page only records work sessions lasting more than one minute and does not take into account break times.

### User pages :
Even though the application can still be used without a user account, it still includes an authentication system allowing users to create and access their session history.

The features are as follows:

- **Registration** : Create an account with a unique username and secure password. Passwords are hashed to ensure data security.
- **Login**: Authentication to access personalized features, including session history
- **Logout**: Ability to log out

As I said, the application remains fully usable without an account for users who simply want to benefit from the Pomodoro timer <br>
Informative flash messages guide the user through each step of the authentication process and clearly indicate any errors (username already taken, incorrect password, etc.)

### Technical aspects and architecture
#### Technology Stack
The project relies on the following technologies:
- **Frontend** : HTML5, CSS3 with Bootstrap 5 for the responsive interface, and vanilla JavaScript for the client logic. The interface adapts perfectly to different screen formats thanks to a responsive design and the burger menu on mobile
- **Backend** : Python with the Flask framework, which provides a lightweight yet powerful framework for developing web applications. Flask-Session is used to manage user sessions
- **Datebase** : SQLite, une solution de base de données relationnelle légère
- **Security** : Hashing passwords with the scrypt algorithm, and validating user input on the server side.

#### Architecture
The application follows a simplified MVC (Model-View-Controller) structure:
- **Models** are represented by SQL queries that interact with the database
- **Views** are the Jinja2 templates that generate the HTML presented to the user.
- **Controllers** are the Flask routes that process requests and coordinate the interaction between models and views

### Evolutions :
Although already fully functional, the application could be enhanced with several additional features in the future :

- Integration of graphical visualizations in the history (charts, trends)
- A more advanced statistics system with work habit analysis
- Support for adding tasks associated with each Pomodoro session
- Audio and browser notifications
- Export of historical data in CSV or PDF format

### Difficulties :
Accurate time management proved complex, particularly in implementing a break system that accurately tracked actual work time. Calculating total time while taking interruptions into account posed many problems and bugs. Claude (Ai) was invaluable in identifying and fixing several subtle bugs in this mechanism, such as DOM element selection issues and errors in JavaScript event handling.

On the backend side, synchronization between the client and the server also posed challenges, particularly for reliably saving sessions to the database. Debugging AJAX requests and handling potential errors often benefited from claude's analysis of bugs, allowing for the rapid identification of inconsistencies in data formats or variable naming issues.
