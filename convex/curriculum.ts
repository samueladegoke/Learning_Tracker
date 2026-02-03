import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all weeks ordered by week number
export const getWeeks = query({
  args: {},
  handler: async (ctx) => {
    const weeks = await ctx.db
      .query("weeks")
      .withIndex("by_week_number")
      .collect();
    return weeks;
  },
});

// Get tasks for a specific week
export const getTasks = query({
  args: { weekId: v.id("weeks") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_week", (q) => q.eq("week_id", args.weekId))
      .collect();
    return tasks;
  },
});

// Get week by week number
export const getWeekByNumber = query({
  args: { weekNumber: v.number() },
  handler: async (ctx, args) => {
    const week = await ctx.db
      .query("weeks")
      .withIndex("by_week_number", (q) => q.eq("week_number", args.weekNumber))
      .first();
    return week;
  },
});

// Get user's progress for a week (count completed tasks)
export const getWeekProgress = query({
  args: {
    weekId: v.id("weeks"),
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    // 1. Get all tasks for the week
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_week", (q) => q.eq("week_id", args.weekId))
      .collect();

    if (tasks.length === 0) return { total: 0, completed: 0, percentage: 0 };

    // 2. Batch fetch all task statuses for this user
    // We could filter by task IDs in memory, or use the existing user_id index
    const allUserStatuses = await ctx.db
      .query("userTaskStatuses")
      .withIndex("by_user_and_task", (q) => q.eq("user_id", args.userId))
      .collect();

    const completedTaskIds = new Set(
        allUserStatuses
            .filter(s => s.completed)
            .map(s => s.task_id)
    );

    // 3. Count matches
    const completedCount = tasks.filter(t => completedTaskIds.has(t._id)).length;

    return {
      total: tasks.length,
      completed: completedCount,
      percentage: Math.round((completedCount / tasks.length) * 100),
    };
  },
});

// Get task by legacy task_id
export const getTaskByLegacyId = query({
  args: { legacyTaskId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_legacy_id", (q) => q.eq("legacy_task_id", args.legacyTaskId))
      .first();
  },
});
