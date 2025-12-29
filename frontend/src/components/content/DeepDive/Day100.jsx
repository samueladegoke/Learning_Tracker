import CodeBlock from '../../CodeBlock'
import { Target, Layers, CheckCircle2, GitBranch, MessageSquareQuote, Sparkles, AlertTriangle, BarChart3, Trophy } from 'lucide-react'

export default function DeepDiveDay100() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Target className="w-6 h-6 text-primary-400" /> The Brief
                    </h2>
                    <div className="bg-surface-800/50 p-5 rounded-lg border border-surface-700">
                        <p className="italic text-surface-300 mb-4">
                            "Analyze the dataset on fatal police encounters in the United States. Uncover patterns, create visualizations, and present your findings responsibly."
                        </p>
                        <h4 className="font-semibold text-surface-100 mb-2">Deliverables:</h4>
                        <ul className="list-disc list-inside space-y-1 text-surface-300">
                            <li>Data cleaning and demographic analysis</li>
                            <li>Statistical analysis and hypothesis testing</li>
                            <li>Ethical data visualization</li>
                            <li>Professional Jupyter Notebook report</li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Layers className="w-6 h-6 text-primary-400" /> Recommended Tech Stack
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-surface-700 flex items-start gap-3">
                            <BarChart3 className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-surface-100">Pandas + NumPy</h4>
                                <p className="text-sm text-surface-400">Data manipulation and statistical analysis.</p>
                            </div>
                        </div>
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-surface-700 flex items-start gap-3">
                            <Trophy className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-surface-100">Matplotlib + Seaborn</h4>
                                <p className="text-sm text-surface-400">Publication-quality visualizations.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <GitBranch className="w-6 h-6 text-primary-400" /> Architecture Pattern
                    </h2>
                    <CodeBlock
                        code={`import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load and explore
df = pd.read_csv('fatal_encounters.csv')
print(df.info())
print(df.describe())

# Demographic breakdown
demographics = df['race'].value_counts(normalize=True)

# Visualization
fig, ax = plt.subplots(figsize=(10, 6))
sns.countplot(data=df, x='race', order=df['race'].value_counts().index)
ax.set_title('Fatal Encounters by Race')
ax.set_xlabel('Race')
ax.set_ylabel('Count')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()`}
                        language="python"
                    />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <CheckCircle2 className="w-6 h-6 text-primary-400" /> Milestones
                    </h2>
                    <div className="space-y-3">
                        {[
                            { title: "Data Understanding", desc: "Explore dataset structure and variables." },
                            { title: "Statistical Analysis", desc: "Calculate rates and test hypotheses." },
                            { title: "Visualization", desc: "Create clear, ethical charts." },
                            { title: "Narrative", desc: "Present findings with context and nuance." }
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
                            <h4 className="font-semibold text-amber-300 mb-1">Ethical Responsibility</h4>
                            <p className="text-sm text-surface-400">Present data responsibly; avoid sensationalism or misrepresentation.</p>
                        </div>
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-amber-500/20">
                            <h4 className="font-semibold text-amber-300 mb-1">Population Normalization</h4>
                            <p className="text-sm text-surface-400">Raw counts can be misleading; use per-capita rates when appropriate.</p>
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
                            <span>"How did you ensure your analysis was fair and unbiased?"</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-5 rounded-xl border border-amber-500/20">
                    <h3 className="font-bold text-surface-100 mb-2 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-400" /> 🎉 Congratulations!
                    </h3>
                    <p className="text-sm text-surface-300">
                        You've completed 100 Days of Code! You now have a professional portfolio of Python projects spanning automation, web development, data science, and game development.
                    </p>
                </div>
            </aside>
        </div>
    )
}
