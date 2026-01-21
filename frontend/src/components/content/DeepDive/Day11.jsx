import CodeBlock from '../../CodeBlock'
import { Lightbulb } from 'lucide-react'

export default function DeepDiveDay11() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Blackjack: Your First Capstone Project
                    </h2>
                    <p>
                        Day 11 is a <strong>capstone project</strong>—a challenge that combines everything you've
                        learned so far into one cohesive game. Blackjack (also called 21) is perfect for this
                        because it involves lists, loops, functions, conditionals, and randomness all working together.
                    </p>
                    <p>
                        <strong>Game Rules:</strong> Get as close to 21 as possible without going over.
                        Cards 2-10 count as face value, J/Q/K count as 10, and Ace counts as 11 (or 1 if
                        you'd bust). If you go over 21, you "bust" and lose immediately.
                    </p>
                    <CodeBlock code={`# Simplified deck - each card has equal probability
# Ace starts as 11, J/Q/K all count as 10
cards = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]

# Player and dealer each get 2 cards to start
# Dealer's second card is hidden until the end`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> The deal_card() Function
                    </h2>
                    <p>
                        The core of any card game is dealing cards. We create a <code>deal_card()</code> function
                        that returns a random card from our deck using <code>random.choice()</code>.
                    </p>
                    <CodeBlock code={`import random

def deal_card():
    """Returns a random card from the deck."""
    cards = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
    card = random.choice(cards)
    return card

# Unlike random.randint(), random.choice() picks 
# from a list, so 10 appears 4 times (J, Q, K, 10)`} language="python" />
                    <p>
                        Notice the <strong>docstring</strong> (triple-quoted string) right after <code>def</code>.
                        This documents what the function does and appears in IDE hints when you hover over the function name.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> append() vs extend(): A Critical Distinction
                    </h2>
                    <p>
                        When adding cards to a player's hand, you'll use list methods. Understanding the
                        difference between <code>append()</code> and <code>extend()</code> is crucial.
                    </p>
                    <CodeBlock code={`user_cards = []
computer_cards = []

# Deal initial cards with a loop
for _ in range(2):
    user_cards.append(deal_card())
    computer_cards.append(deal_card())

# CORRECT: append() adds a single item
user_cards.append(deal_card())  # Adds one card

# WRONG: += with a non-list causes TypeError
# user_cards += deal_card()  # Error! int is not iterable

# += is shorthand for extend(), which needs a list
user_cards += [deal_card()]  # This works, but use append()`} language="python" />
                    <p>
                        <strong>Key insight:</strong> <code>append()</code> adds one item. <code>extend()</code>
                        (or <code>+=</code>) adds items from an iterable. When adding a single card, always use <code>append()</code>.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Building calculate_score()
                    </h2>
                    <p>
                        The <code>calculate_score()</code> function handles the complex scoring logic:
                        summing cards, detecting blackjack (Ace + 10 = 21), and adjusting Aces when busting.
                    </p>
                    <CodeBlock code={`def calculate_score(cards):
    """Take a list of cards and return the score."""
    # Blackjack: Ace + 10 on first two cards
    if sum(cards) == 21 and len(cards) == 2:
        return 0  # 0 represents blackjack (special case)
    
    # If Ace (11) would cause bust, convert to 1
    if 11 in cards and sum(cards) > 21:
        cards.remove(11)
        cards.append(1)
    
    return sum(cards)

# Usage
user_score = calculate_score(user_cards)
computer_score = calculate_score(computer_cards)`} language="python" />
                    <p>
                        Returning <code>0</code> for blackjack is a design choice—it makes checking for
                        blackjack easy later (<code>if score == 0</code>).
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Game State with Boolean Flags
                    </h2>
                    <p>
                        Use a boolean variable like <code>is_game_over</code> to track whether the game
                        should continue. This flag controls your main game loop.
                    </p>
                    <CodeBlock code={`is_game_over = False

while not is_game_over:
    user_score = calculate_score(user_cards)
    computer_score = calculate_score(computer_cards)
    
    print(f"Your cards: {user_cards}, score: {user_score}")
    print(f"Computer's first card: {computer_cards[0]}")
    
    # End game conditions
    if user_score == 0 or computer_score == 0 or user_score > 21:
        is_game_over = True
    else:
        user_should_deal = input("Type 'y' for another card, 'n' to pass: ")
        if user_should_deal == "y":
            user_cards.append(deal_card())
        else:
            is_game_over = True`} language="python" />
                    <p>
                        The <code>while not is_game_over</code> pattern is elegant—the loop continues
                        as long as the game is NOT over, and multiple conditions can set it to <code>True</code>.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">06.</span> Computer AI Strategy
                    </h2>
                    <p>
                        After the player's turn, the computer plays. Standard blackjack rules say the
                        dealer must draw until reaching at least 17.
                    </p>
                    <CodeBlock code={`# Computer's turn: keep drawing while under 17
# But don't draw if computer already has blackjack (0)
while computer_score != 0 and computer_score < 17:
    computer_cards.append(deal_card())
    computer_score = calculate_score(computer_cards)

print(f"Your final hand: {user_cards}, score: {user_score}")
print(f"Computer's final hand: {computer_cards}, score: {computer_score}")`} language="python" />
                    <p>
                        The condition <code>computer_score != 0</code> prevents drawing if the computer
                        has blackjack, even though 0 &lt; 17 is technically true.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">07.</span> The compare() Function
                    </h2>
                    <p>
                        Finally, compare scores to determine the winner. This function handles all
                        possible outcomes using multiple return statements.
                    </p>
                    <CodeBlock code={`def compare(user_score, computer_score):
    """Compare scores and return the result message."""
    if user_score > 21 and computer_score > 21:
        return "You went over. You lose 😤"
    if user_score == computer_score:
        return "Draw 🙃"
    elif computer_score == 0:
        return "Lose, opponent has Blackjack 😱"
    elif user_score == 0:
        return "Win with a Blackjack 😎"
    elif user_score > 21:
        return "You went over. You lose 😭"
    elif computer_score > 21:
        return "Opponent went over. You win 😁"
    elif user_score > computer_score:
        return "You win 😃"
    else:
        return "You lose 😤"

print(compare(user_score, computer_score))`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Use _ for Unused Loop Variables</h4>
                            <p className="text-sm text-surface-400">
                                When you don't need the loop variable, use <code>_</code> as a convention:
                                <code>for _ in range(2):</code> signals you only care about running twice.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Initialize Variables Before Loops</h4>
                            <p className="text-sm text-surface-400">
                                Define variables like <code>user_score = -1</code> before the loop to avoid
                                "variable undefined" warnings. Use sentinel values (like -1) that indicate errors.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Test Incrementally</h4>
                            <p className="text-sm text-surface-400">
                                Add print statements after each function to verify it works.
                                Don't wait until the end—debug as you go!
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Break Down Big Problems</h4>
                            <p className="text-sm text-surface-400">
                                Create a TODO list first: <code>deal_card()</code>, <code>calculate_score()</code>,
                                <code>compare()</code>. Tackle one function at a time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
