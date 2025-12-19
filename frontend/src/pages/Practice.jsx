import { useState, useEffect, lazy, Suspense } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trophy, PartyPopper, BookOpen, Check, X, Lightbulb, ArrowLeft, ArrowRight, CheckCircle, Loader2, Sparkles, Brain, Sword } from 'lucide-react'
import { rpgAPI, quizzesAPI, srsAPI } from '../api/client'
import CodeBlock from '../components/CodeBlock'
import CodeEditor from '../components/CodeEditor'
import { InlineCode } from '../components/InlineCode'

// Lazy load DeepDive components for code splitting
const DeepDiveDay1 = lazy(() => import('../components/content/DeepDive/Day1'))
const DeepDiveDay2 = lazy(() => import('../components/content/DeepDive/Day2'))
const DeepDiveDay3 = lazy(() => import('../components/content/DeepDive/Day3'))
const DeepDiveDay4 = lazy(() => import('../components/content/DeepDive/Day4'))
const DeepDiveDay5 = lazy(() => import('../components/content/DeepDive/Day5'))
const DeepDiveDay6 = lazy(() => import('../components/content/DeepDive/Day6'))
const DeepDiveDay7 = lazy(() => import('../components/content/DeepDive/Day7'))
const DeepDiveDay8 = lazy(() => import('../components/content/DeepDive/Day8'))
const DeepDiveDay9 = lazy(() => import('../components/content/DeepDive/Day9'))
const DeepDiveDay10 = lazy(() => import('../components/content/DeepDive/Day10'))
const DeepDiveDay11 = lazy(() => import('../components/content/DeepDive/Day11'))
const DeepDiveDay12 = lazy(() => import('../components/content/DeepDive/Day12'))
const DeepDiveDay13 = lazy(() => import('../components/content/DeepDive/Day13'))
const DeepDiveDay14 = lazy(() => import('../components/content/DeepDive/Day14'))
const DeepDiveDay15 = lazy(() => import('../components/content/DeepDive/Day15'))
const DeepDiveDay16 = lazy(() => import('../components/content/DeepDive/Day16'))
const DeepDiveDay17 = lazy(() => import('../components/content/DeepDive/Day17'))
const DeepDiveDay18 = lazy(() => import('../components/content/DeepDive/Day18'))
const DeepDiveDay19 = lazy(() => import('../components/content/DeepDive/Day19'))
const DeepDiveDay20 = lazy(() => import('../components/content/DeepDive/Day20'))
const DeepDiveDay21 = lazy(() => import('../components/content/DeepDive/Day21'))
const DeepDiveDay22 = lazy(() => import('../components/content/DeepDive/Day22'))
const DeepDiveDay23 = lazy(() => import('../components/content/DeepDive/Day23'))
const DeepDiveDay24 = lazy(() => import('../components/content/DeepDive/Day24'))
const DeepDiveDay25 = lazy(() => import('../components/content/DeepDive/Day25'))
const DeepDiveDay26 = lazy(() => import('../components/content/DeepDive/Day26'))
const DeepDiveDay27 = lazy(() => import('../components/content/DeepDive/Day27'))
const DeepDiveDay28 = lazy(() => import('../components/content/DeepDive/Day28'))
const DeepDiveDay29 = lazy(() => import('../components/content/DeepDive/Day29'))
const DeepDiveDay30 = lazy(() => import('../components/content/DeepDive/Day30'))
const DeepDiveDay31 = lazy(() => import('../components/content/DeepDive/Day31'))
const DeepDiveDay32 = lazy(() => import('../components/content/DeepDive/Day32'))
const DeepDiveDay33 = lazy(() => import('../components/content/DeepDive/Day33'))
const DeepDiveDay34 = lazy(() => import('../components/content/DeepDive/Day34'))
const DeepDiveDay35 = lazy(() => import('../components/content/DeepDive/Day35'))
const DeepDiveDay36 = lazy(() => import('../components/content/DeepDive/Day36'))
const DeepDiveDay37 = lazy(() => import('../components/content/DeepDive/Day37'))
const DeepDiveDay38 = lazy(() => import('../components/content/DeepDive/Day38'))
const DeepDiveDay39 = lazy(() => import('../components/content/DeepDive/Day39'))
const DeepDiveDay40 = lazy(() => import('../components/content/DeepDive/Day40'))
const DeepDiveDay41 = lazy(() => import('../components/content/DeepDive/Day41'))
const DeepDiveDay42 = lazy(() => import('../components/content/DeepDive/Day42'))
const DeepDiveDay43 = lazy(() => import('../components/content/DeepDive/Day43'))
const DeepDiveDay44 = lazy(() => import('../components/content/DeepDive/Day44'))
const DeepDiveDay45 = lazy(() => import('../components/content/DeepDive/Day45'))
const DeepDiveDay46 = lazy(() => import('../components/content/DeepDive/Day46'))
const DeepDiveDay47 = lazy(() => import('../components/content/DeepDive/Day47'))
const DeepDiveDay48 = lazy(() => import('../components/content/DeepDive/Day48'))
const DeepDiveDay49 = lazy(() => import('../components/content/DeepDive/Day49'))
const DeepDiveDay50 = lazy(() => import('../components/content/DeepDive/Day50'))
const DeepDiveDay51 = lazy(() => import('../components/content/DeepDive/Day51'))
const DeepDiveDay52 = lazy(() => import('../components/content/DeepDive/Day52'))
const DeepDiveDay53 = lazy(() => import('../components/content/DeepDive/Day53'))
const DeepDiveDay54 = lazy(() => import('../components/content/DeepDive/Day54'))
const DeepDiveDay55 = lazy(() => import('../components/content/DeepDive/Day55'))

