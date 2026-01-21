import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

test("mutation fails without identity", async () => {
  const t = convexTest(schema);
  
  // Create a valid task to get a valid ID
  const course = await t.run(async (ctx) => {
    return await ctx.db.insert("courses", { title: "C", description: "D", sequence_order: 1, is_active: true });
  });
  const week = await t.run(async (ctx) => {
    return await ctx.db.insert("weeks", { course_id: course, title: "W", description: "D", week_number: 1, is_locked: false });
  });
  const task = await t.run(async (ctx) => {
    return await ctx.db.insert("tasks", {
      week_id: week,
      title: "T",
      description: "D",
      task_type: "video",
      difficulty: "easy",
      xp_reward: 10,
      estimated_minutes: 10,
      required_for_streak: true
    });
  });

  // No identity set
  await expect(t.mutation(api.tasks.completeTask, {
    taskId: task
  })).rejects.toThrow("Unauthorized");
});

test("mutation succeeds with identity", async () => {
  const t = convexTest(schema);
  const user = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
        username: "sec_user",
        clerk_user_id: "sec_id",
        xp: 0,
        level: 1,
        gold: 0,
        streak: 0,
        hearts: 5,
        focus_points: 100,
        streak_freeze_count: 0
    });
  });

  const course = await t.run(async (ctx) => {
    return await ctx.db.insert("courses", { title: "C", description: "D", sequence_order: 1, is_active: true });
  });
  const week = await t.run(async (ctx) => {
    return await ctx.db.insert("weeks", { course_id: course, title: "W", description: "D", week_number: 1, is_locked: false });
  });
  const task = await t.run(async (ctx) => {
    return await ctx.db.insert("tasks", {
      week_id: week,
      title: "T",
      description: "D",
      task_type: "video",
      difficulty: "easy",
      xp_reward: 10,
      estimated_minutes: 10,
      required_for_streak: true
    });
  });

  // Action with identity
  const result = await t.withIdentity({ subject: "sec_id" }).mutation(api.tasks.completeTask, {
    taskId: task
  });

  expect(result.success).toBe(true);
});
