import { Loader2 } from "lucide-react";
import React from "react";

const Button = ({
    text = "Submit",
    icon: Icon,
    loading = false,
    onClick,
    className = "",
    size = "md",
    fullWidth = false,
    variant = "default",
    type = "button",
}) => {
    // ========== AUTO SIZE LOGIC WITH ICON ==========
    const iconOnly = Icon && !text; // When icon exists & no text

    const sizeClasses =
        size === "sm"
            ? iconOnly
                ? "p-1.5" // small Icon only
                : "text-sm px-3 py-1.5"
            : size === "lg"
            ? iconOnly
                ? "p-3" // large Icon
                : "text-lg px-5 py-3"
            : iconOnly
            ? "p-2" // medium icon
            : "text-base px-4 py-2";

    const variants = {
        default: `
            bg-white border border-gray-300 text-gray-900
            hover:bg-gray-50 hover:border-indigo-500
            dark:bg-white/5 dark:border-white/10 dark:text-gray-100
            dark:hover:bg-white/10 dark:hover:border-indigo-300
        `,
        primary: `
            bg-indigo-600 text-white border border-indigo-600
            hover:bg-indigo-700 hover:border-indigo-700
            dark:bg-indigo-500 dark:border-indigo-500
            dark:hover:bg-indigo-600
        `,
        secondary: `
            bg-gray-200 text-gray-900 border border-gray-300
            hover:bg-gray-300
            dark:bg-gray-700 dark:text-white dark:border-gray-600
            dark:hover:bg-gray-600
        `,
        outline: `
            bg-transparent border border-gray-400 text-gray-900
            hover:bg-gray-100
            dark:text-gray-100 dark:border-gray-500 dark:hover:bg-gray-800
        `,
        danger: `
            bg-red-500 text-white border border-red-600
            hover:bg-red-600
            dark:bg-red-700 dark:hover:bg-red-800
        `,
        ghost: `
            bg-transparent text-gray-900 hover:bg-gray-200
            dark:text-gray-100 dark:hover:bg-gray-800
            border border-transparent
        `,
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className={`
                flex items-center justify-center 
                ${
                    Icon && text ? "gap-2" : ""
                }     // adds spacing only when both exist
                rounded-lg font-medium transition-all duration-200
                active:scale-[0.96]

                ${sizeClasses}
                ${fullWidth ? "w-full" : ""}
                ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${variants[variant]}
                ${className}
            `}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : Icon ? (
                <Icon className={`${text ? "w-4 h-4" : "w-5 h-5"}`} /> // Smaller icon w/ text
            ) : (
                text
            )}
        </button>
    );
};

export default Button;
