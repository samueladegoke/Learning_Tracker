import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Lightbulb, Zap, Gamepad2 } from 'lucide-react'

export default function DeepDiveDay19() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-primary-400" /> Higher-Order Functions
                    </h2>
                    <p>
                        A <strong>higher-order function</strong> is a function that takes another function as an
                        argument or returns a function. In Python, functions are <em>first-class objects</em>.
                    </p>
                    <CodeBlock code={`def add(n1, n2):
    return n1 + n2

def multiply(n1, n2):
    return n1 * n2

# Calculator is a higher-order function
def calculator(n1, n2, func):
    return func(n1, n2)

# Pass function NAME (without parentheses!)
result = calculator(2, 3, add)      # 5
result = calculator(2, 3, multiply) # 6`} language="python" />
                    <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                        <p className="text-yellow-300 text-sm">
                            ⚠️ <strong>Key Point:</strong> When passing a function as an argument, use just the
                            name <code>add</code> not <code>add()</code>. Parentheses would <em>call</em> the function immediately.
                        </p>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Event Listeners
                    </h2>
                    <p>
                        Event listeners wait for user actions (key presses, clicks) and trigger functions when
                        those events occur.
                    </p>
                    <CodeBlock code={`from turtle import Turtle, Screen

tim = Turtle()
screen = Screen()

def move_forwards():
    tim.forward(10)

# Bind the function to a key press
screen.listen()  # Start listening for events
screen.onkey(key="space", fun=move_forwards)

screen.exitonclick()`} language="python" />
                    <p className="text-surface-400 text-sm">
                        <code>screen.listen()</code> must be called before <code>onkey()</code> for event listeners to work.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Instances and State
                    </h2>
                    <p>
                        <strong>Instance</strong>: Each object created from a class is a separate instance.
                        <strong>State</strong>: The current values of an object's attributes at any moment.
                    </p>
                    <CodeBlock code={`from turtle import Turtle

# Multiple instances from same class
timmy = Turtle()
tommy = Turtle()

# Each instance has its own STATE
timmy.color("green")
tommy.color("purple")

timmy.forward(100)  # Timmy moves, Tommy stays
# They are independent!`} language="python" />
                    <p className="text-surface-400 text-sm">
                        Think of instances like people: You and I are both "human objects" but we have
                        different names, heights, and locations. Same blueprint, different state.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Etch-A-Sketch Project
                    </h2>
                    <p>
                        Control a turtle with keyboard keys using multiple event listeners:
                    </p>
                    <CodeBlock code={`from turtle import Turtle, Screen

tim = Turtle()
screen = Screen()

def move_forwards():
    tim.forward(10)

def move_backwards():
    tim.backward(10)

def turn_left():
    tim.left(10)

def turn_right():
    tim.right(10)

def clear():
    tim.clear()
    tim.penup()
    tim.home()
    tim.pendown()

screen.listen()
screen.onkey(fun=move_forwards, key="w")
screen.onkey(fun=move_backwards, key="s")
screen.onkey(fun=turn_left, key="a")
screen.onkey(fun=turn_right, key="d")
screen.onkey(fun=clear, key="c")

screen.exitonclick()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Gamepad2 className="w-6 h-6 text-primary-400" /> Turtle Race Project
                    </h2>
                    <p>
                        Create multiple turtle instances, place them at starting positions, and race them:
                    </p>
                    <CodeBlock code={`from turtle import Turtle, Screen
import random

screen = Screen()
screen.setup(width=500, height=400)

colors = ["red", "orange", "yellow", "green", "blue", "purple"]
turtles = []

# Create 6 turtle instances
y_pos = -100
for color in colors:
    new_turtle = Turtle(shape="turtle")
    new_turtle.color(color)
    new_turtle.penup()
    new_turtle.goto(x=-230, y=y_pos)
    turtles.append(new_turtle)
    y_pos += 40

# Get user bet
user_bet = screen.textinput(title="Make your bet", 
                            prompt="Which turtle will win?")

# Race loop
is_race_on = user_bet is not None
while is_race_on:
    for turtle in turtles:
        if turtle.xcor() > 230:  # Finish line
            is_race_on = False
            print(f"{turtle.pencolor()} wins!")
            break
        turtle.forward(random.randint(0, 10))

screen.exitonclick()`} language="python" />
                </section>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">No Parentheses</h4>
                            <p className="text-sm text-surface-400">
                                When passing functions as arguments, use the name only: <code>onkey(fun=move, key="w")</code>
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Keyword Arguments</h4>
                            <p className="text-sm text-surface-400">
                                For clarity, use keyword arguments with event listeners: <code>key="space"</code>
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">textinput()</h4>
                            <p className="text-sm text-surface-400">
                                <code>screen.textinput(title, prompt)</code> shows a pop-up dialog for user input.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">xcor() / ycor()</h4>
                            <p className="text-sm text-surface-400">
                                Returns the turtle's current x or y coordinate for position checks.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
