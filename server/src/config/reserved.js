export const reservedUsernames = [
    "admin",
    "administrator",
    "root",
    "sysadmin",
    "support",
    "help",
    "info",
    "contact",
    "webmaster",
    "security",
    "abuse",
    "api",
    "dashboard",
    "profile",
    "settings",
    "billing",
    "login",
    "logout",
    "signin",
    "signout",
    "signup",
    "register",
    "auth",
    "password",
    "reset",
    "verify",
    "app",
    "static",
    "media",
    "assets",
    "public",
    "private",
    "dev",
    "test",
    "staging",
    "prod",
    "production",
    "terms",
    "privacy",
    "legal",
    "about",
    "faq",
    "docs",
    "blog",
    "news",
    "status",
    "uptime",
    "health",
    "metrics",
    "analytics",
    "bunchly",
    "sitemap",
    "robots",
    "manifest",
    "favicon"
];

// Helper function to check if a username is reserved
export const isReserved = (username) => {
    if (!username) return false;
    
    const lower = username.toLowerCase();
    
    if (reservedUsernames.includes(lower)) return true;

    if (lower.startsWith("bunchly")) return true;

    
    return false;
};
