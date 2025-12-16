import json
from pathlib import Path

path = Path(r"c:\Users\USER\Documents\Programming\100 Days of Code\scripts\data\questions\day-12.json")
try:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"Loaded {len(data)} questions.")
    
    types = [q.get('question_type', 'MISSING') for q in data]
    print(f"Types: {types}")
    
    coding = [q for q in data if q.get('question_type') == 'coding']
    print(f"Coding count: {len(coding)}")
    
    if coding:
        print("Sample coding question keys:", coding[0].keys())
        
except Exception as e:
    print(f"Error: {e}")
