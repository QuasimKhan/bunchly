import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import InputField from "../ui/InputField";
import { Link, PencilLineIcon, PenSquareIcon } from "lucide-react";

const EditLinkModal = ({ open, onClose, onSave, link, editing }) => {
    const [form, setForm] = useState({ title: "", url: "", description: "" });

    useEffect(() => {
        if (link) {
            setForm({ title: link.title, url: link.url });
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

    return (
        <Modal open={open} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4">Edit Link</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    type="text"
                    name="title"
                    placeholder="Title"
                    icon={PenSquareIcon}
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 outline-none"
                />

                <InputField
                    type="text"
                    name="url"
                    placeholder="https://example.com"
                    icon={Link}
                    value={form.url}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 outline-none"
                />
                <InputField
                    type="text"
                    name="description"
                    placeholder="description"
                    icon={PencilLineIcon}
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 outline-none"
                />

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
