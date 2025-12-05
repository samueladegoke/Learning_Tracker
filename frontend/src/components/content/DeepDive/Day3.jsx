import CodeBlock from '../../CodeBlock'

export default function DeepDiveDay3() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Section 1: Control Flow with if/else */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Control Flow with if/else
                    </h2>
                    <p>
                        Control flow lets your program make decisions. Think of a bathtub overflow mechanism—when water
                        reaches a certain level, it drains; otherwise, it keeps filling. This "&gt;if this, then that" logic
                        is the foundation of conditional programming.
                    </p>
                    <CodeBlock code={`# Basic if/else structure
height = 130

if height >= 120:
    print("You can ride the roller coaster!")
else:
    print("Sorry, you have to grow taller.")`} />

                    <div className="bg-surface-800/50 p-6 rounded-xl border border-surface-700">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">Comparison Operators</h3>
                        <ul className="grid grid-cols-2 gap-3 text-surface-300">
                            <li><code>&gt;</code> — Greater than</li>
                            <li><code>&lt;</code> — Less than</li>
                            <li><code>&gt;=</code> — Greater than or equal</li>
                            <li><code>&lt;=</code> — Less than or equal</li>
                            <li><code>==</code> — Equal to (comparison)</li>
                            <li><code>!=</code> — Not equal to</li>
                        </ul>
                        <p className="text-surface-400 text-sm mt-3">
                            <strong>Remember:</strong> <code>=</code> assigns a value, <code>==</code> compares values.
                        </p>
                    </div>
                </section>

                {/* Section 2: The Modulo Operator */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> The Modulo Operator
                    </h2>
                    <p>
                        The modulo operator (<code>%</code>) returns the <em>remainder</em> after division.
                        It's incredibly useful for checking if numbers are even/odd or for cycling through values.
                    </p>
                    <CodeBlock code={`# Modulo gives the remainder
print(10 % 5)  # Output: 0 (divides evenly)
print(10 % 3)  # Output: 1 (10 ÷ 3 = 3 remainder 1)

# Classic use: check if even or odd
number = 7
if number % 2 == 0:
    print("Even")
else:
    print("Odd")  # This prints`} />
                </section>

                {/* Section 3: Nested if and elif Statements */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Nested if and elif Statements
                    </h2>
                    <p>
                        Use <code>elif</code> (else-if) to check multiple conditions in sequence. Only the first
                        matching condition runs. <strong>Nested</strong> if statements let you check conditions
                        inside other conditions.
                    </p>
                    <CodeBlock code={`# Ticket pricing with elif
age = 15

if age < 12:
    bill = 5
    print("Child ticket: $5")
elif age <= 18:
    bill = 7
    print("Youth ticket: $7")
else:
    bill = 12
    print("Adult ticket: $12")`} />

                    <div className="bg-surface-800/50 p-6 rounded-xl border border-surface-700">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">if/elif/else vs Multiple if</h3>
                        <ul className="space-y-2 list-disc list-inside text-surface-300">
                            <li><code>if/elif/else</code> — Only ONE branch executes (first match wins)</li>
                            <li>Multiple <code>if</code> statements — Each condition is checked independently</li>
                        </ul>
                    </div>
                </section>

                {/* Section 4: Logical Operators */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Logical Operators
                    </h2>
                    <p>
                        Combine multiple conditions using <code>and</code>, <code>or</code>, and <code>not</code>.
                    </p>
                    <CodeBlock code={`a = 12

# AND: Both must be True
print(a > 10 and a < 15)  # True

# OR: At least one must be True
print(a > 15 or a < 20)   # True

# NOT: Reverses the condition
print(not a > 15)         # True (because a > 15 is False)`} />

                    <div className="bg-surface-800/50 p-6 rounded-xl border border-surface-700">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">Truth Table Quick Reference</h3>
                        <div className="grid grid-cols-3 gap-4 text-sm font-mono">
                            <div>
                                <p className="font-bold text-surface-200 mb-2">AND</p>
                                <p className="text-green-400">T and T → T</p>
                                <p className="text-red-400">T and F → F</p>
                                <p className="text-red-400">F and T → F</p>
                                <p className="text-red-400">F and F → F</p>
                            </div>
                            <div>
                                <p className="font-bold text-surface-200 mb-2">OR</p>
                                <p className="text-green-400">T or T → T</p>
                                <p className="text-green-400">T or F → T</p>
                                <p className="text-green-400">F or T → T</p>
                                <p className="text-red-400">F or F → F</p>
                            </div>
                            <div>
                                <p className="font-bold text-surface-200 mb-2">NOT</p>
                                <p className="text-red-400">not T → F</p>
                                <p className="text-green-400">not F → T</p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* Sidebar: Pro Tips */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <span className="text-xl">💡</span> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Indentation Matters</h4>
                            <p className="text-sm text-surface-400">
                                Python uses indentation to define code blocks. Mixing tabs and spaces will cause <code>IndentationError</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Case-Insensitive Input</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>.lower()</code> to normalize user input:
                            </p>
                            <CodeBlock code={`choice = input("Left or Right? ").lower()
if choice == "left":
    print("You continue...")`} />
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Day 3 Project</h4>
                            <p className="text-sm text-surface-400">
                                <strong>Treasure Island</strong> — A text-based adventure game using nested conditionals.
                                Players make choices (left/right, swim/wait) leading to different endings!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
