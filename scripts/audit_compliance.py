
import os
import json
from pathlib import Path
from supabase import create_client, Client

def load_env_from_file():
    """Load environment variables from frontend/.env if not already set."""
    # scripts/audit_compliance.py -> scripts/ -> root -> frontend/.env
    script_dir = Path(__file__).parent.parent
    env_path = script_dir / 'frontend' / '.env'
    
    if env_path.exists():
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, _, value = line.partition('=')
                    key = key.strip()
                    value = value.strip()
                    if key not in os.environ:
                        os.environ[key] = value

load_env_from_file()

# Initialize Supabase client
url = os.environ.get("VITE_SUPABASE_URL")
# Try service key first (more permissions), fall back to anon key
key = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    print(f"Error: Missing Supabase credentials. URL={bool(url)}, KEY={bool(key)}")
    # Fallback to hardcoded for debugging if env fails - copied from successful seed log or known values if available
    # But usually loading from file is safer.
    exit(1)

supabase: Client = create_client(url, key)


DAYS_TO_CHECK = list(range(1, 46))  # All 45 days

print(f"{'Day':<5} | {'Questions':<10} | {'MCQ':<5} | {'Coding':<6} | {'Status':<5}")
print("-" * 45)

results = {}

for day in DAYS_TO_CHECK:
    quiz_id = f"day-{day}-practice"
    try:
        response = supabase.table("questions").select("*").eq("quiz_id", quiz_id).execute()
        data = response.data
        
        total = len(data)
        mcq_count = len([q for q in data if q['question_type'] == 'mcq'])
        coding_count = len([q for q in data if q['question_type'] in ['coding', 'code-correction']])
        
        if day == 12:
            print(f"DEBUG Day 12 Types: {[q['question_type'] for q in data]}")

        passed = total >= 20 and mcq_count >= 13 and coding_count >= 5
        # Special case for Day 35-40 which might have different rules? No, standard rule is 13 MCQ.
        # Wait, Day 35-40 might not have Coding questions requirements in the story?
        # Story says: "Days 35-40: MCQ >= 13". It does NOT mention Coding >= 5 for these.
        # Story says: "Day 8: Total >= 20, MCQ >= 13, Coding >= 5".
        
        # Let's verify against strict story criteria per day group.
        if 35 <= day <= 40:
             passed = mcq_count >= 13 # Only checked MCQ constraint for these days in the story AC
        else:
             passed = total >= 20 and mcq_count >= 13 and coding_count >= 5

        status = "PASS" if passed else "FAIL"
        print(f"{day:<5} | {total:<10} | {mcq_count:<5} | {coding_count:<6} | {status:<5}")
        
        results[day] = status
        
    except Exception as e:
        print(f"{day:<5} | ERROR: {e}")

print("-" * 45)
