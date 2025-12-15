import React from 'react'
import CodeBlock from '../../CodeBlock'
import { HelpCircle, Layers, RefreshCw, CheckCircle, Lightbulb } from 'lucide-react'

export default function DeepDiveDay34() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <HelpCircle className="w-6 h-6 text-primary-400" /> GUI Quiz App with API
                    </h2>
                    <p>
                        Day 34 builds a <strong>trivia quiz application</strong> that fetches questions from an API
                        and displays them in a Tkinter GUI. This combines API skills with GUI programming and
                        introduces HTML entity handling.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Open Trivia Database API
                    </h2>
                    <p>
                        The <strong>Open Trivia DB</strong> provides free trivia questions via API. You specify
                        the number of questions, category, difficulty, and type (true/false or multiple choice).
                    </p>
                    <CodeBlock code={`import requests

parameters = {
    "amount": 10,             # Number of questions
    "type": "boolean",        # True/False questions
    "category": 18,           # Science: Computers
    "difficulty": "medium"
}

response = requests.get(
    url="https://opentdb.com/api.php",
    params=parameters
)

data = response.json()
questions = data["results"]

# Each question has:
# - "question": the question text
# - "correct_answer": "True" or "False"
# - "incorrect_answers": list of wrong answers`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Handling HTML Entities
                    </h2>
                    <p>
                        API responses often contain HTML entities like <code>&amp;quot;</code> or <code>&amp;#039;</code>.
                        Use the <code>html</code> module to decode them to normal characters.
                    </p>
                    <CodeBlock code={`import html

# Raw API response might contain entities
raw_text = "What&#039;s the capital of &quot;France&quot;?"

# Decode HTML entities
clean_text = html.unescape(raw_text)
print(clean_text)  # What's the capital of "France"?

# Common entities:
# &quot; = "
# &#039; = '
# &amp; = &
# &lt; = <
# &gt; = >`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Quiz Data Model
                    </h2>
                    <p>
                        Create a <code>Question</code> class to hold each question's text and answer, and a
                        <code>QuizBrain</code> class to manage quiz logic.
                    </p>
                    <CodeBlock code={`class Question:
    def __init__(self, text, answer):
        self.text = text
        self.answer = answer

class QuizBrain:
    def __init__(self, question_list):
        self.question_number = 0
        self.score = 0
        self.question_list = question_list
        self.current_question = None
    
    def still_has_questions(self):
        return self.question_number < len(self.question_list)
    
    def next_question(self):
        self.current_question = self.question_list[self.question_number]
        self.question_number += 1
        return self.current_question.text
    
    def check_answer(self, user_answer):
        correct = self.current_question.answer.lower()
        if user_answer.lower() == correct:
            self.score += 1
            return True
        return False`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Dynamic UI Updates
                    </h2>
                    <p>
                        The GUI needs to update dynamically: showing new questions, changing colors for
                        correct/incorrect, and updating the score.
                    </p>
                    <CodeBlock code={`import tkinter as tk

class QuizInterface:
    def __init__(self, quiz_brain):
        self.quiz = quiz_brain
        
        self.window = tk.Tk()
        self.window.title("Quizzler")
        
        self.score_label = tk.Label(text="Score: 0")
        self.score_label.grid(row=0, column=1)
        
        self.canvas = tk.Canvas(width=300, height=250, bg="white")
        self.question_text = self.canvas.create_text(
            150, 125, width=280, text="Question here",
            font=("Arial", 20, "italic")
        )
        self.canvas.grid(row=1, column=0, columnspan=2)
        
        # True/False buttons
        self.true_button = tk.Button(text="✓", command=self.true_pressed)
        self.false_button = tk.Button(text="✗", command=self.false_pressed)
        
        self.get_next_question()
        self.window.mainloop()
    
    def get_next_question(self):
        self.canvas.config(bg="white")
        if self.quiz.still_has_questions():
            q_text = self.quiz.next_question()
            self.canvas.itemconfig(self.question_text, text=q_text)
        else:
            self.canvas.itemconfig(self.question_text, text="Quiz Complete!")
            self.true_button.config(state="disabled")
            self.false_button.config(state="disabled")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Visual Feedback
                    </h2>
                    <p>
                        Change the canvas background color to provide instant feedback, then use <code>after()</code>
                        to reset and show the next question.
                    </p>
                    <CodeBlock code={`def true_pressed(self):
    self.give_feedback(self.quiz.check_answer("true"))

def false_pressed(self):
    self.give_feedback(self.quiz.check_answer("false"))

def give_feedback(self, is_correct):
    if is_correct:
        self.canvas.config(bg="green")
    else:
        self.canvas.config(bg="red")
    
    self.score_label.config(text=f"Score: {self.quiz.score}/{self.quiz.question_number}")
    self.window.after(1000, self.get_next_question)`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">html.unescape()</h4>
                            <p className="text-sm text-surface-400">
                                Always decode HTML entities from API responses using <code>html.unescape()</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Disable Buttons at End</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>state="disabled"</code> to prevent clicking after the quiz is complete.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Separation of Concerns</h4>
                            <p className="text-sm text-surface-400">
                                Keep data (Question class), logic (QuizBrain), and UI (QuizInterface) in separate files.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Pass Quiz to UI</h4>
                            <p className="text-sm text-surface-400">
                                Inject the QuizBrain instance into the UI class for clean communication between logic and display.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
