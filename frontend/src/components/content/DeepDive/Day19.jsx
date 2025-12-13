import CodeBlock from '../../CodeBlock';
import InlineCode from '../../InlineCode';

export default function DeepDiveDay19() {
    return (
        <div className="space-y-8">
            {/* Main Content */}
            <div className="prose prose-invert max-w-none">
                {/* Section 1: Higher-Order Functions */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-primary-400 mb-4">🔄 Higher-Order Functions</h3>
                    <p className="text-surface-300 mb-4">
                        A <strong>higher-order function</strong> is a function that takes another function as an
                        argument or returns a function. In Python, functions are <em>first-class objects</em>.
                    </p>
                    <CodeBlock language="python" code={`def add(n1, n2):
    return n1 + n2

def multiply(n1, n2):
    return n1 * n2

# Calculator is a higher-order function
def calculator(n1, n2, func):
    return func(n1, n2)

# Pass function NAME (without parentheses!)
result = calculator(2, 3, add)      # 5
result = calculator(2, 3, multiply) # 6`} />
                    <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mt-4">
                        <p className="text-yellow-300 text-sm">
                            ⚠️ <strong>Key Point:</strong> When passing a function as an argument, use just the
                            name <InlineCode>add</InlineCode> not <InlineCode>add()</InlineCode>.
                            Parentheses would <em>call</em> the function immediately.
                        </p>
                    </div>
                </section>

                {/* Section 2: Event Listeners */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-primary-400 mb-4">🎧 Event Listeners</h3>
                    <p className="text-surface-300 mb-4">
                        Event listeners wait for user actions (key presses, clicks) and trigger functions when
                        those events occur.
                    </p>
                    <CodeBlock language="python" code={`from turtle import Turtle, Screen

tim = Turtle()
screen = Screen()

def move_forwards():
    tim.forward(10)

# Bind the function to a key press
screen.listen()  # Start listening for events
screen.onkey(key="space", fun=move_forwards)

screen.exitonclick()`} />
                    <p className="text-surface-400 text-sm mt-2">
                        <InlineCode>screen.listen()</InlineCode> must be called before <InlineCode>onkey()</InlineCode>
                        for event listeners to work.
                    </p>
                </section>

                {/* Section 3: Instances and State */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-accent-400 mb-4">🎭 Instances and State</h3>
                    <p className="text-surface-300 mb-4">
                        <strong>Instance</strong>: Each object created from a class is a separate instance.
                        <strong>State</strong>: The current values of an object's attributes at any moment.
                    </p>
                    <CodeBlock language="python" code={`from turtle import Turtle

# Multiple instances from same class
timmy = Turtle()
tommy = Turtle()

# Each instance has its own STATE
timmy.color("green")
tommy.color("purple")

timmy.forward(100)  # Timmy moves, Tommy stays
# They are independent!`} />
                    <div className="bg-surface-800/50 rounded-lg p-4 border border-surface-700 mt-4">
                        <p className="text-surface-300 text-sm">
                            Think of instances like people: You and I are both "human objects" but we have
                            different names, heights, and locations. Same blueprint, different state.
                        </p>
                    </div>
                </section>

                {/* Section 4: Etch-A-Sketch Example */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-primary-400 mb-4">✏️ Etch-A-Sketch Project</h3>
                    <p className="text-surface-300 mb-4">
                        Control a turtle with keyboard keys using multiple event listeners:
                    </p>
                    <CodeBlock language="python" code={`from turtle import Turtle, Screen

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

screen.exitonclick()`} />
                </section>

                {/* Section 5: Turtle Race */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-accent-400 mb-4">🏁 Turtle Race Project</h3>
                    <p className="text-surface-300 mb-4">
                        Create multiple turtle instances, place them at starting positions, and race them:
                    </p>
                    <CodeBlock language="python" code={`from turtle import Turtle, Screen
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

screen.exitonclick()`} />
                </section>

                {/* Pro Tips */}
                <aside className="bg-gradient-to-br from-primary-900/30 to-accent-900/30 rounded-xl p-6 border border-primary-700/30">
                    <h4 className="text-lg font-semibold text-primary-300 mb-3">💡 Pro Tips</h4>
                    <ul className="space-y-3 text-surface-300 text-sm">
                        <li>
                            <strong>No Parentheses:</strong> When passing functions as arguments, use the
                            name only: <InlineCode>onkey(fun=move, key="w")</InlineCode>
                        </li>
                        <li>
                            <strong>Keyword Arguments:</strong> For clarity, use keyword arguments with
                            event listeners: <InlineCode>key="space"</InlineCode>
                        </li>
                        <li>
                            <strong>textinput():</strong> <InlineCode>screen.textinput(title, prompt)</InlineCode>
                            shows a pop-up dialog for user input.
                        </li>
                        <li>
                            <strong>xcor() / ycor():</strong> Returns the turtle's current x or y coordinate.
                        </li>
                    </ul>
                </aside>
            </div>
        </div>
    );
}
