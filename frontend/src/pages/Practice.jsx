import { useState, useEffect } from 'react'
import { quizzesAPI } from '../api/client'
import CodeBlock from '../components/CodeBlock'



function Practice() {
    const [activeTab, setActiveTab] = useState('deep-dive')

    return (
        <div className="space-y-8 pb-12">
            <header>
                <h1 className="text-3xl font-bold text-surface-100 font-display">Day 1: Variables & Strings</h1>
                <p className="text-surface-400 mt-2">Mastering the fundamentals of Python data management.</p>
            </header>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-surface-700 overflow-x-auto">
                {['deep-dive', 'quiz', 'transcripts'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-1 font-medium transition-colors whitespace-nowrap ${activeTab === tab
                            ? 'text-primary-400 border-b-2 border-primary-400'
                            : 'text-surface-400 hover:text-surface-200'
                            }`}
                    >
                        {tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'deep-dive' && <DeepDive />}
                {activeTab === 'quiz' && <Quiz />}
                {activeTab === 'transcripts' && <Transcripts />}
            </div>
        </div>
    )
}

function DeepDive() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Section 1: Variables */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Variables
                    </h2>
                    <p>
                        Think of a variable as a labeled box where you can store data. The label is the variable name,
                        and the content is the value. In Python, you don't need to declare the type of the variable;
                        it's inferred automatically.
                    </p>
                    <CodeBlock code={`# Assigning variables
user_name = "Angela"
user_age = 25
is_student = True

print(user_name)`} />

                    <div className="bg-surface-800/50 p-6 rounded-xl border border-surface-700">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">Naming Rules</h3>
                        <ul className="space-y-2 list-disc list-inside text-surface-300">
                            <li>Must start with a letter or underscore.</li>
                            <li>Cannot start with a number.</li>
                            <li>Can only contain alpha-numeric characters and underscores (A-z, 0-9, and _).</li>
                            <li>Case-sensitive (<code>age</code>, <code>Age</code> and <code>AGE</code> are different variables).</li>
                        </ul>
                    </div>
                </section>

                {/* Section 2: Input */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> The Input Function
                    </h2>
                    <p>
                        The <code>input()</code> function allows you to get data from the user.
                        <strong>Crucial Point:</strong> It always returns a <em>string</em>.
                    </p>
                    <CodeBlock code={`# Basic Input
name = input("What is your name? ")
print("Hello " + name)

# Input with Type Conversion
age = input("What is your age? ")
# age is currently a string like "25"
age_as_int = int(age) 
# now we can do math
print(f"You will be {age_as_int + 1} next year.")`} />
                </section>

                {/* Section 3: String Manipulation */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> String Manipulation
                    </h2>
                    <p>
                        Strings are powerful in Python. You can combine them, split them, and format them dynamically.
                    </p>

                    <h3 className="text-lg font-semibold text-surface-100 mt-4">f-Strings (Formatted String Literals)</h3>
                    <p>
                        The cleanest way to insert variables into strings. Just put an <code>f</code> before the quote
                        and use curly braces <code>{ }</code>.
                    </p>
                    <CodeBlock code={`score = 0
height = 1.8
is_winning = True

# Using f-string
print(f"Your score is {score}, your height is {height}, you are winning is {is_winning}")`} />

                    <h3 className="text-lg font-semibold text-surface-100 mt-4">Common Methods</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <li className="bg-surface-800 p-3 rounded border border-surface-700">
                            <code className="text-primary-300">len(str)</code>: Returns length
                        </li>
                        <li className="bg-surface-800 p-3 rounded border border-surface-700">
                            <code className="text-primary-300">str.upper()</code>: Converts to uppercase
                        </li>
                        <li className="bg-surface-800 p-3 rounded border border-surface-700">
                            <code className="text-primary-300">str.lower()</code>: Converts to lowercase
                        </li>
                        <li className="bg-surface-800 p-3 rounded border border-surface-700">
                            <code className="text-primary-300">str.strip()</code>: Removes whitespace
                        </li>
                    </ul>
                </section>

            </div>

            {/* Sidebar: External Insights */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <span className="text-xl">💡</span> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Debugging</h4>
                            <p className="text-sm text-surface-400">
                                If you get a <code>TypeError</code> when doing math, check if you forgot to convert your <code>input()</code> to an <code>int</code> or <code>float</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Readability</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>snake_case</code> for variables. It's the Python standard (PEP 8).
                                <br />
                                <span className="text-green-400">Good:</span> <code>user_score</code>
                                <br />
                                <span className="text-red-400">Bad:</span> <code>UserScore</code>, <code>u_s</code>
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Swapping</h4>
                            <p className="text-sm text-surface-400">
                                Python has a cool trick to swap variables without a temp variable:
                            </p>
                            <CodeBlock code={`a, b = b, a`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


function Quiz() {
    const [questions, setQuestions] = useState([])
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState({}) // { questionId: selectedIndex }
    const [showResult, setShowResult] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [resultData, setResultData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadQuiz()
    }, [])

    const loadQuiz = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await quizzesAPI.getQuestions('day-1-practice')
            setQuestions(data)
            // Reset state
            setCurrentQ(0)
            setAnswers({})
            setShowResult(false)
            setResultData(null)
        } catch (err) {
            console.error('Failed to load quiz:', err)
            setError('Failed to load questions. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleAnswer = (optionIndex) => {
        const questionId = questions[currentQ].id
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }))
    }

    const nextQuestion = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(c => c + 1)
        } else {
            finishQuiz()
        }
    }

    const finishQuiz = async () => {
        setIsSubmitting(true)
        try {
            const response = await quizzesAPI.submit({
                quiz_id: 'day-1-practice',
                answers: answers
            })
            setResultData(response)
            setShowResult(true)
        } catch (error) {
            console.error('Error submitting score:', error)
            setError('Failed to submit quiz. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) return <div className="text-center p-8 text-surface-400">Loading quiz...</div>
    if (error) return (
        <div className="text-center p-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={loadQuiz} className="btn-primary">Retry</button>
        </div>
    )
    if (questions.length === 0) return <div className="text-center p-8 text-surface-400">No questions found.</div>

    if (showResult && resultData) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-6 bg-surface-800/30 rounded-2xl border border-surface-700">
                <h3 className="text-3xl font-bold text-surface-100">Quiz Complete!</h3>
                <div className="text-center">
                    <p className="text-5xl font-bold text-primary-400 mb-2">
                        {Math.round((resultData.score / resultData.total_questions) * 100)}%
                    </p>
                    <p className="text-surface-400">
                        You scored {resultData.score} out of {resultData.total_questions}
                    </p>
                    <p className="text-sm text-primary-300 mt-2">
                        +{resultData.xp_gained} XP Earned!
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={loadQuiz}
                        className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors font-medium shadow-lg shadow-primary-900/20"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    const currentQuestion = questions[currentQ]
    const selectedOption = answers[currentQuestion.id]

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <div className="mb-6 flex justify-between items-center text-surface-400 text-sm font-medium">
                <div className="flex items-center gap-4">
                    <span>Question {currentQ + 1} of {questions.length}</span>
                </div>
            </div>

            <div className="bg-surface-800 p-8 rounded-2xl border border-surface-700 shadow-xl">
                <h3 className="text-xl font-medium text-surface-100 mb-6 leading-relaxed">
                    {currentQuestion.text}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center font-mono ${selectedOption === idx
                                ? 'bg-primary-600/20 border-primary-500 text-primary-200'
                                : 'bg-surface-700/50 border-surface-600 hover:bg-surface-700 hover:border-surface-500 text-surface-200'
                                }`}
                        >
                            <span>{opt}</span>
                            {selectedOption === idx && <span>Selected</span>}
                        </button>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={nextQuestion}
                        disabled={selectedOption === undefined}
                        className={`px-6 py-3 rounded-xl font-medium transition-colors ${selectedOption !== undefined
                            ? 'bg-primary-600 hover:bg-primary-500 text-white'
                            : 'bg-surface-700 text-surface-500 cursor-not-allowed'
                            }`}
                    >
                        {currentQ < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
                    </button>
                </div>
            </div>
        </div>
    )
}

function Transcripts() {
    return (
        <div className="space-y-4 max-w-3xl">
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    1. What you're going to get from this course
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Hello and welcome to the world's best Python bootcamp! My name is Angela...
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    2. Python Variables
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Variables are like a box with a name label. You can store data in it and retrieve it later using the name.
                    <br /><br />
                    Example: <code>name = "Jack"</code>
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    3. Variable Naming
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Make your code readable. Use descriptive names.
                    <br />
                    Bad: <code>n = "Angela"</code>
                    <br />
                    Good: <code>name = "Angela"</code>
                    <br />
                    Separate words with underscores: <code>user_name</code>.
                </div>
            </details>
        </div>
    )
}

export default Practice
