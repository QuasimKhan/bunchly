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
                className="!p-1.5 sm:!p-2 !bg-white/8 hover:!bg-white/12 text-indigo-300"
                onClick={() => onOpenIconPicker(link)}
            />

            {/* Edit */}
            <Button
                icon={Pencil}
                size="sm"
                variant="ghost"
                className="!p-1.5 sm:!p-2 !bg-white/8 hover:!bg-white/12 text-gray-200"
                onClick={() => onEdit(link)}
            />

            {/* Delete */}
            <Button
                icon={Trash2}
                size="sm"
                variant="ghost"
                className="!p-1.5 sm:!p-2 !bg-red-500/10 hover:!bg-red-500/20 text-red-400"
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
