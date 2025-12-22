import CodeBlock from '../../CodeBlock'
import { Lightbulb, Globe, Server, Database, Layout, Shield } from 'lucide-react'

export default function DeepDiveDay83() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Flask Portfolio Projects */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Globe className="w-6 h-6 text-primary-400" /> Web Development Portfolio
                    </h2>
                    <p>
                        Portfolio projects demonstrate your ability to build <strong>full-stack web applications</strong>. Flask provides the backend; you can add any frontend you like.
                    </p>
                    <CodeBlock
                        code={`from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/data", methods=["POST"])
def api_data():
    data = request.get_json()
    # Process the data
    result = process(data)
    return jsonify({"result": result})

if __name__ == "__main__":
    app.run(debug=True)`}
                        language="python"
                    />
                </section>

                {/* Section 2: RESTful API Design */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Server className="w-6 h-6 text-primary-400" /> RESTful API Design
                    </h2>
                    <p>
                        A well-designed API follows REST conventions: use HTTP methods (GET, POST, PUT, DELETE) and proper status codes.
                    </p>
                    <CodeBlock
                        code={`from flask import Flask, jsonify, request, abort

app = Flask(__name__)
items = []

@app.route("/api/items", methods=["GET"])
def get_items():
    return jsonify(items), 200

@app.route("/api/items", methods=["POST"])
def create_item():
    if not request.json or "name" not in request.json:
        abort(400)  # Bad Request
    item = {"id": len(items) + 1, "name": request.json["name"]}
    items.append(item)
    return jsonify(item), 201  # Created

@app.route("/api/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    item = next((i for i in items if i["id"] == item_id), None)
    if item is None:
        abort(404)  # Not Found
    items.remove(item)
    return "", 204  # No Content`}
                        language="python"
                    />
                </section>

                {/* Section 3: Database Integration */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <Database className="w-6 h-6 text-primary-400" /> Database with SQLAlchemy
                    </h2>
                    <p>
                        Use SQLAlchemy ORM to interact with databases without writing raw SQL.
                    </p>
                    <CodeBlock
                        code={`from flask_sqlalchemy import SQLAlchemy

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    
    def to_dict(self):
        return {"id": self.id, "username": self.username}

# Create tables
with app.app_context():
    db.create_all()`}
                        language="python"
                    />
                </section>

                {/* Section 4: Templates and Static Files */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <Layout className="w-6 h-6 text-primary-400" /> Jinja Templates
                    </h2>
                    <p>
                        Jinja2 templates let you generate dynamic HTML. Use template inheritance to avoid repetition.
                    </p>
                    <CodeBlock
                        code={`{# templates/base.html #}
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}My App{% endblock %}</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
</head>
<body>
    {% block content %}{% endblock %}
</body>
</html>

{# templates/home.html #}
{% extends "base.html" %}
{% block title %}Home{% endblock %}
{% block content %}
    <h1>Welcome, {{ user.username }}!</h1>
{% endblock %}`}
                        language="html"
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1"><Shield className="w-4 h-4 inline" /> Security</h4>
                            <p className="text-sm text-surface-400">
                                Never trust user input. Use <code>escape()</code> and parameterized queries to prevent XSS and SQL injection.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Blueprints</h4>
                            <p className="text-sm text-surface-400">
                                For larger apps, use Flask Blueprints to organize routes into modules.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Portfolio Ideas</h4>
                            <p className="text-sm text-surface-400">
                                Blog, task manager, URL shortener, weather dashboard, portfolio website.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
