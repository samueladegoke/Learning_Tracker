import { ConvexClient } from "convex/browser";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load env from frontend/.env.local for VITE_CONVEX_URL
dotenv.config({ path: path.join(__dirname, "..", "frontend", ".env.local") });

const CONVEX_URL = process.env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
    console.error("ERROR: VITE_CONVEX_URL not found in frontend/.env.local");
    process.exit(1);
}

const client = new ConvexClient(CONVEX_URL);

// Helper to convert null to undefined recursively
function cleanData(obj: any): any {
    if (obj === null) return undefined;
    if (Array.isArray(obj)) return obj.map(cleanData);
    if (typeof obj === "object" && obj !== null) {
        const cleaned: any = {};
        for (const [key, value] of Object.entries(obj)) {
            const cleanedValue = cleanData(value);
            if (cleanedValue !== undefined) {
                cleaned[key] = cleanedValue;
            }
        }
        return cleaned;
    }
    return obj;
}

// Dependency order for import
const TABLES = [
    "courses",
    "weeks",
    "tasks",
    "users",
    "user_task_statuses",
    "badges",
    "achievements",
    "user_badges",
    "user_achievements",
    "quests",
    "quest_tasks",
    "user_quests",
    "challenges",
    "user_challenges",
    "user_inventory",
    "questions",
    "quiz_results",
    "user_question_reviews",
];

