import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { isSameDay, isYesterday } from "./lib/utils";
import { xpForNextLevel, levelFromXp, FOCUS_CAP, DIFFICULTY_MULTIPLIER } from "./gamification";

// ... (constants and helpers remain same)
export const STREAK_BADGES: Record<number, string> = {
  3: "b-streak-3",
  7: "b-streak-7",
  14: "b-streak-14",
  30: "b-streak-30",
};

export const TASK_COUNT_ACHIEVEMENTS: Record<number, string> = {
  1: "a-first-task",
  10: "a-ten-tasks",
  50: "a-fifty-tasks",
  100: "a-hundred-tasks",
};

async function awardBadge(
  ctx: any,
  userId: Id<"users">,
  badgeBusinessId: string
): Promise<{ awarded: boolean; xp_bonus: number; gold_bonus: number }> {
  // ... (implementation same)
  const badge = await ctx.db
    .query("badges")
    .withIndex("by_badge_id", (q: any) => q.eq("badge_id", badgeBusinessId))
    .unique();

  if (!badge) return { awarded: false, xp_bonus: 0, gold_bonus: 0 };

  const existing = await ctx.db
    .query("userBadges")
    .withIndex("by_user_and_badge", (q: any) =>
      q.eq("user_id", userId).eq("badge_id", badge._id)
    )
    .unique();

  if (existing) return { awarded: false, xp_bonus: 0, gold_bonus: 0 };

  await ctx.db.insert("userBadges", {
    user_id: userId,
    badge_id: badge._id,
    earned_at: Date.now(),
  });

  return {
    awarded: true,
    xp_bonus: badge.xp_value,
    gold_bonus: Math.floor(badge.xp_value / 10),
  };
}

async function awardAchievement(
  ctx: any,
  userId: Id<"users">,
  achievementBusinessId: string
): Promise<{ awarded: boolean; xp_bonus: number; gold_bonus: number }> {
  const achievement = await ctx.db
    .query("achievements")
    .withIndex("by_achievement_id", (q: any) => q.eq("achievement_id", achievementBusinessId))
    .unique();

  if (!achievement) return { awarded: false, xp_bonus: 0, gold_bonus: 0 };

  const existing = await ctx.db
    .query("userAchievements")
    .withIndex("by_user_and_achievement", (q: any) =>
      q.eq("user_id", userId).eq("achievement_id", achievement._id)
    )
    .unique();

  if (existing) return { awarded: false, xp_bonus: 0, gold_bonus: 0 };

  await ctx.db.insert("userAchievements", {
    user_id: userId,
    achievement_id: achievement._id,
    earned_at: Date.now(),
  });

  return {
    awarded: true,
    xp_bonus: achievement.xp_value,
    gold_bonus: Math.floor(achievement.xp_value / 10),
  };
}

async function getTotalTasksCompleted(ctx: any, userId: Id<"users">): Promise<number> {
  const completed = await ctx.db
    .query("userTaskStatuses")
    .withIndex("by_user_and_task", (q: any) => q.eq("user_id", userId))
    .filter((q: any) => q.eq(q.field("completed"), true))
    .collect();

  return completed.length;
}

// ========== QUERIES ==========

export const getUser = query({
  args: { clerkUserId: v.optional(v.string()) }, // Made optional to support auth check preference
  handler: async (ctx, args) => {
    // Prefer auth check, fallback to arg if testing/admin (but secure apps should enforce auth)
    let userId = args.clerkUserId;
    if (!userId) {
        const identity = await ctx.auth.getUserIdentity();
        if (identity) userId = identity.subject;
    }
    if (!userId) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", userId!))
      .unique();
  },
});

export const getTasksByWeek = query({
  args: { weekId: v.id("weeks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_week", (q) => q.eq("week_id", args.weekId))
      .collect();
  },
});

export const getUserTaskStatuses = query({
  args: { 
    userId: v.optional(v.id("users")),
    clerkUserId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let uid = args.userId;
    // Security: If not providing internal ID, assume self-query via auth or arg
    if (!uid) {
        let clerkId = args.clerkUserId;
        if (!clerkId) {
            const identity = await ctx.auth.getUserIdentity();
            if (identity) clerkId = identity.subject;
        }
        
        if (clerkId) {
            const user = await ctx.db
                .query("users")
                .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", clerkId!))
                .unique();
            if (user) uid = user._id;
        }
    }

    if (!uid) return [];

    return await ctx.db
      .query("userTaskStatuses")
      .withIndex("by_user_and_task", (q) => q.eq("user_id", uid!))
      .collect();
  },
});

// ========== MUTATIONS ==========

export const ensureUser = mutation({
  args: { username: v.string() }, // Removed clerkUserId from args
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const clerkUserId = identity.subject;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", clerkUserId))
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("users", {
      clerk_user_id: clerkUserId,
      username: args.username,
      xp: 0,
      level: 1,
      streak: 0,
      gold: 0,
      hearts: 5,
      focus_points: FOCUS_CAP,
      focus_refreshed_at: Date.now(),
      streak_freeze_count: 0,
      last_activity_date: undefined,
    });
  },
});

// ========== HELPER LOGIC (Exported for reuse) ==========

