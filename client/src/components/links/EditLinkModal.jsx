import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import InputField from "../ui/InputField";
import { Link, PencilLineIcon, PenSquareIcon } from "lucide-react";

const EditLinkModal = ({ open, onClose, onSave, link, editing }) => {
    const [form, setForm] = useState({ title: "", url: "", description: "" });

    useEffect(() => {
        if (link) {
            setForm({
                title: link.title,
                url: link.url,
                description: link.description,
            });
        }
    }, [link]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    if (!open) return null;

    const isCollection = link?.type === "collection";

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center gap-2 mb-6 text-neutral-900 dark:text-white">
                <div className={`p-2 rounded-lg ${isCollection ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"}`}>
                    {isCollection ? <PenSquareIcon className="w-5 h-5"/> : <Link className="w-5 h-5"/>}
                </div>
                <h2 className="text-xl font-bold">{isCollection ? "Edit Collection" : "Edit Link"}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    label="Title"
                    type="text"
                    name="title"
                    placeholder={isCollection ? "Collection Name" : "Link Title"}
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                {!isCollection && (
                    <InputField
                        label="URL"
                        type="text"
                        name="url"
                        placeholder="https://example.com"
                        value={form.url}
                        onChange={handleChange}
                        required
                    />
                )}
                
                {/* Description optional for both, but usually collections don't need it as much, but let's keep it just in case user wants to add details */}
                {/* Actually, let's keep description for both */}
                {/* 
                <InputField
                    label="Description (Optional)"
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                /> 
                */}
                {/* NOTE: InputField doesn't have icon prop in its new premium version likely, checking props... */}
                {/* The previous code used `icon={PenSquareIcon}` which suggests InputField supports it or ignores it. */}
                {/* I will stick to simple props as seen in Links.jsx usage: label, name, value... */}

                <Button
                    text="Save Changes"
                    type="submit"
                    fullWidth
                    size="md"
                    loading={editing}
                    className="!bg-indigo-600 hover:!bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                    disabled={editing}
                />
            </form>
        </Modal>
    );
};

export default EditLinkModal;
