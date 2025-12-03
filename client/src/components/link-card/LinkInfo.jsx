// src/components/link-card/LinkInfo.jsx
import React from "react";
import Button from "../ui/Button";
import { Copy, ExternalLink } from "lucide-react";

/**
 * LinkInfo (Enhanced UI Version)
 * -----------------------------------------------------------------
 * Clean, modern, industry-level component for displaying link details.
 * - Responsive, crisp layout
 * - Mobile title auto-truncates at 20 chars
 * - Smooth UX in light + dark themes
 */

const truncateForMobile = (text, max = 20) => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
        return text.length > max ? text.slice(0, max) + "…" : text;
    }
    return text;
};

const LinkInfo = ({ link, onCopy }) => {
    return (
        <div className="min-w-0 flex flex-col gap-2">
            {/* Title */}
            <h3
                className="
                    text-base sm:text-lg font-semibold
                    text-gray-900 dark:text-white
                    leading-tight
                    truncate sm:overflow-visible sm:whitespace-normal
                "
            >
                {truncateForMobile(link.title)}
            </h3>

            {/* URL + Desc + Actions Row */}
            <div
                className="
                    flex items-start justify-between gap-3
                    text-xs sm:text-sm
                "
            >
                {/* URL + Description */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    {/* URL */}
                    <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            truncate break-all
                            font-medium
                            text-gray-700 dark:text-gray-300
                            hover:text-indigo-600 dark:hover:text-indigo-400
                            transition-colors
                        "
                    >
                        {link.url}
                    </a>

                    {/* Description */}
                    {link.description && (
                        <p
                            className="
                                text-[11px] sm:text-xs
                                text-gray-600 dark:text-gray-400
                                leading-snug
                                break-words
                                opacity-90
                            "
                        >
                            {link.description}
                        </p>
                    )}
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-1.5 shrink-0">
                    {/* Copy Button */}
                    <Button
                        icon={Copy}
                        size="sm"
                        variant="ghost"
                        className="
                            p-1.5 rounded-md
                            text-gray-700 dark:text-gray-300
                            hover:bg-gray-200/60 dark:hover:bg-white/10
                            transition
                        "
                        onClick={onCopy}
                    />

                    {/* Open Link Button */}
                    <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            p-1.5 rounded-md
                            text-gray-700 dark:text-gray-300
                            hover:bg-gray-200/60 dark:hover:bg-white/10
                            transition
                        "
                    >
                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LinkInfo;
