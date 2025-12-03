import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const Tooltip = ({ label, children, side = "top", offset = 10 }) => {
    const targetRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [style, setStyle] = useState(null);

    useEffect(() => {
        if (!visible || !targetRef.current) return;

        const rect = targetRef.current.getBoundingClientRect();
        const tooltipWidth = Math.max(70, label.length * 7 + 24); // dynamic width
        const tooltipHeight = 28; // predictable height

        let top, left;

        const centerX = rect.left + rect.width / 2 - tooltipWidth / 2;

        // === DEFAULT TOP POSITION ===
        top = rect.top - tooltipHeight - offset;
        left = centerX;

        // === FLIP TO BOTTOM IF NO SPACE ABOVE ===
        if (top < 0) {
            top = rect.bottom + offset;
        }

        // === CLAMP LEFT/RIGHT TO VIEWPORT ===
        const rightEdge = left + tooltipWidth;
        const viewportWidth = window.innerWidth;

        if (rightEdge > viewportWidth - 8) {
            left = viewportWidth - tooltipWidth - 8;
        }

        if (left < 8) {
            left = 8;
        }

        setStyle({
            top,
            left,
            width: tooltipWidth,
        });
    }, [visible, label, offset]);

    return (
        <>
            <span
                ref={targetRef}
                className="inline-flex"
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                onTouchStart={() => setVisible(true)}
                onTouchEnd={() => setVisible(false)}
            >
                {children}
            </span>

            {visible &&
                style &&
                createPortal(
                    <div
                        className="
                            fixed z-[99999]
                            px-2 py-1 text-xs font-medium
                            rounded-md shadow-lg
                            bg-gray-900 text-white
                            dark:bg-white dark:text-black
                            backdrop-blur-sm
                            animate-tooltip-enter
                            pointer-events-none select-none
                        "
                        style={style}
                    >
                        {label}
                    </div>,
                    document.body
                )}
        </>
    );
};

export default Tooltip;
