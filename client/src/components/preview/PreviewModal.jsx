import React, { useEffect, useState } from "react";
import { ICONS } from "../../lib/iconPalette";
import Button from "../ui/Button";
import { ExternalLink, Smartphone, Monitor, X } from "lucide-react";
import TickBadge from "../ui/TickBadge";

/**
 * ===============================
 * Premium Preview Page (Public + Modal)
 * ===============================
 * Design goals:
 * - Calm, editorial typography
 * - High contrast, soft depth
 * - Linktree-class UX
 * - Premium SaaS aesthetics
 */

export const PreviewPage = ({ user = {}, links = [] }) => {
    const activeLinks = links.filter((l) => l.isActive);

    const getInitial = () => {
        if (user.image) return null;
        if (user.name) return user.name.charAt(0).toUpperCase();
        if (user.email) return user.email.charAt(0).toUpperCase();
        return null;
    };

    const initial = getInitial();

    return (
        <div className="flex flex-col items-center px-6 py-10 w-full max-w-[420px] mx-auto font-sans">
            {/* Avatar */}
            {user.image ? (
                <img
                    src={user.image}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg "
                />
            ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-lg ring-4 ring-white/50">
                    {initial}
                </div>
            )}

            {/* Username */}
            <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                @{user.username}
                <TickBadge tier={user.plan === "paid" ? "paid" : "free"} />
            </h3>

            {/* Bio */}
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-2 mb-8 leading-relaxed">
                {user.bio || "Sharing my important links in one place."}
            </p>

            {/* Links */}
            <div className="w-full flex flex-col gap-4">
                {activeLinks.length > 0 ? (
                    activeLinks.map((link, i) => {
                        const IconComp =
                            ICONS.find((icon) => icon.slug === link.icon)
                                ?.Comp || ExternalLink;

                        return (
                            <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200"
                            >
                                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                    <IconComp className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                                </div>
                                <span className="flex-1 font-medium text-neutral-900 dark:text-white tracking-wide">
                                    {link.title}
                                </span>
                                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 text-neutral-400" />
                            </a>
                        );
                    })
                ) : (
                    <p className="text-center text-neutral-400 text-sm">
                        No active links yet
                    </p>
                )}
            </div>
        </div>
    );
};

export const PreviewModal = ({ isOpen, onClose, user = {}, links = [] }) => {
    const [device, setDevice] = useState("mobile");

    useEffect(() => {
        const handleEsc = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex"
            onClick={onClose}
        >
            <div
                className="ml-auto h-full w-[720px] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-l border-white/20 shadow-2xl animate-bunchlySlideIn overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur">
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                        Live Preview
                    </h2>

                    <div className="flex items-center gap-2">
                        <Button
                            icon={Smartphone}
                            size="sm"
                            variant={device === "mobile" ? "primary" : "ghost"}
                            onClick={() => setDevice("mobile")}
                        />
                        <Button
                            icon={Monitor}
                            size="sm"
                            variant={device === "desktop" ? "primary" : "ghost"}
                            onClick={() => setDevice("desktop")}
                        />
                        <Button
                            icon={X}
                            size="sm"
                            variant="ghost"
                            onClick={onClose}
                        />
                    </div>
                </div>

                {/* Preview Content */}
                <div className="p-6 flex justify-center">
                    {device === "mobile" && (
                        <div className="w-[300px] h-[560px] rounded-[2.2rem] border-[6px] border-neutral-300 dark:border-neutral-700 shadow-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                            <div className="h-full overflow-y-auto no-scrollbar">
                                <PreviewPage user={user} links={links} />
                            </div>
                        </div>
                    )}

                    {device === "desktop" && (
                        <div className="w-full flex justify-center overflow-auto pt-6">
                            <div
                                style={{
                                    width: "1200px",
                                    transform: "scale(0.6)",
                                    transformOrigin: "top center",
                                }}
                            >
                                <PreviewPage user={user} links={links} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
