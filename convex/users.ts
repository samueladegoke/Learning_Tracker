import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", identity.subject))
            .unique();
        return user;
    },
});

export const syncUser = mutation({
    args: {
        username: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated call to syncUser");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", identity.subject))
            .unique();

        if (user) {
            // Update if needed
            if (args.username && user.username !== args.username) {
                await ctx.db.patch(user._id, { username: args.username });
            }
            return user._id;
        }

        // Create new user
        const newUserId = await ctx.db.insert("users", {
            username: args.username || identity.name || identity.email || "Anonymous",
            clerk_user_id: identity.subject,
            xp: 0,
            level: 1,
            streak: 0,
            last_activity_date: Date.now(),
            gold: 0,
            hearts: 3,
            focus_points: 5,
            streak_freeze_count: 0,
            // Add defaults matching models.py if needed, e.g. gold, hearts
        });

        return newUserId;
    },
});
