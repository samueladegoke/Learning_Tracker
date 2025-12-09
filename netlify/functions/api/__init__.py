import sys
import os
from mangum import Mangum

# Add the project root to sys.path so we can import backend
# Assumes this file is in netlify/functions/api.py
current_dir = os.path.dirname(os.path.abspath(__file__))
root_path = os.path.abspath(os.path.join(current_dir, '../../../'))

# Add both root and backend directory to path
sys.path.insert(0, root_path)
sys.path.insert(0, os.path.join(root_path, 'backend'))

# Import the FastAPI app
try:
    from backend.app.main import app
except ImportError as e:
    import traceback
    # Try importing from app.main directly if backend.app.main failed
    # This might happen if the backend directory itself is added to path,
    # and app.main is directly inside it.
    try:
        from app.main import app
        print(f"Failed to import app: {e}")
        # Create a fallback app to show error in browser
        from fastapi import FastAPI
        app = FastAPI()
        
        @app.get("/{path:path}")
        async def catch_all(path: str):
            error_trace = traceback.format_exc()
            return {
                "status": "error",
                "message": "Failed to import backend app",
                "cwd": os.getcwd(),
                "root_path": root_path,
                "sys_path": sys.path,
                "backend_dir_exists": os.path.exists(os.path.join(root_path, 'backend')),
                "backend_contents": os.listdir(os.path.join(root_path, 'backend')) if os.path.exists(os.path.join(root_path, 'backend')) else "N/A",
                "root_contents": os.listdir(root_path),
                "error": str(e),
                "traceback": error_trace
            }

handler = Mangum(app)
