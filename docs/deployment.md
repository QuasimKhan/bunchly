# Deployment Guide

This guide covers how to deploy the **Bunchly** application to production. Since the app relies on a Monorepo structure with separate Client and Server, we recommend deploying them independently.

## Strategy
- **Frontend**: Deploy to Vercel or Netlify.
- **Backend**: Deploy to Render, Railway, or a VPS (DigitalOcean/AWS).
- **Database**: Use MongoDB Atlas.

---

## 1. Deploying the Backend (Express API)

We recommend **Render** or **Railway** for ease of use.

### Preparing for Production
1.  Ensure your `package.json` has a start script: `"start": "node src/server.js"`.
2.  Ensure you are using `process.env.PORT`.

### Steps (Render Example)
1.  Connect your GitHub repo to Render.
2.  Select "Web Service".
3.  **Root Directory**: `server` (Important!).
4.  **Build Command**: `npm install`
5.  **Start Command**: `npm start`
6.  **Environment Variables**:
    - Add all variables from your `.env` (`MONGO_URI`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, etc.).
    - Set `NODE_ENV` to `production`.
    - Set `Client_URL` to your production frontend URL (e.g., `https://bunchly.in`).

---

## 2. Deploying the Frontend (React SPA)

We recommend **Vercel**.

### Steps
1.  Connect your GitHub repo to Vercel.
2.  **Root Directory**: `client` (Important! Vercel will ask "This project is not at the root...").
3.  **Framework Preset**: Vite.
4.  **Build Command**: `npm run build`
5.  **Output Directory**: `dist`
6.  **Environment Variables**:
    - `VITE_API_URL`: Set to your production backend URL (e.g., `https://api.bunchly.in`).
    - `VITE_RAZORPAY_KEY_ID`: Your Razorpay Key ID.

### Special Configuration for SPA Routing
Vercel handles SPA routing automatically for Vite apps. However, if you face 404 errors on refresh, ensure you have a `vercel.json` in the `client` folder:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 3. Post-Deployment Checks
1.  **CORS**: Ensure your Backend `Client_URL` matches your unique Vercel domain exactly (no trailing slashes if not handled).
2.  **Cookies**: Since `SameSite` policies apply, ensure your Backend and Frontend are on secure HTTPS. If they are on different domains (e.g., `bunchly.vercel.app` and `bunchly-api.onrender.com`), you must set `SameSite: 'none'` and `Secure: true` in your cookie config.
    - *Note: Our code handles this in `src/config/session.js` based on `NODE_ENV`.*
