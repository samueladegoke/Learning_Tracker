import os
import sys

# Add project root to sys.path for Vercel
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.append(project_root)

from backend.app.main import app

# Vercel Serverless Function Entrypoint
# This matches the "api/index.py" pattern Vercel looks for by default.
