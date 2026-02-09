# Learning Tracker - Cloudflare Pages Deployment Guide

## 🎯 Migration Status: Vite → Cloudflare Pages

**Stack Confirmation:**
- ✅ Frontend: **Vite** (not Next.js)
- ✅ Backend: Convex
- ✅ Auth: Clerk
- ✅ Target: Cloudflare Pages (Free Tier)

---

## 📋 Phase 1: Local Configuration Complete ✅

### Files Created:
1. **`wrangler.toml`** - Cloudflare Pages configuration
2. **`.cloudflare/pages.json`** - Build settings

### Build Settings:
- **Build Command:** `npm run build`
- **Build Output:** `frontend/dist`
- **Node Version:** 18
- **Root Directory:** `.` (monorepo root)

---

## 🔧 Environment Variables Required

These must be added in **Cloudflare Pages Dashboard** → Settings → Environment Variables:

```bash
# Convex Backend
VITE_CONVEX_URL=https://energetic-spider-825.convex.cloud
CONVEX_DEPLOYMENT=dev:energetic-spider-825
CONVEX_DEPLOY_KEY=dev:energetic-spider-825|eyJ2MiI6IjY5M2M3ZTE3MjQyNDQzYzE4YjQ4ODRjYmQzZTA0NWNkIn0=

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZGFzaGluZy1tYWNrZXJlbC04Ni5jbGVyay5hY2NvdW50cy5kZXYk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGFzaGluZy1tYWNrZXJlbC04Ni5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_9GBwj5HqxRikw5f9LYjq7k0siZvNKFrZeiXoCOzUPa
```

**⚠️ Important:** Add these to **both Production and Preview** environments in Cloudflare.

---

## 🚀 Deployment Steps

### Option A: GitHub Integration (Recommended)

1. **Go to Cloudflare Dashboard**
   - Navigate to [Cloudflare Pages](https://dash.cloudflare.com/pages)
   - Click "Create a project"

2. **Connect GitHub Repository**
   - Select `samueladegoke/Learning_Tracker`
   - Authorize Cloudflare access

3. **Configure Build Settings**
   ```
   Framework preset: None (Vite is auto-detected)
   Build command: npm run build
   Build output directory: frontend/dist
   Root directory: .
   ```

4. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add all variables from the list above
   - Apply to both Production and Preview

5. **Deploy**
   - Click "Save and Deploy"
   - Cloudflare will auto-deploy on every push to `main`

### Option B: Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy (from project root)
wrangler pages deploy frontend/dist --project-name=learning-tracker
```

---

## 🧪 Pre-Deployment Testing

### Test Local Build:
```bash
cd /home/azureuser/.openclaw/workspace/Learning_Tracker
npm run build
```

**Expected Output:**
- ✅ Build completes without errors
- ✅ `frontend/dist/` directory created
- ✅ Contains `index.html`, `assets/`, and static files

### Test Preview:
```bash
cd frontend
npm run preview
```

Then visit `http://localhost:4173` to verify the production build works locally.

---

## 🔄 Migration Checklist

- [x] Identify stack (Vite, not Next.js)
- [x] Create `wrangler.toml` configuration
- [x] Create `.cloudflare/pages.json`
- [x] Document environment variables
- [ ] **Next Step:** Run local build test
- [ ] Deploy to Cloudflare Pages
- [ ] Configure custom domain (optional)
- [ ] Update GitHub repo settings
- [ ] Pause/delete Vercel deployment

---

## 🎯 Next Actions

1. **Run local build test** to verify everything compiles
2. **Set up GitHub integration** on Cloudflare Pages
3. **Add environment variables** in Cloudflare dashboard
4. **Deploy and verify** the app works

---

## 📚 Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Convex Deployment](https://docs.convex.dev/production/hosting)
- [Clerk Integration](https://clerk.com/docs/deployments/overview)

---

**Status:** ✅ Configuration complete, ready for build testing and deployment!
