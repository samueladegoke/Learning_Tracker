import React from 'react';
import CodeBlock from '../../CodeBlock';

const DeepDiveDay7 = () => {
    return (
        <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">Flowchart Logic</h2>
                <p className="text-gray-300 mb-4">
                    Complex programs like Hangman can be overwhelming. The secret is to break them down using a <strong>Flowchart</strong>.
                </p>
                <div className="bg-gray-900 p-4 rounded-md mb-4">
                    <ul className="text-gray-300 space-y-2">
                        <li>1. Start Game &rarr; Generate Word &rarr; Generate Blanks</li>
                        <li>2. User Guess Loop:
                            <ul className="pl-6 list-disc text-gray-400 mt-1">
                                <li>Input Letter</li>
                                <li>Exists in Word? &rarr; YES: Replace Blank</li>
                                <li>Exists in Word? &rarr; NO: Lose Life</li>
                            </ul>
                        </li>
                        <li>3. Check Condition:
                            <ul className="pl-6 list-disc text-gray-400 mt-1">
                                <li>Lives == 0? &rarr; LOSE</li>
                                <li>No Blanks Left? &rarr; WIN</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-bold text-blue-400 mb-4">Strings vs Lists</h2>
                <p className="text-gray-300 mb-4">
                    In Python, strings are <strong>immutable</strong> (cannot be changed), while lists are <strong>mutable</strong>.
                    That's why we convert the blanks into a list <code>['_', '_', '_']</code> so we can update specific positions.
                </p>
                <CodeBlock code={`# This fails
word = "apple"
word[0] = "b" # Error!

# This works
display = ["_", "_", "_"]
display[0] = "a" # Success!`} language="python" />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-bold text-green-400 mb-4">The 'in' Keyword</h2>
                <p className="text-gray-300 mb-4">
                    The <code>in</code> keyword is a clean, Pythonic way to check for membership.
                </p>
                <CodeBlock code={`if "a" in ["a", "b", "c"]:
    print("Found it!")

if "_" not in display:
    print("You've won!")`} language="python" />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">Importing Modules</h2>
                <p className="text-gray-300 mb-4">
                    To keep our code clean, we move large data (like 1000s of words or ASCII art) to separate files and import them.
                </p>
                <CodeBlock code={`# hangman_art.py
logo = "..."
stages = [...]

# main.py
from hangman_art import logo, stages
print(logo)`} language="python" />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 border-l-4 border-l-purple-500">
                <h3 className="text-lg font-bold text-white mb-2">Project: Hangman</h3>
                <p className="text-gray-300">
                    Your goal is to perform the "Step 5" UX polish. Give the user feedback if they repeat a guess or guess incorrectly.
                    Combine logic, loops, and lists to save the hangman!
                </p>
            </div>
        </div>
    );
};

export default DeepDiveDay7;
