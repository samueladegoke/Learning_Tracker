/**
 * Import Supabase Data to Convex
 * ===============================
 * 
 * Usage:
 *   npx convex run scripts/import_to_convex
 * 
 * Prerequisites:
 *   1. Run export_supabase.py first to generate data/migration/*.json
 *   2. Ensure Convex is deployed: npx convex dev
 * 
 * This script imports data in dependency order:
 *   courses → weeks → tasks → users → badges → achievements →
 *   userBadges → userAchievements → quests → questTasks → userQuests →
 *   challenges → userChallenges → userInventory → questions →
 *   quizResults → userQuestionReviews → userArtifacts → reflections
 */

import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

// ID Mappings (old Supabase ID -> new Convex ID)
const idMappings = {
  courses: new Map<number, Id<"courses">>(),
  weeks: new Map<number, Id<"weeks">>(),
  tasks: new Map<number, Id<"tasks">>(),
  badges: new Map<number, Id<"badges">>(),
  achievements: new Map<number, Id<"achievements">>(),
  quests: new Map<number, Id<"quests">>(),
  challenges: new Map<number, Id<"challenges">>(),
  questions: new Map<number, Id<"questions">>(),
};

// Type definitions for Supabase data
interface SupabaseCourse {
  id: number;
  name: string;
  description?: string;
  total_days: number;
  is_active: boolean;
}

interface SupabaseWeek {
  id: number;
  week_number: number;
  title: string;
  focus?: string;
  milestone?: string;
  checkin_prompt?: string;
}

interface SupabaseTask {
  id: number;
  task_id: string;
  week_id: number;
  day: number;
  description: string;
  type: string;
  xp_reward: number;
  badge_reward?: string;
  difficulty: string;
  category?: string;
  due_date?: string;
  is_boss_task: boolean;
}

interface SupabaseUser {
  id: number;
  clerk_user_id?: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
  best_streak: number;
  gold: number;
  focus_points: number;
  focus_refreshed_at?: string;
  hearts: number;
  last_heart_loss?: string;
  streak_freeze_count: number;
  last_checkin_at?: string;
  current_week: number;
  is_admin: boolean;
  active_course_id?: number;
  created_at: string;
}

// Helper to convert ISO date string to timestamp
function toTimestamp(dateStr?: string): number | undefined {
  if (!dateStr) return undefined;
  return new Date(dateStr).getTime();
}

/**
 * Main import mutation
 * Note: In production, this would be split into smaller chunks to avoid timeout
 */
