import { Pencil, Plus } from "lucide-react";

export default function EditProfileField({
    label,
    value,
    editable = true,
    onEdit = () => {},
}) {
    const empty = !value || value.trim() === "";

    return (
        <div
            className="
                relative p-5 rounded-2xl 
                bg-white/60 dark:bg-neutral-900/40 
                backdrop-blur-xl shadow-lg 
                border border-white/40 dark:border-neutral-800 
                transition hover:shadow-xl hover:bg-white/70 
                dark:hover:bg-neutral-900/60
            "
        >
            {/* Label */}
            <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {label}
            </h4>

            {/* Value */}
            <p className="mt-1 text-neutral-900 dark:text-neutral-200 break-words leading-relaxed">
                {empty ? (
                    <span className="text-neutral-400 italic">
                        Not added yet
                    </span>
                ) : (
                    value
                )}
            </p>

            {/* EDIT / ADD BUTTON */}
            {editable && (
                <button
                    onClick={onEdit}
                    className="
                        absolute right-4 top-4 p-2 rounded-xl
                        bg-white/80 dark:bg-neutral-800/80
                        border border-neutral-300 dark:border-neutral-700
                        shadow-sm 
                        hover:shadow-md hover:scale-110 
                        active:scale-95
                        transition-all duration-200
                    "
                >
                    {empty ? (
                        <Plus className="w-4 h-4 text-indigo-600" />
                    ) : (
                        <Pencil className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    )}
                </button>
            )}
        </div>
    );
}
