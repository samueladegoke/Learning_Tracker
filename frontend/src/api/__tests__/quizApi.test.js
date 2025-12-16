import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase client before importing quizApi
vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    order: vi.fn(() => Promise.resolve({ data: [], error: null })),
                    eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
                })),
            })),
        })),
    },
}))

import { quizApi } from '../quizApi'
import { supabase } from '../../lib/supabase'

describe('quizApi', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getQuestions', () => {
        it('returns empty array for quiz with no questions', async () => {
            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                order: vi.fn().mockResolvedValue({ data: [], error: null }),
            }
            supabase.from.mockReturnValue(mockChain)

            const result = await quizApi.getQuestions('empty-quiz')

            expect(result).toEqual([])
            expect(supabase.from).toHaveBeenCalledWith('questions')
        })

        it('parses questions with JSON string options', async () => {
            const mockQuestion = {
                id: 1,
                quiz_id: 'test-quiz',
                text: 'What is 2+2?',
                options: '["3", "4", "5"]',
                test_cases: null
            }

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                order: vi.fn().mockResolvedValue({ data: [mockQuestion], error: null }),
            }
            supabase.from.mockReturnValue(mockChain)

            const result = await quizApi.getQuestions('test-quiz')

            expect(result[0].options).toEqual(['3', '4', '5'])
        })

        it('handles already-parsed options array', async () => {
            const mockQuestion = {
                id: 1,
                quiz_id: 'test-quiz',
                text: 'What is 2+2?',
                options: ['3', '4', '5'],
                test_cases: null
            }

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                order: vi.fn().mockResolvedValue({ data: [mockQuestion], error: null }),
            }
            supabase.from.mockReturnValue(mockChain)

            const result = await quizApi.getQuestions('test-quiz')

            expect(result[0].options).toEqual(['3', '4', '5'])
        })

        it('throws error when Supabase query fails', async () => {
            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Query failed' } }),
            }
            supabase.from.mockReturnValue(mockChain)

            await expect(quizApi.getQuestions('fail-quiz')).rejects.toEqual({ message: 'Query failed' })
        })
    })

    describe('getQuizStats', () => {
        it('calculates stats from questions', async () => {
            const mockQuestions = [
                { id: 1, question_type: 'mcq', difficulty: 'easy' },
                { id: 2, question_type: 'coding', difficulty: 'medium' },
                { id: 3, question_type: 'mcq', difficulty: 'hard' },
            ]

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ data: mockQuestions, error: null }),
            }
            supabase.from.mockReturnValue(mockChain)

            const stats = await quizApi.getQuizStats('test-quiz')

            expect(stats.total).toBe(3)
            expect(stats.byType.mcq).toBe(2)
            expect(stats.byType.coding).toBe(1)
            expect(stats.byDifficulty.easy).toBe(1)
            expect(stats.byDifficulty.medium).toBe(1)
            expect(stats.byDifficulty.hard).toBe(1)
        })
    })
})
