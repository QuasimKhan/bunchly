// src/components/link-card/LinkAnalytics.jsx
import React from "react";
import { BarChart2 } from "lucide-react";

/**
 * Mini sparkline visualization for link analytics.
 * Shows trend of clicks over time.
 */
const Sparkline = ({ points = [] }) => {
    if (!points.length) {
        return <div className="text-xs text-gray-500 opacity-70">—</div>;
    }

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
        <svg
            width={width}
            height={height}
            className="hidden sm:inline-block opacity-90"
        >
            {/* Trend line */}
            <path
                d={d}
                stroke="rgba(99,102,241,0.9)"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Optional: endpoint dot for premium feel */}
            <circle
                cx={(points.length - 1) * step}
                cy={normalize(points[points.length - 1])}
                r="2.5"
                fill="rgba(99,102,241,1)"
                className="transition-all"
            />
        </svg>
    );
};

/**
 * LinkAnalytics
 * -------------------
 * Shows:
 *  - Total click count
 *  - Sparkline trend graph
 */

const LinkAnalytics = ({ clickCount = 0, clicks = [] }) => (
    <div className="flex items-center sm:flex-col sm:items-end gap-2">
        {/* Click count */}
        <div className="text-xs text-gray-400 flex items-center gap-1 sm:gap-1.5 select-none">
            <BarChart2 className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-300" />
            <span className="font-medium text-gray-300">{clickCount ?? 0}</span>
        </div>

        {/* Sparkline chart */}
        <Sparkline points={clicks ?? []} />
    </div>
);

export default LinkAnalytics;
