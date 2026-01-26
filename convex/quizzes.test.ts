import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test("quiz questions options should be an array", async () => {
  const t = convexTest(schema);
  const quizId = "day-1-practice";

  await t.mutation(api.importData.insertQuestion, {
    quiz_id: quizId,
    question_type: "mcq",
    text: "What is Python?",
    difficulty: "easy",
    options: ["A language", "A snake"],
    correct_index: 0,
  });

  const questions = await t.query(api.quizzes.getQuizQuestions, { quizId });
  expect(questions).toHaveLength(1);
  expect(Array.isArray(questions[0].options)).toBe(true);
  expect(questions[0].options).toEqual(["A language", "A snake"]);
});

test("challenges should be fetched correctly", async () => {
  const t = convexTest(schema);

  const userId = await t.mutation(api.importData.insertUser, {
    username: "testuser",
    clerk_user_id: "user_123",
    xp: 0,
    level: 1,
    streak: 0,
    gold: 0,
    hearts: 5,
    focus_points: 100,
    streak_freeze_count: 0
  });

  const challengeId = await t.mutation(api.importData.insertRow, {
    table: "challenges",
    data: {
      name: "Daily Code",
      description: "Code for 30 mins",
      goal_count: 1,
    }
  });

  await t.mutation(api.importData.insertRow, {
    table: "userChallenges",
    data: {
      user_id: userId,
      challenge_id: challengeId,
      progress: 0,
    }
  });

  const state = await t.query(api.rpg.getRPGState, { clerkUserId: "user_123" });

  expect(state).not.toBeNull();
  if (!state) return;
  expect(state.active_challenges).toHaveLength(1);
  expect(state.active_challenges[0]?.name).toBe("Daily Code");
});

test("passing quiz should complete linked task (Story 5.1)", async () => {
  const t = convexTest(schema);
  const userId = await t.mutation(api.importData.insertUser, {
    username: "quizuser",
    clerk_user_id: "user_quiz",
    xp: 0,
    level: 1,
    streak: 0,
    gold: 0,
    hearts: 5,
    focus_points: 100,
    streak_freeze_count: 0
  });

  const courseId = await t.mutation(api.importData.insertCourse, {
    title: "Python",
    description: "Learn Python",
    sequence_order: 1,
    is_active: true
  });

  const weekId = await t.mutation(api.importData.insertWeek, {
    course_id: courseId,
    title: "Week 1",
    description: "Intro",
    week_number: 1,
    is_locked: false
  });

  const taskId = await t.mutation(api.importData.insertTask, {
    week_id: weekId,
    title: "Day 1 Quiz",
    description: "Take the quiz",
    task_type: "quiz",
    difficulty: "easy",
    xp_reward: 50,
    estimated_minutes: 10,
    required_for_streak: true
  });

  // Submit quiz with passing score
  await t.withIdentity({ subject: "user_quiz" }).mutation(api.quizzes.submitQuizResult, {
    quizId: "day-1-practice",
    score: 8,
    totalQuestions: 10,
    taskId: taskId
  });

  // Verify task completion
  const tasks = await t.query(api.tasks.getUserTaskStatuses, { clerkUserId: "user_quiz" });
  expect(tasks).toHaveLength(1);
  expect(tasks[0].completed).toBe(true);
  
  // Verify XP (Task reward = 50, Difficulty 'easy' = 0.5 multiplier => 25 XP)
  // NOT score*10 = 80
  const user = await t.query(api.tasks.getUser, { clerkUserId: "user_quiz" });
  expect(user?.xp).toBe(25);
});

test("progress stats should include quiz metrics (Story 5.2)", async () => {
  const t = convexTest(schema);
  await t.mutation(api.importData.insertUser, {
    username: "statsuser",
    clerk_user_id: "user_stats",
    xp: 0,
    level: 1,
    streak: 0,
    gold: 0,
    hearts: 5,
    focus_points: 100,
    streak_freeze_count: 0
  });

  await t.withIdentity({ subject: "user_stats" }).mutation(api.quizzes.submitQuizResult, {
    quizId: "quiz-1",
    score: 8,
    totalQuestions: 10
  });

  await t.withIdentity({ subject: "user_stats" }).mutation(api.quizzes.submitQuizResult, {
    quizId: "quiz-2",
    score: 10,
    totalQuestions: 10
  });

  const progress = await t.query(api.progress.get, { clerkUserId: "user_stats" });
  
  expect(progress).not.toBeNull();
  if (!progress) return;
  
  // 2 quizzes taken
  expect(progress.quizzes_taken).toBe(2);
  
  // Best score 100%
  expect(progress.best_quiz_score).toBe(100);
  
  // Average: (80 + 100) / 2 = 90%
  expect(progress.average_quiz_score).toBe(90);
});