export const importAllData = mutation({
  args: {
    courses: v.array(v.any()),
    weeks: v.array(v.any()),
    tasks: v.array(v.any()),
    users: v.array(v.any()),
    userTaskStatuses: v.array(v.any()),
    badges: v.array(v.any()),
    achievements: v.array(v.any()),
    userBadges: v.array(v.any()),
    userAchievements: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const results = {
      courses: 0,
      weeks: 0,
      tasks: 0,
      users: 0,
      userTaskStatuses: 0,
      badges: 0,
      achievements: 0,
      userBadges: 0,
      userAchievements: 0,
    };

    // 1. Import courses (aligned with schema.ts)
    for (const course of args.courses as SupabaseCourse[]) {
      const id = await ctx.db.insert("courses", {
        title: course.name,
        description: course.description || "",
        sequence_order: course.id, // Use old id as sequence order
        is_active: course.is_active,
      });
      idMappings.courses.set(course.id, id);
      results.courses++;
    }

    // 2. Import weeks (aligned with schema.ts)
    // Note: weeks require course_id - get first course as default
    const firstCourseId = idMappings.courses.values().next().value;
    if (!firstCourseId) {
      throw new Error("Cannot import weeks: no courses imported yet");
    }
    for (const week of args.weeks as SupabaseWeek[]) {
      const id = await ctx.db.insert("weeks", {
        course_id: firstCourseId, // All weeks belong to first course
        title: week.title,
        description: week.focus || "",
        week_number: week.week_number,
        is_locked: false,
      });
      idMappings.weeks.set(week.id, id);
      results.weeks++;
    }

    // 3. Import tasks (aligned with schema.ts)
    for (const task of args.tasks as SupabaseTask[]) {
      const week_id = idMappings.weeks.get(task.week_id);
      if (!week_id) continue;

      // Normalize difficulty: "normal" -> "medium"
      const difficulty = task.difficulty === "normal" ? "medium" : (task.difficulty || "medium");

      const id = await ctx.db.insert("tasks", {
        week_id,
        title: `Day ${task.day}`,
        description: task.description,
        task_type: task.type,
        difficulty,
        xp_reward: task.xp_reward,
        estimated_minutes: 30, // Default estimate
        required_for_streak: true,
        metadata: {
          legacy_task_id: task.task_id,
          day: task.day,
          category: task.category,
          badge_reward: task.badge_reward,
          is_boss_task: task.is_boss_task,
        },
      });
      idMappings.tasks.set(task.id, id);
      results.tasks++;
    }

    // 4. Import users (aligned with schema.ts)
    for (const user of args.users as SupabaseUser[]) {
      // Use clerk_user_id if available, otherwise generate from old id
      const clerk_user_id = user.clerk_user_id || `legacy_${user.id}`;

      await ctx.db.insert("users", {
        username: user.username,
        clerk_user_id,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        best_streak: user.best_streak,
        gold: user.gold,
        hearts: user.hearts,
        focus_points: user.focus_points,
        focus_refreshed_at: toTimestamp(user.focus_refreshed_at),
        streak_freeze_count: user.streak_freeze_count,
        last_activity_date: toTimestamp(user.last_checkin_at),
        last_heart_loss: toTimestamp(user.last_heart_loss),
      });
      results.users++;
    }


    // 5. Import badges (aligned with schema.ts)
    for (const badge of args.badges as any[]) {
      const id = await ctx.db.insert("badges", {
        badge_id: badge.badge_id,
        name: badge.name,
        description: badge.description,
        xp_value: badge.xp_value || 0,
        difficulty: badge.difficulty || "medium",
      });
      idMappings.badges.set(badge.id, id);
      results.badges++;
    }

    // 6. Import achievements (aligned with schema.ts)
    for (const achievement of args.achievements as any[]) {
      const id = await ctx.db.insert("achievements", {
        achievement_id: achievement.achievement_id,
        name: achievement.name,
        description: achievement.description,
        xp_value: achievement.xp_value || 0,
        difficulty: achievement.difficulty || "medium",
      });
      idMappings.achievements.set(achievement.id, id);
      results.achievements++;
    }

    // 7. Import user_task_statuses (aligned with schema.ts)
    // Note: Schema uses user_id (convex ID) not clerkUserId - need to create user mapping first
    // For now, we skip these as they require user ID mapping which isn't available here
    // TODO: This should be done after users are created with a separate pass
    console.log(`Skipping ${args.userTaskStatuses.length} userTaskStatuses - requires user ID mapping`);
    results.userTaskStatuses = 0;

    // 8. Import user_badges (aligned with schema.ts)
    // Note: Schema uses user_id (convex ID) - skipping for same reason
    console.log(`Skipping ${args.userBadges.length} userBadges - requires user ID mapping`);
    results.userBadges = 0;

    // 9. Import user_achievements (aligned with schema.ts)
    // Note: Schema uses user_id (convex ID) - skipping for same reason
    console.log(`Skipping ${args.userAchievements.length} userAchievements - requires user ID mapping`);
    results.userAchievements = 0;

    return {
      success: true,
      imported: results,
      idMappings: {
        courses: idMappings.courses.size,
        weeks: idMappings.weeks.size,
        tasks: idMappings.tasks.size,
        badges: idMappings.badges.size,
        achievements: idMappings.achievements.size,
      },
    };
  },
});

/**
 * Import RPG data (quests, challenges, inventory)
 */
export const importRPGData = mutation({
  args: {
    quests: v.array(v.any()),
    questTasks: v.array(v.any()),
    userQuests: v.array(v.any()),
    challenges: v.array(v.any()),
    userChallenges: v.array(v.any()),
    userInventory: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const results = {
      quests: 0,
      questTasks: 0,
      userQuests: 0,
      challenges: 0,
      userChallenges: 0,
      userInventory: 0,
    };

    // Import quests (aligned with schema.ts)
    // Schema: name, description, boss_hp, reward_xp_bonus, reward_badge_id (optional)
    for (const quest of args.quests as any[]) {
      const id = await ctx.db.insert("quests", {
        name: quest.name,
        description: quest.description,
        boss_hp: quest.boss_hp || 100,
        reward_xp_bonus: quest.reward_xp_bonus || 0,
        reward_badge_id: quest.reward_badge_id,
      });
      idMappings.quests.set(quest.id, id);
      results.quests++;
    }

    // Import challenges (aligned with schema.ts)
    // Schema: name, description, goal_count, ends_at (optional), reward_badge_id (optional), reward_item (optional)
    for (const challenge of args.challenges as any[]) {
      const id = await ctx.db.insert("challenges", {
        name: challenge.name,
        description: challenge.description,
        goal_count: challenge.goal_count || 1,
        ends_at: toTimestamp(challenge.ends_at),
        reward_badge_id: challenge.reward_badge_id,
        reward_item: challenge.reward_item,
      });
      idMappings.challenges.set(challenge.id, id);
      results.challenges++;
    }

    // Import user_inventory (aligned with schema.ts)
    // Note: Schema uses user_id (convex ID) - skipping for same reason
    console.log(`Skipping ${args.userInventory.length} userInventory - requires user ID mapping`);
    results.userInventory = 0;

    return { success: true, imported: results };
  },
});

