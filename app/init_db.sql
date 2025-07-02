CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pomodoro_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    duration INTEGER NOT NULL,
    planned_duration INTEGER NOT NULL,
    completed BOOLEAN NOT NULL,
    date DATE DEFAULT (date('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_date_id ON pomodoro_sessions(date);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON pomodoro_sessions(user_id);
