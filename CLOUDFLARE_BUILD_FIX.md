# 🔧 Cloudflare Build Error Fix

## Issue
Cloudflare Pages was trying to install Python dependencies from `requirements.txt`, causing build failures with `pydantic-core` (requires Rust compiler).

## Root Cause
- The Learning Tracker has a `requirements.txt` file (legacy from backend experiments)
- Cloudflare auto-detects Python and tries to install dependencies
- **The frontend is pure Vite/React and doesn't need Python**

## Solution Applied

### 1. Updated `wrangler.toml`
Changed build command to skip root-level dependencies:
```toml
[build]
command = "cd frontend && npm install && npm run build"
SKIP_DEPENDENCY_INSTALL = "true"
```

### 2. Created `.cfignore`
Tell Cloudflare to ignore Python files:
```
requirements.txt
*.py
__pycache__/
```

### 3. Updated Build Settings in Cloudflare Dashboard

**Use these settings instead:**

```
Build command: cd frontend && npm install && npm run build
Build output directory: frontend/dist
Root directory: .
Node version: 18
```

**Add this environment variable:**
```
SKIP_DEPENDENCY_INSTALL=true
```

## Re-Deploy Steps

1. Go to your Cloudflare Pages project
2. Click **Settings** → **Builds & deployments**
3. Click **Edit** on build configuration
4. Update build command to: `cd frontend && npm install && npm run build`
5. Add environment variable: `SKIP_DEPENDENCY_INSTALL=true`
6. Click **Retry deployment** on the failed build

Alternatively, push the updated `wrangler.toml` and `.cfignore` to your GitHub repo, which will trigger a new deployment automatically.

## Expected Result
✅ Build will skip Python dependencies  
✅ Only install frontend npm packages  
✅ Build time: ~1-2 minutes  
✅ Deployment success  

---

**Files Updated:**
- `wrangler.toml` - Fixed build command
- `.cfignore` - Ignore Python files (new file)
