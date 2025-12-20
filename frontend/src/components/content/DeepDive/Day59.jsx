import React from 'react';
import CodeBlock from '../../CodeBlock';
import { Lightbulb } from 'lucide-react';

export default function DeepDiveDay59() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Jinja Includes */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Template Modularity with Include
                    </h2>
                    <p>
                        In large projects, repeating the same HTML (like navbars or footers) across multiple pages is inefficient. Jinja allows you to create separate files for these components and <strong>include</strong> them where needed.
                    </p>
                    <CodeBlock
                        code={`<!-- In header.html -->
<header>My Awesome Blog</header>

<!-- In index.html -->
{% include "header.html" %}
<h1>Home Page</h1>
{% include "footer.html" %}`}
                        language="html"
                    />
                </section>

                {/* Section 2: Blog Application Structure */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Blog Application Architecture
                    </h2>
                    <p>
                        A typical blog application involves fetching posts from a data source (like a JSON file or an API) and rendering them dynamically.
                    </p>
                    <CodeBlock
                        code={`import requests
from flask import render_template

@app.route("/")
def home():
    blog_url = "https://api.npoint.io/your-id"
    response = requests.get(blog_url)
    all_posts = response.json()
    return render_template("index.html", posts=all_posts)`}
                        language="python"
                    />
                </section>

                {/* Section 3: Dynamic Routing for Posts */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Dynamic Post Routing
                    </h2>
                    <p>
                        To view a specific post, you use path parameters in your routes. The post ID is passed to the route function, used to find the specific post, and then sent to a detailed post template.
                    </p>
                    <CodeBlock
                        code={`@app.route("/post/<int:index>")
def show_post(index):
    requested_post = None
    for blog_post in all_posts:
        if blog_post["id"] == index:
            requested_post = blog_post
    return render_template("post.html", post=requested_post)`}
                        language="python"
                    />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">DRY Principle</h4>
                            <p className="text-sm text-surface-400">
                                Don't Repeat Yourself! If you find yourself copying HTML between templates, it's time to use <code>{"{% include %}"}</code> or <strong>Template Inheritance</strong>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">API Mocking</h4>
                            <p className="text-sm text-surface-400">
                                Use tools like <strong>npoint.io</strong> to create a mock JSON API for your blog posts while you're still developing the front-end.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
