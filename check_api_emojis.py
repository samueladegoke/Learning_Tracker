import requests
import sys

URL = "http://127.0.0.1:8000/api/weeks"
try:
    print(f"Fetching {URL}...")
    r = requests.get(URL, timeout=5)
    r.raise_for_status()
    data = r.text
    
    emojis = ['📜', '💰', '🛒', '⚡', '🐉', '📅']
    found = []
    for e in emojis:
        if e in data:
            found.append(e)
            
    if found:
        print(f"FAIL: Found emojis in API response: {found}")
    else:
        print("PASS: No prohibited emojis found in /api/weeks")
        
    # Check tasks too
    URL_TASKS = "http://127.0.0.1:8000/api/tasks"
    r = requests.get(URL_TASKS, timeout=5)
    data = r.text
    found_tasks = []
    for e in emojis:
        if e in data:
            found_tasks.append(e)
            
    if found_tasks:
        print(f"FAIL: Found emojis in /api/tasks: {found_tasks}")
    else:
        print("PASS: No prohibited emojis found in /api/tasks")

except Exception as e:
    print(f"Error checking API: {e}")
    sys.exit(1)
