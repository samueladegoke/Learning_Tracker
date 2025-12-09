import sys
import os
from mangum import Mangum

# Add the project root to sys.path so we can import backend
# Assumes this file is in netlify/functions/api.py
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
sys.path.append(root_path)

# Import the FastAPI app
try:
    from backend.app.main import app
except ImportError:
    # Fallback for different directory structures or just to see error in logs
    sys.path.append(os.path.join(root_path, 'backend'))
    from app.main import app

handler = Mangum(app)
