import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { xpForNextLevel, levelFromXp, FOCUS_CAP } from "./gamification";
import { isSameDay } from "./lib/utils";

// ========== SHOP CONFIGURATION ==========
export const SHOP_ITEMS: Record<string, { cost: number; description: string }> = {
  streak_freeze: { cost: 50, description: "Protects your streak for one day" },
  potion_focus: { cost: 20, description: "Refills focus points to max" },
  heart_refill: { cost: 100, description: "Restores one heart" },
};

// ========== QUERIES ==========

/**
 * Get RPG State - consolidated gamification stats
 */
export const getRPGState = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", args.clerkUserId))
      .unique();

    if (!user) {
      return {
        xp: 0,
        level: 1,
        next_level_xp: xpForNextLevel(1),
        gold: 0,
        streak: 0,
        focus_points: FOCUS_CAP,
        focus_cap: FOCUS_CAP,
        active_quest: null,
        active_challenges: [],
        hearts: 5,
        streak_freeze_count: 0,
      };
    }

    // Refresh focus points if new day
    const now = Date.now();
    let focusPoints = user.focus_points;
    if (!user.focus_refreshed_at || !isSameDay(user.focus_refreshed_at, now)) {
      focusPoints = FOCUS_CAP;
      await ctx.db.patch(user._id, {
        focus_points: FOCUS_CAP,
        focus_refreshed_at: now,
      });
    }

    // Get active quest
    const activeUserQuest = await ctx.db
      .query("userQuests")
      .withIndex("by_user", (q) => q.eq("user_id", user._id))
      .filter((q) => q.eq(q.field("completed_at"), undefined))
      .first();

    let questPayload = null;
    if (activeUserQuest) {
      const quest = await ctx.db.get(activeUserQuest.quest_id);
      if (quest) {
        questPayload = {
          id: quest._id,
          name: quest.name,
          boss_hp: quest.boss_hp,
          boss_hp_remaining: activeUserQuest.boss_hp_remaining,
          reward_badge_id: quest.reward_badge_id,
        };
      }
    }

    // Get active challenges
    const activeUserChallenges = await ctx.db
      .query("userChallenges")
      .withIndex("by_user", (q) => q.eq("user_id", user._id))
      .filter((q) => q.eq(q.field("completed_at"), undefined))
      .collect();

    const challengesPayload = await Promise.all(
      activeUserChallenges.map(async (uc) => {
        const challenge = await ctx.db.get(uc.challenge_id);
        if (!challenge) return null;
        return {
          id: challenge._id,
          name: challenge.name,
          progress: uc.progress,
          goal: challenge.goal_count,
          ends_at: challenge.ends_at,
        };
      })
    );

    return {
      xp: user.xp,
      level: levelFromXp(user.xp),
      next_level_xp: xpForNextLevel(levelFromXp(user.xp)),
      gold: user.gold,
      streak: user.streak,
      focus_points: focusPoints,
      focus_cap: FOCUS_CAP,
      active_quest: questPayload,
      active_challenges: challengesPayload.filter(Boolean),
      hearts: user.hearts,
      streak_freeze_count: user.streak_freeze_count,
    };
  },
});

/**
 * Get shop items
 */
export const getShopItems = query({
  args: {},
  handler: async () => {
    return Object.entries(SHOP_ITEMS).map(([key, item]) => ({
      item_id: key,
      cost: item.cost,
      description: item.description,
    }));
  },
});

// ========== MUTATIONS ==========

/**
 * Buy item from shop
 */
export const buyItem = mutation({
  args: {
    clerkUserId: v.string(),
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", args.clerkUserId))
      .unique();
    if (!user) throw new Error("User not found");

    const item = SHOP_ITEMS[args.itemId];
    if (!item) throw new Error("Item not found");

    if (user.gold < item.cost) {
      throw new Error("Not enough gold");
    }

    const updates: Partial<Doc<"users">> = { gold: user.gold - item.cost };

    if (args.itemId === "streak_freeze") {
      updates.streak_freeze_count = (user.streak_freeze_count || 0) + 1;
    } else if (args.itemId === "potion_focus") {
      updates.focus_points = FOCUS_CAP;
      updates.focus_refreshed_at = Date.now();
    } else if (args.itemId === "heart_refill") {
      if (user.hearts >= 5) throw new Error("Hearts already full");
      updates.hearts = (user.hearts || 0) + 1;
    }

    await ctx.db.patch(user._id, updates);

    return {
      success: true,
      new_gold: updates.gold,
      item_purchased: args.itemId,
    };
  },
});

/**
 * Use streak freeze (called automatically at midnight check)
 */
export const useStreakFreeze = mutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", args.clerkUserId))
      .unique();
    if (!user) throw new Error("User not found");

    if ((user.streak_freeze_count || 0) <= 0) {
      throw new Error("No streak freezes available");
    }

    await ctx.db.patch(user._id, {
      streak_freeze_count: user.streak_freeze_count - 1,
      last_activity_date: Date.now(), // Preserve streak
    });

    return { success: true, remaining_freezes: user.streak_freeze_count - 1 };
  },
});
