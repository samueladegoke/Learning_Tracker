import CodeBlock from '../../CodeBlock'
import { Lightbulb, Rocket, Target, Layers, ListChecks, AlertTriangle, MessageSquare, Star, Globe, Server, Shield } from 'lucide-react'

export default function DeepDiveDay83() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-12">

                {/* 01. The Brief */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-amber-400">01.</span>
                        <Rocket className="w-6 h-6 text-amber-400" />
                        The Brief
                    </h2>
                    <div className="bg-surface-800/40 p-6 rounded-xl border border-surface-700/50 shadow-inner italic text-surface-200">
                        "Build a professional personal portfolio website using Flask to showcase your projects and skills. The site should be modular, secure, and ready for deployment."
                        <div className="mt-4 not-italic space-y-2">
                            <p className="font-bold text-white text-sm">Deliverables:</p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                <li>Flask server with dynamic routing</li>
                                <li>Jinja2 template inheritance for DRY codebase</li>
                                <li>Projects section powered by a data structure or database</li>
                                <li>Contact form with email notification system</li>
                                <li>Responsive UI with modern CSS</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 02. Architecture */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-amber-400">02.</span>
                        <Layers className="w-6 h-6 text-amber-400" />
                        System Architecture
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-surface-800/20 border border-surface-700/50">
                            <h4 className="font-bold text-white text-sm mb-2">Core Pattern</h4>
                            <p className="text-sm text-surface-300">MVC (Model-View-Controller) lite with Server-Side Rendering (SSR) via Flask and Jinja2.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface-800/20 border border-surface-700/50">
                            <h4 className="font-bold text-white text-sm mb-2">Data Flow</h4>
                            <p className="text-sm text-surface-300">Client Request → Flask Route Handler → Data Retrieval (JSON/Dict) → Jinja2 Context Injector → HTML Response.</p>
                        </div>
                    </div>
                    <CodeBlock
                        code={`@app.route("/projects")
def projects():
    all_projects = db.get_all() # Or a locally defined list
    return render_template("projects.html", projects=all_projects)`}
                        language="python"
                    />
                </section>

                {/* 03. Milestones */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-amber-400">03.</span>
                        <ListChecks className="w-6 h-6 text-amber-400" />
                        Action Plan
                    </h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-amber-400 font-bold">1</div>
                            <div>
                                <h4 className="text-white font-bold">Setup & Routing</h4>
                                <p className="text-sm text-surface-300">Initialize Flask and create a base.html template with the header/footer.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-amber-400 font-bold">2</div>
                            <div>
                                <h4 className="text-white font-bold">Project Catalog</h4>
                                <p className="text-sm text-surface-300">Create a JSON structure for your projects and map it to a dynamic view.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-amber-400 font-bold">3</div>
                            <div>
                                <h4 className="text-white font-bold">Integration</h4>
                                <p className="text-sm text-surface-300">Implement smtplib to send emails from the contact form.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 04. Pitfalls */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-amber-400">04.</span>
                        <AlertTriangle className="w-6 h-6 text-amber-400" />
                        Common Pitfalls
                    </h2>
                    <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                            <h4 className="font-bold text-red-400 text-sm">Hardcoded Secrets</h4>
                            <p className="text-xs text-red-300/60 mt-1">Never put your email password or API keys directly in app.py. Use environment variables.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                            <h4 className="font-bold text-red-400 text-sm">Static Asset Paths</h4>
                            <p className="text-xs text-red-300/60 mt-1">Forgetting to use <code>{"{{ url_for('static', filename='...') }}"}</code> causes broken CSS/Images on deployment.</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Recommended Tech Stack */}
                <div className="bg-surface-800/30 p-6 rounded-2xl border border-surface-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-amber-400" /> Recommended Stack
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-700/30 border border-surface-600/30">
                            <Server className="w-5 h-5 text-blue-400" />
                            <div>
                                <p className="text-xs font-bold text-white">Flask</p>
                                <p className="text-[10px] text-surface-400">Micro-framework</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-700/30 border border-surface-600/30">
                            <Globe className="w-5 h-5 text-green-400" />
                            <div>
                                <p className="text-xs font-bold text-white">Bootstrap/Tailwind</p>
                                <p className="text-[10px] text-surface-400">Frontend Styling</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-700/30 border border-surface-600/30">
                            <Shield className="w-5 h-5 text-purple-400" />
                            <div>
                                <p className="text-xs font-bold text-white">Python Dotenv</p>
                                <p className="text-[10px] text-surface-400">Secrets Management</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interview Prep */}
                <div className="bg-surface-800/30 p-6 rounded-2xl border border-surface-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-amber-400" /> Interview Prep
                    </h3>
                    <div className="space-y-4 text-sm text-surface-300">
                        <div>
                            <p className="font-bold text-white mb-1">State Management</p>
                            <p className="text-[11px] leading-relaxed">"How would you handle user sessions for a logged-in admin area?" (Expect: Flask Session/Cookies explanation)</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-1">Template Inheritance</p>
                            <p className="text-[11px] leading-relaxed">"What is the benefit of Jinja2 template inheritance?" (Expect: DRY principles, central layout management)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
