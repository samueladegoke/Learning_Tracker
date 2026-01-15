import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { levelFromXp } from "./gamification";
import { addDays } from "./lib/utils";

// ========== QUIZ CONSTANTS ==========

export const XP_PER_CORRECT_ANSWER = 10;
export const XP_QUIZ_COMPLETION_BONUS = 25;
export const XP_PERFECT_SCORE_BONUS = 50;

// ========== QUERIES ==========

/**
 * Get questions for a specific quiz
 * Returns questions without correct answers (for client-side quiz)
 */
export const getQuizQuestions = query({
  args: { quizId: v.string() },
  handler: async (ctx, args) => {
    const { quizId } = args;

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_quiz_id", (q) => q.eq("quiz_id", quizId))
      .collect();

    // Return questions without correct answers
    return questions.map((q) => ({
      id: q._id,
      question_type: q.question_type,
      text: q.text,
      code: q.code,
      options: q.options ? JSON.parse(q.options) : null,
      starter_code: q.starter_code,
      difficulty: q.difficulty,
      topic_tag: q.topic_tag,
      // Note: correct_index and solution_code are NOT returned
    }));
  },
});

/**
 * Get quiz metadata (without questions)
 */
export const getQuizList = query({
  args: {},
  handler: async (ctx) => {
    const allQuestions = await ctx.db.query("questions").collect();

    const quizMap = new Map<
      string,
      { quiz_id: string; questionCount: number; difficulties: Set<string> }
    >();

    for (const q of allQuestions) {
      if (!quizMap.has(q.quiz_id)) {
        quizMap.set(q.quiz_id, {
          quiz_id: q.quiz_id,
          questionCount: 0,
          difficulties: new Set(),
        });
      }
      const quiz = quizMap.get(q.quiz_id)!;
      quiz.questionCount++;
      quiz.difficulties.add(q.difficulty);
    }

    return Array.from(quizMap.values()).map((quiz) => ({
      quiz_id: quiz.quiz_id,
      question_count: quiz.questionCount,
      difficulties: Array.from(quiz.difficulties),
    }));
  },
});

/**
 * Get user's quiz history
 */
export const getQuizHistory = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", args.clerkUserId))
      .unique();
    if (!user) return [];

    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("user_id", user._id))
      .collect();

    // Sort by completed_at descending, take 50
    const sorted = results.sort((a, b) => b.completed_at - a.completed_at).slice(0, 50);

    return sorted.map((r) => ({
      quiz_id: r.quiz_id,
      score: r.score,
      total_questions: r.total_questions,
      percentage: Math.round((r.score / r.total_questions) * 100),
      completed_at: r.completed_at,
    }));
  },
});

/**
 * Get best score for a quiz
 */
export const getQuizBestScore = query({
  args: {
    clerkUserId: v.string(),
    quizId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", args.clerkUserId))
      .unique();
    if (!user) return null;

    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_user_and_quiz", (q) =>
        q.eq("user_id", user._id).eq("quiz_id", args.quizId)
      )
      .collect();

    if (results.length === 0) return null;

    const best = results.reduce((prev, curr) =>
      curr.score > prev.score ? curr : prev
    );

    return {
      quiz_id: best.quiz_id,
      best_score: best.score,
      total_questions: best.total_questions,
      percentage: Math.round((best.score / best.total_questions) * 100),
      attempts: results.length,
    };
  },
});

/**
 * Get completed quizzes (L1 fix)
 */
export const getCompletedQuizzes = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", identity.subject))
      .unique();
    if (!user) return [];

    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("user_id", user._id))
      .collect();

    // Get unique quiz_ids
    const quizIds = [...new Set(results.map((r) => r.quiz_id))];
    return quizIds;
  },
});

// ========== MUTATIONS ==========

/**
 * Submit quiz result
 * Records result and awards XP
 */
