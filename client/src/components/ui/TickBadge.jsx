export default function TickBadge({ tier = "free", className = "" }) {
    const isPaid = tier === "pro";

    return (
        <span
            className={`
                inline-flex items-center justify-center 
                w-4 h-4 rounded-full 
                ${
                    isPaid
                        ? "bg-gradient-to-br from-yellow-400 to-amber-600"
                        : "bg-gradient-to-br from-blue-400 to-blue-600"
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
