import CodeBlock from '../../CodeBlock'
import { Target, Layers, CheckCircle2, GitBranch, MessageSquareQuote, Sparkles, AlertTriangle, ShoppingCart, CreditCard } from 'lucide-react'

export default function DeepDiveDay97() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Target className="w-6 h-6 text-primary-400" /> The Brief
                    </h2>
                    <div className="bg-surface-800/50 p-5 rounded-lg border border-surface-700">
                        <p className="italic text-surface-300 mb-4">
                            "Build a simple online shop with Flask. Users can browse products, add items to a cart, and proceed to a checkout page."
                        </p>
                        <h4 className="font-semibold text-surface-100 mb-2">Deliverables:</h4>
                        <ul className="list-disc list-inside space-y-1 text-surface-300">
                            <li>Product listing page with images and prices</li>
                            <li>Shopping cart with session storage</li>
                            <li>Checkout page with order summary</li>
                            <li>SQLite database for products</li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Layers className="w-6 h-6 text-primary-400" /> Recommended Tech Stack
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-surface-700 flex items-start gap-3">
                            <ShoppingCart className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-surface-100">Flask + SQLAlchemy</h4>
                                <p className="text-sm text-surface-400">Web framework with ORM.</p>
                            </div>
                        </div>
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-surface-700 flex items-start gap-3">
                            <CreditCard className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-surface-100">Flask-Session</h4>
                                <p className="text-sm text-surface-400">Server-side session for cart storage.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <GitBranch className="w-6 h-6 text-primary-400" /> Architecture Pattern
                    </h2>
                    <CodeBlock
                        code={`from flask import Flask, session, redirect

@app.route('/add-to-cart/<int:product_id>')
def add_to_cart(product_id):
    if 'cart' not in session:
        session['cart'] = []
    session['cart'].append(product_id)
    session.modified = True
    return redirect('/cart')

@app.route('/cart')
def view_cart():
    cart_items = Product.query.filter(
        Product.id.in_(session.get('cart', []))
    ).all()
    total = sum(item.price for item in cart_items)
    return render_template('cart.html', items=cart_items, total=total)`}
                        language="python"
                    />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <CheckCircle2 className="w-6 h-6 text-primary-400" /> Milestones
                    </h2>
                    <div className="space-y-3">
                        {[
                            { title: "Product Model", desc: "Create database model for products." },
                            { title: "Product Listing", desc: "Display products in a grid layout." },
                            { title: "Cart Logic", desc: "Implement add/remove/update cart." },
                            { title: "Checkout", desc: "Create order summary and confirmation." }
                        ].map((m, i) => (
                            <div key={i} className="flex gap-3 items-start bg-surface-800/30 p-4 rounded-lg border border-surface-700">
                                <span className="text-primary-400 font-bold">{i + 1}</span>
                                <div>
                                    <h4 className="font-semibold text-surface-100">{m.title}</h4>
                                    <p className="text-sm text-surface-400">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> <AlertTriangle className="w-6 h-6 text-amber-400" /> Common Pitfalls
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-amber-500/20">
                            <h4 className="font-semibold text-amber-300 mb-1">Session Security</h4>
                            <p className="text-sm text-surface-400">Use server-side sessions; never trust client-side cookies.</p>
                        </div>
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-amber-500/20">
                            <h4 className="font-semibold text-amber-300 mb-1">Price Tampering</h4>
                            <p className="text-sm text-surface-400">Always recalculate totals server-side, never from form data.</p>
                        </div>
                    </div>
                </section>
            </div>

            <aside className="space-y-6">
                <div className="bg-surface-800/40 p-5 rounded-xl border border-surface-700">
                    <h3 className="font-bold text-surface-100 mb-3 flex items-center gap-2">
                        <MessageSquareQuote className="w-5 h-5 text-primary-400" /> Interview Prep
                    </h3>
                    <ul className="space-y-3 text-sm text-surface-300">
                        <li className="flex gap-2 items-start">
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>"How would you integrate Stripe for real payment processing?"</span>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    )
}
