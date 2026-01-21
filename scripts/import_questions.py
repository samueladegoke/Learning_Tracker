"""
Fast questions import using Node.js convex client
"""
import json
import subprocess
import sys

# Read questions
with open('data/migration/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Total questions: {len(questions)}")

# Transform questions to match schema
def transform(q):
    return {
        "quiz_id": q.get("quiz_id", ""),
        "question_type": q.get("question_type", "mcq"),
        "text": q.get("text", ""),
        "code": q.get("code"),
        "options": q.get("options"),
        "correct_index": q.get("correct_index", 0),
        "starter_code": q.get("starter_code"),
        "test_cases": q.get("test_cases"),
        "solution_code": q.get("solution_code"),
        "explanation": q.get("explanation"),
        "difficulty": q.get("difficulty", "medium"),
        "topic_tag": q.get("topic_tag")
    }

# Write batches to temp files and import
BATCH_SIZE = 5  # Small batches to avoid command limits
imported = 0
errors = 0

for i in range(0, len(questions), BATCH_SIZE):
    batch = questions[i:i+BATCH_SIZE]
    batch_data = [transform(q) for q in batch]
    
    # Write to temp file
    temp_file = f'_temp_batch_{i}.json'
    with open(temp_file, 'w', encoding='utf-8') as f:
        json.dump({"table": "questions", "rows": batch_data}, f)
    
    # Import using PowerShell
    ps_cmd = f'npx convex run importData:insertRows (Get-Content -Raw "{temp_file}")'
    result = subprocess.run(
        ['powershell', '-Command', ps_cmd],
        capture_output=True,
        text=True,
        timeout=60
    )
    
    # Cleanup
    import os
    try:
        os.remove(temp_file)
    except:
        pass
    
    if result.returncode == 0:
        imported += len(batch)
        if imported % 50 == 0 or imported == len(questions):
            print(f"Progress: {imported}/{len(questions)} ({100*imported//len(questions)}%)")
    else:
        errors += 1
        print(f"Error at batch {i//BATCH_SIZE}: {result.stderr[:60] if result.stderr else 'unknown'}")
        if errors > 5:
            print("Too many errors, stopping")
            break

print(f"\nImported {imported} questions, {errors} errors")
