// src/components/link-card/LinkStatusBadge.jsx
import React from "react";

/**
 * Premium Status Badge
 * -------------------------
 * - Active = soft green glow + clarity
 * - Hidden = subtle neutral tone
 * - Subtle transitions for state changes
 */

const LinkStatusBadge = ({ isActive }) => {
    const activeClasses = `
        bg-green-500/20 
        text-green-300 
        border border-green-400/30 
        shadow-[0_0_6px_rgba(34,197,94,0.25)] 
    `;

    const inactiveClasses = `
        bg-gray-600/20 
        text-gray-300 
        border border-gray-500/30 
    `;

    return (
        <span
            className={`
                px-2.5 py-0.5 
                text-[10px] sm:text-xs 
                rounded-full 
                font-medium tracking-wide 
                backdrop-blur-sm 
                transition-all duration-200 ease-out
                select-none
                ${isActive ? activeClasses : inactiveClasses}
            `}
        >
            {isActive ? "Active" : "Hidden"}
        </span>
    );
};

export default LinkStatusBadge;
