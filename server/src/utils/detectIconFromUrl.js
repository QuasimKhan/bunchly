export const detectIconFromUrl = (url) => {
    const lower = url.toLowerCase();

    if (lower.includes("youtube.com") || lower.includes("youtu.be"))
        return "youtube";
    if (lower.includes("instagram.com")) return "instagram";
    if (lower.includes("facebook.com")) return "facebook";
    if (lower.includes("twitter.com") || lower.includes("x.com"))
        return "twitter";
    if (lower.includes("github.com")) return "github";
    if (lower.includes("linkedin.com")) return "linkedin";
    if (lower.includes("spotify.com")) return "music";
    if (lower.includes("gmail.com") || lower.includes("mail.")) return "mail";

    return null;
};
