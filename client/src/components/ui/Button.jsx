import { Loader2 } from "lucide-react";
import React from "react";

const Button = ({
    text = "Submit",
    loading = false,
    onClick,
    className = "",
    size = "md",
    fullWidth = false,
    variant = "default",
    type = "button", // prevents accidental form submission
}) => {
    const sizeClasses =
        size === "sm"
            ? "text-sm px-3 py-1.5"
            : size === "lg"
            ? "text-lg px-5 py-3"
            : "text-base px-4 py-2";

    // ===========================
    // VARIANT STYLES
    // ===========================
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

        ghost: `
            bg-transparent text-gray-900 hover:bg-gray-200
            dark:text-gray-100 dark:hover:bg-gray-800
            border border-transparent
        `,
    };

    const variantClasses = variants[variant] || variants.default;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className={`
                rounded-xl font-semibold transition-all duration-200
                active:scale-[0.97]

                focus:outline-none focus:ring-2
                focus:ring-indigo-500 dark:focus:ring-indigo-300
                focus:ring-offset-2
                focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900

                ${sizeClasses}
                ${fullWidth ? "w-full" : ""}
                ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}

                ${variantClasses}
                ${className}
            `}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
                text
            )}
        </button>
    );
};

export default Button;
