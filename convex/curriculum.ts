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
      .withIndex("by_week", (q) => q.eq("weekId", args.weekId))
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
      .withIndex("by_week_number", (q) => q.eq("weekNumber", args.weekNumber))
      .first();
    return week;
  },
});

// Get user's progress for a week (count completed tasks)
export const getWeekProgress = query({
  args: { 
    weekId: v.id("weeks"),
    clerkUserId: v.string() 
  },
  handler: async (ctx, args) => {
    // Get all tasks for the week
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_week", (q) => q.eq("weekId", args.weekId))
      .collect();
    
    // Get user's completed tasks for these task IDs
    let completedCount = 0;
    for (const task of tasks) {
      const status = await ctx.db
        .query("userTaskStatuses")
        .withIndex("by_user_and_task", (q) => 
          q.eq("clerkUserId", args.clerkUserId).eq("taskId", task._id)
        )
        .first();
      if (status?.completed) {
        completedCount++;
      }
    }
    
    return {
      total: tasks.length,
      completed: completedCount,
      percentage: tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0,
    };
  },
});

// Get task by task_id string (e.g., "w1-d1")
export const getTaskByTaskId = query({
  args: { taskId: v.string() },
  handler: async (ctx, args) => {
    const task = await ctx.db
      .query("tasks")
      .withIndex("by_task_id", (q) => q.eq("taskId", args.taskId))
      .first();
    return task;
  },
});
