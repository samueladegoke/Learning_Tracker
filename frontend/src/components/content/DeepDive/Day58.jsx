import React from 'react';
import CodeBlock from '../../CodeBlock';
import { Lightbulb } from 'lucide-react';

export default function DeepDiveDay58() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: What is Bootstrap? */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Web Foundation: Bootstrap
                    </h2>
                    <p>
                        <strong>Bootstrap</strong> is the world's most popular front-end open-source toolkit. It provides a massive collection of pre-written CSS and JavaScript that allows you to build responsive, mobile-first sites quickly.
                    </p>
                    <p>
                        Instead of writing custom CSS for every button, navbar, or layout, you simply apply specific <strong>classes</strong> to your HTML elements.
                    </p>
                </section>

                {/* Section 2: The Grid System */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> The 12-Column Grid System
                    </h2>
                    <p>
                        Bootstrap's grid system uses a series of containers, rows, and columns to layout and align content. It's built with flexbox and is fully responsive.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Containers:</strong> Center and horizontally pad your site's contents.</li>
                        <li><strong>Rows:</strong> Wrappers for columns. Each row is 12 units wide.</li>
                        <li><strong>Columns:</strong> The actual content containers. You specify how many units (out of 12) a column should take.</li>
                    </ul>
                    <CodeBlock
                        code={`<div class="container text-center">
  <div class="row">
    <div class="col-md-8">Main Content (8/12)</div>
    <div class="col-md-4">Sidebar (4/12)</div>
  </div>
</div>`}
                        language="html"
                    />
                </section>

                {/* Section 3: Breakpoints */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Responsive Breakpoints
                    </h2>
                    <p>
                        Bootstrap is <strong>mobile-first</strong>. This means classes like <code>col-6</code> apply to all screen sizes, while <code>col-md-6</code> only applies from the "medium" breakpoint and up.
                    </p>
                    <div className="overflow-x-auto bg-surface-800/50 rounded-xl border border-surface-700 p-4">
                        <table className="min-w-full text-sm text-surface-300">
                            <thead>
                                <tr className="border-b border-surface-700">
                                    <th className="text-left py-2 font-bold text-primary-400">Breakpoint</th>
                                    <th className="text-left py-2 font-bold text-primary-400">Class</th>
                                    <th className="text-left py-2 font-bold text-primary-400">Dimensions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-surface-800/50">
                                    <td className="py-2">Extra Small</td>
                                    <td className="py-2"><code>col-</code></td>
                                    <td className="py-2">&lt; 576px</td>
                                </tr>
                                <tr className="border-b border-surface-800/50">
                                    <td className="py-2">Small</td>
                                    <td className="py-2"><code>col-sm-</code></td>
                                    <td className="py-2">≥ 576px</td>
                                </tr>
                                <tr className="border-b border-surface-800/50">
                                    <td className="py-2">Medium</td>
                                    <td className="py-2"><code>col-md-</code></td>
                                    <td className="py-2">≥ 768px</td>
                                </tr>
                                <tr>
                                    <td className="py-2">Large</td>
                                    <td className="py-2"><code>col-lg-</code></td>
                                    <td className="py-2">≥ 992px</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">CDN Link</h4>
                            <p className="text-sm text-surface-400">
                                Quickest way to use Bootstrap: Add the CSS <code>&lt;link&gt;</code> to your <code>&lt;head&gt;</code> and JS <code>&lt;script&gt;</code> before the closing <code>&lt;/body&gt;</code> tag.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Card Component</h4>
                            <p className="text-sm text-surface-400">
                                Bootstrap Cards are perfect for blog posts, product listings, or user profiles. They include headers, footers, images, and body content.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
