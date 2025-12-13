import CodeBlock from '../../CodeBlock';
import InlineCode from '../../InlineCode';

export default function DeepDiveDay17() {
    return (
        <div className="space-y-8">
            {/* Main Content */}
            <div className="prose prose-invert max-w-none">
                {/* Section 1: Creating Your Own Classes */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-primary-400 mb-4">🏗️ Creating Your Own Classes</h3>
                    <p className="text-surface-300 mb-4">
                        A <strong>class</strong> is a blueprint for creating objects. Use the <InlineCode>class</InlineCode> keyword
                        followed by the class name in <strong>PascalCase</strong> (every word capitalized).
                    </p>
                    <CodeBlock language="python" code={`class User:
    pass  # Empty class placeholder

# Create objects from the class
user_1 = User()
user_2 = User()

# Add attributes dynamically
user_1.id = "001"
user_1.username = "angela"`} />
                    <p className="text-surface-400 text-sm mt-2">
                        The <InlineCode>pass</InlineCode> keyword creates an empty placeholder when you don't have code yet.
                    </p>
                </section>

                {/* Section 2: The __init__ Constructor */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-primary-400 mb-4">⚙️ The __init__() Constructor</h3>
                    <p className="text-surface-300 mb-4">
                        The <InlineCode>__init__()</InlineCode> method is called automatically when creating a new object.
                        It <strong>initializes</strong> the object's starting attributes.
                    </p>
                    <CodeBlock language="python" code={`class User:
    def __init__(self, user_id, username):
        self.id = user_id           # Required attribute
        self.username = username     # Required attribute
        self.followers = 0           # Default value
        self.following = 0           # Default value

# Now creation is simpler:
user_1 = User("001", "angela")
print(user_1.username)  # angela
print(user_1.followers) # 0`} />
                </section>

                {/* Section 3: The self Keyword */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-accent-400 mb-4">🔗 Understanding 'self'</h3>
                    <p className="text-surface-300 mb-4">
                        <InlineCode>self</InlineCode> refers to the <strong>current object instance</strong>.
                        Use it inside the class to access attributes and methods of that specific object.
                    </p>
                    <div className="bg-surface-800/50 rounded-lg p-4 border border-surface-700">
                        <ul className="list-disc list-inside text-surface-300 space-y-2">
                            <li><InlineCode>self.attribute</InlineCode> – access/set an object's data</li>
                            <li><InlineCode>self.method()</InlineCode> – call another method on the same object</li>
                            <li>Always the <strong>first parameter</strong> in any method definition</li>
                        </ul>
                    </div>
                </section>

                {/* Section 4: Adding Methods */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-primary-400 mb-4">🔧 Adding Methods to a Class</h3>
                    <p className="text-surface-300 mb-4">
                        <strong>Methods</strong> are functions attached to a class. They define what objects can <em>do</em>.
                    </p>
                    <CodeBlock language="python" code={`class User:
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
print(user_1.following)  # 1`} />
                </section>

                {/* Section 5: Quiz Brain Project Pattern */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-accent-400 mb-4">🧠 Quiz Brain Project Pattern</h3>
                    <p className="text-surface-300 mb-4">
                        The Quiz project demonstrates OOP by separating concerns into multiple classes:
                    </p>
                    <CodeBlock language="python" code={`# question_model.py
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
        self.check_answer(answer, current.answer)

    def check_answer(self, user_answer, correct_answer):
        if user_answer.lower() == correct_answer.lower():
            self.score += 1
            print("Correct!")
        else:
            print("Wrong!")`} />
                </section>

                {/* Pro Tips Sidebar */}
                <aside className="bg-gradient-to-br from-primary-900/30 to-accent-900/30 rounded-xl p-6 border border-primary-700/30">
                    <h4 className="text-lg font-semibold text-primary-300 mb-3">💡 Pro Tips</h4>
                    <ul className="space-y-3 text-surface-300 text-sm">
                        <li>
                            <strong>Naming:</strong> Class names use <strong>PascalCase</strong>,
                            everything else uses <strong>snake_case</strong>.
                        </li>
                        <li>
                            <strong>Default Values:</strong> Set <InlineCode>self.attr = 0</InlineCode> in
                            <InlineCode>__init__</InlineCode> for attributes that don't need input.
                        </li>
                        <li>
                            <strong>Separation of Concerns:</strong> Put each class in its own file
                            (e.g., <InlineCode>question_model.py</InlineCode>, <InlineCode>quiz_brain.py</InlineCode>).
                        </li>
                        <li>
                            <strong>Open Trivia DB:</strong> The project uses the Open Trivia Database API
                            to fetch real quiz questions dynamically.
                        </li>
                    </ul>
                </aside>
            </div>
        </div>
    );
}
