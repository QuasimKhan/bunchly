import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Edit3, Trash2 } from "lucide-react";
import LinkDragHandle from "../link-card/LinkDragHandle";

// For sections, we just want a nice text header
const SectionHeader = ({ link, onEdit, onDelete, onToggle }) => {
    
    return (
        <div className="group relative rounded-xl bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/50 p-3 transition-colors flex items-center gap-3">
             {/* Drag Handle (visible on hover) */}
             <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <LinkDragHandle />
             </div>
            
            <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
                    {link.title}
                </h3>
            </div>

             {/* Actions */}
             <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(link)}
                    className="p-1.5 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(link._id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default SectionHeader;
