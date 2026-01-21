-- Seed weeks (Standard Schema + ZERO EMOJI ENFORCED)
INSERT INTO weeks (id, week_number, title, focus, milestone, checkin_prompt) 
    VALUES (1, 1, 'Week 1  Bootcamp Days 111', 'Review-heavy week (you may batch 23 bootcamp days per study session).', NULL, NULL);
INSERT INTO weeks (id, week_number, title, focus, milestone, checkin_prompt) 
    VALUES (2, 2, 'Week 2  Bootcamp Days 1225', 'Review-heavy week (you may batch 23 bootcamp days per study session). OOP Coffee/Quiz days get slightly more focus.', NULL, NULL);
INSERT INTO weeks (id, week_number, title, focus, milestone, checkin_prompt) 
    VALUES (3, 3, 'Week 3  Bootcamp Days 2635', 'Review-heavy but transitioning to more complex GUI + API work. Still 2 bootcamp days per study session.', NULL, NULL);
INSERT INTO weeks (id, week_number, title, focus, milestone, checkin_prompt) 
    VALUES (4, 4, 'Week 4  Bootcamp Days 3645', 'Mixed week: regular pace (mostly 2 bootcamp days per study session). Focus on APIs, automation, and first larger data/HTML projects.', NULL, NULL);
INSERT INTO weeks (id, week_number, title, focus, milestone, checkin_prompt) 
    VALUES (5, 5, 'Week 5  Bootcamp Days 4655', 'Mixed week: regular pace (~2 bootcamp days per study session). Focus on scraping + Selenium bots + Flask intro.', NULL, NULL);
INSERT INTO weeks (id, week_number, title, focus, milestone, checkin_prompt) 
    VALUES (6, 6, 'Week 6  Bootcamp Days 5665', 'Heavy project week: advanced Flask/web; keep pace at ~2 bootcamp days per study session, no 3-day batches.', NULL, NULL);
INSERT INTO weeks (id, week_number, title, focus, milestone, checkin_prompt) 
    VALUES (7, 7, 'Week 7  Bootcamp Days 6675', 'Heavy project week: REST APIs, auth, multi-user blogs, and data science intro. Still ~2 bootcamp days per session.', NULL, NULL);
INSERT INTO weeks (id, week_number, title, focus, milestone, checkin_prompt) 
    VALUES (8, 8, 'Week 8  Bootcamp Days 7680', 'Capstone & portfolio week: 1 bootcamp day per session with extra time for polishing and reflection.', NULL, NULL);

