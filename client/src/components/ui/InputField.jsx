import React from "react";

const InputField = ({
    label,
    icon: Icon,
    type,
    name,
    value,
    onChange,
    placeholder,
    error,
    eye: Eye,
    onClick,
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block mb-1 font-medium text-gray-800 dark:text-gray-300">
                    {label}
                </label>
            )}

            <div
                className={`
                    flex items-center gap-3
                    rounded-xl px-4 py-2
                    border transition-all duration-200

                    /* Light mode */
                    bg-white border-gray-300 
                    focus-within:border-indigo-500
                    text-gray-900

                    /* Dark mode */
                    dark:bg-white/5 dark:border-white/10
                    dark:text-gray-100
                    dark:focus-within:border-indigo-300

                    ${error ? "border-red-500 dark:border-red-400" : ""}
                `}
            >
                {Icon && (
                    <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                )}

                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="
                        w-full bg-transparent outline-none
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        text-gray-900 dark:text-gray-100
                    "
                />

                {Eye && (
                    <Eye
                        className="w-5 h-5 text-gray-500 cursor-pointer dark:text-gray-400 shrink-0"
                        onClick={onClick}
                    />
                )}
            </div>

            {error && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default InputField;
