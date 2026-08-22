# Madda Walabu University (MWU) Clearance Management System - Backend API

Production-ready REST API server for MWU Clearance & Digital Certification System built with Node.js, Express, and MongoDB Atlas.

## Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ORM)
- **Authentication**: JWT & bcryptjs
- **Verification**: QRCode & SHA-256 Digital Verification

## Deployment (Railway / PaaS)
1. Push this repository to GitHub.
2. Link to Railway / Render / Koyeb / GCP.
3. Configure environment variables from `.env.example`.
4. Start command: `npm start` (`node src/server.js`).

## Environment Variables Required
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
