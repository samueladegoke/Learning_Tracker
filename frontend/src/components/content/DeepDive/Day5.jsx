import CodeBlock from '../../CodeBlock'

export default function DeepDiveDay5() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Using the for loop with Python Lists
                    </h2>
                    <p>
                        Loops allow you to repeat a block of code multiple times. The <code>for</code> loop is great for iterating over a list of items.
                        It assigns each item to a variable one by one.
                    </p>
                    <CodeBlock code={`fruits = ["Apple", "Peach", "Pear"]
for fruit in fruits:
    print(fruit)
    print(fruit + " Pie")`} />
                </section>
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> The range() Function
                    </h2>
                    <p>
                        The <code>range()</code> function generates a sequence of numbers. It is often used with loops to repeat code a specific number of times.
                        <b>Note:</b> The stop value is exclusive (not included).
                    </p>
                    <CodeBlock code={`# 1 to 9 (10 is excluded)
for number in range(1, 10):
    print(number)

# With step (jump by 3)
for number in range(1, 11, 3):
    print(number) # 1, 4, 7, 10`} />
                </section>
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Code Blocks and Indentation
                    </h2>
                    <p>
                        In Python, indentation determines which lines of code belong to the loop.
                        Lines indented after the <code>for</code> statement are repeated. Lines not indented run once after the loop finishes.
                    </p>
                    <CodeBlock code={`for number in range(1, 4):
    print(number) # Runs 3 times
print("Done!") # Runs once`} />
                </section>
            </div>
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <span className="text-xl">💡</span> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Indentation Errors</h4>
                            <p className="text-sm text-surface-400">
                                Python relies on indentation. If you get an <code>IndentationError</code>, check your spaces/tabs.
                                Standard is 4 spaces.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Off-by-one Error</h4>
                            <p className="text-sm text-surface-400">
                                Remember <code>range(1, 10)</code> stops at 9. If you want 1 to 10 included, use <code>range(1, 11)</code>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
