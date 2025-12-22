import CodeBlock from '../../CodeBlock'
import { Lightbulb, Rocket, Shield, Database, Terminal } from 'lucide-react'

export default function DeepDiveDay71() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Introduction to Deployment */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Rocket className="w-6 h-6 text-primary-400" /> From Local to Global
                    </h2>
                    <p>
                        Developing an application on your local machine is just the beginning. <strong>Deployment</strong> is the process of making your application accessible to users via the internet. This involves moving from the Flask development server (not suited for production) to robust, high-performance tools.
                    </p>
                    <p>
                        Key steps in deployment include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-surface-300">
                        <li>Setting up a <strong>Production WSGI Server</strong> (e.g., Gunicorn).</li>
                        <li>Managing <strong>Environment Variables</strong> for security.</li>
                        <li>Upgrading from <strong>SQLite to PostgreSQL</strong>.</li>
                        <li>Selecting a <strong>Hosting Provider</strong> (Render, Fly.io, Vercel, or Heroku).</li>
                    </ul>
                </section>

                {/* Section 2: Gunicorn (The WSGI Server) */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Terminal className="w-6 h-6 text-primary-400" /> The Role of Gunicorn
                    </h2>
                    <p>
                        The default <code>flask run</code> server is single-threaded and easily overwhelmed. In production, we use <strong>Gunicorn</strong> (Green Unicorn), a WSGI HTTP Server. It creates multiple "worker" processes to handle simultaneous requests.
                    </p>
                    <CodeBlock
                        code={`# Install gunicorn
pip install gunicorn

# Run your app with gunicorn
# format: gunicorn module_name:app_variable_name
gunicorn main:app`}
                        language="bash"
                    />
                    <p>
                        Gunicorn acts as a middleman between the internet and your Flask application, ensuring stability and performance.
                    </p>
                </section>

                {/* Section 3: Environment Variables */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <Shield className="w-6 h-6 text-primary-400" /> Environment Variables (Env Vars)
                    </h2>
                    <p>
                        Never hardcode sensitive data like <strong>API Keys</strong>, <strong>Database URLs</strong>, or <strong>Secret Keys</strong> in your source code. If you push these to GitHub, they are compromised.
                    </p>
                    <p>
                        Use <code>os.environ</code> to fetch values defined in your server's environment.
                    </p>
                    <CodeBlock
                        code={`import os

# BAD: Hardcoded secret
# app.config['SECRET_KEY'] = 'super-secret-123'

# GOOD: Using environment variables
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY')
db_path = os.environ.get('DATABASE_URL')`}
                        language="python"
                    />
                    <p className="italic text-surface-400 text-sm">
                        Tip: Locally, use a <code>.env</code> file with <code>python-dotenv</code> to simulate production environment variables.
                    </p>
                </section>

                {/* Section 4: Upgrading to PostgreSQL */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <Database className="w-6 h-6 text-primary-400" /> From SQLite to PostgreSQL
                    </h2>
                    <p>
                        SQLite is a file-based database, great for local development. However, most hosting providers use ephemeral file systems, meaning your <code>.db</code> file would be deleted every time your server restarts.
                    </p>
                    <p>
                        <strong>PostgreSQL</strong> is a powerful, production-ready relational database that runs as a separate service.
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-surface-300">
                        <li><strong>Scalable:</strong> Handles thousands of concurrent users.</li>
                        <li><strong>Persistent:</strong> Data is stored independently of the web server.</li>
                        <li><strong>Standards:</strong> Strict adherence to SQL standards.</li>
                    </ul>
                    <CodeBlock
                        code={`# Common SQLAlchemy connection string for Postgres
postgresql://username:password@host:port/database_name`}
                        language="python"
                    />
                </section>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Requirements.txt</h4>
                            <p className="text-sm text-surface-400">
                                Always run <code>pip freeze &gt; requirements.txt</code>. This tells the hosting provider exactly which libraries to install to run your app.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Procfile</h4>
                            <p className="text-sm text-surface-400">
                                Platforms like Heroku and Render use a <code>Procfile</code> to know how to start your web server: <code>web: gunicorn main:app</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Port 5000</h4>
                            <p className="text-sm text-surface-400">
                                In production, never hardcode the port. Use <code>os.environ.get('PORT', 5000)</code> as platforms assign random ports to your application.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
