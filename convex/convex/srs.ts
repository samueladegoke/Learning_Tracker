import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { levelFromXp } from "./tasks";

// ========== SRS CONSTANTS - EXACT PORT FROM BACKEND ==========
// SRS_INTERVALS from backend/app/routers/spaced_repetition.py

export const SRS_INTERVALS = [1, 3, 7, 14]; // days between reviews
export const MASTERY_SUCCESS_COUNT = 3; // consecutive correct at max interval
export const MAX_DAILY_REVIEWS = 10; // limit per session
export const XP_PER_CORRECT = 10;
export const XP_MASTERY_BONUS = 100;

// ========== QUERIES ==========

/**
 * Get daily review questions - returns up to MAX_DAILY_REVIEWS due questions
 * EXACT port from backend GET /spaced-repetition/daily-review
 */
export const getDailyReview = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const { clerkUserId } = args;
    const now = Date.now();

    // Get all due reviews (dueDate <= now, not mastered)
    const dueReviews = await ctx.db
      .query("userQuestionReviews")
      .withIndex("by_user", (q) => q.eq("clerkUserId", clerkUserId))
      .filter((q) =>
        q.and(
          q.lte(q.field("dueDate"), now),
          q.eq(q.field("isMastered"), false)
        )
      )
      .order("asc")
      .take(MAX_DAILY_REVIEWS);

    // Fetch full question data for each review
    const reviewsWithQuestions = await Promise.all(
      dueReviews.map(async (review) => {
        const question = await ctx.db.get(review.questionId);
        if (!question) return null;

        return {
          reviewId: review._id,
          questionId: question._id,
          questionType: question.questionType,
          text: question.text,
          code: question.code,
          options: question.options ? JSON.parse(question.options) : null,
          starterCode: question.starterCode,
          difficulty: question.difficulty,
          topicTag: question.topicTag,
          intervalIndex: review.intervalIndex,
          successCount: review.successCount,
          dueDate: review.dueDate,
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

/**
 * Get user's SRS stats
 */
export const getSRSStats = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const { clerkUserId } = args;
    const now = Date.now();

    // Get all user reviews
    const allReviews = await ctx.db
      .query("userQuestionReviews")
      .withIndex("by_user", (q) => q.eq("clerkUserId", clerkUserId))
      .collect();

    const totalCards = allReviews.length;
    const masteredCards = allReviews.filter((r) => r.isMastered).length;
    const dueToday = allReviews.filter(
      (r) => r.dueDate <= now && !r.isMastered
    ).length;

    // Calculate streak (consecutive days with reviews)
    // Simplified: count unique days with reviews in last 30 days
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const reviewDates = new Set(
      allReviews
        .filter((r) => r.lastReviewedAt && r.lastReviewedAt > thirtyDaysAgo)
        .map((r) => new Date(r.lastReviewedAt!).toDateString())
    );

    return {
      totalCards,
      masteredCards,
      dueToday,
      reviewStreak: reviewDates.size,
      masteryPercentage:
        totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0,
    };
  },
});

// ========== MUTATIONS ==========

/**
 * Submit review result - updates SRS state based on correctness
 * EXACT port from backend POST /spaced-repetition/review-result
 *
 * Logic:
 * - Correct: advance interval index (0→1→2→3), increment success count
 * - Incorrect: reset to interval 0, clear success count
 * - Mastery: 3+ consecutive correct at max interval (index 3)
 */
export const submitReviewResult = mutation({
  args: {
    clerkUserId: v.string(),
    reviewId: v.id("userQuestionReviews"),
    wasCorrect: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { clerkUserId, reviewId, wasCorrect } = args;
    const now = Date.now();

    // Get review
    const review = await ctx.db.get(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }

    // Verify ownership
    if (review.clerkUserId !== clerkUserId) {
      throw new Error("Unauthorized");
    }

    // Prevent early submissions (anti-spam) - skip for mastered
    if (review.dueDate > now && !review.isMastered) {
      throw new Error("This question is not yet due for review");
    }

    let xpAwarded = 0;
    let message = "";
    let newIntervalIndex = review.intervalIndex;
    let newSuccessCount = review.successCount;
    let newDueDate: number;
    let nowMastered = false;

    if (wasCorrect) {
      // Correct: advance interval and increment success count
      newSuccessCount += 1;

      if (newIntervalIndex < SRS_INTERVALS.length - 1) {
        newIntervalIndex += 1;
      }

      // Calculate next due date
      const intervalDays = SRS_INTERVALS[newIntervalIndex];
      newDueDate = now + intervalDays * 24 * 60 * 60 * 1000;

      // Check for mastery (3+ consecutive at max interval)
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
      // Incorrect: reset to interval 0 and clear success count
      newIntervalIndex = 0;
      newSuccessCount = 0;
      newDueDate = now + SRS_INTERVALS[0] * 24 * 60 * 60 * 1000;
      xpAwarded = 0;
      message = `❌ Not quite! Review again in ${SRS_INTERVALS[0]} day.`;
    }

    // Update review
    await ctx.db.patch(reviewId, {
      intervalIndex: newIntervalIndex,
      successCount: newSuccessCount,
      dueDate: newDueDate,
      isMastered: nowMastered || review.isMastered,
      lastReviewedAt: now,
    });

    // Award XP to user
    if (xpAwarded > 0) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUserId))
        .first();

      if (user) {
        const newXp = user.xp + xpAwarded;
        await ctx.db.patch(user._id, {
          xp: newXp,
          level: levelFromXp(newXp),
        });
      }
    }

    return {
      success: true,
      wasCorrect,
      xpAwarded,
      message,
      isMastered: nowMastered || review.isMastered,
      nextDueDate: newDueDate,
      intervalIndex: newIntervalIndex,
      successCount: newSuccessCount,
    };
  },
});

