"""
Extract content from Day 1 course materials.

This module extracts text from PDFs, VTT subtitle files, HTML quiz files,
and TXT files for use in generating practice notebooks.
"""

import os
import re
import json
import logging
from pathlib import Path
from typing import Optional, Dict, Any, List
import pdfplumber
import glob

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Constants
ASCII_LOWERCASE_A = ord('a')  # ASCII value for 'a' (97)
MAX_JSON_SIZE = 10 * 1024 * 1024  # 10MB limit for JSON extraction


def get_day1_path() -> Path:
    """
    Get the path to Day 1 course materials.
    
    Uses environment variable COURSE_BASE_PATH if set, otherwise constructs
    default path from user's Documents folder.
    
    Returns:
        Path object pointing to Day 1 directory
        
    Raises:
        FileNotFoundError: If the directory doesn't exist
    """
    course_base = os.getenv(
        "COURSE_BASE_PATH",
        os.path.join(os.path.expanduser("~"), "Documents", "Programming", "Courses")
    )
    
    day1_path = Path(course_base) / "Udemy - 100 Days of Code The Complete Python Pro Bootcamp 2025-8" / "01. Day 1 - Beginner - Working with Variables in Python to Manage Data"
    
    if not day1_path.exists():
        raise FileNotFoundError(
            f"Day 1 directory not found: {day1_path}\n"
            f"Set COURSE_BASE_PATH environment variable to customize the path."
        )
    
    return day1_path


def extract_pdf_text(filepath: str) -> str:
    """
    Extract text from PDF file with proper error handling.
    
    Args:
        filepath: Path to the PDF file
        
    Returns:
        Extracted text as a single string, with pages separated by double newlines
        
    Raises:
        FileNotFoundError: If file doesn't exist
        PermissionError: If file cannot be read
        pdfplumber.exceptions.PDFSyntaxError: If PDF is corrupted
    """
    path = Path(filepath)
    
    if not path.exists():
        raise FileNotFoundError(f"PDF file not found: {filepath}")
    
    if not path.is_file():
        raise ValueError(f"Path is not a file: {filepath}")
    
    text_content: List[str] = []
    
    try:
        with pdfplumber.open(filepath) as pdf:
            if not pdf.pages:
                logger.warning(f"PDF has no pages: {filepath}")
                return ""
            
            for page_num, page in enumerate(pdf.pages, 1):
                try:
                    text = page.extract_text()
                    if text:
                        text_content.append(text)
                except Exception as e:
                    logger.warning(f"Error extracting text from page {page_num} of {filepath}: {e}")
                    continue
                    
    except pdfplumber.exceptions.PDFSyntaxError as e:
        logger.error(f"Corrupted PDF: {filepath} - {e}")
        raise
    except PermissionError as e:
        logger.error(f"Permission denied: {filepath} - {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error reading PDF {filepath}: {e}", exc_info=True)
        raise
    
    return "\n\n".join(text_content) if text_content else ""


def extract_vtt_text(filepath: str) -> str:
    """
    Extract text from WebVTT subtitle file, preserving structure.
    
    Handles multi-line cues, timestamps, and metadata blocks.
    
    Args:
        filepath: Path to the VTT file
        
    Returns:
        Extracted text with cues separated by double newlines
        
    Raises:
        FileNotFoundError: If file doesn't exist
        UnicodeDecodeError: If file cannot be decoded as UTF-8
    """
    path = Path(filepath)
    
    if not path.exists():
        raise FileNotFoundError(f"VTT file not found: {filepath}")
    
    text_segments: List[str] = []
    in_cue = False
    current_cue: List[str] = []
    
    # Regex pattern for VTT timestamps (supports multiple formats)
    timestamp_pattern = re.compile(
        r'\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}\.\d{3}'
    )
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                original_line = line
                line = line.strip()
                
                # Skip empty lines
                if not line:
                    if current_cue:
                        text_segments.append(" ".join(current_cue))
                        current_cue = []
                        in_cue = False
                    continue
                
                # Skip WEBVTT header
                if line == "WEBVTT":
                    continue
                
                # Skip cue sequence numbers
                if line.isdigit():
                    if current_cue:
                        text_segments.append(" ".join(current_cue))
                        current_cue = []
                    in_cue = True
                    continue
                
                # Skip timestamps
                if timestamp_pattern.match(line):
                    continue
                
                # Skip NOTE and STYLE blocks
                if line.startswith("NOTE") or line.startswith("STYLE"):
                    in_cue = False
                    # Skip until blank line
                    continue
                
                # Collect cue text
                if in_cue and line:
                    current_cue.append(line)
                elif not in_cue and line and not line.startswith("WEBVTT"):
                    # Text outside of cue (shouldn't happen in valid VTT, but handle gracefully)
                    logger.warning(f"Unexpected text at line {line_num} in {filepath}: {line[:50]}")
            
            # Don't forget last cue
            if current_cue:
                text_segments.append(" ".join(current_cue))
    
    except UnicodeDecodeError as e:
        logger.error(f"Unicode decode error in VTT file {filepath}: {e}")
        raise
    except Exception as e:
        logger.error(f"Error reading VTT {filepath}: {e}", exc_info=True)
        raise
    
    return "\n\n".join(text_segments)


