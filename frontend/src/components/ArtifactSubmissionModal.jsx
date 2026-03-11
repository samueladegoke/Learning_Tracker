import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Upload, Link as LinkIcon, FileText, Sparkles, Check, AlertCircle } from 'lucide-react'
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { soundManager } from '@/utils/SoundManager'
import {
    ARTIFACT_XP_BONUS,
    MAX_FILE_SIZE_MB,
    MIN_REFLECTION_LENGTH,
    isValidGitHubUrl
} from '@/constants/artifacts'

const ArtifactSubmissionModal = ({ isOpen, onClose, dayNumber, onSubmitted }) => {
    const [artifactType, setArtifactType] = useState(null) // 'screenshot' | 'commit_url' | 'reflection'
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const fileInputRef = useRef(null)
    const timeoutRef = useRef(null)

    const submitArtifactMutation = useMutation(api.artifacts.submitArtifact)

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    if (!isOpen) return null

    const resetState = () => {
        setArtifactType(null)
        setContent('')
        setError(null)
        setSuccess(false)
        setIsSubmitting(false)
        // Reset file input to allow re-uploading same file
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleClose = () => {
        // Clear any pending timeout to prevent stale callbacks
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        resetState()
        onClose()
    }

    const handleSkip = () => {
        handleClose()
        onSubmitted?.({ skipped: true })
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError(`File size must be under ${MAX_FILE_SIZE_MB}MB`)
            return
        }

        // Validate file type
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
            setError('Only PNG and JPG images are allowed')
            return
        }

        setError(null)

        // Create preview and store as content (single source of truth)
        const reader = new FileReader()
        reader.onload = (e) => {
            const dataUrl = e.target?.result
            setContent(dataUrl) // Store data URL as content (also used for preview)
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async () => {
        if (!artifactType) {
            setError('Please select an artifact type')
            return
        }

        // Validate based on type
        if (artifactType === 'reflection' && content.length < MIN_REFLECTION_LENGTH) {
            setError(`Reflection must be at least ${MIN_REFLECTION_LENGTH} characters`)
            return
        }

        if (artifactType === 'commit_url' && !isValidGitHubUrl(content)) {
            setError('Please enter a valid GitHub URL')
            return
        }

        if (artifactType === 'screenshot' && !content) {
            setError('Please upload a screenshot')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const result = await submitArtifactMutation({
                dayNumber,
                artifactType,
                content,
                fileUrl: artifactType === 'screenshot' ? content : undefined,
            })

            soundManager.levelUp() // Celebratory sound for artifact submission
            setSuccess(true)

            timeoutRef.current = setTimeout(() => {
                handleClose()
                onSubmitted?.({ success: true, xpAwarded: result.xp_awarded })
            }, 1500)
        } catch (err) {
            console.error('Failed to submit artifact:', err)
            setError(err.message || 'Failed to submit artifact')
            soundManager.error()
        } finally {
            setIsSubmitting(false)
        }
    }

    const artifactOptions = [
        {
            id: 'screenshot',
            icon: <Upload className="w-6 h-6" />,
            label: 'Screenshot',
            description: 'Upload a PNG or JPG (max 5MB)',
        },
        {
            id: 'commit_url',
            icon: <LinkIcon className="w-6 h-6" />,
            label: 'Commit URL',
            description: 'Paste your GitHub commit link',
        },
        {
            id: 'reflection',
            icon: <FileText className="w-6 h-6" />,
            label: 'Reflection',
            description: 'Write about what you learned',
        },
    ]

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface-900 rounded-2xl border-2 border-primary-500/30 max-w-lg w-full mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-surface-700">
                    <div>
                        <h2 className="text-xl font-display font-bold text-surface-100">
                            Submit Your Work
                        </h2>
                        <p className="text-surface-400 text-sm mt-1">
                            Day {dayNumber} • Earn +{ARTIFACT_XP_BONUS} bonus XP!
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-surface-100 transition-colors flex items-center justify-center"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-surface-100 mb-2">
                                Artifact Submitted!
                            </h3>
                            <p className="text-primary-400 font-medium">
                                +{ARTIFACT_XP_BONUS} Bonus XP Earned!
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            {/* Artifact Type Selection */}
                            <div className="grid grid-cols-3 gap-3">
                                {artifactOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            setArtifactType(option.id)
                                            setContent('')
                                            setError(null)
                                        }}
                                        className={`p-4 rounded-xl border transition-all text-center ${
                                            artifactType === option.id
                                                ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                                                : 'border-surface-700 bg-surface-800/50 text-surface-400 hover:border-surface-600 hover:text-surface-300'
                                        }`}
                                    >
                                        <div className="flex justify-center mb-2">{option.icon}</div>
                                        <div className="text-sm font-medium">{option.label}</div>
                                    </button>
                                ))}
                            </div>

                            {/* Dynamic Input Based on Type */}
                            {artifactType === 'screenshot' && (
                                <div className="space-y-3">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-8 border-2 border-dashed border-surface-600 rounded-xl hover:border-primary-500 transition-colors flex flex-col items-center justify-center gap-2 text-surface-400 hover:text-primary-400"
                                    >
                                        <Upload className="w-8 h-8" />
                                        <span className="text-sm">Click to upload screenshot</span>
                                        <span className="text-xs text-surface-500">PNG, JPG up to {MAX_FILE_SIZE_MB}MB</span>
                                    </button>
                                    {artifactType === 'screenshot' && content && (
                                        <div className="relative rounded-lg overflow-hidden border border-surface-700">
                                            <img
                                                src={content}
                                                alt="Screenshot preview"
                                                className="w-full h-40 object-cover"
                                            />
                                            <div className="absolute bottom-2 right-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                <Check className="w-3 h-3" /> Ready to submit
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {artifactType === 'commit_url' && (
                                <div className="space-y-2">
                                    <label className="text-sm text-surface-400">GitHub Commit URL</label>
                                    <input
                                        type="url"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="https://github.com/username/repo/commit/..."
                                        className="w-full bg-surface-800 border border-surface-700 rounded-lg px-4 py-3 text-surface-100 placeholder-surface-500 focus:border-primary-500 focus:outline-none transition-colors"
                                    />
                                    <p className="text-xs text-surface-500">
                                        Paste the URL to your GitHub commit for this day&apos;s work
                                    </p>
                                </div>
                            )}

                            {artifactType === 'reflection' && (
                                <div className="space-y-2">
                                    <label className="text-sm text-surface-400">
                                        Your Reflection <span className="text-surface-500">({content.length}/{MIN_REFLECTION_LENGTH} min chars)</span>
                                    </label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="What did you learn today? What was challenging? What insights did you gain?"
                                        rows={4}
                                        className="w-full bg-surface-800 border border-surface-700 rounded-lg px-4 py-3 text-surface-100 placeholder-surface-500 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                                    />
                                    {content.length >= MIN_REFLECTION_LENGTH && (
                                        <p className="text-xs text-green-400 flex items-center gap-1">
                                            <Check className="w-3 h-3" /> Minimum length reached
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Error Display */}
                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleSkip}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 rounded-xl font-medium transition-all bg-surface-800 text-surface-400 hover:bg-surface-700 hover:text-surface-300 disabled:opacity-50"
                                >
                                    Skip for Now
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !artifactType}
                                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                                        isSubmitting || !artifactType
                                            ? 'bg-surface-700 text-surface-500 cursor-not-allowed'
                                            : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/30'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className="w-4 h-4 border-2 border-surface-400 border-t-transparent rounded-full"
                                            />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Submit (+{ARTIFACT_XP_BONUS} XP)
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default ArtifactSubmissionModal
