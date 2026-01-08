// src/components/link-card/LinkCard.jsx
import React from "react";

import LinkCardContainer from "./LinkCardContainer";
import LinkDragHandle from "./LinkDragHandle";
import LinkFavicon from "./LinkFavicon";
import LinkInfo from "./LinkInfo";
import LinkPlatformTag from "./LinkPlatformTag";
import LinkAnalytics from "./LinkAnalytics";
import LinkActions from "./LinkActions";
import LinkStatusBadge from "./LinkStatusBadge";
import { toast } from "sonner";

/**
 * LinkCard
 * ---------------------------------------------
 * Clean, modular, premium Link Card for Link Management UI.
 * Works perfectly in both Light and Dark themes.
 */

const LinkCard = ({ link, onToggle, onEdit, onDelete, onOpenIconPicker, ...props }) => {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link.url);
            toast.success("URL Copied");
        } catch {}
    };

    return (
        <LinkCardContainer dragging={props.dragging} className={props.className}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
                {/* Drag Handle + Icon/Favicon */}
                <div className="flex items-center gap-3 shrink-0">
                    <LinkDragHandle />
                    
                    {/* Collection Icon */}
                    {link.type === "collection" ? (
                        <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-lg text-indigo-500 border border-indigo-100 dark:border-indigo-500/30">
                            📂
                        </div>
                    ) : (
                        <LinkFavicon url={link.url} icon={link.icon} size={36} />
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Top Section */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        {/* Title, URL, Description */}
                        <div>
                             <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm flex items-center gap-2 leading-tight">
                                {link.title}
                                {link.type === "collection" && (
                                    <span className="text-[10px] uppercase tracking-wider font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-lg text-neutral-500 border border-neutral-200 dark:border-neutral-700">
                                        Group
                                    </span>
                                )}
                            </h3>
                            {link.type !== "collection" && (
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm font-medium text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 truncate block max-w-[200px] sm:max-w-xs transition-colors mt-0.5"
                                >
                                    {link.url.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                        </div>

                        {/* Platform Tag + Analytics */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                            {!link.icon && link.type !== "collection" && <LinkPlatformTag url={link.url} />}

                            <LinkAnalytics
                                clickCount={link.clickCount}
                                clicks={link.clicks}
                            />
                        </div>
                    </div>

                    {/* Collection Actions */}
                    {link.type === "collection" && (
                        <div className="mt-4 border-t border-neutral-100 dark:border-neutral-800 pt-3 flex items-center justify-between">
                             <span className="text-xs text-neutral-500">
                                {props.childrenCount || 0} items inside
                             </span>
                             <button 
                                onClick={() => props.onAddChild && props.onAddChild(link._id)}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-500 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                             >
                                + Add Link
                             </button>
                        </div>
                    )}

                    {/* Bottom Section */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                        <LinkStatusBadge isActive={link.isActive} />

                        <LinkActions
                            link={link}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggle={onToggle}
                            onOpenIconPicker={onOpenIconPicker}
                        />
                    </div>
                </div>
            </div>
        </LinkCardContainer>
    );
};

export default LinkCard;
