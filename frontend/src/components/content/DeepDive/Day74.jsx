import CodeBlock from '../../CodeBlock'
import { Lightbulb, Layers, GitMerge, List, Box } from 'lucide-react'

export default function DeepDiveDay74() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Aggregation & Counts */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Layers className="w-6 h-6 text-primary-400" /> Aggregation with .agg()
                    </h2>
                    <p>
                        When working with datasets like LEGO, we often need to perform different operations on different columns simultaneously. The <code>.agg()</code> method is perfect for this.
                    </p>
                    <CodeBlock
                        code={`# Group by year and find the count of IDs but max of sets
sets_by_year = df.groupby('year').agg({'set_num': pd.Series.count})

# Finding unique values
print(df['color_name'].value_counts().head())`}
                        language="python"
                    />
                </section>

                {/* Section 2: Relational Data Concept */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Box className="w-6 h-6 text-primary-400" /> Relational Data
                    </h2>
                    <p>
                        Real-world data is rarely in one file. Information is often spread across multiple tables connected by <strong>Primary Keys</strong> (unique IDs) and <strong>Foreign Keys</strong> (IDs referencing another table).
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-surface-300">
                        <li><strong>Colors Table:</strong> Contains ID and Name.</li>
                        <li><strong>Sets Table:</strong> Contains Set Name and Color ID.</li>
                    </ul>
                    <p>
                        To get the color name for each set, we must link these tables together.
                    </p>
                </section>

                {/* Section 3: Merging DataFrames */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <GitMerge className="w-6 h-6 text-primary-400" /> Merging Data
                    </h2>
                    <p>
                        The <code>.merge()</code> method combines DataFrames based on a common column. This is equivalent to a SQL <code>JOIN</code>.
                    </p>
                    <CodeBlock
                        code={`# Merge sets_df and themes_df on the 'id' column
merged_df = pd.merge(sets_df, themes_df, on='id')

# Rename columns for clarity
merged_df.rename(columns={'name_x': 'set_name', 'name_y': 'theme_name'}, inplace=True)`}
                        language="python"
                    />
                </section>

                {/* Section 4: Multi-Axis Visuals */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <List className="w-6 h-6 text-primary-400" /> Superimposing Charts
                    </h2>
                    <p>
                        If you want to plot two different metrics (e.g., number of sets vs. average parts) that use different scales, you should use separate Y-axes.
                    </p>
                    <CodeBlock
                        code={`ax1 = plt.gca() # get current axes
ax2 = ax1.twinx() # create a twin axes sharing the x-axis

ax1.plot(df.index, df.sets, color='g')
ax2.plot(df.index, df.parts, color='b')

ax1.set_ylabel('Number of Sets', color='g')
ax2.set_ylabel('Average Parts', color='b')`}
                        language="python"
                    />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">value_counts()</h4>
                            <p className="text-sm text-surface-400">
                                This is the fastest way to see how many times each item appears in a column.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Slicing Rows</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>df[:10]</code> for the first 10 rows and <code>df[-5:]</code> for the last 5.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Primary Keys</h4>
                            <p className="text-sm text-surface-400">
                                A Primary Key must be <strong>unique</strong> for every single row. It's the "fingerprint" of the data record.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
