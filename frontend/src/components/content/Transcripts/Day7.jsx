import React from 'react';
import CodeBlock from '../../CodeBlock';

const TranscriptsDay7 = () => {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Day 7: Beginner - Hangman</h2>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">1. Breaking Down the Problem (Flowcharts)</h3>
                    <p className="text-gray-300 mb-4">
                        Before writing any code, it's crucial to understand the logic. We use <strong>flowcharts</strong> to break complex problems into small, manageable steps.
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 space-y-2">
                        <li><strong>Start</strong>: Generate a random word.</li>
                        <li><strong>Generate Blanks</strong>: Create a display like <code>_ _ _ _ _</code> matching the word length.</li>
                        <li><strong>User Guess</strong>: Ask the user for a letter.</li>
                        <li><strong>Check</strong>: Is the letter in the word?</li>
                        <li><strong>Feedback</strong>: If yes, reveal letter. If no, lose a life.</li>
                        <li><strong>Loop</strong>: Repeat until won or lost.</li>
                    </ul>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-green-400 mb-4">2. Step 1: Picking Random Words</h3>
                    <p className="text-gray-300 mb-4">
                        We start by selecting a random word from a list using the <code>random</code> module.
                    </p>
                    <CodeBlock code={`import random
word_list = ["ardvark", "baboon", "camel"]
chosen_word = random.choice(word_list)
print(f"Pssst, the solution is {chosen_word}.")`} language="python" />
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">3. Step 2: Replacing Blanks</h3>
                    <p className="text-gray-300 mb-4">
                        We need to display the word as blanks to the user. We create a list of underscores.
                    </p>
                    <CodeBlock code={`display = []
for _ in range(len(chosen_word)):
    display += "_"
print(display)`} language="python" />
                    <p className="text-gray-300 mt-4">
                        When the user guesses correctly, we loop through the chosen word. If the letter at a position matches the guess, we update the <code>display</code> list at that same position.
                    </p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-red-400 mb-4">4. Step 3: Win Condition</h3>
                    <p className="text-gray-300 mb-4">
                        The game continues while there are still underscores in the display.
                    </p>
                    <CodeBlock code={`end_of_game = False

while not end_of_game:
    guess = input("Guess a letter: ").lower()
    # Check logic...
    
    if "_" not in display:
        end_of_game = True
        print("You win.")`} language="python" />
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">5. Step 4 & 5: UX and ASCII Art</h3>
                    <p className="text-gray-300 mb-4">
                        Improving user experience is key.
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
                        <li><strong>Repetitive Guesses</strong>: "You've already guessed 'a'".</li>
                        <li><strong>Wrong Guesses</strong>: "You guessed 'z', that's not in the word. You lose a life."</li>
                        <li><strong>Visuals</strong>: Import ASCII art stages from a module to show the hangman progression.</li>
                    </ul>
                    <CodeBlock code={`from hangman_art import stages, logo
print(logo)

# Example Stage (lives = 0)
"""
_______
    |/      |
    |      (_)
    |      \|/
    |       |
    |      / \
    |
jgs_|___
"""

# ... inside loop ...
print(stages[lives])`} language="python" />
                </div>
            </div>
        </div>
    );
};

export default TranscriptsDay7;
