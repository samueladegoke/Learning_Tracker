import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// SM2 Spaced Repetition Intervals (in days)
export const SRS_INTERVALS = [1, 3, 7, 14];

// Helper: Add days to timestamp
function addDays(timestamp: number, days: number): number {
    return timestamp + days * 24 * 60 * 60 * 1000;
}

export const getDailyReview = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", identity.subject))
            .unique();

        if (!user) return null;

        const now = Date.now();

        // Get reviews due (due_date <= now, not mastered)
        // Note: Using by_user_and_due index, filtering due_date <= now
        const dueReviews = await ctx.db
            .query("userQuestionReviews")
            .withIndex("by_user_and_due", (q) => q.eq("user_id", user._id))
            .filter((q) =>
                q.and(
                    q.lte(q.field("due_date"), now),
                    q.eq(q.field("is_mastered"), false)
                )
            )
            .take(10);

        // Hydrate with question data
        const questions = [];
        for (const review of dueReviews) {
            const question = await ctx.db.get(review.question_id);
            if (question) {
                questions.push({
                    review_id: review._id,
                    question_id: question._id,
                    text: question.text,
                    question_type: question.question_type,
                    code: question.code,
                    options: question.options ? JSON.parse(question.options) : [],
                    starter_code: question.starter_code,
                    test_cases: question.test_cases ? JSON.parse(question.test_cases) : null,
                    topic_tag: question.topic_tag,
                    interval_index: review.interval_index,
                    success_count: review.success_count,
                });
            }
        }

        return {
            total_due: questions.length,
            questions,
            xp_bonus_available: questions.length >= 5 ? 50 : questions.length * 10,
        };
    },
});

export const submitReviewResult = mutation({
    args: {
        reviewId: v.id("userQuestionReviews"),
        wasCorrect: v.boolean(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", identity.subject))
            .unique();
        if (!user) throw new Error("User not found");

        const review = await ctx.db.get(args.reviewId);
        if (!review) throw new Error("Review not found");
        if (review.user_id !== user._id) throw new Error("Access denied");

        const now = Date.now();
        let xpAwarded = 0;
        let message = "";
        let isMastered = review.is_mastered;
        let intervalIndex = review.interval_index;
        let successCount = review.success_count;
        let dueDate = review.due_date;

        if (args.wasCorrect) {
            successCount += 1;
            if (intervalIndex < SRS_INTERVALS.length - 1) {
                intervalIndex += 1;
            }
            const intervalDays = SRS_INTERVALS[intervalIndex];
            dueDate = addDays(now, intervalDays);

            // Check for mastery (3+ successes at max interval)
            if (successCount >= 3 && intervalIndex === SRS_INTERVALS.length - 1) {
                isMastered = true;
                xpAwarded = 100;
                message = "🏆 Concept Mastered! +100 XP";
            } else {
                xpAwarded = 10;
                message = `✅ Correct! Next review in ${intervalDays} days. +10 XP`;
            }
        } else {
            // Incorrect: reset
            intervalIndex = 0;
            successCount = 0;
            dueDate = addDays(now, SRS_INTERVALS[0]);
            xpAwarded = 0;
            message = `❌ Not quite! Review again in ${SRS_INTERVALS[0]} day.`;
        }

        // Update review
        await ctx.db.patch(review._id, {
            interval_index: intervalIndex,
            success_count: successCount,
            due_date: dueDate,
            is_mastered: isMastered,
            last_reviewed_at: now,
        });

        // Award XP
        if (xpAwarded > 0) {
            await ctx.db.patch(user._id, { xp: (user.xp || 0) + xpAwarded });
        }

        return {
            review_id: review._id,
            is_mastered: isMastered,
            next_due_date: dueDate,
            xp_awarded: xpAwarded,
            message,
        };
    },
});

export const addToReview = mutation({
    args: { questionId: v.id("questions") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", identity.subject))
            .unique();
        if (!user) throw new Error("User not found");

        const question = await ctx.db.get(args.questionId);
        if (!question) throw new Error("Question not found");

        // Check if already in queue
        const existing = await ctx.db
            .query("userQuestionReviews")
            .withIndex("by_user_and_question", (q) =>
                q.eq("user_id", user._id).eq("question_id", args.questionId)
            )
            .unique();

        const now = Date.now();
        const dueDate = addDays(now, SRS_INTERVALS[0]);

        if (existing) {
            // Reset
            await ctx.db.patch(existing._id, {
                interval_index: 0,
                success_count: 0,
                due_date: dueDate,
                is_mastered: false,
            });
            return { message: "Question reset in review queue", due_date: dueDate };
        }

        // Create new
        await ctx.db.insert("userQuestionReviews", {
            user_id: user._id,
            question_id: args.questionId,
            interval_index: 0,
            due_date: dueDate,
            success_count: 0,
            is_mastered: false,
        });

        return { message: "Question added to review queue", due_date: dueDate };
    },
});

export const getSRSStats = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", identity.subject))
            .unique();
        if (!user) return null;

        const allReviews = await ctx.db
            .query("userQuestionReviews")
            .withIndex("by_user_and_due", (q) => q.eq("user_id", user._id))
            .collect();

        const now = Date.now();
        const totalInQueue = allReviews.length;
        const masteredCount = allReviews.filter((r) => r.is_mastered).length;
        const dueNow = allReviews.filter((r) => !r.is_mastered && r.due_date <= now).length;

        return {
            total_in_queue: totalInQueue,
            mastered_count: masteredCount,
            due_now: dueNow,
        };
    },
});
