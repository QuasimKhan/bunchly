import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Shield, FileText, RefreshCw, ChevronRight, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Policy = () => {
    const [activeTab, setActiveTab] = useState("privacy");

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-[#0A0A0A] selection:bg-indigo-500/30">
            <Navbar />
            
            <main className="pt-32 pb-20 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200/50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-4">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Trust Center</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            Legal & Policies
                        </h1>
                        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
                            Transparent terms for a trusted relationship.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-white dark:bg-neutral-900 p-1.5 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 inline-flex">
                            <TabButton 
                                isActive={activeTab === "privacy"} 
                                onClick={() => setActiveTab("privacy")} 
                                icon={Lock}
                                label="Privacy Policy" 
                            />
                            <TabButton 
                                isActive={activeTab === "refund"} 
                                onClick={() => setActiveTab("refund")} 
                                icon={RefreshCw}
                                label="Refund Policy" 
                            />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 md:p-12 shadow-xl shadow-black/5 relative overflow-hidden min-h-[600px]">
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <AnimatePresence mode="wait">
                            {activeTab === "privacy" ? (
                                <motion.div
                                    key="privacy"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-10"
                                >
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                                        Privacy Policy
                                        <span className="text-xs font-normal text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">Last updated: {new Date().toLocaleDateString()}</span>
                                    </h2>

                                    <Section title="1. Introduction">
                                        <p>Bunchly ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect your data when you use our platform.</p>
                                    </Section>

                                    <Section title="2. Information We Collect">
                                        <ul className="list-disc pl-5 space-y-2 marker:text-indigo-500">
                                            <li><strong>Account Information:</strong> Name, email, username, profile image, bio.</li>
                                            <li><strong>Authentication Data:</strong> Login method (email/password or Google OAuth).</li>
                                            <li><strong>Usage Data:</strong> Page views, clicks, patterns of interaction.</li>
                                        </ul>
                                    </Section>

                                    <Section title="3. How We Use Data">
                                        <p>We use your information to provide functionality, process payments via secure third parties, improve performance, and prevent fraud.</p>
                                    </Section>

                                    <Section title="4. Cookies">
                                        <p>We use essential cookies for site operation and optional cookies for analytics. You can control these settings via our cookie consent manager at any time.</p>
                                    </Section>
                                    
                                    <Section title="5. Contact">
                                        <p>Questions? Click - <a href="mailto:bunchly.contact@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Email</a></p>
                                    </Section>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="refund"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-10"
                                >
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                                        Refund Policy
                                        <span className="text-xs font-normal text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">Last updated: {new Date().toLocaleDateString()}</span>
                                    </h2>

                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl text-amber-800 dark:text-amber-200 text-sm leading-relaxed mb-8">
                                        <strong>Note:</strong> We prioritize customer satisfaction. If you are unhappy with Bunchly Pro, please contact us or request a refund directly from your dashboard.
                                    </div>

                                    <Section title="1. 3-Day Money-Back Guarantee">
                                        <p>We offer a full refund within <strong>3 days</strong> of your purchase of the <strong>$49/month Pro plan</strong>. If you are not satisfied, you can request a cancellation and refund directly from your billing dashboard.</p>
                                    </Section>

                                    <Section title="2. Refund Eligibility">
                                        <p>Refunds are only available for the initial purchase of a subscription cycle and must be requested within the 3-day window. Requests made after 3 days will not be processed, but you can still cancel to prevent future renewals.</p>
                                    </Section>

                                    <Section title="3. How to Request">
                                        <p>Go to <strong className="text-neutral-900 dark:text-white">Dashboard &gt; Billing &gt; Request Refund</strong>. The system will automatically check your eligibility based on the 3-day window.</p>
                                    </Section>

                                    <Section title="4. Cancellations">
                                        <p>Canceling your subscription stops the auto-renewal. You will retain access to Pro features until the end of your prepaid period.</p>
                                    </Section>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

const TabButton = ({ isActive, onClick, label, icon: Icon }) => (
    <button
        onClick={onClick}
        className={`
            relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer
            ${isActive 
                ? "text-neutral-900 dark:text-white shadow-sm" 
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }
        `}
    >
        {isActive && (
            <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200/50 dark:border-neutral-700 pointer-events-none"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        )}
        <span className="relative z-10 flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {label}
        </span>
    </button>
);

const Section = ({ title, children }) => (
    <section className="space-y-3">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
            {title}
        </h3>
        <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed pl-3.5 border-l border-neutral-200 dark:border-neutral-800">
            {children}
        </div>
    </section>
);

export default Policy;
