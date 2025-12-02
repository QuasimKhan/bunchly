// src/components/links/SortableLink.jsx
import React, { createContext, useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const DragContext = createContext(null);
export const useDragHandle = () => useContext(DragContext);

const SortableLink = ({ id, children }) => {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.9 : 1,
        touchAction: "none", // REQUIRED for mobile drag
    };

    return (
        <DragContext.Provider value={{ attributes, listeners }}>
            <div ref={setNodeRef} style={style}>
                {children}
            </div>
        </DragContext.Provider>
    );
};

export default SortableLink;
