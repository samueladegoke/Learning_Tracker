import { useState, useEffect } from 'react'
import { quizApi } from '../api/quizApi'
import { rpgAPI } from '../api/client'
import CodeBlock from '../components/CodeBlock'
import CodeEditor from '../components/CodeEditor'

const DAY_META = {
    'day-1': {
        label: 'Day 1',
        title: 'Day 1: Variables & Strings',
        subtitle: 'Mastering the fundamentals of Python data management.',
        quizId: 'day-1-practice',
        level: 'beginner',
        topics: ['variables', 'print', 'input', 'strings']
    },
    'day-2': {
        label: 'Day 2',
        title: 'Day 2: Data Types & Number Manipulation',
        subtitle: 'Turn raw input into the right types, format output cleanly, and avoid math gotchas.',
        quizId: 'day-2-practice',
        level: 'beginner',
        topics: ['integers', 'floats', 'strings']
    },
    'day-3': {
        label: 'Day 3',
        title: 'Day 3: Control Flow & Logical Operators',
        subtitle: 'Make decisions in code with if/else, conditionals, and logical operators.',
        quizId: 'day-3-practice',
        level: 'beginner',
        topics: ['control-flow', 'logical-operators', 'modulo', 'conditionals']
    }
}

function Practice() {
    const [activeTab, setActiveTab] = useState('deep-dive')
    const [activeDay, setActiveDay] = useState('day-2')

    const currentDay = DAY_META[activeDay]

    return (
        <div className="space-y-8 pb-12">
            <header className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                    {Object.entries(DAY_META).map(([key, meta]) => (
                        <button
                            key={key}
                            onClick={() => setActiveDay(key)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border ${activeDay === key
                                ? 'bg-primary-500/10 text-primary-200 border-primary-500/60'
                                : 'bg-surface-800 text-surface-300 border-surface-700 hover:text-surface-100'
                                }`}
                        >
                            {meta.label}
                        </button>
                    ))}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-surface-100 font-display">{currentDay.title}</h1>
                    <p className="text-surface-400 mt-2">{currentDay.subtitle}</p>
                </div>
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
                {activeTab === 'deep-dive' && <DeepDive activeDay={activeDay} />}
                {activeTab === 'quiz' && <Quiz quizId={currentDay.quizId} activeDay={activeDay} />}
                {activeTab === 'transcripts' && <Transcripts activeDay={activeDay} />}
            </div>
        </div>
    )
}

function DeepDive({ activeDay }) {
    const components = {
        'day-1': DeepDiveDay1,
        'day-2': DeepDiveDay2,
        'day-3': DeepDiveDay3
    }
    const Component = components[activeDay]
    if (!Component) {
        return <div className="text-surface-400 p-8">Content for {activeDay} coming soon...</div>
    }
    return <Component />
}

function DeepDiveDay1() {
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
                        and use curly braces <code>{'{}'}</code>.
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

function DeepDiveDay2() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Section 1: Primitive Data Types */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Primitive Data Types
                    </h2>
                    <p>
                        Python stores numbers and text with different types: <strong>int</strong> for whole numbers,
                        <strong> float</strong> for decimals, <strong>bool</strong> for True/False, and <strong>str</strong> for text.
                        Use <code>type()</code> when you are unsure what you are holding.
                    </p>
                    <CodeBlock code={`score = 42          # int
pi = 3.14159       # float
is_subscribed = False  # bool
welcome = "Hello"  # str

print(type(score))           # <class 'int'>
print(734_529.678)           # underscores improve readability`} />

                    <div className="bg-surface-800/50 p-6 rounded-xl border border-surface-700">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">Spot the type quickly</h3>
                        <ul className="space-y-2 list-disc list-inside text-surface-300">
                            <li>Quotes (<code>\"\"</code> or <code>''</code>) mean <strong>string</strong> even if the text looks numeric.</li>
                            <li>Decimals or scientific notation (<code>1e3</code>) mean <strong>float</strong>.</li>
                            <li><code>True</code> or <code>False</code> (no quotes) are <strong>bool</strong>.</li>
                            <li>Use <code>int()</code> or <code>float()</code> to convert when needed.</li>
                        </ul>
                    </div>
                </section>

                {/* Section 2: Type Conversion & Input */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Type Conversion & Input
                    </h2>
                    <p>
                        <code>input()</code> always returns a string. Converting before math prevents <code>TypeError</code>.
                        Chain conversions to reshape data (e.g., string → float → rounded int).
                    </p>
                    <CodeBlock code={`height = float(input("Height (m): "))
weight = float(input("Weight (kg): "))

# BMI formula: weight divided by height squared
bmi = weight / (height ** 2)

# Round to 1 decimal for display
print(f"Your BMI is {bmi:.1f}")`} />
                    <p>
                        Conversion is also handy when slicing strings. For example, pulling digits out of a number-string
                        and turning them back into integers to sum them.
                    </p>
                    <CodeBlock code={`two_digit = input("Enter a two-digit number: ")  # e.g. "49"
total = int(two_digit[0]) + int(two_digit[1])
print(f"Digit sum = {total}")`} />
                </section>

                {/* Section 3: Number Manipulation & Formatting */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Number Manipulation & Formatting
                    </h2>
                    <p>
                        Operators you will use daily: <code>**</code> exponent, <code>//</code> floor division,
                        <code>%</code> remainder, and <code>round(value, ndigits)</code> for friendly output.
                        Order of operations follows PEMDAS (parentheses, exponents, multiply/divide, add/subtract).
                    </p>
                    <CodeBlock code={`result = 6 + 4 / 2 - (1 * 2)   # 6.0
print(8 // 3)   # 2 -> floor division
print(8 % 3)    # 2 -> remainder
print(round(3.14159, 2))  # 3.14`} />

                    <h3 className="text-lg font-semibold text-surface-100 mt-4">F-Strings for money math</h3>
                    <p>
                        Format currency to exactly two decimals with f-strings—perfect for the Day 2 tip calculator.
                    </p>
                    <CodeBlock code={`total_bill = 124.56
tip_percent = 12
people = 7

bill_with_tip = total_bill * (1 + tip_percent / 100)
split = bill_with_tip / people
print(f"Each person pays: \${split:.2f}")  # always shows 2 decimal places`} />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Float Precision</h4>
                            <p className="text-sm text-surface-400">
                                Binary floating points can show tiny rounding artifacts (see Python docs on floating point).
                                Use <code>round(value, 2)</code> for display, or <code>Decimal</code> for money-critical math.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Readable Numbers</h4>
                            <p className="text-sm text-surface-400">
                                Underscores in numeric literals (<code>1_000_000</code>) keep code legible without changing the value.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Quick Type Checks</h4>
                            <p className="text-sm text-surface-400">
                                When debugging TypeErrors, sprinkle <code>print(type(value))</code> before the failing line to confirm
                                exactly what you are adding or dividing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DeepDiveDay3() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Section 1: Control Flow with if/else */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Control Flow with if/else
                    </h2>
                    <p>
                        Control flow lets your program make decisions. Think of a bathtub overflow mechanism—when water
                        reaches a certain level, it drains; otherwise, it keeps filling. This "&gt;if this, then that" logic
                        is the foundation of conditional programming.
                    </p>
                    <CodeBlock code={`# Basic if/else structure
height = 130

if height >= 120:
    print("You can ride the roller coaster!")
else:
    print("Sorry, you have to grow taller.")`} />

                    <div className="bg-surface-800/50 p-6 rounded-xl border border-surface-700">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">Comparison Operators</h3>
                        <ul className="grid grid-cols-2 gap-3 text-surface-300">
                            <li><code>&gt;</code> — Greater than</li>
                            <li><code>&lt;</code> — Less than</li>
                            <li><code>&gt;=</code> — Greater than or equal</li>
                            <li><code>&lt;=</code> — Less than or equal</li>
                            <li><code>==</code> — Equal to (comparison)</li>
                            <li><code>!=</code> — Not equal to</li>
                        </ul>
                        <p className="text-surface-400 text-sm mt-3">
                            <strong>Remember:</strong> <code>=</code> assigns a value, <code>==</code> compares values.
                        </p>
                    </div>
                </section>

                {/* Section 2: The Modulo Operator */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> The Modulo Operator
                    </h2>
                    <p>
                        The modulo operator (<code>%</code>) returns the <em>remainder</em> after division.
                        It's incredibly useful for checking if numbers are even/odd or for cycling through values.
                    </p>
                    <CodeBlock code={`# Modulo gives the remainder
print(10 % 5)  # Output: 0 (divides evenly)
print(10 % 3)  # Output: 1 (10 ÷ 3 = 3 remainder 1)

# Classic use: check if even or odd
number = 7
if number % 2 == 0:
    print("Even")
else:
    print("Odd")  # This prints`} />
                </section>

                {/* Section 3: Nested if and elif Statements */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Nested if and elif Statements
                    </h2>
                    <p>
                        Use <code>elif</code> (else-if) to check multiple conditions in sequence. Only the first
                        matching condition runs. <strong>Nested</strong> if statements let you check conditions
                        inside other conditions.
                    </p>
                    <CodeBlock code={`# Ticket pricing with elif
age = 15

if age < 12:
    bill = 5
    print("Child ticket: $5")
elif age <= 18:
    bill = 7
    print("Youth ticket: $7")
else:
    bill = 12
    print("Adult ticket: $12")`} />

                    <div className="bg-surface-800/50 p-6 rounded-xl border border-surface-700">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">if/elif/else vs Multiple if</h3>
                        <ul className="space-y-2 list-disc list-inside text-surface-300">
                            <li><code>if/elif/else</code> — Only ONE branch executes (first match wins)</li>
                            <li>Multiple <code>if</code> statements — Each condition is checked independently</li>
                        </ul>
                    </div>
                </section>

                {/* Section 4: Logical Operators */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Logical Operators
                    </h2>
                    <p>
                        Combine multiple conditions using <code>and</code>, <code>or</code>, and <code>not</code>.
                    </p>
                    <CodeBlock code={`a = 12

# AND: Both must be True
print(a > 10 and a < 15)  # True

# OR: At least one must be True
print(a > 15 or a < 20)   # True

# NOT: Reverses the condition
print(not a > 15)         # True (because a > 15 is False)`} />

                    <div className="bg-surface-800/50 p-6 rounded-xl border border-surface-700">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">Truth Table Quick Reference</h3>
                        <div className="grid grid-cols-3 gap-4 text-sm font-mono">
                            <div>
                                <p className="font-bold text-surface-200 mb-2">AND</p>
                                <p className="text-green-400">T and T → T</p>
                                <p className="text-red-400">T and F → F</p>
                                <p className="text-red-400">F and T → F</p>
                                <p className="text-red-400">F and F → F</p>
                            </div>
                            <div>
                                <p className="font-bold text-surface-200 mb-2">OR</p>
                                <p className="text-green-400">T or T → T</p>
                                <p className="text-green-400">T or F → T</p>
                                <p className="text-green-400">F or T → T</p>
                                <p className="text-red-400">F or F → F</p>
                            </div>
                            <div>
                                <p className="font-bold text-surface-200 mb-2">NOT</p>
                                <p className="text-red-400">not T → F</p>
                                <p className="text-green-400">not F → T</p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* Sidebar: Pro Tips */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <span className="text-xl">💡</span> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Indentation Matters</h4>
                            <p className="text-sm text-surface-400">
                                Python uses indentation to define code blocks. Mixing tabs and spaces will cause <code>IndentationError</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Case-Insensitive Input</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>.lower()</code> to normalize user input:
                            </p>
                            <CodeBlock code={`choice = input("Left or Right? ").lower()
if choice == "left":
    print("You continue...")`} />
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Day 3 Project</h4>
                            <p className="text-sm text-surface-400">
                                <strong>Treasure Island</strong> — A text-based adventure game using nested conditionals.
                                Players make choices (left/right, swim/wait) leading to different endings!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Quiz({ quizId, activeDay }) {
    const [questions, setQuestions] = useState([])
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState({}) // { questionId: selectedIndex or { code, passed, total } }
    const [showResult, setShowResult] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [resultData, setResultData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [quizStats, setQuizStats] = useState(null)
    const [xpWarning, setXpWarning] = useState(null)

    useEffect(() => {
        loadQuiz(quizId)
    }, [quizId])

    const loadQuiz = async (targetQuizId) => {
        try {
            if (!targetQuizId) {
                setError('No quiz selected.')
                setQuestions([])
                setLoading(false)
                return
            }
            setLoading(true)
            setError(null)

            // Fetch questions from Supabase
            const data = await quizApi.getQuestions(targetQuizId)
            setQuestions(data || [])

            // Get quiz stats
            if (data && data.length > 0) {
                const stats = await quizApi.getQuizStats(targetQuizId)
                setQuizStats(stats)
            }

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

    const handleMCQAnswer = (optionIndex) => {
        const questionId = questions[currentQ].id
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }))
    }

    const handleCodingResult = (result) => {
        const questionId = questions[currentQ].id
        setAnswers(prev => ({
            ...prev,
            [questionId]: result
        }))
    }

    const nextQuestion = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(c => c + 1)
        } else {
            finishQuiz()
        }
    }

    const prevQuestion = () => {
        if (currentQ > 0) {
            setCurrentQ(c => c - 1)
        }
    }

    const finishQuiz = async () => {
        setIsSubmitting(true)
        try {
            // Calculate score locally
            let score = 0
            let totalAnswered = 0

            questions.forEach(q => {
                const answer = answers[q.id]
                if (answer === undefined) return
                totalAnswered++

                if (q.question_type === 'mcq') {
                    if (answer === q.correct_index) {
                        score++
                    }
                } else if (q.question_type === 'coding') {
                    if (answer.allPassed) {
                        score++
                    }
                }
            })

            // Try to award XP via backend
            const xpToAward = score * 10
            let xpAwarded = false
            try {
                await rpgAPI.awardXP(xpToAward)
                xpAwarded = true
                setXpWarning(null)
            } catch (xpError) {
                console.warn('Could not award XP:', xpError)
                setXpWarning(`XP could not be saved to your profile. ${xpError.message || 'Please check your connection.'}`)
            }

            setResultData({
                score,
                total_questions: questions.length,
                xp_gained: score * 10,
                xp_saved: xpAwarded
            })
            setShowResult(true)
        } catch (error) {
            console.error('Error submitting score:', error)
            setError('Failed to submit quiz. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center p-8">
            <div className="flex items-center gap-3 text-surface-400">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                Loading quiz from Supabase...
            </div>
        </div>
    )

    if (error) return (
        <div className="text-center p-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => loadQuiz(quizId)} className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors">
                Retry
            </button>
        </div>
    )

    if (questions.length === 0) return (
        <div className="text-center p-8">
            <div className="text-surface-400 mb-4">No questions found for this quiz.</div>
            <p className="text-surface-500 text-sm">
                Run the seeding script to add questions:
                <br />
                <code className="bg-surface-800 px-2 py-1 rounded mt-2 inline-block">python scripts/seed_supabase_questions.py</code>
            </p>
        </div>
    )

    if (showResult && resultData) {
        const percentage = Math.round((resultData.score / resultData.total_questions) * 100)
        const isPerfect = percentage === 100
        const isPassing = percentage >= 70

        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 bg-surface-800/30 rounded-2xl border border-surface-700 p-8">
                <div className={`text-6xl ${isPerfect ? 'animate-bounce' : ''}`}>
                    {isPerfect ? '🏆' : isPassing ? '🎉' : '📚'}
                </div>
                <h3 className="text-3xl font-bold text-surface-100">Quiz Complete!</h3>
                <div className="text-center">
                    <p className={`text-5xl font-bold mb-2 ${isPerfect ? 'text-yellow-400' : isPassing ? 'text-primary-400' : 'text-amber-400'
                        }`}>
                        {percentage}%
                    </p>
                    <p className="text-surface-400">
                        You scored {resultData.score} out of {resultData.total_questions}
                    </p>
                    <p className="text-sm text-primary-300 mt-2">
                        +{resultData.xp_gained} XP Earned!
                        {!resultData.xp_saved && (
                            <span className="block text-amber-400 text-xs mt-1">
                                ⚠️ XP not saved to profile
                            </span>
                        )}
                    </p>
                    {xpWarning && (
                        <p className="text-xs text-amber-400 mt-2 p-2 bg-amber-500/10 rounded border border-amber-500/30">
                            {xpWarning}
                        </p>
                    )}
                </div>

                {quizStats && (
                    <div className="flex gap-4 text-sm text-surface-500">
                        <span>MCQ: {quizStats.byType.mcq}</span>
                        <span>•</span>
                        <span>Coding: {quizStats.byType.coding}</span>
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={() => loadQuiz(quizId)}
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
    const isMCQ = currentQuestion.question_type === 'mcq'
    const isCoding = currentQuestion.question_type === 'coding'

    // Check if current question is answered
    const isAnswered = isMCQ
        ? selectedOption !== undefined
        : selectedOption?.code !== undefined

    return (
        <div className="max-w-4xl mx-auto mt-4">
            {/* Progress bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center text-surface-400 text-sm font-medium mb-2">
                    <div className="flex items-center gap-4">
                        <span>Question {currentQ + 1} of {questions.length}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${isMCQ ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            }`}>
                            {isMCQ ? 'Multiple Choice' : 'Coding Challenge'}
                        </span>
                        {currentQuestion.difficulty && (
                            <span className={`px-2 py-1 rounded-full text-xs ${currentQuestion.difficulty === 'easy' ? 'bg-green-500/10 text-green-400' :
                                currentQuestion.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                                    'bg-red-500/10 text-red-400'
                                }`}>
                                {currentQuestion.difficulty}
                            </span>
                        )}
                    </div>
                    <span className="text-surface-500">
                        {DAY_META[activeDay]?.label} Quiz
                    </span>
                </div>
                <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-300"
                        style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="bg-surface-800 p-8 rounded-2xl border border-surface-700 shadow-xl">
                <h3 className="text-xl font-medium text-surface-100 mb-6 leading-relaxed">
                    {(() => {
                        const text = currentQuestion?.text || ''
                        if (!text.includes('\\n')) return text
                        const [prompt, ...codeLines] = text.split('\\n')
                        return (
                            <div className="space-y-2">
                                <span>{prompt}</span>
                                <pre className="bg-surface-900 p-4 rounded-lg text-sm font-mono text-primary-300 overflow-x-auto">
                                    {codeLines.join('\n')}
                                </pre>
                            </div>
                        )
                    })()}
                </h3>

                {/* MCQ Options */}
                {isMCQ && currentQuestion.options && (
                    <div className="space-y-3">
                        {currentQuestion.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleMCQAnswer(idx)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center ${selectedOption === idx
                                    ? 'bg-primary-600/20 border-primary-500 text-primary-200'
                                    : 'bg-surface-700/50 border-surface-600 hover:bg-surface-700 hover:border-surface-500 text-surface-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${selectedOption === idx
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-surface-600 text-surface-300'
                                        }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="font-mono text-sm">{opt}</span>
                                </div>
                                {selectedOption === idx && (
                                    <span className="text-primary-400">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Coding Challenge */}
                {isCoding && (
                    <div className="mt-4">
                        <CodeEditor
                            starterCode={currentQuestion.starter_code || '# Write your code here\n'}
                            testCases={currentQuestion.test_cases || []}
                            onResult={handleCodingResult}
                            questionId={currentQuestion.id}
                        />
                        {selectedOption?.allPassed !== undefined && (
                            <div className={`mt-4 p-4 rounded-lg ${selectedOption.allPassed
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                                }`}>
                                {selectedOption.allPassed
                                    ? `✓ All ${selectedOption.total} test cases passed!`
                                    : `${selectedOption.passed} of ${selectedOption.total} test cases passed`
                                }
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={prevQuestion}
                        disabled={currentQ === 0}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentQ === 0
                            ? 'text-surface-600 cursor-not-allowed'
                            : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700'
                            }`}
                    >
                        ← Previous
                    </button>

                    <div className="flex gap-2">
                        {questions.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentQ(idx)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${idx === currentQ
                                    ? 'bg-primary-600 text-white'
                                    : answers[questions[idx].id] !== undefined
                                        ? 'bg-primary-600/20 text-primary-400'
                                        : 'bg-surface-700 text-surface-400 hover:bg-surface-600'
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={nextQuestion}
                        disabled={!isAnswered && isMCQ}
                        className={`px-6 py-3 rounded-xl font-medium transition-colors ${isAnswered || !isMCQ
                            ? 'bg-primary-600 hover:bg-primary-500 text-white'
                            : 'bg-surface-700 text-surface-500 cursor-not-allowed'
                            }`}
                    >
                        {currentQ < questions.length - 1 ? 'Next →' : 'Submit Quiz'}
                    </button>
                </div>
            </div>

            {/* Explanation (shown after answering) */}
            {currentQuestion.explanation && isAnswered && (
                <div className="mt-4 p-4 bg-surface-800/50 rounded-xl border border-surface-700">
                    <h4 className="text-sm font-medium text-primary-400 mb-2">💡 Explanation</h4>
                    <p className="text-surface-300 text-sm">{currentQuestion.explanation}</p>
                </div>
            )}
        </div>
    )
}

function Transcripts({ activeDay }) {
    const components = {
        'day-1': TranscriptsDay1,
        'day-2': TranscriptsDay2,
        'day-3': TranscriptsDay3
    }
    const Component = components[activeDay]
    if (!Component) {
        return <div className="text-surface-400 p-8">Transcripts for {activeDay} coming soon...</div>
    }
    return <Component />
}

function TranscriptsDay1() {
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

function TranscriptsDay2() {
    return (
        <div className="space-y-4 max-w-3xl">
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    1. Python Primitive Data Types
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Integers, floats, booleans, and strings each store data differently. Use <code>type()</code> to inspect values,
                    and remember that quotes instantly turn numbers into strings.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    2. Type Errors and Conversion
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Mixing strings with ints in math triggers <code>TypeError</code>. Convert with <code>int()</code>, <code>float()</code>, or <code>str()</code>
                    before concatenating or calculating.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    3. Number Manipulation & F-Strings
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Use math operators (<code>**</code>, <code>//</code>, <code>%</code>) and PEMDAS to shape calculations. F-strings make it easy to
                    embed values and format decimals (e.g., <code>{'{value:.2f}'}</code> for money).
                </div>
            </details>
        </div>
    )
}

function TranscriptsDay3() {
    return (
        <div className="space-y-4 max-w-3xl">
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    1. Control Flow with if/else
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Think of a bathtub overflow mechanism—when water reaches above 80cm, it drains; otherwise, it keeps filling.
                    This conditional logic is represented with <code>if</code> and <code>else</code> statements. The key syntax:
                    the <code>if</code> keyword, a condition, a colon, and indented code blocks.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    2. The Modulo Operator
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    The modulo operator (<code>%</code>) gives the remainder after division. <code>10 % 5 = 0</code> (divides evenly),
                    <code>10 % 3 = 1</code> (remainder 1). Classic use: checking if a number is even (<code>num % 2 == 0</code>) or odd.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    3. Nested if and elif Statements
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Use <code>elif</code> (else-if) to check multiple conditions. First matching condition wins.
                    Nested if statements let you check conditions inside other conditions—like checking age-based pricing
                    only after confirming height requirements.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    4. Multiple If Statements
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Unlike <code>if/elif/else</code> where only ONE branch runs, multiple separate <code>if</code> statements
                    are each checked independently. Use this when you need to check conditions that aren't mutually exclusive—
                    like adding photo costs after determining ticket price.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    5. Logical Operators (and, or, not)
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Combine conditions: <code>and</code> requires both to be True, <code>or</code> requires at least one,
                    <code>not</code> reverses the condition. Example: <code>age {'>'}= 45 and age {'<'}= 55</code> catches the
                    "midlife crisis" age range for special pricing.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    6. Day 3 Project: Treasure Island
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Build a "Choose Your Own Adventure" game! Ask players to go left or right, swim or wait for a boat,
                    and choose between colored doors. Use <code>.lower()</code> to handle case variations in input.
                    ASCII art makes it fun—find creative art at ascii.co.uk/art!
                </div>
            </details>
        </div>
    )
}

export default Practice
