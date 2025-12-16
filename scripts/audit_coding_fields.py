"""
Audit script to check which coding questions are missing required fields.
Required fields: starter_code, solution_code, test_cases
"""
import json
import os
from pathlib import Path

questions_dir = Path(r"c:\Users\USER\Documents\Programming\100 Days of Code\scripts\data\questions")

# Track issues
issues = []

for day_num in range(17, 46):  # Days 17-45
    filepath = questions_dir / f"day-{day_num}.json"
    if not filepath.exists():
        print(f"Day {day_num}: File not found")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Day {day_num}: JSON Error - {e}")
            continue
    
    # Find coding questions
    coding_questions = [q for q in data if q.get('question_type') == 'coding']
    
    if not coding_questions:
        print(f"Day {day_num}: No coding questions")
        continue
    
    day_issues = []
    for i, q in enumerate(coding_questions):
        missing = []
        if not q.get('starter_code'):
            missing.append('starter_code')
        if not q.get('solution_code'):
            missing.append('solution_code')
        if not q.get('test_cases'):
            missing.append('test_cases')
        
        if missing:
            day_issues.append({
                'index': i,
                'text': q.get('text', 'Unknown')[:50],
                'missing': missing
            })
    
    if day_issues:
        issues.append({
            'day': day_num,
            'total_coding': len(coding_questions),
            'issues': day_issues
        })
        print(f"Day {day_num}: {len(day_issues)}/{len(coding_questions)} coding questions have missing fields")
    else:
        print(f"Day {day_num}: ✓ All {len(coding_questions)} coding questions complete")

print("\n" + "="*50)
print("SUMMARY")
print("="*50)

if issues:
    total_issues = sum(len(d['issues']) for d in issues)
    print(f"Total questions needing fixes: {total_issues}")
    print("\nDetailed issues:")
    for d in issues:
        print(f"\nDay {d['day']}:")
        for issue in d['issues']:
            print(f"  - Q{issue['index']}: {issue['text'][:40]}... Missing: {issue['missing']}")
else:
    print("All coding questions have required fields!")
