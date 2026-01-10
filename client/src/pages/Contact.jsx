import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, MapPin, MessageSquare, ArrowRight, Send } from "lucide-react";
import Button from "../components/ui/Button";

const Contact = () => {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-[#0A0A0A] selection:bg-indigo-500/30">
            <Navbar />
            
            <main className="pt-32 pb-20 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200/50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-4">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Support</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            Get in Touch
                        </h1>
                        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
                            We are here to help. Reach out to us for any questions, support, or feedback.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Card 1: Email */}
                        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-xl shadow-black/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all group-hover:bg-indigo-500/10"></div>
                            
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                                    <Mail className="w-6 h-6" />
                                </div>
                                
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Email Support</h3>
                                <p className="text-neutral-500 dark:text-neutral-400 mb-8 flex-1">
                                    For general inquiries, billing support, or partnership opportunities. We typically respond within 24 hours.
                                </p>

                                <a href="mailto:bunchly.contact@gmail.com" className="w-full">
                                    <Button 
                                        text="Send Email" 
                                        icon={ArrowRight} 
                                        fullWidth
                                        className="justify-center py-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-neutral-900 dark:text-neutral-100" 
                                    />
                                </a>
                            </div>
                        </div>

                        {/* Contact Card 2: Office (Requirement for Payment Compliance) */}
                        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-xl shadow-black/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all group-hover:bg-purple-500/10"></div>
                            
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Registered Office</h3>
                                <p className="text-neutral-500 dark:text-neutral-400 mb-8 flex-1">
                                    Visit us at our registered business address. (Please schedule an appointment via email first).
                                </p>
                                
                                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 text-sm text-neutral-600 dark:text-neutral-300 font-medium">
                                    Street No.1, Gaffar Manzil,<br/>
                                    Jamia Nagar, Okhla<br/>
                                    New Delhi, India 110025
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ / Direct Help */}
                    <div className="mt-12 text-center">
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                            Need immediate help? Check our <a href="/policy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Support Policies</a> or email us directly at <span className="text-neutral-900 dark:text-white font-medium select-all"><a href="mailto:bunchly.contact@gmail.com" className="text-indigo-600 hover:underline">Email</a></span>
                        </p>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
