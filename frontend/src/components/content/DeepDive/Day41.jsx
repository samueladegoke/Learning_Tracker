import CodeBlock from '../../CodeBlock'
import { Lightbulb, Globe } from 'lucide-react'

export default function DeepDiveDay41() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Globe className="w-6 h-6 text-primary-400" /> Welcome to Web Development
                    </h2>
                    <p>
                        Day 41 marks the beginning of your <strong>Web Foundation</strong> journey. Before diving into
                        web scraping with Python, you need to understand the structure of web pages. HTML
                        (HyperText Markup Language) is the backbone of every website—it defines the content
                        and structure that browsers render.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> What is HTML?
                    </h2>
                    <p>
                        HTML stands for <strong>HyperText Markup Language</strong>. Let's break that down:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-surface-300">
                        <li><strong>HyperText:</strong> Text that links to other documents (hyperlinks)</li>
                        <li><strong>Markup:</strong> Annotations that define structure (like editor's marks on a manuscript)</li>
                        <li><strong>Language:</strong> A standardized way to communicate with browsers</li>
                    </ul>
                    <p>
                        While modern websites use HTML, CSS, and JavaScript together, you can create a valid
                        website with just an HTML file—exactly how the first websites were built by
                        Sir Tim Berners-Lee, inventor of the World Wide Web.
                    </p>
                    <CodeBlock code={`<!-- A simple HTML file -->
<!DOCTYPE html>
<html>
  <head>
    <title>My First Website</title>
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>`} language="html" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Tags vs Elements
                    </h2>
                    <p>
                        Understanding the difference between <strong>tags</strong> and <strong>elements</strong> is crucial:
                    </p>
                    <CodeBlock code={`<h1>Hello World</h1>
 ↑              ↑
 │              └── Closing tag (has forward slash)
 └── Opening tag

The entire thing (opening tag + content + closing tag) 
is called an ELEMENT.`} language="text" />
                    <ul className="list-disc list-inside space-y-2 text-surface-300">
                        <li><strong>Tag:</strong> Anything inside angle brackets: <code>&lt;h1&gt;</code>, <code>&lt;/h1&gt;</code></li>
                        <li><strong>Opening tag:</strong> <code>&lt;tagname&gt;</code></li>
                        <li><strong>Closing tag:</strong> <code>&lt;/tagname&gt;</code> (note the forward slash)</li>
                        <li><strong>Element:</strong> Opening tag + content + closing tag together</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Heading Elements (h1-h6)
                    </h2>
                    <p>
                        Headings define the hierarchy of your content, similar to a book's table of contents.
                        HTML provides six heading levels from <code>h1</code> (most important) to <code>h6</code> (least important).
                    </p>
                    <CodeBlock code={`<h1>Book Title</h1>           <!-- Largest, most important -->
<h2>Chapter 1</h2>            <!-- Major section -->
<h3>Section 1.1</h3>          <!-- Subsection -->
<h4>Topic 1.1.1</h4>          <!-- Sub-subsection -->
<h5>Detail</h5>               <!-- Fine detail -->
<h6>Smallest heading</h6>     <!-- Smallest heading -->`} language="html" />
                    <p className="text-amber-400 flex items-center gap-2">
                        <strong>⚠️ Important Rules:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-surface-300">
                        <li>Only use <strong>one h1</strong> per page (like a book has one title)</li>
                        <li>Don't skip levels—go h1 → h2 → h3, not h1 → h3</li>
                        <li>Use headings for structure, not just to make text bigger</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Paragraph Elements
                    </h2>
                    <p>
                        The <code>&lt;p&gt;</code> element defines a paragraph of text. Browsers automatically add
                        spacing before and after paragraphs.
                    </p>
                    <CodeBlock code={`<p>This is the first paragraph of text.</p>
<p>This is the second paragraph. Notice how 
   browsers add space between paragraphs 
   automatically.</p>`} language="html" />
                    <p>
                        Unlike in a word processor, pressing Enter in your HTML code doesn't create a new line
                        in the rendered output. You need to use proper HTML elements for structure.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Void (Self-Closing) Elements
                    </h2>
                    <p>
                        Some elements don't have content or a closing tag—they're called <strong>void elements</strong>
                        or self-closing tags:
                    </p>
                    <CodeBlock code={`<!-- Line break - creates a new line -->
<br>

<!-- Horizontal rule - creates a divider line -->
<hr>

<!-- Both are valid in HTML5 -->
<br />  <!-- Optional trailing slash -->
<hr />`} language="html" />
                    <p>
                        Common void elements: <code>&lt;br&gt;</code>, <code>&lt;hr&gt;</code>, <code>&lt;img&gt;</code>,
                        <code>&lt;input&gt;</code>, <code>&lt;meta&gt;</code>, <code>&lt;link&gt;</code>
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Semantic HTML</h4>
                            <p className="text-sm text-surface-400">
                                Use headings for structure, not styling. Screen readers and search engines rely on proper heading hierarchy.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">View Page Source</h4>
                            <p className="text-sm text-surface-400">
                                Right-click any webpage and select "View Page Source" to see the HTML behind it.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">MDN Web Docs</h4>
                            <p className="text-sm text-surface-400">
                                The Mozilla Developer Network (MDN) is the authoritative reference for all HTML elements.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Live Preview</h4>
                            <p className="text-sm text-surface-400">
                                Use VS Code's Live Preview extension to see your HTML changes in real-time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
