import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const SHOP_ITEMS = {
  streak_freeze: {
    id: "streak_freeze",
    name: "Streak Freeze",
    description: "Protect your streak for one missed day",
    cost: 50,
    type: "consumable",
    icon: "❄️"
  },
  health_potion: {
    id: "health_potion",
    name: "Health Potion",
    description: "Restore 1 heart",
    cost: 30,
    type: "consumable",
    icon: "❤️"
  },
  theme_cyberpunk: {
    id: "theme_cyberpunk",
    name: "Cyberpunk Theme",
    description: "Neon aesthetic for your dashboard",
    cost: 500,
    type: "cosmetic",
    icon: "🌆"
  }
};

// ========== QUERIES ==========

export const getRPGState = query({
  args: { clerkUserId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let userId = args.clerkUserId;
    if (!userId) {
        const identity = await ctx.auth.getUserIdentity();
        if (identity) userId = identity.subject;
    }
    if (!userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", userId!))
      .unique();

    if (!user) return null;

    // Get active quest
    const activeQuest = await ctx.db
      .query("userQuests")
      .withIndex("by_user", (q) => q.eq("user_id", user._id))
      .filter((q) => q.eq(q.field("completed_at"), undefined))
      .first();

    let questDetails = null;
    if (activeQuest) {
      const quest = await ctx.db.get(activeQuest.quest_id);
      if (quest) {
        questDetails = {
          ...quest,
          boss_hp_remaining: activeQuest.boss_hp_remaining
        };
      }
    }

    // Get active challenges
    const activeChallenges = await ctx.db
      .query("userChallenges")
      .withIndex("by_user", (q) => q.eq("user_id", user._id))
      .filter((q) => q.eq(q.field("completed_at"), undefined))
      .collect();

    const challengeDetails = await Promise.all(
      activeChallenges.map(async (uc) => {
        const challenge = await ctx.db.get(uc.challenge_id);
        return challenge ? { ...challenge, progress: uc.progress } : null;
      })
    );

    return {
      level: user.level,
      xp: user.xp,
      gold: user.gold,
      hearts: user.hearts,
      streak: user.streak,
      active_quest: questDetails,
      active_challenges: challengeDetails.filter(Boolean)
    };
  },
});

export const getShopItems = query({
  args: {},
  handler: async () => {
    return Object.values(SHOP_ITEMS);
  },
});

// ========== MUTATIONS ==========

export const buyItem = mutation({
  args: {
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const clerkUserId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", clerkUserId))
      .unique();

    if (!user) throw new Error("User not found");

    const item = SHOP_ITEMS[args.itemId as keyof typeof SHOP_ITEMS];
    if (!item) throw new Error("Item not found");

    if (user.gold < item.cost) {
      throw new Error("Not enough gold");
    }

    // Deduct gold
    await ctx.db.patch(user._id, {
      gold: user.gold - item.cost,
    });

    // Add to inventory or apply effect
    if (item.id === "health_potion") {
        await ctx.db.patch(user._id, {
            hearts: Math.min(5, user.hearts + 1)
        });
    } else if (item.id === "streak_freeze") {
        await ctx.db.patch(user._id, {
            streak_freeze_count: (user.streak_freeze_count || 0) + 1
        });
    } else {
        await ctx.db.insert("userInventory", {
            user_id: user._id,
            item_type: item.type,
            item_key: item.id,
            quantity: 1, // Logic for stacking/unique needed? assuming 1 for now
        });
    }

    return { success: true, new_gold: user.gold - item.cost, message: `Purchased ${item.name}` };
  },
});
