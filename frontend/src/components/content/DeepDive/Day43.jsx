import CodeBlock from '../../CodeBlock'
import { Lightbulb, Palette } from 'lucide-react'

export default function DeepDiveDay43() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Palette className="w-6 h-6 text-primary-400" /> Introduction to CSS
                    </h2>
                    <p>
                        Day 43 introduces <strong>CSS (Cascading Style Sheets)</strong>—the language that makes
                        websites beautiful. While HTML defines structure, CSS controls the visual presentation:
                        colors, fonts, spacing, layouts, and everything that makes a site look polished.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Why Do We Need CSS?
                    </h2>
                    <p>
                        Without CSS, all websites would look like plain text documents from the 1990s. CSS allows you to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-surface-300">
                        <li>Change colors, fonts, and sizes</li>
                        <li>Add spacing, borders, and backgrounds</li>
                        <li>Create layouts (grids, flexbox)</li>
                        <li>Make responsive designs for different screen sizes</li>
                        <li>Add animations and visual effects</li>
                    </ul>
                    <p>
                        The "Cascading" in CSS means styles can inherit and override each other in a predictable way.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Three Ways to Add CSS
                    </h2>
                    <p>
                        CSS can be added to HTML in three ways, each with different use cases:
                    </p>
                    <CodeBlock code={`<!-- 1. INLINE CSS - Direct on element -->
<h1 style="color: blue; font-size: 24px;">Blue Heading</h1>

<!-- 2. INTERNAL CSS - In the <head> -->
<head>
    <style>
        h1 {
            color: blue;
            font-size: 24px;
        }
    </style>
</head>

<!-- 3. EXTERNAL CSS - Separate file (BEST) -->
<head>
    <link rel="stylesheet" href="styles.css">
</head>`} language="html" />
                    <ul className="list-disc list-inside space-y-2 text-surface-300">
                        <li><strong>Inline:</strong> Quick but not reusable (avoid for most cases)</li>
                        <li><strong>Internal:</strong> Good for single-page styles</li>
                        <li><strong>External:</strong> Best practice—separate file, reusable across pages</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> CSS Syntax
                    </h2>
                    <p>
                        CSS rules follow a simple pattern: <strong>selector</strong> + <strong>declaration block</strong>.
                    </p>
                    <CodeBlock code={`/* CSS Rule Structure */
selector {
    property: value;
    property: value;
}

/* Example */
h1 {
    color: blue;
    font-size: 32px;
    text-align: center;
}`} language="css" />
                    <ul className="list-disc list-inside space-y-2 text-surface-300">
                        <li><strong>Selector:</strong> What element(s) to style (e.g., <code>h1</code>)</li>
                        <li><strong>Property:</strong> What aspect to change (e.g., <code>color</code>)</li>
                        <li><strong>Value:</strong> The new setting (e.g., <code>blue</code>)</li>
                        <li>Each declaration ends with a <strong>semicolon</strong></li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> CSS Selectors
                    </h2>
                    <p>
                        Selectors target elements to style. Here are the three most important:
                    </p>
                    <CodeBlock code={`/* ELEMENT SELECTOR - targets all elements of a type */
p {
    color: gray;
}

/* CLASS SELECTOR - targets elements with a class (.) */
.highlight {
    background-color: yellow;
}

/* ID SELECTOR - targets ONE element with an ID (#) */
#header {
    font-size: 48px;
}

/* Multiple classes/elements can share styles */
h1, h2, h3 {
    font-family: Arial;
}`} language="css" />
                    <CodeBlock code={`<!-- HTML using classes and IDs -->
<h1 id="header">Main Title</h1>
<p class="highlight">Highlighted paragraph</p>
<p>Regular paragraph</p>
<p class="highlight">Another highlighted one</p>`} language="html" />
                    <ul className="list-disc list-inside space-y-2 text-surface-300">
                        <li><strong>Element:</strong> Just the tag name (<code>p</code>, <code>h1</code>)</li>
                        <li><strong>Class:</strong> Dot + class name (<code>.highlight</code>) - reusable</li>
                        <li><strong>ID:</strong> Hash + id name (<code>#header</code>) - unique per page</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Common CSS Properties
                    </h2>
                    <p>
                        Here are some essential properties you'll use constantly:
                    </p>
                    <CodeBlock code={`/* Text styling */
p {
    color: #333333;           /* Text color */
    font-size: 16px;          /* Font size */
    font-family: Arial, sans-serif;
    text-align: center;       /* left, center, right */
}

/* Background and borders */
div {
    background-color: #f0f0f0;
    border: 1px solid black;
    border-radius: 8px;       /* Rounded corners */
}

/* Spacing */
.box {
    padding: 20px;            /* Inside spacing */
    margin: 10px;             /* Outside spacing */
}`} language="css" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Classes vs IDs</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>class</code> for styles that repeat. Use <code>id</code> only for unique, one-time elements.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">External CSS First</h4>
                            <p className="text-sm text-surface-400">
                                Always prefer external CSS files. They're easier to maintain and can be cached by browsers.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Use DevTools</h4>
                            <p className="text-sm text-surface-400">
                                Right-click → Inspect to see and edit CSS live in your browser. Essential for debugging!
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Specificity Matters</h4>
                            <p className="text-sm text-surface-400">
                                ID selectors override class selectors, which override element selectors. More specific wins.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
