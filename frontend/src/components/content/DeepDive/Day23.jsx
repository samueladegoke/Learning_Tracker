import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Rabbit, Car, Gauge, Footprints, RefreshCw } from 'lucide-react'

export default function DeepDiveDay23() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Footprints className="w-6 h-6 text-primary-400" /> Turtle Crossing
                    </h2>
                    <p>
                        Day 23 involves building a "Frogger"-style game. The player controls a turtle crossing a busy road with randomly generated cars.
                        Key concepts include <strong>Object Management</strong> (handling many car objects) and <strong>Randomness</strong>.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> The Car Manager
                    </h2>
                    <p>
                        Instead of creating 20 cars manually, we create a <code>CarManager</code> class that handles generating and moving cars.
                        We generate a new car only <strong>sometimes</strong> (e.g., every 6th frame) to avoid overcrowding.
                    </p>
                    <CodeBlock code={`COLORS = ["red", "orange", "yellow", "green", "blue", "purple"]
STARTING_MOVE_DISTANCE = 5
MOVE_INCREMENT = 10

class CarManager:
    def __init__(self):
        self.all_cars = []
        self.car_speed = STARTING_MOVE_DISTANCE

    def create_car(self):
        # 1 in 6 chance to create a car each loop
        random_chance = random.randint(1, 6)
        if random_chance == 1:
            new_car = Turtle("square")
            new_car.shapesize(stretch_wid=1, stretch_len=2)
            new_car.color(random.choice(COLORS))
            new_car.penup()
            # Random Y position
            random_y = random.randint(-250, 250)
            new_car.goto(300, random_y)
            self.all_cars.append(new_car)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Moving Cars
                    </h2>
                    <p>
                        We iterate through the <code>all_cars</code> list and move each one backwards (Left).
                    </p>
                    <CodeBlock code={`    def move_cars(self):
        for car in self.all_cars:
            car.backward(self.car_speed)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Level Up & Speed
                    </h2>
                    <p>
                        When the turtle reaches the top, we increase the speed of the cars and reset the turtle's position.
                    </p>
                    <CodeBlock code={`    def level_up(self):
        self.car_speed += MOVE_INCREMENT

# In Main Loop
if player.is_at_finish_line():
    player.go_to_start()
    car_manager.level_up()
    scoreboard.increase_level()`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Random Chance</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>random.randint(1, 6)</code> to throttle creation rates in a loop.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Collision Loop</h4>
                            <p className="text-sm text-surface-400">
                                You must check collision for <strong>every</strong> car in the list during every game loop iteration.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Constants</h4>
                            <p className="text-sm text-surface-400">
                                Use ALL_CAPS for constants like <code>STARTING_MOVE_DISTANCE</code> at the top of your file for easy tuning.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
