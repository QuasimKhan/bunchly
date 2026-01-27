# Setup & Installation Guide

This guide will help you set up **Bunchly** on your local machine for development.

## Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **MongoDB** - Either [MongoDB Local](https://www.mongodb.com/try/download/community) or a [MongoDB Atlas](https://www.mongodb.com/atlas) URI.
- **Cloudinary Account** - For image hosting.
- **Razorpay Account** - For payment processing (Test mode is fine).

## 1. Clone the Repository
```bash
git clone https://github.com/QuasimKhan/bunchly.git
cd bunchly
```

## 2. Server Setup (Backend)
Navigate to the server directory:
```bash
cd server
npm install
```

### Environment Variables
Create a `.env` file in the `server` directory. Copy the following defaults and fill in your keys:

```ini
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/bunchly

# Security
SESSION_SECRET=your_super_secret_session_key_min_32_chars
JWT_SECRET=your_jwt_secret_key

# URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

# Razorpay (Payments)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email (Resend or Nodemailer)
RESEND_API_KEY=re_...
EMAIL_FROM=onboarding@resend.dev
```

### Start the Server
```bash
# Development Mode (with Nodemon)
npm run dev
```
Server should be running at `http://localhost:5000`.

## 3. Client Setup (Frontend)
Open a new terminal and navigate to the client directory:
```bash
cd client
npm install
```

### Environment Variables
Create a `.env` file in the `client` directory:

```ini
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_...
```
*Note: The Razorpay Key ID must match the one in the server config.*

### Start the Client
```bash
npm run dev
```
The app will open at `http://localhost:5173`.

## 4. Verification
1.  Go to `http://localhost:5173`.
2.  Sign up for a new account.
3.  Check your MongoDB database to ensure the `users` collection has a new document.
4.  Try adding a link in the dashboard.
