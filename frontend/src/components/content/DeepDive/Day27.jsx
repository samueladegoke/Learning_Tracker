import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Layout, Settings, Asterisk, Code, MousePointerClick, Lightbulb } from 'lucide-react'

export default function DeepDiveDay27() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Layout className="w-6 h-6 text-primary-400" /> Tkinter, *args & **kwargs
                    </h2>
                    <p>
                        Day 27 introduces <strong>Tkinter</strong>, Python's built-in GUI library, along with powerful
                        function argument techniques: <code>*args</code> for unlimited positional arguments and
                        <code>**kwargs</code> for unlimited keyword arguments.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Introduction to Tkinter
                    </h2>
                    <p>
                        Tkinter (Tk interface) is Python's standard GUI library. It provides widgets like windows,
                        labels, buttons, and text inputs. Every Tkinter app starts with a root window.
                    </p>
                    <CodeBlock code={`import tkinter as tk

# Create the main window
window = tk.Tk()
window.title("My First GUI")
window.minsize(width=500, height=300)

# Create a label widget
my_label = tk.Label(text="Hello, Tkinter!", font=("Arial", 24))
my_label.pack()  # Display the widget

# Start the event loop
window.mainloop()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Default Argument Values
                    </h2>
                    <p>
                        Functions can have parameters with default values. These become optional when calling
                        the function — if not provided, the default is used.
                    </p>
                    <CodeBlock code={`def greet(name, location="World"):
    print(f"Hello {name} from {location}!")

greet("Angela")              # Hello Angela from World!
greet("Angela", "London")    # Hello Angela from London!

# Default values must come AFTER required params
def create_profile(name, age=25, city="Unknown"):
    return {"name": name, "age": age, "city": city}`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> *args: Unlimited Positional Arguments
                    </h2>
                    <p>
                        The <code>*args</code> syntax collects any number of positional arguments into a <strong>tuple</strong>.
                        This is useful when you don't know how many arguments will be passed.
                    </p>
                    <CodeBlock code={`def add(*args):
    """Add any number of values together"""
    print(type(args))  # <class 'tuple'>
    return sum(args)

print(add(1, 2, 3))          # 6
print(add(5, 10, 15, 20))    # 50

# Loop through args
def print_all(*args):
    for item in args:
        print(item)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> **kwargs: Unlimited Keyword Arguments
                    </h2>
                    <p>
                        The <code>**kwargs</code> syntax collects keyword arguments into a <strong>dictionary</strong>.
                        This is how Tkinter accepts its many optional configuration options.
                    </p>
                    <CodeBlock code={`def calculate(n, **kwargs):
    """Use named arguments from kwargs dict"""
    print(type(kwargs))  # <class 'dict'>
    
    n += kwargs["add"]
    n *= kwargs["multiply"]
    return n

result = calculate(2, add=3, multiply=5)
print(result)  # (2 + 3) * 5 = 25

# Loop through kwargs
for key, value in kwargs.items():
    print(f"{key}: {value}")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Tkinter Widgets & Events
                    </h2>
                    <p>
                        Common widgets include <code>Label</code>, <code>Button</code>, and <code>Entry</code>.
                        Buttons can trigger functions using the <code>command</code> parameter.
                    </p>
                    <CodeBlock code={`import tkinter as tk

window = tk.Tk()

# Entry widget for text input
input_field = tk.Entry(width=30)
input_field.pack()

# Button with command callback
def button_clicked():
    text = input_field.get()  # Get entry content
    my_label.config(text=text)

my_button = tk.Button(text="Click Me", command=button_clicked)
my_button.pack()

my_label = tk.Label(text="Waiting...")
my_label.pack()

window.mainloop()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">06.</span> Layout Managers
                    </h2>
                    <p>
                        Tkinter offers three layout managers: <code>pack()</code> for simple stacking,
                        <code>place()</code> for absolute positioning, and <code>grid()</code> for table-like layouts.
                    </p>
                    <CodeBlock code={`# pack() - Stack widgets vertically or horizontally
label.pack(side="left")  # or "right", "top", "bottom"

# place() - Absolute x, y coordinates
label.place(x=100, y=50)

# grid() - Row and column positioning (recommended)
label.grid(row=0, column=0)
entry.grid(row=0, column=1)
button.grid(row=1, column=1)

# Combine with padding for spacing
button.grid(row=1, column=0, padx=10, pady=5)`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">*args vs **kwargs</h4>
                            <p className="text-sm text-surface-400">
                                <code>*args</code> = tuple of positional args. <code>**kwargs</code> = dict of keyword args.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Use .get() Safely</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>kwargs.get("key")</code> instead of <code>kwargs["key"]</code> to avoid KeyError if missing.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Grid is Best</h4>
                            <p className="text-sm text-surface-400">
                                For complex layouts, <code>grid()</code> is recommended. Don't mix pack and grid in the same container.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">mainloop()</h4>
                            <p className="text-sm text-surface-400">
                                Always end with <code>window.mainloop()</code> — it keeps the window open and listens for events.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
