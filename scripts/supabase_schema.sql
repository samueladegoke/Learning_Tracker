-- Supabase Migration Schema
-- This script recreates the Learning Tracker schema in PostgreSQL

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Courses
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    sequence_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Weeks
CREATE TABLE IF NOT EXISTS weeks (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    week_number INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_weeks_course ON weeks(course_id);
CREATE INDEX IF NOT EXISTS idx_weeks_number ON weeks(week_number);

-- 3. Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    week_id INTEGER REFERENCES weeks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    task_type TEXT, -- "video", "exercise", "project", "quiz"
    difficulty TEXT, -- "easy", "medium", "hard"
    xp_reward INTEGER DEFAULT 10,
    estimated_minutes INTEGER DEFAULT 15,
    required_for_streak BOOLEAN DEFAULT TRUE,
    legacy_task_id TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tasks_week ON tasks(week_id);
CREATE INDEX IF NOT EXISTS idx_tasks_legacy_id ON tasks(legacy_task_id);

-- 4. Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    gold INTEGER DEFAULT 0,
    hearts INTEGER DEFAULT 3,
    focus_points INTEGER DEFAULT 5,
    focus_refreshed_at BIGINT,
    streak_freeze_count INTEGER DEFAULT 0,
    last_activity_date BIGINT,
    last_heart_loss BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);

-- 5. User Task Statuses
CREATE TABLE IF NOT EXISTS user_task_statuses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at BIGINT,
    UNIQUE(user_id, task_id)
);
CREATE INDEX IF NOT EXISTS idx_uts_user_task ON user_task_statuses(user_id, task_id);

-- 6. Badges
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    badge_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    xp_value INTEGER DEFAULT 0,
    difficulty TEXT DEFAULT 'normal'
);

-- 7. User Badges
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at BIGINT DEFAULT (extract(epoch from now()) * 1000),
    UNIQUE(user_id, badge_id)
);

-- 8. Achievements
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    achievement_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    xp_value INTEGER DEFAULT 0,
    difficulty TEXT DEFAULT 'normal'
);

-- 9. User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at BIGINT DEFAULT (extract(epoch from now()) * 1000),
    UNIQUE(user_id, achievement_id)
);

-- 10. Quests
CREATE TABLE IF NOT EXISTS quests (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    boss_hp INTEGER NOT NULL,
    reward_xp_bonus INTEGER DEFAULT 0,
    reward_badge_id TEXT
);

-- 11. User Quests
CREATE TABLE IF NOT EXISTS user_quests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    quest_id INTEGER REFERENCES quests(id) ON DELETE CASCADE,
    boss_hp_remaining INTEGER NOT NULL,
    started_at BIGINT NOT NULL,
    completed_at BIGINT
);
CREATE INDEX IF NOT EXISTS idx_uq_user ON user_quests(user_id);

-- 12. Quest Tasks
CREATE TABLE IF NOT EXISTS quest_tasks (
    id SERIAL PRIMARY KEY,
    quest_id INTEGER REFERENCES quests(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    UNIQUE(quest_id, task_id)
);

-- 13. Challenges
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    goal_count INTEGER NOT NULL,
    ends_at BIGINT,
    reward_badge_id TEXT,
    reward_item TEXT
);

-- 14. User Challenges
CREATE TABLE IF NOT EXISTS user_challenges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed_at BIGINT,
    UNIQUE(user_id, challenge_id)
);

-- 15. User Inventory
CREATE TABLE IF NOT EXISTS user_inventory (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL,
    item_key TEXT NOT NULL,
    quantity INTEGER DEFAULT 1
);

-- 16. Questions
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    quiz_id TEXT NOT NULL,
    question_type TEXT NOT NULL,
    text TEXT NOT NULL,
    code TEXT,
    options TEXT, -- JSON string or comma-separated
    correct_index INTEGER,
    starter_code TEXT,
    test_cases TEXT,
    solution_code TEXT,
    explanation TEXT,
    difficulty TEXT NOT NULL,
    topic_tag TEXT
);
CREATE INDEX IF NOT EXISTS idx_questions_quiz ON questions(quiz_id);

-- 17. User Question Reviews (SRS)
CREATE TABLE IF NOT EXISTS user_question_reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    interval_index INTEGER DEFAULT 0,
    due_date BIGINT NOT NULL,
    success_count INTEGER DEFAULT 0,
    is_mastered BOOLEAN DEFAULT FALSE,
    last_reviewed_at BIGINT,
    UNIQUE(user_id, question_id)
);
CREATE INDEX IF NOT EXISTS idx_uqr_user_due ON user_question_reviews(user_id, due_date);

-- 18. Quiz Results
CREATE TABLE IF NOT EXISTS quiz_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    quiz_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_qr_user ON quiz_results(user_id);

-- 19. Reflections
CREATE TABLE IF NOT EXISTS reflections (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    week_id INTEGER REFERENCES weeks(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sentiment TEXT,
    created_at BIGINT NOT NULL,
    updated_at BIGINT
);
CREATE INDEX IF NOT EXISTS idx_reflections_user_week ON reflections(user_id, week_id);
