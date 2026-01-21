import CodeBlock from '../../CodeBlock'
import { Lightbulb, Box } from 'lucide-react'

export default function DeepDiveDay44() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Box className="w-6 h-6 text-primary-400" /> Intermediate CSS
                    </h2>
                    <p>
                        Day 44 dives deeper into CSS with <strong>colors</strong>, <strong>font properties</strong>,
                        the <strong>CSS Box Model</strong>, and using <strong>browser DevTools</strong> to inspect
                        and debug styles. These concepts are fundamental to creating polished web designs.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> CSS Colors
                    </h2>
                    <p>
                        CSS supports multiple ways to define colors. Each has its use case:
                    </p>
                    <CodeBlock code={`/* Named Colors - 147 built-in names */
color: red;
color: cornflowerblue;
color: darkslategray;

/* Hexadecimal - 6 digits (RRGGBB) */
color: #FF0000;    /* Red */
color: #00FF00;    /* Green */
color: #0000FF;    /* Blue */
color: #333333;    /* Dark gray */

/* RGB - Red, Green, Blue (0-255) */
color: rgb(255, 0, 0);      /* Red */
color: rgb(100, 149, 237);  /* Cornflower blue */

/* RGBA - RGB + Alpha (transparency 0-1) */
color: rgba(0, 0, 0, 0.5);  /* 50% transparent black */`} language="css" />
                    <ul className="list-disc list-inside space-y-2 text-surface-300">
                        <li><strong>Named:</strong> Easy to remember (red, blue, etc.)</li>
                        <li><strong>Hex:</strong> Precise colors, web standard</li>
                        <li><strong>RGB:</strong> Matches design tools like Photoshop</li>
                        <li><strong>RGBA:</strong> Add transparency</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Font Properties
                    </h2>
                    <p>
                        Typography is crucial for readability and design. CSS provides several font properties:
                    </p>
                    <CodeBlock code={`body {
    /* Font family with fallbacks */
    font-family: 'Helvetica Neue', Arial, sans-serif;
    
    /* Font size */
    font-size: 16px;
    
    /* Font weight (100-900 or keywords) */
    font-weight: 400;        /* Normal */
    font-weight: 700;        /* Bold */
    font-weight: bold;       /* Same as 700 */
    
    /* Line height for readability */
    line-height: 1.5;        /* 1.5x the font size */
    
    /* Font style */
    font-style: italic;
}

/* Text decoration */
a {
    text-decoration: none;    /* Remove underline */
}

h1 {
    text-transform: uppercase; /* ALL CAPS */
    letter-spacing: 2px;       /* Space between letters */
}`} language="css" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> The CSS Box Model
                    </h2>
                    <p>
                        Every HTML element is a rectangular box. The <strong>Box Model</strong> describes the
                        space around an element with four layers:
                    </p>
                    <CodeBlock code={`/*
┌─────────────────────────────────────┐
│              MARGIN                 │ ← Space OUTSIDE the element
│   ┌─────────────────────────────┐   │
│   │          BORDER             │   │ ← The visible edge
│   │   ┌─────────────────────┐   │   │
│   │   │      PADDING        │   │   │ ← Space INSIDE, around content
│   │   │   ┌─────────────┐   │   │   │
│   │   │   │   CONTENT   │   │   │   │ ← The actual text/image
│   │   │   └─────────────┘   │   │   │
│   │   └─────────────────────┘   │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
*/

.box {
    /* Content dimensions */
    width: 200px;
    height: 100px;
    
    /* Padding: inside spacing */
    padding: 20px;           /* All sides */
    padding: 10px 20px;      /* Vertical | Horizontal */
    padding: 5px 10px 15px 20px; /* Top Right Bottom Left */
    
    /* Border */
    border: 2px solid black;
    border-radius: 8px;      /* Rounded corners */
    
    /* Margin: outside spacing */
    margin: 20px auto;       /* Center horizontally */
}`} language="css" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Box-Sizing
                    </h2>
                    <p>
                        By default, padding and border are <strong>added</strong> to width/height. Use
                        <code>box-sizing: border-box</code> to include them in the dimensions.
                    </p>
                    <CodeBlock code={`/* Default behavior (content-box) */
.box {
    width: 200px;
    padding: 20px;
    border: 5px solid black;
    /* Total width = 200 + 40 + 10 = 250px! */
}

/* Border-box: padding and border included */
.box {
    box-sizing: border-box;
    width: 200px;
    padding: 20px;
    border: 5px solid black;
    /* Total width = exactly 200px ✓ */
}

/* Best practice: apply to all elements */
* {
    box-sizing: border-box;
}`} language="css" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Using Browser DevTools
                    </h2>
                    <p>
                        Browser DevTools (F12 or right-click → Inspect) are essential for CSS debugging:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-surface-300">
                        <li><strong>Inspect Element:</strong> See which CSS rules apply</li>
                        <li><strong>Edit Live:</strong> Change values and see results instantly</li>
                        <li><strong>Box Model View:</strong> Visualize margin, border, padding</li>
                        <li><strong>Computed Styles:</strong> See the final calculated values</li>
                        <li><strong>Find Bugs:</strong> Crossed-out rules are being overridden</li>
                    </ul>
                    <p className="text-primary-300">
                        <strong>Pro Tip:</strong> Install the "Pesticide" Chrome extension to visualize all
                        element boxes on any page with colored outlines.
                    </p>
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Use border-box</h4>
                            <p className="text-sm text-surface-400">
                                Add <code>* &#123; box-sizing: border-box; &#125;</code> to your CSS reset for predictable sizing.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Font Stack</h4>
                            <p className="text-sm text-surface-400">
                                Always provide fallback fonts: <code>font-family: 'Custom', Arial, sans-serif;</code>
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Margin Collapse</h4>
                            <p className="text-sm text-surface-400">
                                Vertical margins between elements collapse to the larger value, not sum.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Color Contrast</h4>
                            <p className="text-sm text-surface-400">
                                Ensure sufficient contrast between text and background for accessibility.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
