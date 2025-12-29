import CodeBlock from '../../CodeBlock'
import { Lightbulb, Target, Layers, CheckCircle2, GitBranch, MessageSquareQuote, Sparkles, AlertTriangle, Gamepad2, Zap } from 'lucide-react'

export default function DeepDiveDay87() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: The Brief */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Target className="w-6 h-6 text-primary-400" /> The Brief
                    </h2>
                    <div className="bg-surface-800/50 p-5 rounded-lg border border-surface-700">
                        <p className="italic text-surface-300 mb-4">
                            "Create a classic Breakout/Brick Breaker game using Pygame. The player controls a paddle to bounce a ball and destroy rows of bricks."
                        </p>
                        <h4 className="font-semibold text-surface-100 mb-2">Deliverables:</h4>
                        <ul className="list-disc list-inside space-y-1 text-surface-300">
                            <li>Paddle controlled by arrow keys or mouse</li>
                            <li>Ball with realistic bounce physics</li>
                            <li>Multiple rows of destructible bricks</li>
                            <li>Score tracking and lives system</li>
                        </ul>
                    </div>
                </section>

                {/* Section 2: Tech Stack */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Layers className="w-6 h-6 text-primary-400" /> Recommended Tech Stack
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-surface-700 flex items-start gap-3">
                            <Gamepad2 className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-surface-100">Pygame</h4>
                                <p className="text-sm text-surface-400">Industry-standard Python game development library.</p>
                            </div>
                        </div>
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-surface-700 flex items-start gap-3">
                            <Zap className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-surface-100">pygame.sprite</h4>
                                <p className="text-sm text-surface-400">For efficient collision detection and sprite groups.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Architecture */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <GitBranch className="w-6 h-6 text-primary-400" /> Architecture Pattern
                    </h2>
                    <div className="bg-surface-800/50 p-5 rounded-lg border border-surface-700">
                        <p className="text-surface-300 mb-4">
                            <strong className="text-surface-100">Game Loop Pattern</strong> - Process inputs → Update game state → Render → Repeat at 60 FPS.
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm">
                            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300">Event Handling</span>
                            <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-300">Physics Update</span>
                            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300">Collision Detection</span>
                            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300">Rendering</span>
                        </div>
                    </div>
                    <CodeBlock
                        code={`import pygame

class Ball(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((10, 10))
        self.image.fill((255, 255, 255))
        self.rect = self.image.get_rect(center=(x, y))
        self.speed_x = 5
        self.speed_y = -5
    
    def update(self):
        self.rect.x += self.speed_x
        self.rect.y += self.speed_y
        # Bounce off walls
        if self.rect.left <= 0 or self.rect.right >= 800:
            self.speed_x *= -1`}
                        language="python"
                    />
                </section>

                {/* Section 4: Milestones */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <CheckCircle2 className="w-6 h-6 text-primary-400" /> Milestones
                    </h2>
                    <div className="space-y-3">
                        {[
                            { title: "Paddle & Ball", desc: "Create movable paddle and bouncing ball with basic physics." },
                            { title: "Brick Grid", desc: "Generate a grid of bricks using nested loops." },
                            { title: "Collision System", desc: "Use pygame.sprite.spritecollide() for brick destruction." },
                            { title: "Game States", desc: "Implement start screen, game over, and restart logic." }
                        ].map((m, i) => (
                            <div key={i} className="flex gap-3 items-start bg-surface-800/30 p-4 rounded-lg border border-surface-700">
                                <span className="text-primary-400 font-bold">{i + 1}</span>
                                <div>
                                    <h4 className="font-semibold text-surface-100">{m.title}</h4>
                                    <p className="text-sm text-surface-400">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 5: Pitfalls */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> <AlertTriangle className="w-6 h-6 text-amber-400" /> Common Pitfalls
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-amber-500/20">
                            <h4 className="font-semibold text-amber-300 mb-1">Ball Tunneling</h4>
                            <p className="text-sm text-surface-400">At high speeds, the ball can pass through objects. Use smaller speed increments or predictive collision.</p>
                        </div>
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-amber-500/20">
                            <h4 className="font-semibold text-amber-300 mb-1">Stuck Ball</h4>
                            <p className="text-sm text-surface-400">Ensure the ball always has a minimum vertical velocity to prevent horizontal oscillation.</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
                <div className="bg-surface-800/40 p-5 rounded-xl border border-surface-700">
                    <h3 className="font-bold text-surface-100 mb-3 flex items-center gap-2">
                        <MessageSquareQuote className="w-5 h-5 text-primary-400" /> Interview Prep
                    </h3>
                    <ul className="space-y-3 text-sm text-surface-300">
                        <li className="flex gap-2 items-start">
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>"Explain the difference between rect collision and pixel-perfect collision."</span>
                        </li>
                        <li className="flex gap-2 items-start">
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>"How would you add power-ups that change ball speed or paddle size?"</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-primary-500/10 to-transparent p-5 rounded-xl border border-primary-500/20">
                    <h3 className="font-bold text-surface-100 mb-2 flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5 text-primary-400" /> Game Design Tips
                    </h3>
                    <ul className="text-sm text-surface-300 space-y-1">
                        <li>• Add sound effects for satisfying feedback</li>
                        <li>• Use color gradients for brick health</li>
                        <li>• Increase ball speed as bricks decrease</li>
                    </ul>
                </div>
            </aside>
        </div>
    )
}
