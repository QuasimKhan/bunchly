// src/components/link-card/LinkInfo.jsx
import React from "react";
import Button from "../ui/Button";
import { Copy, ExternalLink } from "lucide-react";

/**
 * LinkInfo
 * -------------------
 * Displays:
 *  - Title
 *  - URL
 *  - Description (optional)
 *  - Copy button
 *  - External URL button
 *
 * Fully responsive, premium styling, and future-proof.
 */

const LinkInfo = ({ link, onCopy }) => {
    return (
        <div className="min-w-0 flex flex-col gap-1.5">
            {/* Title */}
            <h3
                className="
                    text-base sm:text-lg font-semibold text-white/90 
                    truncate leading-tight
                "
            >
                {link.title}
            </h3>

            {/* URL + Description + Actions */}
            <div
                className="
                    flex items-center flex-wrap gap-2 
                    text-xs sm:text-sm text-gray-400
                    overflow-hidden
                "
            >
                {/* URL + description stacked */}
                <div className="flex flex-col overflow-hidden max-w-[68vw] sm:max-w-none">
                    {/* URL */}
                    <span
                        className="
                            truncate break-all 
                            text-gray-200/90 
                            hover:text-white transition-colors
                        "
                    >
                        {link.url}
                    </span>

                    {/* Description (optional) */}
                    {link.description && (
                        <span
                            className="
                                text-gray-400/90 
                                text-[11px] sm:text-xs
                                break-words leading-snug
                                mt-[1px]
                            "
                        >
                            {link.description}
                        </span>
                    )}
                </div>

                {/* Copy button */}
                <Button
                    icon={Copy}
                    size="sm"
                    variant="ghost"
                    className="rounded-md hover:bg-white/10 p-1.5"
                    onClick={onCopy}
                />

                {/* Open external link */}
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        p-1.5 sm:p-2 rounded-md 
                        hover:bg-white/10 transition 
                        text-gray-300
                    "
                >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                </a>
            </div>
        </div>
    );
};

export default LinkInfo;
