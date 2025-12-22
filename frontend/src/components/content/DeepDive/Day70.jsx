import CodeBlock from '../../CodeBlock'
import { Lightbulb } from 'lucide-react'

export default function DeepDiveDay70() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Why Version Control? */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Why Version Control?
                    </h2>
                    <p>
                        Imagine writing code all day, then accidentally breaking everything. Without version control, you'd have to start over. With <strong>Git</strong>, you can "save" your progress at any point and roll back if needed.
                    </p>
                    <p>
                        Version control lets you:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Track changes:</strong> See what changed, when, and by whom</li>
                        <li><strong>Rollback:</strong> Undo mistakes by reverting to previous versions</li>
                        <li><strong>Collaborate:</strong> Multiple developers work on the same codebase</li>
                        <li><strong>Branch:</strong> Experiment without breaking the main code</li>
                    </ul>
                </section>

                {/* Section 2: Git Fundamentals */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Git Fundamentals
                    </h2>
                    <p>
                        Git tracks your project in a hidden <code>.git</code> folder. The basic workflow is: <strong>stage → commit → push</strong>.
                    </p>
                    <CodeBlock
                        code={`# Initialize a new Git repository
git init

# Check status of files
git status

# Stage files for commit
git add .                    # Add all files
git add filename.py          # Add specific file

# Commit with a message
git commit -m "Add user authentication feature"

# View commit history
git log`}
                        language="bash"
                    />
                </section>

                {/* Section 3: GitHub & Remote Repos */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> GitHub & Remote Repos
                    </h2>
                    <p>
                        <strong>GitHub</strong> hosts your Git repositories online. This enables backup, sharing, and collaboration.
                    </p>
                    <CodeBlock
                        code={`# Connect local repo to GitHub
git remote add origin https://github.com/username/repo.git

# Push commits to GitHub
git push -u origin main      # First push
git push                     # Subsequent pushes

# Pull changes from GitHub
git pull origin main

# Clone an existing repo
git clone https://github.com/username/repo.git`}
                        language="bash"
                    />
                </section>

                {/* Section 4: Branching & Merging */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Branching & Merging
                    </h2>
                    <p>
                        <strong>Branches</strong> let you develop features in isolation. When ready, <strong>merge</strong> back into the main branch.
                    </p>
                    <CodeBlock
                        code={`# Create and switch to a new branch
git checkout -b feature/user-auth

# See all branches
git branch

# Switch between branches
git checkout main
git checkout feature/user-auth

# Merge branch into main
git checkout main
git merge feature/user-auth

# Delete a branch after merging
git branch -d feature/user-auth`}
                        language="bash"
                    />
                </section>

                {/* Section 5: Forking & Pull Requests */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Forking & Pull Requests
                    </h2>
                    <p>
                        <strong>Forking</strong> copies someone else's repository to your account. You make changes, then submit a <strong>Pull Request (PR)</strong> to propose merging your changes back.
                    </p>
                    <CodeBlock
                        code={`# Fork workflow:
# 1. Fork repository on GitHub (creates your-username/repo)
# 2. Clone YOUR fork
git clone https://github.com/your-username/repo.git

# 3. Create a feature branch
git checkout -b fix/typo-readme

# 4. Make changes, commit, push
git add .
git commit -m "Fix typo in README"
git push origin fix/typo-readme

# 5. Open Pull Request on GitHub
# Go to original repo → New Pull Request → Compare across forks`}
                        language="bash"
                    />
                    <p>
                        The maintainer reviews your PR and can accept, request changes, or reject it.
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">.gitignore</h4>
                            <p className="text-sm text-surface-400">
                                Create a <code>.gitignore</code> file to exclude files like <code>.env</code>, <code>__pycache__</code>, and <code>node_modules</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Commit Messages</h4>
                            <p className="text-sm text-surface-400">
                                Write clear commit messages: "Add login feature" not "fixed stuff". Future you will thank you.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">git stash</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>git stash</code> to temporarily save uncommitted changes when switching branches.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
