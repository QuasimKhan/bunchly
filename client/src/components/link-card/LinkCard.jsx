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
 * ============================
 * Premium, fully modular card layout combining:
 * - Drag Handle
 * - Favicon
 * - Title + URL + Description
 * - Platform Tag
 * - Analytics sparkline
 * - Status Badge
 * - Actions (Edit/Delete/Toggle/Icon Picker)
 *
 * All UI logic is now separated into clean atomic components.
 */

const LinkCard = ({ link, onToggle, onEdit, onDelete, onOpenIconPicker }) => {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link.url);
            toast.success("URL Copied");
        } catch {}
    };

    return (
        <LinkCardContainer dragging={false}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                {/* Drag Handle + Favicon */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <LinkDragHandle />
                    <LinkFavicon url={link.url} />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Upper Row: Title/URL/Description + Platform Tag + Analytics */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        {/* Left Column: Title / URL / Description */}
                        <LinkInfo link={link} onCopy={handleCopy} />

                        {/* Right Column: Platform + Analytics */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                            <LinkPlatformTag url={link.url} />
                            <LinkAnalytics
                                clickCount={link.clickCount}
                                clicks={link.clicks}
                            />
                        </div>
                    </div>

                    {/* Bottom Row: Status Badge + Actions */}
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
