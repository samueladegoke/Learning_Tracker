import React from 'react';
import CodeBlock from '../../CodeBlock';
import { Lightbulb } from 'lucide-react';

export default function DeepDiveDay65() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Web Design Overview */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Why Web Design Matters
                    </h2>
                    <p>
                        Great design builds <strong>trust</strong> and <strong>credibility</strong>. Studies show users form opinions about a website in just 50 milliseconds.
                    </p>
                    <p>
                        Today we'll cover the fundamentals: <strong>Color Theory</strong>, <strong>Typography</strong>, <strong>UI Design</strong>, and <strong>UX Principles</strong>.
                    </p>
                </section>

                {/* Section 2: Color Theory */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Color Theory
                    </h2>
                    <p>
                        Colors evoke emotions. Choosing the right palette is crucial:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Red:</strong> Energy, urgency, passion</li>
                        <li><strong>Blue:</strong> Trust, calm, professionalism</li>
                        <li><strong>Green:</strong> Growth, nature, health</li>
                        <li><strong>Yellow:</strong> Optimism, creativity, warmth</li>
                    </ul>
                    <p>
                        Use the <strong>60-30-10 rule</strong>: 60% dominant color, 30% secondary, 10% accent.
                    </p>
                    <CodeBlock
                        code={`:root {
    --primary: #3B82F6;    /* 60% - Main brand color */
    --secondary: #1E293B;  /* 30% - Supporting color */
    --accent: #10B981;     /* 10% - Highlights & CTAs */
}`}
                        language="css"
                    />
                </section>

                {/* Section 3: Typography */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Typography
                    </h2>
                    <p>
                        Typography affects readability and mood:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Serif fonts</strong> (Times New Roman): Traditional, trustworthy</li>
                        <li><strong>Sans-serif fonts</strong> (Helvetica, Inter): Modern, clean</li>
                        <li><strong>Display fonts:</strong> Headlines only, never body text</li>
                    </ul>
                    <p>
                        <strong>Limit to 2-3 fonts</strong>: One for headings, one for body, and optionally one for accents.
                    </p>
                </section>

                {/* Section 4: UI Design Principles */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> UI Design Principles
                    </h2>
                    <p>
                        Key principles for effective UI:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Visual Hierarchy:</strong> Guide attention with size, color, and placement</li>
                        <li><strong>White Space:</strong> Give elements room to breathe</li>
                        <li><strong>Consistency:</strong> Same styles for same elements throughout</li>
                        <li><strong>Contrast:</strong> Ensure text is readable and CTAs stand out</li>
                    </ul>
                </section>

                {/* Section 5: UX Principles */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> UX Principles
                    </h2>
                    <p>
                        UX is about how users <strong>feel</strong> when using your product:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Simplicity:</strong> Don't make users think</li>
                        <li><strong>Feedback:</strong> Show users their actions had an effect</li>
                        <li><strong>F-Pattern:</strong> Users scan in an F-shape—put important content there</li>
                        <li><strong>Mobile-First:</strong> Design for small screens first</li>
                    </ul>
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Color Tools</h4>
                            <p className="text-sm text-surface-400">
                                Use <strong>Color Hunt</strong> or <strong>Adobe Color</strong> to find harmonious palettes quickly.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Google Fonts</h4>
                            <p className="text-sm text-surface-400">
                                Popular pairs: Inter + Roboto, Playfair Display + Source Sans Pro, Montserrat + Open Sans.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Inspiration</h4>
                            <p className="text-sm text-surface-400">
                                Browse <strong>Dribbble</strong>, <strong>Collect UI</strong>, or <strong>Awwwards</strong> for design inspiration.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
