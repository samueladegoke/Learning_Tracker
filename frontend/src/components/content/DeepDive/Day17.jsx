import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Lightbulb, Boxes, Code2 } from 'lucide-react'

export default function DeepDiveDay17() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Boxes className="w-6 h-6 text-primary-400" /> Creating Your Own Classes
                    </h2>
                    <p>
                        A <strong>class</strong> is a blueprint for creating objects. Use the <code>class</code> keyword
                        followed by the class name in <strong>PascalCase</strong> (every word capitalized).
                    </p>
                    <CodeBlock code={`class User:
    pass  # Empty class placeholder

# Create objects from the class
user_1 = User()
user_2 = User()

# Add attributes dynamically
user_1.id = "001"
user_1.username = "angela"`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> The __init__() Constructor
                    </h2>
                    <p>
                        The <code>__init__()</code> method is called automatically when creating a new object.
                        It <strong>initializes</strong> the object's starting attributes.
                    </p>
                    <CodeBlock code={`class User:
    def __init__(self, user_id, username):
        self.id = user_id           # Required attribute
        self.username = username     # Required attribute
        self.followers = 0           # Default value
        self.following = 0           # Default value

# Now creation is simpler:
user_1 = User("001", "angela")
print(user_1.username)  # angela
print(user_1.followers) # 0`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Understanding 'self'
                    </h2>
                    <p>
                        <code>self</code> refers to the <strong>current object instance</strong>.
                        Use it inside the class to access attributes and methods of that specific object.
                    </p>
                    <ul className="list-disc list-inside text-surface-300 space-y-2 ml-4">
                        <li><code>self.attribute</code> – access/set an object's data</li>
                        <li><code>self.method()</code> – call another method on the same object</li>
                        <li>Always the <strong>first parameter</strong> in any method definition</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Adding Methods to a Class
                    </h2>
                    <p>
                        <strong>Methods</strong> are functions attached to a class. They define what objects can <em>do</em>.
                    </p>
                    <CodeBlock code={`class User:
    def __init__(self, user_id, username):
        self.id = user_id
        self.username = username
        self.followers = 0
        self.following = 0

    def follow(self, other_user):
        """Follow another user."""
        other_user.followers += 1
        self.following += 1

# Usage:
user_1 = User("001", "angela")
user_2 = User("002", "jack")

user_1.follow(user_2)
print(user_2.followers)  # 1
print(user_1.following)  # 1`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Quiz Brain Project Pattern
                    </h2>
                    <p>
                        The Quiz project demonstrates OOP by separating concerns into multiple classes:
                    </p>
                    <CodeBlock code={`# question_model.py
class Question:
    def __init__(self, text, answer):
        self.text = text
        self.answer = answer

# quiz_brain.py
class QuizBrain:
    def __init__(self, question_list):
        self.question_number = 0
        self.score = 0
        self.question_list = question_list

    def still_has_questions(self):
        return self.question_number < len(self.question_list)

    def next_question(self):
        current = self.question_list[self.question_number]
        self.question_number += 1
        answer = input(f"Q.{self.question_number}: {current.text} (True/False): ")
        self.check_answer(answer, current.answer)`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Naming Conventions</h4>
                            <p className="text-sm text-surface-400">
                                Class names use <strong>PascalCase</strong>, everything else uses <strong>snake_case</strong>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Default Values</h4>
                            <p className="text-sm text-surface-400">
                                Set <code>self.attr = 0</code> in <code>__init__</code> for attributes that don't need input.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Separation of Concerns</h4>
                            <p className="text-sm text-surface-400">
                                Put each class in its own file (e.g., <code>question_model.py</code>, <code>quiz_brain.py</code>).
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Open Trivia DB</h4>
                            <p className="text-sm text-surface-400">
                                The project uses the Open Trivia Database API to fetch real quiz questions dynamically.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
