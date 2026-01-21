import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { xpForNextLevel, levelFromXp, FOCUS_CAP } from "./gamification";

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

export const submitQuizResult = mutation({
  args: {
    quizId: v.string(),
    score: v.number(),
    totalQuestions: v.number(),
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

    // 2. Award XP (e.g. 10 XP per correct answer)
    const xpGained = args.score * 10;
    const newXp = user.xp + xpGained;

    // 3. Update User
    await ctx.db.patch(user._id, {
      xp: newXp,
      level: levelFromXp(newXp),
      last_activity_date: Date.now(),
    });

    return { success: true, xp_gained: xpGained, new_level: levelFromXp(newXp) };
  },
});
