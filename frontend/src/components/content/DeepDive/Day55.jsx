import CodeBlock from '../../CodeBlock'
import { Lightbulb, Route } from 'lucide-react'

export default function DeepDiveDay55() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Route className="w-6 h-6 text-primary-400" /> Flask Routing & Higher/Lower Game
                    </h2>
                    <p>
                        Day 55 dives deeper into <strong>Flask routing</strong> with dynamic URL parameters,
                        variable converters, and builds a fun Higher/Lower number guessing game where
                        players guess via URL paths!
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Dynamic URL Routes
                    </h2>
                    <p>
                        Capture parts of the URL as function parameters:
                    </p>
                    <CodeBlock code={`from flask import Flask
app = Flask(__name__)

# Capture a string from the URL
@app.route('/user/<username>')
def show_user(username):
    return f'User: {username}'

# Capture an integer with type conversion
@app.route('/post/<int:post_id>')
def show_post(post_id):
    # post_id is automatically converted to int
    return f'Post #{post_id}'

# Both parameters
@app.route('/user/<username>/post/<int:post_id>')
def user_post(username, post_id):
    return f"{username}'s post #{post_id}"`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Variable Converters
                    </h2>
                    <p>
                        Flask provides several built-in converters for URL parameters:
                    </p>
                    <CodeBlock code={`# string (default) - any text without slashes
@app.route('/name/<name>')

# int - positive integers
@app.route('/page/<int:page>')

# float - positive floating point values
@app.route('/price/<float:price>')

# path - like string but includes slashes
@app.route('/file/<path:filepath>')
def get_file(filepath):
    # /file/folder/subfolder/doc.txt
    # filepath = "folder/subfolder/doc.txt"
    return f'File path: {filepath}'

# uuid - UUID strings
@app.route('/item/<uuid:item_id>')`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Returning HTML
                    </h2>
                    <p>
                        Routes can return HTML strings with styling:
                    </p>
                    <CodeBlock code={`@app.route('/styled/<name>')
def styled_greeting(name):
    return f'''
    <html>
    <body style="background-color: #1a1a2e; color: #fff; font-family: Arial;">
        <h1 style="color: #00ff88; text-align: center;">
            Welcome, {name}!
        </h1>
        <img src="https://media.giphy.com/media/welcome.gif" alt="Welcome">
    </body>
    </html>
    '''`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Advanced Decorators: *args, **kwargs
                    </h2>
                    <p>
                        Make decorators flexible enough for any function:
                    </p>
                    <CodeBlock code={`from functools import wraps

def logging_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # *args captures positional arguments as a tuple
        # **kwargs captures keyword arguments as a dict
        print(f"Calling {func.__name__}")
        print(f"  Args: {args}")
        print(f"  Kwargs: {kwargs}")
        result = func(*args, **kwargs)
        print(f"  Returned: {result}")
        return result
    return wrapper

@logging_decorator
def add(a, b, c=0):
    return a + b + c

add(1, 2, c=3)
# Output:
# Calling add
#   Args: (1, 2)
#   Kwargs: {'c': 3}
#   Returned: 6`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Higher/Lower Game
                    </h2>
                    <p>
                        Build the complete game where users guess a number via URL:
                    </p>
                    <CodeBlock code={`from flask import Flask
import random

app = Flask(__name__)

# Generate random number when server starts
secret_number = random.randint(0, 9)

@app.route('/')
def home():
    return '''
    <h1>Guess a number between 0 and 9</h1>
    <p>Go to /1, /2, /3... to make your guess!</p>
    <img src="https://media.giphy.com/guess.gif">
    '''

@app.route('/<int:guess>')
def check_guess(guess):
    if guess < secret_number:
        return '''
        <h1 style="color: red;">Too low! Try again.</h1>
        <img src="https://media.giphy.com/low.gif">
        '''
    elif guess > secret_number:
        return '''
        <h1 style="color: purple;">Too high! Try again.</h1>
        <img src="https://media.giphy.com/high.gif">
        '''
    else:
        return '''
        <h1 style="color: green;">You got it! 🎉</h1>
        <img src="https://media.giphy.com/correct.gif">
        '''

if __name__ == '__main__':
    app.run(debug=True)`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Type Converters</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>&lt;int:id&gt;</code> to auto-convert and return 404 if invalid.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Path Converter</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>&lt;path:var&gt;</code> when you need to capture slashes in the URL.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Debugger</h4>
                            <p className="text-sm text-surface-400">
                                The Flask debugger lets you run Python in the browser — powerful but dangerous!
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Return Types</h4>
                            <p className="text-sm text-surface-400">
                                Remember: Flask routes must return strings. Use <code>str(num)</code> for numbers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
