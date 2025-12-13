import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Lightbulb, Gamepad2, ArrowRight } from 'lucide-react'

export default function DeepDiveDay14() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Gamepad2 className="w-6 h-6 text-primary-400" /> The Higher Lower Game
                    </h2>
                    <p>
                        "Who has more Instagram followers: Cristiano Ronaldo or Selena Gomez?"
                        Today you'll build your first data-driven game. You'll work with large datasets
                        (Lists of Dictionaries), implement game logic loops, and manage state updates.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Handling Game Data
                    </h2>
                    <p>
                        Real-world data often comes as a list of dictionaries. This structure is flexible
                        and allows you to store structured attributes for many different entities.
                    </p>
                    <CodeBlock code={`data = [
    {
        'name': 'Instagram',
        'follower_count': 346,
        'description': 'Social media platform',
        'country': 'United States'
    },
    {
        'name': 'Cristiano Ronaldo',
        'follower_count': 215,
        'description': 'Footballer',
        'country': 'Portugal'
    }
]

# Accessing data
account = data[0]
print(f"{account['name']} has {account['follower_count']}M followers")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> The Game Loop logic
                    </h2>
                    <p>
                        The core game relies on a `while` loop that continues as long as the user guesses correctly.
                        A critical mechanic is swapping: Account B becomes Account A for the next round.
                    </p>
                    <CodeBlock code={`import random

game_should_continue = True
account_a = random.choice(data)
account_b = random.choice(data)

while game_should_continue:
    account_a = account_b # Move B to A position
    account_b = random.choice(data) # Pick new B

    if account_a == account_b:
        account_b = random.choice(data) # Avoid duplicate

    # ... compare followers ...`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Comparison Logic
                    </h2>
                    <p>
                        Often the logic to check the answer is cleaner if separated into a function.
                        It needs to know the user's guess and the follower counts of both accounts.
                    </p>
                    <CodeBlock code={`def check_answer(guess, a_followers, b_followers):
    """Returns True if user is correct, False otherwise."""
    if a_followers > b_followers:
        return guess == "a"
    else:
        return guess == "b"

# Usage
is_correct = check_answer(guess, a_count, b_count)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Breaking Down the Problem
                    </h2>
                    <p>
                        Don't try to write the whole game at once. Break it down:
                    </p>
                    <ul className="list-decimal list-inside text-surface-300 space-y-2 ml-4">
                        <li>Import `random` and `game_data`.</li>
                        <li>Create a function to format the account data into a printable string.</li>
                        <li>Log logic for picking random accounts.</li>
                        <li>Implement the `while` loop and scoring.</li>
                        <li>Add the "Game Over" condition.</li>
                    </ul>
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Clearing the Screen</h4>
                            <p className="text-sm text-surface-400">
                                In Repl.it or terminal, you can import `os` and call `os.system('cls')` (Windows) or `clear` (Mac/Linux) to hide previous rounds.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div >
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">ASCII Art</h4>
                            <p className="text-sm text-surface-400">
                                Printing the logo at the start of every loop helps reinforce the branding. Store ASCII art in a separate module to keep your main code clean.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div >
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Data Structures</h4>
                            <p className="text-sm text-surface-400">
                                Using a key like 'follower_count' is much safer than relying on index positions like `data[1]` because the order in a dictionary doesn't matter.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
