export const PLANS = {
    free: {
        maxLinks: 3,
        maxCollections: 1,
        analytics: false,
        customThemes: false,
        removeBranding: false,
        qrCode: false,
    },
    pro: {
        maxLinks: Infinity,
        analytics: true,
        customThemes: true,
        removeBranding: true,
        qrCode: true,
    },
};
