import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./lib/auth";
import { levelFromXp } from "./gamification";

// ========== CONSTANTS ==========
export const ARTIFACT_XP_BONUS = 10;
export const MAX_FILE_SIZE_MB = 5;
export const MIN_REFLECTION_LENGTH = 50;

// Valid artifact types
export const ARTIFACT_TYPES = {
  screenshot: { label: "Screenshot", icon: "📷" },
  commit_url: { label: "Commit URL", icon: "🔗" },
  reflection: { label: "Reflection", icon: "📝" },
} as const;

// ========== QUERIES ==========

export const getUserArtifacts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const result = await getCurrentUser(ctx);
    if (!result.success) return [];
    const user = result.user;

    const artifacts = await ctx.db
      .query("userArtifacts")
      .withIndex("by_user", (q) => q.eq("user_id", user._id))
      .order("desc")
      .take(args.limit || 50);

    return artifacts;
  },
});

export const getArtifactByDay = query({
  args: {
    dayNumber: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate dayNumber bounds for API consistency with submitArtifact
    if (args.dayNumber < 1 || args.dayNumber > 100) {
      return null; // Return null for invalid day numbers (query is read-only)
    }

    const result = await getCurrentUser(ctx);
    if (!result.success) return null;
    const user = result.user;

    const artifact = await ctx.db
      .query("userArtifacts")
      .withIndex("by_user_and_day", (q) =>
        q.eq("user_id", user._id).eq("day_number", args.dayNumber)
      )
      .first();

    return artifact;
  },
});

// ========== MUTATIONS ==========

export const submitArtifact = mutation({
  args: {
    dayNumber: v.number(),
    artifactType: v.string(),
    content: v.string(),
    fileUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate dayNumber bounds (project is "100 Days of Code")
    if (args.dayNumber < 1 || args.dayNumber > 100) {
      throw new Error("Day number must be between 1 and 100");
    }

    const result = await getCurrentUser(ctx);
    if (!result.success) throw new Error(result.error);
    const user = result.user;

    // Validate artifact type
    const validTypes = Object.keys(ARTIFACT_TYPES);
    if (!validTypes.includes(args.artifactType)) {
      throw new Error(`Invalid artifact type. Must be one of: ${validTypes.join(", ")}`);
    }

    // Validate content based on type
    if (args.artifactType === "reflection") {
      if (args.content.length < MIN_REFLECTION_LENGTH) {
        throw new Error(`Reflection must be at least ${MIN_REFLECTION_LENGTH} characters`);
      }
    } else if (args.artifactType === "commit_url") {
      // GitHub.com URL validation (excludes GitHub Enterprise and Gists)
      try {
        const url = new URL(args.content);
        if (!["github.com", "www.github.com"].includes(url.hostname)) {
          throw new Error("Commit URL must be a valid GitHub URL");
        }
      } catch {
        throw new Error("Invalid URL format");
      }
    } else if (args.artifactType === "screenshot") {
      // For screenshots, content should be the image data URL or external URL
      if (!args.fileUrl && !args.content.startsWith("data:") && !args.content.startsWith("http")) {
        throw new Error("Screenshot must include a valid file URL or data URL");
      }
    }

    // Check if artifact already exists for this day
    const existing = await ctx.db
      .query("userArtifacts")
      .withIndex("by_user_and_day", (q) =>
        q.eq("user_id", user._id).eq("day_number", args.dayNumber)
      )
      .first();

    if (existing) {
      // Update existing artifact (no additional XP for updates)
      await ctx.db.patch(existing._id, {
        artifact_type: args.artifactType,
        content: args.content,
        file_url: args.fileUrl,
      });
    } else {
      // Create new artifact and award XP
      await ctx.db.insert("userArtifacts", {
        user_id: user._id,
        day_number: args.dayNumber,
        artifact_type: args.artifactType,
        content: args.content,
        file_url: args.fileUrl,
        xp_awarded: ARTIFACT_XP_BONUS,
        created_at: Date.now(),
      });

      // Award bonus XP with proper level calculation and activity tracking
      const newXp = user.xp + ARTIFACT_XP_BONUS;
      await ctx.db.patch(user._id, {
        xp: newXp,
        level: levelFromXp(newXp),
        last_activity_date: Date.now(),
      });
    }

    return {
      success: true,
      xp_awarded: existing ? 0 : ARTIFACT_XP_BONUS,
      message: existing ? "Artifact updated!" : `Artifact submitted! +${ARTIFACT_XP_BONUS} bonus XP!`,
    };
  },
});

export const deleteArtifact = mutation({
  args: {
    artifactId: v.id("userArtifacts"),
  },
  handler: async (ctx, args) => {
    const result = await getCurrentUser(ctx);
    if (!result.success) throw new Error(result.error);
    const user = result.user;

    const artifact = await ctx.db.get(args.artifactId);
    if (!artifact) {
      throw new Error("Artifact not found");
    }

    if (artifact.user_id.toString() !== user._id.toString()) {
      throw new Error("Not authorized to delete this artifact");
    }

    await ctx.db.delete(args.artifactId);

    // Prevent XP farming: deduct awarded XP
    if (artifact.xp_awarded && artifact.xp_awarded > 0) {
      const newXp = Math.max(0, user.xp - artifact.xp_awarded);
      await ctx.db.patch(user._id, {
        xp: newXp,
        level: levelFromXp(newXp)
      });
    }

    return { success: true, message: "Artifact deleted" };
  },
});
