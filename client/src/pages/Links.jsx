// src/pages/Links.jsx
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
import DeleteConfirmModal from "../components/ui/DeleteConfirmModal";
import EditLinkModal from "../components/links/EditLinkModal";

import { toast } from "sonner";
import { Eye, Link, ListPlus, PencilLineIcon, SquarePen } from "lucide-react";

import IconPickerDrawer from "../components/icon-picker/IconPickerDrawer";

// Drag & Drop imports
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import InputField from "../components/ui/InputField";
import { PreviewModal } from "../components/preview/PreviewModal";
import { useAuth } from "../context/AuthContext";

const Links = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);
    const [form, setForm] = useState({ title: "", url: "", description: "" });
    const [error, setError] = useState("");
    const [creating, setCreating] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [editing, setEditing] = useState(false);

    // ICON PICKER state
    const [iconPickerOpen, setIconPickerOpen] = useState(false);
    const [iconPickerFor, setIconPickerFor] = useState(null); // link object

    //PREVIEW LINK
    const [previewModalOpen, setPreviewModalOpen] = useState(false);

    // DND Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    // user
    const { user } = useAuth();

    // Fetch links
    const fetchLinks = async () => {
        try {
            setLoading(true);
            const data = await getLinks();
            setLinks(data);
        } catch {
            toast.error("Failed to fetch links");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    // Handle Add Form changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Create new link
    const handleCreateLink = async (e) => {
        e.preventDefault();

        setCreating(true);
        setError("");

        if (!form.title.trim() || !form.url.trim()) {
            setError("Title and URL are required");
            setCreating(false);
            return;
        }

        try {
            await createLink(form);
            toast.success("Link created successfully");
            setOpenModal(false);
            setForm({ title: "", url: "", description: "" });
            fetchLinks();
        } catch {
            toast.error("Failed to create link");
        } finally {
            setCreating(false);
        }
    };

    // Confirm delete
    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await deleteLink(deleteId);
            toast.success("Link deleted");
            fetchLinks();
        } catch {
            toast.error("Failed to delete link");
        } finally {
            setDeleting(false);
            setDeleteModalOpen(false);
            setDeleteId(null);
        }
    };

    // Handle drag-drop sorting
    const handleDragEnd = async ({ active, over }) => {
        if (!over) return;

        if (active.id !== over.id) {
            const oldIndex = links.findIndex((l) => l._id === active.id);
            const newIndex = links.findIndex((l) => l._id === over.id);

            const newOrder = arrayMove(links, oldIndex, newIndex);

            // update UI instantly
            setLinks(newOrder);

            // prepare orderedIds as strings (defensive)
            const orderedIds = newOrder.map((l) => String(l._id));

            // send to backend and handle errors by reverting UI
            try {
                const res = await reorderLinks(orderedIds);

                // Optional: if backend returns canonical ordered list, sync it
                if (res?.data?.data) {
                    setLinks(res.data.data);
                }
            } catch (err) {
                toast.error("Failed to save ordering — reverting");
                // revert to server state (safe)
                fetchLinks();
            }
        }
    };

    // -----------------------
    // Icon Picker helpers
    // -----------------------
    const openIconPicker = (link) => {
        setIconPickerFor(link);
        setIconPickerOpen(true);
    };

    const closeIconPicker = () => {
        setIconPickerFor(null);
        setIconPickerOpen(false);
    };

    const handleIconSelect = async (slug) => {
        if (!iconPickerFor) return;
        const id = iconPickerFor._id;
        try {
            await updateLink(id, { icon: slug });
            toast.success("Icon updated");
            closeIconPicker();
            // update local state optimistically or refetch
            // we choose to update local list quickly:
            setLinks((prev) =>
                prev.map((l) => (l._id === id ? { ...l, icon: slug } : l))
            );
        } catch {
            toast.error("Failed to update icon");
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6 mt-4">
                <h1 className="text-3xl font-bold">Your Links</h1>

                <div className="flex gap-4">
                    <Button
                        icon={Eye}
                        size="md"
                        text="Preview"
                        tooltip="Preview"
                        onClick={() => setPreviewModalOpen(true)}
                    />

                    <Button
                        icon={ListPlus}
                        size="md"
                        tooltip="Add Link"
                        onClick={() => {
                            setError("");
                            setOpenModal(true);
                        }}
                        className="bg-indigo-600! hover:bg-indigo-700! text-white 
                        shadow-lg shadow-indigo-500/20"
                    />
                </div>
            </div>

            {/* LOADING */}
            {loading && (
                <p className="text-gray-500 text-center">
                    Loading your links...
                </p>
            )}

            {/* EMPTY STATE */}
            {!loading && links.length === 0 && (
                <div className="text-center mt-10">
                    <p className="text-gray-500">
                        You haven't added any links yet.
                    </p>
                </div>
            )}

            {/* LIST + DRAG & DROP */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={links.map((l) => l._id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-4">
                        {links.map((link) => (
                            <SortableLink key={link._id} id={link._id}>
                                <LinkCard
                                    link={link}
                                    onToggle={async (id, checked) => {
                                        const previous = links.find(
                                            (l) => l._id === id
                                        )?.isActive;

                                        // Optimistic UI update
                                        setLinks((prev) =>
                                            prev.map((l) =>
                                                l._id === id
                                                    ? {
                                                          ...l,
                                                          isActive: checked,
                                                      }
                                                    : l
                                            )
                                        );

                                        try {
                                            await updateLink(id, {
                                                isActive: checked,
                                            });
                                            toast.success(
                                                checked
                                                    ? "Link is now active"
                                                    : "Link is now hidden"
                                            );
                                        } catch (error) {
                                            // Revert on error
                                            setLinks((prev) =>
                                                prev.map((l) =>
                                                    l._id === id
                                                        ? {
                                                              ...l,
                                                              isActive:
                                                                  previous,
                                                          }
                                                        : l
                                                )
                                            );
                                            toast.error(
                                                "Failed to update link visibility"
                                            );
                                        }
                                    }}
                                    onEdit={(item) => {
                                        setEditData(item);
                                        setEditModalOpen(true);
                                    }}
                                    onDelete={(id) => {
                                        setDeleteId(id);
                                        setDeleteModalOpen(true);
                                    }}
                                    onOpenIconPicker={(l) => openIconPicker(l)}
                                />
                            </SortableLink>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* ADD LINK MODAL */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <h2 className="text-xl font-semibold mb-4">Add New Link</h2>

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <form onSubmit={handleCreateLink} className="space-y-4">
                    <InputField
                        type="text"
                        name="title"
                        placeholder="Title"
                        icon={SquarePen}
                        value={form.title}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-white/10 dark:bg-white/5 
                            border border-white/20 outline-none"
                    />

                    <InputField
                        type="text"
                        name="url"
                        placeholder="https://example.com"
                        icon={Link}
                        value={form.url}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-white/10 dark:bg-white/5 
                            border border-white/20 outline-none"
                    />
                    <InputField
                        type="text"
                        name="description"
                        placeholder="Description (optional)"
                        icon={PencilLineIcon}
                        value={form.description}
                        onChange={handleChange}
                    />

                    <Button
                        text="Create Link"
                        type="submit"
                        fullWidth
                        size="md"
                        loading={creating}
                        className="!bg-indigo-600 hover:!bg-indigo-700 text-white 
                            shadow-lg shadow-indigo-500/20"
                        disabled={creating}
                        tooltip="Submit"
                    />
                </form>
            </Modal>

            {/* DELETE MODAL */}
            <DeleteConfirmModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                deleting={deleting}
            />

            {/* EDIT MODAL */}
            <EditLinkModal
                open={editModalOpen}
                link={editData}
                onClose={() => setEditModalOpen(false)}
                onSave={async (updated) => {
                    setEditing(true);
                    try {
                        await updateLink(editData._id, updated);
                        toast.success("Link updated");
                        setEditModalOpen(false);
                        fetchLinks();
                    } catch {
                        toast.error("Failed to update link");
                    } finally {
                        setEditing(false);
                    }
                }}
                editing={editing}
                onOpenIconPicker={(link) => openIconPicker(link)} // optional integration
            />

            {/* ICON PICKER DRAWER */}
            <IconPickerDrawer
                open={iconPickerOpen}
                initial={iconPickerFor?.icon}
                onClose={closeIconPicker}
                onSelect={handleIconSelect}
            />

            {/* Preview modal  */}
            <PreviewModal
                isOpen={previewModalOpen}
                onClose={() => setPreviewModalOpen(false)}
                user={user}
                links={links}
            />
        </div>
    );
};

export default Links;
