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


def load_env_from_file():
    """Load environment variables from frontend/.env if not already set."""
    script_dir = Path(__file__).parent.parent  # Go up from scripts/ to project root
    env_path = script_dir / 'frontend' / '.env'
    
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, _, value = line.partition('=')
                    key = key.strip()
                    value = value.strip()
                    # Only set if not already in environment
                    if key not in os.environ:
                        os.environ[key] = value


# Attempt to load from frontend/.env
load_env_from_file()

# Supabase credentials - loaded from environment or frontend/.env
SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL", "https://lhdpiawslfpngmehafdo.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_KEY:
    print("ERROR: SUPABASE_SERVICE_KEY not found.")
    print("Ensure frontend/.env contains SUPABASE_SERVICE_KEY=your-key")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def seed_questions(quiz_id: str, questions: list) -> dict:
    """Seed questions for a specific quiz."""
    records = []
    
    for q in questions:
        # Ensure options is never null - use empty array for coding questions
        options = q.get('options') or []
        
        record = {
            'quiz_id': quiz_id,
            'question_type': q.get('question_type', 'mcq'),
            'text': q.get('text') or q.get('question_text'),
            'code': q.get('code'),  # For code-correction questions
            'options': json.dumps(options),
            'correct_index': q.get('correct_index', 0),
            'starter_code': q.get('starter_code'),
            'test_cases': json.dumps(q.get('test_cases')) if q.get('test_cases') else None,
            'explanation': q.get('explanation'),
            'difficulty': q.get('difficulty', 'medium'),
            'topic_tag': q.get('topic_tag') or q.get('topic')
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



def validate_question_schema(question: dict, index: int, filename: str):
    """Validate that a question has minimum required fields."""
    required_base = ['text', 'difficulty', 'topic_tag']
    
    # Check base fields
    has_text = 'text' in question or 'question_text' in question
    if not has_text:
        raise ValueError(f"Missing required field 'text' or 'question_text' in {filename} at index {index}")
    
    if 'difficulty' not in question:
        raise ValueError(f"Missing required field 'difficulty' in {filename} at index {index}")
    
    has_topic = 'topic_tag' in question or 'topic' in question
    if not has_topic:
        raise ValueError(f"Missing required field 'topic_tag' or 'topic' in {filename} at index {index}")
            
    # Check type-specific fields
    q_type = question.get('question_type', 'mcq')
    if q_type == 'mcq':
        if 'options' not in question or 'correct_index' not in question:
            raise ValueError(f"MCQ question missing 'options' or 'correct_index' in {filename} at index {index}")
        # Warn about missing explanation (not a hard error, but logged)
        if 'explanation' not in question:
            print(f"  ⚠️ Warning: MCQ question missing 'explanation' in {filename} at index {index}")
    elif q_type == 'code-correction':
        if 'code' not in question:
            raise ValueError(f"Code-correction question missing 'code' in {filename} at index {index}")
        if 'options' not in question or 'correct_index' not in question:
            raise ValueError(f"Code-correction question missing 'options' or 'correct_index' in {filename} at index {index}")
    elif q_type == 'coding':
        if 'solution_code' not in question:
            raise ValueError(f"Coding question missing 'solution_code' in {filename} at index {index}")
        # Validate test_cases is present and non-empty
        if 'test_cases' not in question or not question['test_cases']:
            raise ValueError(f"Coding question missing 'test_cases' in {filename} at index {index}")
        if 'starter_code' not in question:
            print(f"  ⚠️ Warning: Coding question missing 'starter_code' in {filename} at index {index}")


def load_questions_from_json(filepath: str) -> list:
    """Load and validate questions from a JSON file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        questions = json.load(f)
        
    for i, q in enumerate(questions):
        validate_question_schema(q, i, Path(filepath).name)
        
    return questions


def seed_all_from_directory(questions_dir: str = None):
    """Seed all questions from JSON files in a directory."""
    # Default to 'data/questions' relative to this script
    if questions_dir is None:
        script_dir = Path(__file__).parent
        questions_dir = script_dir / 'data' / 'questions'
        
    dir_path = Path(questions_dir)
    
    if not dir_path.exists():
        print(f"Questions directory not found: {dir_path}")
        return
    
    print(f"Scanning for questions in: {dir_path.absolute()}")
    for json_file in sorted(dir_path.glob('day-*.json')):
        # Extract day number from filename

        # Expected format: day-1.json, day-2.json
        match = json_file.stem  # e.g., "day-1"
        quiz_id = f"{match}-practice"
        
        print(f"Found {json_file.name}, seeding {quiz_id}...")
        try:
            questions = load_questions_from_json(str(json_file))
            
            # Clear existing and seed new
            clear_quiz_questions(quiz_id)
            seed_questions(quiz_id, questions)
        except ValueError as e:
            print(f"Skipping {json_file.name}: Validation Error - {e}")
        except Exception as e:
            print(f"Skipping {json_file.name}: Error - {e}")


if __name__ == '__main__':
    import argparse
    import sys
    
    parser = argparse.ArgumentParser(description='Seed quiz questions to Supabase')
    parser.add_argument('--force', action='store_true', help='Force execution (required for safety)')
    parser.add_argument('--dir', type=str, help='Directory containing JSON question files (default: relative to script)')
    
    args = parser.parse_args()
    
    if not args.force:
        print("\nWARNING: This script will WIPE existing questions for the updated days.")
        print("To proceed, you must use the --force flag:")
        print("  python scripts/seed_supabase_questions.py --force")
        sys.exit(1)

    print("Seeding questions to Supabase...")
    seed_all_from_directory(args.dir)
    
    print("\nDone! All questions seeded from JSON.")
