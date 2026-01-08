import React, { useEffect, useState } from "react";
import {
    getLinks,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
} from "../services/linkService";

import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import LinkCard from "../components/link-card/LinkCard";
import SortableLink from "../components/links/SortableLink";
import CollectionItem from "../components/links/CollectionItem";
import DeleteConfirmModal from "../components/ui/DeleteConfirmModal";
import EditLinkModal from "../components/links/EditLinkModal";

import { toast } from "sonner";
import { Eye, Link as LinkIcon, Plus, FolderPlus, X, Sparkles, Smartphone, Layers } from "lucide-react";

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
    const [openModal, setOpenModal] = useState(false);
    const [form, setForm] = useState({ title: "", url: "", description: "", type: "link", parentId: null });
    const [error, setError] = useState("");
    const [creating, setCreating] = useState(false);

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
    
    // Improved Sensors for Mobile/Touch
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { 
            activationConstraint: { delay: 250, tolerance: 5 } // Hold to drag on mobile
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

    // HANDLE FORM CHANGE
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // CREATE
    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        setError("");
        
        if (form.type === 'link' && (!form.title.trim() || !form.url.trim())) {
            setError("Title and URL are required"); setCreating(false); return;
        }
        if (form.type === 'collection' && !form.title.trim()) {
             setError("Collection title is required"); setCreating(false); return;
        }

        try {
            await createLink(form);
            toast.success(`${form.type === 'collection' ? 'Collection' : 'Link'} created`);
            setOpenModal(false);
            fetchLinks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create");
        } finally {
            setCreating(false);
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

    // UTILS
    const openCreateModal = (type, parentId = null) => {
        setForm({ title: "", url: "", description: "", type, parentId });
        setOpenModal(true);
    };

    // LIMITS LOGIC
    const linkCount = links.filter(l => l.type !== 'collection').length;
    const collectionCount = links.filter(l => l.type === 'collection').length;
    const isFree = user.plan === "free";
    
    // Safety defaults
    const maxLinks = PLAN_LIMITS.free.maxLinks || 3;
    const maxCollections = PLAN_LIMITS.free.maxCollections || 1;

    const isLinkLimitReached = isFree && linkCount >= maxLinks;
    const isCollectionLimitReached = isFree && collectionCount >= maxCollections;

    const rootLinks = links.filter(l => !l.parentId);

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
                            Manage your public profile links and collections. Drag to reorder.
                        </p>
                     </header>

                    {/* Add Buttons */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <button
                            disabled={isLinkLimitReached}
                            onClick={() => openCreateModal('link')}
                            className="group flex flex-col items-center justify-center gap-4 p-6 sm:p-8 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/20 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                                <span className="block font-semibold text-neutral-900 dark:text-neutral-100">
                                    {isLinkLimitReached ? "Limit Reached" : "Add Link"}
                                </span>
                                <span className="text-xs text-neutral-400 mt-1">
                                    {isLinkLimitReached ? "Upgrade for more" : "URL, Music, Video"}
                                </span>
                            </div>
                        </button>

                        <button
                            disabled={isCollectionLimitReached}
                            onClick={() => openCreateModal('collection')}
                            className="group flex flex-col items-center justify-center gap-4 p-6 sm:p-8 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/20 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                <FolderPlus className="w-6 h-6" />
                            </div>
                             <div className="text-center">
                                <span className="block font-semibold text-neutral-900 dark:text-neutral-100">
                                    {isCollectionLimitReached ? "Limit Reached" : "Add Collection"}
                                </span>
                                <span className="text-xs text-neutral-400 mt-1">
                                    {isCollectionLimitReached ? "Upgrade for more" : "Group your links"}
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* Limit Warning */}
                    {(isLinkLimitReached || isCollectionLimitReached) && (
                        <PaywallCard 
                            title="Limit Reached" 
                            description="Upgrade to Pro to add unlimited links and unlock advanced features." 
                            compact
                        />
                    )}

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
                                    Your page is empty. Add your first link or collection to get started.
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
                                                {link.type === 'collection' ? (
                                                    <CollectionItem
                                                        link={link}
                                                        childrenLinks={links.filter(l => l.parentId === link._id)}
                                                        onToggle={handleToggle}
                                                        onEdit={(item) => { setEditData(item); setEditModalOpen(true); }}
                                                        onDelete={(id) => { setDeleteId(id); setDeleteModalOpen(true); }}
                                                        onAddChild={(pid) => openCreateModal('link', pid)}
                                                        onOpenIconPicker={(l) => { setIconPickerFor(l); setIconPickerOpen(true); }}
                                                    />
                                                ) : (
                                                    <LinkCard 
                                                        link={link}
                                                        onToggle={handleToggle}
                                                        onEdit={(item) => { setEditData(item); setEditModalOpen(true); }}
                                                        onDelete={(id) => { setDeleteId(id); setDeleteModalOpen(true); }}
                                                        onOpenIconPicker={(l) => { setIconPickerFor(l); setIconPickerOpen(true); }}
                                                    />
                                                )}
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
                <div className="sticky top-10 h-fit scale-[0.85] 2xl:scale-[0.85] transition-transform origin-top">
                    
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-1.5 rounded-full shadow-sm text-xs font-medium text-neutral-500 z-10 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live Preview
                    </div>

                    {/* Phone Mockup */}
                    <div className="bg-[#1a1a1a] rounded-[3rem] p-3 shadow-2xl h-[700px] w-[350px] mx-auto overflow-hidden relative ring-1 ring-white/10 ring-offset-4 ring-offset-neutral-100 dark:ring-offset-black">
                         {/* Side Buttons */}
                         <div className="absolute top-24 -left-1 w-1 h-10 bg-neutral-700 rounded-l-md"></div>
                         <div className="absolute top-40 -left-1 w-1 h-16 bg-neutral-700 rounded-l-md"></div>
                         <div className="absolute top-24 -right-1 w-1 h-16 bg-neutral-700 rounded-r-md"></div>

                        {/* Screen */}
                        <div className="w-full h-full bg-white dark:bg-black rounded-[2.5rem] overflow-hidden relative isolate">
                            {/* Dynamic Island / Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50 flex justify-center items-center">
                                <div className="w-12 h-1 bg-neutral-800/50 rounded-full"></div>
                            </div>
                            
                            <LivePreview user={user} links={links} />
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

            {/* Create/Add Modal */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                         {form.type === 'collection' ? <FolderPlus className="w-6 h-6"/> : <LinkIcon className="w-6 h-6"/> }
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                        {form.type === 'collection' ? 'Create Collection' : 'Add Link'}
                    </h2>
                    {form.parentId && <p className="text-sm text-neutral-500 mt-1">Adding to collection</p>}
                </div>
                
                <form onSubmit={handleCreate} className="space-y-4">
                    <InputField
                         label="Title"
                         name="title"
                         value={form.title}
                         onChange={handleChange}
                         placeholder={form.type === 'collection' ? "e.g. My Music" : "e.g. My Portfolio"}
                         required
                         autoFocus
                    />
                    
                    {form.type !== 'collection' && (
                        <InputField
                            label="URL"
                            name="url"
                            value={form.url}
                            onChange={handleChange}
                            placeholder="https://"
                            required={form.type === 'link'}
                        />
                    )}
                    
                    <div className="flex gap-3 mt-8">
                         <Button text="Cancel" variant="outline" fullWidth onClick={() => setOpenModal(false)} />
                         <Button 
                            text="Create" 
                            type="submit" 
                            loading={creating} 
                            fullWidth 
                            disabled={!form.title || (form.type !== 'collection' && !form.url)}
                            className={(!form.title || (form.type !== 'collection' && !form.url)) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        />
                    </div>
                </form>
            </Modal>

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
