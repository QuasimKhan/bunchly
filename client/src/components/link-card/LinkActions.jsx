// src/components/link-card/LinkActions.jsx
import React from "react";
import { Pencil, Trash2, Sparkles } from "lucide-react";
import SwitchToggle from "../ui/SwitchToggle";
import Button from "../ui/Button";

const LinkActions = ({
    link,
    onEdit,
    onDelete,
    onToggle,
    onOpenIconPicker,
}) => {
    return (
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Icon Picker */}
            <Button
                icon={Sparkles}
                size="sm"
                variant="ghost"
                className="!p-1.5 sm:!p-2 !bg-indigo-50 dark:!bg-indigo-900/20 hover:!bg-indigo-100 dark:hover:!bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                onClick={() => onOpenIconPicker(link)}
            />

            {/* Edit */}
            <Button
                icon={Pencil}
                size="sm"
                variant="ghost"
                className="!p-1.5 sm:!p-2 !bg-neutral-100 dark:!bg-neutral-800 hover:!bg-neutral-200 dark:hover:!bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-pointer"
                onClick={() => onEdit(link)}
            />

            {/* Delete */}
            <Button
                icon={Trash2}
                size="sm"
                variant="ghost"
                className="!p-1.5 sm:!p-2 !bg-red-50 dark:!bg-red-900/10 hover:!bg-red-100 dark:hover:!bg-red-900/20 text-red-600 dark:text-red-400 cursor-pointer"
                onClick={() => onDelete(link._id)}
            />

            {/* Toggle */}
            <SwitchToggle
                checked={link.isActive}
                onChange={(checked) => onToggle(link._id, checked)} // ONLY BOOLEAN
            />
        </div>
    );
};

export default LinkActions;
