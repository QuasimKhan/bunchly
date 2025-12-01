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

const LinkCardContainer = ({ children, dragging }) => {
    return (
        <div
            className={`
                relative w-full 
                rounded-2xl
                bg-white/10 dark:bg-white/5
                backdrop-blur-xl
                border border-white/15 dark:border-white/10
                shadow-lg shadow-black/5
                transition-all duration-200 ease-out

                ${dragging ? "scale-[1.015] shadow-2xl" : "hover:scale-[1.01]"}
                p-5 sm:p-6
            `}
        >
            {children}
        </div>
    );
};

export default LinkCardContainer;
