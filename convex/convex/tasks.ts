import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// ========== CONSTANTS (ported EXACTLY from backend) ==========

export const XP_BASE = 100;
export const XP_EXPONENT = 1.2;
export const FOCUS_CAP = 5;

export const DIFFICULTY_MULTIPLIER: Record<string, number> = {
  trivial: 0.5,
  normal: 1.0,
  hard: 1.5,
  boss: 2.0,
};

export const REWARD_MULTIPLIER: Record<string, number> = {
  trivial: 1.0,
  normal: 1.0,
  hard: 1.5,
  epic: 2.0,
};

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

// ========== HELPER FUNCTIONS ==========

/**
 * Calculate XP needed for next level: 100 * level^1.2
 * EXACT port from backend/app/utils/gamification.py
 */
export function xpForNextLevel(level: number): number {
  return Math.floor(XP_BASE * Math.pow(level, XP_EXPONENT));
}

/**
 * Calculate level from total XP
 * EXACT port from backend/app/utils/gamification.py
 */
export function levelFromXp(totalXp: number): number {
  let level = 1;
  let xpRemaining = totalXp;

  while (xpRemaining >= xpForNextLevel(level)) {
    xpRemaining -= xpForNextLevel(level);
    level++;
  }

  return level;
}

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
 * Check if ts1 is yesterday relative to ts2
 */
function isYesterday(ts1: number, ts2: number): boolean {
  const d1 = new Date(ts1);
  const d2 = new Date(ts2);
  d1.setDate(d1.getDate() + 1);
  return isSameDay(d1.getTime(), ts2);
}

// ========== QUERIES ==========

export const getUser = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();
  },
});

export const getUserBadges = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const userBadges = await ctx.db
      .query("userBadges")
      .withIndex("by_user", (q) => q.eq("clerkUserId", args.clerkUserId))
      .collect();

    const badges = await Promise.all(
      userBadges.map(async (ub) => {
        const badge = await ctx.db.get(ub.badgeId);
        return badge ? { ...badge, earnedAt: ub.earnedAt } : null;
      })
    );

    return badges.filter(Boolean);
  },
});

export const getUserAchievements = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const userAchievements = await ctx.db
      .query("userAchievements")
      .withIndex("by_user", (q) => q.eq("clerkUserId", args.clerkUserId))
      .collect();

    const achievements = await Promise.all(
      userAchievements.map(async (ua) => {
        const achievement = await ctx.db.get(ua.achievementId);
        return achievement ? { ...achievement, earnedAt: ua.earnedAt } : null;
      })
    );

    return achievements.filter(Boolean);
  },
});

// ========== MUTATIONS ==========

/**
 * Create or get user - ensures user exists before any gamification operations
 */
export const ensureUser = mutation({
  args: { clerkUserId: v.string(), username: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (existing) {
      return existing._id;
    }

    // Create new user with defaults
    const userId = await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
      username: args.username || `user_${args.clerkUserId.slice(0, 8)}`,
      xp: 0,
      level: 1,
      streak: 0,
      bestStreak: 0,
      gold: 0,
      focusPoints: FOCUS_CAP,
      focusRefreshedAt: Date.now(),
      hearts: 5,
      lastHeartLoss: undefined,
      streakFreezeCount: 0,
      lastCheckinAt: undefined,
      currentWeek: 1,
      isAdmin: false,
      activeCourseId: undefined,
      createdAt: Date.now(),
    });

    return userId;
  },
});

/**
 * Award a badge to user - returns XP/gold bonus
 * EXACT port from backend award_badge()
 */
