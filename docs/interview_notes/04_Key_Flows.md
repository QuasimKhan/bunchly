# Key User Flows & Workflows

## 1. Authentication Flow (Session Based)
Traditional secure auth pattern.

1.  **User Enters Credentials** on Login Page.
2.  **POST /api/auth/login**:
    - Server verifies hash.
    - Server creates session in MongoDB (`sessions` collection).
    - Server sends `connect.sid` HTTP-Only Cookie.
3.  **Client Response**:
    - Client sees 200 OK + User Data.
    - `AuthContext` updates user state.
    - Redirect to `/dashboard`.
4.  **Persistence**:
    - On page reload (`App.jsx`), `useEffect` calls `GET /api/auth/me`.
    - Browser automatically sends cookie.
    - Server validates session -> Returns user data.
    - App remains logged in.

## 2. "God Mode" (Admin) Flow
How the admin manages the platform.

1.  **Route Protection**: Admin tries to access `/admin/users`.
2.  **Middleware Check**: `AdminRoute` component checks `user.role === 'admin'`.
3.  **Data Fetching**: Admin Dashboard fetches aggregated data (Total Revenue, Total Users) from `/api/admin/analytics`.
4.  **User Management**:
    - Admin can "Ban" a user -> Sets `flags.isBanned = true` in DB.
    - This immediately affects the SEO Injection route -> Banned profiles return 404 or "Suspended" page.

## 3. Payment Flow (Razorpay)

1.  **Initiation**: User clicks "Upgrade to Pro" in Dashboard.
2.  **Order Creation**:
    - Client calls `POST /api/payment/create-order`.
    - Server calls Razorpay API to create an Order ID.
    - Returns Order ID to client.
3.  **Checkout UI**:
    - Client opens Razorpay Modal using the Order ID.
    - User pays via UPI/Card.
4.  **Verification**:
    - Razorpay creates a `payment_id` and `signature`.
    - Client calls `POST /api/payment/verify` with these details.
5.  **Fulfillment**:
    - Server verifies signature uses HMAC-SHA256.
    - If valid -> Updates `user.plan = 'pro'`.
    - Records transaction in `Payment` collection.

## 4. The "Link Tree" Rendering Flow (Public View)

1.  **Request**: Visitor hits `bunchly.in/johndoe`.
2.  **Server Intercept (`server.js`)**:
    - Looks up `johndoe`.
    - Injects Meta Tags (Title: "John Doe | Bunchly", Image: User Profile Pic).
    - Returns `index.html`.
3.  **Client Hydration**:
    - React boots up.
    - Router matches `/:username`.
    - Fetches full profile data (Links, Theme) from `/api/user/public/johndoe`.
4.  **Visuals**:
    - Applies `user.appearance.bgType` (e.g., Gradient).
    - Renders simple buttons `<a>` for each link.
5.  **Analytics**:
    - Visitor clicks a link "My YouTube".
    - `a` tag has an `onClick` handler.
    - Handler fires `POST /api/analytics/click { linkId: xyz }`.
    - Then allows navigation to the YouTube URL.
