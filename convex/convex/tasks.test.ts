
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";
import * as tasks from "./tasks";

test("completeTask awards XP and Gold correctly", async () => {
    const t = convexTest(schema, { tasks }); // Manual modules injection

    // Setup: Create a week and task
    const weekId = await t.run(async (ctx) => {
        return await ctx.db.insert("weeks", {
            weekNumber: 1,
            title: "Test Week",
            focus: "Testing",
        });
    });

    await t.run(async (ctx) => {
        await ctx.db.insert("tasks", {
            taskId: "task-1",
            weekId,
            day: 1,
            description: "Test Task",
            type: "coding",
            xpReward: 100,
            difficulty: "normal", // 1.0x multiplier
            isBossTask: false,
        });
    });

    // Action: Complete task
    const result = await t.mutation(api.tasks.completeTask, {
        clerkUserId: "user_123",
        taskId: "task-1",
    });

    // Assertions
    expect(result.success).toBe(true);
    expect(result.xpGained).toBe(100);
    expect(result.goldGained).toBe(10); // 10% of XP
    expect(result.user.xp).toBe(100);
    expect(result.user.gold).toBe(10);
});

test("completeTask with Hard difficulty awards 1.5x XP", async () => {
    const t = convexTest(schema, { tasks });
    const weekId = await t.run(async (ctx) => {
        return await ctx.db.insert("weeks", { weekNumber: 1, title: "Test", focus: "Test" });
    });

    await t.run(async (ctx) => {
        await ctx.db.insert("tasks", {
            taskId: "task-hard",
            weekId,
            day: 1,
            description: "Hard Task",
            type: "coding",
            xpReward: 100,
            difficulty: "hard", // 1.5x
            isBossTask: false,
        });
    });

    const result = await t.mutation(api.tasks.completeTask, {
        clerkUserId: "user_hard",
        taskId: "task-hard",
    });

    expect(result.xpGained).toBe(150); // 100 * 1.5
    expect(result.goldGained).toBe(15);
});

test("completeTask updates streak correctly", async () => {
    const t = convexTest(schema, { tasks });

    // Create task
    const weekId = await t.run(async (ctx) => {
        return await ctx.db.insert("weeks", { weekNumber: 1, title: "Test", focus: "Test" });
    });

    await t.run(async (ctx) => {
        await ctx.db.insert("tasks", {
            taskId: "task-streak",
            weekId,
            day: 1,
            description: "Streak Task",
            type: "coding",
            xpReward: 10,
            difficulty: "normal",
            isBossTask: false,
        });
    });

    // Action: Complete task
    const result = await t.mutation(api.tasks.completeTask, {
        clerkUserId: "user_streak",
        taskId: "task-streak",
    });

    expect(result.streak).toBe(1);
    expect(result.user.streak).toBe(1);
    // Note: Testing multi-day streaks requires mocking Date.now or manually inserting users with past checkins,
    // which is complex in convex-test without deeper mocks. This validates the basic "first checkin" logic.
});

test("uncompleteTask reverses XP and Gold", async () => {
    const t = convexTest(schema, { tasks });

    // Setup
    const weekId = await t.run(async (ctx) => {
        return await ctx.db.insert("weeks", { weekNumber: 1, title: "Test", focus: "Test" });
    });

    await t.run(async (ctx) => {
        await ctx.db.insert("tasks", {
            taskId: "task-undo",
            weekId,
            day: 1,
            description: "Undo Task",
            type: "coding",
            xpReward: 100,
            difficulty: "normal",
            isBossTask: false,
        });
    });

    // 1. Complete
    await t.mutation(api.tasks.completeTask, {
        clerkUserId: "user_undo",
        taskId: "task-undo",
    });

    // 2. Uncomplete
    const result = await t.mutation(api.tasks.uncompleteTask, {
        clerkUserId: "user_undo",
        taskId: "task-undo",
    });

    expect(result.success).toBe(true);
    expect(result.xpDeducted).toBe(100);
    expect(result.user.xp).toBe(0);
    expect(result.user.gold).toBe(0);
});
