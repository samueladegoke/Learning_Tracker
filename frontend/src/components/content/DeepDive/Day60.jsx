import React from 'react';
import CodeBlock from '../../CodeBlock';
import { Lightbulb } from 'lucide-react';

export default function DeepDiveDay60() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: POST Requests and HTML Forms */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> POST Requests and HTML Forms
                    </h2>
                    <p>
                        So far, we've mostly used <strong>GET</strong> requests to retrieve data. However, when a user submits sensitive information (like in a contact form), we use <strong>POST</strong>.
                    </p>
                    <p>
                        In HTML, your <code>&lt;form&gt;</code> tag needs two critical attributes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>action:</strong> The URL where the data should be sent.</li>
                        <li><strong>method:</strong> Set this to <code>"POST"</code>.</li>
                    </ul>
                    <CodeBlock
                        code={`<form action="/login" method="POST">
    <input type="text" name="username" placeholder="Username">
    <input type="password" name="password" placeholder="Password">
    <button type="submit">Login</button>
</form>`}
                        language="html"
                    />
                </section>

                {/* Section 2: Handling POST in Flask */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Handling Data in Flask
                    </h2>
                    <p>
                        By default, Flask routes only handle GET requests. To handle POST, you must update the <code>methods</code> argument in the decorator.
                    </p>
                    <CodeBlock
                        code={`from flask import request

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # Data is accessed via request.form
        user = request.form["username"]
        pw = request.form["password"]
        return f"<h1>Name: {user}, Password: {pw}</h1>"
    return render_template("login.html")`}
                        language="python"
                    />
                </section>

                {/* Section 3: Sending Emails with smtplib */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Automating Emails with smtplib
                    </h2>
                    <p>
                        Python's built-in <code>smtplib</code> module allows you to send emails programmatically. This is perfect for contact form notifications.
                    </p>
                    <CodeBlock
                        code={`import smtplib

# Securely connecting and sending
with smtplib.SMTP("smtp.gmail.com") as connection:
    connection.starttls()  # Secure the connection
    connection.login(user=MY_EMAIL, password=MY_PASSWORD)
    connection.sendmail(
        from_addr=MY_EMAIL,
        to_addrs=RECIPIENT_EMAIL,
        msg="Subject:Hello\\n\\nThis is the message body."
    )`}
                        language="python"
                    />
                </section>

                {/* Section 4: Blog Capstone Part 3 */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Capstone: The Contact Form
                    </h2>
                    <p>
                        In the final stage of the blog project, you'll build the <code>/contact</code> route. It will:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Render the contact page (GET).</li>
                        <li>Receive input from the form (POST).</li>
                        <li>Send you an email with the visitor's message using <code>smtplib</code>.</li>
                        <li>Render a success message or redirect the user.</li>
                    </ol>
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Name Attribute</h4>
                            <p className="text-sm text-surface-400">
                                The <code>name</code> attribute in your <code>&lt;input&gt;</code> tags acts as the <strong>key</strong> when you retrieve data in Flask.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">App Passwords</h4>
                            <p className="text-sm text-surface-400">
                                If using Gmail, you'll need to generate an <strong>App Password</strong> to allow your script to log in securely.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
