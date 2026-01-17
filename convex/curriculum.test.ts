
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

test("getWeeks returns all weeks", async () => {
    const t = convexTest(schema);

    // First create a course (required for weeks)
    const courseId = await t.run(async (ctx) => {
        return await ctx.db.insert("courses", {
            title: "Python 100 Days",
            description: "Learn Python in 100 days",
            sequence_order: 1,
            is_active: true
        });
    });

    await t.run(async (ctx) => {
        await ctx.db.insert("weeks", {
            course_id: courseId,
            title: "Week 1",
            description: "Introduction to Python",
            week_number: 1,
            is_locked: false
        });
        await ctx.db.insert("weeks", {
            course_id: courseId,
            title: "Week 2",
            description: "Control Flow and Logic",
            week_number: 2,
            is_locked: false
        });
    });

    const weeks = await t.query(api.curriculum.getWeeks, {});
    expect(weeks).toHaveLength(2);
    expect(weeks[0].title).toBe("Week 1");
});

test("getTasks returns tasks for a specific week", async () => {
    const t = convexTest(schema);

    // Create course first
    const courseId = await t.run(async (ctx) => {
        return await ctx.db.insert("courses", {
            title: "Python",
            description: "Test course",
            sequence_order: 1,
            is_active: true
        });
    });

    const w1 = await t.run(async (ctx) => {
        return await ctx.db.insert("weeks", {
            course_id: courseId,
            title: "W1",
            description: "Week 1 focus",
            week_number: 1,
            is_locked: false
        });
    });
    const w2 = await t.run(async (ctx) => {
        return await ctx.db.insert("weeks", {
            course_id: courseId,
            title: "W2",
            description: "Week 2 focus",
            week_number: 2,
            is_locked: false
        });
    });

    await t.run(async (ctx) => {
        await ctx.db.insert("tasks", {
            week_id: w1,
            title: "Day 1",
            description: "Task 1",
            task_type: "video",
            difficulty: "easy",
            xp_reward: 10,
            estimated_minutes: 30,
            required_for_streak: true
        });
        await ctx.db.insert("tasks", {
            week_id: w1,
            title: "Day 2",
            description: "Task 2",
            task_type: "exercise",
            difficulty: "medium",
            xp_reward: 20,
            estimated_minutes: 45,
            required_for_streak: true
        });
        await ctx.db.insert("tasks", {
            week_id: w2,
            title: "Day 8",
            description: "Task 3",
            task_type: "exercise",
            difficulty: "medium",
            xp_reward: 20,
            estimated_minutes: 45,
            required_for_streak: true
        });
    });

    const tasksW1 = await t.query(api.curriculum.getTasks, { weekId: w1 });
    expect(tasksW1).toHaveLength(2);

    const tasksW2 = await t.query(api.curriculum.getTasks, { weekId: w2 });
    expect(tasksW2).toHaveLength(1);
});
