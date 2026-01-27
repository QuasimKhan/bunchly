# Frontend Guide

The frontend is a **React 19** Single Page Application using **Vite**.

## Component Structure
- `pages/`: Full views (mapped to Routes).
- `components/`:
    - `ui/`: dumb components (Buttons, Modals, Inputs).
    - `auth/`: Wrappers like `ProtectedRoute`.
    - `analytics/`: Chart components.
- `layouts/`: `DashboardLayout` (Sidebar + Topbar).

## Key Custom Hooks
- **`useAuth()`**: Access current user, login, logout.
- **`useCookieConsent()`**: Manages GDPR banner state.
- **`useFetch(url)`**: Wrapper around axios for standard data fetching with loading/error states.

## Styling Guide (Tailwind v4)
We use a **Premium Design** philosophy.

### Common Patterns
- **Glassmorphism**: `backdrop-blur-md bg-white/30 border border-white/20`
- **Gradients**: `bg-gradient-to-r from-indigo-500 to-purple-600`
- **Shadows**: `shadow-xl shadow-indigo-500/10`

### Theme System
The `Appearance.jsx` page allows users to customize their page.
- Changes are saved to `user.appearance` in DB.
- The `PublicProfilePage` applies these styles dynamically (inline styles) to the background and buttons.

## Adding a New Page
1.  Create `src/pages/NewPage.jsx`.
2.  Add route in `src/App.jsx`.
    - If protected: Inside `<Route element={<ProtectedRoute />}>`.
    - If public: Top level.
3.  Add link in Sidebar (`src/layouts/DashboardLayout.jsx`) if needed.
