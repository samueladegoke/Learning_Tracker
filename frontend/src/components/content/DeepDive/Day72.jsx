import CodeBlock from '../../CodeBlock'
import { Lightbulb, Table, Search, Filter, BarChart2 } from 'lucide-react'

export default function DeepDiveDay72() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Introduction to Pandas */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Table className="w-6 h-6 text-primary-400" /> Getting Started with Pandas
                    </h2>
                    <p>
                        <strong>Pandas</strong> is the most popular Python library for data manipulation and analysis. It introduces the <strong>DataFrame</strong>, a powerful 2D data structure that behaves like a highly optimized Excel spreadsheet inside Python.
                    </p>
                    <CodeBlock
                        code={`import pandas as pd

# Read a CSV file
df = pd.read_csv('salaries.csv')

# Look at the first 5 rows
print(df.head())

# Get the number of rows and columns
print(df.shape)`}
                        language="python"
                    />
                </section>

                {/* Section 2: Exploration & Cleaning */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Search className="w-6 h-6 text-primary-400" /> Exploration & Cleaning
                    </h2>
                    <p>
                        Before analyzing data, you must understand its structure and handle missing values (NaN). Clean data is the foundation of accurate analysis.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-surface-300">
                        <li><code>df.columns</code>: See all column names.</li>
                        <li><code>df.isna()</code>: Check for missing values.</li>
                        <li><code>df.dropna()</code>: Remove rows with missing data.</li>
                    </ul>
                    <CodeBlock
                        code={`# Check for NaN values anywhere in the dataframe
print(df.isna().values.any())

# Drop missing values and save to a new dataframe
clean_df = df.dropna()`}
                        language="python"
                    />
                </section>

                {/* Section 3: Finding Insights */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <Filter className="w-6 h-6 text-primary-400" /> Finding Extreme Values
                    </h2>
                    <p>
                        Pandas makes it easy to find highest, lowest, or specific values using descriptive methods.
                    </p>
                    <CodeBlock
                        code={`# Find the maximum value in a column
max_salary = clean_df['Starting Median Salary'].max()

# Find the index (row number) of the maximum value
max_id = clean_df['Starting Median Salary'].idxmax()

# Get the name of the major at that row
print(clean_df['Undergraduate Major'].loc[max_id])`}
                        language="python"
                    />
                </section>

                {/* Section 4: Sorting & Grouping */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <BarChart2 className="w-6 h-6 text-primary-400" /> Sorting & Grouping
                    </h2>
                    <p>
                        To identify trends, we often need to sort our data or group it by specific categories (like "Business" vs "STEM" majors).
                    </p>
                    <CodeBlock
                        code={`# Sort by potential (highest to lowest)
lowest_risk = clean_df.sort_values('Starting Median Salary', ascending=False)

# Group by category and find the average salary
avg_by_group = clean_df.groupby('Group').mean()`}
                        language="python"
                    />
                    <p>
                        The <code>.groupby()</code> method combined with <code>.mean()</code> or <code>.count()</code> allows you to create pivot-table style summaries in seconds.
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Method Chaining</h4>
                            <p className="text-sm text-surface-400">
                                You can chain methods: <code>df.groupby('A').mean().sort_values('B')</code>. It's concise and readable.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">idxmax() vs max()</h4>
                            <p className="text-sm text-surface-400">
                                <code>max()</code> gives you the number, but <code>idxmax()</code> gives you the <strong>location</strong> of that number.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">pd.options</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>pd.options.display.float_format = '&#123;:.2f&#125;'.format</code> to make large numbers readable.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
