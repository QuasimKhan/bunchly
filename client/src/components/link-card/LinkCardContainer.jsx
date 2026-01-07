// src/components/link-card/LinkCardContainer.jsx
import React from "react";

/**
 * LinkCardContainer
 * ------------------
 * Provides the visual shell around each link card:
 * - Glassmorphism background
 * - Smooth hover + drag animation
 * - Subtle shadows for premium look
 * - Responsive padding adjustments
 * - Clean motion transitions
 */

const LinkCardContainer = ({ children, dragging, className = "" }) => {
    return (
        <div
            className={`
                relative w-full 
                rounded-2xl
                bg-white dark:bg-neutral-900
                border border-neutral-200 dark:border-neutral-800
                shadow-sm hover:shadow-md
                transition-all duration-300 ease-out
                group

                ${dragging ? "scale-[1.015] shadow-xl z-10 border-indigo-500/30 ring-4 ring-indigo-500/10" : "hover:border-indigo-300 dark:hover:border-neutral-700"}
                
                /* Gradient Overlay on Hover */
                before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/0 before:to-white/50 dark:before:to-white/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none

                p-4 sm:p-5
                ${className}
            `}
        >
            {children}
        </div>
    );
};

export default LinkCardContainer;
