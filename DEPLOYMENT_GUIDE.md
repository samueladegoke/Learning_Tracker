# 🚀 Deployment Guide: Learning Tracker MVP

I have prepared your project for the **Supabase + Render + Vercel** stack.

## 1. Database: Supabase (Already Created)
I created a Supabase project for you with the schema already applied!

- **Project Name:** `learning-tracker-mvp`
- **Project Ref:** `lhdpiawslfpngmehafdo`
- **Region:** `us-east-1`

### Action Items:
1.  Go to [Supabase Dashboard](https://supabase.com/dashboard) and log in.
2.  Open the project `learning-tracker-mvp`.
3.  Go to **Project Settings > Database > Connection String**.
4.  Copy the **URI** (Mode: Transaction). It looks like:
    `postgresql://postgres:[YOUR-PASSWORD]@db.lhdpiawslfpngmehafdo.supabase.co:5432/postgres`
    *(You may need to reset your database password in Settings to know it)*.
5.  **Save this URL**, you will need it for Render.

---

## 2. Backend: Render (Python/FastAPI)
1.  Sign up/Log in to [Render](https://render.com).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository: `samueladegoke/Learning_Tracker`.
4.  Configure the service:
    - **Name:** `learning-tracker-backend`
    - **Region:** `US East` (to be close to your DB)
    - **Runtime:** `Python 3`
    - **Build Command:** `pip install -r backend/requirements.txt`
    - **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5.  **Environment Variables** (Advanced):
    Add the following variable:
    - Key: `DATABASE_URL`
    - Value: *(Paste your Supabase Connection String from Step 1)*
6.  Click **Create Web Service**.
7.  Wait for deployment to finish. Copy your **Service URL** (e.g., `https://learning-tracker-backend.onrender.com`).

---

## 3. Frontend: Vercel (React)
1.  Sign up/Log in to [Vercel](https://vercel.com).
2.  Click **Add New... > Project**.
3.  Import your `Learning_Tracker` repository.
4.  Configure the project:
    - **Framework Preset:** Vite
    - **Root Directory:** Edit this and select `frontend`.
5.  **Environment Variables**:
    Add the following variable:
    - Key: `VITE_API_URL`
    - Value: *(Paste your Render Service URL from Step 2)* (No trailing slash)
6.  Click **Deploy**.

---

## 4. Final Step: Seed the Database
Your remote database currently has tables but **no data**. To load the curriculum:

1.  Open a terminal in your local project.
2.  Set the environment variable and run the seed script:
    
    **Windows (PowerShell):**
    ```powershell
    $env:DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.lhdpiawslfpngmehafdo.supabase.co:5432/postgres"
    python backend/seed.py
    ```

    **Mac/Linux:**
    ```bash
    export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.lhdpiawslfpngmehafdo.supabase.co:5432/postgres"
    python backend/seed.py
    ```

3.  Visit your Vercel URL. You should see the Dashboard populated with Week 1 data!





