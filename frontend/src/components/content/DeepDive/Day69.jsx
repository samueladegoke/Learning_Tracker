import CodeBlock from '../../CodeBlock'
import { Lightbulb } from 'lucide-react'

export default function DeepDiveDay69() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Adding Users to the Blog */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Adding Users to the Blog
                    </h2>
                    <p>
                        Today we complete our blog by adding a <strong>user system</strong>. Users can register, login, create posts, and leave comments—all linked to their account.
                    </p>
                    <p>
                        This combines everything: Flask-Login, SQLAlchemy relationships, Werkzeug hashing, and route protection.
                    </p>
                </section>

                {/* Section 2: User Registration */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> User Registration
                    </h2>
                    <p>
                        Registration hashes passwords and checks if the email already exists.
                    </p>
                    <CodeBlock
                        code={`@app.route('/register', methods=["GET", "POST"])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        # Check if user exists
        user = db.session.execute(
            db.select(User).where(User.email == form.email.data)
        ).scalar()
        if user:
            flash("Email already exists. Login instead!")
            return redirect(url_for('login'))
        
        # Create new user with hashed password
        new_user = User(
            email=form.email.data,
            password=generate_password_hash(
                form.password.data,
                method='pbkdf2:sha256',
                salt_length=8
            ),
            name=form.name.data
        )
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return redirect(url_for('get_all_posts'))
    return render_template("register.html", form=form)`}
                        language="python"
                    />
                </section>

                {/* Section 3: Login & Logout */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Login & Logout
                    </h2>
                    <CodeBlock
                        code={`@app.route('/login', methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = db.session.execute(
            db.select(User).where(User.email == form.email.data)
        ).scalar()
        if not user:
            flash("Email not found.")
            return redirect(url_for('login'))
        elif not check_password_hash(user.password, form.password.data):
            flash("Incorrect password.")
            return redirect(url_for('login'))
        else:
            login_user(user)
            return redirect(url_for('get_all_posts'))
    return render_template("login.html", form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('get_all_posts'))`}
                        language="python"
                    />
                </section>

                {/* Section 4: Protected Routes */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Protecting Routes
                    </h2>
                    <p>
                        Use <code>@login_required</code> to restrict routes to logged-in users. Create a custom <code>@admin_only</code> decorator for admin-only actions.
                    </p>
                    <CodeBlock
                        code={`from flask_login import login_required, current_user
from functools import wraps

# Custom admin-only decorator
def admin_only(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if current_user.id != 1:  # User ID 1 is admin
            return abort(403)
        return f(*args, **kwargs)
    return decorated_function

@app.route("/new-post", methods=["GET", "POST"])
@admin_only
def add_new_post():
    # Only admin can create posts
    ...

@app.route("/delete/<int:post_id>")
@admin_only
def delete_post(post_id):
    # Only admin can delete posts
    ...`}
                        language="python"
                    />
                </section>

                {/* Section 5: Database Relationships */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> User ↔ Posts Relationship
                    </h2>
                    <p>
                        Link blog posts to their authors using SQLAlchemy relationships.
                    </p>
                    <CodeBlock
                        code={`from sqlalchemy.orm import relationship

class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(100))
    
    # One user has many posts
    posts = relationship("BlogPost", back_populates="author")
    comments = relationship("Comment", back_populates="comment_author")

class BlogPost(db.Model):
    __tablename__ = "blog_posts"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), nullable=False)
    body = db.Column(db.Text, nullable=False)
    
    # Foreign key to users table
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")`}
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Gravatar</h4>
                            <p className="text-sm text-surface-400">
                                Use <strong>Gravatar</strong> for profile pictures. Hash the email and fetch from gravatar.com/avatar/hash.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">@wraps Decorator</h4>
                            <p className="text-sm text-surface-400">
                                Always use <code>@wraps(f)</code> from functools when creating custom decorators to preserve function metadata.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Conditional Templates</h4>
                            <p className="text-sm text-surface-400">
                                Use Jinja's <code>{`{% if current_user.is_authenticated %}`}</code> to show/hide login buttons.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
