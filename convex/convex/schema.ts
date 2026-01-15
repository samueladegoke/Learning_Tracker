import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Course table
  courses: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    totalDays: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(), // timestamp
    updatedAt: v.optional(v.number()),
  }).index("by_name", ["name"]),

  // Week table
  weeks: defineTable({
    weekNumber: v.number(),
    title: v.string(),
    focus: v.optional(v.string()),
    milestone: v.optional(v.string()),
    checkinPrompt: v.optional(v.string()),
  }).index("by_week_number", ["weekNumber"]),

  // Task table
  tasks: defineTable({
    taskId: v.string(), // e.g., "w1-d1"
    weekId: v.id("weeks"),
    day: v.string(), // e.g., "Monday"
    description: v.string(),
    type: v.optional(v.string()), // lesson, practice, coding
    xpReward: v.number(),
    badgeReward: v.optional(v.string()),
    difficulty: v.string(), // trivial/normal/hard/boss
    category: v.string(), // daily/weekly/quest/challenge
    dueDate: v.optional(v.number()),
    isBossTask: v.boolean(),
  })
    .index("by_week", ["weekId"])
    .index("by_task_id", ["taskId"]),

  // UserTaskStatus junction table
  userTaskStatuses: defineTable({
    clerkUserId: v.string(), // Clerk user ID (not Convex user doc)
    taskId: v.id("tasks"),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["clerkUserId"])
    .index("by_task", ["taskId"])
    .index("by_user_and_task", ["clerkUserId", "taskId"]),

  // ========== PHASE 3: GAMIFICATION ==========

  // Users table (gamification profile)
  users: defineTable({
    clerkUserId: v.string(), // Clerk identity link
    username: v.string(),
    xp: v.number(), // default 0
    level: v.number(), // default 1, formula: 100 * level^1.2
    streak: v.number(), // default 0
    bestStreak: v.number(), // default 0
    gold: v.number(), // default 0
    focusPoints: v.number(), // default 0
    focusRefreshedAt: v.optional(v.number()), // timestamp
    hearts: v.number(), // default 5
    lastHeartLoss: v.optional(v.number()), // timestamp
    streakFreezeCount: v.number(), // default 0
    lastCheckinAt: v.optional(v.number()), // timestamp
    currentWeek: v.number(), // default 1
    isAdmin: v.boolean(), // default false
    activeCourseId: v.optional(v.id("courses")),
    createdAt: v.number(), // timestamp
  })
    .index("by_clerk_id", ["clerkUserId"])
    .index("by_username", ["username"]),

  // Badges table
  badges: defineTable({
    badgeId: v.string(), // business key e.g., "first_task", "week_1_complete"
    name: v.string(),
    description: v.optional(v.string()),
    xpValue: v.number(),
    difficulty: v.string(), // trivial/normal/hard/boss
  }).index("by_badge_id", ["badgeId"]),

  // Achievements table
  achievements: defineTable({
    achievementId: v.string(), // business key
    name: v.string(),
    description: v.optional(v.string()),
    xpValue: v.number(),
    difficulty: v.string(),
  }).index("by_achievement_id", ["achievementId"]),

  // UserBadges junction table
  userBadges: defineTable({
    clerkUserId: v.string(),
    badgeId: v.id("badges"),
    earnedAt: v.number(), // timestamp
  })
    .index("by_user", ["clerkUserId"])
    .index("by_badge", ["badgeId"])
    .index("by_user_and_badge", ["clerkUserId", "badgeId"]),

  // UserAchievements junction table
  userAchievements: defineTable({
    clerkUserId: v.string(),
    achievementId: v.id("achievements"),
    earnedAt: v.number(), // timestamp
  })
    .index("by_user", ["clerkUserId"])
    .index("by_achievement", ["achievementId"])
    .index("by_user_and_achievement", ["clerkUserId", "achievementId"]),

  // ========== PHASE 4: RPG SYSTEM ==========

  // Quests table (boss battles)
  quests: defineTable({
    questId: v.string(), // business key e.g., "week-1-boss"
    name: v.string(),
    description: v.optional(v.string()),
    bossHp: v.number(), // total HP to defeat
    rewardXpBonus: v.number(), // XP awarded on completion
    rewardBadgeId: v.optional(v.string()), // badge awarded on completion
  }).index("by_quest_id", ["questId"]),

  // QuestTasks junction table (which tasks damage the boss)
  questTasks: defineTable({
    questId: v.id("quests"),
    taskId: v.id("tasks"),
    damageAmount: v.number(), // HP damage when task completed (default: task XP)
  })
    .index("by_quest", ["questId"])
    .index("by_task", ["taskId"]),

  // UserQuests - tracks user progress on quests
  userQuests: defineTable({
    clerkUserId: v.string(),
    questId: v.id("quests"),
    bossHpRemaining: v.number(), // starts at quest.bossHp
    startedAt: v.number(), // timestamp
    completedAt: v.optional(v.number()), // null if in progress
  })
    .index("by_user", ["clerkUserId"])
    .index("by_quest", ["questId"])
    .index("by_user_and_quest", ["clerkUserId", "questId"])
    .index("by_user_active", ["clerkUserId", "completedAt"]), // for finding active quest

  // Challenges table (timed goals)
  challenges: defineTable({
    challengeId: v.string(), // business key
    name: v.string(),
    description: v.optional(v.string()),
    goalCount: v.number(), // e.g., 7 tasks in a row
    endsAt: v.optional(v.number()), // deadline timestamp
    rewardBadgeId: v.optional(v.string()),
    rewardItem: v.optional(v.string()), // item key awarded
  }).index("by_challenge_id", ["challengeId"]),

  // UserChallenges - tracks user progress on challenges
  userChallenges: defineTable({
    clerkUserId: v.string(),
    challengeId: v.id("challenges"),
    progress: v.number(), // current count toward goal
    completedAt: v.optional(v.number()), // null if in progress
  })
    .index("by_user", ["clerkUserId"])
    .index("by_challenge", ["challengeId"])
    .index("by_user_and_challenge", ["clerkUserId", "challengeId"]),

  // UserInventory - shop items owned by user
  userInventory: defineTable({
    clerkUserId: v.string(),
    itemType: v.string(), // "consumable", "cosmetic", "booster"
    itemKey: v.string(), // "streak_freeze", "potion_focus", "heart_refill"
    quantity: v.number(), // how many owned
  })
    .index("by_user", ["clerkUserId"])
    .index("by_user_and_item", ["clerkUserId", "itemType", "itemKey"]),

  // ========== PHASE 5: LEARNING SYSTEM (placeholder) ==========

  // QuizResults - tracks quiz performance
  quizResults: defineTable({
    clerkUserId: v.string(),
    quizId: v.string(), // e.g., "day-1-practice"
    score: v.number(),
    totalQuestions: v.number(),
    completedAt: v.number(),
  })
    .index("by_user", ["clerkUserId"])
    .index("by_quiz", ["quizId"])
    .index("by_user_and_quiz", ["clerkUserId", "quizId"]),

  // Questions table
  questions: defineTable({
    quizId: v.string(),
    questionType: v.string(), // "mcq", "coding", "code-correction"
    text: v.string(),
    code: v.optional(v.string()), // for code-correction
    options: v.optional(v.string()), // JSON string of options
    correctIndex: v.optional(v.number()),
    starterCode: v.optional(v.string()),
    testCases: v.optional(v.string()), // JSON string
    solutionCode: v.optional(v.string()),
    explanation: v.optional(v.string()),
    difficulty: v.string(), // "easy", "medium", "hard"
    topicTag: v.optional(v.string()),
  }).index("by_quiz", ["quizId"]),

  // UserQuestionReviews - spaced repetition tracking
  userQuestionReviews: defineTable({
    clerkUserId: v.string(),
    questionId: v.id("questions"),
    intervalIndex: v.number(), // 0=1d, 1=3d, 2=7d, 3=14d
    dueDate: v.number(), // timestamp
    successCount: v.number(),
    isMastered: v.boolean(),
    lastReviewedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["clerkUserId"])
    .index("by_question", ["questionId"])
    .index("by_user_due", ["clerkUserId", "dueDate"]),

  // UserArtifacts - proof of work submissions
  userArtifacts: defineTable({
    clerkUserId: v.string(),
    day: v.number(),
    artifactType: v.string(), // "image", "url", "reflection"
    content: v.optional(v.string()), // URL or text
    storagePath: v.optional(v.string()), // Convex storage path
    xpBonus: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["clerkUserId"])
    .index("by_user_and_day", ["clerkUserId", "day"]),

  // Reflections - weekly check-ins
  reflections: defineTable({
    clerkUserId: v.string(),
    weekId: v.id("weeks"),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["clerkUserId"])
    .index("by_week", ["weekId"])
    .index("by_user_and_week", ["clerkUserId", "weekId"]),
});
