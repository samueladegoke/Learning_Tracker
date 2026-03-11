import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

/**
 * Auth Error Handling Tests
 *
 * These tests verify authentication error handling in Convex mutations.
 * Uses convex-test's withIdentity() to mock authenticated/unauthenticated states.
 */
describe("Auth Error Handling", () => {
  describe("Unauthorized Access", () => {
    test("mutation fails without authentication identity", async () => {
      const t = convexTest(schema);

      // Setup: Create a task but don't provide identity
      const course = await t.run(async (ctx) =>
        ctx.db.insert("courses", { title: "C", description: "D", sequence_order: 1, is_active: true })
      );
      const week = await t.run(async (ctx) =>
        ctx.db.insert("weeks", { course_id: course, title: "W", description: "D", week_number: 1, is_locked: false })
      );
      const task = await t.run(async (ctx) =>
        ctx.db.insert("tasks", {
          week_id: week,
          title: "T",
          description: "D",
          task_type: "video",
          difficulty: "easy",
          xp_reward: 100,
          estimated_minutes: 10,
          required_for_streak: true
        })
      );

      // Action: Attempt mutation without identity - should throw
      await expect(
        t.mutation(api.tasks.completeTask, { taskId: task })
      ).rejects.toThrow("Unauthorized: Please sign in");
    });

    test("query returns null/empty for unauthenticated user", async () => {
      const t = convexTest(schema);

      // getUser query should return null for unauthenticated requests
      const result = await t.query(api.tasks.getUser, {});
      expect(result).toBeNull();
    });
  });

  describe("User Not Found", () => {
    test("mutation fails for authenticated user not in database", async () => {
      const t = convexTest(schema);

      // Setup: Create a task
      const course = await t.run(async (ctx) =>
        ctx.db.insert("courses", { title: "C", description: "D", sequence_order: 1, is_active: true })
      );
      const week = await t.run(async (ctx) =>
        ctx.db.insert("weeks", { course_id: course, title: "W", description: "D", week_number: 1, is_locked: false })
      );
      const task = await t.run(async (ctx) =>
        ctx.db.insert("tasks", {
          week_id: week,
          title: "T",
          description: "D",
          task_type: "video",
          difficulty: "easy",
          xp_reward: 100,
          estimated_minutes: 10,
          required_for_streak: true
        })
      );

      // Provide identity but user doesn't exist in database
      await expect(
        t.withIdentity({ subject: "nonexistent_clerk_id" }).mutation(api.tasks.completeTask, { taskId: task })
      ).rejects.toThrow("User not found: Please complete registration");
    });
  });

  describe("Authenticated Access", () => {
    test("mutation succeeds for authenticated user in database", async () => {
      const t = convexTest(schema);

      // Setup: Create user with matching clerk_id
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          username: "authuser",
          clerk_user_id: "auth_clerk_id",
          xp: 0,
          level: 1,
          gold: 0,
          streak: 0,
          hearts: 5,
          focus_points: 100,
          streak_freeze_count: 0,
        });
      });

      // Create task
      const course = await t.run(async (ctx) =>
        ctx.db.insert("courses", { title: "C", description: "D", sequence_order: 1, is_active: true })
      );
      const week = await t.run(async (ctx) =>
        ctx.db.insert("weeks", { course_id: course, title: "W", description: "D", week_number: 1, is_locked: false })
      );
      const task = await t.run(async (ctx) =>
        ctx.db.insert("tasks", {
          week_id: week,
          title: "T",
          description: "D",
          task_type: "video",
          difficulty: "easy",
          xp_reward: 100,
          estimated_minutes: 10,
          required_for_streak: true
        })
      );

      // Action: Mutation with valid identity
      const result = await t.withIdentity({ subject: "auth_clerk_id" }).mutation(api.tasks.completeTask, {
        taskId: task
      });

      // Assert: Success
      expect(result.success).toBe(true);
    });
  });
});