export const submitQuizResult = mutation({
  args: {
    clerkUserId: v.string(),
    quizId: v.string(),
    answers: v.array(
      v.object({
        questionId: v.id("questions"),
        selectedIndex: v.optional(v.number()),
        codeAnswer: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { clerkUserId, quizId, answers } = args;
    const now = Date.now();

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", clerkUserId))
      .unique();
    if (!user) throw new Error("User not found");

    let correctCount = 0;
    const totalQuestions = answers.length;

    // Grade each answer
    for (const answer of answers) {
      const question = await ctx.db.get(answer.questionId);
      if (!question) continue;

      let isCorrect = false;

      if (question.question_type === "mcq" && answer.selectedIndex !== undefined) {
        isCorrect = answer.selectedIndex === question.correct_index;
      } else if (
        question.question_type === "coding" &&
        answer.codeAnswer !== undefined
      ) {
        isCorrect = answer.codeAnswer.trim() === question.solution_code?.trim();
      } else if (question.question_type === "code-correction") {
        isCorrect = answer.codeAnswer?.trim() === question.solution_code?.trim();
      }

      if (isCorrect) {
        correctCount++;
      } else {
        // Add incorrect questions to SRS review queue
        const existingReview = await ctx.db
          .query("userQuestionReviews")
          .withIndex("by_user_and_question", (q) =>
            q.eq("user_id", user._id).eq("question_id", answer.questionId)
          )
          .unique();

        if (!existingReview) {
          await ctx.db.insert("userQuestionReviews", {
            user_id: user._id,
            question_id: answer.questionId,
            interval_index: 0,
            due_date: now + 1 * 24 * 60 * 60 * 1000,
            success_count: 0,
            is_mastered: false,
          });
        }
      }
    }

    // Calculate XP
    let xpAwarded = correctCount * XP_PER_CORRECT_ANSWER;
    xpAwarded += XP_QUIZ_COMPLETION_BONUS;

    const isPerfect = correctCount === totalQuestions && totalQuestions > 0;
    if (isPerfect) {
      xpAwarded += XP_PERFECT_SCORE_BONUS;
    }

    // Record quiz result
    await ctx.db.insert("quizResults", {
      user_id: user._id,
      quiz_id: quizId,
      score: correctCount,
      total_questions: totalQuestions,
      completed_at: now,
    });

    // Award XP to user
    const newXp = user.xp + xpAwarded;
    await ctx.db.patch(user._id, {
      xp: newXp,
      level: levelFromXp(newXp),
    });

    return {
      success: true,
      score: correctCount,
      total_questions: totalQuestions,
      percentage: Math.round((correctCount / totalQuestions) * 100),
      is_perfect: isPerfect,
      xp_awarded: xpAwarded,
    };
  },
});

/**
 * Check answer for a single question (for immediate feedback mode)
 */
export const checkAnswer = mutation({
  args: {
    clerkUserId: v.string(),
    questionId: v.id("questions"),
    selectedIndex: v.optional(v.number()),
    codeAnswer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerkUserId, questionId, selectedIndex, codeAnswer } = args;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", clerkUserId))
      .unique();
    if (!user) throw new Error("User not found");

    const question = await ctx.db.get(questionId);
    if (!question) throw new Error("Question not found");

    let isCorrect = false;

    if (question.question_type === "mcq" && selectedIndex !== undefined) {
      isCorrect = selectedIndex === question.correct_index;
    } else if (question.question_type === "coding" && codeAnswer !== undefined) {
      isCorrect = codeAnswer.trim() === question.solution_code?.trim();
    } else if (question.question_type === "code-correction") {
      isCorrect = codeAnswer?.trim() === question.solution_code?.trim();
    }

    // Award XP for correct answer
    let xpAwarded = 0;
    if (isCorrect) {
      xpAwarded = XP_PER_CORRECT_ANSWER;
      const newXp = user.xp + xpAwarded;
      await ctx.db.patch(user._id, {
        xp: newXp,
        level: levelFromXp(newXp),
      });
    } else {
      // Add to SRS queue for later review
      const existingReview = await ctx.db
        .query("userQuestionReviews")
        .withIndex("by_user_and_question", (q) =>
          q.eq("user_id", user._id).eq("question_id", questionId)
        )
        .unique();

      if (!existingReview) {
        await ctx.db.insert("userQuestionReviews", {
          user_id: user._id,
          question_id: questionId,
          interval_index: 0,
          due_date: Date.now() + 1 * 24 * 60 * 60 * 1000,
          success_count: 0,
          is_mastered: false,
        });
      }
    }

    return {
      is_correct: isCorrect,
      correct_index: question.correct_index,
      explanation: question.explanation,
      solution_code: question.solution_code,
      xp_awarded: xpAwarded,
    };
  },
});
