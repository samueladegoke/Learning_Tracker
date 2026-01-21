import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

test("submitReviewResult advances interval on success", async () => {
  const t = convexTest(schema);
  const user = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      username: "mem",
      clerk_user_id: "mem_id",
      xp: 0,
      level: 1,
      gold: 0,
      streak: 0,
      hearts: 5,
      focus_points: 100,
      streak_freeze_count: 0
    });
  });

  const question = await t.run(async (ctx) => {
    return await ctx.db.insert("questions", {
      quiz_id: "q1",
      question_type: "mcq",
      text: "Q",
      difficulty: "easy"
    });
  });

  // Initial review state (interval 0)
  const reviewId = await t.run(async (ctx) => {
    return await ctx.db.insert("userQuestionReviews", {
      user_id: user,
      question_id: question,
      interval_index: 0,
      due_date: Date.now(),
      success_count: 0,
      is_mastered: false
    });
  });

  // Action: Correct answer
  await t.withIdentity({ subject: "mem_id" }).mutation(api.srs.submitReviewResult, {
    reviewId: reviewId,
    wasCorrect: true
  });

  // Assert: Interval increases to index 1 (3 days)
  const review = await t.run(async (ctx) => await ctx.db.get(reviewId));

  expect(review).toBeDefined();
  if (review) {
      expect(review.interval_index).toBe(1);
      expect(review.success_count).toBe(1);
  }
});

test("submitReviewResult resets interval on failure", async () => {
    const t = convexTest(schema);
    const user = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        username: "mem2",
        clerk_user_id: "mem2_id",
        xp: 0,
        level: 1,
        gold: 0,
        streak: 0,
        hearts: 5,
        focus_points: 100,
        streak_freeze_count: 0
      });
    });
  
    const question = await t.run(async (ctx) => {
      return await ctx.db.insert("questions", {
        quiz_id: "q1",
        question_type: "mcq",
        text: "Q",
        difficulty: "easy"
      });
    });
  
    // Review state at interval 2 (7 days)
    const reviewId = await t.run(async (ctx) => {
      return await ctx.db.insert("userQuestionReviews", {
        user_id: user,
        question_id: question,
        interval_index: 2,
        due_date: Date.now(),
        success_count: 2,
        is_mastered: false
      });
    });
  
  // Action: Incorrect answer
  await t.withIdentity({ subject: "mem2_id" }).mutation(api.srs.submitReviewResult, {
    reviewId: reviewId,
    wasCorrect: false
  });
  
    // Assert: Interval resets to 0 (1 day)
    const review = await t.run(async (ctx) => await ctx.db.get(reviewId));
  
    expect(review).toBeDefined();
    if (review) {
        expect(review.interval_index).toBe(0);
        expect(review.success_count).toBe(0);
    }
});
