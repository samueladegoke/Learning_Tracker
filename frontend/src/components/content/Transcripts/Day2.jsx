export default function TranscriptsDay2() {
    return (
        <div className="space-y-4 max-w-3xl">
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    1. Python Primitive Data Types
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Integers, floats, booleans, and strings each store data differently. Use <code>type()</code> to inspect values,
                    and remember that quotes instantly turn numbers into strings.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    2. Type Errors and Conversion
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Mixing strings with ints in math triggers <code>TypeError</code>. Convert with <code>int()</code>, <code>float()</code>, or <code>str()</code>
                    before concatenating or calculating.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    3. Number Manipulation & F-Strings
                    <span className="text-surface-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Use math operators (<code>**</code>, <code>//</code>, <code>%</code>) and PEMDAS to shape calculations. F-strings make it easy to
                    embed values and format decimals (e.g., <code>{'{value:.2f}'}</code> for money).
                </div>
            </details>
        </div>
    )
}
