import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { xpForNextLevel, levelFromXp, FOCUS_CAP } from "./lib/xp";

// ========== SHOP CONFIGURATION ==========
// EXACT port from backend/app/routers/rpg.py

export const SHOP_ITEMS: Record<string, { cost: number; description: string }> = {
  streak_freeze: { cost: 50, description: "Protects your streak for one day" },
  potion_focus: { cost: 20, description: "Refills focus points to max" },
  heart_refill: { cost: 100, description: "Restores one heart" },
};

// ========== HELPER FUNCTIONS ==========

/**
 * Check if two timestamps are on the same day
 */
function isSameDay(ts1: number, ts2: number): boolean {
  const d1 = new Date(ts1);
  const d2 = new Date(ts2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Refresh focus points - reset to FOCUS_CAP once per day
 * EXACT port from backend refresh_focus_points()
 */
async function refreshFocusPoints(
  ctx: any,
  user: Doc<"users">
): Promise<Doc<"users">> {
  const now = Date.now();
  const lastRefresh = user.focusRefreshedAt;

  if (!lastRefresh || !isSameDay(lastRefresh, now)) {
    await ctx.db.patch(user._id, {
      focusPoints: FOCUS_CAP,
      focusRefreshedAt: now,
    });
    return { ...user, focusPoints: FOCUS_CAP, focusRefreshedAt: now };
  }

  return user;
}

// ========== QUERIES ==========

/**
 * Get RPG State - consolidated gamification stats
 * EXACT port from backend get_rpg_state()
 *
 * Returns: xp, level, next_level_xp, gold, streak, focus_points, focus_cap,
 *          active_quest, active_challenges, hearts, streak_freeze_count
 */
export const getRPGState = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const { clerkUserId } = args;

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      // Return default state for new users
      return {
        xp: 0,
        level: 1,
        nextLevelXp: xpForNextLevel(1),
        gold: 0,
        streak: 0,
        focusPoints: FOCUS_CAP,
        focusCap: FOCUS_CAP,
        activeQuest: null,
        activeChallenges: [],
        hearts: 5,
        streakFreezeCount: 0,
      };
    }

    // Get active quest (completedAt is null)
    const activeUserQuest = await ctx.db
      .query("userQuests")
      .withIndex("by_user", (q) => q.eq("clerkUserId", clerkUserId))
      .filter((q) => q.eq(q.field("completedAt"), undefined))
      .first();

    let activeQuest = null;
    if (activeUserQuest) {
      const quest = await ctx.db.get(activeUserQuest.questId);
      if (quest) {
        activeQuest = {
          id: quest._id,
          questId: quest.questId,
          name: quest.name,
          bossHp: quest.bossHp,
          bossHpRemaining: activeUserQuest.bossHpRemaining,
          rewardBadgeId: quest.rewardBadgeId,
        };
      }
    }

    // Get active challenges (completedAt is null)
    const userChallenges = await ctx.db
      .query("userChallenges")
      .withIndex("by_user", (q) => q.eq("clerkUserId", clerkUserId))
      .filter((q) => q.eq(q.field("completedAt"), undefined))
      .collect();

    const activeChallenges = await Promise.all(
      userChallenges.map(async (uc) => {
        const challenge = await ctx.db.get(uc.challengeId);
        if (!challenge) return null;
        return {
          id: challenge._id,
          challengeId: challenge.challengeId,
          name: challenge.name,
          progress: uc.progress,
          goal: challenge.goalCount,
          endsAt: challenge.endsAt,
        };
      })
    );

    return {
      xp: user.xp,
      level: levelFromXp(user.xp),
      nextLevelXp: xpForNextLevel(levelFromXp(user.xp)),
      gold: user.gold,
      streak: user.streak,
      focusPoints: user.focusPoints,
      focusCap: FOCUS_CAP,
      activeQuest,
      activeChallenges: activeChallenges.filter(Boolean),
      hearts: user.hearts,
      streakFreezeCount: user.streakFreezeCount,
    };
  },
});

/**
 * Get shop items - returns all available shop items with costs
 */
export const getShopItems = query({
  args: {},
  handler: async () => {
    return Object.entries(SHOP_ITEMS).map(([itemId, item]) => ({
      itemId,
      cost: item.cost,
      description: item.description,
    }));
  },
});

// ========== MUTATIONS ==========

/**
 * Buy an item from the shop
 * EXACT port from backend buy_item()
 */
export const buyItem = mutation({
  args: {
    clerkUserId: v.string(),
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const { clerkUserId, itemId } = args;

    // Validate item exists
    if (!(itemId in SHOP_ITEMS)) {
      throw new Error(`Item not found: ${itemId}`);
    }

    const item = SHOP_ITEMS[itemId];
    const cost = item.cost;

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check gold
    if (user.gold < cost) {
      throw new Error("Not enough gold");
    }

    // Apply item effect based on itemId
    if (itemId === "streak_freeze") {
      await ctx.db.patch(user._id, {
        gold: user.gold - cost,
        streakFreezeCount: user.streakFreezeCount + 1,
      });
    } else if (itemId === "potion_focus") {
      await ctx.db.patch(user._id, {
        gold: user.gold - cost,
        focusPoints: FOCUS_CAP,
        focusRefreshedAt: Date.now(),
      });
    } else if (itemId === "heart_refill") {
      if (user.hearts >= 3) {
        throw new Error("Hearts already full");
      }
      await ctx.db.patch(user._id, {
        gold: user.gold - cost,
        hearts: user.hearts + 1,
      });
    }

    return {
      success: true,
      message: `Bought ${itemId}`,
      gold: user.gold - cost,
    };
  },
});

/**
 * Award XP directly (e.g., from quiz completion)
 * EXACT port from backend award_xp()
 */
