import { 
    LayoutDashboard, 
    Users, 
    Banknote, 
    DollarSign, 
    RotateCcw, 
    Tag, 
    Megaphone, 
    MessageSquarePlus, 
    Flag, 
    LineChart 
} from "lucide-react";

export const adminNavItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Revenue", href: "/admin/revenue", icon: Banknote },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Payments", href: "/admin/payments", icon: DollarSign },
    { label: "Refunds", href: "/admin/refunds", icon: RotateCcw },
    { label: "Coupons", href: "/admin/coupons", icon: Tag },
    { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
    { label: "Feedback", href: "/admin/feedback", icon: MessageSquarePlus },
    { label: "Reports", href: "/admin/reports", icon: Flag },
    { label: "Analytics", href: "/admin/analytics", icon: LineChart },
];