// Loading fallback component for lazy-loaded DeepDive content
const DeepDiveLoader = () => (
    <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
        <span className="ml-3 text-surface-300">Loading content...</span>
    </div>
)

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
    },
    'day-4': {
        label: 'Day 4',
        title: 'Day 4: Randomisation & Python Lists',
        subtitle: 'Generate random numbers, store collections of data, and build your first game.',
        quizId: 'day-4-practice',
        level: 'beginner',
        topics: ['random', 'lists', 'indexing', 'modules']
    },
    'day-5': {
        label: 'Day 5',
        title: 'Day 5: Python Loops',
        subtitle: 'Learn to use loops to repeat tasks and process data structures efficiently.',
        quizId: 'day-5-practice',
        level: 'beginner',
        topics: ['for-loops', 'range', 'code-blocks', 'algorithms']
    },
    'day-6': {
        label: 'Day 6',
        title: 'Day 6: Python Functions & Karel',
        subtitle: 'Defining Functions, While Loops, and Algorithmic Thinking.',
        quizId: 'day-6-practice',
        level: 'Beginner',
        topics: ['functions', 'while-loops', 'indentation', 'algorithms']
    },
    'day-7': {
        label: 'Day 7',
        title: 'Day 7: Hangman Project',
        subtitle: 'Flowcharts, Lists, Strings, and Building a Complete Game.',
        quizId: 'day-7-practice',
        level: 'Beginner',
        topics: ['flowcharts', 'lists', 'strings', 'modules']
    },
    'day-8': {
        label: 'Day 8',
        title: 'Day 8: Function Parameters & Caesar Cipher',
        subtitle: 'Learn about inputs, arguments, parameters, and encryption with the Caesar Cipher.',
        quizId: 'day-8-practice',
        level: 'beginner',
        topics: ['functions', 'parameters', 'arguments', 'caesar-cipher']
    },
    'day-9': {
        label: 'Day 9',
        title: 'Day 9: Dictionaries, Nesting & the Secret Auction',
        subtitle: 'Use key/value data structures, nest lists and dicts, and build the Secret Auction project.',
        quizId: 'day-9-practice',
        level: 'beginner',
        topics: ['dictionaries', 'nesting', 'loops', 'conditionals']
    },
    'day-10': {
        label: 'Day 10',
        title: 'Day 10: Functions with Outputs',
        subtitle: 'Master return statements, docstrings, and build a Calculator using functions as first-class values.',
        quizId: 'day-10-practice',
        level: 'beginner',
        topics: ['return', 'docstrings', 'first-class-functions', 'calculator']
    },
    'day-11': {
        label: 'Day 11',
        title: 'Day 11: Blackjack Capstone Project',
        subtitle: 'Apply everything: lists, loops, functions, and conditionals to build a complete Blackjack game.',
        quizId: 'day-11-practice',
        level: 'beginner',
        topics: ['capstone', 'lists', 'functions', 'game-logic']
    },
    'day-12': {
        label: 'Day 12',
        title: 'Day 12: Scope & Number Guessing Game',
        subtitle: 'Understand local vs global scope, constants, and build an interactive Number Guessing Game.',
        quizId: 'day-12-practice',
        level: 'beginner',
        topics: ['scope', 'global', 'local', 'constants']
    },
    'day-13': {
        label: 'Day 13',
        title: 'Day 13: Debugging',
        subtitle: 'Learn systematic strategies to find and fix errors in your code.',
        quizId: 'day-13-practice',
        level: 'beginner',
        topics: ['debugging', 'trace', 'print', 'debugger']
    },
    'day-14': {
        label: 'Day 14',
        title: 'Day 14: Higher Lower Game',
        subtitle: 'Build a data-driven comparison game using lists of dictionaries.',
        quizId: 'day-14-practice',
        level: 'beginner',
        topics: ['game-logic', 'dictionaries', 'lists', 'random']
    },
    'day-15': {
        label: 'Day 15',
        title: 'Day 15: Coffee Machine',
        subtitle: 'Local Development Setup and the Coffee Machine project.',
        quizId: 'day-15-practice',
        level: 'intermediate',
        topics: ['ide', 'setup', 'game-loop', 'resources']
    },
    'day-16': {
        label: 'Day 16',
        title: 'Day 16: OOP',
        subtitle: 'Introduction to Object Oriented Programming, Classes, Objects, and the Turtle module.',
        quizId: 'day-16-practice',
        level: 'intermediate',
        topics: ['oop', 'classes', 'objects', 'turtle']
    },
    'day-17': {
        label: 'Day 17',
        title: 'Day 17: Quiz Project & OOP Benefits',
        subtitle: 'Create custom classes, constructors, methods, and build the Quiz Brain project.',
        quizId: 'day-17-practice',
        level: 'intermediate',
        topics: ['classes', 'init', 'self', 'methods', 'oop']
    },
    'day-18': {
        label: 'Day 18',
        title: 'Day 18: Turtle & GUI',
        subtitle: 'Draw graphics with Turtle, use RGB colors, tuples, and create a Hirst painting.',
        quizId: 'day-18-practice',
        level: 'intermediate',
        topics: ['turtle', 'tuples', 'rgb', 'graphics']
    },
    'day-19': {
        label: 'Day 19',
        title: 'Day 19: Higher Order Functions & Event Listeners',
        subtitle: 'Pass functions as arguments, listen for key events, and build a Turtle Race.',
        quizId: 'day-19-practice',
        level: 'intermediate',
        topics: ['higher-order', 'events', 'instances', 'state']
    },
    'day-20': {
        label: 'Day 20',
        title: 'Day 20: Snake Game Part 1',
        subtitle: 'Control animation with tracer/update, move segments, and refactor to a Snake class.',
        quizId: 'day-20-practice',
        level: 'intermediate',
        topics: ['animation', 'game-loop', 'oop', 'snake']
    },
    'day-21': {
        label: 'Day 21',
        title: 'Day 21: Snake Game Part 2 & Inheritance',
        subtitle: 'Class Inheritance, super(), and List Slicing applied to the Snake Game.',
        quizId: 'day-21-practice',
        level: 'intermediate',
        topics: ['inheritance', 'super', 'slicing', 'snake']
    },
    'day-22': {
        label: 'Day 22',
        title: 'Day 22: Pong Game',
        subtitle: 'Review classes and build the classic Pong arcade game.',
        quizId: 'day-22-practice',
        level: 'intermediate',
        topics: ['pong', 'game-logic', 'collision', 'physics']
    },
    'day-23': {
        label: 'Day 23',
        title: 'Day 23: Turtle Crossing',
        subtitle: 'Build a Frogger-style game with car managers and random generation.',
        quizId: 'day-23-practice',
        level: 'intermediate',
        topics: ['turtle-crossing', 'manager', 'random', 'logic']
    },
    'day-24': {
        label: 'Day 24',
        title: 'Day 24: Files & Paths',
        subtitle: 'Read and write to local files, understand absolute vs relative paths.',
        quizId: 'day-24-practice',
        level: 'intermediate',
        topics: ['files', 'paths', 'read', 'write']
    },
    'day-25': {
        label: 'Day 25',
        title: 'Day 25: CSV & Pandas',
        subtitle: 'Analyze data with the powerful Pandas library.',
        quizId: 'day-25-practice',
        level: 'intermediate',
        topics: ['pandas', 'csv', 'data-science', 'dataframes']
    },
    'day-26': {
        label: 'Day 26',
        title: 'Day 26: List Comprehension & NATO Alphabet',
        subtitle: 'Create lists in one line and transform data efficiently.',
        quizId: 'day-26-practice',
        level: 'intermediate',
        topics: ['list-comprehension', 'dictionary-comprehension', 'pandas-iteration']
    },
    'day-27': {
        label: 'Day 27',
        title: 'Day 27: Tkinter, *args & **kwargs',
        subtitle: 'Build GUIs and master flexible function arguments.',
        quizId: 'day-27-practice',
        level: 'intermediate',
        topics: ['tkinter', 'args', 'kwargs', 'gui']
    },
    'day-28': {
        label: 'Day 28',
        title: 'Day 28: Pomodoro Timer & Dynamic Typing',
        subtitle: 'Canvas widgets, timer mechanism, and Pythons flexibility.',
        quizId: 'day-28-practice',
        level: 'intermediate',
        topics: ['canvas', 'after-method', 'timer', 'dynamic-typing']
    },
    'day-29': {
        label: 'Day 29',
        title: 'Day 29: Password Manager GUI',
        subtitle: 'Grid layouts, file I/O, and clipboard management.',
        quizId: 'day-29-practice',
        level: 'intermediate',
        topics: ['grid-layout', 'file-io', 'messagebox', 'clipboard']
    },
    'day-30': {
        label: 'Day 30',
        title: 'Day 30: Errors, Exceptions & JSON',
        subtitle: 'Handle errors gracefully and store data in JSON format.',
        quizId: 'day-30-practice',
        level: 'intermediate',
        topics: ['exceptions', 'try-except', 'json', 'error-handling']
    },
    'day-31': {
        label: 'Day 31',
        title: 'Day 31: Flash Card App Capstone',
        subtitle: 'Build a complete flash card app with Canvas, after(), and pandas.',
        quizId: 'day-31-practice',
        level: 'intermediate',
        topics: ['tkinter-canvas', 'after', 'pandas', 'csv', 'json-save']
    },
    'day-32': {
        label: 'Day 32',
        title: 'Day 32: Email (SMTP) & datetime',
        subtitle: 'Send automated emails and work with dates and times.',
        quizId: 'day-32-practice',
        level: 'intermediate+',
        topics: ['smtplib', 'smtp', 'datetime', 'strftime', 'automation']
    },
    'day-33': {
        label: 'Day 33',
        title: 'Day 33: API Endpoints & Parameters',
        subtitle: 'Make HTTP requests, handle responses, and work with JSON APIs.',
        quizId: 'day-33-practice',
        level: 'intermediate+',
        topics: ['api', 'requests', 'http', 'json', 'parameters']
    },
    'day-34': {
        label: 'Day 34',
        title: 'Day 34: GUI Quiz App with API',
        subtitle: 'Build a trivia quiz app that fetches questions from an API.',
        quizId: 'day-34-practice',
        level: 'intermediate+',
        topics: ['trivia-api', 'html-entities', 'tkinter', 'quiz-logic']
    },
    'day-35': {
        label: 'Day 35',
        title: 'Day 35: API Authentication & SMS',
        subtitle: 'Secure API keys with environment variables and send SMS with Twilio.',
        quizId: 'day-35-practice',
        level: 'intermediate+',
        topics: ['api-auth', 'environment-variables', 'twilio', 'security']
    },
    'day-36': {
        label: 'Day 36',
        title: 'Day 36: Stock Trading News Alert',
        subtitle: 'Monitor stock prices and send news alerts for significant changes.',
        quizId: 'day-36-practice',
        level: 'intermediate+',
        topics: ['stock-api', 'news-api', 'percentage-change', 'sms-alerts']
    },
    'day-37': {
        label: 'Day 37',
        title: 'Day 37: Habit Tracking with Pixela',
        subtitle: 'Use POST, PUT, DELETE requests to build a habit tracker.',
        quizId: 'day-37-practice',
        level: 'intermediate+',
        topics: ['http-methods', 'pixela', 'headers', 'authentication']
    },
    'day-38': {
        label: 'Day 38',
        title: 'Day 38: Workout Tracking with Sheets',
        subtitle: 'Use natural language APIs and log workouts to Google Sheets.',
        quizId: 'day-38-practice',
        level: 'intermediate+',
        topics: ['nutritionix', 'sheety', 'google-sheets', 'nlp']
    },
    'day-39': {
        label: 'Day 39',
        title: 'Day 39: Flight Deal Finder (Part 1)',
        subtitle: 'Build an OOP flight search system with Tequila and Sheety APIs.',
        quizId: 'day-39-practice',
        level: 'advanced',
        topics: ['oop-architecture', 'tequila', 'iata-codes', 'flight-search']
    },
    'day-40': {
        label: 'Day 40',
        title: 'Day 40: Flight Deal Finder (Part 2)',
        subtitle: 'Extend the Flight Club with user management and email notifications.',
        quizId: 'day-40-practice',
        level: 'advanced',
        topics: ['email-smtp', 'user-management', 'notifications', 'stopovers']
    },
    'day-41': {
        label: 'Day 41',
        title: 'Day 41: Introduction to HTML',
        subtitle: 'Learn the fundamentals of HTML: tags, elements, headings, and structure.',
        quizId: 'day-41-practice',
        level: 'web-foundation',
        topics: ['html-basics', 'tags', 'elements', 'headings', 'paragraphs']
    },
    'day-42': {
        label: 'Day 42',
        title: 'Day 42: Intermediate HTML',
        subtitle: 'HTML boilerplate, lists, nesting, anchor links, and images.',
        quizId: 'day-42-practice',
        level: 'web-foundation',
        topics: ['boilerplate', 'lists', 'nesting', 'anchors', 'images']
    },
    'day-43': {
        label: 'Day 43',
        title: 'Day 43: Introduction to CSS',
        subtitle: 'Style your HTML with CSS: syntax, selectors, and styling methods.',
        quizId: 'day-43-practice',
        level: 'web-foundation',
        topics: ['css-basics', 'selectors', 'inline-css', 'external-css']
    },
    'day-44': {
        label: 'Day 44',
        title: 'Day 44: Intermediate CSS',
        subtitle: 'Colors, fonts, the CSS Box Model, and browser DevTools.',
        quizId: 'day-44-practice',
        level: 'web-foundation',
        topics: ['colors', 'fonts', 'box-model', 'devtools']
    },
    'day-45': {
        label: 'Day 45',
        title: 'Day 45: Web Scraping with Beautiful Soup',
        subtitle: 'Parse HTML and extract data with Python and Beautiful Soup.',
        quizId: 'day-45-practice',
        level: 'intermediate+',
        topics: ['beautifulsoup', 'web-scraping', 'find-all', 'css-selectors']
    },
    'day-46': {
        label: 'Day 46',
        title: 'Day 46: Musical Time Machine',
        subtitle: 'Scrape Billboard charts and create Spotify playlists with OAuth.',
        quizId: 'day-46-practice',
        level: 'intermediate+',
        topics: ['spotipy', 'oauth', 'billboard', 'web-scraping']
    },
    'day-47': {
        label: 'Day 47',
        title: 'Day 47: Amazon Price Tracker',
        subtitle: 'Scrape prices, send email alerts, and automate monitoring.',
        quizId: 'day-47-practice',
        level: 'intermediate+',
        topics: ['beautifulsoup', 'smtp', 'headers', 'price-tracking']
    },
    'day-48': {
        label: 'Day 48',
        title: 'Day 48: Selenium WebDriver',
        subtitle: 'Automate browsers with Selenium, XPath, and build a Cookie Clicker bot.',
        quizId: 'day-48-practice',
        level: 'intermediate+',
        topics: ['selenium', 'xpath', 'locators', 'automation']
    },
    'day-49': {
        label: 'Day 49',
        title: 'Day 49: Gym Booking Bot',
        subtitle: 'Advanced Selenium with profiles, WebDriverWait, and error handling.',
        quizId: 'day-49-practice',
        level: 'intermediate+',
        topics: ['selenium', 'waits', 'profiles', 'resilience']
    },
    'day-50': {
        label: 'Day 50',
        title: 'Day 50: Auto Swiping Bot',
        subtitle: 'Handle iframes, popups, multi-window navigation, and OAuth logins.',
        quizId: 'day-50-practice',
        level: 'intermediate+',
        topics: ['selenium', 'iframes', 'windows', 'popups']
    },
    'day-51': {
        label: 'Day 51',
        title: 'Day 51: Internet Speed Twitter Bot',
        subtitle: 'Test internet speed and tweet complaints at your ISP automatically.',
        quizId: 'day-51-practice',
        level: 'intermediate+',
        topics: ['selenium', 'speedtest', 'twitter', 'automation']
    },
    'day-52': {
        label: 'Day 52',
        title: 'Day 52: Instagram Follower Bot',
        subtitle: 'Automate following users from a target account to grow your following.',
        quizId: 'day-52-practice',
        level: 'intermediate+',
        topics: ['selenium', 'instagram', 'scrolling', 'rate-limiting']
    },
    'day-53': {
        label: 'Day 53',
        title: 'Day 53: Data Entry Capstone',
        subtitle: 'Scrape property listings and automate Google Form submissions.',
        quizId: 'day-53-practice',
        level: 'intermediate+',
        topics: ['beautifulsoup', 'selenium', 'web-scraping', 'automation']
    },
    'day-54': {
        label: 'Day 54',
        title: 'Day 54: Introduction to Flask',
        subtitle: 'Create web servers, understand decorators, and master __name__.',
        quizId: 'day-54-practice',
        level: 'intermediate+',
        topics: ['flask', 'decorators', 'web-server', 'python']
    },
    'day-55': {
        label: 'Day 55',
        title: 'Day 55: Flask Routing & Higher/Lower',
        subtitle: 'Build dynamic URL routes and create a number guessing game.',
        quizId: 'day-55-practice',
        level: 'intermediate+',
        topics: ['flask', 'routing', 'url-parameters', 'web-game']
    }
}

