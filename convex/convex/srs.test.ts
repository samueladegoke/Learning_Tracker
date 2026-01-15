
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

test("getDailyReview returns due questions", async () => {
    const t = convexTest(schema);

    await t.run(async (ctx) => {
        // Add User
        await ctx.db.insert("users", { clerkUserId: "user_srs", username: "srs", xp: 0, level: 1, gold: 0, streak: 0, bestStreak: 0, focusPoints: 5, hearts: 5, streakFreezeCount: 0, currentWeek: 1, isAdmin: false, createdAt: Date.now(), focusRefreshedAt: Date.now() });

        // Add Question
        const q1 = await ctx.db.insert("questions", {
            quizId: "qz1", questionType: "multiple_choice", text: "Q1", difficulty: "easy", topicTag: "py"
        });

        // Add Review (Due yesterday)
        await ctx.db.insert("userQuestionReviews", {
            clerkUserId: "user_srs",
            questionId: q1,
            intervalIndex: 0,
            dueDate: Date.now() - 86400000, // Yesterday
            successCount: 0,
            isMastered: false,
            createdAt: Date.now()
        });
    });

    const due = await t.query(api.srs.getDailyReview, { clerkUserId: "user_srs" });
    expect(due).toHaveLength(1);
    expect(due[0].text).toBe("Q1");
});

test("submitReviewResult updates interval on success", async () => {
    const t = convexTest(schema);

    // Setup
    const { qId, reviewId } = await t.run(async (ctx) => {
        await ctx.db.insert("users", { clerkUserId: "user_srs", username: "srs", xp: 0, level: 1, gold: 0, streak: 0, bestStreak: 0, focusPoints: 5, hearts: 5, streakFreezeCount: 0, currentWeek: 1, isAdmin: false, createdAt: Date.now(), focusRefreshedAt: Date.now() });
        const q = await ctx.db.insert("questions", { quizId: "qz1", questionType: "code", text: "Code Q", difficulty: "normal", topicTag: "py" });
        const r = await ctx.db.insert("userQuestionReviews", {
            clerkUserId: "user_srs",
            questionId: q,
            intervalIndex: 0, // 1 day
            dueDate: Date.now(),
            successCount: 0,
            isMastered: false,
            createdAt: Date.now()
        });
        return { qId: q, reviewId: r };
    });

    // Submit Correct Answer
    await t.mutation(api.srs.submitReviewResult, {
        clerkUserId: "user_srs",
        questionId: qId,
        isCorrect: true
    });

    const review = await t.run(async (ctx) => {
        return await ctx.db.get(reviewId);
    });

    expect(review?.intervalIndex).toBe(1); // Should advance to index 1 (3 days)
    expect(review?.successCount).toBe(1);
});

test("submitReviewResult resets interval on failure", async () => {
    const t = convexTest(schema);

    // Setup: Review at index 2 (7 days)
    const { qId, reviewId } = await t.run(async (ctx) => {
        await ctx.db.insert("users", { clerkUserId: "user_srs", username: "srs", xp: 0, level: 1, gold: 0, streak: 0, bestStreak: 0, focusPoints: 5, hearts: 5, streakFreezeCount: 0, currentWeek: 1, isAdmin: false, createdAt: Date.now(), focusRefreshedAt: Date.now() });
        const q = await ctx.db.insert("questions", { quizId: "qz1", questionType: "code", text: "Code Q", difficulty: "normal", topicTag: "py" });
        const r = await ctx.db.insert("userQuestionReviews", {
            clerkUserId: "user_srs",
            questionId: q,
            intervalIndex: 2,
            dueDate: Date.now(),
            successCount: 2,
            isMastered: false,
            createdAt: Date.now()
        });
        return { qId: q, reviewId: r };
    });

    // Submit Incorrect Answer
    await t.mutation(api.srs.submitReviewResult, {
        clerkUserId: "user_srs",
        questionId: qId,
        isCorrect: false
    });

    const review = await t.run(async (ctx) => {
        return await ctx.db.get(reviewId);
    });

    expect(review?.intervalIndex).toBe(0); // Reset to 1 day
    expect(review?.successCount).toBe(0); // Reset success streak
});
