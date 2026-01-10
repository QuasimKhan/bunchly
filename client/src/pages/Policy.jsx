import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Shield, Lock, RefreshCw, FileText, Mail, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Policy = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("privacy");

    useEffect(() => {
        const path = location.pathname;
        if (path === "/terms") setActiveTab("terms");
        else if (path === "/refund-policy") setActiveTab("refund");
        else setActiveTab("privacy");
    }, [location]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === "terms") navigate("/terms");
        else if (tab === "refund") navigate("/refund-policy");
        else navigate("/privacy");
    };

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
                            Legal & Compliance
                        </h1>
                        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
                            Transparent terms for a trusted relationship.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        <div className="bg-white dark:bg-neutral-900 p-1.5 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 inline-flex flex-wrap justify-center">
                            <TabButton 
                                isActive={activeTab === "privacy"} 
                                onClick={() => handleTabChange("privacy")} 
                                icon={Lock}
                                label="Privacy Policy" 
                            />
                            <TabButton 
                                isActive={activeTab === "terms"} 
                                onClick={() => handleTabChange("terms")} 
                                icon={FileText}
                                label="Terms & Conditions" 
                            />
                            <TabButton 
                                isActive={activeTab === "refund"} 
                                onClick={() => handleTabChange("refund")} 
                                icon={RefreshCw}
                                label="Cancellation & Refund" 
                            />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 md:p-12 shadow-xl shadow-black/5 relative overflow-hidden min-h-[600px]">
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <AnimatePresence mode="wait">
                            {activeTab === "privacy" && <PrivacyContent key="privacy" />}
                            {activeTab === "terms" && <TermsContent key="terms" />}
                            {activeTab === "refund" && <RefundContent key="refund" />}
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
            relative px-4 sm:px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer
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
        <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed pl-3.5 border-l border-neutral-200 dark:border-neutral-800 text-sm sm:text-base">
            {children}
        </div>
    </section>
);

/* ================= CONTENT COMPONENTS ================= */

const PrivacyContent = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-10"
    >
        <Header title="Privacy Policy" updated={new Date().toLocaleDateString()} />

        <Section title="1. Introduction">
            <p>Bunchly ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect your data when you use our platform.</p>
        </Section>

        <Section title="2. Information We Collect">
            <ul className="list-disc pl-5 space-y-2 marker:text-indigo-500">
                <li><strong>Account Information:</strong> Name, email, username, profile image, bio.</li>
                <li><strong>Authentication Data:</strong> Login method (email/password or Google OAuth).</li>
                <li><strong>Payment Data:</strong> Subscription status and transaction IDs (we do not store raw card details).</li>
                <li><strong>Usage Data:</strong> Page views, clicks, and interaction patterns securely logged for analytics.</li>
            </ul>
        </Section>

        <Section title="3. How We Use Data">
            <p>We use your information to provide core functionality, process secured payments via Razorpay, improve platform performance, and prevent fraudulent activity.</p>
        </Section>

        <Section title="4. Cookies & Tracking">
            <p>We use essential cookies for site operation and optional cookies for analytics. You can manage your preferences via our cookie consent manager functionality.</p>
        </Section>
        
        <Section title="5. Contact Us">
            <p>For any privacy concerns, please contact our Data Protection Officer at <a href="mailto:bunchly.contact@gmail.com" className="text-indigo-600 hover:underline">Email</a>.</p>
        </Section>
    </motion.div>
);

const TermsContent = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-10"
    >
        <Header title="Terms & Conditions" updated={new Date().toLocaleDateString()} />

        <Section title="1. Agreement to Terms">
            <p>By accessing or using Bunchly, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the service.</p>
        </Section>

        <Section title="2. Service Description">
            <p>Bunchly is a link-in-bio platform allowing users to create personalized pages. We reserve the right to modify, suspend, or discontinue the service at any time.</p>
        </Section>

        <Section title="3. User Accounts">
            <p>You are responsible for safeguarding your account credentials. You must notify us immediately of any unauthorized use of your account.</p>
        </Section>

        <Section title="4. Acceptable Use">
            <p>You agree not to misuse the platform. Prohibited activities include hosting illegal content, phishing, malware distribution, or violating intellectual property rights.</p>
        </Section>

        <Section title="5. Subscription & Payments">
            <p>Pro features are billed on a subscription basis. You agree to pay all fees associated with your chosen plan. Payments are processed securely via our payment partners.</p>
        </Section>

        <Section title="6. Termination">
            <p>We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.</p>
        </Section>

        <Section title="7. Limitation of Liability">
            <p>In no event shall Bunchly be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
        </Section>
    </motion.div>
);

const RefundContent = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-10"
    >
        <Header title="Cancellation & Refund Policy" updated={new Date().toLocaleDateString()} />

        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl text-amber-800 dark:text-amber-200 text-sm leading-relaxed mb-8">
            <strong>Commitment to Satisfaction:</strong> We strive to provide the best link-in-bio experience. If you are not satisfied, please review our refund policies below.
        </div>

        <Section title="1. Cancellation Policy">
            <p>You may cancel your Bunchly Pro subscription at any time via your dashboard (Settings &gt; Billing). Upon cancellation, your subscription will remain active until the end of the current billing cycle. You will not be charged again after cancellation.</p>
        </Section>

        <Section title="2. 3-Day Money-Back Guarantee">
            <p>We offer a full refund for new Pro subscriptions if requested within <strong>3 days</strong> of the initial purchase. This allows you to test our premium features risk-free.</p>
        </Section>

        <Section title="3. Refund Process">
            <p>To request a refund, navigate to your <strong>Billing Dashboard</strong> and click "Request Refund" within the eligible window. Our system checks eligibility automatically. If approved, funds are typically returned to the original payment method within 5-7 business days.</p>
        </Section>

        <Section title="4. Exceptions">
            <p>Refunds are not provided for partial months of service after the 3-day window has passed. Renewals are non-refundable unless a cancellation request was submitted prior to the renewal date but failed due to technical error.</p>
        </Section>

         <Section title="5. Contact for Billing Issues">
            <p>If you encounter any issues with billing, cancellations, or refunds, please reach out to our support team at <strong className="text-neutral-900 dark:text-white">bunchly.contact@gmail.com</strong>.</p>
        </Section>
    </motion.div>
);

const Header = ({ title, updated }) => (
    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex flex-col sm:flex-row sm:items-center gap-3">
        {title}
        <span className="w-fit text-xs font-normal text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">Last updated: {updated}</span>
    </h2>
);

export default Policy;

