from flask import Flask, redirect, render_template, request, session, flash
from flask_session import Session
from cs50 import SQL
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db = SQL("sqlite:///pomodoro.db")


@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    session.clear()

    if request.method == "POST":
        if not request.form.get("username"):
            flash("Please provide a username", "danger")
            return render_template("login.html")

        elif not request.form.get("password"):
            flash("Please provide a password", "danger")
            return render_template("login.html")

        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )

        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            flash("Invalid username or/and password", "danger")
            return render_template("login.html")

        session["user_id"] = rows[0]["id"]

        return redirect("/")

    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template("register.html")
    else:
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")
        if not username or not password or not confirmation:
            flash("Please provide provide all fields", "danger")
            return render_template("register.html")
        elif password != confirmation:
            flash("Passwords don't match", "danger")
            return render_template("register.html")

        try:
            hash = generate_password_hash(password, method='scrypt', salt_length=16)
            db.execute("INSERT into users (username, hash) VALUES (?, ?)", username, hash)
            return redirect("/login")
        except:
            flash("Username already taken", "danger")
            return render_template("register.html")


@app.route("/history")
def history():
    pomodoro_sessions = db.execute("""
        SELECT *
        FROM pomodoro_sessions
        WHERE user_id = ?
        ORDER BY start_time DESC
        """, session["user_id"])

    completed_sessions = 0
    total_minutes = 0
    for pomodoro in pomodoro_sessions:
        if pomodoro["completed"]:
            completed_sessions += 1
        total_minutes += pomodoro["duration"] / 60

    stats = {}
    if pomodoro_sessions:
        stats["total_sessions"] = len(pomodoro_sessions)
        stats["completed_sessions"] = completed_sessions
        stats["total_minutes"] = round(total_minutes, 1)

    return render_template("history.html", sessions=pomodoro_sessions, stats=stats)


@app.route("/save_session", methods=["POST"])
def save_session():
    if not session.get("user_id"):
        return {"success": False, "message": "Not logged in"}, 401

    try:
        data = request.get_json()

        db.execute("""
        INSERT INTO pomodoro_sessions (
            user_id,
            start_time,
            end_time,
            duration,
            planned_duration,
            completed
            ) VALUES (?, DATETIME('now', '-' || ? || ' seconds'), CURRENT_TIMESTAMP, ?, ?, ?)
        """, session["user_id"], data["duration"], data["duration"], data["planned_duration"], data["completed"])

        return {"success": True}
    except Exception as e:
        return {"success": False, "message": str(e)}, 500


@app.route("/delete_session", methods=["POST"])
def delete_session():
    if not session.get("user_id"):
        flash("Please log in to delete sessions", "danger")
        return redirect("/login")

    session_id = request.form.get("session_id")
    if not session_id:
        flash("Invalid session ID", "danger")
        return redirect("/history")

    try:
        check = db.execute("""
            SELECT *
            FROM pomodoro_sessions
            WHERE id = ? AND user_id = ?
        """, session_id, session["user_id"])

        if not check:
            flash("Session not found or not authorized", "danger")
            return redirect("/history")

        db.execute("""
            DELETE
            FROM pomodoro_sessions
            WHERE id = ?
        """, session_id)

        flash("Session deleted successfully", "success")
        return redirect("/history")
    except Exception as e:
        flash(f"An error occured: {str(e)}", "danger")
        return redirect("/history")

if __name__ == "__main__":
    app.run(debug=True)