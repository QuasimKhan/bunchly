# Bunchly - Overview & Architecture

## 1. Project Introduction
**Bunchly** is a SaaS application similar to Linktree. It allows users to create a personalized landing page ("bio link") to house all their important links, social media profiles, and content in one place.
- **Goal**: Provide a highly customizable, premium-feeling bio link page.
- **Business Model**: Freemium (Free tier + Pro tier with advanced customization, analytics, and removal of branding).
- **Target Audience**: Creators, professionals, businesses.

## 2. Tech Stack Summary

### **Frontend (Client)**
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (latest version), CSS Modules for specific animations.
- **Routing**: [React Router v7](https://reactrouter.com/) (latest version).
- **State Management**: React Context (`AuthContext`, `ThemeContext`), Local State.
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Animations**: Framer Motion, GSAP.
- **UI Components**: DaisyUI, HeadlessUI, Lucide React (Icons).
- **deployment**: Vercel/Netlify (likely target).

### **Backend (Server)**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js v5](https://expressjs.com/en/5x/api.html) (Beta).
- **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose ODM).
- **Authentication**: Session-based (`express-session`, `cookie-parser`).
- **Payments**: [Razorpay](https://razorpay.com/).
- **Image Storage**: [Cloudinary](https://cloudinary.com/).
- **Emails**: [Resend](https://resend.com/) / Nodemailer.
- **Security**: Helmet, Rate Limiting (`express-rate-limit`), CORS.
- **Scheduled Tasks**: `node-cron` (for analytics aggregation/cleanup).

## 3. High-Level Architecture Diagram
```mermaid
graph TD
    User[End User] -->|HTTPS| CDN[CDN / Load Balancer]
    CDN -->|Static Assets| Client[React Client (SPA)]
    CDN -->|API Requests| Server[Express Server API]
    
    subgraph "Backend Services"
        Server -->|Read/Write| DB[(MongoDB)]
        Server -->|Upload Images| Cloudinary[Cloudinary]
        Server -->|Process Payments| Razorpay[Razorpay]
        Server -->|Send Emails| Resend[Resend]
    end

    subgraph "Frontend Pages"
        Client -->|/ (Home)| Home
        Client -->|/dashboard| Dashboard
        Client -->|/:username| PublicProfile
    end
```

## 4. Key Architectural Decisions
1.  **Monorepo-ish Structure**:
    - `client/`: Complete React SPA.
    - `server/`: Complete Express API.
    - Separation of concerns allows for independent deployment (e.g., Client to Vercel, Server to Render/Railway).

2.  **Server-Side SEO Injection**:
    - Since the Client is an SPA (Single Page Application), standard crawlers (Twitter bot, LinkedIn bot) might not execute JS to see meta tags.
    - **Solution**: The Express server (`server.js`) intercepts requests to `/:username`. It fetches the user data from MongoDB and **injects** `og:title`, `og:image`, etc., into the `index.html` *before* serving it. This ensures link previews work perfectly on social media.

3.  **Session-Based Auth**:
    - Uses `express-session` with `MongoStore` (likely `connect-mongo`) to store sessions in the database.
    - Secure, HTTP-only cookies are used to maintain state. This avoids storing JWTs in LocalStorage (XSS risk).

4.  **V4 Tailwind**:
    - Utilizing the cutting-edge Tailwind v4 for better performance and simplified configuration (no `tailwind.config.js` needed in many cases).
