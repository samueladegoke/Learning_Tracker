import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

/**
 * Artifact Validation Tests
 *
 * Tests for dayNumber bounds validation (1-100) in submitArtifact mutation.
 */
describe("Artifact Validation", () => {
  describe("dayNumber bounds", () => {
    test("submitArtifact rejects dayNumber = 0", async () => {
      const t = convexTest(schema);

      // Setup user
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
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

      // Action: Submit with dayNumber = 0
      await expect(
        t.withIdentity({ subject: "test_clerk_id" }).mutation(api.artifacts.submitArtifact, {
          dayNumber: 0,
          artifactType: "reflection",
          content: "This is a test reflection that meets the minimum length requirement.",
        })
      ).rejects.toThrow("Day number must be between 1 and 100");
    });

    test("submitArtifact rejects dayNumber = 101", async () => {
      const t = convexTest(schema);

      // Setup user
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
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

      // Action: Submit with dayNumber = 101
      await expect(
        t.withIdentity({ subject: "test_clerk_id" }).mutation(api.artifacts.submitArtifact, {
          dayNumber: 101,
          artifactType: "reflection",
          content: "This is a test reflection that meets the minimum length requirement.",
        })
      ).rejects.toThrow("Day number must be between 1 and 100");
    });

    test("submitArtifact rejects negative dayNumber", async () => {
      const t = convexTest(schema);

      // Setup user
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
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

      // Action: Submit with negative dayNumber
      await expect(
        t.withIdentity({ subject: "test_clerk_id" }).mutation(api.artifacts.submitArtifact, {
          dayNumber: -5,
          artifactType: "reflection",
          content: "This is a test reflection that meets the minimum length requirement.",
        })
      ).rejects.toThrow("Day number must be between 1 and 100");
    });

    test("submitArtifact accepts dayNumber = 1", async () => {
      const t = convexTest(schema);

      // Setup user
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
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

      // Action: Submit with dayNumber = 1 (valid boundary)
      const result = await t.withIdentity({ subject: "test_clerk_id" }).mutation(api.artifacts.submitArtifact, {
        dayNumber: 1,
        artifactType: "reflection",
        content: "This is a test reflection that meets the minimum length requirement.",
      });

      // Assert: Success
      expect(result.success).toBe(true);
      expect(result.xp_awarded).toBe(10);
    });

    test("submitArtifact accepts dayNumber = 100", async () => {
      const t = convexTest(schema);

      // Setup user
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
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

      // Action: Submit with dayNumber = 100 (valid boundary)
      const result = await t.withIdentity({ subject: "test_clerk_id" }).mutation(api.artifacts.submitArtifact, {
        dayNumber: 100,
        artifactType: "reflection",
        content: "This is a test reflection that meets the minimum length requirement.",
      });

      // Assert: Success
      expect(result.success).toBe(true);
      expect(result.xp_awarded).toBe(10);
    });
  });
});
