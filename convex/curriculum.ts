import { v } from "convex/values";
import { query } from "./_generated/server";

export const getWeeks = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("weeks")
            .withIndex("by_course", (q) => q.eq("course_id", args.courseId))
            .collect();
    },
});

export const getTasks = query({
    args: { weekId: v.id("weeks") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("tasks")
            .withIndex("by_week", (q) => q.eq("week_id", args.weekId))
            .collect();
    },
});

export const getWeekProgress = query({
    args: { weekId: v.id("weeks"), userId: v.id("users") }, // userId will be optional later for public view
    handler: async (ctx, args) => {
        // Get all tasks for the week
        const tasks = await ctx.db
            .query("tasks")
            .withIndex("by_week", (q) => q.eq("week_id", args.weekId))
            .collect();

        if (tasks.length === 0) return { completed: 0, total: 0 };

        // Get completion status for these tasks
        let completedCount = 0;

        // Efficiently check status
        // Note: In Phase 3 we will optimize this with a reactive aggregate or cleaner join pattern
        for (const task of tasks) {
            const status = await ctx.db
                .query("userTaskStatuses")
                .withIndex("by_user_and_task", (q) =>
                    q.eq("user_id", args.userId).eq("task_id", task._id)
                )
                .unique();

            if (status && status.completed) {
                completedCount++;
            }
        }

        return {
            completed: completedCount,
            total: tasks.length,
            percentage: Math.round((completedCount / tasks.length) * 100)
        };
    },
});
