import React from 'react'
import CodeBlock from '../../CodeBlock'
import { FileText, FolderOpen, Save, HardDrive, RefreshCw } from 'lucide-react'

export default function DeepDiveDay24() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <HardDrive className="w-6 h-6 text-primary-400" /> Files & Paths
                    </h2>
                    <p>
                        Day 24 covers reading from and writing to local files using Python.
                        We also explore absolute vs. relative file paths to locate files anywhere on the system.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Opening Files
                    </h2>
                    <p>
                        The built-in <code>open()</code> function is used to access files.
                        Using the <code>with</code> keyword is best practice because it automatically closes the file even if an error occurs.
                    </p>
                    <CodeBlock code={`# Correct way (auto-closes)
with open("my_file.txt") as file:
    contents = file.read()
    print(contents)

# Old way (requires manual close)
file = open("my_file.txt")
print(file.read())
file.close()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Writing & Appending
                    </h2>
                    <p>
                        You can control the mode using the second argument:
                    </p>
                    <ul className="list-disc list-inside text-surface-300 space-y-2 ml-4">
                        <li><code>mode="r"</code>: Read (Default). Error if file doesn't exist.</li>
                        <li><code>mode="w"</code>: Write. <strong>Overwrites</strong> existing content. Creates file if missing.</li>
                        <li><code>mode="a"</code>: Append. Adds to the end. Creates file if missing.</li>
                    </ul>
                    <CodeBlock code={`with open("new_file.txt", mode="w") as file:
    file.write("New text.")  # Replaces functionality

with open("my_file.txt", mode="a") as file:
    file.write("\\nThis text is appended.")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> File Paths
                    </h2>
                    <p>
                        To access files in different folders, we use paths:
                    </p>
                    <ul className="list-disc list-inside text-surface-300 space-y-2 ml-4">
                        <li><strong>Absolute Path:</strong> From the root (e.g., <code>/Users/name/Project/data.txt</code>)</li>
                        <li><strong>Relative Path:</strong> From current working directory (e.g., <code>./data.txt</code> or <code>../data.txt</code>)</li>
                    </ul>
                    <CodeBlock code={`# Absolute path (Mac/Linux)
with open("/Users/angela/Desktop/file.txt") as f:
    ...

# Relative path (Go up one folder)
with open("../data.txt") as f:
    ...`} language="python" />
                </section>

            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">readlines()</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>file.readlines()</code> to get a <strong>list</strong> of strings, one for each line.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">stripping</h4>
                            <p className="text-sm text-surface-400">
                                Lines text files often contain <code>\n</code>. Use <code>line.strip()</code> to remove it.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Mail Merge</h4>
                            <p className="text-sm text-surface-400">
                                You can read a template file and use <code>content.replace("[name]", actual_name)</code> to generate custom letters.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
