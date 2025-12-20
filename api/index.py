import os
import sys

# Ensure the project root is in the python path
# This helps Vercel find the 'backend' package
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.append(project_root)

try:
    from backend.app.main import app
except Exception as e:
    # Diagnostic fallback for Vercel
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/api/health")
    def error_health():
        return {
            "status": "error", 
            "detail": "Failed to import application",
            "error": str(e),
            "trace": "Check Vercel logs for full traceback"
        }
    
    @app.get("/{rest_of_path:path}")
    def error_all(rest_of_path: str):
        return {"error": "App failed to boot", "detail": str(e)}
