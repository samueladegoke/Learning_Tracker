import CodeBlock from '../../CodeBlock'
import { Lightbulb } from 'lucide-react'

export default function DeepDiveDay9() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Loop Over Sections Here */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Dictionaries: Keys, Values, and KeyError
                    </h2>
                    <p>
                        A dictionary maps a <code>key</code> to a <code>value</code>. You look things up by key (not by index),
                        so a typo in the key leads to a <code>KeyError</code>. For defensive lookups, prefer <code>in</code>
                        checks or <code>get()</code> when a missing key should not crash your program.
                    </p>
                    <CodeBlock code={`programming_dictionary = {
    "Bug": "An error in a program that prevents it from running as expected.",
    "Function": "A piece of code you can call over and over.",
}

print(programming_dictionary["Bug"])  # ✅ works

# print(programming_dictionary["Bugg"])  # ❌ KeyError (typo)

print(programming_dictionary.get("Bugg", "<missing key>"))  # ✅ safe lookup`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Nesting: Lists in Dicts (and Dicts in Dicts)
                    </h2>
                    <p>
                        Nesting is where things get challenging: a dictionary value can itself be a list or another dictionary.
                        The key skill is to “track your type” at every bracket: dict key lookup → maybe another dict → maybe a list → list index.
                    </p>
                    <CodeBlock code={`travel_log = {
    "France": {
        "num_times_visited": 8,
        "cities_visited": ["Paris", "Lille", "Dijon"],
    },
    "Germany": {
        "num_times_visited": 5,
        "cities_visited": ["Berlin", "Hamburg", "Stuttgart"],
    },
}

# Get "Lille" (France → cities_visited → index 1)
print(travel_log["France"]["cities_visited"][1])

# Get "Stuttgart" (Germany → cities_visited → index 2)
print(travel_log["Germany"]["cities_visited"][2])`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Looping + Conditionals: Transform One Dict Into Another
                    </h2>
                    <p>
                        When you loop over a dictionary with <code>for key in my_dict</code>, you get keys. Use the key to fetch values,
                        then apply conditionals and write results into a new dictionary. This is the exact pattern behind the Day 9 “Grading Program”.
                    </p>
                    <CodeBlock code={`student_scores = {
    "Harry": 81,
    "Ron": 78,
    "Hermione": 99,
    "Draco": 74,
    "Neville": 62,
}

student_grades = {}

for student in student_scores:
    score = student_scores[student]
    if score > 90:
        student_grades[student] = "Outstanding"
    elif score > 80:
        student_grades[student] = "Exceeds Expectations"
    elif score > 70:
        student_grades[student] = "Acceptable"
    else:
        student_grades[student] = "Fail"

print(student_grades)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Secret Auction: Aggregate + Find the Max Bid
                    </h2>
                    <p>
                        The capstone challenge is combining everything: collect bids into a dictionary, control the loop with a yes/no prompt,
                        then loop over the dictionary to find the highest bid. The “hard part” is keeping your data structures and loop exit conditions clean.
                    </p>
                    <CodeBlock code={`def find_highest_bidder(bidding_dictionary):
    highest_bid = 0
    winner = ""

    for bidder in bidding_dictionary:
        bid_amount = bidding_dictionary[bidder]
        if bid_amount > highest_bid:
            highest_bid = bid_amount
            winner = bidder

    print(f"The winner is {winner} with a bid of \${highest_bid}.")


bids = {}
continue_bidding = True

while continue_bidding:
    name = input("What is your name?: ")
    price = int(input("What is your bid?: $"))
    bids[name] = price

    should_continue = input("Are there any other bidders? Type 'yes' or 'no': ").lower()
    if should_continue == "no":
        continue_bidding = False
        find_highest_bidder(bids)
    else:
        print("\\n" * 100)  # clears the screen (simple version)`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">KeyError Hygiene</h4>
                            <p className="text-sm text-surface-400">
                                If a missing key is a normal situation, use <code>my_dict.get(key)</code> or check <code>if key in my_dict</code>
                                instead of crashing your program with <code>my_dict[key]</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Track Your Types When Nesting</h4>
                            <p className="text-sm text-surface-400">
                                After each bracket, ask: “Do I have a dict or a list now?” If you’re unsure, temporarily use
                                <code>print(type(value))</code> during debugging.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Looping Over Dicts</h4>
                            <p className="text-sm text-surface-400">
                                <code>for k in d</code> loops over keys. Use <code>d.items()</code> when you need both key and value.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Normalize Inputs</h4>
                            <p className="text-sm text-surface-400">
                                Convert numeric input immediately (<code>int()</code> or <code>float()</code>) and normalize yes/no prompts
                                with <code>.lower()</code> to avoid subtle control-flow bugs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
