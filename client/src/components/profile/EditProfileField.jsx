import { Pencil, Plus } from "lucide-react";

export default function EditProfileField({
    label,
    value,
    editable = true,
    onEdit = () => {},
    icon: Icon,
    helperText,
    fullWidth = false
}) {
    const empty = !value || value.trim() === "";

    return (
        <div 
            className={`
                group relative p-4 rounded-xl 
                bg-white dark:bg-neutral-900 
                border border-neutral-200 dark:border-neutral-800 
                transition-all duration-200
                hover:border-indigo-300 dark:hover:border-indigo-700
                hover:shadow-md
                ${fullWidth ? 'col-span-1 md:col-span-2' : ''}
            `}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    {Icon && (
                        <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 mt-0.5">
                            <Icon size={18} />
                        </div>
                    )}
                    
                    <div className="break-all min-w-0 flex-1">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-500 mb-1.5">
                            {label}
                        </h4>
                        
                        <p className={`text-sm md:text-base font-medium leading-relaxed ${empty ? 'text-neutral-400 italic' : 'text-neutral-900 dark:text-white'}`}>
                            {empty ? 'Not added yet' : value}
                        </p>
                        
                        {helperText && (
                            <p className="text-xs text-neutral-400 mt-1.5 flex items-center gap-1">
                                {helperText}
                            </p>
                        )}
                    </div>
                </div>

                {editable && (
                    <button
                        onClick={onEdit}
                        className="
                            relative p-2 rounded-lg
                            text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400
                            hover:bg-indigo-50 dark:hover:bg-indigo-900/20
                            transition-colors
                            opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                        "
                        aria-label={`Edit ${label}`}
                    >
                        {empty ? <Plus size={18} /> : <Pencil size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
}
