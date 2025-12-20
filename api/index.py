import os
import sys
from fastapi import FastAPI

# Diagnostic logic
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.append(project_root)

audit_log = []

def audit_import(module_name):
    try:
        __import__(module_name)
        audit_log.append(f"SUCCESS: {module_name}")
        return True
    except Exception as e:
        audit_log.append(f"FAILED: {module_name} -> {str(e)}")
        return False

# Audit the chain - focus on the suspects
audit_import("psycopg2")
audit_import("sqlalchemy")
audit_import("backend.app.database")

try:
    from backend.app.main import app
except Exception as e:
    app = FastAPI()
    
    @app.get("/api/health")
    def error_health():
        return {
            "status": "error",
            "audit": audit_log,
            "error": str(e)
        }

@app.get("/api/health/audit")
def get_audit():
    return {"audit": audit_log}
