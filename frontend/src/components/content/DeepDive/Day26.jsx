import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Braces, List, BookOpen, Filter, Database, Lightbulb } from 'lucide-react'

export default function DeepDiveDay26() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <List className="w-6 h-6 text-primary-400" /> List Comprehension & NATO Alphabet
                    </h2>
                    <p>
                        Day 26 introduces <strong>List Comprehension</strong> — a powerful Python feature that lets you create new lists
                        from existing sequences in a single, readable line. This concise syntax is beloved by Python developers
                        for cutting down code and improving clarity.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Basic List Comprehension
                    </h2>
                    <p>
                        The basic syntax follows a keyword pattern: <code>new_item for item in list</code>. This replaces
                        the traditional approach of creating an empty list and appending in a loop.
                    </p>
                    <CodeBlock code={`# Traditional approach (4 lines)
numbers = [1, 2, 3]
new_list = []
for n in numbers:
    new_list.append(n + 1)

# List comprehension (1 line)
new_list = [n + 1 for n in numbers]
# Result: [2, 3, 4]`} language="python" />
                    <p>
                        The comprehension reads: "For each n in numbers, create n + 1 and add it to the new list."
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Working with Sequences
                    </h2>
                    <p>
                        List comprehension works with any <strong>sequence</strong>: lists, strings, ranges, and tuples.
                        Strings iterate character by character; ranges generate number sequences.
                    </p>
                    <CodeBlock code={`# String to list of letters
name = "Angela"
letters = [letter for letter in name]
# Result: ['A', 'n', 'g', 'e', 'l', 'a']

# Range with transformation
doubled = [num * 2 for num in range(1, 5)]
# Result: [2, 4, 6, 8]

# Squares from 1 to 5
squares = [x ** 2 for x in range(1, 6)]
# Result: [1, 4, 9, 16, 25]`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Conditional List Comprehension
                    </h2>
                    <p>
                        Add an <code>if</code> clause at the end to filter items. The pattern becomes:
                        <code> new_item for item in list if test</code>.
                    </p>
                    <CodeBlock code={`names = ["Alex", "Beth", "Caroline", "Dave", "Eleanor"]

# Filter: only short names (4 letters or less)
short_names = [name for name in names if len(name) < 5]
# Result: ['Alex', 'Beth', 'Dave']

# Filter AND transform: long names in uppercase
long_names = [name.upper() for name in names if len(name) > 5]
# Result: ['CAROLINE', 'ELEANOR']

# Even numbers from a range
evens = [n for n in range(1, 21) if n % 2 == 0]
# Result: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Dictionary Comprehension
                    </h2>
                    <p>
                        Similar to list comprehension but uses curly braces <code>{'{}'}</code> and creates key-value pairs.
                        Syntax: <code>{'{new_key: new_value for item in list}'}</code>.
                    </p>
                    <CodeBlock code={`import random

names = ["Alex", "Beth", "Caroline", "Dave"]

# Create dict with random scores
student_scores = {student: random.randint(1, 100) for student in names}
# Result: {'Alex': 72, 'Beth': 85, 'Caroline': 45, 'Dave': 91}

# Filter dict: only passing students (score >= 60)
passed = {student: score for student, score 
          in student_scores.items() if score >= 60}

# Square dictionary: number -> its square
squares = {n: n**2 for n in range(1, 6)}
# Result: {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Iterating Pandas DataFrames
                    </h2>
                    <p>
                        Pandas DataFrames support iteration with <code>iterrows()</code>, which yields each row as a Series.
                        This is useful when you need row-by-row processing.
                    </p>
                    <CodeBlock code={`import pandas as pd

student_dict = {
    "student": ["Angela", "James", "Lily"],
    "score": [56, 76, 98]
}
df = pd.DataFrame(student_dict)

# Loop through rows
for index, row in df.iterrows():
    print(row.student, row.score)

# Find specific student's score
for index, row in df.iterrows():
    if row.student == "Angela":
        print(row.score)  # 56`} language="python" />
                </section>

            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Keyword Pattern</h4>
                            <p className="text-sm text-surface-400">
                                Remember the pattern: <code>new_item for item in list</code>. Add <code>if test</code> at the end for filtering.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Readability First</h4>
                            <p className="text-sm text-surface-400">
                                Don't nest too deeply. If your comprehension spans multiple lines, a regular loop may be clearer.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Dict .items()</h4>
                            <p className="text-sm text-surface-400">
                                When iterating over a dictionary, use <code>.items()</code> to get both key and value: <code>for k, v in dict.items()</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">NATO Alphabet</h4>
                            <p className="text-sm text-surface-400">
                                The project uses dict comprehension to map letters to NATO code words from a CSV file.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
