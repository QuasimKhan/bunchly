import React from 'react';
import { Ban, ShieldAlert, ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const SuspendedAccount = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 dark:bg-black overflow-hidden relative">
            
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-red-500/5 rounded-full blur-[120px]" />
                 <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-orange-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center">
                
                {/* Icon Container */}
                <div className="relative mb-8 group">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700 opacity-50"></div>
                    <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-950/20 border border-red-200 dark:border-red-500/20 flex items-center justify-center shadow-2xl">
                        <ShieldAlert className="w-10 h-10 text-red-500 dark:text-red-400 drop-shadow-sm" />
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                    Account Suspended
                </h1>
                
                <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-8 leading-relaxed max-w-sm mx-auto">
                    This profile is currently unavailable due to a violation of our <Link to="/terms" className="text-neutral-900 dark:text-white underline decoration-neutral-300 dark:decoration-neutral-700 underline-offset-4 hover:decoration-red-500 transition-all">Terms of Service</Link> or <Link to="/guidelines" className="text-neutral-900 dark:text-white underline decoration-neutral-300 dark:decoration-neutral-700 underline-offset-4 hover:decoration-red-500 transition-all">Community Guidelines</Link>.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <Link 
                        to="/" 
                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        Go Home
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    
                    <a 
                        href="mailto:support@bunchly.in" 
                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Mail className="w-4 h-4" />
                        Contact Support
                    </a>
                </div>

                {/* Footer Note */}
                <p className="mt-12 text-sm text-neutral-400 dark:text-neutral-600 font-medium">
                    Error Code: 403_ACCOUNT_SUSPENDED
                </p>
            </div>
            
             {/* Simple Footer Brand */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <img src="/img/Bunchly-dark-logo.png" alt="Bunchly" className="h-6 dark:hidden" />
                <img src="/img/Bunchly-light-logo.png" alt="Bunchly" className="h-6 hidden dark:block" />
            </div>

        </div>
    );
};

export default SuspendedAccount;
