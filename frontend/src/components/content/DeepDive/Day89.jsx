import CodeBlock from '../../CodeBlock'
import { Target, Layers, CheckCircle2, GitBranch, MessageSquareQuote, Sparkles, AlertTriangle, Globe, Paintbrush } from 'lucide-react'

export default function DeepDiveDay89() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Target className="w-6 h-6 text-primary-400" /> The Brief
                    </h2>
                    <div className="bg-surface-800/50 p-5 rounded-lg border border-surface-700">
                        <p className="italic text-surface-300 mb-4">
                            "Build a disappearing text writing app. Users type their thoughts, but if they stop typing for more than 5 seconds, all text disappears."
                        </p>
                        <h4 className="font-semibold text-surface-100 mb-2">Deliverables:</h4>
                        <ul className="list-disc list-inside space-y-1 text-surface-300">
                            <li>Flask web app with real-time text area</li>
                            <li>JavaScript timer that resets on each keypress</li>
                            <li>Visual countdown indicator</li>
                            <li>Option to save completed text before timeout</li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Layers className="w-6 h-6 text-primary-400" /> Recommended Tech Stack
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-surface-700 flex items-start gap-3">
                            <Globe className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-surface-100">Flask + Jinja2</h4>
                                <p className="text-sm text-surface-400">Server-side rendering with templates.</p>
                            </div>
                        </div>
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-surface-700 flex items-start gap-3">
                            <Paintbrush className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-surface-100">Vanilla JavaScript</h4>
                                <p className="text-sm text-surface-400">For client-side timer and DOM manipulation.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <GitBranch className="w-6 h-6 text-primary-400" /> Architecture Pattern
                    </h2>
                    <CodeBlock
                        code={`// Client-side timer logic
let timer;
const TIMEOUT = 5000; // 5 seconds

document.querySelector('textarea').addEventListener('input', () => {
    clearTimeout(timer);
    updateCountdown(5);
    timer = setTimeout(() => {
        document.querySelector('textarea').value = '';
    }, TIMEOUT);
});

function updateCountdown(seconds) {
    document.querySelector('.countdown').textContent = seconds;
}`}
                        language="javascript"
                    />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <CheckCircle2 className="w-6 h-6 text-primary-400" /> Milestones
                    </h2>
                    <div className="space-y-3">
                        {[
                            { title: "Flask Setup", desc: "Create route that serves the writing page." },
                            { title: "Timer Logic", desc: "Implement JavaScript setTimeout/clearTimeout." },
                            { title: "Visual Feedback", desc: "Add countdown display and warning colors." },
                            { title: "Save Feature", desc: "Allow saving text before it disappears." }
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

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> <AlertTriangle className="w-6 h-6 text-amber-400" /> Common Pitfalls
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-amber-500/20">
                            <h4 className="font-semibold text-amber-300 mb-1">Timer Memory Leaks</h4>
                            <p className="text-sm text-surface-400">Always clear the previous timer before setting a new one.</p>
                        </div>
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-amber-500/20">
                            <h4 className="font-semibold text-amber-300 mb-1">Accidental Deletion</h4>
                            <p className="text-sm text-surface-400">Consider adding a confirmation or undo feature.</p>
                        </div>
                    </div>
                </section>
            </div>

            <aside className="space-y-6">
                <div className="bg-surface-800/40 p-5 rounded-xl border border-surface-700">
                    <h3 className="font-bold text-surface-100 mb-3 flex items-center gap-2">
                        <MessageSquareQuote className="w-5 h-5 text-primary-400" /> Interview Prep
                    </h3>
                    <ul className="space-y-3 text-sm text-surface-300">
                        <li className="flex gap-2 items-start">
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>"How would you implement server-side backup of the text?"</span>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    )
}
