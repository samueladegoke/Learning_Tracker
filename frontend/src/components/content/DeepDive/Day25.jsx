import React from 'react'
import CodeBlock from '../../CodeBlock'
import { FileSpreadsheet, Database, Filter, BarChart3, RefreshCw } from 'lucide-react'

export default function DeepDiveDay25() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <FileSpreadsheet className="w-6 h-6 text-primary-400" /> Working with CSV and Pandas
                    </h2>
                    <p>
                        Day 25 introduces data analysis using the <strong>Pandas</strong> library.
                        CSV (Comma Separated Values) is a common format, and Pandas makes it incredibly easy to read, process, and analyze this data.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Reading CSV
                    </h2>
                    <p>
                        Instead of manually parsing text lines, we can use the powerful <code>read_csv</code> function.
                    </p>
                    <CodeBlock code={`import pandas as pd

data = pd.read_csv("weather_data.csv")
print(data)  # Prints a formatted table`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Series vs. DataFrame
                    </h2>
                    <p>
                        Pandas has two main data structures:
                    </p>
                    <ul className="list-disc list-inside text-surface-300 space-y-2 ml-4">
                        <li><strong>DataFrame:</strong> The whole table (2D). Like an Excel sheet.</li>
                        <li><strong>Series:</strong> A single column (1D). Like a Python list.</li>
                    </ul>
                    <CodeBlock code={`# Get data in column 'temp' (Series)
print(data["temp"])

# Convert to list
temp_list = data["temp"].to_list()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Analysis & Filtering
                    </h2>
                    <p>
                        We can perform calculations on columns or filter rows based on conditions.
                    </p>
                    <CodeBlock code={`# Calculations
average_temp = data["temp"].mean()
max_temp = data["temp"].max()

# Filtering (Get row where day is Monday)
monday = data[data.day == "Monday"]
print(monday.condition)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Creating DataFrames
                    </h2>
                    <p>
                        You can create a DataFrame from scratch using a dictionary.
                    </p>
                    <CodeBlock code={`data_dict = {
    "students": ["Amy", "James", "Angela"],
    "scores": [76, 56, 65]
}
new_data = pd.DataFrame(data_dict)
new_data.to_csv("new_data.csv")`} language="python" />
                </section>

            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Accessing Attributes</h4>
                            <p className="text-sm text-surface-400">
                                You can access columns like attributes: <code>data.temp</code> is the same as <code>data["temp"]</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Getting Numbers</h4>
                            <p className="text-sm text-surface-400">
                                Be careful with types. If Pandas reads a column as strings, <code>mean()</code> won't work.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Max Row</h4>
                            <p className="text-sm text-surface-400">
                                To get the row with the max temp: <code>data[data.temp == data.temp.max()]</code>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
