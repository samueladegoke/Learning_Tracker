"""
Generate Jupyter Notebook for Day 1 practice exercises.

This module creates an interactive notebook with quizzes, exercises,
and study materials extracted from course content.
"""

import json
import os
import html
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
import nbformat
from nbformat.v4 import new_notebook, new_markdown_cell, new_code_cell

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Constants
ASCII_LOWERCASE_A = ord('a')  # ASCII value for 'a' (97)
OUTPUT_DIR = "Day 1"
EXTRACTED_CONTENT_FILE = "day1_extracted_content.json"


def sanitize_markdown(text: str) -> str:
    """
    Escape HTML special characters for safe markdown rendering.
    
    Prevents HTML/JavaScript injection in notebook cells.
    
    Args:
        text: Raw text that may contain HTML/unsafe characters
        
    Returns:
        Sanitized text safe for markdown rendering
    """
    if not isinstance(text, str):
        return str(text)
    return html.escape(text)


def escape_python_string(text: str) -> str:
    """
    Escape quotes and newlines for Python string literals.
    
    Args:
        text: String that may contain quotes or newlines
        
    Returns:
        Escaped string safe for use in Python code strings
    """
    if not isinstance(text, str):
        text = str(text)
    
    # Escape backslashes first, then quotes, then newlines
    return text.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')


def get_correct_index(correct_response: str, num_options: int) -> int:
    """
    Convert letter response (a-z) to 0-based index.
    
    Args:
        correct_response: Single letter response (e.g., 'a', 'b')
        num_options: Number of options available
        
    Returns:
        0-based index of correct answer
        
    Raises:
        ValueError: If response is invalid or out of range
    """
    if not correct_response or len(correct_response) != 1:
        raise ValueError(f"Invalid response format: {correct_response}")
    
    letter = correct_response.lower()
    if not letter.isalpha():
        raise ValueError(f"Response must be a letter: {correct_response}")
    
    index = ord(letter) - ASCII_LOWERCASE_A  # 'a' = 0, 'b' = 1, etc.
    
    if index < 0 or index >= num_options:
        raise ValueError(
            f"Index {index} out of range for {num_options} options "
            f"(response: {correct_response})"
        )
    
    return index


def create_quiz_code(question: str, options: List[str], correct_index: int, explanation: str = "") -> str:
    """
    Generate safe quiz code cell with proper escaping.
    
    Args:
        question: Question text
        options: List of answer options
        correct_index: 0-based index of correct answer
        explanation: Optional explanation text
        
    Returns:
        Python code string for quiz widget
        
    Raises:
        ValueError: If inputs are invalid
    """
    if not options:
        raise ValueError("Options list cannot be empty")
    
    if correct_index < 0 or correct_index >= len(options):
        raise ValueError(
            f"Correct index {correct_index} out of range for {len(options)} options"
        )
    
    safe_question = escape_python_string(question)
    safe_options = [escape_python_string(opt) for opt in options]
    safe_explanation = escape_python_string(explanation) if explanation else ""
    
    if explanation:
        return f"""create_quiz(
    question="{safe_question}",
    options={safe_options},
    correct_index={correct_index},
    explanation="{safe_explanation}"
)"""
    else:
        return f"""create_quiz(
    question="{safe_question}",
    options={safe_options},
    correct_index={correct_index}
)"""


def load_extracted_content(filepath: str) -> Dict[str, Any]:
    """
    Load extracted content from JSON file.
    
    Args:
        filepath: Path to JSON file
        
    Returns:
        Dictionary containing extracted content
        
    Raises:
        FileNotFoundError: If file doesn't exist
        json.JSONDecodeError: If file contains invalid JSON
    """
    if not Path(filepath).exists():
        raise FileNotFoundError(
            f"{filepath} not found. Run extraction script first."
        )
    
    try:
        with open(filepath, "r", encoding='utf-8') as f:
            content = json.load(f)
        
        # Validate structure
        required_keys = ["pdfs", "vtts", "htmls", "txts"]
        for key in required_keys:
            if key not in content:
                logger.warning(f"Missing key '{key}' in extracted content")
                content[key] = {}
        
        return content
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in {filepath}: {e}")
        raise
    except Exception as e:
        logger.error(f"Error loading {filepath}: {e}", exc_info=True)
        raise


def clean_html_text(text: str) -> str:
    """
    Remove HTML tags and normalize whitespace.
    
    Args:
        text: Text that may contain HTML tags
        
    Returns:
        Cleaned text with HTML tags removed
    """
    if not isinstance(text, str):
        return str(text)
    
    # Remove common HTML tags
    text = text.replace("<p>", "").replace("</p>", "\n")
    text = text.replace("<br>", "\n").replace("<br/>", "\n")
    text = text.replace("<code>", "`").replace("</code>", "`")
    text = text.replace("<strong>", "**").replace("</strong>", "**")
    text = text.replace("<em>", "*").replace("</em>", "*")
    
    # Normalize whitespace
    lines = [line.strip() for line in text.split('\n')]
    return '\n'.join(filter(None, lines))


