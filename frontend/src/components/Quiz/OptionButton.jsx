import React from 'react'
import { Check, X } from 'lucide-react'

/**
 * OptionButton component for Quiz MCQ and Code Correction
 */
function OptionButton({
    index,
    text,
    isSelected,
    isCorrect,
    showCorrectness,
    onClick,
    disabled,
    type = 'mcq'
}) {
    const label = String.fromCharCode(65 + index)

    let buttonClass = 'bg-surface-700/50 border-surface-600 hover:bg-surface-700 hover:border-surface-500 text-surface-200'
    let badgeClass = 'bg-surface-600 text-surface-300'

    if (showCorrectness) {
        if (isCorrect) {
            buttonClass = 'bg-green-500/20 border-green-500 text-green-200'
            badgeClass = 'bg-green-500 text-white'
        } else if (isSelected) {
            buttonClass = 'bg-red-500/20 border-red-500 text-red-200'
            badgeClass = 'bg-red-500 text-white'
        }
    } else if (isSelected) {
        buttonClass = type === 'code-correction'
            ? 'bg-orange-600/20 border-orange-500 text-orange-200'
            : 'bg-primary-600/20 border-primary-500 text-primary-200'
        badgeClass = type === 'code-correction'
            ? 'bg-orange-500 text-white'
            : 'bg-primary-500 text-white'
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled || showCorrectness}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center ${buttonClass} ${showCorrectness ? 'cursor-default' : ''}`}
        >
            <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${badgeClass}`}>
                    {label}
                </span>
                <span className="font-mono text-sm whitespace-pre-wrap">{text}</span>
            </div>
            {showCorrectness && isCorrect && (
                <Check className="w-5 h-5 text-green-400" />
            )}
            {showCorrectness && isSelected && !isCorrect && (
                <X className="w-5 h-5 text-red-400" />
            )}
        </button>
    )
}

export default OptionButton
