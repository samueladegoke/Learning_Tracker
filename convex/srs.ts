import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { levelFromXp } from "./gamification";
import { addDays } from "./lib/utils";

// ... (constants remain)
export const SRS_INTERVALS = [1, 3, 7, 14]; // days between reviews
export const MASTERY_SUCCESS_COUNT = 3;
export const MAX_DAILY_REVIEWS = 10;
export const XP_PER_CORRECT = 10;
export const XP_MASTERY_BONUS = 100;

// ========== QUERIES ==========

export const getDailyReview = query({
  args: { clerkUserId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let userId = args.clerkUserId;
    if (!userId) {
        const identity = await ctx.auth.getUserIdentity();
        if (identity) userId = identity.subject;
    }
    if (!userId) return { reviews: [], totalDue: 0, maxReviews: MAX_DAILY_REVIEWS };

    const now = Date.now();

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", userId!))
      .unique();
    if (!user) return { reviews: [], totalDue: 0, maxReviews: MAX_DAILY_REVIEWS };

    // Get due reviews
    const dueReviews = await ctx.db
      .query("userQuestionReviews")
      .withIndex("by_user_and_due", (q) => q.eq("user_id", user._id))
      .filter((q) =>
        q.and(
          q.lte(q.field("due_date"), now),
          q.eq(q.field("is_mastered"), false)
        )
      )
      .take(MAX_DAILY_REVIEWS);

    // Fetch question data
    const reviewsWithQuestions = await Promise.all(
      dueReviews.map(async (review) => {
        const question = await ctx.db.get(review.question_id);
        if (!question) return null;

        return {
          review_id: review._id,
          question_id: question._id,
          question_type: question.question_type,
          text: question.text,
          code: question.code,
          options: question.options ?? null,
          starter_code: question.starter_code,
          difficulty: question.difficulty,
          topic_tag: question.topic_tag,
          interval_index: review.interval_index,
          success_count: review.success_count,
          due_date: review.due_date,
        };
      })
    );

    return {
      reviews: reviewsWithQuestions.filter(Boolean),
      totalDue: dueReviews.length,
      maxReviews: MAX_DAILY_REVIEWS,
    };
  },
});

export const getSRSStats = query({
  args: { clerkUserId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let userId = args.clerkUserId;
    if (!userId) {
        const identity = await ctx.auth.getUserIdentity();
        if (identity) userId = identity.subject;
    }
    if (!userId) return null;

    const now = Date.now();

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", userId!))
      .unique();
    if (!user) return null;

    const allReviews = await ctx.db
      .query("userQuestionReviews")
      .withIndex("by_user_and_due", (q) => q.eq("user_id", user._id))
      .collect();

    const totalCards = allReviews.length;
    const masteredCards = allReviews.filter((r) => r.is_mastered).length;
    const dueToday = allReviews.filter(
      (r) => r.due_date <= now && !r.is_mastered
    ).length;

    return {
      total_cards: totalCards,
      mastered_cards: masteredCards,
      due_today: dueToday,
      mastery_percentage:
        totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0,
    };
  },
});

// ========== MUTATIONS ==========

export const submitReviewResult = mutation({
  args: {
    reviewId: v.id("userQuestionReviews"),
    wasCorrect: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const clerkUserId = identity.subject;

    const now = Date.now();

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", clerkUserId))
      .unique();
    if (!user) throw new Error("User not found");

    const review = await ctx.db.get(args.reviewId);
    if (!review) throw new Error("Review not found");
    if (review.user_id !== user._id) throw new Error("Unauthorized");

    let xpAwarded = 0;
    let message = "";
    let newIntervalIndex = review.interval_index;
    let newSuccessCount = review.success_count;
    let newDueDate: number;
    let nowMastered = false;

    if (args.wasCorrect) {
      newSuccessCount += 1;

      if (newIntervalIndex < SRS_INTERVALS.length - 1) {
        newIntervalIndex += 1;
      }

      const intervalDays = SRS_INTERVALS[newIntervalIndex];
      newDueDate = addDays(now, intervalDays);

      if (
        newSuccessCount >= MASTERY_SUCCESS_COUNT &&
        newIntervalIndex === SRS_INTERVALS.length - 1
      ) {
        nowMastered = true;
        xpAwarded = XP_MASTERY_BONUS;
        message = `🏆 Concept Mastered! +${XP_MASTERY_BONUS} XP`;
      } else {
        xpAwarded = XP_PER_CORRECT;
        message = `✅ Correct! Next review in ${intervalDays} days. +${XP_PER_CORRECT} XP`;
      }
    } else {
      newIntervalIndex = 0;
      newSuccessCount = 0;
      newDueDate = addDays(now, SRS_INTERVALS[0]);
      xpAwarded = 0;
      message = `❌ Not quite! Review again in ${SRS_INTERVALS[0]} day.`;
    }

    // Update review
    await ctx.db.patch(args.reviewId, {
      interval_index: newIntervalIndex,
      success_count: newSuccessCount,
      due_date: newDueDate,
      is_mastered: nowMastered || review.is_mastered,
      last_reviewed_at: now,
    });

    // Award XP
    if (xpAwarded > 0) {
      const newXp = user.xp + xpAwarded;
      await ctx.db.patch(user._id, {
        xp: newXp,
        level: levelFromXp(newXp),
      });
    }

    return {
      success: true,
      was_correct: args.wasCorrect,
      xp_awarded: xpAwarded,
      message,
      is_mastered: nowMastered || review.is_mastered,
      next_due_date: newDueDate,
    };
  },
});

export const addToReview = mutation({
  args: {
    questionId: v.id("questions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const clerkUserId = identity.subject;

    const now = Date.now();

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", clerkUserId))
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

    const dueDate = addDays(now, SRS_INTERVALS[0]);

    if (existing) {
      // Reset
      await ctx.db.patch(existing._id, {
        interval_index: 0,
        success_count: 0,
        due_date: dueDate,
        is_mastered: false,
      });
      return { success: true, message: "Question reset in review queue", is_new: false };
    }

    // Add new
    await ctx.db.insert("userQuestionReviews", {
      user_id: user._id,
      question_id: args.questionId,
      interval_index: 0,
      due_date: dueDate,
      success_count: 0,
      is_mastered: false,
    });

    return { success: true, message: "Question added to review queue", is_new: true };
  },
});
