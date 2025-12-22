import CodeBlock from '../../CodeBlock'
import { Lightbulb, PieChart, TrendingUp, Calendar, Scissors } from 'lucide-react'

export default function DeepDiveDay73() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Data Preparation */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Calendar className="w-6 h-6 text-primary-400" /> Preparing Time-Series Data
                    </h2>
                    <p>
                        Visualizing data over time is a core skill in data science. However, raw CSV data often stores dates as strings. To plot them correctly, we must convert them to <strong>Datetime objects</strong>.
                    </p>
                    <CodeBlock
                        code={`# Convert a string column to Datetime
df['DATE'] = pd.to_datetime(df['DATE'])

# Now you can easily extract years or months
print(df['DATE'].dt.year.head())`}
                        language="python"
                    />
                </section>

                {/* Section 2: Reshaping Data (Pivoting) */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Scissors className="w-6 h-6 text-primary-400" /> Pivoting for Comparison
                    </h2>
                    <p>
                        Sometimes our data is "long" (one row per entry), but we need it "wide" to compare categories side-by-side. The <code>.pivot()</code> method reshapes the DataFrame.
                    </p>
                    <CodeBlock
                        code={`# Reshape: dates as rows, languages as columns
pivoted_df = df.pivot(index='DATE', columns='TAG', values='POSTS')

# Fill missing values with 0
pivoted_df.fillna(0, inplace=True)`}
                        language="python"
                    />
                </section>

                {/* Section 3: Basic Plotting with Matplotlib */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <PieChart className="w-6 h-6 text-primary-400" /> Plotting with Matplotlib
                    </h2>
                    <p>
                        <strong>Matplotlib</strong> is the workhorse of Python visualization. We can customize every aspect of a chart, from figure size to axis labels.
                    </p>
                    <CodeBlock
                        code={`import matplotlib.pyplot as plt

# Set figure size
plt.figure(figsize=(10, 6))

# Plot a single column
plt.plot(pivoted_df.index, pivoted_df['java'])

# Add labels and styling
plt.xlabel('Date', fontsize=14)
plt.ylabel('Number of Posts', fontsize=14)
plt.ylim(0, 30000)

plt.show()`}
                        language="python"
                    />
                </section>

                {/* Section 4: Smoothing & Trends */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <TrendingUp className="w-6 h-6 text-primary-400" /> Smoothing out the Noise
                    </h2>
                    <p>
                        Time-series data is often "noisy" with many jagged peaks. To see the underlying trend, we use a <strong>Moving Average</strong> (rolling mean).
                    </p>
                    <CodeBlock
                        code={`# Calculate a 6-month moving average
roll_df = pivoted_df.rolling(window=6).mean()

# Plot smoothed data
plt.plot(roll_df.index, roll_df['python'], label='Python')
plt.plot(roll_df.index, roll_df['java'], label='Java')

plt.legend(fontsize=12)`}
                        language="python"
                    />
                    <p>
                        A larger <code>window</code> results in a smoother line but less detail on short-term fluctuations.
                    </p>
                </section>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">inplace=True</h4>
                            <p className="text-sm text-surface-400">
                                Be careful with <code>inplace=True</code>. It modifies the original DataFrame. Without it, you must reassign: <code>df = df.fillna(0)</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Figure Size</h4>
                            <p className="text-sm text-surface-400">
                                Always set <code>plt.figure(figsize=(w, h))</code> <strong>before</strong> calling <code>plt.plot()</code> to avoid distortion.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Multiple Lines</h4>
                            <p className="text-sm text-surface-400">
                                You can loop through columns: <code>for column in df.columns: plt.plot(df.index, df[column])</code>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
