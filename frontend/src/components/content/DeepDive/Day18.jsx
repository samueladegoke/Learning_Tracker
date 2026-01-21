import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Lightbulb, Palette } from 'lucide-react'

export default function DeepDiveDay18() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Palette className="w-6 h-6 text-primary-400" /> Turtle Graphics Basics
                    </h2>
                    <p>
                        The <code>turtle</code> module lets you create graphics by controlling a
                        virtual "turtle" that draws lines as it moves. Import <code>Turtle</code> and
                        <code>Screen</code> classes to get started.
                    </p>
                    <CodeBlock code={`from turtle import Turtle, Screen

# Create a turtle object
timmy = Turtle()
timmy.shape("turtle")  # Options: arrow, turtle, circle, square, triangle
timmy.color("red")

# Create screen and keep window open
screen = Screen()
screen.exitonclick()  # Window closes on click`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Movement Commands
                    </h2>
                    <p>Control your turtle with these movement methods:</p>
                    <CodeBlock code={`# Move forward/backward by distance (pixels)
timmy.forward(100)
timmy.backward(50)

# Turn left/right by angle (degrees)
timmy.right(90)   # Turn 90° clockwise
timmy.left(45)    # Turn 45° counter-clockwise

# Go to specific coordinates
timmy.goto(0, 0)  # Go to center

# Control pen
timmy.penup()     # Stop drawing
timmy.pendown()   # Start drawing
timmy.pensize(5)  # Set line thickness`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Colors and RGB Tuples
                    </h2>
                    <p>
                        You can use color names or RGB tuples. For RGB, set colormode to 255.
                    </p>
                    <CodeBlock code={`from turtle import Turtle, Screen

screen = Screen()
screen.colormode(255)  # Enable RGB mode

timmy = Turtle()

# Method 1: Color names
timmy.color("coral")  # Use Tkinter color names

# Method 2: RGB tuples (requires colormode 255)
timmy.color(255, 100, 50)  # RGB values 0-255

# Generate random colors
import random
def random_color():
    r = random.randint(0, 255)
    g = random.randint(0, 255)
    b = random.randint(0, 255)
    return (r, g, b)

timmy.color(random_color())`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Python Tuples
                    </h2>
                    <p>
                        A <strong>tuple</strong> is like a list but <em>immutable</em> (cannot be changed after creation).
                        Use parentheses <code>()</code> instead of brackets.
                    </p>
                    <CodeBlock code={`# Create a tuple
my_tuple = (1, 2, 3)

# Access elements (same as list)
print(my_tuple[0])  # 1

# Tuples are IMMUTABLE - this will error:
# my_tuple[0] = 10  # TypeError!

# Common use: RGB colors
red = (255, 0, 0)
green = (0, 255, 0)
blue = (0, 0, 255)

# Unpack a tuple
r, g, b = red
print(r)  # 255`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Drawing Challenge: Spirograph
                    </h2>
                    <p>
                        Create a spirograph by drawing circles at different angles:
                    </p>
                    <CodeBlock code={`import turtle as t
import random

tim = t.Turtle()
t.colormode(255)
tim.speed("fastest")

def random_color():
    return (random.randint(0, 255), 
            random.randint(0, 255), 
            random.randint(0, 255))

# Draw spirograph
def draw_spirograph(size_of_gap):
    for _ in range(int(360 / size_of_gap)):
        tim.color(random_color())
        tim.circle(100)
        tim.setheading(tim.heading() + size_of_gap)

draw_spirograph(5)

screen = t.Screen()
screen.exitonclick()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Hirst Painting Project
                    </h2>
                    <p>
                        Create a Damien Hirst-style dot painting. Extract colors from an image using the
                        <code>colorgram</code> package.
                    </p>
                    <CodeBlock code={`import colorgram

# Extract colors from an image
colors = colorgram.extract('image.jpg', 30)

# Convert to RGB tuples
color_list = []
for color in colors:
    r = color.rgb.r
    g = color.rgb.g
    b = color.rgb.b
    color_list.append((r, g, b))

# Use these colors in your turtle drawing
import random
random.choice(color_list)  # Pick random color`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Speed Up</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>turtle.speed("fastest")</code> or <code>turtle.speed(0)</code> for instant drawing.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Hide Turtle</h4>
                            <p className="text-sm text-surface-400">
                                <code>turtle.hideturtle()</code> hides the arrow for cleaner final images.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Documentation</h4>
                            <p className="text-sm text-surface-400">
                                Always check the official turtle docs for all available methods and parameters.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Heading Control</h4>
                            <p className="text-sm text-surface-400">
                                <code>turtle.heading()</code> returns current angle; <code>turtle.setheading(90)</code> sets it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
