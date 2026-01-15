
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";
import * as tasks from "./tasks";
import * as quizzes from "./quizzes";
import * as srs from "./srs";

/**
 * UNIFIED SMOKE TEST
 * Verifies core snake_case workflow for Migration Phase 6
 */

test("full user journey: complete task -> quiz -> srs", async () => {
    const t = convexTest(schema, { tasks, quizzes, srs });
    const now = Date.now();

    // 1. Setup Data
    const { courseId, weekId, taskId, questionId } = await t.run(async (ctx) => {
        const cId = await ctx.db.insert("courses", {
            title: "C1", description: "D1", sequence_order: 1, is_active: true
        });
        const wId = await ctx.db.insert("weeks", {
            week_number: 1, title: "W1", description: "D1", course_id: cId, is_locked: false
        });
        const tId = await ctx.db.insert("tasks", {
            week_id: wId, title: "T1", description: "D1", task_type: "quiz",
            xp_reward: 100, difficulty: "normal", estimated_minutes: 5, required_for_streak: true
        });
        const qId = await ctx.db.insert("questions", {
            quiz_id: "quiz-1", question_type: "mcq", text: "Q1", difficulty: "easy", topic_tag: "py",
            options: JSON.stringify(["Correct", "Wrong"]), correct_index: 0, solution_code: "", explanation: ""
        });
        return { courseId: cId, weekId: wId, taskId: tId, questionId: qId };
    });

    // 2. Complete Task
    const completeRes = await t.mutation(api.tasks.completeTask, {
        clerkUserId: "user_smoke",
        taskId: taskId,
    });
    expect(completeRes.success).toBe(true);
    expect(completeRes.xp_gained).toBe(100);

    // 3. Submit Quiz (Incorrect to trigger SRS)
    await t.mutation(api.quizzes.submitQuizResult, {
        clerkUserId: "user_smoke",
        quizId: "quiz-1",
        answers: [{ questionId, selectedIndex: 1 }] // Wrong answer
    });

    // 4. Verify SRS Entry
    const dueReviews = await t.query(api.srs.getDailyReview, { clerkUserId: "user_smoke" });
    expect(dueReviews).toHaveLength(1);
    expect(dueReviews[0].text).toBe("Q1");

    // 5. Submit SRS Correct
    const srsRes = await t.mutation(api.srs.submitReviewResult, {
        clerkUserId: "user_smoke",
        reviewId: dueReviews[0].id,
        wasCorrect: true
    });
    expect(srsRes.success).toBe(true);

    // 6. Verify User State
    const user = await t.query(api.tasks.getUser, { clerkUserId: "user_smoke" });
    expect(user?.xp).toBeGreaterThan(100);
    expect(user?.level).toBeGreaterThanOrEqual(1);
});
