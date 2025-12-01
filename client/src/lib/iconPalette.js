// src/lib/iconPalette.js
import {
    Globe,
    Camera,
    Video,
    Mail,
    Phone,
    User,
    ShoppingCart,
    Star,
    Heart,
    Github, // correct
    Youtube,
    Instagram,
    Facebook,
    Linkedin,
    Twitter,
    Slack,
    Wifi,
    Code,
    Music,
} from "lucide-react";

export const ICONS = [
    { slug: "globe", label: "Website", Comp: Globe, category: "General" },
    { slug: "mail", label: "Email", Comp: Mail, category: "General" },
    { slug: "phone", label: "Phone", Comp: Phone, category: "General" },
    { slug: "user", label: "Profile", Comp: User, category: "General" },
    { slug: "camera", label: "Camera", Comp: Camera, category: "Media" },
    { slug: "video", label: "Video", Comp: Video, category: "Media" },
    { slug: "music", label: "Music", Comp: Music, category: "Media" },
    { slug: "star", label: "Star", Comp: Star, category: "Misc" },
    { slug: "heart", label: "Heart", Comp: Heart, category: "Misc" },
    { slug: "code", label: "Code", Comp: Code, category: "Tech" },
    { slug: "github", label: "GitHub", Comp: Github, category: "Tech" }, // FIXED ✔
    {
        slug: "shopping",
        label: "Store",
        Comp: ShoppingCart,
        category: "Business",
    },
    // Social brand icons
    { slug: "youtube", label: "YouTube", Comp: Youtube, category: "Social" },
    {
        slug: "instagram",
        label: "Instagram",
        Comp: Instagram,
        category: "Social",
    },
    { slug: "facebook", label: "Facebook", Comp: Facebook, category: "Social" },
    { slug: "linkedin", label: "LinkedIn", Comp: Linkedin, category: "Social" },
    { slug: "twitter", label: "X/Twitter", Comp: Twitter, category: "Social" },
    { slug: "slack", label: "Slack", Comp: Slack, category: "Social" },
];

export const ICON_COLOR = {
    youtube: "text-red-500",
    instagram: "text-pink-400",
    facebook: "text-blue-600",
    linkedin: "text-blue-500",
    twitter: "text-slate-800",
    github: "text-gray-700",
    whatsapp: "text-green-500",
};
