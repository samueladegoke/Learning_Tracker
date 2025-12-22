import CodeBlock from '../../CodeBlock'
import { Lightbulb } from 'lucide-react'

export default function DeepDiveDay67() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: RESTful Blog Overview */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> RESTful Blog Architecture
                    </h2>
                    <p>
                        Today we upgrade our blog to follow <strong>RESTful principles</strong>. Instead of separate routes for every action, we'll use HTTP verbs on consistent endpoints.
                    </p>
                    <p>
                        Our blog needs these core operations:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>GET</strong> /posts — View all blog posts</li>
                        <li><strong>GET</strong> /posts/&lt;id&gt; — View single post</li>
                        <li><strong>POST</strong> /new-post — Create new post</li>
                        <li><strong>PUT</strong> /edit-post/&lt;id&gt; — Update post</li>
                        <li><strong>DELETE</strong> /delete/&lt;id&gt; — Remove post</li>
                    </ul>
                </section>

                {/* Section 2: GET - Fetching Posts */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> GET — Fetching Posts
                    </h2>
                    <p>
                        The homepage fetches all posts from the database and renders them using Jinja templates.
                    </p>
                    <CodeBlock
                        code={`@app.route('/')
def get_all_posts():
    result = db.session.execute(db.select(BlogPost))
    posts = result.scalars().all()
    return render_template("index.html", all_posts=posts)

@app.route("/post/<int:post_id>")
def show_post(post_id):
    requested_post = db.get_or_404(BlogPost, post_id)
    return render_template("post.html", post=requested_post)`}
                        language="python"
                    />
                </section>

                {/* Section 3: POST - Creating Posts */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> POST — Creating Posts
                    </h2>
                    <p>
                        The <code>/new-post</code> route handles both displaying the form (GET) and processing submissions (POST).
                    </p>
                    <CodeBlock
                        code={`@app.route("/new-post", methods=["GET", "POST"])
def add_new_post():
    form = CreatePostForm()
    if form.validate_on_submit():
        new_post = BlogPost(
            title=form.title.data,
            subtitle=form.subtitle.data,
            body=form.body.data,
            author=form.author.data,
            date=date.today().strftime("%B %d, %Y")
        )
        db.session.add(new_post)
        db.session.commit()
        return redirect(url_for("get_all_posts"))
    return render_template("make-post.html", form=form)`}
                        language="python"
                    />
                </section>

                {/* Section 4: PUT/PATCH - Editing Posts */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Edit Posts
                    </h2>
                    <p>
                        Editing reuses the same form as creating, but pre-populates fields with existing data using the <code>obj</code> parameter.
                    </p>
                    <CodeBlock
                        code={`@app.route("/edit-post/<int:post_id>", methods=["GET", "POST"])
def edit_post(post_id):
    post = db.get_or_404(BlogPost, post_id)
    # Pre-populate form with existing post data
    edit_form = CreatePostForm(
        title=post.title,
        subtitle=post.subtitle,
        author=post.author,
        body=post.body
    )
    if edit_form.validate_on_submit():
        post.title = edit_form.title.data
        post.subtitle = edit_form.subtitle.data
        post.author = edit_form.author.data
        post.body = edit_form.body.data
        db.session.commit()
        return redirect(url_for("show_post", post_id=post.id))
    return render_template("make-post.html", form=edit_form, is_edit=True)`}
                        language="python"
                    />
                </section>

                {/* Section 5: DELETE - Removing Posts */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> DELETE — Removing Posts
                    </h2>
                    <p>
                        Delete operations remove posts from the database. We use a simple GET route triggered by clicking a delete button.
                    </p>
                    <CodeBlock
                        code={`@app.route("/delete/<int:post_id>")
def delete_post(post_id):
    post_to_delete = db.get_or_404(BlogPost, post_id)
    db.session.delete(post_to_delete)
    db.session.commit()
    return redirect(url_for('get_all_posts'))

# In template: Add delete button
# <a href="{{ url_for('delete_post', post_id=post.id) }}">
#     ✕ Delete
# </a>`}
                        language="python"
                    />
                    <p>
                        <strong>Note:</strong> In a production API, you'd use proper DELETE HTTP requests. For HTML forms, we use GET with a link since browsers don't natively support DELETE in forms.
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Reusable Forms</h4>
                            <p className="text-sm text-surface-400">
                                Use the same WTForm class for both creating and editing. Pass <code>is_edit=True</code> to the template to change the button text.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">get_or_404()</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>db.get_or_404(Model, id)</code> to automatically return a 404 error if the resource doesn't exist.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">CKEditor</h4>
                            <p className="text-sm text-surface-400">
                                Use Flask-CKEditor for rich text editing. The body field becomes a WYSIWYG editor instead of plain textarea.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
