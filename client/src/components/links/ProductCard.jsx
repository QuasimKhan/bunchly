import React from "react";
import { Edit3, Trash2, ShoppingBag } from "lucide-react";
import { Switch } from "@headlessui/react";
import LinkFavicon from "../link-card/LinkFavicon";
import LinkDragHandle from "../link-card/LinkDragHandle";

const ProductCard = ({ link, onEdit, onDelete, onToggle }) => {
    return (
        <div className="group relative rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 p-3 flex gap-4 overflow-hidden">
            
            {/* Drag Handle */}
            <LinkDragHandle className="mr-0" />

            {/* Product Image */}
            <div className="relative w-20 h-20 shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-neutral-100 dark:border-neutral-700">
                {link.imageUrl ? (
                    <img 
                        src={link.imageUrl} 
                        alt={link.title} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <ShoppingBag className="w-8 h-8 opacity-20" />
                    </div>
                )}
                 {/* Price Tag if exists */}
                 {link.price && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold text-center py-0.5">
                        {link.currency} {link.price}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate pr-4">
                    {link.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                     {/* Show platform icon if available */}
                     {link.icon && <LinkFavicon url={link.url} icon={link.icon} size={14} className="opacity-70" />}
                     <span className="text-xs text-neutral-400 truncate max-w-[200px]">
                        {link.url}
                     </span>
                </div>
                {/* Type Badge */}
                <div className="mt-2 flex">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-800">
                        Product
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center justify-between py-1">
                 <div className="flex gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(link); }}
                        className="p-1.5 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(link._id); }}
                        className="p-1.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                 </div>

                 <Switch
                    checked={link.isActive}
                    onChange={(checked) => onToggle(link._id, checked)}
                    className={`${
                        link.isActive ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-neutral-700'
                    } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none`}
                >
                    <span
                        className={`${
                            link.isActive ? 'translate-x-4' : 'translate-x-1'
                        } inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm`}
                    />
                </Switch>
            </div>
        </div>
    );
};

export default ProductCard;
