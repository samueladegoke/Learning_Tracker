import CodeBlock from '../../CodeBlock'
import { Lightbulb } from 'lucide-react'

export default function DeepDiveDay12() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Understanding Scope: The Apple Tree Analogy
                    </h2>
                    <p>
                        <strong>Scope</strong> determines where variables and functions can be accessed in your code.
                        Think of it like an apple tree: if it's in your garden (inside a function), only your
                        family can access it. If it's by the sidewalk (at the top level), anyone can reach it.
                    </p>
                    <CodeBlock code={`enemies = 1  # Global scope - accessible everywhere

def increase_enemies():
    enemies = 2  # Local scope - NEW variable!
    print(f"Inside function: {enemies}")  # Prints 2

increase_enemies()
print(f"Outside function: {enemies}")  # Prints 1 (unchanged!)`} language="python" />
                    <p>
                        <strong>Key insight:</strong> Setting <code>enemies = 2</code> inside the function
                        creates a <em>completely new</em> local variable. It doesn't modify the global one!
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Local Scope: Inside the Function Walls
                    </h2>
                    <p>
                        Variables created inside a function have <strong>local scope</strong>—they only exist
                        within that function and cannot be accessed from outside.
                    </p>
                    <CodeBlock code={`def drink_potion():
    potion_strength = 2  # Local variable
    print(potion_strength)  # Works: 2

drink_potion()
# print(potion_strength)  # NameError: name 'potion_strength' is not defined`} language="python" />
                    <p>
                        Trying to access <code>potion_strength</code> outside the function causes a <code>NameError</code>
                        because the variable doesn't exist in that scope.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Global Scope: The Top Level
                    </h2>
                    <p>
                        Variables created at the top level of your file (not inside any function) have
                        <strong>global scope</strong>—they're accessible from anywhere in your code.
                    </p>
                    <CodeBlock code={`player_health = 10  # Global scope

def drink_potion():
    potion_strength = 2
    print(player_health)  # Works! Can READ global variables

drink_potion()  # Prints: 10

# Global variables work both inside and outside functions
print(player_health)  # Also works: 10`} language="python" />
                    <p>
                        <strong>Reading</strong> global variables from inside functions is always allowed.
                        The tricky part is when you want to <strong>modify</strong> them.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Modifying Globals: The global Keyword
                    </h2>
                    <p>
                        To <em>modify</em> a global variable from inside a function, you must explicitly
                        declare it using the <code>global</code> keyword.
                    </p>
                    <CodeBlock code={`enemies = 1

def increase_enemies():
    global enemies  # Tell Python: use the global 'enemies'
    enemies += 1
    print(f"Inside: {enemies}")

increase_enemies()
print(f"Outside: {enemies}")  # Now it's 2!`} language="python" />
                    <p className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        ⚠️ <strong>Warning:</strong> While <code>global</code> works, it's generally
                        considered bad practice because it makes code harder to debug and maintain.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Better Alternative: Return Values
                    </h2>
                    <p>
                        Instead of modifying global variables, use <code>return</code> to send values back
                        from functions. This keeps your code cleaner and more predictable.
                    </p>
                    <CodeBlock code={`enemies = 1

def increase_enemies():
    return enemies + 1  # Return the new value

enemies = increase_enemies()  # Capture the returned value
print(enemies)  # 2

# This pattern is:
# ✅ Easier to debug
# ✅ Functions are self-contained
# ✅ No hidden side effects`} language="python" />
                    <p>
                        This approach makes functions portable—you can move them anywhere without worrying
                        about which global variables they depend on.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">06.</span> Constants: When Globals Are Okay
                    </h2>
                    <p>
                        Global variables ARE appropriate for <strong>constants</strong>—values you define once
                        and never change. Use ALL_CAPS to indicate they shouldn't be modified.
                    </p>
                    <CodeBlock code={`# Constants use UPPER_SNAKE_CASE by convention
PI = 3.14159
TWITTER_API_URL = "https://api.twitter.com"
EASY_LEVEL_TURNS = 10
HARD_LEVEL_TURNS = 5

def calculate_area(radius):
    return PI * radius * radius  # Reading PI is perfectly fine

def set_difficulty():
    level = input("Choose difficulty (easy/hard): ")
    if level == "easy":
        return EASY_LEVEL_TURNS
    else:
        return HARD_LEVEL_TURNS`} language="python" />
                    <p>
                        Constants defined at the top of your file are easy to find and update. The ALL_CAPS
                        naming reminds you (and others) not to modify them elsewhere.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">07.</span> Number Guessing Game Project
                    </h2>
                    <p>
                        The Day 12 project combines scope concepts with everything from previous days:
                        <code>random.randint()</code>, while loops, functions with returns, and user input.
                    </p>
                    <CodeBlock code={`from random import randint

EASY_LEVEL_TURNS = 10
HARD_LEVEL_TURNS = 5

def set_difficulty():
    level = input("Choose a difficulty (easy/hard): ")
    if level == "easy":
        return EASY_LEVEL_TURNS
    else:
        return HARD_LEVEL_TURNS

def check_answer(guess, answer, turns):
    if guess > answer:
        print("Too high.")
        return turns - 1
    elif guess < answer:
        print("Too low.")
        return turns - 1
    else:
        print(f"You got it! The answer was {answer}.")
        return turns  # Don't decrement on correct guess

def game():
    print("Welcome to the Number Guessing Game!")
    print("I'm thinking of a number between 1 and 100.")
    answer = randint(1, 100)
    turns = set_difficulty()
    guess = 0
    
    while guess != answer and turns > 0:
        print(f"You have {turns} attempts remaining.")
        guess = int(input("Make a guess: "))
        turns = check_answer(guess, answer, turns)
        
    if turns == 0:
        print(f"You've run out of guesses. The answer was {answer}.")

game()`} language="python" />
                </section>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Python Has No Block Scope</h4>
                            <p className="text-sm text-surface-400">
                                Unlike some languages, variables in <code>if</code> or <code>for</code> blocks
                                don't have their own scope. Only <strong>functions</strong> create local scope.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Avoid global When Possible</h4>
                            <p className="text-sm text-surface-400">
                                Using <code>global</code> can lead to "spaghetti code" where changes
                                in one place affect distant parts of your program unexpectedly.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Namespace Concept</h4>
                            <p className="text-sm text-surface-400">
                                Everything you name (variables, functions) exists in a <strong>namespace</strong>.
                                The namespace determines where that name is valid.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Wrap Game Logic in a Function</h4>
                            <p className="text-sm text-surface-400">
                                Creating a <code>game()</code> function keeps your main logic organized
                                and prevents variables from accidentally having global scope.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
