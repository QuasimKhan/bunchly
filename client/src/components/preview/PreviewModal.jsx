import React, { useEffect, useState } from "react";
import { ICONS } from "../../lib/iconPalette";
import Button from "../ui/Button";
import { Icon, Link } from "lucide-react";
import TickBadge from "../ui/TickBadge";

// ⬇️ You should move this into its own file later, but keeping inline for now
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
        <div className="flex flex-col items-center p-6 pb-10 w-full max-w-[600px] mx-auto">
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
            <h3 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-1">
                @{user.username}
                <TickBadge tier={user.plan === "paid" ? "paid" : "free"} />
            </h3>

            {/* Bio */}
            <p className="text-sm text-neutral-500 mt-1 mb-6">
                {user.bio || "Bio not provided"}
            </p>

            {/* LINKS */}
            <div className="w-full flex flex-col gap-4 pb-6 ">
                {activeLinks.length > 0 ? (
                    activeLinks.map((link, i) => {
                        const IconComp =
                            ICONS.find((icon) => icon.slug === link.icon)
                                ?.Comp || null;

                        return (
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={i}
                                className="
                        bg-white dark:bg-neutral-900  
                        text-neutral-900 dark:text-white
                        w-full py-4 px-5 rounded-2xl shadow-md 
                        border border-neutral-200 dark:border-neutral-700 
                        hover:shadow-lg hover:scale-[1.02] 
                        hover:bg-neutral-50 dark:hover:bg-neutral-800
                        transition-all duration-200
                        flex items-center gap-4
                        cursor-pointer
                    "
                            >
                                {/* ICON LEFT (BIG LIKE LINKTREE) */}
                                <div className="flex items-center justify-center w-8 h-8">
                                    {IconComp ? (
                                        <IconComp
                                            size={22}
                                            className="opacity-90"
                                        />
                                    ) : (
                                        <Link />
                                    )}
                                </div>

                                {/* TITLE */}
                                <a className="text-[16px] font-semibold tracking-wide flex-1">
                                    {link.title}
                                </a>
                            </a>
                        );
                    })
                ) : (
                    <p className="text-center text-neutral-400 text-sm">
                        No active links
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
            className="
                fixed inset-0 z-[999] 
                bg-black/60 backdrop-blur-sm 
                flex
            "
            onClick={onClose}
        >
            {/* RIGHT SIDE PANEL */}
            <div
                className="
                    ml-auto 
                    h-full w-[650px]
                    bg-white/20 dark:bg-black/40 backdrop-blur-xl
                    border-l border-white/20
                    shadow-xl
                    animate-bunchlySlideIn
                    overflow-y-auto
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* TOP BAR */}
                <div
                    className="
                        flex justify-between items-center px-4 py-3 
                        border-b border-white/20
                        sticky top-0 
                        bg-white/20 dark:bg-black/40 backdrop-blur-xl 
                        z-10
                    "
                >
                    <h2 className="text-lg font-semibold text-white">
                        Preview
                    </h2>

                    {/* DEVICE TOGGLE */}
                    <div className="flex items-center gap-2 mr-4">
                        <Button
                            onClick={() => setDevice("mobile")}
                            className={`
                                px-3 py-1 rounded-xl text-sm font-medium
                                transition
                                ${
                                    device === "mobile"
                                        ? "bg-white/30 text-white"
                                        : "text-white/60 hover:text-white"
                                }
                            `}
                            text="Moblie"
                            size="sm"
                        />

                        <Button
                            onClick={() => setDevice("desktop")}
                            className={`
                                px-3 py-1 rounded-xl text-sm font-medium
                                transition
                                ${
                                    device === "desktop"
                                        ? "bg-white/30 text-white"
                                        : "text-white/60 hover:text-white"
                                }
                            `}
                            text="Desktop"
                            size="sm"
                        />
                    </div>

                    {/* CLOSE BUTTON */}
                    <Button
                        text=""
                        icon={() => (
                            <span className="text-lg font-bold">×</span>
                        )}
                        className="!bg-transparent text-white hover:text-white"
                        onClick={onClose}
                    />
                </div>

                {/* PREVIEW CONTENT */}
                <div className="p-4 flex justify-center w-full">
                    {/* ⭐ MOBILE PREVIEW ⭐ */}
                    {device === "mobile" && (
                        <div className="flex justify-center w-full">
                            <div
                                className="
                                    w-[280px] h-[540px] bg-gradient-to-b 
                                    from-white to-neutral-100 
                                    dark:from-neutral-900 dark:to-neutral-800
                                    rounded-[2rem] border-[6px] border-neutral-300 dark:border-neutral-700
                                    shadow-xl overflow-hidden flex-shrink-0
                                "
                            >
                                <div className="h-full overflow-y-auto no-scrollbar">
                                    <PreviewPage user={user} links={links} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ⭐ DESKTOP PREVIEW ⭐ */}
                    {device === "desktop" && (
                        <div className="flex justify-center w-full">
                            <div
                                className="
                                    relative w-full h-[600px] 
                                    overflow-auto flex justify-center pt-6
                                "
                            >
                                <div
                                    style={{
                                        width: "1200px",
                                        transform: "scale(0.55)",
                                        transformOrigin: "top center",
                                    }}
                                    className=""
                                >
                                    <PreviewPage user={user} links={links} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
