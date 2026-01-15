
const { ConvexClient } = require("convex/browser");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", "frontend", ".env.local") });

const CONVEX_URL = process.env.VITE_CONVEX_URL;
const client = new ConvexClient(CONVEX_URL);

const TABLES = [
    "courses", "weeks", "tasks", "users", "userTaskStatuses",
    "badges", "achievements", "userBadges", "userAchievements",
    "questions", "quizResults"
];

async function verify() {
    console.log("Migration Verification Summary");
    console.log("==============================");

    for (const table of TABLES) {
        try {
            const rows = await client.query(`importData:countRows`, { table });
            console.log(`${table}: ${rows} rows`);
        } catch (err) {
            console.log(`${table}: ERROR - ${err.message}`);
        }
    }
    process.exit(0);
}

verify();
