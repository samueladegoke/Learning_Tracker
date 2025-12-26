import CodeBlock from '../../CodeBlock'
import { Lightbulb, Target, Layers, CheckCircle2, GitBranch, MessageSquareQuote, Sparkles, AlertTriangle, FileCode2, Terminal } from 'lucide-react'

export default function DeepDiveDay82() {
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
                            "Build a command-line tool that converts any text input into Morse Code. The tool should be intuitive, handle edge cases gracefully, and be well-documented for your portfolio."
                        </p>
                        <h4 className="font-semibold text-surface-100 mb-2">Deliverables:</h4>
                        <ul className="list-disc list-inside space-y-1 text-surface-300">
                            <li>A Python CLI that takes text and outputs Morse code</li>
                            <li>Handles A-Z, 0-9, and common punctuation</li>
                            <li>Displays the mapping (e.g., <code>S = ...</code>)</li>
                            <li>A <code>README.md</code> explaining usage</li>
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
                                <h4 className="font-semibold text-surface-100">Standard Library</h4>
                                <p className="text-sm text-surface-400">No external packages needed. Use <code>input()</code> and dictionaries.</p>
                            </div>
                        </div>
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-surface-700 flex items-start gap-3">
                            <FileCode2 className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-surface-100">Optional: argparse</h4>
                                <p className="text-sm text-surface-400">For a more professional CLI experience with flags.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Architecture */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <GitBranch className="w-6 h-6 text-primary-400" /> Suggested Architecture
                    </h2>
                    <CodeBlock
                        code={`morse-code-converter/
├── main.py           # Entry point, handles input/output
├── morse.py          # The MORSE_CODE_DICT and conversion logic
├── tests/
│   └── test_morse.py # Unit tests for your converter
└── README.md         # Project documentation`}
                        language="plaintext"
                    />
                    <p className="text-sm text-surface-400">
                        <strong>Why this structure?</strong> Separating the dictionary and logic into <code>morse.py</code> makes it reusable and testable.
                    </p>
                </section>

                {/* Section 4: Milestones */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <CheckCircle2 className="w-6 h-6 text-primary-400" /> Your Action Plan
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 bg-surface-800/30 p-4 rounded-lg border border-surface-700">
                            <span className="bg-primary-500/20 text-primary-400 text-xs font-bold px-2 py-1 rounded">PHASE 1</span>
                            <div>
                                <h4 className="font-semibold text-surface-100">Create the Mapping</h4>
                                <p className="text-sm text-surface-400">Build <code>MORSE_CODE_DICT</code> for A-Z and 0-9. Test: <code>assert MORSE_CODE_DICT['A'] == '.-'</code></p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-surface-800/30 p-4 rounded-lg border border-surface-700">
                            <span className="bg-primary-500/20 text-primary-400 text-xs font-bold px-2 py-1 rounded">PHASE 2</span>
                            <div>
                                <h4 className="font-semibold text-surface-100">Core Conversion Logic</h4>
                                <p className="text-sm text-surface-400">Write <code>text_to_morse(text)</code>. Handle uppercase/lowercase. Separate letters with spaces, words with <code>/</code>.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-surface-800/30 p-4 rounded-lg border border-surface-700">
                            <span className="bg-primary-500/20 text-primary-400 text-xs font-bold px-2 py-1 rounded">PHASE 3</span>
                            <div>
                                <h4 className="font-semibold text-surface-100">Edge Cases & Polish</h4>
                                <p className="text-sm text-surface-400">What happens with numbers? Symbols like <code>@</code>? Add error messages for unsupported characters.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-surface-800/30 p-4 rounded-lg border border-surface-700">
                            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">DEPLOY</span>
                            <div>
                                <h4 className="font-semibold text-surface-100">Push to GitHub</h4>
                                <p className="text-sm text-surface-400">Write your <code>README.md</code>. Commit with meaningful messages. Your first portfolio project is live!</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 5: Common Pitfalls */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> <AlertTriangle className="w-6 h-6 text-yellow-500" /> Common Pitfalls
                    </h2>
                    <ul className="space-y-2 text-surface-300">
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-500">⚠</span>
                            <span><strong>Forgetting `.upper()`:</strong> Morse code is case-insensitive. Normalize input first.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-500">⚠</span>
                            <span><strong>No space handling:</strong> Words should be separated by <code>/</code> or a longer pause.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-500">⚠</span>
                            <span><strong>KeyError on special chars:</strong> Use <code>.get()</code> with a fallback instead of direct indexing.</span>
                        </li>
                    </ul>
                </section>
            </div>

            {/* Sidebar: Interview Prep */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <MessageSquareQuote className="w-5 h-5 text-blue-400" /> Interview Prep
                    </h3>
                    <p className="text-sm text-surface-400 mb-4">Questions a recruiter might ask about this project:</p>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Data Structure Choice</h4>
                            <p className="text-sm text-surface-400">
                                "Why did you use a dictionary for the Morse mapping instead of a list or if-else chain?"
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Scalability</h4>
                            <p className="text-sm text-surface-400">
                                "How would you extend this to decode Morse back to text?"
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Testing</h4>
                            <p className="text-sm text-surface-400">
                                "What test cases did you prioritize and why?"
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" /> Stretch Goals
                    </h3>
                    <ul className="text-sm text-surface-400 space-y-2">
                        <li>✨ Add audio playback (beeps for dots/dashes)</li>
                        <li>✨ Create a GUI with Tkinter</li>
                        <li>✨ Support bidirectional conversion</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
