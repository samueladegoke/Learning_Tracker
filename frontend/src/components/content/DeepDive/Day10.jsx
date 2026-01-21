import CodeBlock from '../../CodeBlock'
import { Lightbulb } from 'lucide-react'

export default function DeepDiveDay10() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Functions with Outputs: The Return Statement
                    </h2>
                    <p>
                        We've seen plain functions and functions with inputs. Today we complete the picture
                        with <code>return</code>—functions that give something back. The output replaces the
                        function call in your code, so you can capture it in a variable or pass it directly
                        to another function.
                    </p>
                    <CodeBlock code={`def my_function():
    result = 3 * 2
    return result

# When the function runs, the return value replaces the call
output = my_function()
print(output)  # 6`} language="python" />
                    <p>
                        Think of a function like a machine: you feed it inputs (bottles go in), processing
                        happens inside, and an output comes out (bottles filled with milk). The <code>return</code> keyword
                        is how Python sends that output back to your code.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Title Case and Practical Returns
                    </h2>
                    <p>
                        Let's build a <code>format_name</code> function that takes a first and last name
                        (possibly in weird casing) and returns them in title case. This demonstrates how
                        functions transform inputs into useful outputs.
                    </p>
                    <CodeBlock code={`def format_name(f_name, l_name):
    formatted_f_name = f_name.title()
    formatted_l_name = l_name.title()
    return f"{formatted_f_name} {formatted_l_name}"

# Usage
formatted_string = format_name("aNGELA", "YU")
print(formatted_string)  # Angela Yu`} language="python" />
                    <p>
                        The <code>.title()</code> method converts strings so each word starts with a capital
                        letter. Since <code>title()</code> returns a new string, we can chain it or store it
                        immediately.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Multiple Return Statements & Early Exit
                    </h2>
                    <p>
                        When Python hits a <code>return</code>, it immediately exits the function—no code
                        after it runs. This means you can have multiple <code>return</code> statements for
                        different conditions, and you can use an "early return" to handle edge cases.
                    </p>
                    <CodeBlock code={`def format_name(f_name, l_name):
    # Early exit if user provides empty input
    if f_name == "" or l_name == "":
        return "You didn't provide valid inputs."
    
    formatted_f_name = f_name.title()
    formatted_l_name = l_name.title()
    return f"{formatted_f_name} {formatted_l_name}"

# Test with empty input
result = format_name("", "Smith")
print(result)  # "You didn't provide valid inputs."`} language="python" />
                    <p>
                        Using early returns keeps your main logic clean and avoids deep nesting. It's a
                        practical pattern for validation and error handling.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Docstrings: Document Your Functions
                    </h2>
                    <p>
                        Docstrings are triple-quoted strings placed immediately after the function definition.
                        They describe what the function does and show up in IDE hints when you hover over
                        the function name.
                    </p>
                    <CodeBlock code={`def format_name(f_name, l_name):
    """Take a first and last name and format it
    to return the title case version of the name."""
    if f_name == "" or l_name == "":
        return "You didn't provide valid inputs."
    return f"{f_name.title()} {l_name.title()}"

# Now when you call format_name(), your IDE shows the docstring!`} language="python" />
                    <p>
                        Docstrings can span multiple lines and should clearly explain the function's purpose,
                        parameters, and return value. Unlike regular comments (#), docstrings are accessible
                        at runtime via <code>function.__doc__</code>.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Functions as Values: Storing in Variables & Dicts
                    </h2>
                    <p>
                        In Python, functions are "first-class citizens"—you can store them in variables or
                        data structures just like numbers or strings. The key: use the function name
                        <strong> without parentheses</strong> to reference the function itself (adding
                        parentheses would call it).
                    </p>
                    <CodeBlock code={`def add(n1, n2):
    return n1 + n2

def subtract(n1, n2):
    return n1 - n2

def multiply(n1, n2):
    return n1 * n2

def divide(n1, n2):
    return n1 / n2

# Store functions in a dictionary (no parentheses!)
operations = {
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide,
}

# Use the dictionary to pick and call a function
result = operations["*"](4, 8)
print(result)  # 32`} language="python" />
                    <p>
                        This pattern is incredibly powerful for building dynamic programs like calculators,
                        command dispatchers, or plugin systems.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">06.</span> Calculator Project: Putting It All Together
                    </h2>
                    <p>
                        The Day 10 capstone combines everything: functions with outputs, storing functions
                        in dictionaries, loops for user interaction, and type conversion for numeric input.
                    </p>
                    <CodeBlock code={`def add(n1, n2):
    return n1 + n2

def subtract(n1, n2):
    return n1 - n2

def multiply(n1, n2):
    return n1 * n2

def divide(n1, n2):
    return n1 / n2

operations = {"+": add, "-": subtract, "*": multiply, "/": divide}

def calculator():
    num1 = float(input("What's the first number?: "))
    
    for symbol in operations:
        print(symbol)
    
    should_continue = True
    while should_continue:
        operation_symbol = input("Pick an operation: ")
        num2 = float(input("What's the next number?: "))
        
        calculation_function = operations[operation_symbol]
        answer = calculation_function(num1, num2)
        
        print(f"{num1} {operation_symbol} {num2} = {answer}")
        
        if input(f"Type 'y' to continue with {answer}, or 'n' to start new: ") == "y":
            num1 = answer
        else:
            should_continue = False
            calculator()  # Recursively restart

calculator()`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Return vs Print</h4>
                            <p className="text-sm text-surface-400">
                                <code>print()</code> displays output to the console but returns <code>None</code>.
                                <code>return</code> sends data back to the caller. Use <code>return</code> when you
                                need to use the result elsewhere in your code.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Chaining Function Outputs</h4>
                            <p className="text-sm text-surface-400">
                                The output of one function can become the input of another:
                                <code>function2(function1("hello"))</code>. This is only possible because
                                functions return values.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Don't Forget float()</h4>
                            <p className="text-sm text-surface-400">
                                User input is always a string. For math operations, wrap it in <code>float()</code>
                                or <code>int()</code>. Otherwise, <code>"3" + "3"</code> gives <code>"33"</code>!
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Function References</h4>
                            <p className="text-sm text-surface-400">
                                <code>my_func</code> is the function object; <code>my_func()</code> calls it.
                                Store functions without parentheses to call them dynamically later.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
