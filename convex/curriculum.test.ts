
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

test("getWeeks returns all weeks", async () => {
    const t = convexTest(schema);

    await t.run(async (ctx) => {
        await ctx.db.insert("courses", {
            name: "Python",
            description: "Test",
            totalDays: 100,
            isActive: true
        });

        await ctx.db.insert("weeks", { weekNumber: 1, title: "Week 1", focus: "Intro" });
        await ctx.db.insert("weeks", { weekNumber: 2, title: "Week 2", focus: "Logic" });
    });

    const weeks = await t.query(api.curriculum.getWeeks, {});
    expect(weeks).toHaveLength(2);
    expect(weeks[0].title).toBe("Week 1");
});

test("getTasks returns tasks for a specific week", async () => {
    const t = convexTest(schema);

    const w1 = await t.run(async (ctx) => {
        return await ctx.db.insert("weeks", { weekNumber: 1, title: "W1", focus: "F1" });
    });
    const w2 = await t.run(async (ctx) => {
        return await ctx.db.insert("weeks", { weekNumber: 2, title: "W2", focus: "F2" });
    });

    await t.run(async (ctx) => {
        await ctx.db.insert("tasks", { taskId: "t1", weekId: w1, day: 1, description: "T1", type: "video", xpReward: 10, difficulty: "easy", isBossTask: false });
        await ctx.db.insert("tasks", { taskId: "t2", weekId: w1, day: 2, description: "T2", type: "coding", xpReward: 20, difficulty: "normal", isBossTask: false });
        await ctx.db.insert("tasks", { taskId: "t3", weekId: w2, day: 8, description: "T3", type: "coding", xpReward: 20, difficulty: "normal", isBossTask: false });
    });

    const tasksW1 = await t.query(api.curriculum.getTasks, { weekId: w1 });
    expect(tasksW1).toHaveLength(2);

    const tasksW2 = await t.query(api.curriculum.getTasks, { weekId: w2 });
    expect(tasksW2).toHaveLength(1);
});
