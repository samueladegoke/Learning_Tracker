import React from 'react';
import CodeBlock from '../../CodeBlock';
import { Lightbulb } from 'lucide-react';

export default function DeepDiveDay57() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Jinja Expressions */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Jinja Expressions: Double Curly Braces
                    </h2>
                    <p>
                        When you want to <strong>output</strong> data in your HTML, you use double curly braces <code>{`{{ ... }}`}</code>. Think of this as the "print" statement of the template world.
                    </p>
                    <p>
                        You can perform simple Python operations inside these braces, such as string concatenation or mathematical additions.
                    </p>
                    <CodeBlock
                        code={`<!-- index.html -->
<h1>Welcome, {{ user_name }}!</h1>
<p>You have {{ 5 + 2 }} notifications.</p>
<p>Year: {{ current_year }}</p>`}
                        language="html"
                    />
                </section>

                {/* Section 2: Control Logic */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Control Logic: If and For
                    </h2>
                    <p>
                        For any logic that doesn't directly output a value (like loops or conditionals), we use <code>{`{% ... %}`}</code>. Unlike Python, Jinja requires explicit closing tags like <code>{'{% endif %}'}</code> or <code>{'{% endfor %}'}</code>.
                    </p>
                    <CodeBlock
                        code={`<!-- Conditionals -->
{% if age >= 18 %}
    <p>Welcome to the adult section.</p>
{% else %}
    <p>A parent must accompany you.</p>
{% endif %}

<!-- Loops -->
<ul>
{% for item in items_list: %}
    <li>{{ item }}</li>
{% endfor %}
</ul>`}
                        language="html"
                    />
                </section>

                {/* Section 3: Combining with APIs */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> API Integration in Routes
                    </h2>
                    <p>
                        One of the most powerful uses of templates is displaying data fetched from external APIs. In your Flask route, you use the <code>requests</code> library, parse the JSON, and pass the data to <code>render_template</code>.
                    </p>
                    <CodeBlock
                        code={`import requests
from flask import render_template

@app.route("/guess/<name>")
def guess(name):
    # Fetch predicted age from Agify API
    age_response = requests.get(f"https://api.agify.io?name={name}")
    age_data = age_response.json()
    predicted_age = age_data["age"]
    
    return render_template("guess.html", person_name=name, age=predicted_age)`}
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Loop Helpers</h4>
                            <p className="text-sm text-surface-400">
                                Inside a <code>for</code> loop, Jinja provides a <code>loop</code> helper. For example, <code>loop.index</code> gives you the current count (starting from 1).
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Server Comments</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>{'{# comment #}'}</code> for notes that shouldn't appear in the browser's "View Source".
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
