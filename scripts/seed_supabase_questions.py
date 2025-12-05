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


def seed_sample_questions():
    """Seed the sample questions for Day 1 and Day 2."""
    print("Seeding sample questions to Supabase...")
    
    # Clear and seed Day 1
    clear_quiz_questions('day-1-practice')
    seed_questions('day-1-practice', DAY1_QUESTIONS)
    
    # Clear and seed Day 2
    clear_quiz_questions('day-2-practice')
    seed_questions('day-2-practice', DAY2_QUESTIONS)
    
    print("\nDone! Sample questions have been seeded.")


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == '--all':
        # Seed all from JSON files
        seed_all_from_directory()
    else:
        # Seed sample questions
        seed_sample_questions()

