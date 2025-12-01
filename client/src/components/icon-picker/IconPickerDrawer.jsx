// src/components/icon-picker/IconPickerDrawer.jsx
import React, { useState, useMemo } from "react";
import { ICONS, ICON_COLOR } from "../../lib/iconPalette";
import { X } from "lucide-react";

/**
 * Props:
 *  - open (bool)
 *  - onClose()
 *  - onSelect(iconSlug)  // returns slug string like "instagram"
 *  - initial (optional) current slug
 */

const categories = Array.from(new Set(ICONS.map((i) => i.category)));

const IconPickerDrawer = ({ open, onClose, onSelect, initial }) => {
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        return ICONS.filter((ic) => {
            if (!qq) return true;
            return ic.label.toLowerCase().includes(qq) || ic.slug.includes(qq);
        });
    }, [q]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1" onClick={onClose} />

            <div className="w-[420px] max-w-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-4 shadow-2xl overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Choose Icon</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <X />
                    </button>
                </div>

                <div className="mb-3">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search icons..."
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 bg-white/5"
                    />
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {filtered.map((icon) => {
                        const IconComp = icon.Comp;
                        const isActive = initial === icon.slug;
                        const colorClass =
                            ICON_COLOR[icon.slug] || "text-gray-200";
                        return (
                            <button
                                key={icon.slug}
                                onClick={() => onSelect(icon.slug)}
                                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition hover:bg-white/5 ${
                                    isActive ? "ring-2 ring-indigo-400/30" : ""
                                }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-md flex items-center justify-center ${
                                        isActive
                                            ? "bg-indigo-600/10"
                                            : "bg-white/3"
                                    }`}
                                >
                                    <IconComp
                                        className={`w-5 h-5 ${colorClass}`}
                                    />
                                </div>
                                <div className="text-xs text-gray-400">
                                    {icon.label}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default IconPickerDrawer;
