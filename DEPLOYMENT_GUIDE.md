# Madda Walabu University (MWU) Clearance Management System
## Production Deployment Guide: Railway (Backend) & Vercel (Frontend)

This guide provides a comprehensive step-by-step walkthrough to deploy your full-stack application to production.

---

### Architecture Overview
- **Backend**: Node.js / Express REST API hosted on **[Railway](https://railway.app)**
- **Database**: MongoDB Atlas Cluster
- **Frontend**: React + Vite SPA hosted on **[Vercel](https://vercel.com)**

---

## PART 1: Deploy Backend to Railway

### Step 1: Push Project to GitHub
Ensure your latest code is pushed to your GitHub repository:
```bash
git add .
git commit -m "Prepare production hosting for Railway and Vercel"
git push origin main
```

### Step 2: Create a New Project on Railway
1. Go to **[Railway.app](https://railway.app)** and log in with your GitHub account.
2. Click **"New Project"** -> Select **"Deploy from GitHub repo"**.
3. Choose your repository from the list.

### Step 3: Configure Root Directory
1. Once imported, click on the newly created service card.
2. Navigate to the **"Settings"** tab.
3. Under **"Service"**, find **"Root Directory"** and set it to:
   ```text
   backend
   ```
4. Click **"Save"**.

### Step 4: Configure Environment Variables
1. Go to the **"Variables"** tab in your Railway service.
2. Click **"Raw Editor"** (or add them one by one) and paste your configuration:

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

### Step 5: Generate a Public Domain on Railway
1. In your Railway service, go to **"Settings"** -> **"Networking"**.
2. Under **"Public Networking"**, click **"Generate Domain"**.
3. You will receive a URL like:
   `https://mwu-cms-production.up.railway.app`
4. Test the health endpoint in your browser:
   `https://mwu-cms-production.up.railway.app/api/health`
   *(It will return `{"status":"ok","service":"MWU Clearance Management System Backend"}`)*
5. **Copy this Railway URL** — you will need it for Vercel in Part 2!

---

## PART 2: Deploy Frontend to Vercel

### Step 1: Import Project to Vercel
1. Go to **[Vercel.com](https://vercel.com)** and log in with your GitHub account.
2. Click **"Add New..."** -> **"Project"**.
3. Select your repository from the list.

### Step 2: Configure Project Settings on Vercel
1. **Framework Preset**: Vite (automatically detected).
2. **Root Directory**: Click **"Edit"** next to Root Directory and select:
   ```text
   frontend
   ```
3. **Build & Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Step 3: Add Environment Variables
Under **"Environment Variables"**, add:
- **Key**: `VITE_API_URL`
- **Value**: `https://your-railway-domain.up.railway.app` *(paste your Railway URL from Part 1, without trailing slash)*

### Step 4: Deploy
1. Click **"Deploy"**.
2. Vercel will build and publish your frontend in ~1 minute.
3. You will receive a live URL like:
   `https://mwu-clearance.vercel.app`

---

## PART 3: Verification & Smoke Test

1. **Public Certificate Verification**:
   - Open `https://your-frontend.vercel.app/verify`
   - Enter `Ugr/50002/15` or `MWU-CLR-2026-8304`
   - Verify that the certificate card renders with QR code and validity stamp.
2. **Staff/Registrar Portal Login**:
   - Open `https://your-frontend.vercel.app/login`
   - Registrar Admin: `registrar@mwu.edu.et` / `Admin@12345`
   - Verify that the real-time MongoDB clearance queue, student verification center, and KPIs load properly.
3. **Student Portal Login**:
   - Student: `student@mwu.edu.et` / `Student@12345`
   - Verify clearance tracking, notifications, and certificate download.
