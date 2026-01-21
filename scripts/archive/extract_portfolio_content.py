"""Portfolio Project Content Extractor

Parses HTML assignment files from Days 82-100 that contain embedded 
JSON with project descriptions, instructions, and reflection prompts.

Usage:
    python scripts/extract_portfolio_content.py --day 82
"""

import argparse
import json
import re
from pathlib import Path


def extract_class_info(html_content: str) -> dict:
    """Extract classInfo JSON from HTML script tag."""
    match = re.search(r'classInfo\s*=\s*({.*?});', html_content, re.DOTALL)
    if not match:
        raise ValueError("Could not find classInfo in HTML")
    
    # Parse the JSON
    return json.loads(match.group(1))


def parse_category_from_folder(folder_name: str) -> str:
    """Extract project category from folder name.
    
    Example: '82. Day 82 - Professional Portfolio Project - Python Scripting'
    Returns: 'Python Scripting'
    """
    parts = folder_name.split(' - ')
    if len(parts) >= 3:
        return parts[-1].strip()
    return "Portfolio Project"


def clean_html(html_text: str) -> str:
    """Strip HTML tags and clean text."""
    # Remove HTML tags
    clean = re.sub(r'<[^>]+>', '', html_text)
    # Unescape common HTML entities
    clean = clean.replace('\\n', '\n')
    clean = clean.replace('\\"', '"')
    clean = clean.replace('&amp;', '&')
    clean = clean.replace('&lt;', '<')
    clean = clean.replace('&gt;', '>')
    return clean.strip()


def extract_instructions(class_info: dict) -> str:
    """Extract instruction text from classInfo."""
    instructions = class_info.get("instruction_res", {}).get("results", [])
    text_instructions = [
        item.get("body", "") 
        for item in instructions 
        if item.get("display_type") == "text"
    ]
    return clean_html(" ".join(text_instructions))


def extract_reflections(class_info: dict) -> list:
    """Extract reflection prompts from instructor examples."""
    examples = class_info.get("instructor_example_res", {}).get("results", [])
    reflections = []
    for example in examples:
        body = clean_html(example.get("body", ""))
        answer = clean_html(example.get("answer", ""))
        if body:
            reflections.append({"prompt": body, "guidance": answer})
    return reflections


def extract_portfolio_metadata(day_folder: Path) -> dict:
    """Extract metadata from portfolio assignment HTML files."""
    html_files = list(day_folder.glob("*.html"))
    
    if not html_files:
        raise FileNotFoundError(f"No HTML files in {day_folder}")
    
    # Find assignment file (exclude solution/other files)
    assignment_file = None
    for f in html_files:
        if "Assignment" in f.name:
            assignment_file = f
            break
    
    if not assignment_file:
        assignment_file = html_files[0]
    
    with open(assignment_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    class_info = extract_class_info(html_content)
    first_res = class_info.get("first_res", {})
    
    # Extract project name from assignment file name
    project_name_match = re.search(r'Assignment[- ]+(.+)\.html', assignment_file.name)
    project_name = project_name_match.group(1) if project_name_match else first_res.get("description", "Portfolio Project")
    
    return {
        "project_name": project_name,
        "project_category": parse_category_from_folder(day_folder.name),
        "brief": first_res.get("description", ""),
        "instructions": extract_instructions(class_info),
        "duration_minutes": first_res.get("estimated_duration", 60),
        "reflection_prompts": extract_reflections(class_info),
        "num_submissions": first_res.get("num_submissions", 0),
        "source_file": str(assignment_file.name),
    }


def find_day_folder(udemy_path: Path, day_num: int) -> Path:
    """Find the folder for a specific day."""
    pattern = f"{day_num}. Day {day_num}*"
    matches = list(udemy_path.glob(pattern))
    
    if not matches:
        raise FileNotFoundError(f"No folder found for Day {day_num}")
    
    return matches[0]


def main():
    parser = argparse.ArgumentParser(description="Extract portfolio project metadata from HTML assignments")
    parser.add_argument("--day", type=int, required=True, help="Day number to extract (82-100)")
    parser.add_argument("--output", type=str, default="data/day_metadata.json", help="Output JSON file path")
    parser.add_argument("--udemy-path", type=str, 
                        default="Udemy - 100 Days of Code The Complete Python Pro Bootcamp 2025-8",
                        help="Path to Udemy course folder")
    
    args = parser.parse_args()
    
    if args.day < 82:
        print(f"Warning: Day {args.day} is not a portfolio project day (82-100)")
    
    # Build paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    udemy_path = project_root / args.udemy_path
    output_path = project_root / args.output
    
    # Find and process day folder
    day_folder = find_day_folder(udemy_path, args.day)
    print(f"Processing: {day_folder.name}")
    
    metadata = extract_portfolio_metadata(day_folder)
    metadata["day"] = args.day
    metadata["mode"] = "portfolio"
    
    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Write output
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Extracted portfolio metadata for Day {args.day}")
    print(f"   Project: {metadata['project_name']}")
    print(f"   Category: {metadata['project_category']}")
    print(f"   Duration: {metadata['duration_minutes']} minutes")
    print(f"   Output: {output_path}")
    
    return metadata


if __name__ == "__main__":
    main()
