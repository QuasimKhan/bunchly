// src/components/link-card/LinkActions.jsx
import React from "react";
import { Pencil, Trash2, Sparkles } from "lucide-react";
import SwitchToggle from "../ui/SwitchToggle";
import Button from "../ui/Button";

/**
 * LinkActions
 * ---------------------
 * Uses the global Button component for:
 * - Icon Picker
 * - Edit
 * - Delete
 * - Toggle
 *
 * Buttons now inherit:
 * - size="sm"
 * - variant styles
 * - consistent spacing + animation
 */

const LinkActions = ({
    link,
    onEdit,
    onDelete,
    onToggle,
    onOpenIconPicker,
}) => {
    return (
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Icon Picker Button */}
            <Button
                icon={Sparkles}
                size="sm"
                variant="ghost"
                className="!p-1.5 sm:!p-2 !bg-white/8 hover:!bg-white/12 text-indigo-300"
                onClick={() => onOpenIconPicker(link)}
            />

            {/* Edit Button */}
            <Button
                icon={Pencil}
                size="sm"
                variant="ghost"
                className="!p-1.5 sm:!p-2 !bg-white/8 hover:!bg-white/12 text-gray-200"
                onClick={() => onEdit(link)}
            />

            {/* Delete Button */}
            <Button
                icon={Trash2}
                size="sm"
                variant="ghost"
                className="!p-1.5 sm:!p-2 !bg-red-500/10 hover:!bg-red-500/20 text-red-400"
                onClick={() => onDelete(link._id)}
            />

            {/* Toggle Switch */}
            <SwitchToggle
                checked={link.isActive}
                onChange={(checked) => onToggle(link._id, checked)}
            />
        </div>
    );
};

export default LinkActions;
