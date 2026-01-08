// src/components/link-card/LinkFavicon.jsx
import React, { useState } from "react";
import { ExternalLink } from "lucide-react";
import { ICONS, ICON_COLOR } from "../../lib/iconPalette";

const LinkFavicon = ({ url, icon, size = 32 }) => {
    // ⭐ PRIORITY 0 — Custom Icon (URL)
    const isCustomIcon = icon && (icon.startsWith("http") || icon.startsWith("data:"));

    if (isCustomIcon) {
        return (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 shadow-sm overflow-hidden">
                <img src={icon} alt="icon" className="w-full h-full object-cover" />
            </div>
        )
    }

    // ⭐ PRIORITY 1 — Icon Helper from Palette (slug)
    if (icon && icon.trim().length > 0) {
        const entry = ICONS.find((i) => i.slug === icon);
        if (entry) {
            const IconComp = entry.Comp;
            const color = ICON_COLOR[entry.slug] || "";
            return (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 shadow-sm">
                    <IconComp className={`w-5 h-5 ${color}`} />
                </div>
            );
        }
    }

    // ⭐ PRIORITY 1.5 - Bunchly Icon (Internal)
    // Supports bunchly.io, bunchly.in, bunchly.in, localhost
    const isBunchly = url && (
        url.includes("bunchly.io") || 
        url.includes("bunchly.in") || 
        url.includes("bunchly.in") || 
        url.includes("localhost")
    );
    
    if (isBunchly && !icon) {
        return (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none text-white overflow-hidden p-1.5">
                 {/* Use a simple svg or text if image not available, but user likely has logo.png */}
                 <img src="/logo.png" alt="B" className="w-full h-full object-contain invert brightness-0" onError={(e) => e.target.style.display='none'} />
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