async function awardBadge(
  ctx: any,
  clerkUserId: string,
  badgeId: string
): Promise<{ awarded: boolean; xpBonus: number; goldBonus: number }> {
  // Find badge by badgeId (business key)
  const badge = await ctx.db
    .query("badges")
    .withIndex("by_badge_id", (q: any) => q.eq("badgeId", badgeId))
    .first();

  if (!badge) {
    return { awarded: false, xpBonus: 0, goldBonus: 0 };
  }

  // Check if already earned
  const existing = await ctx.db
    .query("userBadges")
    .withIndex("by_user_and_badge", (q: any) =>
      q.eq("clerkUserId", clerkUserId).eq("badgeId", badge._id)
    )
    .first();

  if (existing) {
    return { awarded: false, xpBonus: 0, goldBonus: 0 };
  }

  // Award badge
  await ctx.db.insert("userBadges", {
    clerkUserId,
    badgeId: badge._id,
    earnedAt: Date.now(),
  });

  return {
    awarded: true,
    xpBonus: badge.xpValue,
    goldBonus: Math.floor(badge.xpValue / 10),
  };
}

/**
 * Award an achievement to user - returns XP/gold bonus
 * EXACT port from backend award_achievement()
 */
async function awardAchievement(
  ctx: any,
  clerkUserId: string,
  achievementId: string
): Promise<{ awarded: boolean; xpBonus: number; goldBonus: number }> {
  // Find achievement by achievementId (business key)
  const achievement = await ctx.db
    .query("achievements")
    .withIndex("by_achievement_id", (q: any) => q.eq("achievementId", achievementId))
    .first();

  if (!achievement) {
    return { awarded: false, xpBonus: 0, goldBonus: 0 };
  }

  // Check if already earned
  const existing = await ctx.db
    .query("userAchievements")
    .withIndex("by_user_and_achievement", (q: any) =>
      q.eq("clerkUserId", clerkUserId).eq("achievementId", achievement._id)
    )
    .first();

  if (existing) {
    return { awarded: false, xpBonus: 0, goldBonus: 0 };
  }

  // Award achievement
  await ctx.db.insert("userAchievements", {
    clerkUserId,
    achievementId: achievement._id,
    earnedAt: Date.now(),
  });

  return {
    awarded: true,
    xpBonus: achievement.xpValue,
    goldBonus: Math.floor(achievement.xpValue / 10),
  };
}

/**
 * Refresh focus points - reset to FOCUS_CAP once per day
 * EXACT port from backend refresh_focus_points()
 */
