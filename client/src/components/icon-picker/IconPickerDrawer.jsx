// src/components/link-card/LinkFavicon.jsx
import React, { useState } from "react";
import { ExternalLink } from "lucide-react";
import { ICONS, ICON_COLOR } from "../../lib/iconPalette"; // adjust path if needed

const isLikelyEmoji = (str) => {
    if (!str) return false;
    // quick heuristic: short (1-3 chars) and contains non-alphanumeric OR surrogate pair
    return (
        str.length <= 3 && /[^\w\s]/u.test(str) // contains symbol-like char (emoji usually)
    );
};

const LinkFavicon = ({ url, icon, size = 32 }) => {
    // 1) If icon is a known slug from ICONS -> render that icon component
    if (icon && icon.trim().length > 0) {
        const entry = ICONS.find((i) => i.slug === icon);
        if (entry) {
            const IconComp = entry.Comp;
            const colorClass = ICON_COLOR[entry.slug] || "";
            // render Brand icon
            return (
                <div
                    className="
                        w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center
                        bg-white/6 dark:bg-white/12
                        border border-white/12 dark:border-white/18
                        shadow-sm
                    "
                >
                    <IconComp className={`w-5 h-5 ${colorClass}`} />
                </div>
            );
        }

        // 2) If icon looks like emoji / custom text → render as text (emoji)
        if (isLikelyEmoji(icon)) {
            return (
                <div
                    className="
                        w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center 
                        bg-white/10 dark:bg-white/15 
                        border border-white/15 dark:border-white/20
                        shadow-sm text-lg select-none
                    "
                >
                    <span className="leading-none">{icon}</span>
                </div>
            );
        }

        // 3) If it's a raw class / URL / unknown string, try to show it as text as last resort
        return (
            <div
                className="
                    w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center 
                    bg-white/10 dark:bg-white/15 
                    border border-white/15 dark:border-white/20
                    shadow-sm text-sm select-none px-1
                "
            >
                <span className="truncate">{icon}</span>
            </div>
        );
    }

    // 4) Fallback: favicon from url (existing behavior)
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
                w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center overflow-hidden
                bg-white/5 dark:bg-white/10 
                border border-white/10 backdrop-blur-md
                shadow-inner transition-all duration-200
            "
        >
            {!loaded && !failed && (
                <div className="w-4 h-4 rounded-full animate-pulse bg-white/30" />
            )}

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

            {failed && (
                <ExternalLink className="w-4 h-4 text-gray-300 opacity-80" />
            )}
        </div>
    );
};

export default LinkFavicon;
