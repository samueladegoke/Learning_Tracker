import CodeBlock from '../../CodeBlock'
import { Lightbulb, Target, Layers, CheckCircle2, GitBranch, MessageSquareQuote, Sparkles, AlertTriangle, FileCode2, Terminal, Keyboard, Timer, Gauge } from 'lucide-react'

export default function DeepDiveDay86() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: The Brief */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Target className="w-6 h-6 text-primary-400" /> The Brief
                    </h2>
                    <div className="bg-surface-800/50 p-5 rounded-lg border border-surface-700">
                        <p className="italic text-surface-300 mb-4">
                            "Build a desktop typing speed test application that measures WPM (Words Per Minute) and accuracy. Users should type displayed paragraphs and receive real-time feedback."
                        </p>
                        <h4 className="font-semibold text-surface-100 mb-2">Deliverables:</h4>
                        <ul className="list-disc list-inside space-y-1 text-surface-300">
                            <li>Tkinter GUI with text display and input field</li>
                            <li>Timer starting on first keypress</li>
                            <li>Real-time WPM and accuracy calculations</li>
                            <li>Visual feedback for correct/incorrect characters</li>
                        </ul>
                    </div>
                </section>

                {/* Section 2: Tech Stack */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Layers className="w-6 h-6 text-primary-400" /> Recommended Tech Stack
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-surface-700 flex items-start gap-3">
                            <Terminal className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-surface-100">Tkinter</h4>
                                <p className="text-sm text-surface-400">Built-in GUI library for desktop applications.</p>
                            </div>
                        </div>
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-surface-700 flex items-start gap-3">
                            <Timer className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-surface-100">time module</h4>
                                <p className="text-sm text-surface-400">For tracking elapsed time and calculating WPM.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Architecture */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <GitBranch className="w-6 h-6 text-primary-400" /> Architecture Pattern
                    </h2>
                    <div className="bg-surface-800/50 p-5 rounded-lg border border-surface-700">
                        <p className="text-surface-300 mb-4">
                            <strong className="text-surface-100">Event-Driven State Machine</strong> - The app tracks state (idle, running, finished) and responds to keypress events.
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm">
                            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300">Idle → Start on keypress</span>
                            <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-300">Running → Update stats</span>
                            <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-300">Finished → Show results</span>
                        </div>
                    </div>
                    <CodeBlock
                        code={`import tkinter as tk
import time

class TypingTest:
    def __init__(self):
        self.start_time = None
        self.correct_chars = 0
        self.total_chars = 0
    
    def on_key(self, event):
        if self.start_time is None:
            self.start_time = time.time()
        # Compare typed char with expected char
        self.total_chars += 1
        elapsed = time.time() - self.start_time
        wpm = (self.total_chars / 5) / (elapsed / 60)
        return wpm`}
                        language="python"
                    />
                </section>

                {/* Section 4: Milestones */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <CheckCircle2 className="w-6 h-6 text-primary-400" /> Milestones
                    </h2>
                    <div className="space-y-3">
                        {[
                            { title: "GUI Layout", desc: "Create the main window with Label for text and Entry for input." },
                            { title: "Timer Logic", desc: "Start timer on first keypress, calculate elapsed time." },
                            { title: "WPM Calculation", desc: "WPM = (characters / 5) / (minutes elapsed)." },
                            { title: "Accuracy Tracking", desc: "Compare each character typed vs expected, show percentage." }
                        ].map((m, i) => (
                            <div key={i} className="flex gap-3 items-start bg-surface-800/30 p-4 rounded-lg border border-surface-700">
                                <span className="text-primary-400 font-bold">{i + 1}</span>
                                <div>
                                    <h4 className="font-semibold text-surface-100">{m.title}</h4>
                                    <p className="text-sm text-surface-400">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 5: Pitfalls */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> <AlertTriangle className="w-6 h-6 text-amber-400" /> Common Pitfalls
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-amber-500/20">
                            <h4 className="font-semibold text-amber-300 mb-1">Backspace Handling</h4>
                            <p className="text-sm text-surface-400">Don't count backspaces as typed characters; handle them separately.</p>
                        </div>
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-amber-500/20">
                            <h4 className="font-semibold text-amber-300 mb-1">Division by Zero</h4>
                            <p className="text-sm text-surface-400">Guard against elapsed time being 0 when calculating WPM.</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
                <div className="bg-surface-800/40 p-5 rounded-xl border border-surface-700">
                    <h3 className="font-bold text-surface-100 mb-3 flex items-center gap-2">
                        <MessageSquareQuote className="w-5 h-5 text-primary-400" /> Interview Prep
                    </h3>
                    <ul className="space-y-3 text-sm text-surface-300">
                        <li className="flex gap-2 items-start">
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>"How did you handle edge cases like empty input or very fast typing?"</span>
                        </li>
                        <li className="flex gap-2 items-start">
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>"Why did you choose Tkinter over PyQt or a web-based solution?"</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-primary-500/10 to-transparent p-5 rounded-xl border border-primary-500/20">
                    <h3 className="font-bold text-surface-100 mb-2 flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-primary-400" /> Key Metrics
                    </h3>
                    <ul className="text-sm text-surface-300 space-y-1">
                        <li>• Average WPM: 40-60 for casual, 80+ for proficient</li>
                        <li>• Accuracy target: 95%+</li>
                    </ul>
                </div>
            </aside>
        </div>
    )
}
