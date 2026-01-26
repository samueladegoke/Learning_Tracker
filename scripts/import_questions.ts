/**
 * Import Questions to Convex
 * 
 * This script imports questions from data/migration/questions.json to Convex.
 * Usage: npx tsx scripts/import_questions.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as fs from "fs";
import * as path from "path";

const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://energetic-spider-825.convex.cloud";

async function importQuestions() {
    console.log("🚀 Starting questions import...");
    console.log(`📡 Connecting to: ${CONVEX_URL}`);

    const client = new ConvexHttpClient(CONVEX_URL);

    // Read questions JSON
    const questionsPath = path.join(__dirname, "../data/migration/questions.json");
    console.log(`📂 Reading: ${questionsPath}`);

    const rawData = fs.readFileSync(questionsPath, "utf-8");
    const questions = JSON.parse(rawData);

    console.log(`📊 Found ${questions.length} questions to import`);

    // Transform and batch insert
    const BATCH_SIZE = 50;
    let imported = 0;
    let errors = 0;

    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
        const batch = questions.slice(i, i + BATCH_SIZE);

        // Transform each question to match Convex schema
        const transformedBatch = batch.map((q: any) => ({
            quiz_id: q.quiz_id,
            question_type: q.question_type,
            text: q.text,
            code: q.code || undefined,
            options: q.options || undefined,
            correct_index: q.correct_index ?? undefined,
            starter_code: q.starter_code || undefined,
            test_cases: q.test_cases || undefined,
            solution_code: q.solution_code || undefined,
            explanation: q.explanation || undefined,
            difficulty: q.difficulty || "medium",
            topic_tag: q.topic_tag || undefined,
        }));

        try {
            await client.mutation(api.importData.insertRows, {
                table: "questions",
                rows: transformedBatch
            });
            imported += batch.length;
            process.stdout.write(`\r⏳ Imported: ${imported}/${questions.length} (${Math.round(imported / questions.length * 100)}%)`);
        } catch (error) {
            console.error(`\n❌ Batch error at ${i}:`, error);
            errors += batch.length;
        }
    }

    console.log(`\n\n✅ Import complete!`);
    console.log(`   - Imported: ${imported}`);
    console.log(`   - Errors: ${errors}`);

    // Verify count
    const count = await client.query(api.importData.countRows, { table: "questions" });
    console.log(`   - Verified count in DB: ${count}`);
}

importQuestions().catch(console.error);
