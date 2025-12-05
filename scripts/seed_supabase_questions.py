#!/usr/bin/env python3
"""
Seed questions to Supabase database.
Run this script to populate the questions table with quiz questions for each day.
"""

import json
import os
from pathlib import Path

try:
    from supabase import create_client, Client
except ImportError:
    print("Please install supabase-py: pip install supabase")
    exit(1)

# Supabase credentials - MUST be set via environment variables
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://lhdpiawslfpngmehafdo.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_KEY:
    print("ERROR: SUPABASE_SERVICE_KEY environment variable is required.")
    print("Set it with: export SUPABASE_SERVICE_KEY='your-service-role-key'")
    print("You can find this in your Supabase Dashboard > Settings > API > service_role key")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def seed_questions(quiz_id: str, questions: list) -> dict:
    """Seed questions for a specific quiz."""
    records = []
    
    for q in questions:
        record = {
            'quiz_id': quiz_id,
            'question_type': q.get('question_type', 'mcq'),
            'text': q['text'],
            'options': q.get('options'),
            'correct_index': q.get('correct_index'),
            'starter_code': q.get('starter_code'),
            'expected_output': q.get('expected_output'),
            'test_cases': q.get('test_cases'),
            'solution_code': q.get('solution_code'),
            'explanation': q.get('explanation'),
            'difficulty': q.get('difficulty', 'medium'),
            'topic_tag': q.get('topic_tag')
        }
        records.append(record)
    
    # Insert into Supabase
    result = supabase.table('questions').insert(records).execute()
    print(f"Seeded {len(records)} questions for {quiz_id}")
    return result


def clear_quiz_questions(quiz_id: str):
    """Remove existing questions for a quiz (for re-seeding)."""
    result = supabase.table('questions').delete().eq('quiz_id', quiz_id).execute()
    print(f"Cleared existing questions for {quiz_id}")
    return result


