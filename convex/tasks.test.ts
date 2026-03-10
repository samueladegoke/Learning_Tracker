import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";
import { STREAK_BADGES } from "./tasks";
import { MS_PER_DAY } from "./lib/utils";

test("completeTask awards XP and Gold correctly", async () => {
  const t = convexTest(schema);

  // Setup
  const user = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      username: "testuser",
      clerk_user_id: "test_clerk_id",
      xp: 0,
      level: 1,
      gold: 0,
      streak: 0,
      hearts: 5,
      focus_points: 100,
      streak_freeze_count: 0,
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
      xp_reward: 100,
      estimated_minutes: 10,
      required_for_streak: true
    });
  });

  // Action
  const result = await t.withIdentity({ subject: "test_clerk_id" }).mutation(api.tasks.completeTask, {
    taskId: task
  });

  // Assert
  expect(result.success).toBe(true);
  expect(result.xp_gained).toBe(50);
  expect(result.gold_gained).toBe(5); // 10% of XP

  const updatedUser = await t.run(async (ctx) => await ctx.db.get(user));
  if (!updatedUser) throw new Error("User not found");
  expect(updatedUser.xp).toBe(50);
  expect(updatedUser.gold).toBe(5);
});

test("completeTask increments streak", async () => {
  const t = convexTest(schema);
  const now = Date.now();
  const yesterday = now - MS_PER_DAY;

  const user = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      username: "streakuser",
      clerk_user_id: "streak_id",
      xp: 0,
      level: 1,
      gold: 0,
      streak: 5,
      hearts: 5,
      focus_points: 100,
      streak_freeze_count: 0,
      last_activity_date: yesterday
    });
  });

  // Create dummy task structure (helper function would be nice but inline is fine)
  const course = await t.run(async (ctx) => ctx.db.insert("courses", { title: "C", description: "D", sequence_order: 1, is_active: true }));
  const week = await t.run(async (ctx) => ctx.db.insert("weeks", { course_id: course, title: "W", description: "D", week_number: 1, is_locked: false }));
  const task = await t.run(async (ctx) => ctx.db.insert("tasks", { week_id: week, title: "T", description: "D", task_type: "video", difficulty: "easy", xp_reward: 10, estimated_minutes: 10, required_for_streak: true }));

  await t.withIdentity({ subject: "streak_id" }).mutation(api.tasks.completeTask, { taskId: task });

  const updatedUser = await t.run(async (ctx) => await ctx.db.get(user));
  if (!updatedUser) throw new Error("User not found");
  expect(updatedUser.streak).toBe(6);
});

test("completeTask breaks streak if gap > 1 day", async () => {
  const t = convexTest(schema);
  const now = Date.now();
  const twoDaysAgo = now - MS_PER_DAY * 2 - 1000; // > 48h

  const user = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      username: "breakuser",
      clerk_user_id: "break_id",
      xp: 0,
      level: 1,
      gold: 0,
      streak: 10,
      hearts: 5,
      focus_points: 100,
      streak_freeze_count: 0,
      last_activity_date: twoDaysAgo
    });
  });

  const course = await t.run(async (ctx) => ctx.db.insert("courses", { title: "C", description: "D", sequence_order: 1, is_active: true }));
  const week = await t.run(async (ctx) => ctx.db.insert("weeks", { course_id: course, title: "W", description: "D", week_number: 1, is_locked: false }));
  const task = await t.run(async (ctx) => ctx.db.insert("tasks", { week_id: week, title: "T", description: "D", task_type: "video", difficulty: "easy", xp_reward: 10, estimated_minutes: 10, required_for_streak: true }));

  await t.withIdentity({ subject: "break_id" }).mutation(api.tasks.completeTask, { taskId: task });

  const updatedUser = await t.run(async (ctx) => await ctx.db.get(user));
  if (!updatedUser) throw new Error("User not found");
  expect(updatedUser.streak).toBe(1); // Resets to 1
});

test("uncompleteTask reverses rewards", async () => {
  const t = convexTest(schema);
  const user = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      username: "uncomplete",
      clerk_user_id: "uncomplete_id",
      xp: 100,
      level: 1,
      gold: 10,
      streak: 1,
      hearts: 5,
      focus_points: 100,
      streak_freeze_count: 0
    });
  });

  const course = await t.run(async (ctx) => ctx.db.insert("courses", { title: "C", description: "D", sequence_order: 1, is_active: true }));
  const week = await t.run(async (ctx) => ctx.db.insert("weeks", { course_id: course, title: "W", description: "D", week_number: 1, is_locked: false }));
  const task = await t.run(async (ctx) => ctx.db.insert("tasks", { week_id: week, title: "T", description: "D", task_type: "video", difficulty: "easy", xp_reward: 100, estimated_minutes: 10, required_for_streak: true }));

  // Set as completed
  await t.run(async (ctx) => {
    await ctx.db.insert("userTaskStatuses", {
      user_id: user,
      task_id: task,
      completed: true,
      completed_at: Date.now()
    });
  });

  // Action
  const result = await t.withIdentity({ subject: "uncomplete_id" }).mutation(api.tasks.uncompleteTask, {
    taskId: task
  });

  // Assert
  expect(result.success).toBe(true);
  expect(result.new_xp).toBe(50); // 100 - 50 (easy multiplier 0.5)
  expect(result.new_gold).toBe(5); // 10 - 5

  const updatedUser = await t.run(async (ctx) => await ctx.db.get(user));
  if (!updatedUser) throw new Error("User not found");
  expect(updatedUser.xp).toBe(50);
});

