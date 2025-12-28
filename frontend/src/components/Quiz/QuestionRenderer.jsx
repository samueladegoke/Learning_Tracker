import React from 'react'
import { Lightbulb } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { InlineCode } from '../InlineCode'
import CodeEditor from '../CodeEditor'
import OptionButton from './OptionButton'

function QuestionRenderer({
    question,
    selectedAnswer,
    verifiedAnswer,
    onMCQAnswer,
    onCodingResult
}) {
    if (!question) return null

    const isMCQ = question.question_type === 'mcq'
    const isCoding = question.question_type === 'coding'
    const isCodeCorrection = question.question_type === 'code-correction'

    const renderHeader = () => {
        const text = question.text || ''
        const isCodingChallenge = !question.options || question.options.length === 0

        if (!isCodingChallenge || !text.includes('\\n')) {
            return <InlineCode text={text} />
        }

        const [prompt, ...codeLines] = text.split('\\n')
        return (
            <div className="space-y-2">
                <InlineCode text={prompt} />
                <pre className="bg-surface-900 p-4 rounded-lg text-sm font-mono text-primary-300 overflow-x-auto">
                    {codeLines.join('\n')}
                </pre>
            </div>
        )
    }

    return (
        <div className="bg-surface-800 p-8 rounded-2xl border border-surface-700 shadow-xl">
            <h3 className="text-xl font-medium text-surface-100 mb-6 leading-relaxed">
                {renderHeader()}
            </h3>

            {/* MCQ & Code Correction Options */}
            {(isMCQ || isCodeCorrection) && (
                <div className="space-y-4">
                    {isCodeCorrection && question.code && (
                        <div className="bg-surface-900 p-4 rounded-xl border border-orange-500/30 mb-4">
                            <div className="text-xs text-orange-400 mb-2 uppercase tracking-wider font-medium">Code to Fix:</div>
                            <pre className="font-mono text-sm text-primary-300 whitespace-pre-wrap">{question.code}</pre>
                        </div>
                    )}
                    <div className="space-y-3">
                        {question.options?.map((opt, idx) => (
                            <OptionButton
                                key={idx}
                                index={idx}
                                text={opt}
                                isSelected={selectedAnswer === idx}
                                isCorrect={verifiedAnswer && idx === verifiedAnswer.correct_index}
                                showCorrectness={verifiedAnswer !== undefined}
                                onClick={() => onMCQAnswer(idx)}
                                type={isCodeCorrection ? 'code-correction' : 'mcq'}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Coding Challenge */}
            {isCoding && (
                <div className="mt-4">
                    <CodeEditor
                        starterCode={question.starter_code || '# Write your code here\n'}
                        testCases={question.test_cases || []}
                        onResult={onCodingResult}
                        questionId={question.id}
                    />
                    {selectedAnswer?.allPassed !== undefined && (
                        <div className={`mt-4 p-4 rounded-lg ${selectedAnswer.allPassed
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                            : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                            }`}>
                            {selectedAnswer.allPassed
                                ? <div className="flex items-center gap-2">All {selectedAnswer.total} test cases passed!</div>
                                : `${selectedAnswer.passed} of ${selectedAnswer.total} test cases passed`
                            }
                        </div>
                    )}
                </div>
            )}

            {/* Explanation & Context */}
            <AnimatePresence>
                {verifiedAnswer?.explanation && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="mt-6 overflow-hidden"
                    >
                        <div className="p-5 bg-primary-500/5 rounded-xl border border-primary-500/10 shadow-inner">
                            <h4 className="text-xs font-bold text-primary-400 mb-2 flex items-center gap-2 uppercase tracking-widest">
                                <Lightbulb className="w-4 h-4 text-yellow-400" /> Theory & Context
                            </h4>
                            <p className="text-surface-300 text-sm leading-relaxed">{verifiedAnswer.explanation}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default QuestionRenderer
