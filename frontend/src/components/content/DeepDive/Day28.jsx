import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Timer, Image, Clock, Palette, Play, Lightbulb } from 'lucide-react'

export default function DeepDiveDay28() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Timer className="w-6 h-6 text-primary-400" /> Pomodoro Timer & Dynamic Typing
                    </h2>
                    <p>
                        Day 28 builds a <strong>Pomodoro Timer</strong> application using Tkinter's Canvas widget
                        for images and the <code>after()</code> method for time-based events. You'll also learn about
                        Python's dynamic typing system.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Canvas Widget & Images
                    </h2>
                    <p>
                        The Canvas widget allows you to layer elements like images and text. Use <code>create_image()</code>
                        to display images and <code>create_text()</code> for overlaid text.
                    </p>
                    <CodeBlock code={`import tkinter as tk

window = tk.Tk()

# Create a canvas widget
canvas = tk.Canvas(width=200, height=224)

# Load and display an image
tomato_img = tk.PhotoImage(file="tomato.png")
canvas.create_image(100, 112, image=tomato_img)

# Add text on top of the image
timer_text = canvas.create_text(100, 130, text="00:00", 
                                fill="white", font=("Courier", 35, "bold"))
canvas.pack()

window.mainloop()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> The after() Method
                    </h2>
                    <p>
                        Unlike <code>time.sleep()</code>, which blocks the program, <code>after()</code> schedules
                        a function to run after a delay while keeping the GUI responsive.
                    </p>
                    <CodeBlock code={`# after(time_in_ms, function, *args)

def say_hello():
    print("Hello!")

# Call say_hello after 1 second (1000ms)
window.after(1000, say_hello)

# With arguments
def say_something(message):
    print(message)

window.after(1000, say_something, "Hello World!")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Building a Countdown
                    </h2>
                    <p>
                        Create a recursive countdown using <code>after()</code>. The function calls itself
                        with a decremented count until it reaches zero.
                    </p>
                    <CodeBlock code={`def count_down(count):
    # Update canvas text
    canvas.itemconfig(timer_text, text=count)
    
    if count > 0:
        # Call count_down again after 1 second
        window.after(1000, count_down, count - 1)

# Start countdown from 5 seconds
count_down(5)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Formatting Time
                    </h2>
                    <p>
                        Convert seconds to MM:SS format using division and modulo. Use math operations
                        to calculate minutes and remaining seconds.
                    </p>
                    <CodeBlock code={`def count_down(count):
    # Convert to minutes and seconds
    count_min = count // 60    # Integer division for minutes
    count_sec = count % 60     # Remainder for seconds
    
    # Format with leading zeros
    if count_sec < 10:
        count_sec = f"0{count_sec}"
    
    canvas.itemconfig(timer_text, text=f"{count_min}:{count_sec}")
    
    if count > 0:
        window.after(1000, count_down, count - 1)

# 5 minutes = 300 seconds
count_down(5 * 60)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Dynamic Typing
                    </h2>
                    <p>
                        Python is <strong>dynamically typed</strong> — variables can change type during runtime.
                        This is different from statically typed languages like Java or C++.
                    </p>
                    <CodeBlock code={`# Python allows type changes
count_sec = 59       # int
count_sec = "59"     # now it's a string - no error!

# Check type at runtime
print(type(count_sec))  # <class 'str'>

# This flexibility helps with formatting
if count_sec < 10:
    count_sec = f"0{count_sec}"  # Convert int to formatted string`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">after() vs sleep()</h4>
                            <p className="text-sm text-surface-400">
                                Never use <code>time.sleep()</code> in GUIs — it blocks the main loop. Use <code>after()</code> instead.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">itemconfig()</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>canvas.itemconfig(item_id, text=...)</code> to update canvas elements.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Cancel Timers</h4>
                            <p className="text-sm text-surface-400">
                                Store the timer ID from <code>after()</code> and use <code>after_cancel()</code> to stop it.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">PhotoImage</h4>
                            <p className="text-sm text-surface-400">
                                <code>PhotoImage</code> only supports PNG and GIF. Use <code>pillow</code> for other formats.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
