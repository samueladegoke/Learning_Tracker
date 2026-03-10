import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { xpForNextLevel, levelFromXp, FOCUS_CAP } from "./gamification";
import { completeTaskLogic } from "./tasks";
import { getCurrentUser, getUserByClerkId, requireAuth } from "./lib/auth";
import { SRS_INTERVALS, MASTERY_SUCCESS_COUNT } from "./srs";
import { MS_PER_DAY } from "./lib/utils";

// ========== QUERIES ==========

export const getQuizQuestions = query({
  args: { quizId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("questions")
      .withIndex("by_quiz_id", (q) => q.eq("quiz_id", args.quizId))
      .collect();
  },
});

export const getQuizHistory = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkUserId);

    if (!user) return [];

    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("user_id", user._id))
      .order("desc")
      .collect();

    return results.map((r) => ({
      quiz_id: r.quiz_id,
      score: r.score,
      total_questions: r.total_questions,
      percentage: r.total_questions > 0 ? Math.round((r.score / r.total_questions) * 100) : 0,
      completed_at: r.completed_at ? new Date(r.completed_at).toISOString() : null,
    }));
  },
});

export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;

    // Get top users by XP using the by_xp index
    const users = await ctx.db
      .query("users")
      .withIndex("by_xp")
      .order("desc")
      .take(limit);

    return users.map(u => ({
      username: u.username,
      xp: u.xp,
      level: u.level,
      streak: u.streak
    }));
  },
});

// ========== MUTATIONS ==========

export const checkAnswer = mutation({
  args: {
    questionId: v.id("questions"),
    selectedIndex: v.optional(v.number()),
    trustedPassed: v.optional(v.boolean()),
    codeAnswer: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Auth check only - user object not needed for answer validation
    const authResult = await requireAuth(ctx);
    if (!authResult.success) {
      throw new Error(authResult.error);
    }

    const question = await ctx.db.get(args.questionId);
    if (!question) throw new Error("Question not found");

    let isCorrect = false;

    if (question.question_type === "mcq" || question.question_type === "code-correction") {
      isCorrect = args.selectedIndex === question.correct_index;
    } else if (question.question_type === "coding") {
      isCorrect = !!args.trustedPassed;
    }

    const xpAwarded = isCorrect ? 10 : 0;

    return {
      is_correct: isCorrect,
      correct_index: question.correct_index,
      xp_awarded: xpAwarded,
      explanation: question.explanation
    };
  }
});

export const submitQuizResult = mutation({
  args: {
    quizId: v.string(),
    score: v.number(),
    totalQuestions: v.number(),
    answers: v.optional(v.array(v.object({
      questionId: v.id("questions"),
      selectedIndex: v.optional(v.number()),
      trustedPassed: v.optional(v.boolean()),
      codeAnswer: v.optional(v.string())
    }))),
    taskId: v.optional(v.id("tasks")) // Optional: Link to a specific task
  },
  handler: async (ctx, args) => {
    // Use helper for auth + user lookup
    const userResult = await getCurrentUser(ctx);
    if (!userResult.success) {
      throw new Error(userResult.error);
    }
    const user = userResult.user;

    // 1. Record Result
    await ctx.db.insert("quizResults", {
      user_id: user._id,
      quiz_id: args.quizId,
      score: args.score,
      total_questions: args.totalQuestions,
      completed_at: Date.now(),
    });

    const passed = (args.score / args.totalQuestions) >= 0.7;

    // 2. Handle SRS Updates (If any questions provided)
    if (args.answers && args.answers.length > 0) {
      for (const ans of args.answers) {
        const question = await ctx.db.get(ans.questionId);
        if (!question) continue;

        let isCorrect = false;
        if (question.question_type === "mcq" || question.question_type === "code-correction") {
          isCorrect = ans.selectedIndex === question.correct_index;
        } else if (question.question_type === "coding") {
          isCorrect = !!ans.trustedPassed;
        }

        // Check if this question is in user's SRS queue
        const review = await ctx.db
          .query("userQuestionReviews")
          .withIndex("by_user_and_question", (q) =>
            q.eq("user_id", user._id).eq("question_id", ans.questionId)
          )
          .unique();

        if (review) {
          // Update existing SRS item
          const newIntervalIndex = isCorrect ? review.interval_index + 1 : 0;
          const clampedIndex = Math.min(newIntervalIndex, SRS_INTERVALS.length - 1);
          const daysToAdd = SRS_INTERVALS[clampedIndex];

          await ctx.db.patch(review._id, {
            interval_index: clampedIndex,
            due_date: Date.now() + daysToAdd * MS_PER_DAY,
            success_count: isCorrect ? review.success_count + 1 : review.success_count,
            last_reviewed_at: Date.now(),
            is_mastered: isCorrect && (review.success_count + 1) >= MASTERY_SUCCESS_COUNT && clampedIndex === SRS_INTERVALS.length - 1,
          });
        } else if (!isCorrect) {
          // Add failed non-SRS question to SRS queue (New Feature: Automatic SRS Sync)
          await ctx.db.insert("userQuestionReviews", {
            user_id: user._id,
            question_id: ans.questionId,
            interval_index: 0,
            due_date: Date.now() + MS_PER_DAY,
            success_count: 0,
            is_mastered: false,
            last_reviewed_at: Date.now(),
          });
        }
      }
    }

    // 3. Handle Task Completion (if taskId provided AND passed)
    if (args.taskId && passed) {
      const task = await ctx.db.get(args.taskId);
      if (task) {
        // Use shared logic for consistent rewards/streaks
        return await completeTaskLogic(ctx, user, task, Date.now());
      }
    }

    // Fallback: Award XP for standalone quizzes (no taskId) or non-passing attempts
    const xpGained = args.score * 10;
    const newXp = user.xp + xpGained;

    await ctx.db.patch(user._id, {
      xp: newXp,
      level: levelFromXp(newXp),
      last_activity_date: Date.now(),
    });

    return { success: true, xp_gained: xpGained, new_level: levelFromXp(newXp) };
  },
});
