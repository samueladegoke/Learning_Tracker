import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Layers, Timer, FileText, Save, Lightbulb } from 'lucide-react'

export default function DeepDiveDay31() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Layers className="w-6 h-6 text-primary-400" /> Flash Card App Capstone
                    </h2>
                    <p>
                        Day 31 is a <strong>capstone project</strong> where you build a complete Flash Card application
                        using Tkinter. This project combines everything you've learned: canvas widgets, the after() method,
                        CSV data handling with pandas, and JSON for saving progress.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Canvas Image Handling
                    </h2>
                    <p>
                        The flash card UI uses <code>Canvas</code> to display card images with text overlaid.
                        Use <code>create_image()</code> to place PNG images and <code>create_text()</code> for the word.
                    </p>
                    <CodeBlock code={`import tkinter as tk

window = tk.Tk()
canvas = tk.Canvas(width=800, height=526)

# Load card images
card_front = tk.PhotoImage(file="images/card_front.png")
card_back = tk.PhotoImage(file="images/card_back.png")

# Display front card
card_bg = canvas.create_image(400, 263, image=card_front)
card_title = canvas.create_text(400, 150, text="French", font=("Arial", 40, "italic"))
card_word = canvas.create_text(400, 263, text="partie", font=("Arial", 60, "bold"))

canvas.pack()
window.mainloop()`} language="python" />
                    <p>
                        <code>PhotoImage</code> loads image files. The image reference must be kept alive (usually stored in a variable)
                        or it will be garbage collected and disappear.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Loading CSV Data with Pandas
                    </h2>
                    <p>
                        The flash cards come from a CSV file containing word pairs. Use <code>pandas</code> to load
                        and convert it to a list of dictionaries for easy random selection.
                    </p>
                    <CodeBlock code={`import pandas as pd

# Load vocabulary from CSV
data = pd.read_csv("data/french_words.csv")

# Convert to list of dictionaries
to_learn = data.to_dict(orient="records")
# Result: [{"French": "partie", "English": "part"}, ...]

# Pick a random card
import random
current_card = random.choice(to_learn)
print(current_card["French"])  # The word to display`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Flip Animation with after()
                    </h2>
                    <p>
                        Use <code>window.after()</code> to schedule the card flip after a delay. This creates
                        the effect of showing the front, waiting 3 seconds, then revealing the answer.
                    </p>
                    <CodeBlock code={`flip_timer = None

def next_card():
    global current_card, flip_timer
    # Cancel any pending flip
    if flip_timer:
        window.after_cancel(flip_timer)
    
    current_card = random.choice(to_learn)
    canvas.itemconfig(card_bg, image=card_front)
    canvas.itemconfig(card_title, text="French", fill="black")
    canvas.itemconfig(card_word, text=current_card["French"], fill="black")
    
    # Schedule flip after 3 seconds
    flip_timer = window.after(3000, flip_card)

def flip_card():
    canvas.itemconfig(card_bg, image=card_back)
    canvas.itemconfig(card_title, text="English", fill="white")
    canvas.itemconfig(card_word, text=current_card["English"], fill="white")`} language="python" />
                    <p>
                        <code>after_cancel()</code> is crucial — it prevents multiple timers from stacking
                        if the user clicks "next" before the flip happens.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Saving Progress to JSON/CSV
                    </h2>
                    <p>
                        When the user marks a word as "known," remove it from the list and save the remaining
                        words. Use <code>try/except</code> to load saved progress on startup.
                    </p>
                    <CodeBlock code={`SAVE_FILE = "data/words_to_learn.csv"

def is_known():
    # Remove current card from to_learn list
    to_learn.remove(current_card)
    
    # Save remaining words to CSV
    remaining = pd.DataFrame(to_learn)
    remaining.to_csv(SAVE_FILE, index=False)
    
    next_card()

# On startup, try to load saved progress
try:
    data = pd.read_csv(SAVE_FILE)
except FileNotFoundError:
    data = pd.read_csv("data/french_words.csv")

to_learn = data.to_dict(orient="records")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Button Commands
                    </h2>
                    <p>
                        Two buttons control the flow: a ✓ (known) button and a ✗ (unknown/next) button.
                        Both use <code>PhotoImage</code> for their icons.
                    </p>
                    <CodeBlock code={`# Load button images
check_image = tk.PhotoImage(file="images/right.png")
cross_image = tk.PhotoImage(file="images/wrong.png")

# Create buttons
known_button = tk.Button(image=check_image, highlightthickness=0, command=is_known)
unknown_button = tk.Button(image=cross_image, highlightthickness=0, command=next_card)

# Layout
unknown_button.grid(row=1, column=0)
known_button.grid(row=1, column=1)`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Keep Image References</h4>
                            <p className="text-sm text-surface-400">
                                Store <code>PhotoImage</code> objects in variables. If they go out of scope, Python garbage collects them and images disappear!
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Cancel Pending Timers</h4>
                            <p className="text-sm text-surface-400">
                                Always use <code>after_cancel()</code> before scheduling a new timer to prevent timer stacking bugs.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">to_dict(orient="records")</h4>
                            <p className="text-sm text-surface-400">
                                This pandas method converts a DataFrame to a list of dicts — perfect for random.choice() selection.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Graceful File Fallback</h4>
                            <p className="text-sm text-surface-400">
                                Use try/except for file loading. Fall back to original data if saved progress doesn't exist.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
