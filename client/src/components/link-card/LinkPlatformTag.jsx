// src/components/link-card/LinkPlatformTag.jsx
import React from "react";

const PLATFORM_STYLES = [
    {
        key: "youtube",
        match: /youtu(be)?\.com|youtu\.be/,
        label: "YouTube",
        color: "bg-red-500/25 text-red-300 border-red-500/30",
    },
    {
        key: "instagram",
        match: /instagram\.com/,
        label: "Instagram",
        color: "bg-pink-500/25 text-pink-300 border-pink-500/30",
    },
    {
        key: "facebook",
        match: /facebook\.com/,
        label: "Facebook",
        color: "bg-blue-500/25 text-blue-300 border-blue-500/30",
    },
    {
        key: "twitter",
        match: /twitter\.com|x\.com/,
        label: "Twitter/X",
        color: "bg-sky-500/25 text-sky-300 border-sky-500/30",
    },
    {
        key: "linkedin",
        match: /linkedin\.com/,
        label: "LinkedIn",
        color: "bg-blue-600/25 text-blue-400 border-blue-500/30",
    },
    {
        key: "github",
        match: /github\.com/,
        label: "Github",
        color: "bg-gray-500/25 text-gray-300 border-gray-500/30",
    },
    {
        key: "whatsapp",
        match: /wa\.me|whatsapp\.com/,
        label: "WhatsApp",
        color: "bg-green-500/25 text-green-300 border-green-500/30",
    },
    {
        key: "telegram",
        match: /t\.me|telegram\.org/,
        label: "Telegram",
        color: "bg-sky-400/25 text-sky-200 border-sky-400/30",
    },
    {
        key: "discord",
        match: /discord\.com|discord\.gg/,
        label: "Discord",
        color: "bg-indigo-500/25 text-indigo-200 border-indigo-500/30",
    },
    {
        key: "spotify",
        match: /spotify\.com/,
        label: "Spotify",
        color: "bg-green-500/30 text-green-300 border-green-500/30",
    },
    {
        key: "tiktok",
        match: /tiktok\.com/,
        label: "TikTok",
        color: "bg-pink-400/20 text-pink-200 border-pink-400/30",
    },
    {
        key: "pinterest",
        match: /pinterest\.com/,
        label: "Pinterest",
        color: "bg-red-400/25 text-red-200 border-red-400/30",
    },
    {
        key: "reddit",
        match: /reddit\.com/,
        label: "Reddit",
        color: "bg-orange-500/25 text-orange-300 border-orange-500/30",
    },
    {
        key: "medium",
        match: /medium\.com/,
        label: "Medium",
        color: "bg-emerald-400/25 text-emerald-200 border-emerald-400/30",
    },
    {
        key: "behance",
        match: /behance\.net/,
        label: "Behance",
        color: "bg-blue-500/25 text-blue-300 border-blue-500/30",
    },
    {
        key: "dribbble",
        match: /dribbble\.com/,
        label: "Dribbble",
        color: "bg-pink-400/30 text-pink-200 border-pink-400/30",
    },
    {
        key: "snapchat",
        match: /snapchat\.com/,
        label: "Snapchat",
        color: "bg-yellow-300/30 text-yellow-100 border-yellow-300/40",
    },
    {
        key: "threads",
        match: /threads\.net/,
        label: "Threads",
        color: "bg-white/10 text-gray-300 border-gray-300/20",
    },
    {
        key: "mail",
        match: /mailto:/,
        label: "Email",
        color: "bg-amber-400/25 text-amber-200 border-amber-400/30",
    },
];

const LinkPlatformTag = ({ url }) => {
    if (!url) return null;

    const found = PLATFORM_STYLES.find((p) => p.match.test(url.toLowerCase()));

    return (
        <div
            className={`
                text-[10px] sm:text-xs px-2 py-[3px] rounded-full 
                border backdrop-blur-sm font-medium tracking-wide 
                shadow-sm whitespace-nowrap select-none transition-all
                ${
                    found
                        ? found.color
                        : "bg-white/10 text-white/70 border-white/20"
                }
            `}
        >
            {found ? found.label : "Website"}
        </div>
    );
};

export default LinkPlatformTag;
