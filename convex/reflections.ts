import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserByClerkId, getCurrentUser } from "./lib/auth";

export const getByWeek = query({
  args: {
    userId: v.id("users"),
    weekId: v.id("weeks")
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reflections")
      .withIndex("by_user_and_week", (q) =>
        q.eq("user_id", args.userId).eq("week_id", args.weekId)
      )
      .first();
  },
});

export const getAll = query({
  args: {
    clerkUserId: v.string()
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkUserId);
    if (!user) return [];

    return await ctx.db
      .query("reflections")
      .withIndex("by_user_and_week", (q) => q.eq("user_id", user._id))
      .collect();
  },
});

export const saveReflection = mutation({
  args: {
    weekId: v.id("weeks"),
    content: v.string(),
    sentiment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const result = await getCurrentUser(ctx);
    if (!result.success) throw new Error(result.error);
    const user = result.user;

    const existing = await ctx.db
      .query("reflections")
      .withIndex("by_user_and_week", (q) =>
        q.eq("user_id", user._id).eq("week_id", args.weekId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        sentiment: args.sentiment,
        updated_at: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("reflections", {
        user_id: user._id,
        week_id: args.weekId,
        content: args.content,
        sentiment: args.sentiment,
        created_at: Date.now(),
      });
    }
  },
});
