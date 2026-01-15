import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { levelFromXp, xpForNextLevel, FOCUS_CAP } from "./gamification";

export const SHOP_ITEMS = {
    "streak_freeze": { cost: 50, description: "Protects your streak for one day" },
    "potion_focus": { cost: 20, description: "Refills focus points to max" },
    "heart_refill": { cost: 100, description: "Restores one heart" },
};

export const getRPGState = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", identity.subject))
            .unique();

        if (!user) return null;

        // Active Quest
        const activeQuests = await ctx.db
            .query("userQuests")
            .withIndex("by_user", (q) => q.eq("user_id", user._id))
            .filter((q) => q.eq(q.field("completed_at"), undefined))
            .collect();
        const activeUserQuest = activeQuests[0]; // Assume 1 active for now

        let questPayload = null;
        if (activeUserQuest) {
            const quest = await ctx.db.get(activeUserQuest.quest_id);
            if (quest) {
                questPayload = {
                    id: quest._id, // Internal ID
                    name: quest.name,
                    boss_hp: quest.boss_hp,
                    boss_hp_remaining: activeUserQuest.boss_hp_remaining,
                    reward_badge_id: quest.reward_badge_id,
                };
            }
        }

        // Active Challenges
        const activeUserChallenges = await ctx.db
            .query("userChallenges")
            .withIndex("by_user", (q) => q.eq("user_id", user._id))
            .filter((q) => q.eq(q.field("completed_at"), undefined))
            .collect();

        const challengesPayload = [];
        for (const uc of activeUserChallenges) {
            const chal = await ctx.db.get(uc.challenge_id);
            if (chal) {
                challengesPayload.push({
                    id: chal._id,
                    name: chal.name,
                    progress: uc.progress,
                    goal: chal.goal_count,
                    ends_at: chal.ends_at,
                });
            }
        }

        return {
            xp: user.xp,
            level: levelFromXp(user.xp),
            next_level_xp: xpForNextLevel(levelFromXp(user.xp)), // Calculate next req
            gold: user.gold,
            streak: user.streak,
            focus_points: user.focus_points,
            focus_cap: FOCUS_CAP,
            active_quest: questPayload,
            active_challenges: challengesPayload,
            hearts: user.hearts,
            streak_freeze_count: user.streak_freeze_count,
        };
    },
});

export const buyItem = mutation({
    args: { itemId: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        const item = SHOP_ITEMS[args.itemId as keyof typeof SHOP_ITEMS];
        if (!item) throw new Error("Item not found");

        if ((user.gold || 0) < item.cost) {
            throw new Error("Not enough gold");
        }

        const updates: any = { gold: (user.gold || 0) - item.cost };

        if (args.itemId === "streak_freeze") {
            updates.streak_freeze_count = (user.streak_freeze_count || 0) + 1;
        } else if (args.itemId === "potion_focus") {
            updates.focus_points = FOCUS_CAP;
            updates.focus_refreshed_at = Date.now();
        } else if (args.itemId === "heart_refill") {
            if ((user.hearts || 0) >= 3) throw new Error("Hearts already full");
            updates.hearts = (user.hearts || 0) + 1;
        }

        await ctx.db.patch(user._id, updates);

        return { success: true, gold: updates.gold };
    },
});
