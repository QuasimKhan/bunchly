import {
    LayoutDashboard,
    Link as LinkIcon,
    Brush,
    BarChart2,
    Settings,
} from "lucide-react";

export const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Links",
        href: "/links",
        icon: LinkIcon,
    },
    {
        label: "Appearance",
        href: "/appearance",
        icon: Brush,
    },
    {
        label: "Analytics",
        href: "/analytics",
        icon: BarChart2,
    },
    {
        label: "Settings",
        href: "/settings",
        icon: Settings,
    },
];
