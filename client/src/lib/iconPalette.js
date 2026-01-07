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
    Github,
    Youtube,
    Instagram,
    Facebook,
    Linkedin,
    Twitter,
    Slack,
    Wifi,
    Code,
    Music,
    MapPin,
    Calendar,
    Clock,
    Briefcase,
    Home,
    MessageCircle,
    Send,
    Twitch,
    // Note: Lucide might not have brand icons like TikTok/Snapchat native, 
    // but we can use generic ones or check if they exist. 
    // Lucide v0.260+ added some. We'll stick to safe ones for now or use generic replacements.
    // Actually, Lucide doesn't have TikTok/Snapchat/WhatsApp usually. 
    // We will use generic icons for some or just the ones available.
    // Let's add available safe ones.
    Gamepad2,
    Headphones,
    Image,
    Link,
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
    { slug: "shopping", label: "Store", Comp: ShoppingCart, category: "Business" },
    { slug: "briefcase", label: "Work", Comp: Briefcase, category: "Business" },
    
    // Social brand icons
    { slug: "youtube", label: "YouTube", Comp: Youtube, category: "Social" },
    { slug: "instagram", label: "Instagram", Comp: Instagram, category: "Social" },
    { slug: "facebook", label: "Facebook", Comp: Facebook, category: "Social" },
    { slug: "linkedin", label: "LinkedIn", Comp: Linkedin, category: "Social" },
    { slug: "twitter", label: "X/Twitter", Comp: Twitter, category: "Social" },
    { slug: "slack", label: "Slack", Comp: Slack, category: "Social" },
    { slug: "twitch", label: "Twitch", Comp: Twitch, category: "Social" },
    { slug: "discord", label: "Discord", Comp: MessageCircle, category: "Social" }, // Fallback
    { slug: "telegram", label: "Telegram", Comp: Send, category: "Social" },

    // Misc
    { slug: "map", label: "Location", Comp: MapPin, category: "Misc" },
    { slug: "calendar", label: "Calendar", Comp: Calendar, category: "Misc" },
    { slug: "time", label: "Time", Comp: Clock, category: "Misc" },
    { slug: "home", label: "Home", Comp: Home, category: "Misc" },
    { slug: "game", label: "Gaming", Comp: Gamepad2, category: "Misc" },
    { slug: "audio", label: "Audio", Comp: Headphones, category: "Media" },
    { slug: "image", label: "Gallery", Comp: Image, category: "Media" },
    { slug: "link", label: "Link", Comp: Link, category: "General" },
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
