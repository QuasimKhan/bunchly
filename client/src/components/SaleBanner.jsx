import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const SaleBanner = ({ className = "", onStatusChange }) => {
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

    // Notify parent about visibility status
    useEffect(() => {
        const isVisible = !!(settings?.saleActive && visible && user?.plan !== "pro");
        if (onStatusChange) {
            onStatusChange(isVisible);
        }
    }, [settings, visible, user, onStatusChange]);

    if (!settings?.saleActive || !visible || user?.plan === "pro") return null;

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
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`relative z-[100] overflow-hidden w-full ${className}`}
                style={{
                    background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
                }}
            >
                <div className="absolute top-0 right-0 w-full h-full bg-white opacity-5 mix-blend-overlay pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-3 py-2 sm:px-4 sm:py-3 flex flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium relative z-10 text-white">
                     
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                         <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse shrink-0" />
                        <span className="font-semibold tracking-wide truncate max-w-[120px] sm:max-w-none">{settings.saleBannerText}</span>
                        
                        {settings.saleDiscount > 0 && (
                             <span className="bg-white text-indigo-700 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-sm whitespace-nowrap shrink-0">
                                {settings.saleDiscount}% OFF
                            </span>
                        )}
                    </div>

                    <Link 
                        to={linkTarget} 
                        onClick={() => setVisible(false)}
                        className="inline-flex items-center gap-1 text-white hover:text-indigo-100 font-bold border-b border-white/30 hover:border-white transition-all cursor-pointer whitespace-nowrap shrink-0"
                    >
                        Claim <span className="hidden sm:inline">Offer</span> <span className="opacity-70">→</span>
                    </Link>
                    
                    {/* Spacer for close button to prevent overlap */}
                    <div className="w-6 sm:w-0"></div>

                    <button 
                        onClick={() => setVisible(false)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                        aria-label="Close banner"
                    >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SaleBanner;
