import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ========== PHASE 2: CURRICULUM ==========
  courses: defineTable({
    title: v.string(),
    description: v.string(),
    sequence_order: v.number(),
    is_active: v.boolean(),
  }),
  weeks: defineTable({
    course_id: v.id("courses"),
    title: v.string(),
    description: v.string(),
    week_number: v.number(),
    is_locked: v.boolean(),
  }).index("by_course", ["course_id"]),
  tasks: defineTable({
    week_id: v.id("weeks"),
    title: v.string(),
    description: v.string(),
    task_type: v.string(), // "video", "exercise", "project", "quiz"
    difficulty: v.string(), // "easy", "medium", "hard"
    xp_reward: v.number(),
    estimated_minutes: v.number(),
    required_for_streak: v.boolean(),
    metadata: v.optional(v.any()), // For video URLs, legacy fields, etc.
  }).index("by_week", ["week_id"]),
  userTaskStatuses: defineTable({
    user_id: v.id("users"),
    task_id: v.id("tasks"),
    completed: v.boolean(),
    completed_at: v.optional(v.number()),
  }).index("by_user_and_task", ["user_id", "task_id"]),

  // ========== PHASE 3: GAMIFICATION ==========
  users: defineTable({
    username: v.string(),
    clerk_user_id: v.string(),
    xp: v.number(),
    level: v.number(),
    streak: v.number(),
    gold: v.number(),
    hearts: v.number(),
    focus_points: v.number(),
    focus_refreshed_at: v.optional(v.number()),
    streak_freeze_count: v.number(),
    last_activity_date: v.optional(v.number()),
    last_heart_loss: v.optional(v.number()),
  }).index("by_clerk_id", ["clerk_user_id"]),

  badges: defineTable({
    badge_id: v.string(),
    name: v.string(),
    description: v.string(),
    xp_value: v.number(),
    difficulty: v.string(),
  }).index("by_badge_id", ["badge_id"]),
  userBadges: defineTable({
    user_id: v.id("users"),
    badge_id: v.id("badges"),
    earned_at: v.number(),
  }).index("by_user_and_badge", ["user_id", "badge_id"]),

  achievements: defineTable({
    achievement_id: v.string(),
    name: v.string(),
    description: v.string(),
    xp_value: v.number(),
    difficulty: v.string(),
  }).index("by_achievement_id", ["achievement_id"]),
  userAchievements: defineTable({
    user_id: v.id("users"),
    achievement_id: v.id("achievements"),
    earned_at: v.number(),
  }).index("by_user_and_achievement", ["user_id", "achievement_id"]),

  // ========== PHASE 4: RPG SYSTEM ==========
  quests: defineTable({
    name: v.string(),
    description: v.string(),
    boss_hp: v.number(),
    reward_xp_bonus: v.number(),
    reward_badge_id: v.optional(v.string()),
  }),
  userQuests: defineTable({
    user_id: v.id("users"),
    quest_id: v.id("quests"),
    boss_hp_remaining: v.number(),
    started_at: v.number(),
    completed_at: v.optional(v.number()),
  }).index("by_user", ["user_id"]),
  questTasks: defineTable({
    quest_id: v.id("quests"),
    task_id: v.id("tasks"),
  })
    .index("by_quest", ["quest_id"])
    .index("by_task", ["task_id"]),

  challenges: defineTable({
    name: v.string(),
    description: v.string(),
    goal_count: v.number(),
    ends_at: v.optional(v.number()),
    reward_badge_id: v.optional(v.string()),
    reward_item: v.optional(v.string()),
  }),
  userChallenges: defineTable({
    user_id: v.id("users"),
    challenge_id: v.id("challenges"),
    progress: v.number(),
    completed_at: v.optional(v.number()),
  }).index("by_user", ["user_id"]),

  userInventory: defineTable({
    user_id: v.id("users"),
    item_type: v.string(),
    item_key: v.string(),
    quantity: v.number(),
  }).index("by_user", ["user_id"]),

  // ========== PHASE 5: LEARNING SYSTEM ==========
  questions: defineTable({
    quiz_id: v.string(),
    question_type: v.string(),
    text: v.string(),
    code: v.optional(v.string()),
    options: v.optional(v.string()),
    correct_index: v.optional(v.number()),
    starter_code: v.optional(v.string()),
    test_cases: v.optional(v.string()),
    solution_code: v.optional(v.string()),
    explanation: v.optional(v.string()),
    difficulty: v.string(),
    topic_tag: v.optional(v.string()),
  }).index("by_quiz_id", ["quiz_id"]),

  userQuestionReviews: defineTable({
    user_id: v.id("users"),
    question_id: v.id("questions"),
    interval_index: v.number(),
    due_date: v.number(),
    success_count: v.number(),
    is_mastered: v.boolean(),
    last_reviewed_at: v.optional(v.number()),
  }).index("by_user_and_due", ["user_id", "due_date"])
    .index("by_user_and_question", ["user_id", "question_id"]),

  // NEW: Quiz Results table (fix H3)
  quizResults: defineTable({
    user_id: v.id("users"),
    quiz_id: v.string(),
    score: v.number(),
    total_questions: v.number(),
    completed_at: v.number(),
  }).index("by_user", ["user_id"])
    .index("by_user_and_quiz", ["user_id", "quiz_id"]),
});
