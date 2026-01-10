import axios from "axios";
import * as cheerio from "cheerio";

export const fetchUrlMetadata = async (url) => {
    try {
        if (!url) return null;
        if (!url.startsWith('http')) url = 'https://' + url;

        const { data } = await axios.get(url, {
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            },
        });

        const $ = cheerio.load(data);
        
        const getMeta = (prop) => 
            $(`meta[property="${prop}"]`).attr("content") || 
            $(`meta[name="${prop}"]`).attr("content");

        const title = getMeta("og:title") || $("title").text() || "";
        const description = getMeta("og:description") || getMeta("description") || "";
        let image = getMeta("og:image") || getMeta("twitter:image");
        
        // Icon fetching
        let icon = 
            $('link[rel="apple-touch-icon"]').attr('href') || 
            $('link[rel="icon"]').attr('href') || 
            $('link[rel="shortcut icon"]').attr('href');

        // Handle relative URLs
        if (icon && !icon.startsWith("http")) {
            try {
                icon = new URL(icon, url).href;
            } catch (e) {
                icon = null;
            }
        }
        
        if (image && !image.startsWith("http")) {
             try {
                image = new URL(image, url).href;
            } catch (e) {
                image = null; // invalid relative url
            }
        }

        return { 
            title: title.trim(), 
            description: description.trim(), 
            image, 
            icon 
        };
    } catch (error) {
        console.error("Metadata fetch error:", error.message);
        return { 
            title: "", 
            description: "", 
            image: "", 
            icon: "" 
        };
    }
};

export default { fetchUrlMetadata };
