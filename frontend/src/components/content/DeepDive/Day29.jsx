import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Lock, Grid, FileText, MessageSquare, Clipboard, Lightbulb } from 'lucide-react'

export default function DeepDiveDay29() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Lock className="w-6 h-6 text-primary-400" /> Password Manager GUI
                    </h2>
                    <p>
                        Day 29 builds a <strong>Password Manager</strong> application with Tkinter. You'll learn
                        about grid layouts with <code>columnspan</code>, file I/O, dialog boxes, and clipboard management.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Grid Layout & Columnspan
                    </h2>
                    <p>
                        The <code>grid()</code> layout manager places widgets in rows and columns. Use <code>columnspan</code>
                        to make a widget span multiple columns.
                    </p>
                    <CodeBlock code={`import tkinter as tk

window = tk.Tk()

# Labels
tk.Label(text="Website:").grid(row=0, column=0)
tk.Label(text="Password:").grid(row=1, column=0)

# Entry fields
website_entry = tk.Entry(width=35)
website_entry.grid(row=0, column=1, columnspan=2)  # Spans 2 columns

password_entry = tk.Entry(width=21)
password_entry.grid(row=1, column=1)

# Button
tk.Button(text="Generate").grid(row=1, column=2)

window.mainloop()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Working with Entry Widgets
                    </h2>
                    <p>
                        Entry widgets allow text input. Use <code>get()</code> to retrieve content, <code>insert()</code>
                        to add text, and <code>delete()</code> to clear.
                    </p>
                    <CodeBlock code={`# Get the text from an Entry
website = website_entry.get()
password = password_entry.get()

# Insert text (index, text)
website_entry.insert(0, "example.com")

# Set focus (cursor) to an entry
website_entry.focus()

# Delete text (start, end) - END deletes everything
website_entry.delete(0, tk.END)
password_entry.delete(0, tk.END)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Saving Data to Files
                    </h2>
                    <p>
                        Use Python's file handling to save password data. Open with <code>'a'</code> (append) mode
                        to add new entries without overwriting.
                    </p>
                    <CodeBlock code={`def save():
    website = website_entry.get()
    password = password_entry.get()
    
    # Open file in append mode
    with open("data.txt", "a") as file:
        file.write(f"{website} | {password}\\n")
    
    # Clear the entries after saving
    website_entry.delete(0, tk.END)
    password_entry.delete(0, tk.END)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Dialog Boxes & Pop-ups
                    </h2>
                    <p>
                        The <code>messagebox</code> module provides pop-up dialogs for warnings, confirmations,
                        and information.
                    </p>
                    <CodeBlock code={`from tkinter import messagebox

# Show warning if fields are empty
if len(website) == 0 or len(password) == 0:
    messagebox.showwarning(title="Oops", message="Please fill in all fields!")
    return

# Ask for confirmation before saving
is_ok = messagebox.askokcancel(
    title=website,
    message=f"Save password: {password}?"
)

if is_ok:
    # Proceed with saving
    save_to_file()

# Show info message
messagebox.showinfo(title="Success", message="Password saved!")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Clipboard with Pyperclip
                    </h2>
                    <p>
                        The <code>pyperclip</code> module allows you to copy text to the clipboard so users can
                        paste generated passwords.
                    </p>
                    <CodeBlock code={`import pyperclip

def generate_password():
    # Generate a random password
    password = "random_password_here"
    
    # Copy to clipboard
    pyperclip.copy(password)
    
    # Insert into entry field
    password_entry.insert(0, password)
    
    # User can now paste with Ctrl+V`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">File Modes</h4>
                            <p className="text-sm text-surface-400">
                                <code>"r"</code>=read, <code>"w"</code>=write (overwrites), <code>"a"</code>=append (adds to end).
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Validation First</h4>
                            <p className="text-sm text-surface-400">
                                Always validate input before saving. Check for empty fields using <code>len()</code> or truthy checks.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Install pyperclip</h4>
                            <p className="text-sm text-surface-400">
                                Run <code>pip install pyperclip</code> to enable clipboard functionality.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">columnspan</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>columnspan=2</code> to make widgets span multiple columns in grid layout.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
