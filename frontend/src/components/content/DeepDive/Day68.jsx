import CodeBlock from '../../CodeBlock'
import { Lightbulb } from 'lucide-react'

export default function DeepDiveDay68() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Why Authentication? */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Why Authentication?
                    </h2>
                    <p>
                        <strong>Authentication</strong> verifies who a user is. We need it to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Associate data with users:</strong> Save their posts, preferences, and history</li>
                        <li><strong>Restrict access:</strong> Paid features, admin panels, private content</li>
                        <li><strong>Protect privacy:</strong> Keep DMs and personal data secure</li>
                    </ul>
                    <p>
                        Users form opinions about your site in <strong>50 milliseconds</strong>. Poor security destroys trust instantly.
                    </p>
                </section>

                {/* Section 2: Encryption vs Hashing */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Encryption vs Hashing
                    </h2>
                    <p>
                        <strong>Encryption</strong> is reversible—you can decrypt with the right key (like the Enigma machine).
                    </p>
                    <p>
                        <strong>Hashing</strong> is one-way—you cannot reverse a hash to get the original password. Like multiplication: 13 × 29 = 377 is fast, but finding factors of 377 takes much longer.
                    </p>
                    <CodeBlock
                        code={`# Encryption (reversible)
# plaintext + key → ciphertext
# ciphertext + key → plaintext

# Hashing (one-way)
# password → hash
# hash → ??? (impossible to reverse)

# Example with MD5 (don't use for passwords!)
import hashlib
hash_value = hashlib.md5("password123".encode()).hexdigest()
# Returns: 482c811da5d5b4bc6d497ffa98491e38`}
                        language="python"
                    />
                </section>

                {/* Section 3: Werkzeug Password Hashing */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Werkzeug Password Hashing
                    </h2>
                    <p>
                        Flask uses <strong>Werkzeug</strong> for secure password hashing with the PBKDF2 algorithm.
                    </p>
                    <CodeBlock
                        code={`from werkzeug.security import generate_password_hash, check_password_hash

# Hashing a password during registration
hashed_password = generate_password_hash(
    "user_password",
    method='pbkdf2:sha256',
    salt_length=8
)
# Result: pbkdf2:sha256:260000$salt$hash_value

# Verifying password during login
is_correct = check_password_hash(hashed_password, "user_password")
# Returns: True or False`}
                        language="python"
                    />
                </section>

                {/* Section 4: Salting Passwords */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Salting for Security
                    </h2>
                    <p>
                        <strong>Salting</strong> adds random characters to passwords before hashing. This prevents:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Rainbow table attacks:</strong> Pre-computed hash lookup tables</li>
                        <li><strong>Identical hash detection:</strong> Two users with "password123" get different hashes</li>
                    </ul>
                    <CodeBlock
                        code={`# Without salt - same password = same hash (bad!)
hash("password123") → abc123...
hash("password123") → abc123...  # Same!

# With salt - same password = different hashes (good!)
hash("password123" + "x7k2") → def456...
hash("password123" + "m9p1") → ghi789...  # Different!

# Werkzeug handles salting automatically
# salt_length=8 generates 8 random characters`}
                        language="python"
                    />
                </section>

                {/* Section 5: Flask-Login */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Flask-Login Setup
                    </h2>
                    <p>
                        <strong>Flask-Login</strong> manages user sessions—keeping users logged in across requests.
                    </p>
                    <CodeBlock
                        code={`from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user

# Setup
login_manager = LoginManager()
login_manager.init_app(app)

# User model must inherit UserMixin
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(100))

# Required callback to load users
@login_manager.user_loader
def load_user(user_id):
    return db.get_or_404(User, user_id)

# Login a user
login_user(user)

# Access current user in routes
print(current_user.name)

# Logout
logout_user()`}
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Never Store Plain Text</h4>
                            <p className="text-sm text-surface-400">
                                <strong>Never</strong> store passwords in plain text. Companies like TalkTalk were destroyed by this mistake.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Flash Messages</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>flash()</code> to show login errors: "Email not found" or "Incorrect password".
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Have I Been Pwned?</h4>
                            <p className="text-sm text-surface-400">
                                Check if your credentials were leaked at <strong>haveibeenpwned.com</strong>. Use unique passwords!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
