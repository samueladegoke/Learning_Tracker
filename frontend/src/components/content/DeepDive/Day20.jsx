import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Lightbulb, Play } from 'lucide-react'

export default function DeepDiveDay20() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Play className="w-6 h-6 text-primary-400" /> Screen Setup and Animation Control
                    </h2>
                    <p>
                        Use <code>screen.tracer(0)</code> to turn off automatic animation, then
                        manually control updates with <code>screen.update()</code>.
                    </p>
                    <CodeBlock code={`from turtle import Screen

screen = Screen()
screen.setup(width=600, height=600)
screen.bgcolor("black")
screen.title("My Snake Game")
screen.tracer(0)  # Turn off automatic animation

# After making changes, manually refresh:
screen.update()

# Keep window open
screen.exitonclick()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Creating the Snake Body
                    </h2>
                    <p>
                        Create multiple square segments at different positions to form the snake's body.
                    </p>
                    <CodeBlock code={`from turtle import Turtle

STARTING_POSITIONS = [(0, 0), (-20, 0), (-40, 0)]

segments = []

for position in STARTING_POSITIONS:
    new_segment = Turtle("square")
    new_segment.color("white")
    new_segment.penup()  # Don't draw lines!
    new_segment.goto(position)
    segments.append(new_segment)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> The Game Loop
                    </h2>
                    <p>
                        Use a <code>while</code> loop with <code>time.sleep()</code> to control animation speed:
                    </p>
                    <CodeBlock code={`import time

game_is_on = True

while game_is_on:
    screen.update()      # Refresh the screen
    time.sleep(0.1)      # Wait 0.1 seconds
    
    # Move snake here (each iteration = 1 frame)`} language="python" />
                    <p className="text-surface-400 text-sm">
                        💡 Smaller <code>time.sleep()</code> values = faster snake movement.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Making the Snake Move
                    </h2>
                    <p>
                        The key insight: move each segment to the position of the segment <em>in front</em> of it,
                        starting from the tail. Then move the head forward.
                    </p>
                    <CodeBlock code={`MOVE_DISTANCE = 20

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
    move()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Refactoring to a Snake Class
                    </h2>
                    <p>
                        Move all snake-related code into its own class in a separate file:
                    </p>
                    <CodeBlock code={`# snake.py
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
        self.segments[0].forward(MOVE_DISTANCE)`} language="python" />
                    <p className="text-surface-400 text-sm">
                        Now <code>main.py</code> becomes much cleaner!
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Controlling Direction
                    </h2>
                    <p>
                        Add methods to change the snake's heading:
                    </p>
                    <CodeBlock code={`# Add to Snake class
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
screen.onkey(snake.right, "Right")`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">tracer(0)</h4>
                            <p className="text-sm text-surface-400">
                                Essential for game animations - lets you control exactly when to refresh the screen.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Reverse Iteration</h4>
                            <p className="text-sm text-surface-400">
                                <code>range(n-1, 0, -1)</code> iterates backwards, crucial for linked segment movement.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Constants</h4>
                            <p className="text-sm text-surface-400">
                                Use UPPERCASE names like <code>MOVE_DISTANCE</code> at the top of your file for easy tweaking.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">No 180° Turns</h4>
                            <p className="text-sm text-surface-400">
                                Prevent the snake from reversing into itself by checking current heading before direction change.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
