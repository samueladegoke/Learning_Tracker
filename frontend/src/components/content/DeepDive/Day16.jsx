import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Lightbulb, Cuboid, Box, Package } from 'lucide-react'

export default function DeepDiveDay16() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Cuboid className="w-6 h-6 text-primary-400" /> Object Oriented Programming (OOP)
                    </h2>
                    <p>
                        As programs grow complex, procedural programming (functions calling functions) becomes spaghetti code.
                        OOP helps us model real-world entities (like a Car or a Waiter) as self-contained "Objects" that handle their own data and logic.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Class vs Object
                    </h2>
                    <p>
                        Think of a <strong>Class</strong> as the Blueprint/Template (e.g., the architectural drawing of a car).
                        Think of an <strong>Object</strong> as the actual thing created from that blueprint (e.g., that specific red Ferrari in your driveway).
                    </p>
                    <CodeBlock code={`# Class (Blueprint)
class Car:
    pass

# Object (Instance)
my_car = Car()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Attributes & Methods
                    </h2>
                    <p>
                        Objects have two main features:
                    </p>
                    <ul className="list-disc list-inside text-surface-300 space-y-2 ml-4">
                        <li><strong>Attributes:</strong> What the object <em>has</em> (variables attached to the object).</li>
                        <li><strong>Methods:</strong> What the object <em>does</em> (functions attached to the object).</li>
                    </ul>
                    <CodeBlock code={`# Accessing Attribute
print(my_car.speed) 

# Calling Method
my_car.drive()
my_car.stop()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> The Turtle Module
                    </h2>
                    <p>
                        Python generates Objects from Classes using the `()` syntax.
                        The `turtle` module is a great way to visualize this.
                    </p>
                    <CodeBlock code={`from turtle import Turtle, Screen

# Create a new Turtle object from the Turtle class
timmy = Turtle()
timmy.shape("turtle") # Call method
timmy.color("coral")

# Create a Screen object
my_screen = Screen()
print(my_screen.canvheight) # Access attribute
my_screen.exitonclick()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> PyPi & Packages
                    </h2>
                    <p>
                        One of the biggest strengths of OOP is sharing code. You don't need to write a table-drawing library from scratch.
                        You can install packages from PyPi (Python Package Index).
                    </p>
                    <CodeBlock code={`# Setup: pip install prettytable
from prettytable import PrettyTable

table = PrettyTable()
table.add_column("Pokemon Name", ["Pikachu", "Squirtle", "Charmander"])
table.add_column("Type", ["Electric", "Water", "Fire"])

table.align = "l" # Change attribute
print(table)`} language="python" />
                </section>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 inline mr-2" /> Naming Conventions
                    </h3>
                    <div className="space-y-4">
                        <div >
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">PascalCase</h4>
                            <p className="text-sm text-surface-400">
                                Class names always use PascalCase (CapitalizeEveryWord). e.g., `PrettyTable`, `Turtle`.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div >
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">snake_case</h4>
                            <p className="text-sm text-surface-400">
                                Variables and function names use snake_case (all_lower_with_underscores). e.g., `my_turtle`, `screen_width`.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div >
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Dot Notation</h4>
                            <p className="text-sm text-surface-400">
                                The `.` is the key access point. `Object.Thing`. If `Thing` has `()`, it's a method (action). If not, it's an attribute (data).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
