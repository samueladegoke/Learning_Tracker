import React from 'react';
import CodeBlock from '../../CodeBlock'
import { ChevronRight } from 'lucide-react';

function DeepDiveDay6() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Section 1: Defining Functions */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Defining Functions
                    </h2>
                    <p>
                        A <strong>function</strong> is a block of code that performs a specific task. You can think of it as a mini-program within your program.
                        Instead of writing the same code over and over, you define a function once and "call" it whenever you need it.
                    </p>
                    <div className="bg-surface-800/50 border-l-4 border-primary-500 p-4 rounded-r-lg">
                        <p className="font-semibold text-primary-200 mb-2">Syntax:</p>
                        <code className="text-sm block text-surface-300">
                            def function_name():<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;# Do something<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;# Do something else
                        </code>
                    </div>
                    <p>
                        We use the <code>def</code> keyword to define a function, followed by the name, parentheses <code>()</code>, and a colon <code>:</code>.
                        Everything inside the function must be <strong>indented</strong>.
                    </p>
                    <CodeBlock code={`def my_function():\n    print("Hello")\n    print("Bye")\n\nmy_function()`} language="python" />
                </section>

                {/* Section 2: Calling Functions */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Calling Functions
                    </h2>
                    <p>
                        Defining a function doesn't run it. To execute the code inside, you must <strong>call</strong> (or invoke) the function by using its name followed by parentheses.
                    </p>
                    <CodeBlock code={`# This does nothing visible yet\ndef greet():\n    print("Hello there!")\n\n# This runs the code\ngreet()`} language="python" />
                </section>

                {/* Section 3: The While Loop */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> The While Loop
                    </h2>
                    <p>
                        A <code>while</code> loop continues to run <strong>as long as</strong> a specific condition is true. Be careful—if the condition never becomes false, you'll create an infinite loop!
                    </p>
                    <CodeBlock code={`number_of_hurdles = 6\nwhile number_of_hurdles > 0:\n    jump()\n    number_of_hurdles -= 1\n    print(number_of_hurdles)`} language="python" />
                </section>

                {/* Section 4: Karel & The Maze */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Thinking Like a Robot
                    </h2>
                    <p>
                        In <strong>Reeborg's World</strong>, complex movements are built from simple commands.
                        To escape the maze, we use the <strong>Right-Hand Rule</strong>:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-surface-300">
                        <li>Imagine placing your right hand on the wall.</li>
                        <li>Follow the wall forever, and you will eventually find the exit (unless it's an island!).</li>
                    </ul>
                    <div className="bg-surface-800/50 border-l-4 border-amber-500 p-4 rounded-r-lg mt-4">
                        <p className="font-semibold text-amber-200 mb-2">The Infinite Loop Trap</p>
                        <p className="text-sm text-surface-300">
                            If your robot starts in the middle of a room with no walls, following the right side might make it spin in circles forever if you aren't careful.
                            <strong>Always find a wall first!</strong>
                        </p>
                    </div>
                </section>

            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <div className="bg-surface-800/50 p-6 rounded-xl border border-surface-700">
                    <h3 className="text-lg font-semibold text-primary-400 mb-4">Pro Tips</h3>
                    <ul className="space-y-3 text-sm text-surface-300">
                        <li className="flex gap-2">
                            <ChevronRight className="w-4 h-4 text-primary-400 inline mr-1" />
                            <span><strong>Naming:</strong> Use <code>snake_case</code> for function names.</span>
                        </li>
                        <li className="flex gap-2">
                            <ChevronRight className="w-4 h-4 text-primary-400 inline mr-1" />
                            <span><strong>Don't Repeat Yourself (DRY):</strong> If you copy-paste code 3 times, make it a function.</span>
                        </li>
                        <li className="flex gap-2">
                            <ChevronRight className="w-4 h-4 text-primary-400 inline mr-1" />
                            <span><strong>Indentation:</strong> Python relies on spaces. Use <strong className="text-white">4 spaces</strong> (not tabs!).</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default DeepDiveDay6;
