import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Monitor, Maximize, RefreshCw, Gamepad2 } from 'lucide-react'

export default function DeepDiveDay22() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Gamepad2 className="w-6 h-6 text-primary-400" /> The Pong Game
                    </h2>
                    <p>
                        Day 22 focuses on building the classic Arcade game <strong>Pong</strong>.
                        Key concepts include managing multiple moving objects, detecting complex collisions, and handling two-player input.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> The Paddle & shapesize()
                    </h2>
                    <p>
                        Instead of finding a rectangular image, we can take a standard 20x20 square turtle and <strong>stretch</strong> it.
                        <code>shapesize(stretch_wid=5, stretch_len=1)</code> stretches the width by 5x (100px) and keeps length 1x (20px).
                    </p>
                    <CodeBlock code={`from turtle import Turtle

class Paddle(Turtle):
    def __init__(self, position):
        super().__init__()
        self.shape("square")
        self.color("white")
        self.shapesize(stretch_wid=5, stretch_len=1)
        self.penup()
        self.goto(position)
        
    def go_up(self):
        new_y = self.ycor() + 20
        self.goto(self.xcor(), new_y)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Ball Physics
                    </h2>
                    <p>
                        The ball moves by updating its X and Y coordinates by a small amount (`x_move`, `y_move`) every frame.
                        To "bounce", we simply invert these values.
                    </p>
                    <ul className="list-disc list-inside text-surface-300 space-y-2 ml-4">
                        <li><strong>Wall Bounce (Top/Bottom):</strong> Invert Y (`y_move *= -1`)</li>
                        <li><strong>Paddle Bounce (Left/Right):</strong> Invert X (`x_move *= -1`)</li>
                    </ul>
                    <CodeBlock code={`class Ball(Turtle):
    def __init__(self):
        super().__init__()
        self.color("white")
        self.shape("circle")
        self.penup()
        self.x_move = 10
        self.y_move = 10

    def move(self):
        new_x = self.xcor() + self.x_move
        new_y = self.ycor() + self.y_move
        self.goto(new_x, new_y)

    def bounce_y(self):
        self.y_move *= -1  # Reverse vertical direction`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Collision Detection
                    </h2>
                    <p>
                        We use the <code>distance()</code> method to check if the ball is close to a paddle.
                        However, since the paddle is tall, we check if <code>distance &lt; 50</code> AND `xcor` is past a certain point.
                    </p>
                    <CodeBlock code={`# In main game loop
if ball.distance(r_paddle) < 50 and ball.xcor() > 320:
    ball.bounce_x()
    
# Detect R paddle miss
if ball.xcor() > 380:
    ball.reset_position()
    scoreboard.l_point()`} language="python" />
                </section>

            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Separate Keys</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>w</code>/<code>s</code> for Left player and Arrow Keys for Right player to allow simultaneous play.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Speeding Up</h4>
                            <p className="text-sm text-surface-400">
                                Increase the ball's speed every time it hits a paddle (shorten <code>time.sleep()</code>) to make the game harder.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Coordinates</h4>
                            <p className="text-sm text-surface-400">
                                Remember the screen is typically 800x600. Coordinate limits are roughly ±400 (x) and ±300 (y).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
