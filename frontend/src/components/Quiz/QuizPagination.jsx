import React from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

function QuizPagination({
    questions,
    currentQ,
    setCurrentQ,
    answers,
    isAnswered,
    isMCQ,
    onNext
}) {
    const prevQuestion = () => {
        if (currentQ > 0) setCurrentQ(c => c - 1)
    }

    return (
        <div className="mt-8 pt-6 border-t border-surface-700 flex justify-between items-center">
            <button
                onClick={prevQuestion}
                disabled={currentQ === 0}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${currentQ === 0
                    ? 'text-surface-600 cursor-not-allowed opacity-50'
                    : 'text-surface-400 hover:text-primary-400 hover:bg-primary-500/5'
                    }`}
            >
                <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex gap-1 items-center overflow-x-auto max-w-md scrollbar-none px-2">
                {(() => {
                    const totalQ = questions.length
                    const current = currentQ
                    const maxVisible = 7

                    const pageBtn = (idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentQ(idx)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex-shrink-0 border ${idx === current
                                ? 'bg-primary-500 border-primary-400 text-white shadow-lg shadow-primary-900/40'
                                : answers[questions[idx].id] !== undefined
                                    ? 'bg-primary-500/20 border-primary-500/30 text-primary-400 hover:bg-primary-500/30'
                                    : 'bg-surface-700 border-surface-600 text-surface-400 hover:bg-surface-600 hover:text-surface-200'
                                }`}
                        >
                            {idx + 1}
                        </button>
                    )

                    if (totalQ <= maxVisible) {
                        return questions.map((_, idx) => pageBtn(idx))
                    }

                    const pages = []
                    const showDots = (key) => (
                        <span key={key} className="text-surface-600 px-1 text-xs">•••</span>
                    )

                    pages.push(pageBtn(0))
                    const start = Math.max(1, current - 1)
                    const end = Math.min(totalQ - 2, current + 1)
                    if (start > 1) pages.push(showDots('dots-start'))
                    for (let i = start; i <= end; i++) {
                        pages.push(pageBtn(i))
                    }
                    if (end < totalQ - 2) pages.push(showDots('dots-end'))
                    if (totalQ > 1) pages.push(pageBtn(totalQ - 1))
                    return pages
                })()}
            </div>

            <button
                onClick={onNext}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95 ${currentQ === questions.length - 1
                        ? (Object.keys(answers).length === questions.length)
                            ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-primary-900/40 hover:from-primary-500 hover:to-primary-400'
                            : 'bg-surface-800 text-surface-400 border border-surface-700 hover:bg-surface-700'
                        : 'bg-primary-600/10 text-primary-400 border border-primary-500/30 hover:bg-primary-600/20'
                    }`}
            >
                {currentQ < questions.length - 1 ? (
                    <>Next <ArrowRight className="w-4 h-4" /></>
                ) : (
                    Object.keys(answers).length === questions.length ? 'Submit Quiz' : 'Finish Quiz (Skip Remaining)'
                )}
            </button>
        </div>
    )
}

export default QuizPagination
