
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
import { Eye, Link as LinkIcon, Plus, LayoutGrid, Type, FolderPlus, Smartphone, X } from "lucide-react";

import IconPickerDrawer from "../components/icon-picker/IconPickerDrawer";

// Drag & Drop
import {
    DndContext,
    closestCenter,
    PointerSensor,
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
    const [addMenuOpen, setAddMenuOpen] = useState(false); // New "Add" dropdown/modal
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
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
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
        // Optimistic
        setLinks(prev => prev.map(l => l._id === id ? { ...l, isActive: checked } : l));
        try {   
            await updateLink(id, { isActive: checked }); 
        } catch {
            setLinks(prev => prev.map(l => l._id === id ? { ...l, isActive: !checked } : l)); // Revert
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
        
        // Safety check
        if (oldIndex === -1 || newIndex === -1) return;

        // Perform reorder in memory
        const newOrder = arrayMove(links, oldIndex, newIndex);
        setLinks(newOrder); // Optimistic UI update

        try {
            // Send the entire list of IDs to backend. 
            // The backend sets order: i+1 for each ID.
            // Since newOrder reflects the exact state of the UI (which respects nesting via parentId),
            // this "one-dimensional" reorder works perfectly for both Root and Nested items visually.
            const orderedIds = newOrder.map(l => String(l._id));
            await reorderLinks(orderedIds);
        } catch {
            setLinks(links); // Revert on failure
            toast.error("Failed to reorder");
        }
    };

    // UTILS
    const openCreateModal = (type, parentId = null) => {
        setForm({ title: "", url: "", description: "", type, parentId });
        setOpenModal(true);
        setAddMenuOpen(false);
    };

    const isFreeLimitReached = user.plan === "free" && links.length >= PLAN_LIMITS.free.maxLinks;

    // RENDER HELPERS
    const rootLinks = links.filter(l => !l.parentId);

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden">
            
            {/* LEFT PANEL: EDITOR */}
            <div className="flex-1 h-full overflow-y-auto custom-scrollbar p-6 lg:p-10 pb-32">
                 <div className="max-w-2xl mx-auto space-y-8">
                     
                     {/* Header */}
                     <header className="flex items-center justify-between">
                         <h1 className="text-3xl font-bold font-heading text-neutral-900 dark:text-white">Content</h1>
                         
                         {/* Mobile Preview Toggle */}
                         <button 
                            className="lg:hidden p-2 text-neutral-500 hover:text-indigo-600 transition-colors"
                            onClick={() => setShowMobilePreview(true)}
                        >
                             <Eye className="w-6 h-6" />
                         </button>
                     </header>

                    {/* Add Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            disabled={isFreeLimitReached}
                            onClick={() => openCreateModal('link')}
                            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Add Link</span>
                        </button>

                        <button
                            onClick={() => openCreateModal('collection')}
                            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FolderPlus className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Add Collection</span>
                        </button>
                    </div>

                    {/* Limit Warning */}
                    {isFreeLimitReached && (
                        <PaywallCard 
                            title="Limit Reached" 
                            description="Upgrade to Pro to add unlimited links and unlock advanced features." 
                            compact
                        />
                    )}

                    {/* Content List */}
                    <div className="space-y-4 min-h-[200px]">
                        {loading ? (
                             <div className="flex justify-center p-10"><span className="loading loading-spinner loading-md"></span></div>
                        ) : links.length === 0 ? (
                            <div className="text-center py-12 text-neutral-500">
                                <TypingPlaceholder />
                                <p className="mt-4">Start by adding your first link or collection.</p>
                            </div>
                        ) : (
                            <DndContext 
                                sensors={sensors} 
                                collisionDetection={closestCenter} 
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext items={rootLinks.map(l => l._id)} strategy={verticalListSortingStrategy}>
                                    <div className="flex flex-col gap-4">
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
                                         <div className="opacity-90 scale-105">
                                             {/* Simplified Drag Preview */}
                                             <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-indigo-500">
                                                 {activeDragItem.title}
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
            {/* RIGHT PANEL: LIVE PREVIEW (Desktop) */}
<div className="hidden lg:flex w-[420px] border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0F0F14] justify-center pt-10 overflow-y-auto custom-scrollbar">
    <div className="sticky top-10 h-fit scale-[0.9] xl:scale-[0.85] 2xl:scale-[0.8] transition-transform">
        
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-1.5 rounded-full shadow-sm text-xs font-medium text-neutral-500 z-10">
            Live Preview
        </div>

        {/* Phone Mockup */}
        <div className="bg-neutral-900 rounded-[2.75rem] border-[6px] border-neutral-900 p-2 shadow-2xl h-[560px] w-[320px] mx-auto overflow-hidden relative ring-1 ring-white/10">
            
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-neutral-900 rounded-b-2xl z-20" />

            {/* Screen */}
            <div className="w-full h-full bg-white dark:bg-neutral-950 rounded-[2.3rem] overflow-hidden">
                <LivePreview user={user} links={links} />
            </div>
        </div>
    </div>
</div>


            {/* MOBILE PREVIEW MODAL */}
            {showMobilePreview && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowMobilePreview(false)}>
                     <div className="relative w-full max-w-sm h-[80vh] bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                         <button onClick={() => setShowMobilePreview(false)} className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full"><X className="w-5 h-5"/></button>
                         <LivePreview user={user} links={links} />
                     </div>
                </div>
            )}

            {/* --- MODALS --- */}

            {/* Create/Add Modal */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    {form.type === 'collection' ? <FolderPlus className="w-6 h-6 text-indigo-500"/> : <LinkIcon className="w-6 h-6 text-indigo-500"/> }
                    {form.type === 'collection' ? 'New Collection' : 'New Link'} 
                    {form.parentId && <span className="text-sm font-normal text-neutral-400 ml-2">(Inside Collection)</span>}
                </h2>
                
                <form onSubmit={handleCreate} className="space-y-4">
                    <InputField
                         label="Title"
                         name="title"
                         value={form.title}
                         onChange={handleChange}
                         placeholder={form.type === 'collection' ? "e.g. My Music" : "e.g. My Portfolio"}
                         required
                    />
                    
                    {form.type !== 'collection' && (
                        <InputField
                            label="URL"
                            name="url"
                            value={form.url}
                            onChange={handleChange}
                            placeholder="https://"
                            required
                        />
                    )}
                    
                    <div className="flex justify-end gap-3 mt-6">
                         <Button text="Cancel" variant="ghost" onClick={() => setOpenModal(false)} />
                         <Button text="Create" type="submit" loading={creating} variant="primary" />
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

// Simple placeholder
const TypingPlaceholder = () => (
    <div className="flex gap-1 justify-center opacity-30">
        <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
)

export default Links;
