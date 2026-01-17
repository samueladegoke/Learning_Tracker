const { ConvexHttpClient } = require("convex/browser");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load env from frontend/.env.local for VITE_CONVEX_URL
dotenv.config({ path: path.join(__dirname, "..", "frontend", ".env.local") });

const CONVEX_URL = process.env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
    console.error("ERROR: VITE_CONVEX_URL not found in frontend/.env.local");
    process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);
console.log(`Target Convex: ${CONVEX_URL}`);

const BATCH_SIZE = 10;

// Read questions
const questions = JSON.parse(fs.readFileSync("data/migration/questions.json", "utf-8"));
console.log(`Total questions: ${questions.length}`);

// Transform question to match schema - omit null/undefined values
function transform(q) {
    const result = {
        quiz_id: q.quiz_id || "",
        question_type: q.question_type || "mcq",
        text: q.text || "",
        difficulty: q.difficulty || "medium"
    };

    // Only add optional fields if they have values
    if (q.code) result.code = q.code;
    if (q.options) result.options = q.options;
    if (q.correct_index !== undefined && q.correct_index !== null) result.correct_index = q.correct_index;
    if (q.starter_code) result.starter_code = q.starter_code;
    if (q.test_cases) result.test_cases = q.test_cases;
    if (q.solution_code) result.solution_code = q.solution_code;
    if (q.explanation) result.explanation = q.explanation;
    if (q.topic_tag) result.topic_tag = q.topic_tag;

    return result;
}

async function importAll() {
    let imported = 0;
    let errors = 0;

    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
        const batch = questions.slice(i, i + BATCH_SIZE);
        const transformed = batch.map(transform);

        try {
            await client.mutation("importData:insertRows", {
                table: "questions",
                rows: transformed
            });
            imported += batch.length;

            if (imported % 100 === 0 || imported === questions.length) {
                console.log(`Progress: ${imported}/${questions.length} (${Math.floor(100 * imported / questions.length)}%)`);
            }
        } catch (e) {
            errors++;
            console.log(`Error at batch ${Math.floor(i / BATCH_SIZE)}: ${e.message.substring(0, 100)}`);
            if (errors > 5) {
                console.log("Too many errors, stopping");
                break;
            }
        }
    }

    console.log(`\nImported ${imported} questions, ${errors} errors`);
}

importAll();