def extract_html_quiz_data(filepath: str) -> Optional[Dict[str, Any]]:
    """
    Safely extract quizData JSON from HTML file.
    
    Validates JSON size and structure before parsing.
    
    Args:
        filepath: Path to the HTML file
        
    Returns:
        Parsed quiz data dictionary, or None if not found/invalid
        
    Raises:
        FileNotFoundError: If file doesn't exist
    """
    path = Path(filepath)
    
    if not path.exists():
        raise FileNotFoundError(f"HTML file not found: {filepath}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # More robust regex pattern - handles whitespace variations
        pattern = r'const\s+quizData\s*=\s*({.*?});'
        match = re.search(pattern, content, re.DOTALL | re.MULTILINE)
        
        if not match:
            logger.debug(f"No quizData found in {filepath}")
            return None
        
        json_str = match.group(1)
        
        # Validate size to prevent memory exhaustion
        if len(json_str) > MAX_JSON_SIZE:
            logger.error(
                f"Extracted JSON exceeds size limit: {len(json_str)} bytes "
                f"(max: {MAX_JSON_SIZE})"
            )
            return None
        
        # Parse with validation
        try:
            data = json.loads(json_str)
            
            # Validate structure
            if not isinstance(data, dict):
                logger.error(f"quizData is not a dictionary in {filepath}")
                return None
            
            return data
            
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in {filepath}: {e}")
            logger.debug(f"Problematic JSON snippet: {json_str[:500]}")
            return None
            
    except FileNotFoundError:
        raise
    except Exception as e:
        logger.error(f"Error reading HTML {filepath}: {e}", exc_info=True)
        return None


def extract_txt_text(filepath: str) -> str:
    """
    Extract text from a plain text file.
    
    Args:
        filepath: Path to the TXT file
        
    Returns:
        File contents as string
        
    Raises:
        FileNotFoundError: If file doesn't exist
        UnicodeDecodeError: If file cannot be decoded as UTF-8
    """
    path = Path(filepath)
    
    if not path.exists():
        raise FileNotFoundError(f"TXT file not found: {filepath}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError as e:
        logger.error(f"Unicode decode error in TXT file {filepath}: {e}")
        raise
    except Exception as e:
        logger.error(f"Error reading TXT {filepath}: {e}", exc_info=True)
        raise


def main() -> None:
    """
    Main extraction function.
    
    Processes all PDF, VTT, HTML, and TXT files in the Day 1 directory
    and saves extracted content to JSON file.
    """
    try:
        day1_path = get_day1_path()
    except FileNotFoundError as e:
        logger.error(str(e))
        return
    
    extracted_data: Dict[str, Dict[str, Any]] = {
        "pdfs": {},
        "vtts": {},
        "htmls": {},
        "txts": {}
    }
    
    errors: List[str] = []
    
    # Process PDFs
    pdf_files = list(glob.glob(str(day1_path / "*.pdf")))
    logger.info(f"Found {len(pdf_files)} PDF files")
    for filepath in pdf_files:
        filename = Path(filepath).name
        try:
            logger.info(f"Processing PDF: {filename}")
            extracted_data["pdfs"][filename] = extract_pdf_text(filepath)
        except Exception as e:
            error_msg = f"Failed to process PDF {filename}: {e}"
            logger.error(error_msg)
            errors.append(error_msg)
    
    # Process VTTs
    vtt_files = list(glob.glob(str(day1_path / "*.vtt")))
    logger.info(f"Found {len(vtt_files)} VTT files")
    for filepath in vtt_files:
        filename = Path(filepath).name
        try:
            logger.info(f"Processing VTT: {filename}")
            extracted_data["vtts"][filename] = extract_vtt_text(filepath)
        except Exception as e:
            error_msg = f"Failed to process VTT {filename}: {e}"
            logger.error(error_msg)
            errors.append(error_msg)
    
    # Process HTMLs
    html_files = list(glob.glob(str(day1_path / "*.html")))
    logger.info(f"Found {len(html_files)} HTML files")
    for filepath in html_files:
        filename = Path(filepath).name
        try:
            logger.info(f"Processing HTML: {filename}")
            extracted_data["htmls"][filename] = extract_html_quiz_data(filepath)
        except Exception as e:
            error_msg = f"Failed to process HTML {filename}: {e}"
            logger.error(error_msg)
            errors.append(error_msg)
    
    # Process TXTs
    txt_files = list(glob.glob(str(day1_path / "*.txt")))
    logger.info(f"Found {len(txt_files)} TXT files")
    for filepath in txt_files:
        filename = Path(filepath).name
        try:
            logger.info(f"Processing TXT: {filename}")
            extracted_data["txts"][filename] = extract_txt_text(filepath)
        except Exception as e:
            error_msg = f"Failed to process TXT {filename}: {e}"
            logger.error(error_msg)
            errors.append(error_msg)
    
    # Save extracted data
    output_file = "day1_extracted_content.json"
    try:
        with open(output_file, "w", encoding='utf-8') as f:
            json.dump(extracted_data, f, indent=2, ensure_ascii=False)
        logger.info(f"Extraction complete. Saved to {output_file}")
    except Exception as e:
        logger.error(f"Failed to save extracted data: {e}", exc_info=True)
        return
    
    # Report errors if any
    if errors:
        logger.warning(f"Encountered {len(errors)} errors during extraction:")
        for error in errors:
            logger.warning(f"  - {error}")


if __name__ == "__main__":
    main()