export const awardXp = mutation({
  args: {
    clerkUserId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const { clerkUserId, amount } = args;

    if (amount <= 0) {
      throw new Error("XP amount must be positive");
    }
    if (amount > 1000) {
      throw new Error("XP amount too large (max 1000 per request)");
    }

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const oldLevel = levelFromXp(user.xp);
    const newXp = user.xp + amount;
    const newLevel = levelFromXp(newXp);

    await ctx.db.patch(user._id, {
      xp: newXp,
      level: newLevel,
    });

    return {
      xpAwarded: amount,
      totalXp: newXp,
      level: newLevel,
      leveledUp: newLevel > oldLevel,
    };
  },
});

/**
 * Apply quest damage - called when a quest-related task is completed
 * Returns true if boss was defeated
 */
export const applyQuestDamage = mutation({
  args: {
    clerkUserId: v.string(),
    damage: v.number(),
  },
  handler: async (ctx, args) => {
    const { clerkUserId, damage } = args;

    // Find active quest
    const activeUserQuest = await ctx.db
      .query("userQuests")
      .withIndex("by_user", (q) => q.eq("clerkUserId", clerkUserId))
      .filter((q) => q.eq(q.field("completedAt"), undefined))
      .first();

    if (!activeUserQuest) {
      return { applied: false, message: "No active quest" };
    }

    const newHp = Math.max(0, activeUserQuest.bossHpRemaining - damage);
    const defeated = newHp === 0;

    if (defeated) {
      // Mark quest as completed
      await ctx.db.patch(activeUserQuest._id, {
        bossHpRemaining: 0,
        completedAt: Date.now(),
      });

      // Get quest for reward info
      const quest = await ctx.db.get(activeUserQuest.questId);

      return {
        applied: true,
        defeated: true,
        questId: quest?.questId,
        rewardBadgeId: quest?.rewardBadgeId,
        rewardXpBonus: quest?.rewardXpBonus || 0,
      };
    } else {
      // Just apply damage
      await ctx.db.patch(activeUserQuest._id, {
        bossHpRemaining: newHp,
      });

      return {
        applied: true,
        defeated: false,
        bossHpRemaining: newHp,
      };
    }
  },
});

/**
 * Apply challenge progress - called when tasks are completed
 * Returns true if challenge was completed
 */
export const applyChallengeProgress = mutation({
  args: {
    clerkUserId: v.string(),
    progressAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const { clerkUserId, progressAmount } = args;

    // Get all active challenges
    const activeChallenges = await ctx.db
      .query("userChallenges")
      .withIndex("by_user", (q) => q.eq("clerkUserId", clerkUserId))
      .filter((q) => q.eq(q.field("completedAt"), undefined))
      .collect();

    const completedChallenges: string[] = [];

    for (const uc of activeChallenges) {
      const challenge = await ctx.db.get(uc.challengeId);
      if (!challenge) continue;

      // Check if challenge has expired
      if (challenge.endsAt && Date.now() > challenge.endsAt) {
        continue;
      }

      const newProgress = uc.progress + progressAmount;

      if (newProgress >= challenge.goalCount) {
        // Challenge completed!
        await ctx.db.patch(uc._id, {
          progress: challenge.goalCount,
          completedAt: Date.now(),
        });
        completedChallenges.push(challenge.challengeId);
      } else {
        // Update progress
        await ctx.db.patch(uc._id, {
          progress: newProgress,
        });
      }
    }

    return {
      applied: true,
      completedChallenges,
    };
  },
});

/**
 * Start a quest for user
 */
export const startQuest = mutation({
  args: {
    clerkUserId: v.string(),
    questId: v.string(), // business key
  },
  handler: async (ctx, args) => {
    const { clerkUserId, questId } = args;

    // Find quest by business key
    const quest = await ctx.db
      .query("quests")
      .withIndex("by_quest_id", (q) => q.eq("questId", questId))
      .first();

    if (!quest) {
      throw new Error(`Quest not found: ${questId}`);
    }

    // Check if already has this quest
    const existing = await ctx.db
      .query("userQuests")
      .withIndex("by_user_and_quest", (q) =>
        q.eq("clerkUserId", clerkUserId).eq("questId", quest._id)
      )
      .first();

    if (existing && !existing.completedAt) {
      throw new Error("Quest already active");
    }

    // Start new quest
    await ctx.db.insert("userQuests", {
      clerkUserId,
      questId: quest._id,
      bossHpRemaining: quest.bossHp,
      startedAt: Date.now(),
      completedAt: undefined,
    });

    return {
      success: true,
      questId: quest.questId,
      bossHp: quest.bossHp,
    };
  },
});

/**
 * Join a challenge
 */
export const joinChallenge = mutation({
  args: {
    clerkUserId: v.string(),
    challengeId: v.string(), // business key
  },
  handler: async (ctx, args) => {
    const { clerkUserId, challengeId } = args;

    // Find challenge by business key
    const challenge = await ctx.db
      .query("challenges")
      .withIndex("by_challenge_id", (q) => q.eq("challengeId", challengeId))
      .first();

    if (!challenge) {
      throw new Error(`Challenge not found: ${challengeId}`);
    }

    // Check if already joined
    const existing = await ctx.db
      .query("userChallenges")
      .withIndex("by_user_and_challenge", (q) =>
        q.eq("clerkUserId", clerkUserId).eq("challengeId", challenge._id)
      )
      .first();

    if (existing) {
      throw new Error("Already joined this challenge");
    }

    // Join challenge
    await ctx.db.insert("userChallenges", {
      clerkUserId,
      challengeId: challenge._id,
      progress: 0,
      completedAt: undefined,
    });

    return {
      success: true,
      challengeId: challenge.challengeId,
      goal: challenge.goalCount,
    };
  },
});
