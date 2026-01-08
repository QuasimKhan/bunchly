import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const SaleBanner = ({ className = "" }) => {
    const { user } = useAuth();
    const [settings, setSettings] = useState(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get("/api/settings");
                if (res.data.success) {
                    setSettings(res.data.settings);
                }
            } catch (err) {
                console.error("Failed to fetch settings", err);
            }
        };
        fetchSettings();
    }, []);

    if (!settings?.saleActive || !visible) return null;

    // Smart Link Logic
    let linkTarget = settings.saleBannerLink || "/dashboard/checkout";
    
    // If user is NOT logged in and the link goes to a dashboard/protected route
    // We want to send them to signup first, then redirect
    if (!user && linkTarget.startsWith("/dashboard")) {
        linkTarget = `/signup?redirect=${encodeURIComponent(linkTarget)}&apply_offer=true`;
    } else if (user && linkTarget.startsWith("/dashboard")) {
        // If user IS logged in, ensure we pass the offer param
        const separator = linkTarget.includes('?') ? '&' : '?';
        linkTarget = `${linkTarget}${separator}apply_offer=true`;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`bg-indigo-600 text-white relative z-50 overflow-hidden ${className}`}
            >
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2 flex-1 justify-center md:justify-start">
                        <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                        <span>{settings.saleBannerText}</span>
                        {settings.saleDiscount > 0 && (
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                                -{settings.saleDiscount}% OFF
                            </span>
                        )}
                        <Link 
                            to={linkTarget} 
                            onClick={() => setVisible(false)}
                            className="ml-2 underline hover:text-indigo-100 decoration-indigo-300 underline-offset-4 cursor-pointer"
                        >
                            Claim Offer →
                        </Link>
                    </div>
                    
                    <button 
                        onClick={() => setVisible(false)}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors hidden md:block cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SaleBanner;
