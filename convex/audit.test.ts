import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

test("best_streak is updated when new streak is higher", async () => {
  const t = convexTest(schema);
  const now = Date.now();
  const yesterday = now - 24 * 60 * 60 * 1000;

  const user = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      username: "streakuser",
      clerk_user_id: "streak_id",
      xp: 0,
      level: 1,
      gold: 0,
      streak: 5,
      best_streak: 5,
      hearts: 5,
      focus_points: 100,
      streak_freeze_count: 0,
      last_activity_date: yesterday
    });
  });

  const course = await t.run(async (ctx) => ctx.db.insert("courses", { title: "C", description: "D", sequence_order: 1, is_active: true }));
  const week = await t.run(async (ctx) => ctx.db.insert("weeks", { course_id: course, title: "W", description: "D", week_number: 1, is_locked: false }));
  const task = await t.run(async (ctx) => ctx.db.insert("tasks", { 
    week_id: week, 
    title: "T", 
    description: "D", 
    task_type: "video", 
    difficulty: "medium", 
    xp_reward: 10, 
    estimated_minutes: 10, 
    required_for_streak: true 
  }));

  // Complete task
  await t.withIdentity({ subject: "streak_id", issuer: "clerk" }).mutation(api.tasks.completeTask, { 
    taskId: task 
  });

  const updatedUser = await t.run(async (ctx) => await ctx.db.get(user));
  if (!updatedUser) throw new Error("User not found");
  expect(updatedUser.streak).toBe(6);
  expect(updatedUser.best_streak).toBe(6);
});

test("getTaskByLegacyId retrieves task", async () => {
  const t = convexTest(schema);
  
  const course = await t.run(async (ctx) => ctx.db.insert("courses", { title: "C", description: "D", sequence_order: 1, is_active: true }));
  const week = await t.run(async (ctx) => ctx.db.insert("weeks", { course_id: course, title: "W", description: "D", week_number: 1, is_locked: false }));
  
  const task = await t.run(async (ctx) => {
    return await ctx.db.insert("tasks", { 
        week_id: week, 
        title: "T", 
        description: "D", 
        task_type: "video", 
        difficulty: "easy", 
        xp_reward: 10, 
        estimated_minutes: 10, 
        required_for_streak: true,
        legacy_task_id: "legacy_123"
    });
  });

  const retrieved = await t.query(api.curriculum.getTaskByLegacyId, { legacyTaskId: "legacy_123" });
  expect(retrieved).not.toBeNull();
  expect(retrieved?._id).toBe(task);
});