async function runImport() {
    const dataDir = path.join(__dirname, "..", "data", "migration");
    const idMap: Record<string, any> = {};

    console.log(`Starting import from ${dataDir}...`);
    console.log(`Target Convex: ${CONVEX_URL}`);

    for (const table of TABLES) {
        const filePath = path.join(dataDir, `${table}.json`);
        if (!fs.existsSync(filePath)) {
            console.log(`Skipping ${table}: File not found`);
            continue;
        }

        const rows = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        console.log(`\n--- Importing ${table} (${rows.length} rows) ---`);

        const BATCH_SIZE = 100;
        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
            const batch = rows.slice(i, i + BATCH_SIZE);
            const batchConvexData: any[] = [];
            const batchLegacyIds: string[] = [];
            const batchConvexTables: string[] = [];

            for (const row of batch) {
                const legacyId = row.id?.toString();
                let convexData: any = {};
                let convexTable = table;

                // Mapping and Transformation
                if (table === "courses") {
                    convexData = {
                        title: row.name || "Untitled Course",
                        description: row.description || "",
                        sequence_order: row.sequence_order || 1,
                        is_active: row.is_active ?? true,
                    };
                } else if (table === "weeks") {
                    convexData = {
                        course_id: idMap[`courses:${row.course_id}`],
                        title: row.title || `Week ${row.week_number}`,
                        description: row.focus || row.description || "",
                        week_number: row.week_number || 1,
                        is_locked: row.is_locked ?? false,
                    };
                } else if (table === "tasks") {
                    convexData = {
                        week_id: idMap[`weeks:${row.week_id}`],
                        title: row.day || row.title || "Untitled Task",
                        description: row.description || "",
                        task_type: row.type || "video",
                        difficulty: row.difficulty === "normal" ? "medium" : (row.difficulty || "medium"),
                        xp_reward: row.xp_reward || 10,
                        estimated_minutes: row.estimated_minutes || 30,
                        required_for_streak: row.required_for_streak ?? true,
                        metadata: {
                            legacy_task_id: row.task_id,
                            category: row.category,
                            badge_reward: row.badge_reward,
                        }
                    };
                } else if (table === "users") {
                    convexData = {
                        username: row.username || "user",
                        clerk_user_id: row.username.includes("-") ? row.username : `legacy_${row.id}`,
                        xp: row.xp || 0,
                        level: row.level || 1,
                        streak: row.streak || 0,
                        gold: row.gold || 0,
                        hearts: row.hearts || 5,
                        focus_points: row.focus_points || 5,
                        streak_freeze_count: row.streak_freeze_count || 0,
                    };
                } else if (table === "user_task_statuses") {
                    convexTable = "userTaskStatuses";
                    convexData = {
                        user_id: idMap[`users:${row.user_id}`],
                        task_id: idMap[`tasks:${row.task_id}`],
                        completed: row.completed ?? false,
                        completed_at: row.completed_at ? new Date(row.completed_at).getTime() : undefined,
                    };
                } else if (table === "questions") {
                    convexData = {
                        quiz_id: row.quiz_id || "general",
                        question_type: row.question_type || "mcq",
                        text: row.text || "",
                        code: row.code,
                        options: row.options,
                        correct_index: row.correct_index,
                        starter_code: row.starter_code,
                        test_cases: row.test_cases,
                        solution_code: row.solution_code,
                        explanation: row.explanation,
                        difficulty: row.difficulty || "medium",
                        topic_tag: row.topic_tag,
                    };
                } else if (table === "badges" || table === "achievements") {
                    convexData = {
                        [table === "badges" ? "badge_id" : "achievement_id"]: row[table === "badges" ? "badge_id" : "achievement_id"],
                        name: row.name,
                        description: row.description,
                        xp_value: row.xp_reward || 0,
                        difficulty: row.difficulty || "medium",
                    };
                } else {
                    convexData = { ...row };
                    delete convexData.id;
                    delete convexData.created_at;
                    delete convexData.updated_at;

                    if (convexData.user_id) convexData.user_id = idMap[`users:${row.user_id}`];
                    if (convexData.quest_id) convexData.quest_id = idMap[`quests:${row.quest_id}`];
                    if (convexData.badge_id) convexData.badge_id = idMap[`badges:${row.badge_id}`];
                    if (convexData.challenge_id) convexData.challenge_id = idMap[`challenges:${row.challenge_id}`];
                    if (convexData.question_id) convexData.question_id = idMap[`questions:${row.question_id}`];

                    if (table === "user_badges") convexTable = "userBadges";
                    if (table === "user_achievements") convexTable = "userAchievements";
                    if (table === "user_quests") convexTable = "userQuests";
                    if (table === "quest_tasks") convexTable = "questTasks";
                    if (table === "user_challenges") convexTable = "userChallenges";
                    if (table === "user_inventory") convexTable = "userInventory";
                    if (table === "user_question_reviews") convexTable = "userQuestionReviews";
                }

                if (convexData.user_id === undefined && (table.startsWith("user_") || table === "user_task_statuses")) {
                    console.log(`  ⚠ Skipping row in ${table} (Legacy ID ${legacyId}): Missing User ID mapping`);
                    continue;
                }

                batchConvexData.push(cleanData(convexData));
                batchLegacyIds.push(legacyId);
                batchConvexTables.push(convexTable);
            }

            if (batchConvexData.length === 0) continue;

            try {
                const targetTable = batchConvexTables[0];
                const allSameTable = batchConvexTables.every(t => t === targetTable);

                if (allSameTable) {
                    const newIds = await client.mutation("importData:insertRows", {
                        table: targetTable,
                        rows: batchConvexData
                    } as any);

                    for (let j = 0; j < newIds.length; j++) {
                        if (batchLegacyIds[j]) {
                            idMap[`${table}:${batchLegacyIds[j]}`] = newIds[j];
                        }
                    }
                } else {
                    for (let j = 0; j < batchConvexData.length; j++) {
                        const newId = await client.mutation("importData:insertRow", {
                            table: batchConvexTables[j],
                            data: batchConvexData[j]
                        } as any);
                        if (batchLegacyIds[j]) {
                            idMap[`${table}:${batchLegacyIds[j]}`] = newId;
                        }
                    }
                }
                process.stdout.write(`.`);
            } catch (err: any) {
                console.error(`\n  ❌ Error inserting batch in ${table}: ${err.message}`);
            }
        }
    }

    console.log("Import finished!");
    process.exit(0);
}

runImport();
