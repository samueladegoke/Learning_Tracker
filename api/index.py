import os
import sys
from fastapi import FastAPI

app = FastAPI()

@app.get("/api/health")
def health():
    return {"status": "bridge_only", "root": os.getcwd(), "path": sys.path[:3]}

@app.get("/{rest_of_path:path}")
def hello(rest_of_path: str):
    return {"hello": rest_of_path}

# Original app import commented out for isolation test
# try:
#     from backend.app.main import app
# except Exception as e:
#     ...