def generate_notebook(content: Dict[str, Any], output_path: str) -> None:
    """
    Generate the complete Jupyter notebook.
    
    Args:
        content: Dictionary containing extracted content
        output_path: Path where notebook should be saved
        
    Raises:
        IOError: If notebook cannot be written
    """
    nb = new_notebook()
    
    # --- Section 1: Introduction ---
    intro_text = (
        "# Day 1: Working with Variables in Python to Manage Data\n\n"
        "Welcome to Day 1 of 100 Days of Code! Today we cover the fundamentals "
        "of Python variables, input, and string manipulation."
    )
    nb.cells.append(new_markdown_cell(intro_text))
    
    # Add Course Pledge or Rules if available
    for filename, text in content.get("pdfs", {}).items():
        if text and ("Pledge" in filename or "Rules" in filename):
            safe_filename = sanitize_markdown(filename)
            safe_text = sanitize_markdown(text)
            nb.cells.append(new_markdown_cell(
                f"### {safe_filename}\n"
                f"<details><summary>Click to expand</summary>\n\n"
                f"{safe_text}\n\n</details>"
            ))
    
    # --- Section 2: Video Transcripts (Context) ---
    nb.cells.append(new_markdown_cell(
        "## Video Transcripts\n\n"
        "Review the content discussed in the videos for this day."
    ))
    
    for filename, text in content.get("vtts", {}).items():
        if text:
            clean_name = filename.replace(".en_US.vtt", "").replace(".vtt", "")
            safe_name = sanitize_markdown(clean_name)
            safe_text = sanitize_markdown(text)
            nb.cells.append(new_markdown_cell(
                f"### {safe_name}\n"
                f"<details><summary>Transcript</summary>\n\n"
                f"{safe_text}\n\n</details>"
            ))
    
    # --- Section 3: Deep Dive & Study Notes (External Research) ---
    deep_dive_content = """
## Deep Dive: Variables, Input, and Strings

### 1. Python Variables
- **Definition:** Variables are containers for storing data values.
- **Naming Conventions (Best Practices):**
    - Use `snake_case` for variable names (e.g., `user_name`, `total_score`).
    - Names cannot start with a number.
    - Avoid using Python keywords (e.g., `print`, `input`, `list`).
    - Be descriptive (e.g., `age` is better than `a`).
- **Dynamic Typing:** You don't need to declare the type. `x = 5` makes `x` an integer. `x = "Hello"` makes it a string.

### 2. The `input()` Function
- **Purpose:** Pauses the program and waits for the user to type something.
- **Return Type:** Always returns a **string** (`str`).
    - *Example:* `age = input("Age: ")` -> `age` will be `"25"` (string), not `25` (int).
    - *Conversion:* To use as a number, wrap it: `age = int(input("Age: "))`.

### 3. String Manipulation
- **Concatenation:** Joining strings using `+`.
    - `print("Hello " + "World")`
- **Newlines:** `\\n` creates a new line.
- **Length:** `len("string")` returns the number of characters.
"""
    nb.cells.append(new_markdown_cell(deep_dive_content))
    
    # --- Section 4: Interactive Quizzes (Generated + Extracted) ---
    nb.cells.append(new_markdown_cell(
        "## Interactive Quizzes\n"
        "Test your knowledge! Run the cells below to take the quizzes."
    ))
    
    # Helper function for quiz widget
    quiz_widget_code = """
import ipywidgets as widgets
from IPython.display import display, clear_output

def create_quiz(question, options, correct_index, explanation=""):
    radio = widgets.RadioButtons(options=options, description='', disabled=False)
    button = widgets.Button(description="Check Answer")
    output = widgets.Output()
    
    def on_button_clicked(b):
        with output:
            clear_output()
            if radio.index == correct_index:
                print("✅ Correct!")
            else:
                print("❌ Try again.")
            if explanation:
                print(f"Explanation: {explanation}")
                
    button.on_click(on_button_clicked)
    display(widgets.VBox([widgets.Label(question), radio, button, output]))
"""
    nb.cells.append(new_code_cell(quiz_widget_code))
    
    # Extracted Quizzes (from HTML)
    for filename, data in content.get("htmls", {}).items():
        if not data or not isinstance(data, dict):
            continue
            
        if "questions" in data:  # It's a quiz
            quiz_title = data.get('quiz_title', filename)
            safe_title = sanitize_markdown(quiz_title)
            nb.cells.append(new_markdown_cell(f"### {safe_title}"))
            
            questions = data.get("questions", [])
            if not isinstance(questions, list):
                logger.warning(f"Questions is not a list in {filename}")
                continue
            
            for q_idx, q in enumerate(questions):
                if not isinstance(q, dict):
                    logger.warning(f"Question {q_idx} is not a dict in {filename}")
                    continue
                
                prompt = q.get("prompt", {})
                if not isinstance(prompt, dict):
                    prompt = {}
                
                question_text = q.get("question_plain", "Question")
                answers = prompt.get("answers", [])
                
                if not isinstance(answers, list) or not answers:
                    logger.warning(f"No valid answers for question {q_idx} in {filename}")
                    continue
                
                # Clean HTML from answers
                cleaned_answers = []
                for ans in answers:
                    if isinstance(ans, str):
                        cleaned_ans = clean_html_text(ans)
                        cleaned_answers.append(cleaned_ans)
                
                if not cleaned_answers:
                    continue
                
                # Determine correct index
                correct_response = q.get("correct_response", ["a"])
                if not isinstance(correct_response, list) or not correct_response:
                    logger.warning(f"No correct response for question {q_idx} in {filename}")
                    continue
                
                try:
                    correct_idx = get_correct_index(correct_response[0], len(cleaned_answers))
                except ValueError as e:
                    logger.warning(f"Invalid correct response for question {q_idx}: {e}")
                    continue
                
                # Extract explanation if available
                explanation = ""
                if isinstance(prompt, dict) and "feedbacks" in prompt:
                    feedbacks = prompt["feedbacks"]
                    if isinstance(feedbacks, list) and len(feedbacks) > correct_idx:
                        explanation = feedbacks[correct_idx] or ""
                
                # Generate quiz code
                try:
                    quiz_code = create_quiz_code(
                        question_text,
                        cleaned_answers,
                        correct_idx,
                        explanation
                    )
                    nb.cells.append(new_code_cell(quiz_code))
                except ValueError as e:
                    logger.warning(f"Failed to create quiz code for question {q_idx}: {e}")
                    continue
    
    # Additional Generated Quizzes (Based on Research)
    extra_quizzes = [
        {
            "q": "What is the return type of the input() function?",
            "opts": ["Integer", "String", "Float", "Boolean"],
            "idx": 1,
            "expl": "input() always returns a string, even if the user types a number."
        },
        {
            "q": "Which of the following is a valid variable name in Python?",
            "opts": ["1st_player", "player-name", "player_name", "print"],
            "idx": 2,
            "expl": "Variable names cannot start with numbers, cannot contain hyphens, and should not be keywords."
        }
    ]
    
    nb.cells.append(new_markdown_cell("### Additional Practice Quizzes"))
    for eq in extra_quizzes:
        try:
            quiz_code = create_quiz_code(
                eq['q'],
                eq['opts'],
                eq['idx'],
                eq.get('expl', '')
            )
            nb.cells.append(new_code_cell(quiz_code))
        except (KeyError, ValueError) as e:
            logger.warning(f"Failed to create extra quiz: {e}")
            continue
    
    # --- Section 5: Coding Exercises ---
    nb.cells.append(new_markdown_cell(
        "## Coding Exercises\n"
        "Practice writing code. The solution is hidden below each exercise."
    ))
    
    for filename, data in content.get("htmls", {}).items():
        if not data or not isinstance(data, dict):
            continue
            
        if "tests" in data:  # It's a coding exercise
            title = data.get("title", filename)
            safe_title = sanitize_markdown(title)
            
            instructions = data.get("instructions", "No instructions provided.")
            if isinstance(instructions, str):
                instructions = clean_html_text(instructions)
            else:
                instructions = str(instructions)
            
            safe_instructions = sanitize_markdown(instructions)
            
            # Extract solution code
            solution_code = ""
            if "solutions" in data and isinstance(data["solutions"], list):
                if len(data["solutions"]) > 0:
                    solution = data["solutions"][0]
                    if isinstance(solution, dict) and "content" in solution:
                        solution_code = solution["content"]
            
            safe_solution = sanitize_markdown(solution_code) if solution_code else "# No solution provided"
            
            nb.cells.append(new_markdown_cell(
                f"### {safe_title}\n\n**Instructions:**\n{safe_instructions}"
            ))
            nb.cells.append(new_code_cell("# Write your code here\n"))
            nb.cells.append(new_markdown_cell(
                f"<details><summary>Click to reveal solution</summary>\n\n"
                f"```python\n{safe_solution}\n```\n\n</details>"
            ))
    
    # Save Notebook
    try:
        output_dir = Path(output_path).parent
        output_dir.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, "w", encoding='utf-8') as f:
            nbformat.write(nb, f)
        
        logger.info(f"Notebook created at: {output_path}")
    except IOError as e:
        logger.error(f"Failed to write notebook to {output_path}: {e}", exc_info=True)
        raise


def main() -> None:
    """Main function to generate Day 1 practice notebook."""
    try:
        content = load_extracted_content(EXTRACTED_CONTENT_FILE)
    except FileNotFoundError as e:
        logger.error(str(e))
        return
    
    output_path = os.path.join(OUTPUT_DIR, "Day_1_Practice.ipynb")
    
    try:
        generate_notebook(content, output_path)
    except Exception as e:
        logger.error(f"Failed to generate notebook: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    main()
