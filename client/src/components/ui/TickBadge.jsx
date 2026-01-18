export default function TickBadge({ tier = "pro", className = "" }) {
    const isPaid = tier === "pro";

    if (tier !== "pro") return null;

    return (
        <span
            className={`
                inline-flex items-center justify-center 
                w-4 h-4 rounded-full 
                ${
                    isPaid
                        ? "bg-linear-to-br from-yellow-500 to-amber-600 shadow-yellow-500/30"
                        : ""
                }
                shadow-md 
                ring-2 ring-white/50 dark:ring-white/10
                overflow-hidden
                ${className}
            `}
        >
            {/* Check Icon */}
            <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="scale-[0.75]"
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </span>
    );
}
