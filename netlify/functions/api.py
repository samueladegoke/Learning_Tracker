import sys
import os
from mangum import Mangum

# Add the project root to sys.path so we can import backend
# Assumes this file is in netlify/functions/api.py
current_dir = os.path.dirname(os.path.abspath(__file__))
root_path = os.path.abspath(os.path.join(current_dir, '../../'))

# Add both root and backend directory to path
sys.path.insert(0, root_path)
sys.path.insert(0, os.path.join(root_path, 'backend'))

# Import the FastAPI app
try:
    from backend.app.main import app
except ImportError:
    try:
        from app.main import app
    except ImportError as e:
        print(f"Failed to import app: {e}")
        # Create a fallback app to show error in browser
        from fastapi import FastAPI
        app = FastAPI()
        @app.get("/{path:path}")
        def catch_all(path: str):
            return {"error": f"Import failed: {str(e)}", "sys_path": sys.path}

handler = Mangum(app)
