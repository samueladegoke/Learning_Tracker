import json
import os
import sys

# Mock environment variables to satisfy seed_supabase_questions import
os.environ['SUPABASE_SERVICE_KEY'] = 'mock_key'
os.environ['SUPABASE_URL'] = 'https://mock.supabase.co'

# Import the module
try:
    import seed_supabase_questions as seed
except Exception as e:
    print(f"Error importing seed script: {e}")
    sys.exit(1)

OUTPUT_DIR = "scripts/data/questions"
os.makedirs(OUTPUT_DIR, exist_ok=True)

days = {
    "day-1": getattr(seed, 'DAY1_QUESTIONS', []),
    "day-2": getattr(seed, 'DAY2_QUESTIONS', []),
    "day-3": getattr(seed, 'DAY3_QUESTIONS', []),
    "day-4": getattr(seed, 'DAY4_QUESTIONS', []),
    "day-5": getattr(seed, 'DAY5_QUESTIONS', []),
    "day-6": getattr(seed, 'DAY6_QUESTIONS', []),
    "day-7": getattr(seed, 'DAY7_QUESTIONS', [])
}

for day_key, questions in days.items():
    if not questions:
        print(f"Warning: No questions found for {day_key}")
        continue
        
    filename = f"{day_key}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2)
    
    print(f"Exported {len(questions)} questions to {filepath}")
