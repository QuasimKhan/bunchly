// src/components/icon-picker/IconPickerDrawer.jsx
import React, { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import { ICONS, ICON_COLOR } from "../../lib/iconPalette";

/**
 * IconPickerDrawer
 * -----------------------------------
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - onSelect: (slug: string) => void
 *  - initial: currently selected icon slug
 */

const IconPickerDrawer = ({ open, onClose, onSelect, initial }) => {
    const [query, setQuery] = useState("");
    const [visible, setVisible] = useState(open);

    // Smooth transition in/out
    useEffect(() => {
        if (open) {
            setVisible(true);
        } else {
            setTimeout(() => setVisible(false), 250); // wait for fade-out animation
        }
    }, [open]);

    // Search filtering
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return ICONS;
        return ICONS.filter(
            (i) =>
                i.label.toLowerCase().includes(q) ||
                i.slug.toLowerCase().includes(q)
        );
    }, [query]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex pointer-events-auto">
            {/* Background overlay */}
            <div
                className={`
                    absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity
                    ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                className={`
                    ml-auto h-full w-[420px] max-w-full
                    bg-white dark:bg-gray-900
                    border-l border-gray-200 dark:border-gray-800
                    shadow-xl p-4 flex flex-col
                    transition-transform duration-300 ease-out
                    ${open ? "translate-x-0" : "translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Choose Icon</h3>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Input */}
                <div className="mb-4">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search icons..."
                        className="
                            w-full px-3 py-2 rounded-md
                            border border-gray-300 dark:border-gray-700
                            bg-gray-50 dark:bg-gray-800
                            focus:ring-2 focus:ring-indigo-500 outline-none
                            text-sm
                        "
                    />
                </div>

                {/* Icon Grid */}
                <div className="grid grid-cols-4 gap-3 overflow-y-auto pr-2">
                    {filtered.map((icon) => {
                        const IconComp = icon.Comp;
                        const active = initial === icon.slug;
                        const colorClass =
                            ICON_COLOR[icon.slug] || "text-gray-400";

                        return (
                            <button
                                key={icon.slug}
                                onClick={() => onSelect(icon.slug)}
                                className={`
                                    flex flex-col items-center gap-1 p-3 rounded-lg
                                    transition-all border 
                                    ${
                                        active
                                            ? "border-indigo-500 bg-indigo-500/10 shadow-md"
                                            : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }
                                `}
                            >
                                <div
                                    className={`
                                        w-10 h-10 rounded-md flex items-center justify-center 
                                        ${
                                            active
                                                ? "bg-indigo-600/20"
                                                : "bg-gray-200 dark:bg-gray-700"
                                        }
                                    `}
                                >
                                    <IconComp
                                        className={`w-5 h-5 ${colorClass}`}
                                    />
                                </div>

                                <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                    {icon.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default IconPickerDrawer;
