-- Seed weeks
INSERT INTO weeks (week_number, label, notes) VALUES (1, 'Week 1 - Bootcamp Days 1-11', 'Review-heavy week (you may batch 2–3 bootcamp days per study session).');
INSERT INTO weeks (week_number, label, notes) VALUES (2, 'Week 2 - Bootcamp Days 12-25', 'Review-heavy week (you may batch 2–3 bootcamp days per study session). OOP Coffee/Quiz days get slightly more focus.');
INSERT INTO weeks (week_number, label, notes) VALUES (3, 'Week 3 - Bootcamp Days 26-35', 'Review-heavy but transitioning to more complex GUI + API work. Still 2 bootcamp days per study session.');
INSERT INTO weeks (week_number, label, notes) VALUES (4, 'Week 4 - Bootcamp Days 36-45', 'Mixed week: regular pace (mostly 2 bootcamp days per study session). Focus on APIs, automation, and first larger data/HTML projects.');
INSERT INTO weeks (week_number, label, notes) VALUES (5, 'Week 5 - Bootcamp Days 46-55', 'Mixed week: regular pace (~2 bootcamp days per study session). Focus on scraping + Selenium bots + Flask intro.');
INSERT INTO weeks (week_number, label, notes) VALUES (6, 'Week 6 - Bootcamp Days 56-65', 'Heavy project week: advanced Flask/web; keep pace at ~2 bootcamp days per study session, no 3-day batches.');
INSERT INTO weeks (week_number, label, notes) VALUES (7, 'Week 7 - Bootcamp Days 66-75', 'Heavy project week: REST APIs, auth, multi-user blogs, and data science intro. Still ~2 bootcamp days per session.');
INSERT INTO weeks (week_number, label, notes) VALUES (8, 'Week 8 - Bootcamp Days 76-80', 'Capstone & portfolio week: 1 bootcamp day per session with extra time for polishing and reflection.');

