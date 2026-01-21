import CodeBlock from '../../CodeBlock'
import { Lightbulb } from 'lucide-react'

export default function DeepDiveDay4() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Section 1: The Random Module */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> The Random Module
                    </h2>
                    <p>
                        Computers are <strong>deterministic</strong>—they perform repeatable actions predictably.
                        To create unpredictability (like in games), Python uses <em>Pseudorandom Number Generators</em>
                        via the <code>random</code> module.
                    </p>
                    <CodeBlock code={`import random

# Random integer between 1 and 10 (inclusive)
random_integer = random.randint(1, 10)
print(random_integer)  # e.g., 7

# Random float between 0 and 1 (0 inclusive, 1 exclusive)
random_float = random.random()
print(random_float)  # e.g., 0.4523...

# Expand range by multiplying
random_0_to_5 = random.random() * 5
print(random_0_to_5)  # e.g., 3.21...`} />

                    <div className="bg-surface-800/50 p-6 rounded-xl border border-surface-700">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">Key Functions</h3>
                        <ul className="space-y-2 text-surface-300">
                            <li><code>random.randint(a, b)</code> — Random integer from a to b (inclusive)</li>
                            <li><code>random.random()</code> — Random float from 0 to 1</li>
                            <li><code>random.choice(list)</code> — Pick random item from a list</li>
                            <li><code>random.shuffle(list)</code> — Shuffle list in place</li>
                        </ul>
                    </div>
                </section>

                {/* Section 2: Python Lists */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Python Lists
                    </h2>
                    <p>
                        A <strong>list</strong> is a data structure for storing ordered, related data.
                        Use square brackets <code>[]</code> to create lists.
                    </p>
                    <CodeBlock code={`# Creating a list
fruits = ["Cherry", "Apple", "Pear"]
states = ["Delaware", "Pennsylvania", "New Jersey"]

# Mixed data types allowed
mixed = [1, "hello", True, 3.14]

# Accessing items by index (0-based)
print(fruits[0])   # "Cherry" (first item)
print(fruits[1])   # "Apple" (second item)
print(fruits[-1])  # "Pear" (last item)`} />
                </section>

                {/* Section 3: Indexing & the Offset Concept */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Indexing & the Offset Concept
                    </h2>
                    <p>
                        Think of the index as an <em>offset from the start</em>. The first item has zero
                        offset, so it's at index 0.
                    </p>
                    <CodeBlock code={`fruits = ["Cherry", "Apple", "Pear"]
#            [0]       [1]      [2]    ← positive indices
#           [-3]      [-2]     [-1]    ← negative indices

# Positive: count from start
print(fruits[0])   # "Cherry"

# Negative: count from end
print(fruits[-1])  # "Pear" (last)
print(fruits[-2])  # "Apple" (second-to-last)`} />

                    <div className="bg-surface-800/50 p-6 rounded-xl border border-surface-700">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">Why Start at 0?</h3>
                        <p className="text-surface-300 text-sm">
                            The index represents how far the item is <em>shifted</em> from the beginning.
                            The first item is at the beginning (no shift), so index = 0.
                        </p>
                    </div>
                </section>

                {/* Section 4: Modifying Lists */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Modifying Lists
                    </h2>
                    <p>
                        Lists are <strong>mutable</strong>—you can change, add, or remove items.
                    </p>
                    <CodeBlock code={`fruits = ["Cherry", "Apple", "Pear"]

# Change an item
fruits[1] = "Banana"
print(fruits)  # ["Cherry", "Banana", "Pear"]

# Add item to end
fruits.append("Orange")
print(fruits)  # ["Cherry", "Banana", "Pear", "Orange"]

# Add multiple items
fruits.extend(["Grape", "Mango"])
print(fruits)  # ["Cherry", "Banana", "Pear", "Orange", "Grape", "Mango"]`} />

                    <div className="bg-surface-800/50 p-6 rounded-xl border border-surface-700">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">List Methods</h3>
                        <ul className="space-y-2 text-surface-300 text-sm">
                            <li><code>.append(item)</code> — Add single item to end</li>
                            <li><code>.extend([items])</code> — Add multiple items to end</li>
                            <li><code>.insert(index, item)</code> — Insert at specific position</li>
                            <li><code>.remove(item)</code> — Remove first occurrence</li>
                            <li><code>.pop()</code> — Remove and return last item</li>
                        </ul>
                    </div>
                </section>

            </div>

            {/* Sidebar: Pro Tips */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Modules = Toolboxes</h4>
                            <p className="text-sm text-surface-400">
                                A module is just a Python file with functions/variables you can <code>import</code>.
                                The <code>random</code> module is built-in; you can also create your own!
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">IndexError</h4>
                            <p className="text-sm text-surface-400">
                                If you access an index that doesn't exist, you get an <code>IndexError</code>.
                                Always check list length first!
                            </p>
                            <CodeBlock code={`fruits = ["A", "B"]
# fruits[5]  # IndexError!
print(len(fruits))  # 2`} />
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Day 4 Project</h4>
                            <p className="text-sm text-surface-400">
                                <strong>Rock Paper Scissors</strong> — Use random.randint() to make the
                                computer choose, then compare with user input!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
