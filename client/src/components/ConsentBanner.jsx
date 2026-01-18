import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCookieConsent } from "../hooks/useCookieConsent";
import { Cookie } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ConsentBanner = () => {
    const { ready, needsConsent, acceptCookies, rejectCookies } = useCookieConsent();
    const location = useLocation();
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
        if (ready && needsConsent) {
            const timer = setTimeout(() => setVisible(true), 3000); // Slight delay for better UX
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [ready, needsConsent]);

    const handleAccept = () => {
        setVisible(false);
        setTimeout(acceptCookies, 300); // Wait for animation
    };

    const handleReject = () => {
        setVisible(false);
        setTimeout(rejectCookies, 300);
    };

    if (!ready || !needsConsent || location.pathname !== "/") return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-4 right-4 z-[100] flex justify-center pointer-events-none"
                >
                    <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl p-6 max-w-2xl w-full pointer-events-auto relative overflow-hidden group">
                        
                        {/* Decorative background gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            <div className="p-3.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0 shadow-sm">
                                <Cookie className="w-6 h-6" />
                            </div>

                            <div className="flex-1 space-y-2">
                                <h3 className="font-bold text-neutral-900 dark:text-white text-lg flex items-center gap-2">
                                    We value your privacy
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
                                    <Link to="/policy" className="ml-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer">
                                        Read Policy
                                    </Link>
                                </p>
                            </div>

                            <div className="flex flex-row sm:flex-col gap-3 shrink-0 w-full sm:w-auto">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 sm:w-32 py-2.5 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl cursor-pointer text-sm"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="flex-1 sm:w-32 py-2.5 px-4 bg-transparent border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer text-sm"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConsentBanner;
