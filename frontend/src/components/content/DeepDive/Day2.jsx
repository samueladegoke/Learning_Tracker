import CodeBlock from '../../CodeBlock'
import { Lightbulb } from 'lucide-react'

export default function DeepDiveDay2() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Data Types
                    </h2>
                    <p>
                        Python has several built-in data types. The most common ones you'll use effectively immediately are:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <li className="bg-surface-800/50 p-4 rounded-lg border border-surface-700">
                            <span className="font-mono text-primary-300 block mb-1">String</span>
                            <code className="text-sm bg-surface-900 px-2 py-0.5 rounded">"Hello"</code>
                            <span className="text-sm text-surface-400 block mt-1">Text characters</span>
                        </li>
                        <li className="bg-surface-800/50 p-4 rounded-lg border border-surface-700">
                            <span className="font-mono text-primary-300 block mb-1">Integer</span>
                            <code className="text-sm bg-surface-900 px-2 py-0.5 rounded">123</code>
                            <span className="text-sm text-surface-400 block mt-1">Whole numbers</span>
                        </li>
                        <li className="bg-surface-800/50 p-4 rounded-lg border border-surface-700">
                            <span className="font-mono text-primary-300 block mb-1">Float</span>
                            <code className="text-sm bg-surface-900 px-2 py-0.5 rounded">3.14</code>
                            <span className="text-sm text-surface-400 block mt-1">Decimal numbers</span>
                        </li>
                        <li className="bg-surface-800/50 p-4 rounded-lg border border-surface-700">
                            <span className="font-mono text-primary-300 block mb-1">Boolean</span>
                            <code className="text-sm bg-surface-900 px-2 py-0.5 rounded">True</code>
                            <span className="text-sm text-surface-400 block mt-1">True or False</span>
                        </li>
                    </ul>
                </section>
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Type Conversion
                    </h2>
                    <p>
                        You can convert between data types using functions like <code>str()</code>, <code>int()</code>, and <code>float()</code>.
                        This is essential when you want to concatenate numbers with strings.
                    </p>
                    <CodeBlock code={`num_char = len(input("Name? "))\n# print("Name has " + num_char + " chars") # TypeError\n\nnew_num_char = str(num_char)\nprint("Name has " + new_num_char + " chars") # Works!`} />
                </section>
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> F-Strings
                    </h2>
                    <p>
                        F-Strings are a convenient way to embed expressions inside string literals.
                        Prefix the string with <code>f</code> and use curly braces <code>{ }</code> to insert variables.
                    </p>
                    <CodeBlock code={`score = 0\nheight = 1.8\nisWinning = True\n\n# Without f-string (painful)\nprint("Score: " + str(score) + ", Height: " + str(height))\n\n# With f-string (easy)\nprint(f"Score: {score}, Height: {height}, Winning: {isWinning}")`} />
                </section>
            </div>
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Subscripting</h4>
                            <p className="text-sm text-surface-400">
                                You can pull out a character from a string using square brackets.
                                <code>"Hello"[0]</code> gives you <code>'H'</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">PEMDAS / BODMAS</h4>
                            <p className="text-sm text-surface-400">
                                Math follows standard order of operations:
                                () then ** then * / then + -
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
