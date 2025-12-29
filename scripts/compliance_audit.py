"""
Full Content Compliance Audit for Days 1-85.
Queries the local SQLite database directly.
"""
import json
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
DB_PATH = BASE_DIR / "backend" / "learning_tracker_rpg_v2.db"

# Compliance thresholds
STANDARD_RULES = {"total": 20, "mcq": 10, "coding": 5, "code_corr": 3}
PORTFOLIO_RULES = {"total": 12, "mcq": 6, "coding": 4, "code_corr": 0}


def audit_all_days():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    results = []
    passing = 0
    failing = 0
    no_data = 0

    for day_num in range(1, 101):
        quiz_id = f"day-{day_num}-practice"
        is_portfolio = day_num >= 82
        rules = PORTFOLIO_RULES if is_portfolio else STANDARD_RULES

        cursor.execute("""
            SELECT question_type, difficulty, topic_tag
            FROM questions
            WHERE quiz_id = ?
        """, (quiz_id,))
        rows = cursor.fetchall()

        if not rows:
            results.append({"day": day_num, "status": "NO_DATA"})
            no_data += 1
            continue

        total = len(rows)
        mcq = sum(1 for r in rows if r[0] == "mcq")
        coding = sum(1 for r in rows if r[0] == "coding")
        code_corr = sum(1 for r in rows if r[0] == "code-correction")
        missing_tag = sum(1 for r in rows if not r[2])
        missing_diff = sum(1 for r in rows if not r[1])

        issues = []
        if total < rules["total"]:
            issues.append(f"Total < {rules['total']} ({total})")
        if mcq < rules["mcq"]:
            issues.append(f"MCQ < {rules['mcq']} ({mcq})")
        if coding < rules["coding"]:
            issues.append(f"Coding < {rules['coding']} ({coding})")
        if not is_portfolio and code_corr < rules["code_corr"]:
            issues.append(f"CodeCorr < {rules['code_corr']} ({code_corr})")
        if missing_tag > 0:
            issues.append(f"Missing topic_tag: {missing_tag}")
        if missing_diff > 0:
            issues.append(f"Missing difficulty: {missing_diff}")

        status = "PASS" if not issues else "FAIL"
        if status == "PASS":
            passing += 1
        else:
            failing += 1

        results.append({
            "day": day_num,
            "total": total,
            "mcq": mcq,
            "coding": coding,
            "code_corr": code_corr,
            "status": status,
            "issues": issues
        })

    conn.close()

    # Print summary
    print("\n" + "=" * 60)
    print("CONTENT COMPLIANCE AUDIT REPORT")
    print("=" * 60)
    print(f"Days Audited: 100")
    print(f"✅ Passing: {passing}")
    print(f"❌ Failing: {failing}")
    print(f"⚠️  No Data: {no_data}")
    print("=" * 60)

    if failing > 0:
        print("\n--- FAILING DAYS ---")
        for r in results:
            if r.get("status") == "FAIL":
                print(f"Day {r['day']:2d}: {', '.join(r['issues'])}")

    if no_data > 0:
        print("\n--- NO DATA DAYS ---")
        no_data_days = [r["day"] for r in results if r.get("status") == "NO_DATA"]
        print(f"Days: {no_data_days}")

    print("\n--- PASSING DAYS (Sample) ---")
    for r in results[:5]:
        if r.get("status") == "PASS":
            print(f"Day {r['day']:2d}: Total={r['total']}, MCQ={r['mcq']}, Coding={r['coding']}")


if __name__ == "__main__":
    audit_all_days()
