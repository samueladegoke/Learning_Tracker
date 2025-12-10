-- Recreate Standard Schema (Matching models.py and Local SQLite)

-- Drop tables
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS user_challenges CASCADE;
DROP TABLE IF EXISTS user_inventory CASCADE;
DROP TABLE IF EXISTS user_task_statuses CASCADE;
DROP TABLE IF EXISTS user_quests CASCADE;
DROP TABLE IF EXISTS quiz_results CASCADE;
DROP TABLE IF EXISTS reflections CASCADE;
DROP TABLE IF EXISTS quest_tasks CASCADE;
DROP TABLE IF EXISTS quests CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS weeks CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Tables

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    gold INTEGER DEFAULT 0,
    focus_points INTEGER DEFAULT 5,
    focus_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hearts INTEGER DEFAULT 3,
    last_heart_loss TIMESTAMP,
    streak_freeze_count INTEGER DEFAULT 0,
    last_checkin_at TIMESTAMP,
    current_week INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE weeks (
    id SERIAL PRIMARY KEY,
    week_number INTEGER UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    focus VARCHAR(500),
    milestone VARCHAR(500),
    checkin_prompt TEXT
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(50) UNIQUE NOT NULL,
    week_id INTEGER NOT NULL REFERENCES weeks(id),
    day VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50),
    xp_reward INTEGER DEFAULT 10,
    badge_reward VARCHAR(50),
    difficulty VARCHAR(20) DEFAULT 'normal',
    category VARCHAR(20) DEFAULT 'weekly',
    due_date TIMESTAMP,
    is_boss_task BOOLEAN DEFAULT FALSE
);

-- (Adding other tables minimal structure if needed, or relying on them being empty)
-- Recreating strict dependencies

CREATE TABLE user_task_statuses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    task_id INTEGER NOT NULL REFERENCES tasks(id),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP
);

CREATE TABLE reflections (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    week_id INTEGER NOT NULL REFERENCES weeks(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT 'Standard Schema created' as status;
