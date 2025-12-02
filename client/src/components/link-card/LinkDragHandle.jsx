// src/components/link-card/LinkDragHandle.jsx
import React from "react";
import { GripVertical } from "lucide-react";
import { useDragHandle } from "../links/SortableLink";

/**
 * LinkDragHandle
 * --------------------------------------
 *  ✔ Best mobile drag experience
 *  ✔ Uses dnd-kit listeners injected through context
 *  ✔ touch-none applied ONLY to handle (not whole card)
 *  ✔ Prevents scroll only when dragging the handle
 *  ✔ Crisp premium UI
 */

const LinkDragHandle = ({ className = "" }) => {
    const drag = useDragHandle(); // listeners + attributes from useSortable()

    return (
        <button
            type="button"
            aria-label="Drag to reorder"
            {...drag?.listeners}
            {...drag?.attributes}
            className={`
                flex items-center justify-center
                cursor-grab active:cursor-grabbing
                touch-none select-none
                p-2 pr-2
                rounded-md
                hover:bg-white/10 dark:hover:bg-white/5
                transition-colors
                ${className}
            `}
        >
            <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
        </button>
    );
};

export default LinkDragHandle;
