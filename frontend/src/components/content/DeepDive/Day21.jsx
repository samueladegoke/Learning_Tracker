import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Layers, Scissors, ArrowUpCircle, Ghost } from 'lucide-react'

export default function DeepDiveDay21() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Ghost className="w-6 h-6 text-primary-400" /> Snake Game Part 2
                    </h2>
                    <p>
                        In Part 2 of the Snake Game, we introduce <strong>Class Inheritance</strong> to create the Food and Scoreboard classes,
                        and use <strong>List Slicing</strong> to handle collision detection with the snake's tail.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Class Inheritance
                    </h2>
                    <p>
                        Inheritance allows a class (Generic) to derive methods and attributes from another class (Parent).
                        This promotes code reuse and cleaner architecture.
                    </p>
                    <CodeBlock code={`class Animal:
    def __init__(self):
        self.num_eyes = 2

    def breathe(self):
        print("Inhale, exhale.")

class Fish(Animal):  # Fish inherits from Animal
    def swim(self):
        print("moving in water.")

nemo = Fish()
nemo.swim()
nemo.breathe()      # Inherited from Animal
print(nemo.num_eyes) # 2 (Inherited)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> The super() Keyword
                    </h2>
                    <p>
                        When defining an <code>__init__</code> method in a subclass, you often want to initialize the parent class too.
                        The <code>super()</code> function allows you to call methods from the parent class.
                    </p>
                    <CodeBlock code={`class Fish(Animal):
    def __init__(self):
        super().__init__()  # Initialize the superclass (Animal)
        
    def breathe(self):
        super().breathe()   # Do what Animal does...
        print("doing this underwater.") # ...then add extra functionality`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> List Slicing
                    </h2>
                    <p>
                        Slicing allows you to grab a specific section of a list (or tuple/string).
                        The syntax is <code>list[start:stop:step]</code>.
                    </p>
                    <ul className="list-disc list-inside text-surface-300 space-y-2 ml-4">
                        <li><code>[start:end]</code> – items from index start to end (excluding end)</li>
                        <li><code>[:5]</code> – from beginning to index 5</li>
                        <li><code>[2:]</code> – from index 2 to the end</li>
                        <li><code>[::2]</code> – every second item</li>
                        <li><code>[::-1]</code> – reverse the list</li>
                    </ul>
                    <CodeBlock code={`piano_keys = ["a", "b", "c", "d", "e", "f", "g"]

print(piano_keys[2:5])   # ['c', 'd', 'e']
print(piano_keys[2:])    # ['c', 'd', 'e', 'f', 'g']
print(piano_keys[:5])    # ['a', 'b', 'c', 'd', 'e']
print(piano_keys[::2])   # ['a', 'c', 'e', 'g']
print(piano_keys[::-1])  # ['g', 'f', 'e', 'd', 'c', 'b', 'a']`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Applied: Recursion in Snake
                    </h2>
                    <p>
                        We use inheritance for the <code>Food</code> class so it happens to be a Turtle and can render itself!
                    </p>
                    <CodeBlock code={`from turtle import Turtle
import random

class Food(Turtle):  # Inherit from Turtle
    def __init__(self):
        super().__init__()
        self.shape("circle")
        self.penup()
        self.shapesize(stretch_len=0.5, stretch_wid=0.5)
        self.color("blue")
        self.speed("fastest")
        self.refresh()

    def refresh(self):
        random_x = random.randint(-280, 280)
        random_y = random.randint(-280, 280)
        self.goto(random_x, random_y)`} language="python" />
                </section>

            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <ArrowUpCircle className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">super().__init__()</h4>
                            <p className="text-sm text-surface-400">
                                Always call this if you override <code>__init__</code> but still need the parent's setup code.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Tail Collision</h4>
                            <p className="text-sm text-surface-400">
                                Use slicing <code>segments[1:]</code> to check collision with everything <em>except</em> the head.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Class Structure</h4>
                            <p className="text-sm text-surface-400">
                                Inherit from <code>Turtle</code> for things that appear on screen (Food, Scoreboard) to gain methods like <code>goto()</code> and <code>write()</code>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