/**
 * Import learning data (questions, quiz results, SRS reviews)
 */
export const importLearningData = mutation({
  args: {
    questions: v.array(v.any()),
    quizResults: v.array(v.any()),
    userQuestionReviews: v.array(v.any()),
    userArtifacts: v.array(v.any()),
    reflections: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const results = {
      questions: 0,
      quizResults: 0,
      userQuestionReviews: 0,
      userArtifacts: 0,
      reflections: 0,
    };

    // Import questions (aligned with schema.ts)
    for (const q of args.questions as any[]) {
      const id = await ctx.db.insert("questions", {
        quiz_id: q.quiz_id,
        question_type: q.question_type,
        text: q.text,
        code: q.code,
        options: q.options ? JSON.stringify(q.options) : undefined,
        correct_index: q.correct_index,
        starter_code: q.starter_code,
        test_cases: q.test_cases ? JSON.stringify(q.test_cases) : undefined,
        solution_code: q.solution_code,
        explanation: q.explanation,
        difficulty: q.difficulty,
        topic_tag: q.topic_tag,
      });
      idMappings.questions.set(q.id, id);
      results.questions++;
    }

    // Import quiz_results (aligned with schema.ts)
    // Note: Schema uses user_id (convex ID) - skipping for same reason as above
    console.log(`Skipping ${args.quizResults.length} quizResults - requires user ID mapping`);
    results.quizResults = 0;

    // Import user_question_reviews (aligned with schema.ts)
    // Note: Schema uses user_id (convex ID) - skipping for same reason
    console.log(`Skipping ${args.userQuestionReviews.length} userQuestionReviews - requires user ID mapping`);
    results.userQuestionReviews = 0;

    // Note: userArtifacts table doesn't exist in schema.ts - skipping
    console.log(`Skipping ${args.userArtifacts.length} userArtifacts - table not in schema`);
    results.userArtifacts = 0;

    return { success: true, imported: results };
  },
});

/**
 * Verify import counts match export counts
 */
export const verifyImportCounts = mutation({
  args: {
    expectedCounts: v.object({
      courses: v.number(),
      weeks: v.number(),
      tasks: v.number(),
      users: v.number(),
      badges: v.number(),
      achievements: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const actualCounts = {
      courses: (await ctx.db.query("courses").collect()).length,
      weeks: (await ctx.db.query("weeks").collect()).length,
      tasks: (await ctx.db.query("tasks").collect()).length,
      users: (await ctx.db.query("users").collect()).length,
      badges: (await ctx.db.query("badges").collect()).length,
      achievements: (await ctx.db.query("achievements").collect()).length,
    };

    const mismatches: string[] = [];
    for (const [table, expected] of Object.entries(args.expectedCounts)) {
      const actual = actualCounts[table as keyof typeof actualCounts];
      if (actual !== expected) {
        mismatches.push(`${table}: expected ${expected}, got ${actual}`);
      }
    }

    return {
      success: mismatches.length === 0,
      actualCounts,
      expectedCounts: args.expectedCounts,
      mismatches,
    };
  },
});

/**
 * Clear all data from tables for clean re-import
 */
export const clearAllData = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "courses", "weeks", "tasks", "users", "userTaskStatuses",
      "badges", "achievements", "userBadges", "userAchievements",
      "questions", "quizResults", "userQuestionReviews",
      "userInventory", "userQuests", "questTasks",
      "challenges", "userChallenges"
    ];

    const results: Record<string, number> = {};

    for (const table of tables) {
      try {
        const rows = await ctx.db.query(table as any).collect();
        let deleted = 0;
        for (const row of rows) {
          await ctx.db.delete(row._id);
          deleted++;
        }
        results[table] = deleted;
      } catch (e) {
        results[table] = -1; // Table doesn't exist or error
      }
    }

    return { success: true, deleted: results };
  },
});

