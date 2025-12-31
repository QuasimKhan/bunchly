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
        href: "/dashboard/links",
        icon: LinkIcon,
    },
    {
        label: "Appearance",
        href: "/dashboard/appearance",
        icon: Brush,
    },
    {
        label: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart2,
    },
    {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];