def load_questions_from_json(filepath: str) -> list:
    """Load questions from a JSON file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def seed_all_from_directory(questions_dir: str = 'data/questions'):
    """Seed all questions from JSON files in a directory."""
    dir_path = Path(questions_dir)
    
    if not dir_path.exists():
        print(f"Questions directory not found: {questions_dir}")
        return
    
    for json_file in sorted(dir_path.glob('day-*.json')):
        # Extract day number from filename
        match = json_file.stem  # e.g., "day-1"
        quiz_id = f"{match}-practice"
        
        questions = load_questions_from_json(json_file)
        
        # Clear existing and seed new
        clear_quiz_questions(quiz_id)
        seed_questions(quiz_id, questions)


# Sample questions for Day 1
DAY1_QUESTIONS = [
    # MCQ Questions - Easy
    {
        "question_type": "mcq",
        "text": "What is the correct way to assign the value 10 to a variable named 'score'?",
        "options": ["score == 10", "score = 10", "10 = score", "int score = 10"],
        "correct_index": 1,
        "explanation": "In Python, '=' is the assignment operator. 'score = 10' assigns the value 10 to the variable score.",
        "difficulty": "easy",
        "topic_tag": "variables"
    },
    {
        "question_type": "mcq",
        "text": "Which function is used to display output in Python?",
        "options": ["echo()", "display()", "print()", "output()"],
        "correct_index": 2,
        "explanation": "The print() function is used to display output to the console in Python.",
        "difficulty": "easy",
        "topic_tag": "print"
    },
    {
        "question_type": "mcq",
        "text": "What will print('Hello' + ' ' + 'World') output?",
        "options": ["Hello World", "HelloWorld", "Hello + World", "Error"],
        "correct_index": 0,
        "explanation": "The + operator concatenates strings. Adding 'Hello', ' ', and 'World' produces 'Hello World'.",
        "difficulty": "easy",
        "topic_tag": "strings"
    },
    {
        "question_type": "mcq",
        "text": "Which function is used to get user input in Python?",
        "options": ["get()", "scan()", "input()", "read()"],
        "correct_index": 2,
        "explanation": "The input() function reads a line from user input and returns it as a string.",
        "difficulty": "easy",
        "topic_tag": "input"
    },
    {
        "question_type": "mcq",
        "text": "What is the output of: print(len('Python'))?",
        "options": ["5", "6", "7", "Error"],
        "correct_index": 1,
        "explanation": "len() returns the number of characters in a string. 'Python' has 6 characters.",
        "difficulty": "easy",
        "topic_tag": "strings"
    },
    # MCQ Questions - Medium
    {
        "question_type": "mcq",
        "text": "What will be stored in x after: x = input('Enter: ')\\n(user types '42')?",
        "options": ["42 (integer)", "'42' (string)", "None", "Error"],
        "correct_index": 1,
        "explanation": "input() always returns a string, even if the user enters numbers. To get an integer, use int(input()).",
        "difficulty": "medium",
        "topic_tag": "input"
    },
    {
        "question_type": "mcq",
        "text": "Which is a valid variable name in Python?",
        "options": ["2nd_place", "my-variable", "_private", "class"],
        "correct_index": 2,
        "explanation": "Variable names can start with letters or underscores, but not numbers or hyphens. 'class' is a reserved keyword.",
        "difficulty": "medium",
        "topic_tag": "variables"
    },
    {
        "question_type": "mcq",
        "text": "What does the following code print?\\nname = 'Alice'\\nprint(f'Hello, {name}!')",
        "options": ["Hello, {name}!", "Hello, Alice!", "Hello, name!", "Error"],
        "correct_index": 1,
        "explanation": "f-strings (formatted string literals) allow embedding expressions inside curly braces. {name} is replaced with 'Alice'.",
        "difficulty": "medium",
        "topic_tag": "strings"
    },
    {
        "question_type": "mcq",
        "text": "What is string concatenation?",
        "options": ["Comparing two strings", "Joining strings together", "Splitting a string", "Reversing a string"],
        "correct_index": 1,
        "explanation": "String concatenation is the operation of joining two or more strings end-to-end using the + operator.",
        "difficulty": "medium",
        "topic_tag": "strings"
    },
    {
        "question_type": "mcq",
        "text": "What will print('\\n') output?",
        "options": ["\\n", "n", "A blank line", "Error"],
        "correct_index": 2,
        "explanation": "\\n is an escape sequence representing a newline character. Printing it creates a blank line.",
        "difficulty": "medium",
        "topic_tag": "strings"
    },
    # MCQ Questions - Hard
    {
        "question_type": "mcq",
        "text": "What is the output of: print('Python'[1])?",
        "options": ["P", "y", "Py", "Error"],
        "correct_index": 1,
        "explanation": "String indexing in Python is 0-based. Index 1 refers to the second character, which is 'y'.",
        "difficulty": "hard",
        "topic_tag": "strings"
    },
    {
        "question_type": "mcq",
        "text": "What happens if you try to concatenate a string and an integer: 'Age: ' + 25?",
        "options": ["'Age: 25'", "Age: 25", "TypeError", "'Age: ' + 25"],
        "correct_index": 2,
        "explanation": "Python raises a TypeError when trying to concatenate string and integer. Use str(25) to convert first.",
        "difficulty": "hard",
        "topic_tag": "strings"
    },
    # Coding Questions - Easy
    {
        "question_type": "coding",
        "text": "Write a function called 'greet' that takes a name parameter and returns a greeting in the format 'Hello, [name]!'",
        "starter_code": "def greet(name):\n    # Your code here\n    pass",
        "test_cases": [
            {"function_call": "greet('Alice')", "expected": "Hello, Alice!"},
            {"function_call": "greet('Bob')", "expected": "Hello, Bob!"},
            {"function_call": "greet('World')", "expected": "Hello, World!"}
        ],
        "solution_code": "def greet(name):\n    return f'Hello, {name}!'",
        "explanation": "Use an f-string to embed the name parameter in the greeting string.",
        "difficulty": "easy",
        "topic_tag": "functions"
    },
    {
        "question_type": "coding",
        "text": "Write a function called 'string_length' that returns the length of a given string.",
        "starter_code": "def string_length(text):\n    # Your code here\n    pass",
        "test_cases": [
            {"function_call": "string_length('hello')", "expected": "5"},
            {"function_call": "string_length('')", "expected": "0"},
            {"function_call": "string_length('Python')", "expected": "6"}
        ],
        "solution_code": "def string_length(text):\n    return len(text)",
        "explanation": "Use the built-in len() function to get the length of a string.",
        "difficulty": "easy",
        "topic_tag": "strings"
    },
    # Coding Questions - Medium
    {
        "question_type": "coding",
        "text": "Write a function called 'first_last' that takes a string and returns a new string with only the first and last characters.",
        "starter_code": "def first_last(text):\n    # Your code here\n    pass",
        "test_cases": [
            {"function_call": "first_last('hello')", "expected": "ho"},
            {"function_call": "first_last('Python')", "expected": "Pn"},
            {"function_call": "first_last('ab')", "expected": "ab"}
        ],
        "solution_code": "def first_last(text):\n    return text[0] + text[-1]",
        "explanation": "Use index 0 for the first character and index -1 for the last character.",
        "difficulty": "medium",
        "topic_tag": "strings"
    },
    {
        "question_type": "coding",
        "text": "Write a function called 'combine_words' that takes two strings and returns them combined with a space between.",
        "starter_code": "def combine_words(word1, word2):\n    # Your code here\n    pass",
        "test_cases": [
            {"function_call": "combine_words('Hello', 'World')", "expected": "Hello World"},
            {"function_call": "combine_words('Good', 'Morning')", "expected": "Good Morning"},
            {"function_call": "combine_words('Python', 'Programming')", "expected": "Python Programming"}
        ],
        "solution_code": "def combine_words(word1, word2):\n    return word1 + ' ' + word2",
        "explanation": "Concatenate the two words with a space in between using the + operator.",
        "difficulty": "medium",
        "topic_tag": "strings"
    }
]

# Sample questions for Day 2
DAY2_QUESTIONS = [
    {
        "question_type": "mcq",
        "text": "What is the data type of: 3.14?",
        "options": ["int", "float", "str", "double"],
        "correct_index": 1,
        "explanation": "Numbers with decimal points are floating-point numbers (float) in Python.",
        "difficulty": "easy",
        "topic_tag": "floats"
    },
    {
        "question_type": "mcq",
        "text": "What function converts a string '42' to an integer?",
        "options": ["str()", "int()", "float()", "num()"],
        "correct_index": 1,
        "explanation": "The int() function converts a string or float to an integer.",
        "difficulty": "easy",
        "topic_tag": "integers"
    },
    {
        "question_type": "mcq",
        "text": "What is the result of: 10 / 3?",
        "options": ["3", "3.0", "3.333...", "Error"],
        "correct_index": 2,
        "explanation": "The / operator performs true division and returns a float, approximately 3.333...",
        "difficulty": "easy",
        "topic_tag": "floats"
    },
    {
        "question_type": "mcq",
        "text": "What is the result of: 10 // 3?",
        "options": ["3", "3.0", "3.333...", "Error"],
        "correct_index": 0,
        "explanation": "The // operator performs floor division, returning the integer part of the division.",
        "difficulty": "medium",
        "topic_tag": "integers"
    },
    {
        "question_type": "mcq",
        "text": "What is the result of: 10 % 3?",
        "options": ["1", "3", "3.333...", "0"],
        "correct_index": 0,
        "explanation": "The % operator returns the remainder of division. 10 divided by 3 is 3 with remainder 1.",
        "difficulty": "medium",
        "topic_tag": "integers"
    },
    {
        "question_type": "mcq",
        "text": "What is the result of: 2 ** 3?",
        "options": ["5", "6", "8", "9"],
        "correct_index": 2,
        "explanation": "The ** operator performs exponentiation. 2 ** 3 means 2 to the power of 3 = 8.",
        "difficulty": "medium",
        "topic_tag": "integers"
    },
    {
        "question_type": "mcq",
        "text": "What does round(3.7) return?",
        "options": ["3", "4", "3.0", "4.0"],
        "correct_index": 1,
        "explanation": "round() returns the nearest integer. 3.7 rounds up to 4.",
        "difficulty": "medium",
        "topic_tag": "floats"
    },
    {
        "question_type": "mcq",
        "text": "What is type(5 + 3.0)?",
        "options": ["<class 'int'>", "<class 'float'>", "<class 'str'>", "Error"],
        "correct_index": 1,
        "explanation": "When mixing int and float in arithmetic, Python converts the result to float.",
        "difficulty": "hard",
        "topic_tag": "floats"
    },
    {
        "question_type": "coding",
        "text": "Write a function called 'to_celsius' that converts Fahrenheit to Celsius using the formula: (F - 32) * 5/9",
        "starter_code": "def to_celsius(fahrenheit):\n    # Your code here\n    pass",
        "test_cases": [
            {"function_call": "to_celsius(32)", "expected": "0.0"},
            {"function_call": "to_celsius(212)", "expected": "100.0"},
            {"function_call": "to_celsius(98.6)", "expected": "37.0"}
        ],
        "solution_code": "def to_celsius(fahrenheit):\n    return (fahrenheit - 32) * 5/9",
        "explanation": "Apply the Fahrenheit to Celsius conversion formula.",
        "difficulty": "easy",
        "topic_tag": "floats"
    },
    {
        "question_type": "coding",
        "text": "Write a function called 'is_even' that returns True if a number is even, False otherwise.",
        "starter_code": "def is_even(num):\n    # Your code here\n    pass",
        "test_cases": [
            {"function_call": "is_even(4)", "expected": "True"},
            {"function_call": "is_even(7)", "expected": "False"},
            {"function_call": "is_even(0)", "expected": "True"}
        ],
        "solution_code": "def is_even(num):\n    return num % 2 == 0",
        "explanation": "Use the modulo operator % to check if there's no remainder when divided by 2.",
        "difficulty": "easy",
        "topic_tag": "integers"
    },
    {
        "question_type": "coding",
        "text": "Write a function called 'sum_digits' that takes a two-digit number and returns the sum of its digits.",
        "starter_code": "def sum_digits(num):\n    # Your code here\n    pass",
        "test_cases": [
            {"function_call": "sum_digits(35)", "expected": "8"},
            {"function_call": "sum_digits(99)", "expected": "18"},
            {"function_call": "sum_digits(10)", "expected": "1"}
        ],
        "solution_code": "def sum_digits(num):\n    return num // 10 + num % 10",
        "explanation": "Use floor division to get tens digit and modulo to get ones digit, then add them.",
        "difficulty": "medium",
        "topic_tag": "integers"
    }
]

# Sample questions for Day 3 - Control Flow & Logical Operators
DAY3_QUESTIONS = [
    # MCQ Questions - Easy
    {
        "question_type": "mcq",
        "text": "What will the following code evaluate to?\\nnot 5 == 5",
        "options": ["True", "False", "5", "Error"],
        "correct_index": 1,
        "explanation": "5 == 5 is True, but 'not' reverses it, so it becomes False.",
        "difficulty": "easy",
        "topic_tag": "logical-operators"
    },
    {
        "question_type": "mcq",
        "text": "Which operator is used to check if two values are equal in Python?",
        "options": ["=", "==", "!=", ":="],
        "correct_index": 1,
        "explanation": "The == operator checks equality. A single = is for assignment, != checks inequality.",
        "difficulty": "easy",
        "topic_tag": "comparison-operators"
    },
    {
        "question_type": "mcq",
        "text": "What is the result of: 10 % 3?",
        "options": ["3", "1", "3.33", "0"],
        "correct_index": 1,
        "explanation": "The modulo operator % returns the remainder. 10 ÷ 3 = 3 remainder 1.",
        "difficulty": "easy",
        "topic_tag": "modulo"
    },
    {
        "question_type": "mcq",
        "text": "Which keyword is used to check an additional condition if the first is False?",
        "options": ["else if", "elseif", "elif", "otherwise"],
        "correct_index": 2,
        "explanation": "Python uses 'elif' (short for else-if) to check additional conditions.",
        "difficulty": "easy",
        "topic_tag": "conditionals"
    },
    # MCQ Questions - Medium
    {
        "question_type": "mcq",
        "text": "What will the following code evaluate to?\\nFalse or True or False",
        "options": ["True", "False", "SyntaxError", "None"],
        "correct_index": 0,
        "explanation": "Evaluating left to right: False or True → True, then True or False → True.",
        "difficulty": "medium",
        "topic_tag": "logical-operators"
    },
    {
        "question_type": "mcq",
        "text": "What does this code print?\\na = 5\\nb = 7\\nif a >= b and a != b:\\n    print('A')\\nelif not a >= b and a != b:\\n    print('B')\\nelse:\\n    print('C')",
        "options": ["A", "B", "C", "Error"],
        "correct_index": 1,
        "explanation": "a >= b is False (5 >= 7 is False). So first condition fails. In elif: not False = True, and 5 != 7 is True. Both True, so 'B' prints.",
        "difficulty": "medium",
        "topic_tag": "logical-operators"
    },
    {
        "question_type": "mcq",
        "text": "How do you check if a number is even using modulo?",
        "options": ["num % 2 == 1", "num % 2 == 0", "num / 2 == 0", "num // 2 == 0"],
        "correct_index": 1,
        "explanation": "An even number divided by 2 has no remainder, so num % 2 == 0.",
        "difficulty": "medium",
        "topic_tag": "modulo"
    },
    {
        "question_type": "mcq",
        "text": "What is the difference between if/elif/else and multiple if statements?",
        "options": [
            "They are exactly the same",
            "if/elif/else runs only one branch; multiple ifs check each independently",
            "Multiple ifs run only one branch; if/elif/else check each independently",
            "elif cannot have conditions"
        ],
        "correct_index": 1,
        "explanation": "In if/elif/else, once a condition matches, others are skipped. Multiple separate if statements are each checked independently.",
        "difficulty": "medium",
        "topic_tag": "conditionals"
    },
    # MCQ Questions - Hard
    {
        "question_type": "mcq",
        "text": "What will this print?\\nx = 15\\nif x > 10:\\n    print('A')\\nif x > 5:\\n    print('B')\\nelse:\\n    print('C')",
        "options": ["A", "B", "A\\nB", "A\\nC"],
        "correct_index": 2,
        "explanation": "These are separate if statements. First prints 'A' (15 > 10). Second prints 'B' (15 > 5). The else only applies to the second if.",
        "difficulty": "hard",
        "topic_tag": "conditionals"
    },
    {
        "question_type": "mcq",
        "text": "What does (True and False) or (not False) evaluate to?",
        "options": ["True", "False", "None", "Error"],
        "correct_index": 0,
        "explanation": "(True and False) = False. (not False) = True. False or True = True.",
        "difficulty": "hard",
        "topic_tag": "logical-operators"
    },
    # Coding Questions - Easy
    {
        "question_type": "coding",
        "text": "Write a function called 'is_even' that returns True if the number is even, False otherwise. Use the modulo operator.",
        "starter_code": "def is_even(num):\\n    # Your code here\\n    pass",
        "test_cases": [
            {"function_call": "is_even(4)", "expected": "True"},
            {"function_call": "is_even(7)", "expected": "False"},
            {"function_call": "is_even(0)", "expected": "True"}
        ],
        "solution_code": "def is_even(num):\\n    return num % 2 == 0",
        "explanation": "Use modulo 2. If remainder is 0, the number is even.",
        "difficulty": "easy",
        "topic_tag": "modulo"
    },
    {
        "question_type": "coding",
        "text": "Write a function called 'absolute_value' that returns the absolute value of a number (positive version). Use an if/else statement, not the built-in abs().",
        "starter_code": "def absolute_value(num):\\n    # Your code here\\n    pass",
        "test_cases": [
            {"function_call": "absolute_value(-5)", "expected": "5"},
            {"function_call": "absolute_value(3)", "expected": "3"},
            {"function_call": "absolute_value(0)", "expected": "0"}
        ],
        "solution_code": "def absolute_value(num):\\n    if num < 0:\\n        return -num\\n    else:\\n        return num",
        "explanation": "If negative, return the negation (making it positive). Otherwise return as-is.",
        "difficulty": "easy",
        "topic_tag": "conditionals"
    },
    # Coding Questions - Medium
    {
        "question_type": "coding",
        "text": "Write a function called 'ticket_price' that takes an age and returns the ticket price: under 12 → $5, 12-18 → $7, over 18 → $12.",
        "starter_code": "def ticket_price(age):\\n    # Your code here\\n    pass",
        "test_cases": [
            {"function_call": "ticket_price(10)", "expected": "5"},
            {"function_call": "ticket_price(15)", "expected": "7"},
            {"function_call": "ticket_price(25)", "expected": "12"}
        ],
        "solution_code": "def ticket_price(age):\\n    if age < 12:\\n        return 5\\n    elif age <= 18:\\n        return 7\\n    else:\\n        return 12",
        "explanation": "Use elif to check age ranges in order. First match wins.",
        "difficulty": "medium",
        "topic_tag": "conditionals"
    },
    {
        "question_type": "coding",
        "text": "Write a function called 'in_range' that returns True if a number is between 10 and 20 (inclusive), False otherwise. Use the 'and' operator.",
        "starter_code": "def in_range(num):\\n    # Your code here\\n    pass",
        "test_cases": [
            {"function_call": "in_range(15)", "expected": "True"},
            {"function_call": "in_range(10)", "expected": "True"},
            {"function_call": "in_range(5)", "expected": "False"}
        ],
        "solution_code": "def in_range(num):\\n    return num >= 10 and num <= 20",
        "explanation": "Both conditions must be True: num >= 10 AND num <= 20.",
        "difficulty": "medium",
        "topic_tag": "logical-operators"
    },
    {
        "question_type": "coding",
        "text": "Write a function called 'grade' that takes a score (0-100) and returns: 'A' for 90+, 'B' for 80-89, 'C' for 70-79, 'D' for 60-69, 'F' for below 60.",
        "starter_code": "def grade(score):\\n    # Your code here\\n    pass",
        "test_cases": [
            {"function_call": "grade(95)", "expected": "A"},
            {"function_call": "grade(82)", "expected": "B"},
            {"function_call": "grade(55)", "expected": "F"}
        ],
        "solution_code": "def grade(score):\\n    if score >= 90:\\n        return 'A'\\n    elif score >= 80:\\n        return 'B'\\n    elif score >= 70:\\n        return 'C'\\n    elif score >= 60:\\n        return 'D'\\n    else:\\n        return 'F'",
        "explanation": "Check from highest to lowest. First matching condition returns immediately.",
        "difficulty": "medium",
        "topic_tag": "conditionals"
    }
]


# Day 4: Randomisation and Python Lists
DAY4_QUESTIONS = [
    # MCQ Questions - Easy
    {
        "question_type": "mcq",
        "text": "What module do you import to generate random numbers in Python?",
        "options": ["math", "random", "randint", "numbers"],
        "correct_index": 1,
        "explanation": "The 'random' module contains functions for generating random numbers.",
        "difficulty": "easy",
        "topic_tag": "random"
    },
    {
        "question_type": "mcq",
        "text": "What is the correct syntax to create a list in Python?",
        "options": ["list = (1, 2, 3)", "list = {1, 2, 3}", "list = [1, 2, 3]", "list = <1, 2, 3>"],
        "correct_index": 2,
        "explanation": "Lists use square brackets [] to enclose items.",
        "difficulty": "easy",
        "topic_tag": "lists"
    },
    {
        "question_type": "mcq",
        "text": "What index is used to access the first item in a list?",
        "options": ["1", "0", "-1", "first"],
        "correct_index": 1,
        "explanation": "Python uses 0-based indexing, so the first item is at index 0.",
        "difficulty": "easy",
        "topic_tag": "indexing"
    },
    {
        "question_type": "mcq",
        "text": "What does random.randint(1, 10) return?",
        "options": [
            "A random float between 1 and 10",
            "A random integer between 1 and 10 (inclusive)",
            "A random integer between 1 and 9",
            "Always returns 5"
        ],
        "correct_index": 1,
        "explanation": "randint(a, b) returns a random integer N such that a <= N <= b.",
        "difficulty": "easy",
        "topic_tag": "random"
    },
    # MCQ Questions - Medium
    {
        "question_type": "mcq",
        "text": "What does fruits[-1] return if fruits = ['apple', 'banana', 'cherry']?",
        "options": ["'apple'", "'banana'", "'cherry'", "IndexError"],
        "correct_index": 2,
        "explanation": "Negative indexing starts from the end. -1 refers to the last item.",
        "difficulty": "medium",
        "topic_tag": "indexing"
    },
    {
        "question_type": "mcq",
        "text": "What is the difference between .append() and .extend()?",
        "options": [
            "They are the same",
            "append() adds a single item; extend() adds items from an iterable",
            "extend() adds a single item; append() adds items from an iterable",
            "append() creates a new list; extend() modifies in place"
        ],
        "correct_index": 1,
        "explanation": "append() adds one item to the end, while extend() adds each element from an iterable.",
        "difficulty": "medium",
        "topic_tag": "lists"
    },
    {
        "question_type": "mcq",
        "text": "What does random.random() return?",
        "options": [
            "A random integer",
            "A random float between 0 and 1 (0 inclusive, 1 exclusive)",
            "A random float between 0 and 1 (both inclusive)",
            "A random boolean"
        ],
        "correct_index": 1,
        "explanation": "random.random() returns a float x where 0.0 <= x < 1.0.",
        "difficulty": "medium",
        "topic_tag": "random"
    },
    {
        "question_type": "mcq",
        "text": "What is a Python module?",
        "options": [
            "A type of variable",
            "A file containing Python code that can be imported",
            "A special type of list",
            "A built-in function"
        ],
        "correct_index": 1,
        "explanation": "A module is a Python file (.py) containing functions, classes, and variables that can be imported.",
        "difficulty": "medium",
        "topic_tag": "modules"
    },
    # MCQ Questions - Hard
    {
        "question_type": "mcq",
        "text": "What will this code print?\\nfruits = ['a', 'b', 'c']\\nfruits[1] = 'x'\\nprint(fruits)",
        "options": ["['a', 'b', 'c']", "['x', 'b', 'c']", "['a', 'x', 'c']", "Error"],
        "correct_index": 2,
        "explanation": "Index 1 refers to the second item ('b'), which gets replaced with 'x'.",
        "difficulty": "hard",
        "topic_tag": "lists"
    },
    {
        "question_type": "mcq",
        "text": "What happens if you access an index that doesn't exist in a list?",
        "options": ["Returns None", "Returns 0", "Raises IndexError", "Returns an empty string"],
        "correct_index": 2,
        "explanation": "Accessing an invalid index raises an IndexError exception.",
        "difficulty": "hard",
        "topic_tag": "indexing"
    },
    # Coding Challenges
    {
        "question_type": "coding",
        "text": "Write a function called `coin_flip` that returns 'Heads' or 'Tails' randomly.",
        "starter_code": "import random\n\ndef coin_flip():\n    # Your code here\n    pass",
        "test_cases": [
            {"input": "", "expected_pattern": "^(Heads|Tails)$"}
        ],
        "solution_code": "import random\n\ndef coin_flip():\n    if random.randint(0, 1) == 0:\n        return 'Heads'\n    else:\n        return 'Tails'",
        "explanation": "Use random.randint(0, 1) to generate 0 or 1, then return 'Heads' or 'Tails' accordingly.",
        "difficulty": "easy",
        "topic_tag": "random"
    },
    {
        "question_type": "coding",
        "text": "Write a function called `get_last` that takes a list and returns the last item.",
        "starter_code": "def get_last(my_list):\n    # Your code here\n    pass",
        "test_cases": [
            {"input": "[[1, 2, 3]]", "expected": "3"},
            {"input": "[['a', 'b', 'c', 'd']]", "expected": "'d'"},
            {"input": "[[42]]", "expected": "42"}
        ],
        "solution_code": "def get_last(my_list):\n    return my_list[-1]",
        "explanation": "Use index -1 to access the last item in a list.",
        "difficulty": "easy",
        "topic_tag": "indexing"
    },
    {
        "question_type": "coding",
        "text": "Write a function called `random_choice` that takes a list and returns a random item from it.",
        "starter_code": "import random\n\ndef random_choice(items):\n    # Your code here\n    pass",
        "test_cases": [
            {"input": "[['a', 'b', 'c']]", "expected_in": "['a', 'b', 'c']"}
        ],
        "solution_code": "import random\n\ndef random_choice(items):\n    return random.choice(items)",
        "explanation": "random.choice(list) returns a random element from the list.",
        "difficulty": "medium",
        "topic_tag": "random"
    },
    {
        "question_type": "coding",
        "text": "Write a function called `add_to_list` that takes a list and an item, adds the item to the end, and returns the modified list.",
        "starter_code": "def add_to_list(my_list, item):\n    # Your code here\n    pass",
        "test_cases": [
            {"input": "[[1, 2], 3]", "expected": "[1, 2, 3]"},
            {"input": "[['a', 'b'], 'c']", "expected": "['a', 'b', 'c']"},
            {"input": "[[], 'x']", "expected": "['x']"}
        ],
        "solution_code": "def add_to_list(my_list, item):\n    my_list.append(item)\n    return my_list",
        "explanation": "Use .append() to add a single item to the end of a list.",
        "difficulty": "easy",
        "topic_tag": "lists"
    },
    {
        "question_type": "coding",
        "text": "Write a function called `swap_first_last` that takes a list and swaps the first and last items, returning the modified list.",
        "starter_code": "def swap_first_last(my_list):\n    # Your code here\n    pass",
        "test_cases": [
            {"input": "[[1, 2, 3]]", "expected": "[3, 2, 1]"},
            {"input": "[['a', 'b', 'c', 'd']]", "expected": "['d', 'b', 'c', 'a']"},
            {"input": "[[5, 10]]", "expected": "[10, 5]"}
        ],
        "solution_code": "def swap_first_last(my_list):\n    my_list[0], my_list[-1] = my_list[-1], my_list[0]\n    return my_list",
        "explanation": "Use tuple unpacking to swap values: a, b = b, a. Access first with [0] and last with [-1].",
        "difficulty": "medium",
        "topic_tag": "lists"
    }
]


DAY5_QUESTIONS = [
    # MCQs
    {
        "text": "What does a `for` loop do in Python?",
        "options": [
            "Creates a variable that stores a list",
            "Repeats a block of code for each item in a collection",
            "Decides between two options based on a condition",
            "Defines a new function"
        ],
        "correct_index": 1,
        "difficulty": "easy",
        "topic_tag": "loops",
        "explanation": "A for loop iterates over a sequence (like a list or range) and executes the block of code for each item."
    },
    {
        "text": "What sequence of numbers does `range(1, 5)` generate?",
        "options": [
            "1, 2, 3, 4, 5",
            "1, 2, 3, 4",
            "0, 1, 2, 3, 4",
            "2, 3, 4, 5"
        ],
        "correct_index": 1,
        "difficulty": "easy",
        "topic_tag": "range",
        "explanation": "The range function includes the start value (1) but excludes the stop value (5). So it gives 1, 2, 3, 4."
    },
    {
        "text": "Which code snippet correctly prints 'Hello' 5 times?",
        "options": [
            "for i in range(5): print('Hello')",
            "for i in range(1, 4): print('Hello')",
            "print('Hello') * 5",
            "loop 5: print('Hello')"
        ],
        "correct_index": 0,
        "difficulty": "easy",
        "topic_tag": "loops",
        "explanation": "`range(5)` generates numbers 0, 1, 2, 3, 4, which is 5 iterations."
    },
    {
        "text": "What is the output of `range(0, 10, 3)`?",
        "options": [
            "0, 1, 2, 3, ... 9",
            "0, 3, 6, 9",
            "3, 6, 9",
            "0, 3, 6, 9, 12"
        ],
        "correct_index": 1,
        "difficulty": "medium",
        "topic_tag": "range",
        "explanation": "It starts at 0, steps by 3 (0, 3, 6, 9). The next number 12 is >= 10, so it stops."
    },
    {
        "text": "In `for item in items:`, what happens if `items` is an empty list?",
        "options": [
            "The loop runs once with None",
            "It raises an error",
            "The loop body never executes",
            "The loop runs infinitely"
        ],
        "correct_index": 2,
        "difficulty": "medium",
        "topic_tag": "loops",
        "explanation": "If the collection is empty, there are no items to iterate over, so the loop body is skipped entirely."
    },
    {
        "text": "How do you calculate the sum of a list `numbers` without using `sum()`?",
        "options": [
            "total = 0\nfor n in numbers: total += n",
            "total = 0\nfor n in numbers: total = n",
            "for n in numbers: total += n",
            "total = numbers[0] + numbers[-1]"
        ],
        "correct_index": 0,
        "difficulty": "medium",
        "topic_tag": "algorithms",
        "explanation": "You need to initialize an accumulator variable (`total = 0`) and add each number to it in the loop."
    },
    {
        "text": "Which indentation is correct for the code inside a for loop?",
        "options": [
            "No indentation needed",
            "2 spaces",
            "4 spaces (or 1 tab)",
            "Align with the for keyword"
        ],
        "correct_index": 2,
        "difficulty": "easy",
        "topic_tag": "code-blocks",
        "explanation": "Standard Python indentation is 4 spaces. The code block inside the loop MUST be indented."
    },
    {
        "text": "What does `break` do inside a loop?",
        "options": [
            "Pauses the loop",
            "Exits the loop immediately",
            "Skips the current iteration",
            "Breaks the computer"
        ],
        "correct_index": 1,
        "difficulty": "medium",
        "topic_tag": "control-flow",
        "explanation": "`break` stops the loop execution entirely and moves to the code after the loop."
    },
    {
        "text": "If `fruits = ['Apple', 'Pear']`, what does `for f in fruits` print?",
        "options": [
            "Apple, then Pear",
            "0, then 1",
            "['Apple', 'Pear']",
            "f"
        ],
        "correct_index": 0,
        "difficulty": "easy",
        "topic_tag": "loops",
        "explanation": "The loop variable `f` takes on the value of each item in the list sequentially."
    },
    {
        "text": "What is the maximum value in `range(1, 101)`?",
        "options": [
            "99",
            "100",
            "101",
            "1"
        ],
        "correct_index": 1,
        "difficulty": "easy",
        "topic_tag": "range",
        "explanation": "The stop value 101 is exclusive, so the sequence goes up to 100."
    },

    # Coding Challenges
    {
        "question_type": "coding",
        "text": "Average Height\nWrite a program that calculates the average height from a list of heights.\nDO NOT use `sum()` or `len()`.\n\nExample Input:\nheights = [180, 124, 165, 173, 189, 169, 146]\nExample Output:\n163",
        "starter_code": "def solve(heights):\n    # Write your code here\n    # Use a for loop to calculate total_height and number_of_students\n    return 0",
        "test_cases": [
            {"input": [[180, 124, 165, 173, 189, 169, 146]], "expected": 163},
            {"input": [[150, 150, 150]], "expected": 150},
            {"input": [[200, 100]], "expected": 150}
        ],
        "difficulty": "medium",
        "topic_tag": "algorithms",
        "solution_code": "def solve(heights):\n    total_height = 0\n    count = 0\n    for h in heights:\n        total_height += h\n        count += 1\n    return round(total_height / count)"
    },
    {
        "question_type": "coding",
        "text": "Highest Score\nWrite a program that calculates the highest score from a list of scores.\nDO NOT use `max()`.\n\nExample Input:\nscores = [78, 65, 89, 86, 55, 91, 64, 89]\nExample Output:\n91",
        "starter_code": "def solve(scores):\n    # Write your code here\n    return 0",
        "test_cases": [
            {"input": [[78, 65, 89, 86, 55, 91, 64, 89]], "expected": 91},
            {"input": [[10, 20, 5]], "expected": 20},
            {"input": [[5, 4, 3]], "expected": 5}
        ],
        "difficulty": "medium",
        "topic_tag": "algorithms",
        "solution_code": "def solve(scores):\n    highest = 0\n    for score in scores:\n        if score > highest:\n            highest = score\n    return highest"
    },
    {
        "question_type": "coding",
        "text": "Adding Even Numbers\nCalculate the sum of all even numbers from 1 to 100 (including 100).\nRange should be `range(1, 101)` or similar logic.\n\nOutput should be the single integer sum.",
        "starter_code": "def solve():\n    # Write your code here\n    return 0",
        "test_cases": [
            {"input": [], "expected": 2550}
        ],
        "difficulty": "easy",
        "topic_tag": "range",
        "solution_code": "def solve():\n    total = 0\n    for number in range(2, 101, 2):\n        total += number\n    return total"
    },
    {
        "question_type": "coding",
        "text": "FizzBuzz\nWrite a function that returns a list of numbers from 1 to `n`.\nBut for multiples of 3, use 'Fizz' instead of the number.\nFor multiples of 5, use 'Buzz'.\nFor multiples of both 3 and 5, use 'FizzBuzz'.\n\nExample n=5: [1, 2, 'Fizz', 4, 'Buzz']",
        "starter_code": "def solve(n):\n    result = []\n    # Write your code here\n    return result",
        "test_cases": [
            {"input": [5], "expected": [1, 2, 'Fizz', 4, 'Buzz']},
            {"input": [15], "expected": [1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz']}
        ],
        "difficulty": "hard",
        "topic_tag": "algorithms",
        "solution_code": "def solve(n):\n    result = []\n    for number in range(1, n + 1):\n        if number % 3 == 0 and number % 5 == 0:\n            result.append('FizzBuzz')\n        elif number % 3 == 0:\n            result.append('Fizz')\n        elif number % 5 == 0:\n            result.append('Buzz')\n        else:\n            result.append(number)\n    return result"
    },
    {
        "question_type": "coding",
        "text": "Simple Password Generator\nCreate a function that combines a list of letters, numbers, and symbols into a single string.\nInput: letters=['a', 'b'], numbers=['1'], symbols=['!']\nOutput: 'ab1!' (Order: letters, then symbols, then numbers - simplified for this check)",
        "starter_code": "def solve(letters, numbers, symbols):\n    # Combine them all into one string in order: letters + symbols + numbers\n    return ''",
        "test_cases": [
            {"input": [['a', 'b'], ['1'], ['!']], "expected": "ab!1"},
            {"input": [['A'], ['9', '8'], ['#']], "expected": "A#98"}
        ],
        "difficulty": "medium",
        "topic_tag": "strings",
        "solution_code": "def solve(letters, numbers, symbols):\n    password = ''\n    for char in letters:\n        password += char\n    for char in symbols:\n        password += char\n    for char in numbers:\n        password += char\n    return password"
    }
]

def seed_sample_questions():
    """Seed the sample questions for Day 1, Day 2, Day 3, and Day 4."""
    print("Seeding sample questions to Supabase...")
    
    # Clear and seed Day 1
    clear_quiz_questions('day-1-practice')
    seed_questions('day-1-practice', DAY1_QUESTIONS)
    
    # Clear and seed Day 2
    clear_quiz_questions('day-2-practice')
    seed_questions('day-2-practice', DAY2_QUESTIONS)
    
    # Clear and seed Day 3
    clear_quiz_questions('day-3-practice')
    seed_questions('day-3-practice', DAY3_QUESTIONS)
    
    # Clear and seed Day 4
    clear_quiz_questions('day-4-practice')
    seed_questions('day-4-practice', DAY4_QUESTIONS)
    
    # Clear and seed Day 5
    clear_quiz_questions('day-5-practice')
    seed_questions('day-5-practice', DAY5_QUESTIONS)
    
    print("\nDone! Sample questions have been seeded.")


if __name__ == '__main__':
    import argparse
    import sys

    parser = argparse.ArgumentParser(description='Seed Supabase with quiz questions.')
    parser.add_argument('--all', action='store_true', help='Seed from all JSON files in data/questions')
    parser.add_argument('--force', action='store_true', help='Force deletion of existing questions')
    
    args = parser.parse_args()

    if not args.force:
        print("WARNING: This script will delete existing questions from the database.")
        print("To proceed, please run with the --force flag:")
        print(f"python {sys.argv[0]} {'--all ' if args.all else ''}--force")
        sys.exit(1)

    if args.all:
        seed_all_from_directory()
    else:
        seed_sample_questions()

