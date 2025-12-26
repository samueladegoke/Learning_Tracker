#!/usr/bin/env python3
"""
Extract content from course materials to generate quiz questions.
Parses VTT transcripts, HTML exercises, and folder structure to extract
day metadata and lesson content.
"""

import os
import re
import json
from pathlib import Path
from typing import Optional

COURSE_DIR = Path("Udemy - 100 Days of Code The Complete Python Pro Bootcamp 2025-8")

def parse_vtt(vtt_path: Path) -> dict:
    """Parse WebVTT file and extract clean transcript."""
    try:
        with open(vtt_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        with open(vtt_path, 'r', encoding='latin-1') as f:
            content = f.read()
    
    # Remove timestamps and metadata
    lines = []
    for line in content.split('\n'):
        line = line.strip()
        # Skip empty lines, WEBVTT header, timestamps, and cue numbers
        if (not line or 
            line == 'WEBVTT' or 
            re.match(r'^\d+$', line) or 
            re.match(r'^\d{2}:\d{2}', line) or
            '-->' in line):
            continue
        # Remove HTML-like tags
        line = re.sub(r'<[^>]+>', '', line)
        if line:
            lines.append(line)
    
    return {
        'filename': vtt_path.stem.replace('.en_US', ''),
        'transcript': ' '.join(lines)
    }


def extract_code_from_transcript(transcript: str) -> list:
    """Extract code-related content from transcript text."""
    code_patterns = [
        r'print\s*\([^)]+\)',           # print statements
        r'\w+\s*=\s*["\'][^"\']+["\']',  # string assignments
        r'\w+\s*=\s*\d+',               # number assignments
        r'def\s+\w+\s*\([^)]*\)',       # function definitions
        r'for\s+\w+\s+in\s+',           # for loops
        r'while\s+.+:',                 # while loops
        r'if\s+.+:',                    # if statements
        r'input\s*\([^)]*\)',           # input calls
        r'len\s*\([^)]+\)',             # len calls
        r'range\s*\([^)]+\)',           # range calls
        r'\.append\s*\([^)]*\)',        # list append
        r'\[\s*:\s*\]|\[\s*\d+\s*:\s*\]', # slicing
    ]
    
    found = []
    for pattern in code_patterns:
        matches = re.findall(pattern, transcript, re.IGNORECASE)
        found.extend(matches)
    
    return list(set(found))[:10]  # Return unique, max 10


def extract_topics(text_content: list) -> list:
    """Extract key Python topics mentioned in text content."""
    topic_keywords = {
        'variables': ['variable', 'assign', 'assignment', '='],
        'print': ['print', 'output', 'display'],
        'input': ['input', 'user input', 'keyboard'],
        'strings': ['string', 'text', 'concatenat', 'f-string', 'f string'],
        'integers': ['integer', 'int', 'whole number'],
        'floats': ['float', 'decimal', 'floating point'],
        'lists': ['list', 'array', 'append', 'index'],
        'dictionaries': ['dictionary', 'dict', 'key', 'value', 'mapping'],
        'functions': ['function', 'def', 'parameter', 'argument', 'return'],
        'loops': ['loop', 'for', 'while', 'iterate', 'iteration'],
        'conditionals': ['if', 'else', 'elif', 'condition', 'boolean'],
        'classes': ['class', 'object', 'oop', 'method', 'attribute'],
        'modules': ['import', 'module', 'library', 'package'],
        'files': ['file', 'open', 'read', 'write', 'csv', 'json'],
        'errors': ['error', 'exception', 'try', 'except', 'bug', 'debug'],
    }
    
    found_topics = set()
    for item in text_content:
        # Handle both transcript dicts and simple text/content dicts
        text = item.get('transcript', item.get('content', '')).lower()
        for topic, keywords in topic_keywords.items():
            for kw in keywords:
                if kw in text:
                    found_topics.add(topic)
                    break
    
    return list(found_topics)


def extract_day_metadata(day_folder: Path) -> Optional[dict]:
    """Extract metadata from a day folder."""
    # Parse folder name: "01. Day 1 - Beginner - Working with Variables..."
    match = re.match(r'(\d+)\.\s*Day\s*(\d+)\s*-\s*(\w+)\s*-\s*(.+)', day_folder.name)
    if not match:
        return None
    
    folder_num = int(match.group(1))
    day_num = int(match.group(2))
    level = match.group(3).lower()
    title = match.group(4).strip()
    
    # Parse VTT files for content
    transcripts = []
    for vtt in sorted(day_folder.glob('*.en_US.vtt')):
        transcripts.append(parse_vtt(vtt))
    
    # Extract lesson titles from file names
    lessons = []
    for f in sorted(day_folder.iterdir()):
        if f.suffix in ['.mp4', '.vtt']:
            # Clean up filename to get lesson title
            name = f.stem.replace('.en_US', '')
            # Remove number prefix (e.g., "001. " or "1. ")
            name = re.sub(r'^\d+\.\s*', '', name)
            if name and name not in lessons:
                lessons.append(name)
    
    # Combine all transcripts for topic extraction
    all_text = ' '.join([t['transcript'] for t in transcripts])
    code_examples = extract_code_from_transcript(all_text)
    
    # NEW: Extract content from other text files (txt, html, md, pdf)
    additional_content = []
    for f in sorted(day_folder.iterdir()):
        if f.suffix in ['.txt', '.html', '.md', '.pdf']:
            try:
                content = ""
                file_type = f.suffix[1:]
                
                if f.suffix == '.pdf':
                    try:
                        import pypdf
                        reader = pypdf.PdfReader(f)
                        for page in reader.pages:
                            content += page.extract_text() + "\n"
                    except ImportError:
                        print(f"Warning: pypdf not installed. Skipping PDF content: {f.name}")
                        continue
                    except Exception as e:
                        print(f"Error reading PDF {f.name}: {e}")
                        continue
                else:
                     # Read text content
                    content = f.read_text(encoding='utf-8', errors='ignore')

                additional_content.append({
                    'filename': f.name,
                    'type': file_type,
                    'content': content
                })
            except Exception as e:
                print(f"Error reading {f.name}: {e}")

    return {
        'folder_number': folder_num,
        'day_number': day_num,
        'level': level,
        'title': title,
        'quiz_id': f'day-{day_num}-practice',
        'lessons': lessons[:15],  # Increased limit
        'topics': extract_topics(transcripts + additional_content),
        'code_examples': code_examples,
        'transcript_count': len(transcripts),
        'total_transcript_length': len(all_text),
        'additional_resources': additional_content
    }


def extract_all_days() -> dict:
    """Extract metadata for all days in the course."""
    if not COURSE_DIR.exists():
        print(f"Warning: Course directory not found: {COURSE_DIR}")
        return {}
    
    days = {}
    for folder in sorted(COURSE_DIR.iterdir()):
        if folder.is_dir():
            meta = extract_day_metadata(folder)
            if meta:
                key = f"day-{meta['day_number']}"
                days[key] = meta
                print(f"Extracted: Day {meta['day_number']} - {meta['title']}")
    
    return days


def generate_day_meta_js(days: dict) -> str:
    """Generate JavaScript DAY_META object from extracted data."""
    js_lines = ["const DAY_META = {"]
    
    for key, meta in sorted(days.items(), key=lambda x: x[1]['day_number']):
        day_num = meta['day_number']
        title = meta['title'].replace("'", "\\'")
        level = meta['level'].capitalize()
        topics = meta['topics'][:4]  # Max 4 topics
        
        js_lines.append(f"  '{key}': {{")
        js_lines.append(f"    label: 'Day {day_num}',")
        js_lines.append(f"    title: 'Day {day_num}: {title}',")
        js_lines.append(f"    subtitle: '{level} level - {', '.join(topics) if topics else 'Python fundamentals'}',")
        js_lines.append(f"    quizId: 'day-{day_num}-practice',")
        js_lines.append(f"    level: '{meta['level']}',")
        js_lines.append(f"    topics: {json.dumps(topics)},")
        js_lines.append(f"  }},")
    
    js_lines.append("}")
    return '\n'.join(js_lines)


if __name__ == '__main__':
    print("Extracting course content...")
    print(f"Looking in: {COURSE_DIR.absolute()}")
    
    days = extract_all_days()
    
    if days:
        # Save JSON metadata
        output_path = Path('data/day_metadata.json')
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(days, f, indent=2)
        
        print(f"\nExtracted metadata for {len(days)} days")
        print(f"Saved to: {output_path}")
        
        # Generate JavaScript DAY_META
        js_meta = generate_day_meta_js(days)
        js_path = Path('data/day_meta.js')
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_meta)
        print(f"JavaScript DAY_META saved to: {js_path}")
    else:
        print("\nNo days extracted. Make sure the course folder exists.")
        print("Expected folder: Udemy - 100 Days of Code The Complete Python Pro Bootcamp 2025-8/")





