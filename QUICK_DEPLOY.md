# Quick Deploy: Learning Tracker → Cloudflare Pages

## 🚀 Fastest Path to Deployment (5 minutes)

### 1. Go to Cloudflare Dashboard
👉 https://dash.cloudflare.com/

### 2. Create Pages Project
- Click **Workers & Pages** → **Create Application** → **Pages**
- Select **Connect to Git**

### 3. Connect GitHub
- Choose: `samueladegoke/Learning_Tracker`
- Branch: `main`

### 4. Build Configuration
```
Project name: learning-tracker
Build command: npm run build
Build output: frontend/dist
Root directory: .
Node version: 18
```

### 5. Environment Variables (CRITICAL!)
Add these in Settings → Environment Variables:

```bash
VITE_CONVEX_URL=https://energetic-spider-825.convex.cloud
CONVEX_DEPLOYMENT=dev:energetic-spider-825
CONVEX_DEPLOY_KEY=dev:energetic-spider-825|eyJ2MiI6IjY5M2M3ZTE3MjQyNDQzYzE4YjQ4ODRjYmQzZTA0NWNkIn0=
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZGFzaGluZy1tYWNrZXJlbC04Ni5jbGVyay5hY2NvdW50cy5kZXYk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGFzaGluZy1tYWNrZXJlbC04Ni5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_9GBwj5HqxRikw5f9LYjq7k0siZvNKFrZeiXoCOzUPa
```

⚠️ Add to **BOTH Production AND Preview**

### 6. Deploy!
Click **Save and Deploy** → Wait 2-3 minutes → Done! 🎉

---

**Your app will be live at:** `https://learning-tracker.pages.dev`

Auto-deploys on every push to `main` ✅
