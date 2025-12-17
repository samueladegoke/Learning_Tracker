import { supabase } from '../lib/supabase'

const parseQuestion = (q) => ({
  ...q,
  options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
  test_cases: typeof q.test_cases === 'string' ? JSON.parse(q.test_cases) : q.test_cases
})

export const quizApi = {
  // Fetch questions for a specific quiz
  async getQuestions(quizId) {
    const { data, error } = await supabase
      .from('questions')
      .select('id, quiz_id, question_type, text, code, options, correct_index, starter_code, test_cases, explanation, difficulty, topic_tag')
      .eq('quiz_id', quizId)
      .order('id')

    if (error) throw error
    return data.map(parseQuestion)
  },

  // Fetch questions by difficulty
  async getQuestionsByDifficulty(quizId, difficulty) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('difficulty', difficulty)

    if (error) throw error
    return data.map(parseQuestion)
  },

  // Fetch questions by topic
  async getQuestionsByTopic(quizId, topicTag) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('topic_tag', topicTag)

    if (error) throw error
    return data.map(parseQuestion)
  },

  // Get random subset of questions
  async getRandomQuestions(quizId, count = 10) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)

    if (error) throw error

    // Fisher-Yates shuffle for unbiased randomization
    const shuffled = [...data]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.slice(0, Math.min(count, shuffled.length)).map(parseQuestion)
  },

  // Submit quiz and calculate score
  async submitQuiz(userId, quizId, answers) {
    // Input validation
    if (!userId || typeof userId !== 'number') {
      throw new Error('Valid userId (number) is required')
    }
    if (!quizId || typeof quizId !== 'string') {
      throw new Error('Valid quizId (string) is required')
    }
    if (!answers || typeof answers !== 'object') {
      throw new Error('Valid answers object is required')
    }

    // First, get correct answers from questions
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('id, correct_index, question_type')
      .eq('quiz_id', quizId)

    if (qError) throw qError

    // Calculate score for MCQ questions
    let score = 0
    const questionsMap = Object.fromEntries(questions.map(q => [q.id, q]))

    for (const [qId, answer] of Object.entries(answers)) {
      const question = questionsMap[parseInt(qId)]
      if (!question) continue

      if (question.question_type === 'mcq' || question.question_type === 'code-correction') {
        // MCQ/Correction: answer is the selected index
        if (question.correct_index === answer) {
          score++
        }
      } else if (question.question_type === 'coding') {
        // Coding: answer is { passed, total } from test case results
        if (answer && typeof answer === 'object' && answer.passed === answer.total) {
          score++
        }
      }
    }

    // Save result to Supabase
    const { data: result, error: rError } = await supabase
      .from('quiz_results')
      .insert({
        user_id: userId,
        quiz_id: quizId,
        score,
        total_questions: Object.keys(answers).length,
        answers
      })
      .select()
      .single()

    if (rError) throw rError

    return {
      score,
      total: Object.keys(answers).length,
      xpEarned: score * 10,
      resultId: result.id
    }
  },

  // Get user's quiz history
  async getUserQuizHistory(userId) {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get user's best score for a quiz
  async getUserBestScore(userId, quizId) {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('score, total_questions')
      .eq('user_id', userId)
      .eq('quiz_id', quizId)
      .order('score', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
    return data
  },

  // Get quiz statistics
  async getQuizStats(quizId) {
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('id, question_type, difficulty')
      .eq('quiz_id', quizId)

    if (qError) throw qError

    const stats = {
      total: questions.length,
      byType: { mcq: 0, coding: 0, 'code-correction': 0 },
      byDifficulty: { easy: 0, medium: 0, hard: 0 }
    }

    questions.forEach(q => {
      // Safely increment with null checks
      const qType = q.question_type || 'mcq'
      const qDiff = q.difficulty || 'medium'

      if (stats.byType[qType] !== undefined) {
        stats.byType[qType]++
      }
      if (stats.byDifficulty[qDiff] !== undefined) {
        stats.byDifficulty[qDiff]++
      }
    })

    return stats
  }
}
