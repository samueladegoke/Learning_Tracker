import CodeBlock from '../../CodeBlock';
import InlineCode from '../../InlineCode';

export default function DeepDiveDay18() {
    return (
        <div className="space-y-8">
            {/* Main Content */}
            <div className="prose prose-invert max-w-none">
                {/* Section 1: Turtle Graphics Basics */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-primary-400 mb-4">🐢 Turtle Graphics Basics</h3>
                    <p className="text-surface-300 mb-4">
                        The <InlineCode>turtle</InlineCode> module lets you create graphics by controlling a
                        virtual "turtle" that draws lines as it moves. Import <InlineCode>Turtle</InlineCode> and
                        <InlineCode>Screen</InlineCode> classes to get started.
                    </p>
                    <CodeBlock language="python" code={`from turtle import Turtle, Screen

# Create a turtle object
timmy = Turtle()
timmy.shape("turtle")  # Options: arrow, turtle, circle, square, triangle
timmy.color("red")

# Create screen and keep window open
screen = Screen()
screen.exitonclick()  # Window closes on click`} />
                </section>

                {/* Section 2: Movement Commands */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-primary-400 mb-4">🎮 Movement Commands</h3>
                    <p className="text-surface-300 mb-4">Control your turtle with these movement methods:</p>
                    <CodeBlock language="python" code={`# Move forward/backward by distance (pixels)
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
timmy.pensize(5)  # Set line thickness`} />
                </section>

                {/* Section 3: Colors and RGB */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-accent-400 mb-4">🎨 Colors and RGB Tuples</h3>
                    <p className="text-surface-300 mb-4">
                        You can use color names or RGB tuples. For RGB, set colormode to 255.
                    </p>
                    <CodeBlock language="python" code={`from turtle import Turtle, Screen

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

timmy.color(random_color())`} />
                </section>

                {/* Section 4: Python Tuples */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-primary-400 mb-4">📦 Python Tuples</h3>
                    <p className="text-surface-300 mb-4">
                        A <strong>tuple</strong> is like a list but <em>immutable</em> (cannot be changed after creation).
                        Use parentheses <InlineCode>()</InlineCode> instead of brackets.
                    </p>
                    <CodeBlock language="python" code={`# Create a tuple
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
print(r)  # 255`} />
                </section>

                {/* Section 5: Drawing Challenges */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-accent-400 mb-4">🎯 Drawing Challenge: Spirograph</h3>
                    <p className="text-surface-300 mb-4">
                        Create a spirograph by drawing circles at different angles:
                    </p>
                    <CodeBlock language="python" code={`import turtle as t
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
screen.exitonclick()`} />
                </section>

                {/* Section 6: Hirst Painting Project */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-primary-400 mb-4">🖼️ Hirst Painting Project</h3>
                    <p className="text-surface-300 mb-4">
                        Create a Damien Hirst-style dot painting. Extract colors from an image using the
                        <InlineCode>colorgram</InlineCode> package.
                    </p>
                    <CodeBlock language="python" code={`import colorgram

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
random.choice(color_list)  # Pick random color`} />
                </section>

                {/* Pro Tips */}
                <aside className="bg-gradient-to-br from-primary-900/30 to-accent-900/30 rounded-xl p-6 border border-primary-700/30">
                    <h4 className="text-lg font-semibold text-primary-300 mb-3">💡 Pro Tips</h4>
                    <ul className="space-y-3 text-surface-300 text-sm">
                        <li>
                            <strong>Speed Up:</strong> Use <InlineCode>turtle.speed("fastest")</InlineCode> or
                            <InlineCode>turtle.speed(0)</InlineCode> for instant drawing.
                        </li>
                        <li>
                            <strong>Hide Turtle:</strong> <InlineCode>turtle.hideturtle()</InlineCode> hides the
                            arrow for cleaner final images.
                        </li>
                        <li>
                            <strong>Documentation:</strong> Always check the official turtle docs for all available
                            methods and parameters.
                        </li>
                        <li>
                            <strong>Heading:</strong> <InlineCode>turtle.heading()</InlineCode> returns current
                            angle; <InlineCode>turtle.setheading(90)</InlineCode> sets it.
                        </li>
                    </ul>
                </aside>
            </div>
        </div>
    );
}
