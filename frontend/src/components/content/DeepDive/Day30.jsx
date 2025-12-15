import React from 'react'
import CodeBlock from '../../CodeBlock'
import { AlertTriangle, FileJson, Lightbulb } from 'lucide-react'

export default function DeepDiveDay30() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-primary-400" /> Errors, Exceptions & JSON
                    </h2>
                    <p>
                        Day 30 teaches you how to handle errors gracefully using <code>try/except</code> blocks,
                        and how to work with JSON data for persistent storage.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Common Error Types
                    </h2>
                    <p>
                        Python has many built-in exception types: FileNotFoundError, KeyError, IndexError, TypeError, ZeroDivisionError.
                    </p>
                    <CodeBlock code={`# FileNotFoundError
file = open("nonexistent.txt")

# KeyError
my_dict = {"a": 1}
print(my_dict["b"])

# IndexError
my_list = [1, 2, 3]
print(my_list[5])`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> try/except/else/finally
                    </h2>
                    <p>
                        Four keywords for exception handling: try (might fail), except (if error), else (if success), finally (always runs).
                    </p>
                    <CodeBlock code={`try:
    file = open("data.txt")
except FileNotFoundError:
    print("Creating file...")
    file = open("data.txt", "w")
else:
    print("File exists!")
finally:
    file.close()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Catching Multiple Exceptions
                    </h2>
                    <CodeBlock code={`try:
    data = {"name": "Alice"}
    print(data["age"])
except KeyError as error:
    print(f"Key {error} not found")
except FileNotFoundError:
    print("File not found")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Raising Exceptions
                    </h2>
                    <CodeBlock code={`def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

try:
    result = divide(10, 0)
except ValueError as e:
    print(e)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Working with JSON
                    </h2>
                    <CodeBlock code={`import json

# Write JSON
with open("data.json", "w") as f:
    json.dump({"site": "google", "pw": "abc"}, f, indent=4)

# Read JSON  
with open("data.json", "r") as f:
    data = json.load(f)
    print(data["site"])`} language="python" />
                </section>
            </div>

            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase mb-1">Specific Exceptions</h4>
                            <p className="text-sm text-surface-400">Catch specific types, not bare except:</p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase mb-1">dump vs dumps</h4>
                            <p className="text-sm text-surface-400">dump() writes to file, dumps() returns string</p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase mb-1">.get() Safety</h4>
                            <p className="text-sm text-surface-400">Use dict.get("key") to avoid KeyError</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
