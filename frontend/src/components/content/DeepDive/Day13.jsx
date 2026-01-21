import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Lightbulb, Bug, Search, Terminal, Eye } from 'lucide-react'

export default function DeepDiveDay13() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Bug className="w-6 h-6 text-primary-400" /> Debugging: Finding & Fixing Errors
                    </h2>
                    <p>
                        "Everyone gets bugs." The first step to mastering programming isn't just writing code—it's
                        knowing how to fix it when it breaks. Debugging is a systematic process, not a guessing game.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Describe the Problem
                    </h2>
                    <p>
                        If you can't describe the problem simply, you don't understand it properly.
                        Untangle the logic. What do you expect to happen? What actually happens?
                    </p>
                    <CodeBlock code={`# Problem: Loop never reaches 20
def my_function():
    for i in range(1, 20):
        # range(1, 20) stops at 19!
        if i == 20: 
            print("You got it") 

# Fix: range(1, 21)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Reproduce the Bug
                    </h2>
                    <p>
                        Bugs that only happen "sometimes" are the worst. You must identify exactly <em>when</em>
                        it breaks to fix it. Is it a specific input? A random number edge case?
                    </p>
                    <CodeBlock code={`import random
dice_imgs = ["❶", "❷", "❸", "❹", "❺", "❻"]
dice_num = random.randint(1, 6) # Generates 1-6

# Error! List index out of range when dice_num is 6
# Lists are 0-indexed (0-5)
print(dice_imgs[dice_num])`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Play Computer
                    </h2>
                    <p>
                        Don't just stare at the code. Walk through it line-by-line in your head (or on paper)
                        as if YOU are the computer. Track variables at each step.
                    </p>
                    <CodeBlock code={`year = 1994
if year > 1980 and year < 1994:
    print("Millenial")
elif year > 1994:
    print("Gen Z")

# 1994 is NOT < 1994 and NOT > 1994
# The value 1994 falls into a black hole!
# Fix: year >= 1994`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Print is Your Best Friend
                    </h2>
                    <p>
                        When in doubt, print everything. Checking your assumptions is key.
                        You might think a variable is an integer `5`, but it's actually a string `"5"`.
                    </p>
                    <CodeBlock code={`pages = 0
word_per_page = 0
pages = int(input("Number of pages: "))
word_per_page == int(input("Number of words: ")) # Typo: == instead of =

total = pages * word_per_page
print(f"Pages: {pages}, Words: {word_per_page}") # Output: Words: 0
# The print reveals word_per_page never got assigned!`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Use a Debugger
                    </h2>
                    <p>
                        Tools like PyCharm or VS Code have built-in debuggers. They let you:
                    </p>
                    <ul className="list-disc list-inside text-surface-300 space-y-2 ml-4">
                        <li><strong>Set Breakpoints:</strong> Pause execution at a specific line.</li>
                        <li><strong>Step Over:</strong> Run the next line of code.</li>
                        <li><strong>Step Into:</strong> Go inside a function call.</li>
                        <li><strong>Watch Variables:</strong> See live values change as you step.</li>
                    </ul>
                </section>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 inline mr-2" /> Debugging Mindset
                    </h3>
                    <div className="space-y-4">
                        <div >
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Red Underlines</h4>
                            <p className="text-sm text-surface-400">
                                Your editor is trying to help. Red squiggles usually mean syntax errors (missing colons, indentation). Fix these first.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div >
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Rubber Ducking</h4>
                            <p className="text-sm text-surface-400">
                                Explain your code line-by-line to a rubber duck (or an inanimate object). Just articulating the logic often reveals the bug.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div >
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Stack Overflow</h4>
                            <p className="text-sm text-surface-400">
                                Copy-paste your error message into Google. Someone else has had this exact problem before.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div >
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Take a Break</h4>
                            <p className="text-sm text-surface-400">
                                If you're stuck for hour, walk away. Your brain needs to reset. The solution often comes when you're making tea.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
