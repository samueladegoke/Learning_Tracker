import CodeBlock from '../../CodeBlock'
import { Lightbulb, FileCode, Terminal, FolderTree, Package, Cog } from 'lucide-react'

export default function DeepDiveDay82() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Python Scripting */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Terminal className="w-6 h-6 text-primary-400" /> Professional Python Scripting
                    </h2>
                    <p>
                        Portfolio projects showcase your ability to write <strong>production-quality scripts</strong>. This includes proper argument parsing, error handling, and documentation.
                    </p>
                    <CodeBlock
                        code={`#!/usr/bin/env python3
"""
PDF Merger Script
Combines multiple PDF files into one.

Usage: python pdf_merger.py file1.pdf file2.pdf -o output.pdf
"""
import argparse
from PyPDF2 import PdfMerger

def parse_args():
    parser = argparse.ArgumentParser(description="Merge PDF files")
    parser.add_argument("files", nargs="+", help="PDF files to merge")
    parser.add_argument("-o", "--output", default="merged.pdf")
    return parser.parse_args()`}
                        language="python"
                    />
                </section>

                {/* Section 2: File Organization */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <FolderTree className="w-6 h-6 text-primary-400" /> Project Structure
                    </h2>
                    <p>
                        Well-organized projects are easier to maintain. Follow standard Python project conventions.
                    </p>
                    <CodeBlock
                        code={`my_project/
├── src/
│   ├── __init__.py
│   ├── main.py
│   └── utils.py
├── tests/
│   └── test_main.py
├── requirements.txt
├── README.md
└── setup.py

# requirements.txt
PyPDF2>=3.0.0
requests>=2.28.0
python-dotenv>=1.0.0`}
                        language="plaintext"
                    />
                </section>

                {/* Section 3: Working with Files */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <FileCode className="w-6 h-6 text-primary-400" /> File Automation
                    </h2>
                    <p>
                        Common scripting tasks include renaming files, organizing directories, and batch processing.
                    </p>
                    <CodeBlock
                        code={`import os
from pathlib import Path

def organize_downloads(folder):
    """Sort files into subfolders by extension."""
    folder = Path(folder)
    
    for file in folder.iterdir():
        if file.is_file():
            ext = file.suffix.lower()[1:]  # Remove dot
            target_dir = folder / ext
            target_dir.mkdir(exist_ok=True)
            file.rename(target_dir / file.name)
            print(f"Moved {file.name} -> {ext}/")

# Usage
organize_downloads("~/Downloads")`}
                        language="python"
                    />
                </section>

                {/* Section 4: Environment Variables */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <Cog className="w-6 h-6 text-primary-400" /> Secure Configuration
                    </h2>
                    <p>
                        Never hardcode API keys or passwords. Use environment variables and <code>.env</code> files.
                    </p>
                    <CodeBlock
                        code={`# .env file (add to .gitignore!)
API_KEY=your_secret_key_here
DATABASE_URL=postgres://...

# Python code
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env file

api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("API_KEY not set in environment")`}
                        language="python"
                    />
                </section>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1"><Package className="w-4 h-4 inline" /> Virtual Environments</h4>
                            <p className="text-sm text-surface-400">
                                Always use <code>venv</code> or <code>conda</code> to isolate project dependencies.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">if __name__ == "__main__"</h4>
                            <p className="text-sm text-surface-400">
                                This guard ensures code only runs when executed directly, not when imported.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Portfolio Ideas</h4>
                            <p className="text-sm text-surface-400">
                                File organizer, PDF merger, image resizer, web scraper, CSV processor.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
