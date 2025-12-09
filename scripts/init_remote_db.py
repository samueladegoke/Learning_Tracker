import os
import sys

# Add backend to path so we can import app modules
# Script is in root/scripts/init_remote_db.py
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_path = os.path.abspath(os.path.join(current_dir, '../backend'))
sys.path.append(backend_path)

# Ensure psycopg2 is installed (it should be in venv)
try:
    import psycopg2
    print("psycopg2 detected.")
except ImportError:
    print("psycopg2 NOT detected. Install it via 'pip install psycopg2-binary'.")

from app.database import engine, Base
from app import models

print(f"Connecting to database: {engine.url}")
try:
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")
except Exception as e:
    print(f"Error creating tables: {e}")
    sys.exit(1)