// ========== QUEST INTEGRATION TESTS ==========

test("completeTask reduces boss HP when task is part of active quest", async () => {
  const t = convexTest(schema);

  // Setup user
  const user = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      username: "questuser",
      clerk_user_id: "quest_clerk_id",
      xp: 0,
      level: 1,
      gold: 0,
      streak: 0,
      hearts: 5,
      focus_points: 100,
      streak_freeze_count: 0,
    });
  });

  // Setup course/week/task
  const course = await t.run(async (ctx) => ctx.db.insert("courses", { title: "C", description: "D", sequence_order: 1, is_active: true }));
  const week = await t.run(async (ctx) => ctx.db.insert("weeks", { course_id: course, title: "W", description: "D", week_number: 1, is_locked: false }));
  const task = await t.run(async (ctx) => ctx.db.insert("tasks", {
    week_id: week,
    title: "Quest Task",
    description: "D",
    task_type: "video",
    difficulty: "medium",
    xp_reward: 50,
    estimated_minutes: 10,
    required_for_streak: true
  }));

  // Setup quest
  const quest = await t.run(async (ctx) => ctx.db.insert("quests", {
    name: "Dragon Slayer",
    description: "Defeat the dragon",
    boss_hp: 100,
    reward_xp_bonus: 200,
  }));

  // Link task to quest
  await t.run(async (ctx) => ctx.db.insert("questTasks", {
    quest_id: quest,
    task_id: task,
  }));

  // Start quest for user
  await t.run(async (ctx) => ctx.db.insert("userQuests", {
    user_id: user,
    quest_id: quest,
    boss_hp_remaining: 100,
    started_at: Date.now(),
  }));

  // Action: Complete the quest task
  const result = await t.withIdentity({ subject: "quest_clerk_id" }).mutation(api.tasks.completeTask, {
    taskId: task
  });

  // Assert: Task completed successfully
  expect(result.success).toBe(true);
  // XP gained for medium difficulty: 50 * 1.0 = 50
  expect(result.xp_gained).toBe(50);

  // Assert: Boss HP reduced by XP gained
  const userQuest = await t.run(async (ctx) => {
    return await ctx.db.query("userQuests")
      .withIndex("by_user", (q) => q.eq("user_id", user))
      .first();
  });
  expect(userQuest).toBeDefined();
  expect(userQuest!.boss_hp_remaining).toBe(50); // 100 - 50 = 50
  expect(userQuest!.completed_at).toBeUndefined(); // Quest not completed yet
});

test("completeTask completes quest when boss HP reaches 0 and awards bonus XP", async () => {
  const t = convexTest(schema);

  // Setup user
  const user = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      username: "questcompleter",
      clerk_user_id: "quest_complete_id",
      xp: 0,
      level: 1,
      gold: 0,
      streak: 0,
      hearts: 5,
      focus_points: 100,
      streak_freeze_count: 0,
    });
  });

  // Setup course/week/task
  const course = await t.run(async (ctx) => ctx.db.insert("courses", { title: "C", description: "D", sequence_order: 1, is_active: true }));
  const week = await t.run(async (ctx) => ctx.db.insert("weeks", { course_id: course, title: "W", description: "D", week_number: 1, is_locked: false }));
  const task = await t.run(async (ctx) => ctx.db.insert("tasks", {
    week_id: week,
    title: "Final Blow",
    description: "D",
    task_type: "video",
    difficulty: "medium",
    xp_reward: 100,
    estimated_minutes: 10,
    required_for_streak: true
  }));

  // Setup quest with low HP (will be defeated by this task)
  const quest = await t.run(async (ctx) => ctx.db.insert("quests", {
    name: "Weak Boss",
    description: "Easy to defeat",
    boss_hp: 50, // XP gained (100) will exceed this
    reward_xp_bonus: 300,
  }));

  // Link task to quest
  await t.run(async (ctx) => ctx.db.insert("questTasks", {
    quest_id: quest,
    task_id: task,
  }));

  // Start quest for user with 50 HP remaining
  await t.run(async (ctx) => ctx.db.insert("userQuests", {
    user_id: user,
    quest_id: quest,
    boss_hp_remaining: 50, // One hit will defeat
    started_at: Date.now(),
  }));

  // Action: Complete the quest task
  const result = await t.withIdentity({ subject: "quest_complete_id" }).mutation(api.tasks.completeTask, {
    taskId: task
  });

  // Assert: Task completed
  expect(result.success).toBe(true);

  // Assert: Quest is completed
  const userQuest = await t.run(async (ctx) => {
    return await ctx.db.query("userQuests")
      .withIndex("by_user", (q) => q.eq("user_id", user))
      .first();
  });
  expect(userQuest).toBeDefined();
  expect(userQuest!.boss_hp_remaining).toBe(0);
  expect(userQuest!.completed_at).toBeDefined();

  // Assert: User got bonus XP (task XP + quest bonus)
  const updatedUser = await t.run(async (ctx) => await ctx.db.get(user));
  if (!updatedUser) throw new Error("User not found");
  // 100 (task XP) + 300 (quest bonus) = 400
  expect(updatedUser.xp).toBe(400);
});
