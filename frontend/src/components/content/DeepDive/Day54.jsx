import CodeBlock from '../../CodeBlock'
import { Lightbulb, Server } from 'lucide-react'

export default function DeepDiveDay54() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Server className="w-6 h-6 text-primary-400" /> Introduction to Flask
                    </h2>
                    <p>
                        Day 54 introduces <strong>Flask</strong>, a lightweight Python web framework. You'll
                        learn to create web servers, understand the <code>__name__</code> variable,
                        and master Python decorators — the magic behind Flask's routing.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Your First Flask App
                    </h2>
                    <p>
                        Create a minimal Flask application with just a few lines:
                    </p>
                    <CodeBlock code={`from flask import Flask

# Create the Flask application
app = Flask(__name__)

# Define a route for the home page
@app.route('/')
def home():
    return 'Hello, World!'

# Run the development server
if __name__ == '__main__':
    app.run(debug=True)`} language="python" />
                    <p>
                        Run this with <code>python app.py</code> and visit{' '}
                        <code>http://127.0.0.1:5000</code> in your browser!
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Understanding __name__
                    </h2>
                    <p>
                        The <code>__name__</code> variable is a special Python attribute:
                    </p>
                    <CodeBlock code={`# When you run: python my_module.py
# __name__ equals '__main__'

# When you import: import my_module
# __name__ equals 'my_module'

# This is why we use:
if __name__ == '__main__':
    app.run()

# It prevents the server from starting when the module is imported
# Only runs when executed directly`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Functions as First-Class Objects
                    </h2>
                    <p>
                        In Python, functions can be passed around like any other value:
                    </p>
                    <CodeBlock code={`def greet(name):
    return f"Hello, {name}!"

def loud_greet(name):
    return f"HELLO, {name.upper()}!"

# Functions can be assigned to variables
my_func = greet
print(my_func("Alice"))  # Hello, Alice!

# Functions can be passed as arguments
def execute_greeting(greeting_func, name):
    return greeting_func(name)

print(execute_greeting(loud_greet, "Bob"))  # HELLO, BOB!

# Functions can be returned from other functions
def get_greeter(loud=False):
    if loud:
        return loud_greet
    return greet

greeter = get_greeter(loud=True)
print(greeter("Charlie"))  # HELLO, CHARLIE!`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Python Decorators Explained
                    </h2>
                    <p>
                        A decorator is a function that modifies another function's behavior:
                    </p>
                    <CodeBlock code={`def my_decorator(func):
    def wrapper():
        print("Before the function runs")
        func()
        print("After the function runs")
    return wrapper

# Using the decorator
@my_decorator
def say_hello():
    print("Hello!")

# Calling the decorated function
say_hello()
# Output:
# Before the function runs
# Hello!
# After the function runs

# The @ syntax is equivalent to:
# say_hello = my_decorator(say_hello)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Practical Decorator Example
                    </h2>
                    <p>
                        A timing decorator that measures function execution:
                    </p>
                    <CodeBlock code={`import time
from functools import wraps

def timer(func):
    @wraps(func)  # Preserves original function metadata
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "Done!"

result = slow_function()
# Output: slow_function took 1.0012 seconds
print(result)  # Done!`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Debug Mode</h4>
                            <p className="text-sm text-surface-400">
                                <code>debug=True</code> enables auto-reload and detailed errors. Never use in production!
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">@wraps Decorator</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>@wraps(func)</code> to preserve <code>__name__</code> and <code>__doc__</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">*args, **kwargs</h4>
                            <p className="text-sm text-surface-400">
                                Use these in wrappers to accept any arguments the original function might take.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Port 5000</h4>
                            <p className="text-sm text-surface-400">
                                Flask defaults to port 5000. Change with <code>app.run(port=8080)</code>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
