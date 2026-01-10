import React, { useState } from "react";
import { Copy, Edit3, Trash2, FolderOpen, Plus, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@headlessui/react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableLink from "./SortableLink";
import LinkCard from "../link-card/LinkCard"; 
import ProductCard from "./ProductCard"; // NEW
import SectionHeader from "./SectionHeader"; // NEW
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
    // Default open if it has children? or keep persistent state?
    // For now simple local state.
    const [isOpen, setIsOpen] = useState(false);

    // Helper to render child based on type
    const renderChild = (child) => {
        const commonProps = {
            link: child,
            onToggle,
            onEdit,
            onDelete,
            onOpenIconPicker,
            className: "!bg-white dark:!bg-neutral-900 !border-neutral-200 dark:!border-neutral-800 !shadow-sm hover:!shadow-md"
        };

        switch (child.type) {
            case 'product':
                return <ProductCard {...commonProps} />;
            case 'header':
                return <SectionHeader {...commonProps} />;
            default:
                return <LinkCard {...commonProps} />;
        }
    };

    return (
        <div className="group relative rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 overflow-hidden">
            {/* Header / Main Bar */}
            <div className={`
                flex items-center p-3 gap-3 transition-colors
                ${isOpen ? 'bg-neutral-50/50 dark:bg-neutral-800/30' : ''}
            `}>
                {/* Drag Handle */}
                <LinkDragHandle />

                {/* Icon Wrapper */}
                <div 
                    onClick={(e) => { e.stopPropagation(); onOpenIconPicker(link); }}
                    className="cursor-pointer relative group/icon shrink-0"
                >
                    <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center text-xl border transition-all duration-300
                        ${isOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-500/30 dark:text-indigo-400' : 'bg-neutral-50 border-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400'}
                        group-hover/icon:border-indigo-300 dark:group-hover/icon:border-indigo-500/50
                    `}>
                        {link.icon ? (
                             <LinkFavicon url={link.url} icon={link.icon} size={20} />
                        ) : (
                             <FolderOpen className="w-5 h-5" />
                        )}
                        
                        {/* Edit overlay */}
                        <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/icon:opacity-100 flex items-center justify-center transition-opacity">
                            <Edit3 className="w-3 h-3 text-white" />
                        </div>
                    </div>
                </div>

                {/* Meta Info */}
                <div className="flex-1 min-w-0 cursor-pointer select-none" onClick={() => setIsOpen(!isOpen)}>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate flex items-center gap-2">
                        {link.title}
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-lg text-neutral-500 border border-neutral-200 dark:border-neutral-700">
                             Collection
                        </span>
                    </h3>
                    <p className="text-sm text-neutral-500 truncate mt-0.5">
                       {childrenLinks.length} items inside
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                     <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`p-2 rounded-lg transition-all ${isOpen ? 'bg-white dark:bg-neutral-800 text-indigo-600  shadow-sm rotate-180' : 'text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </button>

                    <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-1"></div>

                    {/* Edit Btn */}
                     <button
                        onClick={(e) => { e.stopPropagation(); onEdit(link); }}
                        className="p-2 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors cursor-pointer"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    {/* Delete Btn */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(link._id); }}
                        className="p-2 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    
                    {/* Active Toggle */}
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
                 <div className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/20 p-2 sm:p-4 pb-4">
                     <SortableContext
                        items={childrenLinks.map((l) => l._id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {/* Nested Tree Line Visual */}
                        <div className="relative space-y-3 pl-2 sm:pl-4 border-l-2 border-indigo-200 dark:border-indigo-900/30 ml-2 sm:ml-4 my-1">
                            {childrenLinks.map((child) => (
                               <SortableLink key={child._id} id={child._id}>
                                  {renderChild(child)}
                               </SortableLink>
                            ))}

                            {/* Empty State for Collection */}
                            {childrenLinks.length === 0 && (
                                <div className="text-center py-6 text-sm text-neutral-400 italic">
                                    No items in this collection yet.
                                </div>
                            )}

                             {/* Add Item Button */}
                            <button 
                                onClick={() => onAddChild(link._id)}
                                className="w-full py-3 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-500 hover:text-indigo-600 hover:border-indigo-400 dark:hover:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all font-medium flex items-center justify-center gap-2 group"
                            >
                                <div className="p-1 rounded-md bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                                    <Plus className="w-3 h-3" />
                                </div>
                                Add to {link.title}
                            </button>
                        </div>
                    </SortableContext>
                 </div>
            )}
        </div>
    );
};

export default CollectionItem;