-- Seed tasks
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w1-d1', 1, 'Day 1', '[1, 2, 3]', '["Working with Variables in Python to Manage Data (Band Name Generator)", "Understanding Data Types and How to Manipulate Strings (Tip Calculator)", "Control Flow and Logical Operators (Treasure Island)"]', 'review', 15, 'Complete bootcamp Day(s) 1, 2, 3: Working with Variables; Data Types & Strings; Control Flow & Logical Operators + projects (Band Name Generator, Tip Calculator, Treasure Island).');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w1-d2', 1, 'Day 2', '[4, 5]', '["Randomisation and Python Lists (Rock, Paper, Scissors)", "Python Loops (Password Generator)"]', 'review', 10, 'Complete bootcamp Day(s) 4, 5: Randomisation & Lists (Rock, Paper, Scissors) and Loops (Password Generator).');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w1-d3', 1, 'Day 3', '[6, 7]', '["Python Functions & Karel (Reborg''s World Maze)", "Hangman Game"]', 'review', 10, 'Complete bootcamp Day(s) 6, 7: Functions & Karel maze; Hangman game.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w1-d4', 1, 'Day 4', '[8, 9]', '["Caesar Cipher", "Blind Auction"]', 'review', 10, 'Complete bootcamp Day(s) 8, 9: Caesar Cipher and Blind Auction (dictionaries).');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w1-d5', 1, 'Day 5', '[10, 11]', '["Functions with Outputs (Calculator)", "Blackjack Capstone Project"]', 'review', 10, 'Complete bootcamp Day(s) 10, 11: Functions with outputs (Calculator) and Blackjack capstone.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w2-d1', 2, 'Day 1', '[12, 13, 14]', '["Guess the Number", "Debugging", "Higher Lower Game"]', 'review', 15, 'Complete bootcamp Day(s) 12, 13, 14: Guess the Number, Debugging, Higher Lower Game.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w2-d2', 2, 'Day 2', '[15, 16]', '["Coffee Machine (procedural)", "Coffee Machine (OOP)"]', 'review', 10, 'Complete bootcamp Day(s) 15, 16: Coffee Machine procedural + OOP refactor (core OOP fundamentals).');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w2-d3', 2, 'Day 3', '[17, 18, 19]', '["Quiz Project (OOP)", "Hirst Painting (Turtle)", "Turtle Race"]', 'review', 15, 'Complete bootcamp Day(s) 17, 18, 19: Quiz Project (OOP), Hirst Painting, Turtle Race.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w2-d4', 2, 'Day 4', '[20, 21, 22]', '["Snake Game \u2013 Part 1", "Snake Game \u2013 Part 2", "Pong Game"]', 'review', 15, 'Complete bootcamp Day(s) 20, 21, 22: Snake Game (2 days) and Pong Game.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w2-d5', 2, 'Day 5', '[23, 24, 25]', '["Turtle Crossing Game", "Mail Merge Project", "US States Game"]', 'review', 15, 'Complete bootcamp Day(s) 23, 24, 25: Turtle Crossing, Mail Merge (file I/O), and US States Game (CSV + pandas).');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w3-d1', 3, 'Day 1', '[26, 27]', '["NATO Alphabet Project", "Mile to Kilometers Converter (Tkinter)"]', 'review', 10, 'Complete bootcamp Day(s) 26, 27: NATO Alphabet project and Tkinter miles-to-km converter.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w3-d2', 3, 'Day 2', '[28, 29]', '["Pomodoro Timer (Tkinter)", "Password Manager \u2013 Part 1 (Tkinter)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 28, 29: Pomodoro Timer GUI and Password Manager (part 1, Tkinter).');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w3-d3', 3, 'Day 3', '[30, 31]', '["Password Manager \u2013 Part 2 (Tkinter)", "Flash Card App (Tkinter)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 30, 31: Password Manager part 2 and Flash Card App.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w3-d4', 3, 'Day 4', '[32, 33]', '["Birthday Wisher", "ISS Overhead Notifier"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 32, 33: Birthday Wisher (email automation) and ISS Overhead Notifier (API).');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w3-d5', 3, 'Day 5', '[34, 35]', '["Quizzler App (API + Tkinter)", "Rain Alert (Weather API)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 34, 35: Quizzler App (API + Tkinter GUI) and Rain Alert (weather API + notifications).');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w4-d1', 4, 'Day 1', '[36, 37]', '["Stock News Alert", "Habit Tracker (Pixela API)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 36, 37: Stock News Alert and Habit Tracker.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w4-d2', 4, 'Day 2', '[38, 39]', '["Workout Tracker (Google Sheets API + NLP)", "Flight Deal Finder"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 38, 39: Workout Tracker and Flight Deal Finder.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w4-d3', 4, 'Day 3', '[40, 41]', '["Flight Club (with database)", "Personal Website \u2013 HTML & CSS Basics (Day 1)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 40, 41: Flight Club (DB integration) and Personal Website – HTML/CSS basics.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w4-d4', 4, 'Day 4', '[42, 43]', '["Personal Website \u2013 Layout & Styling (Day 2)", "Personal Website \u2013 Responsive Design (Day 3)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 42, 43: Personal Website – layout, styling and responsive design.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w4-d5', 4, 'Day 5', '[44, 45]', '["Personal Website \u2013 Final Polish (Day 4)", "Movie Scraper"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 44, 45: Finish Personal Website and build Movie Scraper.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w5-d1', 5, 'Day 1', '[46, 47]', '["Musical Time Machine (Spotify + Web Scraping)", "Automated Amazon Price Tracker"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 46, 47: Musical Time Machine and Amazon Price Tracker.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w5-d2', 5, 'Day 2', '[48, 49]', '["Cookie Clicker Bot (Selenium Automation)", "Automating Job Applications (Selenium)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 48, 49: Cookie Clicker bot and Job Application automation (Selenium).');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w5-d3', 5, 'Day 3', '[50, 51]', '["Auto Bumble Swiping Bot (Selenium)", "Instagram Follower Bot (Selenium)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 50, 51: Bumble swiping bot and Instagram follower bot.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w5-d4', 5, 'Day 4', '[52, 53]', '["Internet Speed Twitter Complaint Bot", "Data Job Entry Automation"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 52, 53: Internet speed complaint bot and data job entry automation.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w5-d5', 5, 'Day 5', '[54, 55]', '["Python Decorators Exercise", "Higher or Lower URLs (Flask intro)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 54, 55: Decorators deep dive and Flask intro (Higher or Lower URLs).');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w6-d1', 6, 'Day 1', '[56, 57]', '["Name Card (Flask + Templating)", "Blog Templating (Flask + Jinja2)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 56, 57: Name Card app and Blog templating with Flask/Jinja2.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w6-d2', 6, 'Day 2', '[58, 59]', '["Tindog Website (Bootstrap)", "Blog Website \u2013 Part 1 (Flask + DB)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 58, 59: Tindog landing page (Bootstrap) and Blog Website part 1.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w6-d3', 6, 'Day 3', '[60, 61]', '["Blog Website \u2013 Part 2 (Flask + DB)", "Flask Secrets (env vars, security basics)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 60, 61: Blog Website part 2 and Flask Secrets.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w6-d4', 6, 'Day 4', '[62, 63]', '["Coffee and Wifi (Flask + CSV/Forms)", "Bookshelf (Flask + Database CRUD)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 62, 63: Coffee & Wifi app and Bookshelf app.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w6-d5', 6, 'Day 5', '[64, 65]', '["My Top 10 Movies Website", "Intro to Web Design (UX/UI)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 64, 65: Top 10 Movies website and Intro to Web Design.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w7-d1', 7, 'Day 1', '[66, 67]', '["Cafe API (Flask REST)", "Restful Blog (Flask REST CRUD)"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 66, 67: Cafe API and RESTful Blog.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w7-d2', 7, 'Day 2', '[68, 69]', '["Authentication with Flask", "Blog with Users \u2013 Part 1"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 68, 69: Authentication and Blog with Users (part 1).');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w7-d3', 7, 'Day 3', '[70, 71]', '["Blog with Users \u2013 Part 2", "Data Exploration with Pandas"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 70, 71: Blog with Users (part 2) and Data Exploration with pandas.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w7-d4', 7, 'Day 4', '[72, 73]', '["Data Visualization with Matplotlib", "Analyze the LEGO Dataset"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 72, 73: Data visualization with matplotlib and LEGO dataset analysis.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w7-d5', 7, 'Day 5', '[74, 75]', '["Google Trends Data Visualization", "Google Play Store Project"]', 'full_lesson', 10, 'Complete bootcamp Day(s) 74, 75: Google Trends visualization and Google Play Store data project.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w8-d1', 8, 'Day 1', '[76]', '["Computation with NumPy"]', 'capstone', 20, 'Complete bootcamp Day 76: Computation with NumPy — focus on numerical computing and performance.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w8-d2', 8, 'Day 2', '[77]', '["Intermediate Portfolio Project 1"]', 'capstone', 20, 'Complete bootcamp Day 77: Intermediate Portfolio Project 1 — apply your skills in a self-directed project.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w8-d3', 8, 'Day 3', '[78]', '["Intermediate Portfolio Project 2"]', 'capstone', 20, 'Complete bootcamp Day 78: Intermediate Portfolio Project 2 — extend or build another project.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w8-d4', 8, 'Day 4', '[79]', '["Intermediate Portfolio Project 3"]', 'capstone', 20, 'Complete bootcamp Day 79: Intermediate Portfolio Project 3.');
INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description) 
VALUES ('w8-d5', 8, 'Day 5', '[80]', '["Intermediate Portfolio Project 4"]', 'capstone', 20, 'Complete bootcamp Day 80: Intermediate Portfolio Project 4 — final polish and portfolio preparation.');
