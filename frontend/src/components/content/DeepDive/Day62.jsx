import React from 'react';
import CodeBlock from '../../CodeBlock';
import { Lightbulb } from 'lucide-react';

export default function DeepDiveDay62() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Project Overview */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Coffee & Wifi Project Overview
                    </h2>
                    <p>
                        Today you'll build a <strong>cafe rating</strong> website where users can submit information about cafes, including their coffee quality, wifi strength, and power outlet availability.
                    </p>
                    <p>
                        The data is stored in a simple <strong>CSV file</strong> rather than a database, demonstrating file-based persistence.
                    </p>
                </section>

                {/* Section 2: SelectField for Ratings */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> SelectField for Dropdown Menus
                    </h2>
                    <p>
                        For ratings like coffee quality, we use <code>SelectField</code> to create dropdown menus with emoji-based choices.
                    </p>
                    <CodeBlock
                        code={`from wtforms import SelectField

class CafeForm(FlaskForm):
    coffee_rating = SelectField('Coffee Rating', choices=[
        ('☕', '☕'),
        ('☕☕', '☕☕'),
        ('☕☕☕', '☕☕☕'),
        ('☕☕☕☕', '☕☕☕☕'),
        ('☕☕☕☕☕', '☕☕☕☕☕')
    ])`}
                        language="python"
                    />
                </section>

                {/* Section 3: Reading CSV Files */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Reading CSV Data
                    </h2>
                    <p>
                        Python's built-in <code>csv</code> module makes it easy to read and parse CSV files.
                    </p>
                    <CodeBlock
                        code={`import csv

with open('cafe-data.csv', 'r', encoding='utf-8') as file:
    reader = csv.reader(file)
    header = next(reader)  # Skip header row
    cafes = list(reader)

# cafes is now a list of lists
# [['Cafe Name', 'London', '☕☕☕', '💪💪'], ...]`}
                        language="python"
                    />
                </section>

                {/* Section 4: Writing to CSV */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Appending to a CSV File
                    </h2>
                    <p>
                        When a user submits the form, append their data as a new row. Use mode <code>'a'</code> and <code>newline=''</code>.
                    </p>
                    <CodeBlock
                        code={`import csv

@app.route('/add', methods=['GET', 'POST'])
def add_cafe():
    form = CafeForm()
    if form.validate_on_submit():
        with open('cafe-data.csv', mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([
                form.cafe_name.data,
                form.location.data,
                form.coffee_rating.data,
                form.wifi_rating.data
            ])
        return redirect(url_for('cafes'))
    return render_template('add.html', form=form)`}
                        language="python"
                    />
                </section>

                {/* Section 5: Bootstrap-Flask Integration */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Bootstrap-Flask Quick Forms
                    </h2>
                    <p>
                        Bootstrap-Flask provides a macro to quickly render styled forms.
                    </p>
                    <CodeBlock
                        code={`{% from 'bootstrap5/form.html' import render_form %}

<div class="container">
    <h1>Add a New Cafe</h1>
    {{ render_form(form) }}
</div>`}
                        language="html"
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">newline=''</h4>
                            <p className="text-sm text-surface-400">
                                Always use <code>newline=''</code> when opening CSV files for writing on Windows to prevent extra blank rows.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Encoding</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>encoding='utf-8'</code> to properly handle special characters like emojis in your CSV data.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">URL Validator</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>URL()</code> validator for map links to ensure users enter valid URLs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
