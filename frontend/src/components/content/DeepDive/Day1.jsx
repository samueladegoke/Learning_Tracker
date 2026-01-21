import CodeBlock from '../../CodeBlock'
import { Lightbulb } from 'lucide-react'

export default function DeepDiveDay1() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> The Print Function
                    </h2>
                    <p>
                        The <code>print()</code> function is your first tool in Python. It outputs whatever you put inside the parentheses to the console.
                        Think of it as the way your code "talks" to you.
                    </p>
                    <CodeBlock code={`print("Hello World!")\nprint("Day 1 - Python Print Function")`} />
                    <div className="bg-surface-800/50 p-6 rounded-xl border border-surface-700">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">Key Takeaways</h3>
                        <ul className="space-y-2 text-surface-300">
                            <li className="flex items-start gap-2">
                                <span className="text-primary-400 mt-1">•</span>
                                <span>Strings must be enclosed in quotes (single <code>'</code> or double <code>"</code>)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary-400 mt-1">•</span>
                                <span>Double quotes can contain single quotes: <code>"It's me"</code></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary-400 mt-1">•</span>
                                <span>Newlines can be created with <code>\n</code> inside a string</span>
                            </li>
                        </ul>
                    </div>
                </section>
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Variables
                    </h2>
                    <p>
                        Variables are like labelled boxes where you can store data. In Python, you can give a variable any name (with some rules)
                        and assign a value to it using the <code>=</code> sign.
                    </p>
                    <CodeBlock code={`name = "Jack"\nprint(name)\n\nname = "Angela"\nprint(name)`} />
                </section>
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> The Input Function
                    </h2>
                    <p>
                        <code>input()</code> allows your program to pause and wait for the user to type something.
                        Once they press Enter, that data is returned and can be stored in a variable.
                    </p>
                    <CodeBlock code={`# This will prompt the user and print "Hello [Name]!"\nprint("Hello " + input("What is your name? "))`} />
                </section>
            </div>
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Naming Convention</h4>
                            <p className="text-sm text-surface-400">Use <code>snake_case</code> for variable names in Python. It's the standard practice!</p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Debugging</h4>
                            <p className="text-sm text-surface-400">If your code doesn't run, check for <code>SyntaxError</code>. Often it's just a missing quote or parenthesis.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
