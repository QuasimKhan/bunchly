import React, { useEffect } from "react";
import { ICONS } from "../../lib/iconPalette";
import Button from "../ui/Button";

export const PreviewModal = ({ isOpen, onClose, user = {}, links = [] }) => {
    useEffect(() => {
        const handleEsc = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const activeLinks = links.filter((l) => l.isActive);

    const getInitial = () => {
        if (user.image) return null;
        if (user.name) return user.name.charAt(0).toUpperCase();
        if (user.email) return user.email.charAt(0).toUpperCase();
        return null;
    };
    const initial = getInitial();

    return (
        <div
            className="
                fixed inset-0 z-[999] flex items-center justify-center
                bg-black/60 backdrop-blur-sm p-4
                overflow-y-auto
            "
            onClick={onClose}
        >
            <div
                className="
                    relative bg-white/20 dark:bg-black/40 backdrop-blur-xl 
                    border border-white/30 rounded-3xl shadow-2xl 
                    w-full max-w-sm max-h-[90vh] overflow-y-auto 
                    animate-bunchlySlideUp
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* TOP BAR */}
                <div
                    className="
                        flex justify-between items-center px-4 py-3 border-b border-white/20
                        sticky top-0 bg-white/20 dark:bg-black/40 backdrop-blur-xl z-10
                    "
                >
                    <h2 className="text-lg font-semibold text-white">
                        Preview
                    </h2>

                    <Button
                        text=""
                        icon={() => (
                            <span className="text-lg font-bold">×</span>
                        )}
                        className="!bg-transparent text-white hover:text-white"
                        onClick={onClose}
                        tooltip="Close"
                    />
                </div>

                {/* PHONE PREVIEW */}
                <div className="p-4 flex justify-center">
                    <div
                        className="
                            w-[280px] h-[540px] bg-gradient-to-b 
                            from-white to-neutral-100 
                            dark:from-neutral-900 dark:to-neutral-800
                            rounded-[2rem] border-[6px] border-neutral-300 dark:border-neutral-700
                            shadow-xl overflow-hidden flex-shrink-0
                        "
                    >
                        {/* SCROLLABLE INNER CONTENT */}
                        <div className="h-full overflow-y-auto no-scrollbar">
                            <div className="flex flex-col items-center p-6 pb-10">
                                {/* AVATAR */}
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover mb-4 shadow-md border-4 border-white dark:border-neutral-700"
                                    />
                                ) : initial ? (
                                    <div
                                        className="
                                            w-24 h-24 rounded-full bg-indigo-600 
                                            text-white flex items-center justify-center
                                            text-3xl font-bold mb-4 shadow-md border-4 border-white/50
                                        "
                                    >
                                        {initial}
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-neutral-300 dark:bg-neutral-700 mb-4" />
                                )}

                                {/* NAME */}
                                <h3 className="text-xl font-bold text-neutral-800 dark:text-white">
                                    {user.name || user.email || "Unknown User"}
                                </h3>

                                {/* ROLE */}
                                <p className="text-sm text-neutral-500 mt-1 mb-6">
                                    {user.role || "Bio not provided"}
                                </p>

                                {/* LINKS (LINKTREE STYLE BUTTONS) */}
                                <div className="w-full flex flex-col gap-4 pb-6">
                                    {activeLinks.length > 0 ? (
                                        activeLinks.map((link, i) => {
                                            const IconComp =
                                                ICONS.find(
                                                    (icon) =>
                                                        icon.slug === link.icon
                                                )?.Comp || null;

                                            return (
                                                <Button
                                                    key={i}
                                                    onClick={() =>
                                                        window.open(
                                                            link.url,
                                                            "_blank"
                                                        )
                                                    }
                                                    fullWidth
                                                    icon={IconComp}
                                                    text={link.title}
                                                />
                                            );
                                        })
                                    ) : (
                                        <p className="text-center text-neutral-400 text-sm">
                                            No active links available
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
