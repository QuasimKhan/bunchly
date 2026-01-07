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
    const [tab, setTab] = useState("library"); // 'library' | 'custom'
    const [customUrl, setCustomUrl] = useState("");
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

    // Initialize custom url if the initial value is a URL
    useEffect(() => {
        if (initial && (initial.startsWith("http") || initial.startsWith("data:"))) {
            setCustomUrl(initial);
            setTab("custom");
        }
    }, [initial]);

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
                    shadow-xl flex flex-col
                    transition-transform duration-300 ease-out
                    ${open ? "translate-x-0" : "translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="text-lg font-semibold dark:text-white">Choose Icon</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 dark:border-gray-800">
                    <button 
                        onClick={() => setTab("library")}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "library" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}
                    >
                        Library
                    </button>
                    <button 
                        onClick={() => setTab("custom")}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "custom" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}
                    >
                        Custom
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    
                    {tab === "library" && (
                        <>
                            {/* Search Input */}
                            <div className="mb-4">
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search icons..."
                                    className="
                                        w-full px-3 py-2 rounded-lg
                                        border border-gray-200 dark:border-gray-700
                                        bg-gray-50 dark:bg-gray-800
                                        focus:ring-2 focus:ring-indigo-500 outline-none
                                        text-sm dark:text-white
                                    "
                                />
                            </div>

                            {/* Icon Grid */}
                            <div className="grid grid-cols-4 gap-3">
                                {filtered.map((icon) => {
                                    const IconComp = icon.Comp;
                                    const active = initial === icon.slug;
                                    const colorClass = ICON_COLOR[icon.slug] || "text-gray-600 dark:text-gray-300";

                                    return (
                                        <button
                                            key={icon.slug}
                                            onClick={() => onSelect(icon.slug)}
                                            className={`
                                                flex flex-col items-center gap-2 p-3 rounded-xl
                                                transition-all border 
                                                ${
                                                    active
                                                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                                                        : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                                                }
                                            `}
                                        >
                                            <div
                                                className={`
                                                    w-10 h-10 rounded-lg flex items-center justify-center 
                                                    ${active ? "bg-white dark:bg-indigo-500/20" : "bg-gray-100 dark:bg-gray-700/50"}
                                                `}
                                            >
                                                <IconComp className={`w-5 h-5 ${colorClass}`} />
                                            </div>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 text-center truncate w-full">
                                                {icon.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {tab === "custom" && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Image URL
                                </label>
                                <input
                                    value={customUrl}
                                    onChange={(e) => setCustomUrl(e.target.value)}
                                    placeholder="https://example.com/icon.png"
                                    className="
                                        w-full px-3 py-2 rounded-lg
                                        border border-gray-200 dark:border-gray-700
                                        bg-gray-50 dark:bg-gray-800
                                        focus:ring-2 focus:ring-indigo-500 outline-none
                                        text-sm dark:text-white mb-2
                                    "
                                />
                                <p className="text-xs text-gray-500">
                                    Paste a direct link to an image (PNG, JPG, ICO). 
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                                    {customUrl ? (
                                        <img src={customUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                    ) : (
                                        <span className="text-xs text-gray-400">Preview</span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium dark:text-white">Icon Preview</h4>
                                    <p className="text-xs text-gray-500">This is how it will look.</p>
                                </div>
                            </div>

                            <button
                                disabled={!customUrl}
                                onClick={() => onSelect(customUrl)}
                                className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Use Custom Icon
                            </button>
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    );
};

export default IconPickerDrawer;
