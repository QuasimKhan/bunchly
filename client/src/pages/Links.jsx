import React, { useEffect, useState } from "react";
import {
    getLinks,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
} from "../services/linkService";

import Button from "../components/ui/Button";
// import Modal from "../components/ui/Modal"; // Replaced by AddBlockModal
import LinkCard from "../components/link-card/LinkCard";
import SortableLink from "../components/links/SortableLink";
import CollectionItem from "../components/links/CollectionItem";
import DeleteConfirmModal from "../components/ui/DeleteConfirmModal";
import EditLinkModal from "../components/links/EditLinkModal";
import AddBlockModal from "../components/links/AddBlockModal"; // NEW
import ProductCard from "../components/links/ProductCard"; // NEW
import SectionHeader from "../components/links/SectionHeader"; // NEW

import { toast } from "sonner";
import { Eye, Link as LinkIcon, Plus, FolderPlus, X, Sparkles, Smartphone, Layers, ShoppingBag } from "lucide-react";

import IconPickerDrawer from "../components/icon-picker/IconPickerDrawer";

// Drag & Drop
import {
    DndContext,
    closestCenter,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragOverlay
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import InputField from "../components/ui/InputField";
import { useAuth } from "../context/AuthContext";
import { PLAN_LIMITS } from "../lib/planLimits.js";
import LivePreview from "../components/preview/LivePreview";
import PaywallCard from "../components/paywall/PaywallCard.jsx";

const Links = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    // MODALS
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addParentId, setAddParentId] = useState(null); // If adding to collection

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [editing, setEditing] = useState(false);

    // ICON PICKER
    const [iconPickerOpen, setIconPickerOpen] = useState(false);
    const [iconPickerFor, setIconPickerFor] = useState(null); 

    // MOBILE PREVIEW TOGGLE
    const [showMobilePreview, setShowMobilePreview] = useState(false);

    const { user } = useAuth();
    
    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { 
            activationConstraint: { delay: 250, tolerance: 5 } 
        })
    );
    
    const [activeDragItem, setActiveDragItem] = useState(null);

    // FETCH
    const fetchLinks = async () => {
        try {
            setLoading(true);
            const data = await getLinks();
            setLinks(data);
        } catch {
            toast.error("Failed to load content");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLinks(); }, []);

    // TOGGLE ACTIVE
    const handleToggle = async (id, checked) => {
        setLinks(prev => prev.map(l => l._id === id ? { ...l, isActive: checked } : l));
        try {   
            await updateLink(id, { isActive: checked }); 
        } catch {
            setLinks(prev => prev.map(l => l._id === id ? { ...l, isActive: !checked } : l));
            toast.error("Failed to update");
        }
    };

    // CREATE (From AddBlockModal)
    const handleCreate = async (formData) => {
        // formData contains { title, url, type, parentId, imageUrl, price ... }
        try {
            await createLink(formData);
            toast.success("Added successfully");
            setAddModalOpen(false);
            fetchLinks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create");
            throw err; // Allow modal to handle error state if needed
        }
    };

    // REORDER
    const handleDragStart = (event) => {
        const { active } = event;
        setActiveDragItem(links.find(l => l._id === active.id));
    };

    const handleDragEnd = async ({ active, over }) => {
        setActiveDragItem(null);
        if (!over || active.id === over.id) return;

        const oldIndex = links.findIndex((l) => l._id === active.id);
        const newIndex = links.findIndex((l) => l._id === over.id);
        
        if (oldIndex === -1 || newIndex === -1) return;

        const newOrder = arrayMove(links, oldIndex, newIndex);
        setLinks(newOrder);

        try {
            const orderedIds = newOrder.map(l => String(l._id));
            await reorderLinks(orderedIds);
        } catch {
            setLinks(links); 
            toast.error("Failed to reorder");
        }
    };

    // Helper: Open Add Modal
    const openAddModal = (parentId = null) => {
        setAddParentId(parentId);
        setAddModalOpen(true);
    };

    // LIMITS LOGIC
    // We count "items" vs "collections" generally.
    const isFree = user.plan === "free";
    const maxLinks = PLAN_LIMITS.free.maxLinks || 10;
    const maxCollections = PLAN_LIMITS.free.maxCollections || 2;

    const linkCount = links.filter(l => l.type !== 'collection').length;
    const collectionCount = links.filter(l => l.type === 'collection').length;
    
    const isLimitReached = isFree && linkCount >= maxLinks; // simplified

    const rootLinks = links.filter(l => !l.parentId);

    // RENDER BLOCK GENERIC
    const renderBlock = (link) => {
        const commonProps = {
            link,
            onToggle: handleToggle,
            onEdit: (item) => { setEditData(item); setEditModalOpen(true); },
            onDelete: (id) => { setDeleteId(id); setDeleteModalOpen(true); },
            onOpenIconPicker: (l) => { setIconPickerFor(l); setIconPickerOpen(true); }
        };

        switch (link.type) {
            case 'collection':
                return (
                    <CollectionItem
                        {...commonProps}
                        childrenLinks={links.filter(l => l.parentId === link._id)}
                        onAddChild={(pid) => openAddModal(pid)}
                    />
                );
            case 'product':
                return <ProductCard {...commonProps} />;
            case 'header':
                return <SectionHeader {...commonProps} />;
            default:
                return <LinkCard {...commonProps} />;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full lg:h-[calc(100vh-80px)] overflow-hidden bg-neutral-50 dark:bg-[#0C0C0E]">
            
            {/* LEFT PANEL: EDITOR */}
            <div className="flex-1 h-full overflow-y-auto custom-scrollbar p-5 lg:p-10 pb-32 lg:pb-10 relative">
                 <div className="max-w-3xl mx-auto space-y-6 lg:space-y-8">
                     
                     {/* Header */}
                     <header className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                                     <Layers className="w-6 h-6" />
                                 </div>
                                 <h1 className="text-2xl lg:text-3xl font-bold font-heading text-neutral-900 dark:text-white">
                                     Content
                                 </h1>
                             </div>

                             {/* Mobile Preview Toggle */}
                             <button 
                                className="lg:hidden p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 transition-colors cursor-pointer"
                                onClick={() => setShowMobilePreview(true)}
                            >
                                 <Eye className="w-5 h-5" />
                             </button>
                        </div>
                        <p className="text-neutral-500 max-w-lg">
                            Manage your public profile links, products, and collections.
                        </p>
                     </header>

                    {/* Add Button (Unified) */}
                    <div>
                        <button
                            disabled={isLimitReached}
                            onClick={() => openAddModal(null)}
                            className="w-full group flex items-center justify-center gap-3 p-6 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/20 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                Add Content Block
                            </span>
                        </button>
                         {isLimitReached && (
                             <p className="text-center text-xs text-rose-500 mt-2">
                                Free plan limit reached. Upgrade to Pro for more.
                             </p>
                         )}
                    </div>

                    {/* Content List */}
                    <div className="space-y-4 min-h-[300px]">
                        {loading ? (
                             <div className="flex justify-center p-12">
                                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                             </div>
                        ) : links.length === 0 ? (
                            <div className="text-center py-20 px-6 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/20">
                                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Start Building</h3>
                                <p className="text-neutral-500 mt-2 max-w-sm mx-auto">
                                    Your page is empty. Add a link, product, or collection to get started.
                                </p>
                            </div>
                        ) : (
                            <DndContext 
                                sensors={sensors} 
                                collisionDetection={closestCenter} 
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext items={rootLinks.map(l => l._id)} strategy={verticalListSortingStrategy}>
                                    <div className="flex flex-col gap-4 pb-20 lg:pb-0">
                                        {rootLinks.map((link) => (
                                            <SortableLink key={link._id} id={link._id}>
                                                {renderBlock(link)}
                                            </SortableLink>
                                        ))}
                                    </div>
                                </SortableContext>
                                <DragOverlay>
                                    {activeDragItem ? (
                                         <div className="opacity-90 scale-105 rotate-2 cursor-grabbing">
                                             <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-indigo-500/50 ring-4 ring-indigo-500/10">
                                                 <span className="font-semibold text-neutral-900 dark:text-white">{activeDragItem.title}</span>
                                             </div>
                                         </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        )}
                    </div>

                 </div>
            </div>

            {/* RIGHT PANEL: LIVE PREVIEW (Desktop) */}
            <div className="hidden lg:flex w-[480px] border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#0F0F14] justify-center pt-12 overflow-y-auto custom-scrollbar relative">
                <div className="sticky top-8 h-fit scale-[0.85] 2xl:scale-[0.9] transition-transform origin-top">
                    {/* The Premium Phone Mockup */}
                    <div className="bg-neutral-900 rounded-[3rem] border-[10px] border-neutral-900 p-2 shadow-2xl h-[720px] w-[360px] mx-auto overflow-hidden relative ring-1 ring-white/10">
                      
                        
                        {/* Side Buttons */}
                        <div className="absolute top-24 -right-3 w-1 h-12 bg-neutral-800 rounded-r-md"></div>
                        <div className="absolute top-24 -left-3 w-1 h-8 bg-neutral-800 rounded-l-md"></div>
                        <div className="absolute top-36 -left-3 w-1 h-12 bg-neutral-800 rounded-l-md"></div>

                        {/* Screen */}
                        <div className="w-full h-full bg-white dark:bg-neutral-950 rounded-[2.2rem] overflow-hidden relative border border-neutral-800">
                            <LivePreview user={user} links={links} mode="preview" />
                        </div>
                    </div>

                    {/* Pulsating Badge Below */}
                    <div className="text-center mt-6 text-sm font-medium text-neutral-400">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-sm backdrop-blur-sm mb-6 sm:mb-8 transition-transform hover:scale-105 cursor-default">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                                Live Preview
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE PREVIEW MODAL */}
            {showMobilePreview && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-4" onClick={() => setShowMobilePreview(false)}>
                     <div 
                        className="relative w-full sm:max-w-[380px] h-[90vh] sm:h-[80vh] bg-white dark:bg-neutral-900 rounded-t-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col animate-slide-up" 
                        onClick={e => e.stopPropagation()}
                    >
                         {/* Header */}
                         <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
                             <h3 className="font-semibold text-neutral-900 dark:text-white pl-2">Live Preview</h3>
                             <button onClick={() => setShowMobilePreview(false)} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-500">
                                 <X className="w-5 h-5"/>
                             </button>
                         </div>
                         
                         <div className="flex-1 overflow-hidden relative">
                            <LivePreview user={user} links={links} />
                         </div>
                     </div>
                </div>
            )}

            {/* --- MODALS --- */}

            <AddBlockModal 
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onCreate={handleCreate}
                parentId={addParentId}
            />

            <EditLinkModal 
                open={editModalOpen} 
                link={editData} 
                onClose={() => setEditModalOpen(false)} 
                onSave={async (updated) => {
                     setEditing(true);
                     try { await updateLink(editData._id, updated); fetchLinks(); setEditModalOpen(false); toast.success("Updated"); }
                     catch { toast.error("Failed"); } finally { setEditing(false); }
                }}
            />

            <DeleteConfirmModal 
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={async () => {
                     setDeleting(true);
                     try { await deleteLink(deleteId); fetchLinks(); toast.success("Deleted"); }
                     catch { toast.error("Failed"); } finally { setDeleting(false); setDeleteModalOpen(false); }
                }}
                deleting={deleting}
            />

            <IconPickerDrawer 
                open={iconPickerOpen}
                onClose={() => setIconPickerOpen(false)}
                onSelect={async (slug) => {
                    if (!iconPickerFor) return;
                    try { 
                        setLinks(prev => prev.map(l => l._id === iconPickerFor._id ? { ...l, icon: slug } : l));
                        await updateLink(iconPickerFor._id, { icon: slug }); 
                        setIconPickerOpen(false); 
                    } catch { toast.error("Failed to set icon"); fetchLinks(); }
                }}
            />

        </div>
    );
};

export default Links;
