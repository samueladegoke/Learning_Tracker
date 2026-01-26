import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { xpForNextLevel, levelFromXp, FOCUS_CAP } from "./gamification";
import { completeTaskLogic } from "./tasks";

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

export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    // Get top users by XP
    const users = await ctx.db
      .query("users")
      // Schema had `by_clerk_id`. No `by_xp`.
      // We'll scan.
      .collect();

    return users
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit)
      .map(u => ({
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
    clerkUserId: v.string(),
    questionId: v.id("questions"),
    selectedIndex: v.optional(v.number()),
    trustedPassed: v.optional(v.boolean()),
    codeAnswer: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", args.clerkUserId))
      .unique();

    if (!user) throw new Error("User not found");

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const clerkUserId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", clerkUserId))
      .unique();

    if (!user) throw new Error("User not found");

    // 1. Record Result
    await ctx.db.insert("quizResults", {
      user_id: user._id,
      quiz_id: args.quizId,
      score: args.score,
      total_questions: args.totalQuestions,
      completed_at: Date.now(),
    });

    const passed = (args.score / args.totalQuestions) >= 0.7;

    // 2. Handle Task Completion (if taskId provided AND passed)
    if (args.taskId && passed) {
      const task = await ctx.db.get(args.taskId);
      if (task) {
        // Use shared logic for consistent rewards/streaks
        return await completeTaskLogic(ctx, user, task, Date.now());
      }
    }

    // 3. Fallback: Award simple XP if not a linked task (or didn't pass, but score > 0?)
    // Actually, if they didn't pass, we might still want to give some partial XP?
    // Story says "score * 10" in original code.
    // If we completed the task, completeTaskLogic awards Task XP.
    // If we DID NOT complete the task (e.g. no taskId or failed), we might want to give partial credit?
    // But duplicate XP is bad.
    // Let's say: If taskId was processed, we return that result.
    // If not, we do the old logic.

    if (args.taskId && passed) {
      // Already handled above, just return current state
      return { 
        success: true, 
        xp_gained: 0, // Logic handled in completeTaskLogic, but we need to return something reasonable
        new_level: user.level // This might be stale if we didn't refetch, but acceptable
      };
    }

    // Old logic for standalone quizzes or non-passing attempts
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
