import React from 'react';
import CodeBlock from '../../CodeBlock';
import { Lightbulb } from 'lucide-react';

export default function DeepDiveDay56() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: render_template */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Rendering HTML with render_template()
                    </h2>
                    <p>
                        In the early days of Flask, we might have returned hardcoded HTML strings from our routes. However, for real applications, we separate logic (Python) from presentation (HTML) using <strong>Templates</strong>.
                    </p>
                    <p>
                        Flask uses the <strong>Jinja2</strong> templating engine. By default, Flask looks for templates in a directory named <code>templates</code>.
                    </p>
                    <CodeBlock
                        code={`from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")`}
                        language="python"
                    />
                    <div className="bg-surface-800/50 p-6 rounded-xl border border-surface-700">
                        <h3 className="text-lg font-semibold text-primary-400 mb-3">Folder Structure</h3>
                        <pre className="text-xs bg-surface-900/50 p-2 rounded">
                            main.py
                            templates/
                            index.html
                        </pre>
                    </div>
                </section>

                {/* Section 2: Serving Static Files */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Serving Static Files
                    </h2>
                    <p>
                        Images, CSS files, and JavaScript files are called <strong>static files</strong> because they are served exactly as they are on the disk. Flask looks for these in a directory named <code>static</code>.
                    </p>
                    <p>
                        To link a static file in your HTML, use the <code>url_for()</code> function. This ensures that the paths remain correct even if the base URL of your application changes.
                    </p>
                    <CodeBlock
                        code={`<!-- In templates/index.html -->
<head>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/styles.css') }}">
</head>
<body>
    <img src="{{ url_for('static', filename='images/profile.jpg') }}">
</body>`}
                        language="html"
                    />
                </section>

                {/* Section 3: Using Website Templates */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Using Website Templates
                    </h2>
                    <p>
                        Instead of building every site from scratch, you can use high-quality templates from sites like <strong>HTML5 UP</strong>. The process involves:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Downloading the template and extracting the files.</li>
                        <li>Moving the <code>.html</code> files into your <code>templates</code> folder.</li>
                        <li>Moving the <code>assets</code> folder (CSS, JS, Fonts) into your <code>static</code> folder.</li>
                        <li>Updating all <code>href</code> and <code>src</code> attributes to use <code>url_for('static', filename='...')</code>.</li>
                    </ul>
                </section>

                {/* Section 4: Dynamic Templates */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Dynamic Template Rendering
                    </h2>
                    <p>
                        The power of templates is passing data from Python into the HTML. You can pass any number of variables as keyword arguments to <code>render_template()</code>.
                    </p>
                    <CodeBlock
                        code={`@app.route("/profile/<name>")
def profile(name):
    return render_template("profile.html", username=name, status="Online")

# Inside profile.html:
# <h1>Welcome, {{ username }}!</h1>
# <p>Status: {{ status }}</p>`}
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Global Replace</h4>
                            <p className="text-sm text-surface-400">
                                When updating a template, use find-and-replace to change <code>{'src="images/'}</code> to <code>{'src="{{ url_for(\'static\', filename=\'images/\') }}'}</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Static Folder</h4>
                            <p className="text-sm text-surface-400">
                                Always keep your assets organized in subfolders inside <code>static/</code> (e.g., <code>css/</code>, <code>js/</code>, <code>images/</code>).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
