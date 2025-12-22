"""
Seed ALL questions from JSON files to the local SQLite database.
This enables the Challenges tab for all days with coding questions.
"""
import json
import os
import sqlite3
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
QUESTIONS_DIR = BASE_DIR / "scripts" / "data" / "questions"
DB_PATH = BASE_DIR / "backend" / "learning_tracker_rpg_v2.db"

def seed_all_questions():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Clear existing questions to avoid duplicates
    cursor.execute("DELETE FROM questions")
    print("Cleared existing questions.")
    
    total_seeded = 0
    
    # Process all day-X.json files
    # NOTE: Update the range endpoint when adding new days (e.g., range(1, 86) covers days 1-85)
    # Last updated: 2025-12-22 for Days 76-85
    for day_num in range(1, 86):
        json_file = QUESTIONS_DIR / f"day-{day_num}.json"
        
        if not json_file.exists():
            print(f"⚠️  day-{day_num}.json not found, skipping.")
            continue
        
        with open(json_file, 'r', encoding='utf-8') as f:
            questions = json.load(f)
        
        quiz_id = f"day-{day_num}-practice"
        mcq_count = 0
        coding_count = 0
        
        for i, q in enumerate(questions):
            try:
                question_type = q.get('question_type', 'mcq')
                
                # Prepare JSON fields - ensure options is never NULL
                options = json.dumps(q.get('options', []))  # Always provide at least []
                test_cases = json.dumps(q.get('test_cases', [])) if q.get('test_cases') else '[]'
                
                cursor.execute("""
                    INSERT INTO questions (
                        quiz_id, text, options, correct_index, explanation,
                        question_type, code, starter_code, test_cases, 
                        solution_code, difficulty, topic_tag
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    quiz_id,
                    q.get('text', ''),
                    options,
                    q.get('correct_index'),
                    q.get('explanation'),
                    question_type,
                    q.get('code'),
                    q.get('starter_code'),
                    test_cases,
                    q.get('solution_code'),
                    q.get('difficulty'),
                    q.get('topic_tag')
                ))
                
                if question_type == 'mcq':
                    mcq_count += 1
                elif question_type == 'coding':
                    coding_count += 1
                
                total_seeded += 1
            except Exception as e:
                print(f"ERROR in Day {day_num}, Question {i}: {e}")
                print(f"Question text: {q.get('text', '')[:50]}...")
                raise

        
        print(f"Day {day_num:2d}: MCQ={mcq_count:2d}, Coding={coding_count}")

    
    conn.commit()
    conn.close()
    
    print(f"\n🎉 Seeded {total_seeded} questions across all days!")

if __name__ == "__main__":
    seed_all_questions()
