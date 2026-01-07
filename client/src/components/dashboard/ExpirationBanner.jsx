import React, { useState } from "react";
import { AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExpirationBanner = ({ daysRemaining, onClose }) => {
    const navigate = useNavigate();
    
    // User requested "cut options to close top slide bar" as well.
    // I will not render a close button (X).

    if (daysRemaining > 7) return null;

    const isUrgent = daysRemaining <= 3;

    return (
        <div className={`
            relative z-40 w-full px-4 py-3
            ${isUrgent 
                ? "bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 border-b border-red-500/20" 
                : "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border-b border-indigo-500/20"}
            backdrop-blur-md
        `}>
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isUrgent ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400" : "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"}`}>
                        {isUrgent ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Your Pro plan expires in {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                            Renew now to keep your premium features active.
                        </p>
                    </div>
                </div>

                <button 
                    onClick={() => navigate("/dashboard/billing")}
                    className={`
                        text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all
                        flex items-center gap-2
                        ${isUrgent 
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20" 
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"}
                    `}
                >
                    Renew Now <ArrowRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};

export default ExpirationBanner;