export async function completeTaskLogic(
  ctx: any,
  user: Doc<"users">,
  task: Doc<"tasks">,
  now: number
) {
  // 1. Check existing status
  const existingStatus = await ctx.db
    .query("userTaskStatuses")
    .withIndex("by_user_and_task", (q: any) =>
      q.eq("user_id", user._id).eq("task_id", task._id)
    )
    .unique();

  if (existingStatus?.completed) {
    return { success: false, message: "Task already completed" };
  }

  // 2. Mark as completed
  if (existingStatus) {
    await ctx.db.patch(existingStatus._id, {
      completed: true,
      completed_at: now,
    });
  } else {
    await ctx.db.insert("userTaskStatuses", {
      user_id: user._id,
      task_id: task._id,
      completed: true,
      completed_at: now,
    });
  }

  // 3. Rewards
  const multiplier = DIFFICULTY_MULTIPLIER[task.difficulty] || 1.0;
  const xpGained = Math.floor(task.xp_reward * multiplier);
  const goldGained = Math.floor(xpGained / 10);

  let totalXp = user.xp + xpGained;
  let totalGold = user.gold + goldGained;

  // 4. Streak Update
  let newStreak = user.streak;
  if (!user.last_activity_date) {
    newStreak = 1;
  } else if (isYesterday(user.last_activity_date, now)) {
    newStreak += 1;
  } else if (!isSameDay(user.last_activity_date, now)) {
    newStreak = 1;
  }

  // 5. Quest Damage
  const questTask = await ctx.db
    .query("questTasks")
    .withIndex("by_task", (q: any) => q.eq("task_id", task._id))
    .first();

  if (questTask) {
    const activeQuest = await ctx.db
      .query("userQuests")
      .withIndex("by_user", (q: any) => q.eq("user_id", user._id))
      .filter((q: any) => q.eq(q.field("completed_at"), undefined))
      .first();

    if (activeQuest && activeQuest.quest_id === questTask.quest_id) {
      const newHp = Math.max(0, activeQuest.boss_hp_remaining - xpGained);
      if (newHp === 0) {
        await ctx.db.patch(activeQuest._id, {
          boss_hp_remaining: 0,
          completed_at: now,
        });
        // Award quest completion bonus
        const quest = await ctx.db.get(activeQuest.quest_id);
        if (quest) {
          totalXp += quest.reward_xp_bonus;
          if (quest.reward_badge_id) {
            await awardBadge(ctx, user._id, quest.reward_badge_id);
          }
        }
      } else {
        await ctx.db.patch(activeQuest._id, { boss_hp_remaining: newHp });
      }
    }
  }

  // 6. Badges & Achievements
  const badgesAwarded: string[] = [];

  // Streak badges
  if (STREAK_BADGES[newStreak]) {
    const res = await awardBadge(ctx, user._id, STREAK_BADGES[newStreak]);
    if (res.awarded) {
      badgesAwarded.push(STREAK_BADGES[newStreak]);
      totalXp += res.xp_bonus;
      totalGold += res.gold_bonus;
    }
  }

  // Count achievements
  const totalCompleted = await getTotalTasksCompleted(ctx, user._id);
  if (TASK_COUNT_ACHIEVEMENTS[totalCompleted]) {
    const res = await awardAchievement(ctx, user._id, TASK_COUNT_ACHIEVEMENTS[totalCompleted]);
    if (res.awarded) {
      totalXp += res.xp_bonus;
      totalGold += res.gold_bonus;
    }
  }

  // 7. Patch user
  await ctx.db.patch(user._id, {
    xp: totalXp,
    gold: totalGold,
    level: levelFromXp(totalXp),
    streak: newStreak,
    last_activity_date: now,
  });

  return {
    success: true,
    xp_gained: xpGained,
    gold_gained: goldGained,
    new_streak: newStreak,
    level_up: levelFromXp(totalXp) > user.level,
    badges_awarded: badgesAwarded,
  };
}

export const completeTask = mutation({
  args: {
    taskId: v.optional(v.id("tasks")),
    task_id: v.optional(v.id("tasks")), // Support snake_case from older clients
    id: v.optional(v.id("tasks")),      // Support generic id
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const clerkUserId = identity.subject;

    // Resolve taskId from possible variants
    const taskId = args.taskId || args.task_id || args.id;
    if (!taskId) throw new Error("ArgumentValidationError: Object is missing the required field 'taskId'");

    const now = Date.now();
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", clerkUserId))
      .unique();

    if (!user) throw new Error("User not found");

    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");

    return await completeTaskLogic(ctx, user, task, now);
  },
});

export const uncompleteTask = mutation({
  args: {
    taskId: v.optional(v.id("tasks")),
    task_id: v.optional(v.id("tasks")),
    id: v.optional(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const clerkUserId = identity.subject;

    const taskId = args.taskId || args.task_id || args.id;
    if (!taskId) throw new Error("ArgumentValidationError: Object is missing the required field 'taskId'");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", clerkUserId))
      .unique();

    if (!user) throw new Error("User not found");

    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");

    const status = await ctx.db
      .query("userTaskStatuses")
      .withIndex("by_user_and_task", (q) =>
        q.eq("user_id", user._id).eq("task_id", task._id)
      )
      .unique();

    if (!status || !status.completed) {
      return { success: false, message: "Task not completed" };
    }

    // 1. Mark as uncompleted
    await ctx.db.patch(status._id, {
      completed: false,
      completed_at: undefined,
    });

    // 2. Reverse Rewards (xp and gold)
    const multiplier = DIFFICULTY_MULTIPLIER[task.difficulty] || 1.0;
    const xpToDeduct = Math.floor(task.xp_reward * multiplier);
    const goldToDeduct = Math.floor(xpToDeduct / 10);

    const newXp = Math.max(0, user.xp - xpToDeduct);
    const newGold = Math.max(0, user.gold - goldToDeduct);

    await ctx.db.patch(user._id, {
      xp: newXp,
      gold: newGold,
      level: levelFromXp(newXp),
    });

    return {
      success: true,
      xp_deducted: xpToDeduct,
      gold_deducted: goldToDeduct,
      new_xp: newXp,
      new_gold: newGold,
    };
  },
});
