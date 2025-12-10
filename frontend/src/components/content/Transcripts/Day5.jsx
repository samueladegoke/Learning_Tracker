import { ChevronDown } from 'lucide-react'

export default function TranscriptsDay5() {
    return (
        <div className="space-y-4">
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group" open>
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    1. Using the for loop with Python Lists
                    <ChevronDown className="w-4 h-4 text-surface-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    A for loop iterates through a list, assigning each item to a variable name you choose.
                    Inside the loop (indented), you can perform actions on that variable.
                    Once the list is exhausted, the loop ends.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    2. The range() function
                    <ChevronDown className="w-4 h-4 text-surface-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    <code>range(start, stop, step)</code> is useful for generating number sequences.
                    Use it to loop a specific number of times, or to iterate over indices if needed (though direct list iteration is preferred).
                    Gauss Challenge: Calculate sum of 1 to 100 using range.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    3. Day 5 Project: Create a Password Generator
                    <ChevronDown className="w-4 h-4 text-surface-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Create a program that asks for number of letters, symbols, and numbers, then generates a random password.
                    Easy Level: Append random characters in order.
                    Hard Level: Shuffle the final list of characters to make it truly random.
                </div>
            </details>
        </div>
    )
}
