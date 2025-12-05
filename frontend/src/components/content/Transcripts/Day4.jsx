export default function TranscriptsDay4() {
    return (
        <div className="space-y-4">
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group" open>
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    1. Random Module & Pseudorandom Numbers
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Computers are deterministic—they perform repeatable actions predictably. Python uses the Mersenne Twister
                    algorithm to generate <em>pseudorandom</em> numbers via the <code>random</code> module.
                    Use <code>random.randint(a, b)</code> for integers or <code>random.random()</code> for floats 0–1.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    2. Creating and Importing Modules
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Modules split code into reusable pieces. Create <code>my_module.py</code> with variables/functions,
                    then <code>import my_module</code> in your main file. Access items via <code>my_module.item_name</code>.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    3. Python Lists: Data Structures
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Lists store ordered, related data in square brackets: <code>["Cherry", "Apple", "Pear"]</code>.
                    Items can be any type, even mixed. Lists maintain order and allow duplicates.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    4. List Indexing & the Offset Concept
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Think of indices as <em>offsets from the start</em>. First item is at 0 (no offset). Use negative
                    indices to count from the end: <code>[-1]</code> is the last item. Access with <code>list[index]</code>.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    5. Modifying Lists
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Lists are mutable: assign new values with <code>list[i] = new_value</code>.
                    Add items with <code>.append(item)</code> or <code>.extend([items])</code>.
                    Programming is like an open-book exam—use documentation instead of memorizing!
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    6. Day 4 Project: Rock Paper Scissors
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Use <code>random.randint(0, 2)</code> for computer choice (0=Rock, 1=Paper, 2=Scissors).
                    Compare user input with computer choice using conditionals to determine winner.
                    Add ASCII art for visual fun!
                </div>
            </details>
        </div>
    )
}
