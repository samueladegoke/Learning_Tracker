import { ChevronDown } from 'lucide-react'

export default function TranscriptsDay3() {
    return (
        <div className="space-y-4 max-w-3xl">
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    1. Control Flow with if/else
                    <ChevronDown className="w-4 h-4 text-surface-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Think of a bathtub overflow mechanism—when water reaches above 80cm, it drains; otherwise, it keeps filling.
                    This conditional logic is represented with <code>if</code> and <code>else</code> statements. The key syntax:
                    the <code>if</code> keyword, a condition, a colon, and indented code blocks.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    2. The Modulo Operator
                    <ChevronDown className="w-4 h-4 text-surface-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    The modulo operator (<code>%</code>) gives the remainder after division. <code>10 % 5 = 0</code> (divides evenly),
                    <code>10 % 3 = 1</code> (remainder 1). Classic use: checking if a number is even (<code>num % 2 == 0</code>) or odd.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    3. Nested if and elif Statements
                    <ChevronDown className="w-4 h-4 text-surface-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Use <code>elif</code> (else-if) to check multiple conditions. First matching condition wins.
                    Nested if statements let you check conditions inside other conditions—like checking age-based pricing
                    only after confirming height requirements.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    4. Multiple If Statements
                    <ChevronDown className="w-4 h-4 text-surface-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Unlike <code>if/elif/else</code> where only ONE branch runs, multiple separate <code>if</code> statements
                    are each checked independently. Use this when you need to check conditions that aren't mutually exclusive—
                    like adding photo costs after determining ticket price.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    5. Logical Operators (and, or, not)
                    <ChevronDown className="w-4 h-4 text-surface-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Combine conditions: <code>and</code> requires both to be True, <code>or</code> requires at least one,
                    <code>not</code> reverses the condition. Example: <code>age {'>'}= 45 and age {'<'}= 55</code> catches the
                    "midlife crisis" age range for special pricing.
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    6. Day 3 Project: Treasure Island
                    <ChevronDown className="w-4 h-4 text-surface-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Build a "Choose Your Own Adventure" game! Ask players to go left or right, swim or wait for a boat,
                    and choose between colored doors. Use <code>.lower()</code> to handle case variations in input.
                    ASCII art makes it fun—find creative art at ascii.co.uk/art!
                </div>
            </details>
        </div>
    )
}
