# Bunchly - Backend Deep Dive

## 1. Entry Point & Configuration
- **Entry File**: `src/server.js`
    - Initializes the database connection (`connectDB`).
    - Starts the Express listener.
    - Handles the **Dynamic SEO Injection** logic.
- **App Configuration**: `src/app.js`
    - Sets up middleware: `helmet` (security headers), `cors` (Cross-Origin Resource Sharing), `morgan` (logging), `cookieParser`.
    - Configures Routes under `/api/`.
    - Serves static files from `../client/dist` for production.

## 2. Database Schema (Mongoose Models)
Located in `src/models/`, the data layer uses MongoDB.

### **Core Models**
- **User**: The central entity.
    - Stores `username`, `email`, `password` (hashed).
    - `plan`: 'free' or 'pro'.
    - `appearance`: Nested object storing theme settings (colors, fonts, bg images).
    - `subscription`: Razorpay order/payment IDs.
    - `usage`: Counters for links and clicks.
- **Link**: Represents a single button on a user's profile.
    - `userId`: Ref to User.
    - `url`, `title`: The core content.
    - `type`: 'classic', 'music', 'video', 'header' (for section breaks).
    - `layout`: 'stack', 'grid', 'carousel' (display options).
    - `isActive`: Toggle visibility.
    - `clicks`: Counter.
- **LinkClick**: Granular analytics event.
    - Records *every* click with `ip`, `userAgent`, `country`, `city`, `device`.
    - Used for generating detailed charts.
- **ProfileView**: Tracks views on the public profile page.
    - Similar tracking to LinkClick (IP, location, etc.).

### **Support Models**
- **Payment**: Log of all transactions.
- **Coupon**: admin-generated discount codes.
- **Report**: User reports against other profiles (Trust & Safety).
- **Feedback**: User submitted feedback.

## 3. Authentication Flow
Based on `src/controllers/auth.controller.js` and `src/routes/auth.routes.js`.

1.  **Signup (`/register`)**:
    - Validates input.
    - Hashes password.
    - Creates `User` document.
    - Sends verification email (if configured).
2.  **Login (`/login`)**:
    - Finds user by email/username.
    - Compares password (bcrypt).
    - **Session Creation**: `req.session.userId = user._id`.
    - Express-session saves this to MongoDB and sends a `connect.sid` cookie to the client.
3.  **Logout (`/logout`)**:
    - Destroys the session in DB.
    - Clears the cookie.
4.  **Middleware (`auth.middleware.js`)**:
    - `protect`: Checks if `req.session.userId` exists. If not, returns 401.

## 4. API Structure
All API routes are prefixed with `/api`.

| Route | Description |
|-------|-------------|
| `/api/auth` | Login, Register, Logout, Me. |
| `/api/user` | Profile management (update bio, image, appearance). |
| `/api/links` | CRUD operations for Links. |
| `/api/analytics` | Fetch chart data for the dashboard. |
| `/api/payment` | Initiate and verify Razorpay transactions. |
| `/api/admin` | God-mode routes (manage users, see revenue). |

## 5. Unique Backend Features
- **Dynamic SEO**: The server acts as a hybrid. It serves static files *but* intercepts requests for profiles to inject HTML meta tags. This is crucial for "Linktree-like" sharing.
- **Rate Limiting**: `config/rateLimit.js` prevents abuse on auth and generic API endpoints.
- **Cron Jobs**: `src/cron.js` likely handles tasks like cleaning up expired verification tokens or aggregating analytics data to keep the `LinkClick` collection from growing infinitely (if implemented).
