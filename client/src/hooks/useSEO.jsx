import { useEffect } from "react";

const setMeta = (name, content, attr = "name") => {
    let tag = document.querySelector(`meta[${attr}="${name}"]`);
    if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
};

const setLink = (rel, href) => {
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
    }
    link.setAttribute("href", href);
};

export const useSEO = ({
    title,
    description,
    image = "/og-image.png",
    url = window.location.href,
    noIndex = false,
    structuredData = null,
}) => {
    useEffect(() => {
        document.title = title;

        // Basic SEO
        setMeta("description", description);
        setMeta("robots", noIndex ? "noindex,nofollow" : "index,follow");

        // Canonical
        setLink("canonical", url);

        // Open Graph
        setMeta("og:title", title, "property");
        setMeta("og:description", description, "property");
        setMeta("og:image", image, "property");
        setMeta("og:url", url, "property");
        setMeta("og:type", "website", "property");

        // Twitter
        setMeta("twitter:card", "summary_large_image");
        setMeta("twitter:title", title);
        setMeta("twitter:description", description);
        setMeta("twitter:image", image);

        // Structured Data (JSON-LD)
        if (structuredData) {
            let script = document.querySelector('script[type="application/ld+json"][data-seo="true"]');
            if (!script) {
                script = document.createElement("script");
                script.setAttribute("type", "application/ld+json");
                script.setAttribute("data-seo", "true");
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(structuredData);
        } else {
            // Remove if no structured data provided
            const script = document.querySelector('script[type="application/ld+json"][data-seo="true"]');
            if (script) {
                script.remove();
            }
        }
    }, [title, description, image, url, noIndex, structuredData]);
};
