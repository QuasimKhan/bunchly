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

export const useSEO = ({ title, description, image = "/img/og-image.png" }) => {
    useEffect(() => {
        document.title = title;

        setMeta("description", description);
        setMeta("og:title", title, "property");
        setMeta("og:description", description, "property");
        setMeta("og:image", image, "property");
        setMeta("og:type", "website", "property");
    }, [title, description, image]);
};
