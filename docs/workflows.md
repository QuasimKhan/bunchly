# Key Workflows

## 1. Authentication Flow
1.  User submits credentials to `/auth/login`.
2.  Server verifies password with `bcrypt.compare`.
3.  Server creates a session document in MongoDB (`sessions` collection).
4.  Server responds with `Set-Cookie: connect.sid=...; HttpOnly; Secure`.
5.  Frontend `AuthContext` detects success and redirects to `/dashboard`.
6.  Subsequent requests include the cookie automatically. `sessionMiddleware` verifies it.

## 2. Payment Flow (Razorpay)
1.  User selects "Pro Plan" in Dashboard.
2.  **Order Creation**: Client calls `POST /payment/create-order`. Server talks to Razorpay API to generate an `order_id` and returns it.
3.  **Checkout**: Client initializes `new window.Razorpay(options)` with the `order_id`. User pays.
4.  **Verification**: Razorpay returns `payment_id` and `signature`.
5.  **Completion**: Client posts these to `POST /payment/verify`. Server validates the HMAC signature.
6.  **Effect**: Server sets `user.plan = 'pro'` and logs the transaction.

## 3. Public Profile Views
1.  Visitor requests `bunchly.in/username`.
2.  Visitor's browser sends GET request.
3.  **Express Logic**:
    - `server.js` matching route `/:username` kicks in.
    - Fetches User.
    - Reads static `index.html`.
    - Injects Meta Tags for SEO.
    - Sends HTML.
4.  **Client Logic**:
    - React boots up.
    - `PublicProfilePage` component mounts.
    - Fetches user links from `/api/user/public/:username`.
    - Fires `POST /analytics/view` (debounced) to count a profile view.
