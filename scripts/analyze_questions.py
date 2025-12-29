"""Quick script to analyze Days 82-85 question counts."""
import json
from pathlib import Path

questions_dir = Path("scripts/data/questions")

for day in [82, 83, 84, 85]:
    filepath = questions_dir / f"day-{day}.json"
    if filepath.exists():
        with open(filepath, 'r') as f:
            questions = json.load(f)
        
        mcq = sum(1 for q in questions if q.get("question_type") == "mcq")
        coding = sum(1 for q in questions if q.get("question_type") == "coding")
        code_correction = sum(1 for q in questions if q.get("question_type") == "code-correction")
        total = len(questions)
        
        print(f"Day {day}: {total} total | MCQ: {mcq} | Coding: {coding} | Code-correction: {code_correction}")
    else:
        print(f"Day {day}: NO FILE")
