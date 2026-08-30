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
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_strong_jwt_secret>
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your_email_address>
SMTP_PASS=<your_email_app_password>
SMTP_SERVICE=gmail
```
