import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Lightbulb, Laptop, Coffee, Code2 } from 'lucide-react'

export default function DeepDiveDay15() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Laptop className="w-6 h-6 text-primary-400" /> Local Development & The Coffee Machine
                    </h2>
                    <p>
                        Today marks a shift from web-based IDEs (like Replit) to your own Local Development Environment (IDE)
                        like PyCharm or VS Code. You'll apply this new power to build a complex Coffee Machine simulator.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Installation & Setup
                    </h2>
                    <p>
                        Professional developers write code on their own machines. This gives you access to powerful debugging tools,
                        keyboard shortcuts, and file management.
                    </p>
                    <ul className="list-disc list-inside text-surface-300 space-y-2 ml-4">
                        <li><strong>Python:</strong> The interpreter that runs your code.</li>
                        <li><strong>IDE (Integrated Development Environment):</strong> The tool used to write code (VS Code, PyCharm).</li>
                        <li><strong>Terminal:</strong> The command line interface to run scripts (`python main.py`).</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Coffee Machine Requirements
                    </h2>
                    <p>
                        The machine has 3 flavors: <strong>Espresso</strong>, <strong>Latte</strong>, and <strong>Cappuccino</strong>.
                        Each has a recipe (ingredients) and a cost. The machine also holds specific resources (Water, Milk, Coffee).
                    </p>
                    <CodeBlock code={`MENU = {
    "espresso": {
        "ingredients": {"water": 50, "coffee": 18},
        "cost": 1.5,
    },
    ...
}

resources = {
    "water": 300,
    "milk": 200,
    "coffee": 100,
}`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Program Flow
                    </h2>
                    <p>
                        Complex programs need a clear flow. For the coffee machine:
                    </p>
                    <ol className="list-decimal list-inside text-surface-300 space-y-2 ml-4">
                        <li><strong>Prompt User:</strong> "What would you like? (espresso/latte/cappuccino)"</li>
                        <li><strong>Check Resources:</strong> Is there enough water/milk?</li>
                        <li><strong>Process Coins:</strong> Ask for quarters, dimes, nickels, pennies.</li>
                        <li><strong>Check Transaction:</strong> Did they put in enough money?</li>
                        <li><strong>Make Coffee:</strong> Deduct resources and give change.</li>
                    </ol>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Using TODOs
                    </h2>
                    <p>
                        Most IDEs recognize the `# TODO` comment. It highlights the line and often adds it to a special "TODO List" panel,
                        making it easy to track what's left to build.
                    </p>
                    <CodeBlock code={`# TODO: 1. Print report of all coffee machine resources
def print_report():
    print(f"Water: {resources['water']}ml")
    # ...`} language="python" />
                </section>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div >
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Emoji Power</h4>
                            <p className="text-sm text-surface-400">
                                Use the emoji keyboard (Win + . or Ctrl + Cmd + Space) to add flair to your console output. ☕️
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div >
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Global Scope</h4>
                            <p className="text-sm text-surface-400">
                                Remember, if you want to modify the global `profit` variable inside a function, you need `global profit`.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div >
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Rounding</h4>
                            <p className="text-sm text-surface-400">
                                Use `round(number, 2)` to display currency correctly (e.g., $1.50 instead of $1.5000002).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
