#!/usr/bin/env python3
"""
Export Supabase Data to JSON for Convex Migration
==================================================

Usage:
  python scripts/export_supabase.py

Environment Variables Required:
  - SUPABASE_URL (from frontend/.env VITE_SUPABASE_URL)
  - SUPABASE_SERVICE_KEY (from frontend/.env SUPABASE_SERVICE_KEY)

Output:
  - data/migration/*.json - One file per table
  - data/migration/counts.txt - Row count verification
"""

import os
import sys
import json
from datetime import datetime
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from supabase import create_client, Client
except ImportError:
    print("ERROR: supabase-py not installed. Run: pip install supabase")
    sys.exit(1)

# Load environment variables from frontend/.env
def load_env():
    env_path = Path(__file__).parent.parent / "frontend" / ".env"
    if env_path.exists():
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    os.environ.setdefault(key, value)

load_env()

# Configuration
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", os.getenv("SUPABASE_URL"))
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials")
    print(f"  SUPABASE_URL: {'set' if SUPABASE_URL else 'MISSING'}")
    print(f"  SUPABASE_SERVICE_KEY: {'set' if SUPABASE_KEY else 'MISSING'}")
    sys.exit(1)

# Tables to export (in dependency order)
TABLES = [
    "courses",
    "weeks", 
    "tasks",
    "users",
    "user_task_statuses",
    "badges",
    "achievements",
    "user_badges",
    "user_achievements",
    "quests",
    "quest_tasks",
    "user_quests",
    "challenges",
    "user_challenges",
    "user_inventory",
    "questions",
    "quiz_results",
    "user_question_reviews",
    "user_artifacts",
    "reflections",
]

def export_table(supabase: Client, table_name: str, output_dir: Path) -> int:
    """Export a single table to JSON. Returns row count."""
    try:
        # Fetch all rows (Supabase paginates at 1000 by default)
        all_rows = []
        offset = 0
        batch_size = 1000
        
        while True:
            response = supabase.table(table_name).select("*").range(offset, offset + batch_size - 1).execute()
            rows = response.data
            all_rows.extend(rows)
            
            if len(rows) < batch_size:
                break
            offset += batch_size
        
        # Write to JSON
        output_file = output_dir / f"{table_name}.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(all_rows, f, indent=2, default=str)
        
        print(f"  ✓ {table_name}: {len(all_rows)} rows → {output_file.name}")
        return len(all_rows)
        
    except Exception as e:
        print(f"  ✗ {table_name}: ERROR - {e}")
        # Write empty file to indicate table was attempted
        output_file = output_dir / f"{table_name}.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump([], f)
        return 0

def main():
    print("=" * 60)
    print("Supabase Data Export for Convex Migration")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print(f"Supabase URL: {SUPABASE_URL[:50]}...")
    print()
    
    # Create output directory
    output_dir = Path(__file__).parent.parent / "data" / "migration"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Initialize Supabase client
    print("Connecting to Supabase...")
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("  ✓ Connected")
    except Exception as e:
        print(f"  ✗ Connection failed: {e}")
        sys.exit(1)
    
    print()
    print("Exporting tables...")
    
    # Export each table
    counts = {}
    for table in TABLES:
        count = export_table(supabase, table, output_dir)
        counts[table] = count
    
    # Write counts summary
    counts_file = output_dir / "counts.txt"
    with open(counts_file, "w") as f:
        f.write(f"Supabase Export Summary\n")
        f.write(f"======================\n")
        f.write(f"Timestamp: {datetime.now().isoformat()}\n\n")
        f.write(f"Table Counts:\n")
        total = 0
        for table, count in counts.items():
            f.write(f"  {table}: {count}\n")
            total += count
        f.write(f"\nTotal rows: {total}\n")
    
    print()
    print("=" * 60)
    print("Export Complete!")
    print(f"  Output directory: {output_dir}")
    print(f"  Total tables: {len(TABLES)}")
    print(f"  Total rows: {sum(counts.values())}")
    print(f"  Counts file: {counts_file}")
    print("=" * 60)

if __name__ == "__main__":
    main()
