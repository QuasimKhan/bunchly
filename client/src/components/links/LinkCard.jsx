import { useState } from "react";
import {
    GripVertical,
    Pencil,
    Trash2,
    Copy,
    ExternalLink,
    BarChart2,
} from "lucide-react";
import SwitchToggle from "../ui/SwitchToggle";
import { toast } from "sonner";
import Button from "../ui/Button";

const platformMap = [
    { key: "youtube", match: /youtube\.com|youtu\.be/, label: "YouTube" },
    { key: "instagram", match: /instagram\.com/, label: "Instagram" },
    { key: "facebook", match: /facebook\.com/, label: "Facebook" },
    { key: "twitter", match: /twitter\.com|x\.com/, label: "X/Twitter" },
    { key: "linkedin", match: /linkedin\.com/, label: "LinkedIn" },
];

const PlatformIcon = ({ url }) => {
    if (!url) return null;
    const found = platformMap.find((p) => p.match.test(url.toLowerCase()));
    return found ? (
        <div className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-white/6 text-indigo-200 border border-white/6">
            {found.label}
        </div>
    ) : (
        <ExternalLink className="w-4 h-4 text-indigo-300" />
    );
};

const Favicon = ({ url, size = 32 }) => {
    if (!url) return null;

    let hostname;
    try {
        hostname = new URL(url).hostname;
    } catch {
        hostname = null;
    }

    const src = hostname
        ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`
        : null;

    return (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden flex items-center justify-center bg-white/6 border border-white/8">
            {src ? (
                <img
                    src={src}
                    alt="favicon"
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                />
            ) : (
                <ExternalLink className="w-4 h-4 text-gray-300" />
            )}
        </div>
    );
};

const Sparkline = ({ points = [] }) => {
    if (!points.length) return <div className="text-xs text-gray-400">—</div>;

    const max = Math.max(...points);
    const min = Math.min(...points);
    const height = 26;
    const width = Math.max(60, points.length * 8);
    const step = width / (points.length - 1 || 1);

    const normalize = (v) =>
        max === min ? height / 2 : height - ((v - min) / (max - min)) * height;

    const d = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${normalize(p)}`)
        .join(" ");

    return (
        <svg width={width} height={height} className="hidden sm:inline-block">
            <path
                d={d}
                stroke="rgba(99,102,241,0.9)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const LinkCard = ({ link, onToggle, onEdit, onDelete }) => {
    const [copying, setCopying] = useState(false);
    const [dragging, setDragging] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link.url);
            setCopying(true);
            toast.success("URL Copied");
            setTimeout(() => setCopying(false), 1200);
        } catch {
            toast.error("Copy Failed");
        } finally {
            setCopying(false);
        }
    };

    return (
        <div
            className={`relative w-full p-5 sm:p-6 rounded-2xl bg-white/8 dark:bg-black/30 backdrop-blur-2xl border border-white/10 shadow-lg transition-all duration-200 
                ${dragging ? "scale-[1.02]" : "hover:scale-[1.01]"}`}
            /** 🔥 Enable mobile drag */
            onMouseDown={() => setDragging(true)}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onTouchStart={() => setDragging(true)}
            onTouchEnd={() => setDragging(false)}
        >
            {/* TOP ROW RESPONSIVE FIX */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                {/* Drag + favicon */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 cursor-grab" />
                    <Favicon url={link.url} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        {/* Title + URL */}
                        <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold truncate">
                                {link.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-gray-400 overflow-hidden flex-wrap">
                                {/* URL + description stacked */}
                                <div className="flex flex-col max-w-[65vw] sm:max-w-none overflow-hidden">
                                    <span className="truncate break-all text-gray-200">
                                        {link.url}
                                    </span>

                                    {link.description && (
                                        <span className="text-gray-400 text-[11px] sm:text-xs opacity-80 wrap-break-word mt-0.5">
                                            {link.description}
                                        </span>
                                    )}
                                </div>

                                {/* Copy Button */}
                                <Button
                                    icon={Copy}
                                    size="sm"
                                    loading={copying}
                                    onClick={handleCopy}
                                />

                                {/* Open Link */}
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener"
                                    className="p-1 rounded-md hover:bg-white/10"
                                >
                                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                            <PlatformIcon url={link.url} />
                            <div className="text-xs text-gray-400 flex items-center gap-1 sm:gap-2">
                                <BarChart2 className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-300" />
                                {link.clickCount ?? 0}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row — Mobile Wrap Fix */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                        <span
                            className={`px-2 py-0.5 text-[10px] sm:text-xs rounded-full 
                            ${
                                link.isActive
                                    ? "bg-green-500/20 text-green-400 border border-green-400/20"
                                    : "bg-gray-500/20 text-gray-400 border border-gray-400/20"
                            }`}
                        >
                            {link.isActive ? "Active" : "Hidden"}
                        </span>

                        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                            <button
                                onClick={() => onEdit(link)}
                                className="p-1.5 sm:p-2 rounded-lg cursor-pointer bg-white/6 hover:bg-white/10"
                            >
                                <Pencil className="w-3 h-3 sm:w-4 sm:h-4 text-gray-200" />
                            </button>

                            <button
                                onClick={() => onDelete(link._id)}
                                className="p-1.5 sm:p-2 rounded-lg cursor-pointer bg-red-500/10 hover:bg-red-500/20"
                            >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                            </button>

                            <SwitchToggle
                                checked={link.isActive}
                                onChange={(checked) =>
                                    onToggle(link._id, checked)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinkCard;
