import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
    try {
        const baseUrl = "https://bunchly.in";

        // Static routes
        const staticRoutes = [
            "",
            "/login",
            "/signup",
            "/contact",
            "/policy",
            // Add other static pages here
        ];

        // Fetch valid users
        // Only public, verified, non-banned users
        // Adjust filter criteria as per business logic
        const users = await User.find({
            "flags.isBanned": false,
            "preferences.publicProfile.isPublic": true,
        }).select("username updatedAt");

        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Add static routes
        staticRoutes.forEach((route) => {
            xml += `
    <url>
        <loc>${baseUrl}${route}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
        });

        // Add user profiles
        users.forEach((user) => {
            xml += `
    <url>
        <loc>${baseUrl}/${user.username}</loc>
        <lastmod>${new Date(user.updatedAt).toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`;
        });

        xml += "\n</urlset>";

        res.header("Content-Type", "application/xml");
        res.send(xml);
    } catch (error) {
        console.error("Sitemap generation error:", error);
        res.status(500).send("Error generating sitemap");
    }
});

export default router;
