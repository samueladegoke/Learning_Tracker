import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", args.clerkUserId))
      .unique();

    if (!user) return null;

    // Calculate total progress
    const tasks = await ctx.db.query("tasks").collect();
    const totalTasks = tasks.length;

    const completed = await ctx.db
      .query("userTaskStatuses")
      .withIndex("by_user_and_task", (q) => q.eq("user_id", user._id))
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();
    
    const completedCount = completed.length;

    return {
      tasks_completed: completedCount,
      tasks_total: totalTasks,
      completion_percentage: totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0,
      streak: user.streak,
      best_streak: user.best_streak || user.streak,
      level: user.level,
      xp: user.xp,
    };
  },
});

export const getCalendar = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", args.clerkUserId))
      .unique();

    if (!user) return [];

    const statuses = await ctx.db
      .query("userTaskStatuses")
      .withIndex("by_user_and_task", (q) => q.eq("user_id", user._id))
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();

    // Group by date
    const activityMap = new Map<string, number>();
    statuses.forEach((s) => {
      if (s.completed_at) {
        const date = new Date(s.completed_at).toISOString().split('T')[0];
        activityMap.set(date, (activityMap.get(date) || 0) + 1);
      }
    });

    return Array.from(activityMap.entries()).map(([date, count]) => ({
      date,
      count,
      level: Math.min(4, Math.ceil(count / 2)), // 0-4 intensity
    }));
  },
});
