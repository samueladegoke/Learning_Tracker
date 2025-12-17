"""
Adversarial Content Compliance Audit
Analyzes all question files for compliance with content requirements.
"""
import json
from pathlib import Path

def audit_questions():
    questions_dir = Path(__file__).parent / "data" / "questions"
    results = []

    for i in range(1, 51):
        file_path = questions_dir / f"day-{i}.json"
        if not file_path.exists():
            results.append({
                'day': i, 'exists': False, 'total': 0, 
                'mcq': 0, 'coding': 0, 'issues': ['FILE NOT FOUND']
            })
            continue
        
        with open(file_path, 'r', encoding='utf-8') as f:
            questions = json.load(f)
        
        mcq_count = sum(1 for q in questions if q.get('question_type') == 'mcq')
        coding_count = sum(1 for q in questions if q.get('question_type') == 'coding')
        total = len(questions)
        
        issues = []
        
        # Compliance checks
        if total < 20:
            issues.append(f'BELOW MINIMUM: {total} questions (need 20+)')
        if mcq_count < 13:
            issues.append(f'MCQ LOW: {mcq_count} (need 13-15+)')
        if coding_count < 5:
            issues.append(f'CODING LOW: {coding_count} (need 5-7+)')
        
        # Required fields check
        for idx, q in enumerate(questions):
            missing = []
            if not q.get('explanation'):
                missing.append('explanation')
            if not q.get('difficulty'):
                missing.append('difficulty')
            if not q.get('topic_tag'):
                missing.append('topic_tag')
            if q.get('question_type') == 'coding':
                if not q.get('test_cases'):
                    missing.append('test_cases')
                if not q.get('solution_code'):
                    missing.append('solution_code')
                if not q.get('starter_code'):
                    missing.append('starter_code')
            if missing:
                issues.append(f'Q{idx+1}: missing {missing}')
        
        results.append({
            'day': i,
            'exists': True,
            'total': total,
            'mcq': mcq_count,
            'coding': coding_count,
            'issues': issues
        })

    # Print summary
    print('=' * 80)
    print('ADVERSARIAL CONTENT COMPLIANCE AUDIT - 50 Day Question Files')
    print('=' * 80)
    print()

    compliant = 0
    non_compliant = 0
    critical_issues = []
    medium_issues = []

    for r in results:
        status = '✅' if not r['issues'] else '❌'
        if not r['issues']:
            compliant += 1
        else:
            non_compliant += 1
            for issue in r['issues']:
                if 'BELOW MINIMUM' in issue or 'FILE NOT FOUND' in issue:
                    critical_issues.append(f"Day {r['day']}: {issue}")
                else:
                    medium_issues.append(f"Day {r['day']}: {issue}")
        
        print(f"{status} Day {r['day']:2d}: Total={r['total']:2d}, MCQ={r['mcq']:2d}, Coding={r['coding']:2d} | Issues: {len(r['issues'])}")

    print()
    print('=' * 80)
    print(f"SUMMARY: {compliant}/50 Compliant, {non_compliant}/50 Non-Compliant")
    print('=' * 80)
    print()
    print(f"🔴 CRITICAL ISSUES ({len(critical_issues)}):")
    for issue in critical_issues:
        print(f"   - {issue}")
    print()
    print(f"🟡 MEDIUM ISSUES ({len(medium_issues)}):")
    for issue in medium_issues[:50]:
        print(f"   - {issue}")
    if len(medium_issues) > 50:
        print(f"   ... and {len(medium_issues) - 50} more")
    
    return results

if __name__ == "__main__":
    audit_questions()