-- Seed tasks (Standard Schema + ZERO EMOJI ENFORCED)
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w1-d1', 1, 'Day 1', 'Complete bootcamp Day(s) 1, 2, 3: Working with Variables; Data Types & Strings; Control Flow & Logical Operators + projects (Band Name Generator, Tip Calculator, Treasure Island).', 'review', 15, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w1-d2', 1, 'Day 2', 'Complete bootcamp Day(s) 4, 5: Randomisation & Lists (Rock, Paper, Scissors) and Loops (Password Generator).', 'review', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w1-d3', 1, 'Day 3', 'Complete bootcamp Day(s) 6, 7: Functions & Karel maze; Hangman game.', 'review', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w1-d4', 1, 'Day 4', 'Complete bootcamp Day(s) 8, 9: Caesar Cipher and Blind Auction (dictionaries).', 'review', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w1-d5', 1, 'Day 5', 'Complete bootcamp Day(s) 10, 11: Functions with outputs (Calculator) and Blackjack capstone.', 'review', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w2-d1', 2, 'Day 1', 'Complete bootcamp Day(s) 12, 13, 14: Guess the Number, Debugging, Higher Lower Game.', 'review', 15, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w2-d2', 2, 'Day 2', 'Complete bootcamp Day(s) 15, 16: Coffee Machine procedural + OOP refactor (core OOP fundamentals).', 'review', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w2-d3', 2, 'Day 3', 'Complete bootcamp Day(s) 17, 18, 19: Quiz Project (OOP), Hirst Painting, Turtle Race.', 'review', 15, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w2-d4', 2, 'Day 4', 'Complete bootcamp Day(s) 20, 21, 22: Snake Game (2 days) and Pong Game.', 'review', 15, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w2-d5', 2, 'Day 5', 'Complete bootcamp Day(s) 23, 24, 25: Turtle Crossing, Mail Merge (file I/O), and US States Game (CSV + pandas).', 'review', 15, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w3-d1', 3, 'Day 1', 'Complete bootcamp Day(s) 26, 27: NATO Alphabet project and Tkinter miles-to-km converter.', 'review', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w3-d2', 3, 'Day 2', 'Complete bootcamp Day(s) 28, 29: Pomodoro Timer GUI and Password Manager (part 1, Tkinter).', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w3-d3', 3, 'Day 3', 'Complete bootcamp Day(s) 30, 31: Password Manager part 2 and Flash Card App.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w3-d4', 3, 'Day 4', 'Complete bootcamp Day(s) 32, 33: Birthday Wisher (email automation) and ISS Overhead Notifier (API).', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w3-d5', 3, 'Day 5', 'Complete bootcamp Day(s) 34, 35: Quizzler App (API + Tkinter GUI) and Rain Alert (weather API + notifications).', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w4-d1', 4, 'Day 1', 'Complete bootcamp Day(s) 36, 37: Stock News Alert and Habit Tracker.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w4-d2', 4, 'Day 2', 'Complete bootcamp Day(s) 38, 39: Workout Tracker and Flight Deal Finder.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w4-d3', 4, 'Day 3', 'Complete bootcamp Day(s) 40, 41: Flight Club (DB integration) and Personal Website  HTML/CSS basics.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w4-d4', 4, 'Day 4', 'Complete bootcamp Day(s) 42, 43: Personal Website  layout, styling and responsive design.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w4-d5', 4, 'Day 5', 'Complete bootcamp Day(s) 44, 45: Finish Personal Website and build Movie Scraper.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w5-d1', 5, 'Day 1', 'Complete bootcamp Day(s) 46, 47: Musical Time Machine and Amazon Price Tracker.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w5-d2', 5, 'Day 2', 'Complete bootcamp Day(s) 48, 49: Cookie Clicker bot and Job Application automation (Selenium).', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w5-d3', 5, 'Day 3', 'Complete bootcamp Day(s) 50, 51: Bumble swiping bot and Instagram follower bot.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w5-d4', 5, 'Day 4', 'Complete bootcamp Day(s) 52, 53: Internet speed complaint bot and data job entry automation.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w5-d5', 5, 'Day 5', 'Complete bootcamp Day(s) 54, 55: Decorators deep dive and Flask intro (Higher or Lower URLs).', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w6-d1', 6, 'Day 1', 'Complete bootcamp Day(s) 56, 57: Name Card app and Blog templating with Flask/Jinja2.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w6-d2', 6, 'Day 2', 'Complete bootcamp Day(s) 58, 59: Tindog landing page (Bootstrap) and Blog Website part 1.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w6-d3', 6, 'Day 3', 'Complete bootcamp Day(s) 60, 61: Blog Website part 2 and Flask Secrets.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w6-d4', 6, 'Day 4', 'Complete bootcamp Day(s) 62, 63: Coffee & Wifi app and Bookshelf app.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w6-d5', 6, 'Day 5', 'Complete bootcamp Day(s) 64, 65: Top 10 Movies website and Intro to Web Design.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w7-d1', 7, 'Day 1', 'Complete bootcamp Day(s) 66, 67: Cafe API and RESTful Blog.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w7-d2', 7, 'Day 2', 'Complete bootcamp Day(s) 68, 69: Authentication and Blog with Users (part 1).', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w7-d3', 7, 'Day 3', 'Complete bootcamp Day(s) 70, 71: Blog with Users (part 2) and Data Exploration with pandas.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w7-d4', 7, 'Day 4', 'Complete bootcamp Day(s) 72, 73: Data visualization with matplotlib and LEGO dataset analysis.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w7-d5', 7, 'Day 5', 'Complete bootcamp Day(s) 74, 75: Google Trends visualization and Google Play Store data project.', 'full_lesson', 10, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w8-d1', 8, 'Day 1', 'Complete bootcamp Day 76: Computation with NumPy  focus on numerical computing and performance.', 'capstone', 20, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w8-d2', 8, 'Day 2', 'Complete bootcamp Day 77: Intermediate Portfolio Project 1  apply your skills in a self-directed project.', 'capstone', 20, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w8-d3', 8, 'Day 3', 'Complete bootcamp Day 78: Intermediate Portfolio Project 2  extend or build another project.', 'capstone', 20, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w8-d4', 8, 'Day 4', 'Complete bootcamp Day 79: Intermediate Portfolio Project 3.', 'capstone', 20, NULL, 'normal', 'weekly', FALSE);
INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ('w8-d5', 8, 'Day 5', 'Complete bootcamp Day 80: Intermediate Portfolio Project 4  final polish and portfolio preparation.', 'capstone', 20, NULL, 'normal', 'weekly', FALSE);
