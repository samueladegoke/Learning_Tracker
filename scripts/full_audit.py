import json
from pathlib import Path

path = Path('scripts/data/questions')
COMPLIANCE_RULES = {
    'min_questions': 20,
    'min_mcq': 13,
    'min_coding': 5,
}

results = []
for f in sorted(path.glob('day-*.json'), key=lambda x: int(x.stem.split('-')[1])):
    day_num = int(f.stem.split('-')[1])
    with open(f, 'r', encoding='utf-8') as file:
        data = json.load(file)
    total = len(data)
    mcq = len([q for q in data if q.get('question_type') == 'mcq'])
    coding = len([q for q in data if q.get('question_type') == 'coding'])
    
    # Required fields check
    issues = {
        'missing_explanation': 0,
        'missing_options': 0,
        'missing_starter_code': 0,
        'missing_solution_code': 0,
        'missing_test_cases': 0,
    }
    for i, q in enumerate(data):
        qtype = q.get('question_type', 'mcq')
        if qtype == 'mcq':
            if not q.get('options'): issues['missing_options'] += 1
            if not q.get('explanation'): issues['missing_explanation'] += 1
        elif qtype == 'coding':
            if not q.get('starter_code'): issues['missing_starter_code'] += 1
            if not q.get('solution_code'): issues['missing_solution_code'] += 1
            if not q.get('test_cases'): issues['missing_test_cases'] += 1
        elif qtype == 'code-correction':
            # Code-correction is MCQ-like: needs options but not coding fields
            if not q.get('options'): issues['missing_options'] += 1
            if not q.get('explanation'): issues['missing_explanation'] += 1
    
    # Count check
    count_ok = total >= COMPLIANCE_RULES['min_questions'] and mcq >= COMPLIANCE_RULES['min_mcq']
    if day_num <= 20: 
        count_ok = count_ok and coding >= COMPLIANCE_RULES['min_coding']
    
    # Field check (allow missing explanation as LOW issue, not FAIL)
    field_issues = issues['missing_options'] + issues['missing_starter_code'] + issues['missing_solution_code'] + issues['missing_test_cases']
    status = 'PASS' if count_ok and field_issues == 0 else 'FAIL'
    
    results.append({
        'day': day_num,
        'total': total,
        'mcq': mcq,
        'coding': coding,
        'status': status,
        'count_ok': count_ok,
        'issues': issues,
    })

# Print detailed report
print('=' * 100)
print('ADVERSARIAL CONTENT COMPLIANCE AUDIT - DETAILED REPORT')
print('=' * 100)

# Summary table
print(f"{'Day':<5} | {'Total':<6} | {'MCQ':<5} | {'Coding':<7} | {'Count':<6} | {'Fields':<10} | Status")
print('-' * 100)

pass_count = 0
fail_count = 0
for r in results:
    count_status = 'OK' if r['count_ok'] else 'LOW'
    field_problems = []
    if r['issues']['missing_options'] > 0: field_problems.append(f"opts:{r['issues']['missing_options']}")
    if r['issues']['missing_starter_code'] > 0: field_problems.append(f"start:{r['issues']['missing_starter_code']}")
    if r['issues']['missing_solution_code'] > 0: field_problems.append(f"sol:{r['issues']['missing_solution_code']}")
    if r['issues']['missing_test_cases'] > 0: field_problems.append(f"tests:{r['issues']['missing_test_cases']}")
    
    field_str = ', '.join(field_problems) if field_problems else 'OK'
    
    print(f"{r['day']:<5} | {r['total']:<6} | {r['mcq']:<5} | {r['coding']:<7} | {count_status:<6} | {field_str:<10} | {r['status']}")
    if r['status'] == 'PASS':
        pass_count += 1
    else:
        fail_count += 1

print('-' * 100)
print(f"SUMMARY: {pass_count} PASS, {fail_count} FAIL out of {len(results)} days")

# Breakdown of failures
print('\n' + '=' * 100)
print('FAILURE BREAKDOWN:')
low_count_days = [r['day'] for r in results if not r['count_ok']]
missing_opts = [r['day'] for r in results if r['issues']['missing_options'] > 0]
missing_starter = [r['day'] for r in results if r['issues']['missing_starter_code'] > 0]
missing_solution = [r['day'] for r in results if r['issues']['missing_solution_code'] > 0]
missing_tests = [r['day'] for r in results if r['issues']['missing_test_cases'] > 0]
missing_exp = [r['day'] for r in results if r['issues']['missing_explanation'] > 0]

print(f"  Low question counts (total/mcq/coding): {low_count_days}")
print(f"  Missing options: {missing_opts}")
print(f"  Missing starter_code: {missing_starter}")
print(f"  Missing solution_code: {missing_solution}")
print(f"  Missing test_cases: {missing_tests}")
print(f"  Missing explanation (LOW priority): {missing_exp}")
print('=' * 100)

# Write to file
with open('audit_results.txt', 'w') as f:
    f.write('=' * 100 + '\\n')
    f.write('ADVERSARIAL CONTENT COMPLIANCE AUDIT - DETAILED REPORT\\n')
    f.write('=' * 100 + '\\n\\n')
    
    f.write(f"{'Day':<5} | {'Total':<6} | {'MCQ':<5} | {'Coding':<7} | {'Count':<6} | {'Fields':<20} | Status\\n")
    f.write('-' * 100 + '\\n')
    
    for r in results:
        count_status = 'OK' if r['count_ok'] else 'LOW'
        field_problems = []
        if r['issues']['missing_options'] > 0: field_problems.append(f"opts:{r['issues']['missing_options']}")
        if r['issues']['missing_starter_code'] > 0: field_problems.append(f"start:{r['issues']['missing_starter_code']}")
        if r['issues']['missing_solution_code'] > 0: field_problems.append(f"sol:{r['issues']['missing_solution_code']}")
        if r['issues']['missing_test_cases'] > 0: field_problems.append(f"tests:{r['issues']['missing_test_cases']}")
        
        field_str = ', '.join(field_problems) if field_problems else 'OK'
        f.write(f"{r['day']:<5} | {r['total']:<6} | {r['mcq']:<5} | {r['coding']:<7} | {count_status:<6} | {field_str:<20} | {r['status']}\\n")
    
    f.write('-' * 100 + '\\n')
    f.write(f"SUMMARY: {pass_count} PASS, {fail_count} FAIL out of {len(results)} days\\n\\n")
    
    f.write('FAILURE BREAKDOWN:\\n')
    f.write(f"  Low question counts: {low_count_days}\\n")
    f.write(f"  Missing options: {missing_opts}\\n")
    f.write(f"  Missing starter_code: {missing_starter}\\n")
    f.write(f"  Missing solution_code: {missing_solution}\\n")
    f.write(f"  Missing test_cases: {missing_tests}\\n")
    f.write(f"  Missing explanation (LOW): {missing_exp}\\n")

print('Results written to audit_results.txt')
