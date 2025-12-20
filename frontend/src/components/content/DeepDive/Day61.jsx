import React from 'react';
import CodeBlock from '../../CodeBlock';
import { Lightbulb } from 'lucide-react';

export default function DeepDiveDay61() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Introduction to Flask-WTF */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> What is Flask-WTF?
                    </h2>
                    <p>
                        <strong>Flask-WTF</strong> is an extension that integrates the <strong>WTForms</strong> library with Flask. It simplifies form handling by providing:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>CSRF Protection:</strong> Automatic token generation and validation.</li>
                        <li><strong>Form Validation:</strong> Built-in validators like <code>DataRequired</code>, <code>Email</code>, <code>Length</code>.</li>
                        <li><strong>Form Rendering:</strong> Easy template integration with Jinja2.</li>
                    </ul>
                    <CodeBlock
                        code={`pip install Flask-WTF`}
                        language="bash"
                    />
                </section>

                {/* Section 2: Creating a FlaskForm */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Creating a FlaskForm Class
                    </h2>
                    <p>
                        Instead of manually parsing <code>request.form</code>, you define a Python class that describes your form fields. Each field becomes an attribute of the form object.
                    </p>
                    <CodeBlock
                        code={`from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')`}
                        language="python"
                    />
                </section>

                {/* Section 3: Handling Form Submission */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Handling Form Submission
                    </h2>
                    <p>
                        The magic method <code>validate_on_submit()</code> checks if the form was submitted via POST <em>and</em> all validators passed. If true, you can safely access the data.
                    </p>
                    <CodeBlock
                        code={`@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        # Access validated data
        print(f"Email: {form.email.data}")
        print(f"Password: {form.password.data}")
        return redirect(url_for('success'))
    return render_template('login.html', form=form)`}
                        language="python"
                    />
                </section>

                {/* Section 4: Rendering Forms in Templates */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Rendering Forms in Templates
                    </h2>
                    <p>
                        In your Jinja2 template, use the form object to render fields. The <code>hidden_tag()</code> method renders the CSRF token.
                    </p>
                    <CodeBlock
                        code={`<form method="POST">
    {{ form.hidden_tag() }}
    <div>
        {{ form.email.label }}
        {{ form.email(class="form-control") }}
    </div>
    <div>
        {{ form.password.label }}
        {{ form.password(class="form-control") }}
    </div>
    {{ form.submit(class="btn btn-primary") }}
</form>`}
                        language="html"
                    />
                </section>

                {/* Section 5: Template Inheritance */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Jinja2 Template Inheritance
                    </h2>
                    <p>
                        Create a <strong>base template</strong> with common structure (navbar, footer) and define <code>blocks</code> that child templates can override.
                    </p>
                    <CodeBlock
                        code={`<!-- base.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}{% endblock %}</title>
</head>
<body>
    <nav>My Site</nav>
    {% block content %}{% endblock %}
</body>
</html>

<!-- login.html -->
{% extends 'base.html' %}
{% block title %}Login{% endblock %}
{% block content %}
<h1>Login Page</h1>
{{ your_form_here }}
{% endblock %}`}
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">SECRET_KEY Required</h4>
                            <p className="text-sm text-surface-400">
                                Flask-WTF requires <code>app.config['SECRET_KEY']</code> to be set for CSRF protection. Use a long, random string.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Validator Errors</h4>
                            <p className="text-sm text-surface-400">
                                Access validation errors via <code>{"form.email.errors"}</code> in your template to display messages to the user.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Bootstrap-Flask</h4>
                            <p className="text-sm text-surface-400">
                                Consider using the <code>Bootstrap-Flask</code> extension to automatically style your WTForms with Bootstrap classes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
