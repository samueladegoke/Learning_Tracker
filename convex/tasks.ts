import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { calculateStreakUpdate, levelFromXp, DIFFICULTY_MULTIPLIER } from "./gamification";

export const completeTask = mutation({
    args: {
        taskId: v.string(), // Accepts Convex ID string or potentially legacy string (handled in logic)
        clerkUserId: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Get User
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", args.clerkUserId))
            .unique();

        if (!user) throw new Error("User not found");

        // 2. Resolve Task ID
        // Try to normalize to a native Convex ID
        const taskId = ctx.db.normalizeId("tasks", args.taskId);
        if (!taskId) {
            throw new Error(`Invalid Task ID: ${args.taskId}. Migration requires valid Convex IDs.`);
        }
        const task = await ctx.db.get(taskId);
        if (!task) throw new Error("Task not found");

        // 3. Check Status
        const existingStatus = await ctx.db
            .query("userTaskStatuses")
            .withIndex("by_user_and_task", (q) =>
                q.eq("user_id", user._id).eq("task_id", taskId)
            )
            .unique();

        if (existingStatus?.completed) {
            return { already_completed: true };
        }

        // 4. Update Status
        if (existingStatus) {
            await ctx.db.patch(existingStatus._id, {
                completed: true,
                completed_at: Date.now()
            });
        } else {
            await ctx.db.insert("userTaskStatuses", {
                user_id: user._id,
                task_id: taskId,
                completed: true,
                completed_at: Date.now(),
            });
        }

        // 5. XP & Streak
        const diffMult = DIFFICULTY_MULTIPLIER[task.difficulty || "normal"] || 1.0;
        let xpGained = Math.floor((task.xp_reward || 10) * diffMult);
        const goldGained = Math.floor(xpGained / 10);

        // Streak logic
        const { streak, lastCheckinAt } = calculateStreakUpdate(user.last_activity_date, user.streak || 0);

        // QUEST LOGIC
        const activeUserQuest = await ctx.db
            .query("userQuests")
            .withIndex("by_user", (q) => q.eq("user_id", user._id))
            .filter((q) => q.eq(q.field("completed_at"), undefined))
            .first();

        if (activeUserQuest) {
            const damage = Math.floor(10 * diffMult); // Base 10 damage * difficulty
            const newHp = (activeUserQuest.boss_hp_remaining || 100) - damage;

            if (newHp <= 0) {
                // Quest Completed!
                const quest = await ctx.db.get(activeUserQuest.quest_id);
                if (quest) {
                    await ctx.db.patch(activeUserQuest._id, {
                        boss_hp_remaining: 0,
                        completed_at: Date.now()
                    });

                    // Award Quest Bonus
                    if (quest.reward_xp_bonus) {
                        xpGained += quest.reward_xp_bonus;
                    }

                    // Award Badge
                    if (quest.reward_badge_id) {
                        const badge = await ctx.db
                            .query("badges")
                            .withIndex("by_badge_id", (q) => q.eq("badge_id", quest.reward_badge_id!))
                            .unique();

                        if (badge) {
                            const hasBadge = await ctx.db
                                .query("userBadges")
                                .withIndex("by_user_and_badge", (q) => q.eq("user_id", user._id).eq("badge_id", badge._id))
                                .unique();

                            if (!hasBadge) {
                                await ctx.db.insert("userBadges", {
                                    user_id: user._id,
                                    badge_id: badge._id,
                                    earned_at: Date.now()
                                });
                            }
                        }
                    }
                }
            } else {
                await ctx.db.patch(activeUserQuest._id, { boss_hp_remaining: newHp });
            }
        }

        // Update User
        const newXp = (user.xp || 0) + xpGained; // Add quest bonus here if complex
        const newLevel = levelFromXp(newXp);
        const levelUp = newLevel > (user.level || 1);

        await ctx.db.patch(user._id, {
            xp: newXp,
            level: newLevel,
            streak: streak,
            last_activity_date: lastCheckinAt,
            gold: (user.gold || 0) + goldGained,
            hearts: user.hearts, // Preserve existing
            focus_points: user.focus_points // Preserve existing
        });

        return {
            completed: true,
            xp_gained: xpGained,
            gold_gained: goldGained,
            level_up: levelUp,
            new_level: newLevel,
            streak: streak
        };
    },
});

export const uncompleteTask = mutation({
    args: {
        taskId: v.string(),
        clerkUserId: v.string(),
    },
    handler: async (ctx, args) => {
        const taskId = ctx.db.normalizeId("tasks", args.taskId);
        if (!taskId) throw new Error("Invalid Task ID");

        // Reversal logic (simplified for now)
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", args.clerkUserId))
            .unique();
        if (!user) throw new Error("User not found");

        const status = await ctx.db
            .query("userTaskStatuses")
            .withIndex("by_user_and_task", (q) => q.eq("user_id", user._id).eq("task_id", args.taskId))
            .unique();

        if (status && status.completed) {
            await ctx.db.patch(status._id, { completed: false, completed_at: undefined });
            // Deduct XP? Logic says yes. 
            // Implementation pending full Gamification port.
        }
        return { uncompleted: true };
    }
});
