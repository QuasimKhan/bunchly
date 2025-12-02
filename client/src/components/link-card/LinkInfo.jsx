// src/components/link-card/LinkInfo.jsx
import React from "react";
import Button from "../ui/Button";
import { Copy, ExternalLink } from "lucide-react";

/**
 * LinkInfo
 * -----------------------------------------
 * Shows title, URL, description + copy/open actions
 * Now fully light-mode safe and cleaner visually.
 */

const LinkInfo = ({ link, onCopy }) => {
    return (
        <div className="min-w-0 flex flex-col gap-1.5">
            {/* Title */}
            <h3
                className="
                    text-base sm:text-lg font-semibold
                    text-gray-900 dark:text-white
                    truncate leading-tight
                "
            >
                {link.title}
            </h3>

            {/* URL + Description + Buttons */}
            <div
                className="
                    flex items-center flex-wrap gap-2
                    text-xs sm:text-sm
                    text-gray-600 dark:text-gray-400
                    overflow-hidden
                "
            >
                {/* URL + Description container */}
                <div className="flex flex-col overflow-hidden max-w-[68vw] sm:max-w-none">
                    {/* URL */}
                    <span
                        className="
                            truncate break-all
                            text-gray-800 dark:text-gray-200
                            hover:text-indigo-600 dark:hover:text-white
                            transition-colors
                        "
                    >
                        {link.url}
                    </span>

                    {/* Description */}
                    {link.description && (
                        <span
                            className="
                                text-gray-600 dark:text-gray-400
                                text-[11px] sm:text-xs
                                break-words leading-snug
                                mt-[1px]
                            "
                        >
                            {link.description}
                        </span>
                    )}
                </div>

                {/* Copy Button */}
                <Button
                    icon={Copy}
                    size="sm"
                    variant="ghost"
                    className="
                        rounded-md p-1.5
                        text-gray-700 dark:text-gray-300
                        hover:bg-gray-200/50 dark:hover:bg-white/10
                    "
                    onClick={onCopy}
                />

                {/* Open Link Button */}
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        p-1.5 sm:p-2 rounded-md 
                        text-gray-700 dark:text-gray-300
                        hover:bg-gray-200/50 dark:hover:bg-white/10
                        transition
                    "
                >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                </a>
            </div>
        </div>
    );
};

export default LinkInfo;
