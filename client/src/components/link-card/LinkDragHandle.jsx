// src/components/link-card/LinkDragHandle.jsx
import React from "react";
import { GripVertical } from "lucide-react";
import { useDragHandle } from "../links/SortableLink"; // ⬅ REQUIRED

/**
 * Mobile + Desktop Safe Drag Handle
 * --------------------------------------
 * ✔ Fully works on mobile (touch-action none)
 * ✔ Drag listeners attached from dnd-kit
 * ✔ Does NOT block scroll when not dragging
 * ✔ Clean minimal UI
 */

const LinkDragHandle = ({ className = "" }) => {
    const drag = useDragHandle(); // ⬅ This injects listeners + attributes

    return (
        <div
            {...drag?.listeners} // ⬅ REQUIRED for drag to work
            {...drag?.attributes} // ⬅ REQUIRED
            className={`
                cursor-grab active:cursor-grabbing
                touch-none select-none
                pr-2 flex items-center
                ${className}
            `}
        >
            <GripVertical
                className="
                    w-4 h-4 sm:w-5 sm:h-5
                    text-gray-400 dark:text-gray-500
                    opacity-80 hover:opacity-100
                    transition
                "
            />
        </div>
    );
};

export default LinkDragHandle;
