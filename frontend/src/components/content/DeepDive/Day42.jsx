import CodeBlock from '../../CodeBlock'
import { Lightbulb, FileCode } from 'lucide-react'

export default function DeepDiveDay42() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <FileCode className="w-6 h-6 text-primary-400" /> Intermediate HTML
                    </h2>
                    <p>
                        Day 42 builds on HTML fundamentals by introducing the <strong>HTML boilerplate</strong>,
                        list elements for organizing content, proper nesting and indentation, anchor tags for
                        creating links, and image elements to display media.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> HTML Boilerplate
                    </h2>
                    <p>
                        Every HTML document starts with a standard structure called the <strong>boilerplate</strong>.
                        This ensures browsers interpret your page correctly.
                    </p>
                    <CodeBlock code={`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Webpage</title>
</head>
<body>
    <!-- Your content goes here -->
    <h1>Hello World!</h1>
</body>
</html>`} language="html" />
                    <ul className="list-disc list-inside space-y-2 text-surface-300">
                        <li><code>&lt;!DOCTYPE html&gt;</code> - Declares this is an HTML5 document</li>
                        <li><code>&lt;html&gt;</code> - Root element containing all content</li>
                        <li><code>&lt;head&gt;</code> - Metadata (title, charset, links to CSS)</li>
                        <li><code>&lt;body&gt;</code> - Visible content displayed in the browser</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> List Elements
                    </h2>
                    <p>
                        HTML provides two types of lists: <strong>ordered lists</strong> (numbered) and
                        <strong> unordered lists</strong> (bulleted).
                    </p>
                    <CodeBlock code={`<!-- Unordered List (bullets) -->
<ul>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
</ul>

<!-- Ordered List (numbers) -->
<ol>
    <li>Step one</li>
    <li>Step two</li>
    <li>Step three</li>
</ol>`} language="html" />
                    <ul className="list-disc list-inside space-y-2 text-surface-300">
                        <li><code>&lt;ul&gt;</code> - Unordered list (bullet points)</li>
                        <li><code>&lt;ol&gt;</code> - Ordered list (numbered)</li>
                        <li><code>&lt;li&gt;</code> - List item (used inside ul or ol)</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Nesting & Indentation
                    </h2>
                    <p>
                        HTML elements can be <strong>nested</strong> inside each other to create hierarchy.
                        Proper indentation makes your code readable.
                    </p>
                    <CodeBlock code={`<!-- Nested lists -->
<ul>
    <li>Programming Languages
        <ul>
            <li>Python</li>
            <li>JavaScript</li>
            <li>HTML/CSS</li>
        </ul>
    </li>
    <li>Databases
        <ul>
            <li>PostgreSQL</li>
            <li>MongoDB</li>
        </ul>
    </li>
</ul>`} language="html" />
                    <p>
                        <strong>Key Rule:</strong> Elements must be closed in the reverse order they were opened
                        (last opened = first closed). Think of it like Russian dolls.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Anchor Elements (Links)
                    </h2>
                    <p>
                        The <code>&lt;a&gt;</code> (anchor) element creates hyperlinks—the foundation of the web.
                        The <code>href</code> attribute specifies where the link goes.
                    </p>
                    <CodeBlock code={`<!-- External link -->
<a href="https://www.google.com">Visit Google</a>

<!-- Link to another page -->
<a href="about.html">About Us</a>

<!-- Link in new tab -->
<a href="https://github.com" target="_blank">GitHub</a>

<!-- Email link -->
<a href="mailto:hello@example.com">Send Email</a>`} language="html" />
                    <ul className="list-disc list-inside space-y-2 text-surface-300">
                        <li><code>href</code> - The URL or path the link points to</li>
                        <li><code>target="_blank"</code> - Opens link in a new tab</li>
                        <li>The text between tags is the clickable link text</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Image Elements
                    </h2>
                    <p>
                        The <code>&lt;img&gt;</code> element displays images. It's a <strong>void element</strong>
                        (no closing tag) with required <code>src</code> and recommended <code>alt</code> attributes.
                    </p>
                    <CodeBlock code={`<!-- Basic image -->
<img src="photo.jpg" alt="A beautiful sunset">

<!-- Image from URL -->
<img src="https://example.com/logo.png" alt="Company Logo">

<!-- Image with size -->
<img src="profile.jpg" alt="Profile photo" width="200" height="200">`} language="html" />
                    <ul className="list-disc list-inside space-y-2 text-surface-300">
                        <li><code>src</code> - Path or URL to the image file (required)</li>
                        <li><code>alt</code> - Alternative text for accessibility and SEO (important!)</li>
                        <li><code>width</code>/<code>height</code> - Dimensions in pixels</li>
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Emmet Shortcuts</h4>
                            <p className="text-sm text-surface-400">
                                Type <code>!</code> then Tab in VS Code to instantly generate HTML boilerplate.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Always Use Alt Text</h4>
                            <p className="text-sm text-surface-400">
                                Alt text helps screen readers and displays when images fail to load. It's essential for accessibility.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Relative vs Absolute Paths</h4>
                            <p className="text-sm text-surface-400">
                                Use relative paths (<code>images/photo.jpg</code>) for local files and absolute URLs for external resources.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Index.html Convention</h4>
                            <p className="text-sm text-surface-400">
                                Name your main page <code>index.html</code>—servers automatically serve this as the default page.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
