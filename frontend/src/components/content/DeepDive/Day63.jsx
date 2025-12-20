import React from 'react';
import CodeBlock from '../../CodeBlock';
import { Lightbulb } from 'lucide-react';

export default function DeepDiveDay63() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Introduction to SQLite */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Introduction to SQLite
                    </h2>
                    <p>
                        <strong>SQLite</strong> is a lightweight, file-based database. Unlike MySQL or PostgreSQL, it doesn't require a server—your entire database is stored in a single <code>.db</code> file.
                    </p>
                    <p>
                        This makes it perfect for development, prototyping, and small applications.
                    </p>
                </section>

                {/* Section 2: Flask-SQLAlchemy Setup */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Setting Up Flask-SQLAlchemy
                    </h2>
                    <p>
                        Flask-SQLAlchemy provides a simplified interface for using SQLAlchemy with Flask.
                    </p>
                    <CodeBlock
                        code={`from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///books.db'
app.config['SECRET_KEY'] = 'your-secret-key'

db = SQLAlchemy(app)`}
                        language="python"
                    />
                </section>

                {/* Section 3: Defining Models */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Defining Database Models
                    </h2>
                    <p>
                        A <strong>model</strong> is a Python class that represents a database table. Each class attribute becomes a column.
                    </p>
                    <CodeBlock
                        code={`class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), unique=True, nullable=False)
    author = db.Column(db.String(250), nullable=False)
    rating = db.Column(db.Float, nullable=True)

# Create all tables
with app.app_context():
    db.create_all()`}
                        language="python"
                    />
                </section>

                {/* Section 4: CRUD Operations */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> CRUD Operations
                    </h2>
                    <p>
                        CRUD stands for <strong>Create, Read, Update, Delete</strong>—the four fundamental database operations.
                    </p>
                    <CodeBlock
                        code={`# CREATE
new_book = Book(title="Harry Potter", author="J.K. Rowling", rating=9.5)
db.session.add(new_book)
db.session.commit()

# READ
all_books = Book.query.all()
book = Book.query.get(1)  # By primary key

# UPDATE
book.rating = 10
db.session.commit()

# DELETE
db.session.delete(book)
db.session.commit()`}
                        language="python"
                    />
                </section>

                {/* Section 5: Querying with Filters */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Advanced Queries
                    </h2>
                    <p>
                        SQLAlchemy provides powerful query methods for filtering and ordering results.
                    </p>
                    <CodeBlock
                        code={`# Filter by column value
high_rated = Book.query.filter(Book.rating > 8).all()

# Find by a specific field
hp = Book.query.filter_by(title="Harry Potter").first()

# Order results
books_by_rating = Book.query.order_by(Book.rating.desc()).all()`}
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">App Context</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>with app.app_context():</code> when running database operations outside of a request.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">DB Browser</h4>
                            <p className="text-sm text-surface-400">
                                Use <strong>DB Browser for SQLite</strong> to visually inspect and edit your database during development.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Always Commit</h4>
                            <p className="text-sm text-surface-400">
                                Remember to call <code>db.session.commit()</code> after add, update, or delete operations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
