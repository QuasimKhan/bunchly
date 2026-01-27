# Bunchly - Frontend Deep Dive

## 1. Project Structure (`client/src`)

- **Root Components**:
    - `main.jsx`: Bootstraps React, mounts the app to DOM.
    - `App.jsx`: Main routing logic. Handles global providers (`AuthProvider`, `Toaster`, `ConsentBanner`).
- **Directories**:
    - `pages/`: Full page components (e.g., `Login`, `Dashboard`, `Links`).
    - `components/`: Reusable UI elements (Buttons, Inputs, Modals).
    - `layouts/`: Wrappers for pages.
        - `DashboardLayout`: Sidebar + Header + Content area. PROTECTED.
        - `AdminLayout`: Specialized layout for admin pages.
    - `context/`: React Context definitions.
    - `hooks/`: Custom hooks (e.g., `useAuth`, `useFetch`).

## 2. Routing Strategy (React Router v7)

The app uses a 3-tier routing strategy:

1.  **Public Routes**: accessible by anyone.
    - `/` (Home), `/login`, `/register`.
    - `/:username` (The dynamic profile page).
2.  **Protected Routes** (`<ProtectedRoute />`):
    - Wraps `/dashboard/*`.
    - Checks `useAuth()`. If `!user`, redirects to `/login`.
    - Fetches the current user session on mount.
3.  **Admin Routes** (`<AdminRoute />`):
    - Wraps `/admin/*`.
    - Checks `user.role === 'admin'`.

## 3. State Management

### **Global State (Context API)**
- **AuthContext**:
    - Holds `user` object (null if logged out).
    - `login(data)`: Updates state after successful API call.
    - `logout()`: Clears state.
    - `loading`: Boolean to prevent redirecting before session check completes.
- **ThemeContext**: (If present) handles light/dark mode toggling for the dashboard UI.

### **Local State**
- Pages like `Links.jsx` manage their own list of links using `useState`.
- Forms use `useState` for inputs.

## 4. Key Components Explained

### **Links Manager (`pages/Links.jsx`)**
This is the core feature for users.
- **Functionality**: Add, Edit, Delete, Reorder links.
- **Drag & Drop**: Likely uses `@dnd-kit` or similar library for reordering links.
- **Live Preview**: A mobile-mockup component sits on the right side, consuming the same data to show real-time changes.

### **Public Profile (`pages/PublicProfilePage.jsx`)**
This is the page visitors see (e.g., `bunchly.in/elon`).
- **Data Fetching**: On mount, calls `/api/public/:username` (or similar).
- **Rendering**:
    - Takes `user.appearance` to apply background (color/image/gradient).
    - Iterates over `user.links` to render buttons.
    - **Analytics**: Triggers a `POST /api/analytics/view` on mount to count the view.

## 5. Styling System

### **Tailwind CSS v4**
- **Utility-First**: Most styling is inline (e.g., `className="p-4 bg-white rounded-xl shadow"`).
- **Custom Config**: `tailwind.config.js` (or v4 CSS variables) likely defines brand colors like `primary`, `secondary`.

### **DaisyUI**
- Used for rapid component building (Modals, Alerts, Buttons).
- Example: `btn btn-primary` gives a styled button instantly.

## 6. API Integration (Axios)
- A configured axios instance (likely `api.js` or `axios.js`) is used.
- **Credentials**: `withCredentials: true` is crucial. It ensures the `connect.sid` cookie is sent with every request to identify the session.
- **Interceptors**: May be used to handle 401 errors globally (redirect to login).
