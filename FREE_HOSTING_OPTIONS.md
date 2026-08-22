# 100% Free & Student Production Hosting Guide for MWU CMS

Since Railway credits ran out and Render sleeps, here are the **top 3 best 100% FREE, reliable alternatives** that work without credit card issues, using your **Student Email** or **Google Account**:

---

## 🏆 Option 1: Koyeb (Recommended: 100% Free, No Credit Card, Never Sleeps)

**Why Koyeb?**
- 100% Free Eco Service with **No Sleeping / No Spin-Down** (unlike Render, it stays active 24/7).
- No credit card required — sign up directly with GitHub.
- Deploys directly from your GitHub repository with auto-deploys on `git push`.

### Step-by-Step Deployment:
1. Go to **[Koyeb.com](https://www.koyeb.com/)** and click **"Get Started"** -> Sign in with **GitHub**.
2. Click **"Create Web Service"**.
3. Select **"GitHub"** as deployment method and choose your repository: `mwuu-cms-web-based` (or your repo name).
4. In the configuration:
   - **Root directory**: `backend`
   - **Build type**: `Buildpack` (or `Node.js`)
   - **Instance type**: `Free` (Nano)
5. Under **"Environment variables"**, click **"Bulk edit"** and paste:
   ```env
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=*
   MONGO_URI=mongodb+srv://abdisaawel313_db_user:ZhisJbZxmkllIcLP@cluster0.0fujnax.mongodb.net/mwu_clearance?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=fe8626cd-87f4-4d0c-9047-1d2dcc4ac629eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywicm9sZSI6ImFkbWluIn0.6GE7qhatYASEHDzXitii23grw0xaCYGAow7zPYPUl1A
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=divkrnd4j
   CLOUDINARY_API_KEY=235296373441826
   CLOUDINARY_API_SECRET=Nv4yCd27Fuw9gt5Nai04_Vxu7KE
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=abdisaawel82@gmail.com
   SMTP_PASS=smutwozycmsvvled
   SMTP_SERVICE=gmail
   ```
6. Click **"Deploy"**.
7. Koyeb gives you an active public domain like: `https://your-app.koyeb.app`.
8. Test `https://your-app.koyeb.app/api/health` -> copy this URL into Vercel's `VITE_API_URL`.

---

## ⚡ Option 2: Google Cloud Run (Using Your Google Pro / GCP Account)

**Why Google Cloud Run?**
- **2 Million free API requests per month ALWAYS FREE** (Google Free Tier).
- Plus **$300 Free Credits** on any new Google Cloud account.
- Enterprise-grade speed, global latency, zero downtime.

### Step-by-Step Deployment:
1. Go to **[Google Cloud Console](https://console.cloud.google.com/)** and log in with your Google account.
2. In the top search bar, type **"Cloud Run"** and select **Cloud Run**.
3. Click **"Create Service"**:
   - **Deploy from repository**: Connect your GitHub repo.
   - **Source directory**: `/backend`
   - **Authentication**: Select **"Allow unauthenticated invocations"** (so the public/frontend can make API calls).
4. Click **"Container, Variables & Secrets, Connections, Security"** -> **"Variables"**:
   - Add the environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `PORT=8080`, etc.).
5. Click **"Create"**. Google Cloud will build and give you a `https://mwu-backend-xxxx.run.app` URL.

---

## 🎓 Option 3: GitHub Student Developer Pack (Using Your Student Email)

**Why Student Developer Pack?**
- Claim over **$1,000+ in free cloud credits and developer tools** instantly.
- Unlocks **$200 in DigitalOcean credits**, **$100 in Microsoft Azure credits**, **Heroku student credits**, free Namecheap domain, and free MongoDB Atlas benefits without credit card blocks.

### How to Claim:
1. Go to **[education.github.com/pack](https://education.github.com/pack)**.
2. Click **"Sign up for Student Developer Pack"**.
3. Add your student email (e.g. `@mwu.edu.et` or your university email) or upload a photo of your Student ID card.
4. Once verified (usually 5–15 mins), you can claim free credits across DigitalOcean, Azure, or Railway.

---

## 🚀 Frontend Deployment on Vercel (Always 100% Free)

Your frontend is already prepared with `vercel.json` SPA routing:
1. Go to **[Vercel.com](https://vercel.com)** -> Click **"Add New..."** -> **"Project"**.
2. Select your GitHub repository.
3. Set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-app.koyeb.app` (or your Google Cloud Run URL).
5. Click **"Deploy"**.
