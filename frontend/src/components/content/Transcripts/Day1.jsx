import { ChevronDown } from 'lucide-react'

export default function TranscriptsDay1() {
    return (
        <div className="space-y-4 max-w-3xl">
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    1. What you're going to get from this course
                    <ChevronDown className="w-4 h-4 text-surface-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Hello and welcome to the world's best Python bootcamp! My name is Angela...
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    2. Python Variables
                    <ChevronDown className="w-4 h-4 text-surface-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Variables are like a box with a name label. You can store data in it and retrieve it later using the name.
                    <br /><br />
                    Example: <code>name = "Jack"</code>
                </div>
            </details>
            <details className="bg-surface-800/30 rounded-xl border border-surface-700 overflow-hidden group">
                <summary className="p-4 cursor-pointer font-medium text-surface-200 hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                    3. Variable Naming
                    <ChevronDown className="w-4 h-4 text-surface-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 pt-0 text-surface-400 text-sm leading-relaxed border-t border-surface-700/50 mt-2">
                    Make your code readable. Use descriptive names.
                    <br />
                    Bad: <code>n = "Angela"</code>
                    <br />
                    Good: <code>name = "Angela"</code>
                    <br />
                    Separate words with underscores: <code>user_name</code>.
                </div>
            </details>
        </div>
    )
}
