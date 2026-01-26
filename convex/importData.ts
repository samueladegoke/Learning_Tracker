/**
 * Type-Safe Import Functions for Convex
 * ======================================
 * 
 * These mutations are used by import scripts to insert data.
 * Each table has its own dedicated mutation with proper validation.
 */

import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// ============== COURSES ==============
export const insertCourse = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        sequence_order: v.number(),
        is_active: v.boolean(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("courses", args);
    },
});

// ============== WEEKS ==============
export const insertWeek = mutation({
    args: {
        course_id: v.id("courses"),
        title: v.string(),
        description: v.string(),
        week_number: v.number(),
        is_locked: v.boolean(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("weeks", args);
    },
});

// ============== TASKS ==============
export const insertTask = mutation({
    args: {
        week_id: v.id("weeks"),
        title: v.string(),
        description: v.string(),
        task_type: v.string(),
        difficulty: v.string(),
        xp_reward: v.number(),
        estimated_minutes: v.number(),
        required_for_streak: v.boolean(),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("tasks", args);
    },
});

// ============== USERS ==============
export const insertUser = mutation({
    args: {
        username: v.string(),
        clerk_user_id: v.string(),
        xp: v.number(),
        level: v.number(),
        streak: v.number(),
        best_streak: v.optional(v.number()),
        gold: v.number(),
        hearts: v.number(),
        focus_points: v.number(),
        focus_refreshed_at: v.optional(v.number()),
        streak_freeze_count: v.number(),
        last_activity_date: v.optional(v.number()),
        last_heart_loss: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("users", args);
    },
});

// ============== BADGES ==============
export const insertBadge = mutation({
    args: {
        badge_id: v.string(),
        name: v.string(),
        description: v.string(),
        xp_value: v.number(),
        difficulty: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("badges", args);
    },
});

// ============== ACHIEVEMENTS ==============
export const insertAchievement = mutation({
    args: {
        achievement_id: v.string(),
        name: v.string(),
        description: v.string(),
        xp_value: v.number(),
        difficulty: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("achievements", args);
    },
});

// ============== QUESTIONS ==============
export const insertQuestion = mutation({
    args: {
        quiz_id: v.string(),
        question_type: v.string(),
        text: v.string(),
        code: v.optional(v.string()),
        options: v.optional(v.string()),
        correct_index: v.optional(v.number()),
        starter_code: v.optional(v.string()),
        test_cases: v.optional(v.string()),
        solution_code: v.optional(v.string()),
        explanation: v.optional(v.string()),
        difficulty: v.string(),
        topic_tag: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("questions", args);
    },
});

// ============== BATCH INSERTS (for CLI compatibility) ==============
// These use internal mutations for bulk imports

export const insertRows = mutation({
    args: {
        table: v.union(
            v.literal("courses"),
            v.literal("weeks"),
            v.literal("tasks"),
            v.literal("users"),
            v.literal("badges"),
            v.literal("achievements"),
            v.literal("questions"),
            v.literal("userTaskStatuses"),
            v.literal("userBadges"),
            v.literal("userAchievements"),
            v.literal("quests"),
            v.literal("questTasks"),
            v.literal("userQuests"),
            v.literal("challenges"),
            v.literal("userChallenges"),
            v.literal("userInventory"),
            v.literal("quizResults"),
            v.literal("userQuestionReviews")
        ),
        rows: v.array(v.any())
    },
    handler: async (ctx, args) => {
        const ids = [];
        for (const row of args.rows) {
            // Validate table exists in schema before insert
            const id = await ctx.db.insert(args.table, row);
            ids.push(id);
        }
        return ids;
    },
});

export const insertRow = mutation({
    args: {
        table: v.union(
            v.literal("courses"),
            v.literal("weeks"),
            v.literal("tasks"),
            v.literal("users"),
            v.literal("badges"),
            v.literal("achievements"),
            v.literal("questions"),
            v.literal("userTaskStatuses"),
            v.literal("userBadges"),
            v.literal("userAchievements"),
            v.literal("quests"),
            v.literal("questTasks"),
            v.literal("userQuests"),
            v.literal("challenges"),
            v.literal("userChallenges"),
            v.literal("userInventory"),
            v.literal("quizResults"),
            v.literal("userQuestionReviews")
        ),
        data: v.any()
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert(args.table, args.data);
    },
});

// ============== UTILITIES ==============
export const countRows = query({
    args: {
        table: v.union(
            v.literal("courses"),
            v.literal("weeks"),
            v.literal("tasks"),
            v.literal("users"),
            v.literal("badges"),
            v.literal("achievements"),
            v.literal("questions"),
            v.literal("userTaskStatuses"),
            v.literal("userBadges"),
            v.literal("userAchievements"),
            v.literal("quests"),
            v.literal("questTasks"),
            v.literal("userQuests"),
            v.literal("challenges"),
            v.literal("userChallenges"),
            v.literal("userInventory"),
            v.literal("quizResults"),
            v.literal("userQuestionReviews")
        )
    },
    handler: async (ctx, args) => {
        const rows = await ctx.db.query(args.table).collect();
        return rows.length;
    },
});

export const clearTable = mutation({
    args: {
        table: v.union(
            v.literal("courses"),
            v.literal("weeks"),
            v.literal("tasks"),
            v.literal("users"),
            v.literal("badges"),
            v.literal("achievements"),
            v.literal("questions"),
            v.literal("userTaskStatuses"),
            v.literal("userBadges"),
            v.literal("userAchievements"),
            v.literal("quests"),
            v.literal("questTasks"),
            v.literal("userQuests"),
            v.literal("challenges"),
            v.literal("userChallenges"),
            v.literal("userInventory"),
            v.literal("quizResults"),
            v.literal("userQuestionReviews")
        ),
        limit: v.optional(v.number())
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 1000;
        const rows = await ctx.db.query(args.table).take(limit);
        let deleted = 0;
        for (const row of rows) {
            await ctx.db.delete(row._id);
            deleted++;
        }
        return { deleted, hasMore: rows.length === limit };
    },
});
