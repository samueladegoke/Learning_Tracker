import CodeBlock from '../../CodeBlock'
import { Lightbulb, Rocket, Target, Layers, ListChecks, AlertTriangle, MessageSquare, Star, Cpu, Gamepad2, Hash, MousePointer2, CheckCircle2, RefreshCw, Monitor } from 'lucide-react'
import React from 'react'

export default function DeepDiveDay84() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-12">

                {/* 01. The Brief */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-amber-400">01.</span>
                        <Rocket className="w-6 h-6 text-amber-400" />
                        The Brief
                    </h2>
                    <div className="bg-surface-800/40 p-6 rounded-xl border border-surface-700/50 shadow-inner italic text-surface-200">
                        "Develop a command-line Tic Tac Toe game for two players. The focus is on robust game logic, clear user feedback, and perfect state management."
                        <div className="mt-4 not-italic space-y-2">
                            <p className="font-bold text-white text-sm">Deliverables:</p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                <li>Grid-based board rendering in terminal</li>
                                <li>Turn-based input system (Player X and Player O)</li>
                                <li>Win/Draw detection algorithm (Horizontal, Vertical, Diagonal)</li>
                                <li>Input validation (preventing overwriting moves)</li>
                                <li>Score tracking across multiple rounds (Optional)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 02. Architecture */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-amber-400">02.</span>
                        <Layers className="w-6 h-6 text-amber-400" />
                        System Architecture
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-surface-800/20 border border-surface-700/50">
                            <h4 className="font-bold text-white text-sm mb-2">Core Pattern</h4>
                            <p className="text-sm text-surface-300">Stateful Game Loop: Listen → Validate → Update → Render → Repeat.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface-800/20 border border-surface-700/50">
                            <h4 className="font-bold text-white text-sm mb-2">Data Representation</h4>
                            <p className="text-sm text-surface-300">A 1D or 2D list representing the grid positions (0-8 or rows/cols).</p>
                        </div>
                    </div>

                    <div className="bg-surface-800/20 p-6 rounded-xl border border-surface-700/50">
                        <p className="text-xs font-semibold text-surface-400 mb-6 uppercase tracking-wider">State Management Flow</p>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {[
                                { label: "Input", icon: <MousePointer2 className="w-4 h-4" /> },
                                { label: "Validate", icon: <CheckCircle2 className="w-4 h-4" /> },
                                { label: "Update", icon: <RefreshCw className="w-4 h-4" /> },
                                { label: "Render", icon: <Monitor className="w-4 h-4" /> }
                            ].map((step, idx, arr) => (
                                <React.Fragment key={step.label}>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                            {step.icon}
                                        </div>
                                        <span className="text-xs font-medium text-surface-300">{step.label}</span>
                                    </div>
                                    {idx < arr.length - 1 && (
                                        <div className="hidden md:block h-px w-12 bg-gradient-to-r from-amber-500/50 to-transparent" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <CodeBlock
                        code={`board = [" " for _ in range(9)]

def check_win(board):
    win_configs = [(0,1,2), (3,4,5), (6,7,8), # Rows
                   (0,3,6), (1,4,7), (2,5,8), # Cols
                   (0,4,8), (2,4,6)]          # Diags
    for a, b, c in win_configs:
        if board[a] == board[b] == board[c] != " ":
            return True
    return False`}
                        language="python"
                    />
                </section>

                {/* 03. Milestones */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-amber-400">03.</span>
                        <ListChecks className="w-6 h-6 text-amber-400" />
                        Action Plan
                    </h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-amber-400 font-bold">1</div>
                            <div>
                                <h4 className="text-white font-bold">Board Management</h4>
                                <p className="text-sm text-surface-300">Create a function to print the numerical grid for player reference.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-amber-400 font-bold">2</div>
                            <div>
                                <h4 className="text-white font-bold">Validation Engine</h4>
                                <p className="text-sm text-surface-300">Write the check to ensure selected tiles are empty and within range.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-amber-400 font-bold">3</div>
                            <div>
                                <h4 className="text-white font-bold">Game Termination</h4>
                                <p className="text-sm text-surface-300">Implement the check_win and check_draw conditions to exit the loop.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 04. Pitfalls */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-amber-400">04.</span>
                        <AlertTriangle className="w-6 h-6 text-amber-400" />
                        Common Pitfalls
                    </h2>
                    <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                            <h4 className="font-bold text-red-400 text-sm">Input Sanitization</h4>
                            <p className="text-xs text-red-300/60 mt-1">Users typing "five" instead of "5" will crash the script. Wrap input in try/except blocks.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                            <h4 className="font-bold text-red-400 text-sm">State Persistence</h4>
                            <p className="text-xs text-red-300/60 mt-1">If using a class, ensure the board state is reset correctly between games without needing a restart.</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Recommended Tech Stack */}
                <div className="bg-surface-800/30 p-6 rounded-2xl border border-surface-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-amber-400" /> Recommended Stack
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-700/30 border border-surface-600/30">
                            <Cpu className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs font-bold text-white">Standard Library</p>
                                <p className="text-[10px] text-surface-400">Zero Dependencies</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-700/30 border border-surface-600/30">
                            <Gamepad2 className="w-5 h-5 text-red-400" />
                            <div>
                                <p className="text-xs font-bold text-white">Pygame</p>
                                <p className="text-[10px] text-surface-400">Optional GUI path</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interview Prep */}
                <div className="bg-surface-800/30 p-6 rounded-2xl border border-surface-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-amber-400" /> Interview Prep
                    </h3>
                    <div className="space-y-4 text-sm text-surface-300">
                        <div>
                            <p className="font-bold text-white mb-1">Winning Logic</p>
                            <p className="text-[11px] leading-relaxed">"Can you explain the O(N) vs O(1) win checking approaches for a 3x3 grid?"</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-1">Code Readability</p>
                            <p className="text-[11px] leading-relaxed">"Why did you choose a 1D list over a 2D list for the board?" (Expect: discussions on index math vs intuitive layout)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
