import React, { useState, useEffect } from 'react'
import { Trophy, PartyPopper, BookOpen, AlertTriangle, Sparkles } from 'lucide-react'
import Confetti from '@/components/Confetti'
import ArtifactSubmissionModal from '@/components/ArtifactSubmissionModal'
import { ARTIFACT_XP_BONUS } from '@/constants/artifacts'

function QuizResult({
    resultData,
    isReviewMode,
    quizStats,
    xpWarning,
    onRetry,
    onContinue,
    dayNumber
}) {
    const [showConfetti, setShowConfetti] = useState(false)
    const [showArtifactModal, setShowArtifactModal] = useState(false)

    const percentage = resultData
        ? Math.round((resultData.score / resultData.total_questions) * 100)
        : 0
    const isPerfect = percentage === 100
    const isPassing = percentage >= 70

    // Trigger confetti on mount for good scores
    useEffect(() => {
        if (resultData && (isPerfect || isPassing)) {
            setShowConfetti(true)
        }
    }, [resultData, isPerfect, isPassing])

    if (!resultData) return null

    return (
        <>
            <Confetti
                isActive={showConfetti}
                duration={isPerfect ? 4000 : 2500}
                onComplete={() => setShowConfetti(false)}
            />
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 bg-surface-800/30 rounded-2xl border border-surface-700 p-8">
                <div className={`${isPerfect ? 'animate-bounce' : ''} flex justify-center`}>
                    {isPerfect
                        ? <Trophy className="w-16 h-16 text-yellow-400" />
                        : isPassing
                            ? <PartyPopper className="w-16 h-16 text-primary-400" />
                            : <BookOpen className="w-16 h-16 text-amber-400" />
                    }
                </div>
                <h3 className="text-3xl font-bold text-surface-100">
                    {isReviewMode ? 'Training Complete!' : 'Quiz Complete!'}
                </h3>
                <div className="text-center">
                    <p className={`text-5xl font-bold mb-2 ${isPerfect ? 'text-yellow-400' : isPassing ? 'text-primary-400' : 'text-amber-400'
                        }`}>
                        {percentage}%
                    </p>
                    <p className="text-surface-400">
                        {isReviewMode
                            ? `You reviewed ${resultData.total_questions} items in your memory bank.`
                            : `You scored ${resultData.score} out of ${resultData.total_questions}`}
                    </p>
                    <p className="text-sm text-primary-300 mt-2">
                        {isReviewMode ? 'Knowledge Solidified' : `+${resultData.xp_gained} XP Earned!`}
                        {!resultData.xp_saved && !isReviewMode && (
                            <span className="flex items-center gap-2 text-amber-400 text-xs mt-1 justify-center">
                                <AlertTriangle className="w-3 h-3" /> XP not saved to profile
                            </span>
                        )}
                    </p>
                    {xpWarning && (
                        <p className="text-xs text-amber-400 mt-2 p-2 bg-amber-500/10 rounded border border-amber-500/30">
                            {xpWarning}
                        </p>
                    )}
                </div>

                {quizStats && !isReviewMode && (
                    <div className="flex gap-4 text-sm text-surface-500">
                        <span>MCQ: {quizStats.byType.mcq}</span>
                        <span>•</span>
                        <span>Coding: {quizStats.byType.coding}</span>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                    {!isReviewMode && isPassing && (
                        <button
                            onClick={() => setShowArtifactModal(true)}
                            className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl transition-all font-medium shadow-lg shadow-primary-900/30 flex items-center justify-center gap-2"
                        >
                            <Sparkles className="w-5 h-5" />
                            Complete Day {dayNumber}
                        </button>
                    )}
                    <button
                        onClick={isReviewMode ? onContinue : onRetry}
                        className="px-8 py-3 bg-surface-700 hover:bg-surface-600 text-surface-200 rounded-xl transition-colors font-medium"
                    >
                        {isReviewMode ? 'Continue Journey' : 'Try Again'}
                    </button>
                </div>

                {/* Artifact submission bonus hint */}
                {!isReviewMode && isPassing && (
                    <p className="text-xs text-primary-400/70 text-center">
                        Submit proof of your work to earn +{ARTIFACT_XP_BONUS} bonus XP!
                    </p>
                )}
            </div>

            {/* Artifact Submission Modal */}
            <ArtifactSubmissionModal
                isOpen={showArtifactModal}
                onClose={() => setShowArtifactModal(false)}
                dayNumber={dayNumber}
                onSubmitted={(result) => {
                    setShowArtifactModal(false)
                    if (result.success) {
                        // Could show additional success state here
                    }
                }}
            />
        </>
    )
}

export default QuizResult

