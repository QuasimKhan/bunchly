import React, { useState } from "react";
import { GripVertical } from "lucide-react";

/**
 * LinkDragHandle
 * -------------------------
 * A clean, responsive drag handle for dnd-kit sorting.
 *
 * ✔ Shows proper grabbing cursor
 * ✔ Works on both mouse + touch
 * ✔ No gesture conflicts
 * ✔ Minimal premium UI
 */

const LinkDragHandle = ({ className = "" }) => {
    const [isDragging, setIsDragging] = useState(false);

    return (
        <div
            className={`
                relative select-none pr-2 
                transition-colors duration-150
                ${isDragging ? "cursor-grabbing" : "cursor-grab"} 
                ${className}
            `}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
        >
            <GripVertical
                className="
                    w-4 h-4 sm:w-5 sm:h-5 
                    text-gray-400 dark:text-gray-500
                    opacity-80 hover:opacity-100
                    transition-opacity
                "
                aria-hidden="true"
            />
        </div>
    );
};

export default LinkDragHandle;
