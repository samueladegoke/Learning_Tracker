import CodeBlock from '../../CodeBlock'
import { Lightbulb, AppWindow, Layout, Palette, MousePointer, Package } from 'lucide-react'

export default function DeepDiveDay85() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Tkinter GUI */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <AppWindow className="w-6 h-6 text-primary-400" /> Building Desktop Apps
                    </h2>
                    <p>
                        <strong>Tkinter</strong> is Python's built-in GUI library. It's perfect for creating simple desktop applications without external dependencies.
                    </p>
                    <CodeBlock
                        code={`import tkinter as tk
from tkinter import ttk, messagebox

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("My Portfolio App")
        self.root.geometry("400x300")
        
        # Create widgets
        self.label = ttk.Label(root, text="Enter your name:")
        self.label.pack(pady=10)
        
        self.entry = ttk.Entry(root, width=30)
        self.entry.pack(pady=5)
        
        self.button = ttk.Button(root, text="Greet", command=self.greet)
        self.button.pack(pady=10)
    
    def greet(self):
        name = self.entry.get()
        messagebox.showinfo("Hello", f"Hello, {name}!")

if __name__ == "__main__":
    root = tk.Tk()
    app = App(root)
    root.mainloop()`}
                        language="python"
                    />
                </section>

                {/* Section 2: Layout Management */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Layout className="w-6 h-6 text-primary-400" /> Layout Managers
                    </h2>
                    <p>
                        Tkinter offers three layout managers: <code>pack()</code>, <code>grid()</code>, and <code>place()</code>. Grid is most flexible for complex UIs.
                    </p>
                    <CodeBlock
                        code={`# Grid layout example
frame = ttk.Frame(root, padding=20)
frame.grid(row=0, column=0, sticky="nsew")

# Row 0: Labels
ttk.Label(frame, text="Username:").grid(row=0, column=0, sticky="w")
ttk.Label(frame, text="Password:").grid(row=1, column=0, sticky="w")

# Row 0-1: Entry fields
ttk.Entry(frame).grid(row=0, column=1, padx=5, pady=5)
ttk.Entry(frame, show="*").grid(row=1, column=1, padx=5, pady=5)

# Row 2: Buttons spanning 2 columns
ttk.Button(frame, text="Login").grid(row=2, column=0, columnspan=2, pady=10)`}
                        language="python"
                    />
                </section>

                {/* Section 3: Styling */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <Palette className="w-6 h-6 text-primary-400" /> Theming & Styling
                    </h2>
                    <p>
                        Use ttk themes and custom styles to create modern-looking applications.
                    </p>
                    <CodeBlock
                        code={`from tkinter import ttk

# Set a modern theme
style = ttk.Style()
style.theme_use("clam")  # Options: clam, alt, default, classic

# Custom button style
style.configure("Custom.TButton",
                foreground="white",
                background="#4CAF50",
                font=("Helvetica", 12, "bold"),
                padding=10)

# Apply custom style
button = ttk.Button(root, text="Styled Button", style="Custom.TButton")`}
                        language="python"
                    />
                </section>

                {/* Section 4: Event Handling */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <MousePointer className="w-6 h-6 text-primary-400" /> Event Handling
                    </h2>
                    <p>
                        Bind keyboard and mouse events to create interactive applications.
                    </p>
                    <CodeBlock
                        code={`# Keyboard binding
def on_enter(event):
    print("Enter pressed!")
    process_input()

root.bind("<Return>", on_enter)
root.bind("<Escape>", lambda e: root.quit())

# Mouse events
canvas.bind("<Button-1>", on_left_click)  # Left click
canvas.bind("<B1-Motion>", on_drag)       # Drag

# Menu bar
menubar = tk.Menu(root)
file_menu = tk.Menu(menubar, tearoff=0)
file_menu.add_command(label="Open", command=open_file)
file_menu.add_command(label="Save", command=save_file)
file_menu.add_separator()
file_menu.add_command(label="Exit", command=root.quit)
menubar.add_cascade(label="File", menu=file_menu)
root.config(menu=menubar)`}
                        language="python"
                    />
                </section>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1"><Package className="w-4 h-4 inline" /> Packaging</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>pyinstaller</code> to create standalone .exe files that users can run without Python installed.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Threading</h4>
                            <p className="text-sm text-surface-400">
                                Long operations freeze the UI. Use <code>threading</code> to run tasks in the background.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Portfolio Ideas</h4>
                            <p className="text-sm text-surface-400">
                                Password manager, to-do list, calculator, text editor, Pomodoro timer, quiz app.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
