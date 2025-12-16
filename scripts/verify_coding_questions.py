"""Verify coding questions in Days 13-15"""
import json
from pathlib import Path

questions_dir = Path("scripts/data/questions")

for day in [13, 14, 15]:
    filepath = questions_dir / f"day-{day}.json"
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    coding = [q for q in data if q.get('question_type') == 'coding']
    print(f"Day {day}: {len(coding)} coding questions")
    
    # Show first coding question if exists
    if coding:
        print(f"  Sample: {coding[0].get('text', 'No text')[:50]}...")
    else:
        print("  WARNING: No coding questions found!")