/**
 * Add question to review queue - called when question is answered incorrectly in quiz
 * EXACT port from backend POST /spaced-repetition/add-to-review/{question_id}
 */
export const addToReview = mutation({
  args: {
    clerkUserId: v.string(),
    questionId: v.id("questions"),
  },
  handler: async (ctx, args) => {
    const { clerkUserId, questionId } = args;
    const now = Date.now();

    // Check if question exists
    const question = await ctx.db.get(questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    // Check if already in queue
    const existing = await ctx.db
      .query("userQuestionReviews")
      .withIndex("by_user", (q) => q.eq("clerkUserId", clerkUserId))
      .filter((q) => q.eq(q.field("questionId"), questionId))
      .first();

    if (existing) {
      // Reset interval (re-learn)
      await ctx.db.patch(existing._id, {
        intervalIndex: 0,
        successCount: 0,
        dueDate: now + SRS_INTERVALS[0] * 24 * 60 * 60 * 1000,
        isMastered: false,
      });

      return {
        success: true,
        message: "Question reset in review queue",
        reviewId: existing._id,
        isNew: false,
      };
    }

    // Add new review
    const reviewId = await ctx.db.insert("userQuestionReviews", {
      clerkUserId,
      questionId,
      intervalIndex: 0,
      dueDate: now + SRS_INTERVALS[0] * 24 * 60 * 60 * 1000,
      successCount: 0,
      isMastered: false,
      lastReviewedAt: undefined,
      createdAt: now,
    });

    return {
      success: true,
      message: "Question added to review queue",
      reviewId,
      isNew: true,
    };
  },
});

/**
 * Batch submit reviews - for submitting multiple review results at once
 */
export const batchSubmitReviews = mutation({
  args: {
    clerkUserId: v.string(),
    results: v.array(
      v.object({
        reviewId: v.id("userQuestionReviews"),
        wasCorrect: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { clerkUserId, results } = args;
    const now = Date.now();

    let totalXp = 0;
    let correctCount = 0;
    let masteredCount = 0;
    const outcomes: Array<{
      reviewId: Id<"userQuestionReviews">;
      wasCorrect: boolean;
      xpAwarded: number;
      isMastered: boolean;
    }> = [];

    for (const result of results) {
      const review = await ctx.db.get(result.reviewId);
      if (!review || review.clerkUserId !== clerkUserId) continue;

      let xpAwarded = 0;
      let newIntervalIndex = review.intervalIndex;
      let newSuccessCount = review.successCount;
      let newDueDate: number;
      let nowMastered = false;

      if (result.wasCorrect) {
        correctCount++;
        newSuccessCount += 1;

        if (newIntervalIndex < SRS_INTERVALS.length - 1) {
          newIntervalIndex += 1;
        }

        const intervalDays = SRS_INTERVALS[newIntervalIndex];
        newDueDate = now + intervalDays * 24 * 60 * 60 * 1000;

        if (
          newSuccessCount >= MASTERY_SUCCESS_COUNT &&
          newIntervalIndex === SRS_INTERVALS.length - 1
        ) {
          nowMastered = true;
          masteredCount++;
          xpAwarded = XP_MASTERY_BONUS;
        } else {
          xpAwarded = XP_PER_CORRECT;
        }
      } else {
        newIntervalIndex = 0;
        newSuccessCount = 0;
        newDueDate = now + SRS_INTERVALS[0] * 24 * 60 * 60 * 1000;
      }

      await ctx.db.patch(result.reviewId, {
        intervalIndex: newIntervalIndex,
        successCount: newSuccessCount,
        dueDate: newDueDate,
        isMastered: nowMastered || review.isMastered,
        lastReviewedAt: now,
      });

      totalXp += xpAwarded;
      outcomes.push({
        reviewId: result.reviewId,
        wasCorrect: result.wasCorrect,
        xpAwarded,
        isMastered: nowMastered,
      });
    }

    // Award total XP
    if (totalXp > 0) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUserId))
        .first();

      if (user) {
        const newXp = user.xp + totalXp;
        await ctx.db.patch(user._id, {
          xp: newXp,
          level: levelFromXp(newXp),
        });
      }
    }

    return {
      success: true,
      totalReviews: results.length,
      correctCount,
      masteredCount,
      totalXpAwarded: totalXp,
      outcomes,
    };
  },
});
