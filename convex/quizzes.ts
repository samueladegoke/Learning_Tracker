import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { SRS_INTERVALS } from "./srs";

// Helper: Add days to timestamp
function addDays(timestamp: number, days: number): number {
    return timestamp + days * 24 * 60 * 60 * 1000;
}

export const getQuizQuestions = query({
    args: { quizId: v.string() },
    handler: async (ctx, args) => {
        const questions = await ctx.db
            .query("questions")
            .withIndex("by_quiz_id", (q) => q.eq("quiz_id", args.quizId))
            .collect();

        // Return public-safe version (no correct_index or solution_code)
        return questions.map((q) => ({
            id: q._id,
            quiz_id: q.quiz_id,
            question_type: q.question_type,
            text: q.text,
            code: q.code,
            options: q.options ? JSON.parse(q.options) : [],
            starter_code: q.starter_code,
            test_cases: q.test_cases ? JSON.parse(q.test_cases) : null,
            difficulty: q.difficulty,
            topic_tag: q.topic_tag,
        }));
    },
});

export const verifyAnswer = mutation({
    args: {
        questionId: v.id("questions"),
        answer: v.union(v.number(), v.object({ allPassed: v.boolean() })),
    },
    handler: async (ctx, args) => {
        const question = await ctx.db.get(args.questionId);
        if (!question) throw new Error("Question not found");

        let isCorrect = false;
        const questionType = question.question_type || "mcq";

        if (questionType === "mcq" || questionType === "code-correction") {
            isCorrect =
                typeof args.answer === "number" &&
                question.correct_index === args.answer;
        } else if (questionType === "coding") {
            isCorrect =
                typeof args.answer === "object" &&
                (args.answer as { allPassed: boolean }).allPassed === true;
        }

        return {
            question_id: question._id,
            is_correct: isCorrect,
            correct_index: question.correct_index,
            explanation: question.explanation,
        };
    },
});

export const submitQuiz = mutation({
    args: {
        quizId: v.string(),
        answers: v.any(), // Record<string, number | { allPassed: boolean }>
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", identity.subject))
            .unique();
        if (!user) throw new Error("User not found");

        // Fetch all questions for this quiz
        const questions = await ctx.db
            .query("questions")
            .withIndex("by_quiz_id", (q) => q.eq("quiz_id", args.quizId))
            .collect();

        if (questions.length === 0) throw new Error("Quiz not found");

        const questionsMap = new Map(questions.map((q) => [q._id, q]));
        let score = 0;
        const totalQuestions = questions.length;
        const failedQuestionIds: string[] = [];

        // Calculate score
        for (const [qIdStr, answer] of Object.entries(args.answers)) {
            const question = questionsMap.get(qIdStr as any);
            if (!question) continue;

            const questionType = question.question_type || "mcq";
            let wasCorrect = false;

            if (questionType === "mcq" || questionType === "code-correction") {
                wasCorrect =
                    typeof answer === "number" && question.correct_index === answer;
            } else if (questionType === "coding") {
                wasCorrect =
                    typeof answer === "object" &&
                    (answer as { allPassed: boolean }).allPassed === true;
            }

            if (wasCorrect) {
                score += 1;
            } else {
                failedQuestionIds.push(question._id);
            }
        }

        // --- SRS Auto-Queueing: Add incorrectly answered questions to review ---
        const now = Date.now();
        const dueDate = addDays(now, SRS_INTERVALS[0]);

        for (const qId of failedQuestionIds) {
            const existing = await ctx.db
                .query("userQuestionReviews")
                .withIndex("by_user_and_question", (q) =>
                    q.eq("user_id", user._id).eq("question_id", qId as any)
                )
                .unique();

            if (existing) {
                // Reset
                await ctx.db.patch(existing._id, {
                    interval_index: 0,
                    success_count: 0,
                    due_date: dueDate,
                    is_mastered: false,
                });
            } else {
                await ctx.db.insert("userQuestionReviews", {
                    user_id: user._id,
                    question_id: qId as any,
                    interval_index: 0,
                    due_date: dueDate,
                    success_count: 0,
                    is_mastered: false,
                });
            }
        }

        // Award XP (10 base + score)
        const xpGained = 10 + score;
        await ctx.db.patch(user._id, { xp: (user.xp || 0) + xpGained });

        return {
            message: "Quiz submitted",
            xp_gained: xpGained,
            score,
            total_questions: totalQuestions,
            score_breakdown: `${score}/${totalQuestions}`,
            percentage:
                totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0,
        };
    },
});

export const getCompletedQuizzes = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        // Note: Would need a quizResults table to track completed quizzes
        // For now, return empty - this can be derived from userTaskStatuses
        // or added as a separate table in a future iteration
        return [];
    },
});
