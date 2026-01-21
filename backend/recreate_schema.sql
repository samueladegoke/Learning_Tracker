-- Recreate weeks table matching local SQLite schema
CREATE TABLE weeks (
    id SERIAL PRIMARY KEY,
    week_number INTEGER UNIQUE NOT NULL,
    label VARCHAR NOT NULL,
    notes TEXT
);

-- Recreate tasks table matching local SQLite schema
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(50) UNIQUE NOT NULL,
    week_number INTEGER NOT NULL,  
    calendar_slot VARCHAR(20) NOT NULL,
    bootcamp_days JSONB,           -- Using JSONB for better performance/querying
    bootcamp_day_titles JSONB,
    type VARCHAR(50),
    xp_reward INTEGER DEFAULT 10,
    description TEXT
    -- Removed incompatible columns: badge_reward, difficulty, category, due_date, is_boss_task
);

-- Recreate other tables needed for the app to function
-- (Users, Badges, etc. - keeping these standard for now but ensuring compatibility)

-- Users table (standard)
CREATE TABLE IF NOT EXISTS users (
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

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    badge_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    xp_value INTEGER DEFAULT 0,
    difficulty VARCHAR(20) DEFAULT 'normal'
);

-- User Badges (Join table)
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    badge_id INTEGER NOT NULL REFERENCES badges(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Tasks Status
CREATE TABLE IF NOT EXISTS user_task_statuses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    task_id INTEGER NOT NULL REFERENCES tasks(id), -- Note: references tasks.id (integer), not tasks.task_id (string)
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP
);

-- Reflections
CREATE TABLE IF NOT EXISTS reflections (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    week_id INTEGER, -- Keeping generic week_id ref, but wait - weeks now has id
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT 'Schema recreated successfully' as status;
