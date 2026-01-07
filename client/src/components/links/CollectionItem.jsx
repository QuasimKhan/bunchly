
import React, { useState } from "react";
import { Copy, Edit3, Trash2, FolderOpen, Plus, ChevronDown, ChevronRight, Share2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@headlessui/react"; // or use your custom toggle
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableLink from "./SortableLink";
import LinkCard from "../link-card/LinkCard"; 
import LinkDragHandle from "../link-card/LinkDragHandle";
import LinkFavicon from "../link-card/LinkFavicon";

const CollectionItem = ({ 
    link, 
    childrenLinks = [], 
    onToggle,
    onEdit,
    onDelete,
    onAddChild,
    onOpenIconPicker,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/l/${link._id}`); // Or collection public link if supported
            toast.success("Collection Link Copied");
        } catch {}
    };

    return (
        <div className="group relative rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700">
            {/* Header / Main Bar */}
            <div className="flex items-center p-4 gap-4">
                {/* Drag Handle */}
                <LinkDragHandle />

                {/* Icon Wrapper */}
                <div 
                    onClick={(e) => { e.stopPropagation(); onOpenIconPicker(link); }}
                    className="cursor-pointer relative group/icon"
                >
                    <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center text-2xl border transition-all duration-300
                        ${isOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-500/30 dark:text-indigo-400' : 'bg-neutral-50 border-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400'}
                        group-hover/icon:border-indigo-300 dark:group-hover/icon:border-indigo-500/50
                    `}>
                        {link.icon ? (
                             <LinkFavicon url={link.url} icon={link.icon} size={24} />
                        ) : (
                             <FolderOpen className="w-6 h-6" />
                        )}
                        
                        {/* Edit overlay */}
                        <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/icon:opacity-100 flex items-center justify-center transition-opacity">
                            <Edit3 className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>

                {/* Meta Info */}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 truncate flex items-center gap-2">
                        {link.title}
                    </h3>
                    <p className="text-sm text-neutral-500 truncate flex items-center gap-2 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${childrenLinks.length > 0 ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}></span>
                        {childrenLinks.length} items
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                     <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`p-2 rounded-lg transition-all ${isOpen ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 rotate-180' : 'text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </button>

                    <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 hidden sm:block"></div>

                     <button
                        onClick={(e) => { e.stopPropagation(); onEdit(link); }}
                        className="p-2 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors hidden sm:block"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(link._id); }}
                        className="p-2 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors hidden sm:block"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    
                    {/* Mobile Menu Trigger could go here for edit/delete on small screens, kept simple for now */}
                    
                     <div 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center ml-1"
                    >
                        <Switch
                            checked={link.isActive}
                            onChange={(checked) => onToggle(link._id, checked)}
                            className={`${
                                link.isActive ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-neutral-700'
                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
                        >
                            <span
                                className={`${
                                    link.isActive ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
                            />
                        </Switch>
                    </div>
                </div>
            </div>

            {/* Expanded Content (Children) */}
            {isOpen && (
                 <div className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-black/20 p-4 pt-6 rounded-b-2xl">
                     <SortableContext
                        items={childrenLinks.map((l) => l._id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3 pl-4 border-l-2 border-indigo-100 dark:border-indigo-900/30 ml-2">
                            {childrenLinks.map((child) => (
                               <SortableLink key={child._id} id={child._id}>
                                  <LinkCard
                                    link={child}
                                    onToggle={onToggle}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onOpenIconPicker={onOpenIconPicker}
                                    // Use the className we added support for!
                                    className="!bg-white dark:!bg-neutral-800 !border-neutral-200 dark:!border-neutral-700/50 !shadow-sm hover:!shadow-md scale-100"
                                  />
                               </SortableLink>
                            ))}
                        </div>
                    </SortableContext>
                    
                    {/* Add Item Button */}
                    <button 
                        onClick={() => onAddChild(link._id)}
                        className="w-full mt-4 py-3 border-2 border-dashed border-neutral-200 dark:border-neutral-700/50 rounded-xl text-neutral-500 hover:text-indigo-600 hover:border-indigo-300 dark:hover:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all font-medium flex items-center justify-center gap-2 group ml-2 max-w-[calc(100%-1rem)]"
                    >
                        <div className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                            <Plus className="w-4 h-4" />
                        </div>
                        Add Link to Collection
                    </button>
                 </div>
            )}
        </div>
    );
};

export default CollectionItem;
