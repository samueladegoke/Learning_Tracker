import CodeBlock from '../../CodeBlock';
import InlineCode from '../../InlineCode';

export default function DeepDiveDay20() {
    return (
        <div className="space-y-8">
            {/* Main Content */}
            <div className="prose prose-invert max-w-none">
                {/* Section 1: Screen Setup and Animation */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-primary-400 mb-4">🎬 Screen Setup and Animation Control</h3>
                    <p className="text-surface-300 mb-4">
                        Use <InlineCode>screen.tracer(0)</InlineCode> to turn off automatic animation, then
                        manually control updates with <InlineCode>screen.update()</InlineCode>.
                    </p>
                    <CodeBlock language="python" code={`from turtle import Screen

screen = Screen()
screen.setup(width=600, height=600)
screen.bgcolor("black")
screen.title("My Snake Game")
screen.tracer(0)  # Turn off automatic animation

# After making changes, manually refresh:
screen.update()

# Keep window open
screen.exitonclick()`} />
                </section>

                {/* Section 2: Creating the Snake Body */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-primary-400 mb-4">🐍 Creating the Snake Body</h3>
                    <p className="text-surface-300 mb-4">
                        Create multiple square segments at different positions to form the snake's body.
                    </p>
                    <CodeBlock language="python" code={`from turtle import Turtle

STARTING_POSITIONS = [(0, 0), (-20, 0), (-40, 0)]

segments = []

for position in STARTING_POSITIONS:
    new_segment = Turtle("square")
    new_segment.color("white")
    new_segment.penup()  # Don't draw lines!
    new_segment.goto(position)
    segments.append(new_segment)`} />
                </section>

                {/* Section 3: The Game Loop */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-accent-400 mb-4">🔁 The Game Loop</h3>
                    <p className="text-surface-300 mb-4">
                        Use a <InlineCode>while</InlineCode> loop with <InlineCode>time.sleep()</InlineCode> to
                        control animation speed:
                    </p>
                    <CodeBlock language="python" code={`import time

game_is_on = True

while game_is_on:
    screen.update()      # Refresh the screen
    time.sleep(0.1)      # Wait 0.1 seconds
    
    # Move snake here (each iteration = 1 frame)`} />
                    <div className="bg-surface-800/50 rounded-lg p-4 border border-surface-700 mt-4">
                        <p className="text-surface-300 text-sm">
                            💡 Smaller <InlineCode>time.sleep()</InlineCode> values = faster snake movement.
                        </p>
                    </div>
                </section>

                {/* Section 4: Moving the Snake */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-primary-400 mb-4">🚶 Making the Snake Move</h3>
                    <p className="text-surface-300 mb-4">
                        The key insight: move each segment to the position of the segment <em>in front</em> of it,
                        starting from the tail. Then move the head forward.
                    </p>
                    <CodeBlock language="python" code={`MOVE_DISTANCE = 20

def move():
    # Move segments from tail to head (reverse order)
    for seg_num in range(len(segments) - 1, 0, -1):
        new_x = segments[seg_num - 1].xcor()
        new_y = segments[seg_num - 1].ycor()
        segments[seg_num].goto(new_x, new_y)
    
    # Move the head forward
    segments[0].forward(MOVE_DISTANCE)

# In game loop:
while game_is_on:
    screen.update()
    time.sleep(0.1)
    move()`} />
                </section>

                {/* Section 5: Refactoring to a Snake Class */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-accent-400 mb-4">🏗️ Refactoring to a Snake Class</h3>
                    <p className="text-surface-300 mb-4">
                        Move all snake-related code into its own class in a separate file:
                    </p>
                    <CodeBlock language="python" code={`# snake.py
from turtle import Turtle

STARTING_POSITIONS = [(0, 0), (-20, 0), (-40, 0)]
MOVE_DISTANCE = 20

class Snake:
    def __init__(self):
        self.segments = []
        self.create_snake()
    
    def create_snake(self):
        for position in STARTING_POSITIONS:
            new_segment = Turtle("square")
            new_segment.color("white")
            new_segment.penup()
            new_segment.goto(position)
            self.segments.append(new_segment)
    
    def move(self):
        for seg_num in range(len(self.segments) - 1, 0, -1):
            new_x = self.segments[seg_num - 1].xcor()
            new_y = self.segments[seg_num - 1].ycor()
            self.segments[seg_num].goto(new_x, new_y)
        self.segments[0].forward(MOVE_DISTANCE)`} />
                    <p className="text-surface-400 text-sm mt-2">
                        Now <InlineCode>main.py</InlineCode> becomes much cleaner!
                    </p>
                </section>

                {/* Section 6: Controlling with Keys */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-primary-400 mb-4">🎮 Controlling Direction</h3>
                    <p className="text-surface-300 mb-4">
                        Add methods to change the snake's heading:
                    </p>
                    <CodeBlock language="python" code={`# Add to Snake class
def up(self):
    if self.head.heading() != 270:  # Not going down
        self.head.setheading(90)

def down(self):
    if self.head.heading() != 90:
        self.head.setheading(270)

def left(self):
    if self.head.heading() != 0:
        self.head.setheading(180)

def right(self):
    if self.head.heading() != 180:
        self.head.setheading(0)

# In main.py:
screen.listen()
screen.onkey(snake.up, "Up")
screen.onkey(snake.down, "Down")
screen.onkey(snake.left, "Left")
screen.onkey(snake.right, "Right")`} />
                </section>

                {/* Pro Tips */}
                <aside className="bg-gradient-to-br from-primary-900/30 to-accent-900/30 rounded-xl p-6 border border-primary-700/30">
                    <h4 className="text-lg font-semibold text-primary-300 mb-3">💡 Pro Tips</h4>
                    <ul className="space-y-3 text-surface-300 text-sm">
                        <li>
                            <strong>tracer(0):</strong> Essential for game animations - lets you
                            control exactly when to refresh the screen.
                        </li>
                        <li>
                            <strong>Reverse Iteration:</strong> <InlineCode>range(n-1, 0, -1)</InlineCode>
                            iterates backwards, crucial for linked segment movement.
                        </li>
                        <li>
                            <strong>Constants:</strong> Use UPPERCASE names like <InlineCode>MOVE_DISTANCE</InlineCode>
                            at the top of your file for easy tweaking.
                        </li>
                        <li>
                            <strong>No 180° Turns:</strong> Prevent the snake from reversing into itself
                            by checking current heading before changing direction.
                        </li>
                    </ul>
                </aside>
            </div>
        </div>
    );
}
