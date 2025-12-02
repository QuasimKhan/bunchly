// src/components/link-card/LinkFavicon.jsx
import React, { useState } from "react";
import { ExternalLink } from "lucide-react";

const LinkFavicon = ({ url, icon, size = 32 }) => {
    // ⭐ PRIORITY 1 — Custom Icon from DB
    if (icon && icon.trim().length > 0) {
        return (
            <div
                className="
                    w-8 h-8 sm:w-9 sm:h-9 
                    rounded-lg flex items-center justify-center
                    bg-gray-100 dark:bg-white/10
                    border border-gray-300 dark:border-white/20
                    text-gray-700 dark:text-white 
                    shadow-sm
                    text-base select-none
                "
            >
                {icon}
            </div>
        );
    }

    // ⭐ PRIORITY 2 — Favicon from URL
    if (!url) return null;

    let hostname;
    try {
        hostname = new URL(url).hostname;
    } catch {
        hostname = null;
    }

    const src = hostname
        ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`
        : null;

    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    return (
        <div
            className="
                w-8 h-8 sm:w-9 sm:h-9
                flex items-center justify-center 
                rounded-lg overflow-hidden
                bg-gray-100 dark:bg-white/10
                border border-gray-300 dark:border-white/15
                shadow-sm backdrop-blur-sm
                transition-all duration-200
            "
        >
            {/* Skeleton Loader */}
            {!loaded && !failed && (
                <div className="w-4 h-4 rounded-full animate-pulse bg-gray-300 dark:bg-white/30" />
            )}

            {/* Favicon */}
            {!failed && src && (
                <img
                    src={src}
                    alt="favicon"
                    className={`
                        w-5 h-5 sm:w-6 sm:h-6 object-contain
                        transition-opacity duration-200
                        ${loaded ? "opacity-100" : "opacity-0"}
                    `}
                    onLoad={() => setLoaded(true)}
                    onError={() => setFailed(true)}
                />
            )}

            {/* ❌ Final fallback */}
            {failed && (
                <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-300" />
            )}
        </div>
    );
};

export default LinkFavicon;