async function refreshFocusPoints(ctx: any, user: Doc<"users">): Promise<Doc<"users">> {
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

/**
 * Update streak - increment if consecutive, reset otherwise
 * EXACT port from backend update_streak()
 */
async function updateStreak(ctx: any, user: Doc<"users">): Promise<Doc<"users">> {
  const now = Date.now();
  const lastCheckin = user.lastCheckinAt;

  let newStreak = user.streak;
  let newBestStreak = user.bestStreak;

  if (!lastCheckin) {
    // First ever checkin
    newStreak = 1;
  } else if (isSameDay(lastCheckin, now)) {
    // Already checked in today - no change
    return user;
  } else if (isYesterday(lastCheckin, now)) {
    // Consecutive day - increment streak
    newStreak = user.streak + 1;
  } else {
    // Streak broken - reset to 1
    newStreak = 1;
  }

  // Update best streak if current is higher
  if (newStreak > newBestStreak) {
    newBestStreak = newStreak;
  }

  await ctx.db.patch(user._id, {
    streak: newStreak,
    bestStreak: newBestStreak,
    lastCheckinAt: now,
  });

  return { ...user, streak: newStreak, bestStreak: newBestStreak, lastCheckinAt: now };
}

/**
 * Get total completed tasks count for user
 */
async function getTotalTasksCompleted(ctx: any, clerkUserId: string): Promise<number> {
  const completed = await ctx.db
    .query("userTaskStatuses")
    .withIndex("by_user", (q: any) => q.eq("clerkUserId", clerkUserId))
    .filter((q: any) => q.eq(q.field("completed"), true))
    .collect();

  return completed.length;
}

/**
 * Check if week is complete (all tasks done)
 */
async function checkWeekCompletion(
  ctx: any,
  clerkUserId: string,
  weekId: Id<"weeks">
): Promise<boolean> {
  const tasks = await ctx.db
    .query("tasks")
    .withIndex("by_week", (q: any) => q.eq("weekId", weekId))
    .collect();

  if (tasks.length === 0) return false;

  for (const task of tasks) {
    const status = await ctx.db
      .query("userTaskStatuses")
      .withIndex("by_user_and_task", (q: any) =>
        q.eq("clerkUserId", clerkUserId).eq("taskId", task._id)
      )
      .first();

    if (!status || !status.completed) {
      return false;
    }
  }

  return true;
}

/**
 * CRITICAL: Complete Task Mutation
 * ATOMIC operation - ports EXACTLY from backend _complete_task_internal()
 *
 * This mutation performs ALL of the following in a single atomic transaction:
 * 1. Mark task as completed
 * 2. Award base XP (with difficulty multiplier)
 * 3. Award gold (xp/10)
 * 4. Update streak
 * 5. Refresh focus points
 * 6. Recalculate level
 * 7. Award streak badges (3, 7, 14, 30 day streaks)
 * 8. Award task count achievements (1, 10, 50, 100 tasks)
 * 9. Award week completion badge
 * 10. Apply all bonus XP/gold from badges/achievements
 */
export const completeTask = mutation({
  args: {
    clerkUserId: v.string(),
    taskId: v.string(), // taskId business key, not Convex _id
  },
  handler: async (ctx, args) => {
    const { clerkUserId, taskId } = args;
    const now = Date.now();

    // 1. Find task by taskId business key
    const task = await ctx.db
      .query("tasks")
      .withIndex("by_task_id", (q) => q.eq("taskId", taskId))
      .first();

    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    // 2. Get or create user
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      // Auto-create user if not exists
      const userId = await ctx.db.insert("users", {
        clerkUserId,
        username: `user_${clerkUserId.slice(0, 8)}`,
        xp: 0,
        level: 1,
        streak: 0,
        bestStreak: 0,
        gold: 0,
        focusPoints: FOCUS_CAP,
        focusRefreshedAt: now,
        hearts: 5,
        streakFreezeCount: 0,
        currentWeek: 1,
        isAdmin: false,
        createdAt: now,
      });
      user = (await ctx.db.get(userId))!;
    }

    // 3. Check if already completed
    const existingStatus = await ctx.db
      .query("userTaskStatuses")
      .withIndex("by_user_and_task", (q) =>
        q.eq("clerkUserId", clerkUserId).eq("taskId", task._id)
      )
      .first();

    if (existingStatus?.completed) {
      return {
        success: false,
        message: "Task already completed",
        user,
      };
    }

    // 4. Mark task as completed
    if (existingStatus) {
      await ctx.db.patch(existingStatus._id, {
        completed: true,
        completedAt: now,
      });
    } else {
      await ctx.db.insert("userTaskStatuses", {
        clerkUserId,
        taskId: task._id,
        completed: true,
        completedAt: now,
      });
    }

    // 5. Refresh focus points (daily reset)
    user = await refreshFocusPoints(ctx, user);

    // 6. Update streak
    user = await updateStreak(ctx, user);

    // 7. Calculate XP and gold rewards
    const difficultyMult = DIFFICULTY_MULTIPLIER[task.difficulty || "normal"] || 1.0;
    const baseXp = task.xpReward || 10;
    let xpGained = Math.floor(baseXp * difficultyMult);
    let goldGained = Math.floor(xpGained / 10);

    // Track bonus XP/gold from badges/achievements
    let bonusXp = 0;
    let bonusGold = 0;
    const badgesAwarded: string[] = [];
    const achievementsAwarded: string[] = [];

    // 8. Award streak badges
    for (const [threshold, badgeId] of Object.entries(STREAK_BADGES)) {
      if (user.streak === parseInt(threshold)) {
        const result = await awardBadge(ctx, clerkUserId, badgeId);
        if (result.awarded) {
          badgesAwarded.push(badgeId);
          bonusXp += result.xpBonus;
          bonusGold += result.goldBonus;
        }
      }
    }

    // 9. Get total tasks completed and award count achievements
    const totalCompleted = await getTotalTasksCompleted(ctx, clerkUserId);

    for (const [count, achievementId] of Object.entries(TASK_COUNT_ACHIEVEMENTS)) {
      if (totalCompleted === parseInt(count)) {
        const result = await awardAchievement(ctx, clerkUserId, achievementId);
        if (result.awarded) {
          achievementsAwarded.push(achievementId);
          bonusXp += result.xpBonus;
          bonusGold += result.goldBonus;
        }
      }
    }

    // 10. Check week completion and award badge
    const weekComplete = await checkWeekCompletion(ctx, clerkUserId, task.weekId);
    if (weekComplete) {
      const week = await ctx.db.get(task.weekId);
      if (week) {
        const weekBadgeId = `b-week-${week.weekNumber}`;
        const result = await awardBadge(ctx, clerkUserId, weekBadgeId);
        if (result.awarded) {
          badgesAwarded.push(weekBadgeId);
          bonusXp += result.xpBonus;
          bonusGold += result.goldBonus;
        }
      }
    }

    // 11. Award task badge if defined
    if (task.badgeReward) {
      const result = await awardBadge(ctx, clerkUserId, task.badgeReward);
      if (result.awarded) {
        badgesAwarded.push(task.badgeReward);
        bonusXp += result.xpBonus;
        bonusGold += result.goldBonus;
      }
    }

    // 12. Apply total XP and gold
    const totalXpGained = xpGained + bonusXp;
    const totalGoldGained = goldGained + bonusGold;
    const newXp = user.xp + totalXpGained;
    const newGold = user.gold + totalGoldGained;
    const newLevel = levelFromXp(newXp);

    // 13. Update user
    await ctx.db.patch(user._id, {
      xp: newXp,
      gold: newGold,
      level: newLevel,
    });

    // 14. Return result
    return {
      success: true,
      message: "Task completed!",
      xpGained: totalXpGained,
      goldGained: totalGoldGained,
      baseXp: xpGained,
      bonusXp,
      bonusGold,
      levelUp: newLevel > user.level,
      oldLevel: user.level,
      newLevel,
      streak: user.streak,
      badgesAwarded,
      achievementsAwarded,
      weekComplete,
      user: {
        xp: newXp,
        gold: newGold,
        level: newLevel,
        streak: user.streak,
        bestStreak: user.bestStreak,
      },
    };
  },
});