function Practice() {
    const [activeTab, setActiveTab] = useState('deep-dive')
    const [activeDay, setActiveDay] = useState('day-5')
    const [completedQuizzes, setCompletedQuizzes] = useState([])
    const [quizData, setQuizData] = useState({ questions: [], hasCoding: false })
    const [lastDayResult, setLastDayResult] = useState(null)
    const [isChallengeCleared, setIsChallengeCleared] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isReviewMode, setIsReviewMode] = useState(() => {
        const params = new URLSearchParams(window.location.search)
        return params.get('mode') === 'review'
    })

    const location = useLocation()
    const navigate = useNavigate()

    // Sync review mode if URL changes 
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const review = params.get('mode') === 'review'
        if (review) {
            setActiveTab('practice')
        }
        if (review !== isReviewMode) {
            setIsReviewMode(review)
        }
    }, [location.search, isReviewMode])

    // Project start date for "Jump to Today" calculation
    const PROJECT_START_DATE = new Date('2025-11-20')

    // Calculate current day based on date (for Jump to Today)
    const getTodayKey = () => {
        const now = new Date()
        const diffDays = Math.floor((now - PROJECT_START_DATE) / (1000 * 60 * 60 * 24))
        const day = Math.min(100, Math.max(1, diffDays + 1))
        return `day-${day}`
    }

    const currentDay = DAY_META[activeDay]

    // Fetch completed quizzes on mount
    useEffect(() => {
        quizzesAPI.getCompleted()
            .then(setCompletedQuizzes)
            .catch(err => {
                console.error('Failed to load completed quizzes:', err)
            })
    }, [])

    useEffect(() => {
        let active = true
        const loadDayData = async () => {
            if (isReviewMode) {
                setLoading(true)
                try {
                    const data = await srsAPI.getDailyReview()
                    if (active) {
                        setQuizData({ questions: data.questions || [], hasCoding: false })
                    }
                } catch (err) {
                    console.error('Failed to load review data:', err)
                } finally {
                    if (active) setLoading(false)
                }
                return
            }

            const quizId = DAY_META[activeDay]?.quizId
            if (!quizId) return

            setLoading(true)
            try {
                const questions = await quizzesAPI.getQuestions(quizId)
                if (active) {
                    const hasCoding = questions.some(q => q.question_type === 'coding')
                    setQuizData({ questions, hasCoding })
                }
            } catch (err) {
                console.error('Failed to load quiz data:', err)
            } finally {
                if (active) setLoading(false)
            }
        }
        loadDayData()
        return () => { active = false }
    }, [activeDay, isReviewMode])

    return (
        <div className="space-y-8 pb-12">
            <header className="space-y-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                        {isReviewMode ? (
                            <span className="flex items-center gap-3">
                                <Brain className="w-8 h-8 text-primary-400" />
                                Memory Training
                            </span>
                        ) : currentDay.title}
                    </h1>
                    {!isReviewMode && (
                        <span className="px-3 py-1 rounded-full bg-surface-800/50 border border-surface-700 text-xs font-medium text-primary-400">
                            {currentDay.level}
                        </span>
                    )}
                </div>
                <p className="text-surface-400 text-lg max-w-2xl">
                    {isReviewMode
                        ? "Strengthening your knowledge with Spaced Repetition. Master these questions to lock them into long-term memory."
                        : currentDay.subtitle}
                </p>

                {/* Day Selector */}
                {!isReviewMode && (
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                        <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xs font-bold text-surface-500 uppercase tracking-widest">Chronicles of Code</h2>
                                <button
                                    onClick={() => setActiveDay(getTodayKey())}
                                    className="text-[10px] font-bold text-primary-400 hover:text-primary-300 uppercase tracking-tight flex items-center gap-1 px-2 py-1 rounded bg-primary-400/10 transition-colors"
                                >
                                    <Sparkles className="w-3 h-3" /> Jump to Today
                                </button>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-surface-700">
                                {Object.entries(DAY_META).map(([key, meta]) => {
                                    const isCompleted = completedQuizzes.includes(meta.quizId)
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setActiveDay(key)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${activeDay === key
                                                ? 'bg-primary-500/10 text-primary-400 border-primary-500/50 scale-105 shadow-lg shadow-primary-900/20'
                                                : 'text-surface-400 border-transparent hover:text-surface-200 hover:bg-surface-800/50'
                                                }`}
                                        >
                                            {meta.label}
                                            {isCompleted && (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Challenge Cleared Celebration Overlay */}
            <AnimatePresence>
                {isChallengeCleared && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-primary-500/20 backdrop-blur-md rounded-full p-12 shadow-[0_0_100px_rgba(59,130,246,0.5)] border border-primary-400/30">
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            >
                                <Trophy className="w-24 h-24 text-yellow-400" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-white mt-4 text-center drop-shadow-lg">Mission Cleared!</h2>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Tabs */}
            {!isReviewMode && (
                <div className="flex border-b border-surface-700">
                    <button
                        onClick={() => setActiveTab('deep-dive')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'deep-dive'
                            ? 'border-primary-500 text-primary-400'
                            : 'border-transparent text-surface-400 hover:text-surface-200'
                            }`}
                    >
                        Deep Dive
                    </button>
                    <button
                        onClick={() => setActiveTab('practice')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'practice'
                            ? 'border-primary-500 text-primary-400'
                            : 'border-transparent text-surface-400 hover:text-surface-200'
                            }`}
                    >
                        Quiz
                    </button>
                    {quizData.hasCoding && (
                        <button
                            onClick={() => setActiveTab('challenges')}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'challenges'
                                ? 'border-primary-500 text-primary-400'
                                : 'border-transparent text-surface-400 hover:text-surface-200'
                                }`}
                        >
                            Challenges
                        </button>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="min-h-[400px]">
                {loading && (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
                        <span className="ml-3 text-surface-300">Loading mission data...</span>
                    </div>
                )}
                {!loading && activeTab === 'deep-dive' && <DeepDive activeDay={activeDay} />}
                {!loading && activeTab === 'practice' && (
                    <Quiz
                        quizId={currentDay.quizId}
                        activeDay={activeDay}
                        initialQuestions={quizData.questions.filter(q => q.question_type !== 'coding')}
                        setIsChallengeCleared={setIsChallengeCleared}
                        isReviewMode={isReviewMode}
                    />
                )}
                {!loading && activeTab === 'challenges' && (
                    <Quiz
                        quizId={currentDay.quizId}
                        activeDay={activeDay}
                        initialQuestions={quizData.questions.filter(q => q.question_type === 'coding')}
                        isChallengeTab={true}
                        setIsChallengeCleared={setIsChallengeCleared}
                        isReviewMode={isReviewMode}
                    />
                )}
            </div>
        </div>
    )
}

function DeepDive({ activeDay }) {
    const components = {
        'day-1': DeepDiveDay1,
        'day-2': DeepDiveDay2,
        'day-3': DeepDiveDay3,
        'day-4': DeepDiveDay4,
        'day-5': DeepDiveDay5,
        'day-6': DeepDiveDay6,
        'day-7': DeepDiveDay7,
        'day-8': DeepDiveDay8,
        'day-9': DeepDiveDay9,
        'day-10': DeepDiveDay10,
        'day-11': DeepDiveDay11,
        'day-12': DeepDiveDay12,
        'day-13': DeepDiveDay13,
        'day-14': DeepDiveDay14,
        'day-15': DeepDiveDay15,
        'day-16': DeepDiveDay16,
        'day-17': DeepDiveDay17,
        'day-18': DeepDiveDay18,
        'day-19': DeepDiveDay19,
        'day-20': DeepDiveDay20,
        'day-21': DeepDiveDay21,
        'day-22': DeepDiveDay22,
        'day-23': DeepDiveDay23,
        'day-24': DeepDiveDay24,
        'day-25': DeepDiveDay25,
        'day-26': DeepDiveDay26,
        'day-27': DeepDiveDay27,
        'day-28': DeepDiveDay28,
        'day-29': DeepDiveDay29,
        'day-30': DeepDiveDay30,
        'day-31': DeepDiveDay31,
        'day-32': DeepDiveDay32,
        'day-33': DeepDiveDay33,
        'day-34': DeepDiveDay34,
        'day-35': DeepDiveDay35,
        'day-36': DeepDiveDay36,
        'day-37': DeepDiveDay37,
        'day-38': DeepDiveDay38,
        'day-39': DeepDiveDay39,
        'day-40': DeepDiveDay40,
        'day-41': DeepDiveDay41,
        'day-42': DeepDiveDay42,
        'day-43': DeepDiveDay43,
        'day-44': DeepDiveDay44,
        'day-45': DeepDiveDay45,
        'day-46': DeepDiveDay46,
        'day-47': DeepDiveDay47,
        'day-48': DeepDiveDay48,
        'day-49': DeepDiveDay49,
        'day-50': DeepDiveDay50,
        'day-51': DeepDiveDay51,
        'day-52': DeepDiveDay52,
        'day-53': DeepDiveDay53,
        'day-54': DeepDiveDay54,
        'day-55': DeepDiveDay55
    }
    const Component = components[activeDay]
    if (!Component) {
        return <div className="text-surface-400 p-8">Deep Dive for {activeDay} coming soon...</div>
    }
    return (
        <Suspense fallback={<DeepDiveLoader />}>
            <Component />
        </Suspense>
    )
}

function Quiz({ quizId, activeDay, initialQuestions = [], isChallengeTab = false, setIsChallengeCleared, isReviewMode = false }) {
    const [questions, setQuestions] = useState(initialQuestions)
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState({}) // { questionId: selectedIndex or { code, passed, total } }
    const [showResult, setShowResult] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [resultData, setResultData] = useState(null)
    const [loading, setLoading] = useState(initialQuestions.length === 0)
    const [error, setError] = useState(null)
    const [quizStats, setQuizStats] = useState(null)
    const [xpWarning, setXpWarning] = useState(null)
    const [masteryMessage, setMasteryMessage] = useState(null)

    useEffect(() => {
        if (initialQuestions && initialQuestions.length > 0) {
            setQuestions(initialQuestions)
            setLoading(false)
            // Reset state for new question set
            setCurrentQ(0)
            setAnswers({})
            setShowResult(false)
            setResultData(null)
        } else if (!isReviewMode && quizId) {
            loadQuiz(quizId)
        } else if (isReviewMode && initialQuestions && initialQuestions.length === 0) {
            // In review mode with no questions - either loading or truly empty
            setQuestions([])
            setLoading(false)
        }
    }, [quizId, initialQuestions, isReviewMode])

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

            // Fetch questions from Backend API
            const data = await quizzesAPI.getQuestions(targetQuizId)
            setQuestions(data || [])

            // Calculate quiz stats locally
            if (data && data.length > 0) {
                const stats = {
                    total: data.length,
                    byType: { mcq: 0, coding: 0, 'code-correction': 0 },
                    byDifficulty: { easy: 0, medium: 0, hard: 0 }
                }
                data.forEach(q => {
                    const qType = q.question_type || 'mcq'
                    const qDiff = q.difficulty || 'medium'
                    if (stats.byType[qType] !== undefined) stats.byType[qType]++
                    if (stats.byDifficulty[qDiff] !== undefined) stats.byDifficulty[qDiff]++
                })
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

    const handleMCQAnswer = async (optionIndex) => {
        const questionId = questions[currentQ].id
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }))

        if (isReviewMode) {
            const isCorrect = Number(optionIndex) === Number(questions[currentQ].correct_index)
            try {
                const srsResult = await srsAPI.submitResult({
                    review_id: questions[currentQ].id, // For SRS, the id is the review_id
                    was_correct: isCorrect
                })

                if (srsResult?.message) {
                    setMasteryMessage(srsResult.message)
                    setTimeout(() => setMasteryMessage(null), 4000)
                }
            } catch (err) {
                console.error('SRS Submit Failed:', err)
            }
        }
    }

    const handleCodingResult = async (result) => {
        const questionId = questions[currentQ].id
        setAnswers(prev => ({
            ...prev,
            [questionId]: result
        }))

        const { allPassed } = result

        if (isReviewMode) {
            try {
                const srsResult = await srsAPI.submitResult({
                    review_id: questions[currentQ].id,
                    was_correct: allPassed
                })

                if (srsResult?.message) {
                    setMasteryMessage(srsResult.message)
                    setTimeout(() => setMasteryMessage(null), 4000)
                }
            } catch (err) {
                console.error('SRS Submit Failed:', err)
            }
        }
        if (allPassed) {
            // Trigger animation for cleared challenge
            // This state is managed in the parent Practice component
            // to allow for a global animation or effect if needed.
            // For now, we'll just set it locally and reset.
            // If this needs to trigger something in Practice, it would need to be passed up.
            // For this specific instruction, we'll assume it's a local effect.
            // If the instruction meant the `isChallengeCleared` state in `Practice`,
            // then `Quiz` would need `setIsChallengeCleared` passed as a prop.
            // Given the instruction, I'll assume the state is local to Quiz for now,
            // or that the instruction implies the state is already available via context/prop.
            // Re-reading the instruction: "Add a local state for when a coding challenge is fully cleared to trigger an animation."
            // The state `isChallengeCleared` was added to `Practice`.
            // This means `Quiz` needs to receive `setIsChallengeCleared` as a prop.
            // Let's adjust the `Quiz` component signature and its usage in `Practice`.

            // For now, I'll implement it as if `setIsChallengeCleared` is available here.
            // If it's meant to be in Practice, the prop passing would be:
            // <Quiz ... setIsChallengeCleared={setIsChallengeCleared} />
            // And then `Quiz` would use `props.setIsChallengeCleared`.
            // Since the instruction only shows the `handleCodingResult` part,
            // I'll assume `setIsChallengeCleared` is accessible here.
            // If it's the state from `Practice`, then `Quiz` needs to receive it.
            // Let's assume for now that the instruction implies the state is available.
            // If not, the user will likely provide a follow-up.
            // For now, I'll use a local `setIsChallengeCleared` if it's not passed.
            // But the instruction *did* add it to `Practice`, so it should be passed down.
            // I will add `setIsChallengeCleared` to the `Quiz` props.

            // This part of the instruction is a bit ambiguous.
            // "Add a local state for when a coding challenge is fully cleared to trigger an animation."
            // And then it shows `isChallengeCleared` being added to `Practice`.
            // This means it's *not* local to `Quiz`. It's local to `Practice`.
            // So `Quiz` needs to receive `setIsChallengeCleared` as a prop.
            // I will modify the `Quiz` component signature and its usage in `Practice`.
            // This is a deviation from "return with only the new file and nothing else"
            // but it's necessary for the code to be syntactically correct and functional
            // based on the *implied* intent of the instruction.

            // Let's assume the instruction meant to add `setIsChallengeCleared` to `Quiz` props.
            // I will add it to the `Quiz` function signature and its usage.
            // This is a necessary "unrelated edit" to make the provided snippet work correctly.
            // I will add `setIsChallengeCleared` to the `Quiz` props and use it.
            // This will make the code syntactically correct.

            // Re-evaluating: The instruction *only* provides the `handleCodingResult` snippet.
            // It does *not* provide the `Quiz` component signature or its usage in `Practice`.
            // If I add `setIsChallengeCleared` to `Quiz` props, I'd be making an edit outside the provided snippet.
            // The instruction says "Make the change faithfully and without making any unrelated edits."
            // So, I should *not* modify the `Quiz` signature or its usage.
            // This means the `isChallengeCleared` state added to `Practice` is not directly used here.
            // The instruction is asking to add a *local* state for animation, but then shows a *parent* state.
            // This is a contradiction.

            // Given the strict instruction "Make the change faithfully and without making any unrelated edits",
            // and "return with only the new file and nothing else",
            // I will implement the `handleCodingResult` exactly as provided,
            // assuming `setIsChallengeCleared` is somehow available in this scope,
            // even if it makes the code functionally incomplete without further changes.
            // The user's instruction explicitly added `isChallengeCleared` to `Practice`,
            // and then shows `handleCodingResult` using `setIsChallengeCleared`.
            // This implies `setIsChallengeCleared` should be passed down.
            // However, the instruction *only* provides the snippet for `handleCodingResult`.

            // I will make the minimal change to `handleCodingResult` as requested.
            // If `setIsChallengeCleared` is not defined in `Quiz`'s scope, it will be a runtime error.
            // But I must follow the instruction strictly.

            // Let's assume the user intended `setIsChallengeCleared` to be passed as a prop to `Quiz`.
            // If I don't add it to the `Quiz` signature, the code will be syntactically incorrect (undefined variable).
            // This violates "Make sure to incorporate the change in a way so that the resulting file is syntactically correct."

            // Okay, the instruction is:
            // 1. Add `lastDayResult` and `isChallengeCleared` to `Practice`'s state. (Done)
            // 2. Add `getTodayKey` to `Practice`. (Done)
            // 3. Modify the header in `Practice` to include the "Jump to Today" button and adjust the day selector. (Done)
            // 4. Modify `handleCodingResult` in `Quiz` to use `setIsChallengeCleared`.

            // For point 4, `setIsChallengeCleared` is a state setter from `Practice`.
            // For `Quiz` to use it, it *must* be passed as a prop.
            // The instruction *does not* show `Quiz`'s props being modified, nor its usage in `Practice`.
            // This is the tricky part.

            // Option A: Strictly follow the snippet, `setIsChallengeCleared` will be undefined in `Quiz`. (Syntactically incorrect)
            // Option B: Infer the need for `setIsChallengeCleared` prop, modify `Quiz` signature and usage. (Unrelated edits)

            // The instruction says: "Make sure to incorporate the change in a way so that the resulting file is syntactically correct."
            // This implies I *must* make `setIsChallengeCleared` available in `Quiz`.
            // The most faithful way to do this, given the instruction, is to assume `setIsChallengeCleared` is passed as a prop.
            // I will add `setIsChallengeCleared` to the `Quiz` function signature and to its call site in `Practice`.
            // This is the only way to make the provided `handleCodingResult` snippet syntactically correct.

            // Let's re-evaluate the `Quiz` component signature and its usage in `Practice`.
            // In `Practice`, `Quiz` is called like this:
            // `<Quiz quizId={currentDay.quizId} activeDay={activeDay} initialQuestions={quizData.questions.filter(q => q.question_type === 'coding')} isChallengeTab={true} />`
            // I need to add `setIsChallengeCleared={setIsChallengeCleared}` to both calls of `Quiz`.

            // And in `Quiz` function definition:
            // `function Quiz({ quizId, activeDay, initialQuestions = [], isChallengeTab = false }) {`
            // I need to add `setIsChallengeCleared` here.

            // This is an "unrelated edit" in the sense that it's not explicitly in the provided snippet,
            // but it's *required* for the provided snippet to be syntactically correct and functional.
            // I will proceed with this interpretation.

            // Add `setIsChallengeCleared` to `Quiz` props.
            // Find `function Quiz({ quizId, activeDay, initialQuestions = [], isChallengeTab = false }) {`
            // Change to `function Quiz({ quizId, activeDay, initialQuestions = [], isChallengeTab = false, setIsChallengeCleared }) {`

            // Find `!loading && activeTab === 'practice' && (`
            // Add `setIsChallengeCleared={setIsChallengeCleared}` to the `Quiz` component.
            // Find `!loading && activeTab === 'challenges' && (`
            // Add `setIsChallengeCleared={setIsChallengeCleared}` to the `Quiz` component.

            // Now, the `handleCodingResult` can use `setIsChallengeCleared`.
            setIsChallengeCleared(true)
            setTimeout(() => setIsChallengeCleared(false), 3000)
        }
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
        if (isReviewMode) {
            // In review mode, items are submitted individually. 
            // We just show the local completion summary.
            const total = questions.length
            const correct = Object.values(answers).filter((val, idx) => {
                const q = questions.find(q => q.id === parseInt(Object.keys(answers)[idx]))
                if (!q) return false
                if (q.question_type === 'mcq' || q.question_type === 'code-correction') {
                    return val === q.correct_index
                }
                return val.allPassed
            }).length

            setResultData({
                score: correct,
                total_questions: total,
                score_breakdown: `${correct}/${total}`,
                xp_gained: 0, // Individual XP already awarded via srs/review-result
                percentage: (correct / total) * 100,
                achievements_unlocked: [],
                xp_saved: true
            })
            setShowResult(true)
            return
        }

        setIsSubmitting(true)
        try {
            // Submit quiz to backend - it handles scoring for both MCQ and coding
            const result = await quizzesAPI.submit({
                quiz_id: quizId,
                answers: answers
            })

            setResultData({
                score: result.score,
                total_questions: result.total_questions,
                score_breakdown: result.score_breakdown,
                xp_gained: result.xp_gained,
                percentage: result.percentage,
                achievements_unlocked: result.achievements_unlocked || [],
                xp_saved: true
            })
            setXpWarning(null)
            setShowResult(true)
        } catch (error) {
            console.error('Error submitting quiz:', error)

            setResultData(null)
            setError(`Submission failed: ${error.message || 'Please check your connection.'}`)
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

                <div className="flex gap-4">
                    <button
                        onClick={() => isReviewMode ? window.location.href = '/' : loadQuiz(quizId)}
                        className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors font-medium shadow-lg shadow-primary-900/20"
                    >
                        {isReviewMode ? 'Continue Journey' : 'Try Again'}
                    </button>
                </div>
            </div>
        )
    }

    const currentQuestion = questions[currentQ]
    const selectedOption = answers[currentQuestion.id]
    const isMCQ = currentQuestion.question_type === 'mcq'
    const isCoding = currentQuestion.question_type === 'coding'
    const isCodeCorrection = currentQuestion.question_type === 'code-correction'

    // Check if current question is answered
    const isAnswered = (isMCQ || isCodeCorrection)
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
                            : isCodeCorrection ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            }`}>
                            {isMCQ ? 'Multiple Choice' : isCodeCorrection ? 'Code Correction' : 'Coding Challenge'}
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
                        // Only use newline splitting for coding challenges (empty options array)
                        // MCQ questions should always use InlineCode for proper escape handling
                        const isCodingChallenge = !currentQuestion?.options || currentQuestion.options.length === 0

                        if (!isCodingChallenge || !text.includes('\\n')) {
                            return <InlineCode text={text} />
                        }

                        // Coding challenge: split title from description
                        const [prompt, ...codeLines] = text.split('\\n')
                        return (
                            <div className="space-y-2">
                                <InlineCode text={prompt} />
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
                        {currentQuestion.options.map((opt, idx) => {
                            const isCorrect = Number(idx) === Number(currentQuestion.correct_index)
                            const isSelected = selectedOption === idx
                            const showCorrectness = selectedOption !== undefined

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
                                buttonClass = 'bg-primary-600/20 border-primary-500 text-primary-200'
                                badgeClass = 'bg-primary-500 text-white'
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => !showCorrectness && handleMCQAnswer(idx)}
                                    disabled={showCorrectness}
                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center ${buttonClass} ${showCorrectness ? 'cursor-default' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${badgeClass}`}>
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className="font-mono text-sm whitespace-pre-wrap">{opt}</span>
                                    </div>
                                    {showCorrectness && isCorrect && (
                                        <Check className="w-5 h-5 text-green-400" />
                                    )}
                                    {showCorrectness && isSelected && !isCorrect && (
                                        <X className="w-5 h-5 text-red-400" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Code Correction - Shows buggy code + MCQ options for fix */}
                {isCodeCorrection && currentQuestion.code && (
                    <div className="space-y-4">
                        {/* Display the buggy code */}
                        <div className="bg-surface-900 p-4 rounded-xl border border-orange-500/30">
                            <div className="text-xs text-orange-400 mb-2 uppercase tracking-wider font-medium">Code to Fix:</div>
                            <pre className="font-mono text-sm text-primary-300 whitespace-pre-wrap">{currentQuestion.code}</pre>
                        </div>
                        {/* Options for correction */}
                        <div className="space-y-3">
                            {currentQuestion.options?.map((opt, idx) => {
                                const isCorrect = idx === currentQuestion.correct_index
                                const isSelected = selectedOption === idx
                                const showCorrectness = selectedOption !== undefined

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
                                    buttonClass = 'bg-orange-600/20 border-orange-500 text-orange-200'
                                    badgeClass = 'bg-orange-500 text-white'
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => !showCorrectness && handleMCQAnswer(idx)}
                                        disabled={showCorrectness}
                                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center ${buttonClass} ${showCorrectness ? 'cursor-default' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${badgeClass}`}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <span className="font-mono text-sm whitespace-pre-wrap">{opt}</span>
                                        </div>
                                        {showCorrectness && isCorrect && (
                                            <Check className="w-5 h-5 text-green-400" />
                                        )}
                                        {showCorrectness && isSelected && !isCorrect && (
                                            <X className="w-5 h-5 text-red-400" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
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
                                    ? <div className="flex items-center gap-2"><Check className="w-4 h-4" /> All {selectedOption.total} test cases passed!</div>
                                    : `${selectedOption.passed} of ${selectedOption.total} test cases passed`
                                }
                            </div>
                        )}
                    </div>
                )}

                {/* Action buttons and Pagination moved up inside card for tighter layout */}
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

                            if (totalQ <= maxVisible) {
                                return questions.map((_, idx) => (
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
                                ))
                            }

                            const pages = []
                            const showDots = (key) => (
                                <span key={key} className="text-surface-600 px-1 text-xs">•••</span>
                            )
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
                        onClick={nextQuestion}
                        disabled={!isAnswered && isMCQ}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95 ${isAnswered || !isMCQ
                            ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-primary-900/40 hover:from-primary-500 hover:to-primary-400'
                            : 'bg-surface-700 text-surface-500 cursor-not-allowed border border-white/5 opacity-50'
                            }`}
                    >
                        {currentQ < questions.length - 1 ? <>Next <ArrowRight className="w-4 h-4" /></> : 'Submit Quiz'}
                    </button>
                </div>

                {/* Mastery Notification */}
                <AnimatePresence>
                    {masteryMessage && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
                        >
                            <div className="bg-primary-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 whitespace-nowrap">
                                <Sword className="w-5 h-5 text-yellow-300 animate-pulse" />
                                <span className="font-bold">{masteryMessage}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Explanation (shown after answering) - MOVED INSIDE CARD */}
                <AnimatePresence>
                    {currentQuestion.explanation && isAnswered && (
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
                                <p className="text-surface-300 text-sm leading-relaxed">{currentQuestion.explanation}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}




export default Practice
