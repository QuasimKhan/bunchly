import User from "../models/User.js";

// Sitemap Generator
export const getSitemap = async (req, res) => {
    try {
        const baseUrl = "https://bunchly.in";
        
        // Static Routes
        const staticRoutes = [
            "/",
            "/login",
            "/signup",
            "/privacy",
        ];

        // Fetch valid public users with images
        const users = await User.find({
            "preferences.publicProfile.isPublic": true,
            "flags.isBanned": false,
            "flags.isStaff": false, 
        }).select("username updatedAt image name");

        // Build XML with Image Namespace
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

        // Add Static Routes
        staticRoutes.forEach(route => {
            xml += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>`;
        });

        // Add User Profiles with Images
        users.forEach(user => {
            if (user.username) {
                const profileUrl = `${baseUrl}/${user.username}`;
                xml += `
  <url>
    <loc>${profileUrl}</loc>
    <lastmod>${new Date(user.updatedAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>`;
                
                // Add Image extension if user has a profile image
                if (user.image) {
                     // Sanitize ampersands in URLs just in case
                     const imgUrl = user.image.replace(/&/g, '&amp;');
                     const imgTitle = (user.name || user.username).replace(/&/g, '&amp;');
                     xml += `
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${imgTitle}</image:title>
    </image:image>`;
                }
                
                xml += `
  </url>`;
            }
        });

        xml += `
</urlset>`;

        res.header("Content-Type", "application/xml");
        res.send(xml);

    } catch (error) {
        console.error("Sitemap Error:", error);
        res.status(500).end();
    }
};

// Robots.txt Handler (Backend specific, usually for API subdomains or direct access)
export const getRobots = (req, res) => {
    const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/
Disallow: /admin/

Sitemap: https://bunchly.in/api/sitemap.xml`;

    res.header("Content-Type", "text/plain");
    res.send(robots);
};
