import CodeBlock from '../../CodeBlock'
import { Lightbulb } from 'lucide-react'

export default function DeepDiveDay66() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: What is REST? */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> What is REST?
                    </h2>
                    <p>
                        <strong>REST</strong> stands for <strong>REpresentational State Transfer</strong>—an architectural style for designing web APIs. It was proposed by Roy Fielding in his PhD dissertation and has become the gold standard for building web services.
                    </p>
                    <p>
                        A RESTful API follows specific rules that make it predictable and easy to use. The two most important principles are:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Use HTTP Verbs:</strong> GET, POST, PUT, PATCH, DELETE</li>
                        <li><strong>Use consistent URL patterns:</strong> Resources are accessed via logical endpoints</li>
                    </ul>
                    <p>
                        Think of REST like a standardized menu at every restaurant. If all restaurants used the same layout, you'd always know where to find what you're looking for!
                    </p>
                </section>

                {/* Section 2: HTTP Verbs */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> HTTP Verbs & CRUD
                    </h2>
                    <p>
                        HTTP verbs map directly to database CRUD operations:
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border border-surface-700 rounded-lg overflow-hidden">
                            <thead className="bg-surface-800">
                                <tr>
                                    <th className="px-4 py-2 text-left text-surface-300">HTTP Verb</th>
                                    <th className="px-4 py-2 text-left text-surface-300">CRUD</th>
                                    <th className="px-4 py-2 text-left text-surface-300">Purpose</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-700">
                                <tr><td className="px-4 py-2 font-mono text-primary-400">GET</td><td className="px-4 py-2">Read</td><td className="px-4 py-2">Fetch resources</td></tr>
                                <tr><td className="px-4 py-2 font-mono text-primary-400">POST</td><td className="px-4 py-2">Create</td><td className="px-4 py-2">Create new resources</td></tr>
                                <tr><td className="px-4 py-2 font-mono text-primary-400">PUT</td><td className="px-4 py-2">Update</td><td className="px-4 py-2">Replace entire resource</td></tr>
                                <tr><td className="px-4 py-2 font-mono text-primary-400">PATCH</td><td className="px-4 py-2">Update</td><td className="px-4 py-2">Update part of resource</td></tr>
                                <tr><td className="px-4 py-2 font-mono text-primary-400">DELETE</td><td className="px-4 py-2">Delete</td><td className="px-4 py-2">Remove resources</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Section 3: PUT vs PATCH */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> PUT vs PATCH
                    </h2>
                    <p>
                        <strong>PUT</strong> replaces the entire resource—like receiving a brand new bicycle when only the wheel was broken.
                    </p>
                    <p>
                        <strong>PATCH</strong> updates only the specific part—like receiving just the replacement wheel. It's more efficient!
                    </p>
                    <CodeBlock
                        code={`# PUT - Replace entire cafe record
@app.route('/update-cafe/<int:cafe_id>', methods=['PUT'])
def update_cafe(cafe_id):
    cafe = db.get_or_404(Cafe, cafe_id)
    cafe.name = request.form.get('name')
    cafe.location = request.form.get('location')
    cafe.coffee_price = request.form.get('coffee_price')
    # ALL fields must be provided
    db.session.commit()
    return jsonify(response={"success": "Cafe updated."})

# PATCH - Update only the price
@app.route('/update-price/<int:cafe_id>', methods=['PATCH'])
def update_price(cafe_id):
    cafe = db.get_or_404(Cafe, cafe_id)
    new_price = request.args.get('new_price')
    cafe.coffee_price = new_price
    # Only one field updated
    db.session.commit()
    return jsonify(response={"success": "Price updated."})`}
                        language="python"
                    />
                </section>

                {/* Section 4: Building a Flask API */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Building a Flask API
                    </h2>
                    <p>
                        Flask's <code>jsonify()</code> function converts Python dictionaries into JSON responses—the standard format for APIs.
                    </p>
                    <CodeBlock
                        code={`from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
import random

app = Flask(__name__)
db = SQLAlchemy(app)

@app.route('/random')
def get_random_cafe():
    result = db.session.execute(db.select(Cafe))
    all_cafes = result.scalars().all()
    random_cafe = random.choice(all_cafes)
    
    # Serialize to JSON
    return jsonify(
        cafe={
            "name": random_cafe.name,
            "location": random_cafe.location,
            "coffee_price": random_cafe.coffee_price,
            "has_wifi": random_cafe.has_wifi
        }
    )`}
                        language="python"
                    />
                </section>

                {/* Section 5: RESTful URL Patterns */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> RESTful URL Patterns
                    </h2>
                    <p>
                        RESTful APIs use consistent URL structures for accessing resources:
                    </p>
                    <CodeBlock
                        code={`# Collection endpoints (all items)
GET    /cafes          → Fetch all cafes
POST   /cafes          → Create new cafe
DELETE /cafes          → Delete all cafes

# Individual resource endpoints
GET    /cafes/1        → Fetch cafe with id=1
PUT    /cafes/1        → Replace cafe with id=1
PATCH  /cafes/1        → Update cafe with id=1
DELETE /cafes/1        → Delete cafe with id=1

# Search/filter endpoints
GET    /cafes/search?loc=London  → Find cafes in London`}
                        language="bash"
                    />
                    <p>
                        The URL represents the <strong>resource</strong>, and the HTTP verb represents the <strong>action</strong>. This separation makes APIs intuitive and predictable.
                    </p>
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Postman</h4>
                            <p className="text-sm text-surface-400">
                                Use <strong>Postman</strong> to test your API endpoints. It lets you send any HTTP verb with custom headers and body data.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">to_dict() Method</h4>
                            <p className="text-sm text-surface-400">
                                Add a <code>to_dict()</code> method to your SQLAlchemy models for easy serialization instead of manually building dictionaries.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">HTTP Status Codes</h4>
                            <p className="text-sm text-surface-400">
                                Always return appropriate status codes: <code>200</code> (OK), <code>201</code> (Created), <code>404</code> (Not Found), <code>400</code> (Bad Request).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
