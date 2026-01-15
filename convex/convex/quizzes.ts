import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { levelFromXp } from "./tasks";

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
      .withIndex("by_quiz", (q) => q.eq("quizId", quizId))
      .collect();

    // Return questions without correct answers
    return questions.map((q) => ({
      id: q._id,
      questionType: q.questionType,
      text: q.text,
      code: q.code,
      options: q.options ? JSON.parse(q.options) : null,
      starterCode: q.starterCode,
      difficulty: q.difficulty,
      topicTag: q.topicTag,
      // Note: correctIndex and solutionCode are NOT returned
    }));
  },
});

/**
 * Get quiz metadata (without questions)
 */
export const getQuizList = query({
  args: {},
  handler: async (ctx) => {
    // Get unique quiz IDs by scanning questions
    const allQuestions = await ctx.db.query("questions").collect();

    const quizMap = new Map<
      string,
      { quizId: string; questionCount: number; difficulties: Set<string> }
    >();

    for (const q of allQuestions) {
      if (!quizMap.has(q.quizId)) {
        quizMap.set(q.quizId, {
          quizId: q.quizId,
          questionCount: 0,
          difficulties: new Set(),
        });
      }
      const quiz = quizMap.get(q.quizId)!;
      quiz.questionCount++;
      quiz.difficulties.add(q.difficulty);
    }

    return Array.from(quizMap.values()).map((quiz) => ({
      quizId: quiz.quizId,
      questionCount: quiz.questionCount,
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
    const { clerkUserId } = args;

    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("clerkUserId", clerkUserId))
      .order("desc")
      .take(50);

    return results.map((r) => ({
      quizId: r.quizId,
      score: r.score,
      totalQuestions: r.totalQuestions,
      percentage: Math.round((r.score / r.totalQuestions) * 100),
      completedAt: r.completedAt,
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
    const { clerkUserId, quizId } = args;

    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_user_and_quiz", (q) =>
        q.eq("clerkUserId", clerkUserId).eq("quizId", quizId)
      )
      .collect();

    if (results.length === 0) {
      return null;
    }

    const best = results.reduce((prev, curr) =>
      curr.score > prev.score ? curr : prev
    );

    return {
      quizId: best.quizId,
      bestScore: best.score,
      totalQuestions: best.totalQuestions,
      percentage: Math.round((best.score / best.totalQuestions) * 100),
      attempts: results.length,
    };
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

    let correctCount = 0;
    const totalQuestions = answers.length;
    const questionResults: Array<{
      questionId: string;
      isCorrect: boolean;
      correctIndex?: number;
      explanation?: string;
    }> = [];

    // Grade each answer
    for (const answer of answers) {
      const question = await ctx.db.get(answer.questionId);
      if (!question) continue;

      let isCorrect = false;

      if (question.questionType === "mcq" && answer.selectedIndex !== undefined) {
        isCorrect = answer.selectedIndex === question.correctIndex;
      } else if (
        question.questionType === "coding" &&
        answer.codeAnswer !== undefined
      ) {
        // For coding questions, we'd need to run tests
        // Simplified: check if answer matches solution (exact match)
        isCorrect =
          answer.codeAnswer.trim() === question.solutionCode?.trim();
      } else if (question.questionType === "code-correction") {
        // Similar to coding
        isCorrect =
          answer.codeAnswer?.trim() === question.solutionCode?.trim();
      }

      if (isCorrect) {
        correctCount++;
      } else {
        // Add incorrect questions to SRS review queue
        const existingReview = await ctx.db
          .query("userQuestionReviews")
          .withIndex("by_user", (q) => q.eq("clerkUserId", clerkUserId))
          .filter((q) => q.eq(q.field("questionId"), answer.questionId))
          .first();

        if (!existingReview) {
          await ctx.db.insert("userQuestionReviews", {
            clerkUserId,
            questionId: answer.questionId,
            intervalIndex: 0,
            dueDate: now + 1 * 24 * 60 * 60 * 1000, // Due tomorrow
            successCount: 0,
            isMastered: false,
            createdAt: now,
          });
        }
      }

      questionResults.push({
        questionId: answer.questionId,
        isCorrect,
        correctIndex: question.correctIndex,
        explanation: question.explanation,
      });
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
      clerkUserId,
      quizId,
      score: correctCount,
      totalQuestions,
      completedAt: now,
    });

    // Award XP to user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (user) {
      const newXp = user.xp + xpAwarded;
      await ctx.db.patch(user._id, {
        xp: newXp,
        level: levelFromXp(newXp),
      });
    }

    return {
      success: true,
      score: correctCount,
      totalQuestions,
      percentage: Math.round((correctCount / totalQuestions) * 100),
      isPerfect,
      xpAwarded,
      questionResults,
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

    const question = await ctx.db.get(questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    let isCorrect = false;

    if (question.questionType === "mcq" && selectedIndex !== undefined) {
      isCorrect = selectedIndex === question.correctIndex;
    } else if (question.questionType === "coding" && codeAnswer !== undefined) {
      isCorrect = codeAnswer.trim() === question.solutionCode?.trim();
    } else if (question.questionType === "code-correction") {
      isCorrect = codeAnswer?.trim() === question.solutionCode?.trim();
    }

    // Award XP for correct answer
    let xpAwarded = 0;
    if (isCorrect) {
      xpAwarded = XP_PER_CORRECT_ANSWER;

      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUserId))
        .first();

      if (user) {
        const newXp = user.xp + xpAwarded;
        await ctx.db.patch(user._id, {
          xp: newXp,
          level: levelFromXp(newXp),
        });
      }
    } else {
      // Add to SRS queue for later review
      const existingReview = await ctx.db
        .query("userQuestionReviews")
        .withIndex("by_user", (q) => q.eq("clerkUserId", clerkUserId))
        .filter((q) => q.eq(q.field("questionId"), questionId))
        .first();

      if (!existingReview) {
        await ctx.db.insert("userQuestionReviews", {
          clerkUserId,
          questionId,
          intervalIndex: 0,
          dueDate: Date.now() + 1 * 24 * 60 * 60 * 1000,
          successCount: 0,
          isMastered: false,
          createdAt: Date.now(),
        });
      }
    }

    return {
      isCorrect,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      solutionCode: question.solutionCode,
      xpAwarded,
    };
  },
});
