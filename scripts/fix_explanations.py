"""
Batch fix script to add explanations to all coding questions missing them.
Generates explanations based on solution_code and question text.
"""
import json
from pathlib import Path

# Mapping of common patterns to explanations
def generate_explanation(question):
    """Generate an explanation based on solution code and question content."""
    solution = question.get('solution_code', '')
    text = question.get('text', '')
    topic = question.get('topic_tag', '')
    
    # Default explanation based on solution patterns
    explanation = ""
    
    # Pattern matching for common solution types
    if 'for' in solution and 'range' in solution and 'len' in solution:
        explanation = "Loop through each index using range(len(...)). Access elements by index to work with positions or make updates."
    elif 'for' in solution and 'append' in solution:
        explanation = "Loop through the collection and use append() to build the result list item by item."
    elif 'while' in solution and '-=' in solution:
        explanation = "Use a while loop with a counter that decrements. The loop runs until the counter reaches the exit condition."
    elif 'while' in solution and '+=' in solution:
        explanation = "Use a while loop with an accumulator. Keep adding/incrementing until the condition is no longer met."
    elif 'return' in solution and '==' in solution:
        explanation = "Compare values using == and return the boolean result directly. No if/else needed for simple comparisons."
    elif 'return' in solution and 'in' in solution and 'not' in solution:
        explanation = "Use 'not in' to check if an item is absent from a collection. Returns True if not found."
    elif 'return' in solution and ' in ' in solution:
        explanation = "Use the 'in' keyword to check membership. It returns True if the item exists in the collection."
    elif 'if' in solution and 'return' in solution:
        explanation = "Check the condition and return immediately when it's met. Return a default value if the loop completes without finding a match."
    elif '%' in solution:
        explanation = "Use modulo (%) to check divisibility or wrap around indices. Returns the remainder of division."
    elif 'split' in solution or 'join' in solution:
        explanation = "Use split() to break strings apart and join() to combine lists into strings with a separator."
    elif 'lower' in solution or 'upper' in solution:
        explanation = "Convert strings to consistent case for comparison. Use .lower() or .upper() to normalize input."
    elif 'try' in solution and 'except' in solution:
        explanation = "Use try/except to handle potential errors gracefully. Catch specific exceptions to handle different error cases."
    elif '+=' in solution and 'count' in solution.lower():
        explanation = "Use a counter variable initialized to 0. Increment it with += each time the condition is met."
    elif 'sum' in solution or 'total' in solution.lower():
        explanation = "Initialize a total variable to 0, then add each value to it. Return the accumulated sum at the end."
    elif 'max' in solution.lower() or 'highest' in solution.lower():
        explanation = "Track the maximum by comparing each value to the current max. Update when a larger value is found."
    elif 'min' in solution.lower() or 'lowest' in solution.lower():
        explanation = "Track the minimum by comparing each value to the current min. Update when a smaller value is found."
    elif 'append' in solution:
        explanation = "Build the result by appending items to a list. Initialize an empty list and add items as you process them."
    elif 'return' in solution and '[' in solution:
        explanation = "Use list indexing to access specific elements. Negative indices count from the end."
    elif 'def' in solution and 'print' in solution:
        explanation = "Define the function with def, then call print() in the body to output the result. Remember proper indentation."
    elif 'return' in solution:
        explanation = "Process the input according to the requirements and return the result. Make sure to handle edge cases."
    else:
        explanation = "Implement the logic step by step, following the problem requirements. Test with the provided examples."
    
    return explanation

def fix_file(file_path):
    """Add explanations to coding questions in a file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    fixed_count = 0
    for q in questions:
        if q.get('question_type') == 'coding' and not q.get('explanation'):
            q['explanation'] = generate_explanation(q)
            fixed_count += 1
    
    if fixed_count > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(questions, f, indent=2, ensure_ascii=False)
    
    return fixed_count

def main():
    questions_dir = Path(__file__).parent / "data" / "questions"
    total_fixed = 0
    
    for i in range(1, 51):
        file_path = questions_dir / f"day-{i}.json"
        if file_path.exists():
            fixed = fix_file(file_path)
            if fixed > 0:
                print(f"Day {i}: Fixed {fixed} questions")
                total_fixed += fixed
    
    print(f"\n✅ Total questions fixed: {total_fixed}")

if __name__ == "__main__":
    main()
