
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

test("getQuizQuestions returns questions", async () => {
    const t = convexTest(schema);

    await t.run(async (ctx) => {
        await ctx.db.insert("questions", { quizId: "week-1-quiz", questionType: "mcq", text: "Q1", difficulty: "easy", topicTag: "intro" });
        await ctx.db.insert("questions", { quizId: "week-1-quiz", questionType: "mcq", text: "Q2", difficulty: "easy", topicTag: "intro" });
    });

    const questions = await t.query(api.quizzes.getQuizQuestions, { quizId: "week-1-quiz" });
    expect(questions).toHaveLength(2);
});

test("submitQuizResult records score", async () => {
    const t = convexTest(schema);

    await t.run(async (ctx) => {
        await ctx.db.insert("users", { clerkUserId: "user_quiz", username: "quiz", xp: 0, level: 1, gold: 0, streak: 0, bestStreak: 0, focusPoints: 5, hearts: 5, streakFreezeCount: 0, currentWeek: 1, isAdmin: false, createdAt: Date.now(), focusRefreshedAt: Date.now() });
    });

    await t.mutation(api.quizzes.submitQuizResult, {
        clerkUserId: "user_quiz",
        quizId: "week-1-quiz",
        score: 80,
        totalQuestions: 10
    });

    const result = await t.run(async (ctx) => {
        return await ctx.db.query("quizResults").first();
    });

    expect(result?.score).toBe(80);
    expect(result?.clerkUserId).toBe("user_quiz");
});