/**
 * Uncomplete Task Mutation
 * Ports from backend - reverses task completion
 * Note: Does NOT reverse badges/achievements (they're permanent once earned)
 */
export const uncompleteTask = mutation({
  args: {
    clerkUserId: v.string(),
    taskId: v.string(), // taskId business key
  },
  handler: async (ctx, args) => {
    const { clerkUserId, taskId } = args;

    // Find task by taskId business key
    const task = await ctx.db
      .query("tasks")
      .withIndex("by_task_id", (q) => q.eq("taskId", taskId))
      .first();

    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    // Find completion status
    const status = await ctx.db
      .query("userTaskStatuses")
      .withIndex("by_user_and_task", (q) =>
        q.eq("clerkUserId", clerkUserId).eq("taskId", task._id)
      )
      .first();

    if (!status || !status.completed) {
      return {
        success: false,
        message: "Task is not completed",
      };
    }

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Calculate XP to deduct (same formula as completion)
    const difficultyMult = DIFFICULTY_MULTIPLIER[task.difficulty || "normal"] || 1.0;
    const baseXp = task.xpReward || 10;
    const xpToDeduct = Math.floor(baseXp * difficultyMult);
    const goldToDeduct = Math.floor(xpToDeduct / 10);

    // Mark as uncompleted
    await ctx.db.patch(status._id, {
      completed: false,
      completedAt: undefined,
    });

    // Deduct XP and gold (but don't go below 0)
    const newXp = Math.max(0, user.xp - xpToDeduct);
    const newGold = Math.max(0, user.gold - goldToDeduct);
    const newLevel = levelFromXp(newXp);

    await ctx.db.patch(user._id, {
      xp: newXp,
      gold: newGold,
      level: newLevel,
    });

    return {
      success: true,
      message: "Task uncompleted",
      xpDeducted: xpToDeduct,
      goldDeducted: goldToDeduct,
      levelDown: newLevel < user.level,
      user: {
        xp: newXp,
        gold: newGold,
        level: newLevel,
      },
    };
  },
});
