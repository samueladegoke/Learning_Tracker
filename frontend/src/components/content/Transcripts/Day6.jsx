import React from 'react';
import { ArrowRight } from 'lucide-react';

function TranscriptsDay6() {
    return (
        <div className="space-y-8 text-surface-200 leading-relaxed max-w-4xl">

            {/* Intro */}
            <div className="p-6 bg-surface-800/30 rounded-xl border border-surface-700/50">
                <h2 className="text-xl font-semibold text-primary-400 mb-2">Defining and Calling Python Functions</h2>
                <p className="text-surface-300 italic">
                    "We're going to create our own functions. This allows us to encapsulate a specific behavior so we can use it whenever we want."
                </p>
            </div>

            {/* Key Concepts */}
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-surface-100 mb-3">1. Why Functions?</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Humans are good at creative thinking; computers are good at repetition.</li>
                        <li>Functions allow us to package instructions into a reusable block.</li>
                        <li>Example: Instead of telling a robot "Move right leg, move left leg" a thousand times, we define a function `walk()` and just say `walk()`.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-lg font-semibold text-surface-100 mb-3">2. The Syntax</h3>
                    <p className="mb-4">
                        To make a function, use the keyword <code>def</code>. It stands for "define".
                    </p>
                    <div className="bg-black/30 p-4 rounded-lg font-mono text-sm text-green-400">
                        def my_function():<br />
                        &nbsp;&nbsp;print("Hello")<br />
                        &nbsp;&nbsp;print("World")
                    </div>
                    <p className="mt-4">
                        <strong>Important:</strong> The code inside the function must be indented. This tells Python that these lines belong to the function.
                    </p>
                </section>

                <section>
                    <h3 className="text-lg font-semibold text-surface-100 mb-3">3. The While Loop</h3>
                    <p>
                        A <code>for</code> loop is great when you want to iterate over a list or a known range. But what if you don't know when to stop?
                        For example, in <strong>Reeborg's World</strong>, we might not know how far the wall is.
                    </p>
                    <div className="bg-black/30 p-4 rounded-lg font-mono text-sm text-green-400 mt-3">
                        while not at_goal():<br />
                        &nbsp;&nbsp;jump()<br />
                        &nbsp;&nbsp;move()
                    </div>
                    <p className="mt-2 text-surface-300">
                        This tells the robot: "Keep doing this <em>while</em> you haven't reached the goal yet."
                    </p>
                </section>

                <section>
                    <h3 className="text-lg font-semibold text-surface-100 mb-3">4. Indentation: Tabs vs Spaces</h3>
                    <p>
                        In Python, indentation is not just for style—it's structural. The official Python Style Guide (PEP 8) recommends using <strong>4 spaces</strong> per indentation level.
                    </p>
                    <blockquote className="border-l-4 border-primary-500 pl-4 my-2 italic text-surface-400">
                        "Spaces are the preferred indentation method... Python 3 disallows mixing the use of tabs and spaces for indentation."
                    </blockquote>
                    <p className="text-sm text-surface-400">
                        So beware! Mixing them will cause an <code className="text-red-400">IndentationError</code>.
                    </p>
                </section>
            </div>

            {/* Project */}
            <section className="pt-6 border-t border-surface-700">
                <h3 className="text-xl font-bold text-primary-400 mb-4">Project: Escaping the Maze</h3>
                <p className="mb-4">
                    The goal is to navigate Reeborg through a random maze. The secret strategy? <strong>Follow the right edge.</strong>
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-surface-800/50 p-6 rounded-lg border border-surface-700">
                        <h4 className="font-semibold text-surface-100 mb-3">The Algorithm</h4>
                        <ol className="list-decimal pl-5 space-y-2 text-sm text-surface-300">
                            <li><span className="text-primary-300">While</span> not at goal:</li>
                            <li><span className="text-blue-300">If</span> right is clear <ArrowRight className="w-4 h-4 text-surface-400 inline mx-1" /> Turn right and move.</li>
                            <li><span className="text-blue-300">Elif</span> front is clear <ArrowRight className="w-4 h-4 text-surface-400 inline mx-1" /> Move forward.</li>
                            <li><span className="text-blue-300">Else</span> <ArrowRight className="w-4 h-4 text-surface-400 inline mx-1" /> Turn left (wall is blocking both right and front).</li>
                        </ol>
                    </div>
                    <div className="bg-surface-800/50 p-6 rounded-lg border border-surface-700">
                        <h4 className="font-semibold text-surface-100 mb-3">The Infinite Loop Edge Case</h4>
                        <p className="text-sm text-surface-300 mb-2">
                            If the robot starts in an open space with no walls nearby, it might spin in circles forever because "right is always clear".
                        </p>
                        <p className="text-sm font-medium text-amber-400">
                            Fix: Move forward until you hit a wall <em>before</em> starting the main loop!
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default TranscriptsDay6;
