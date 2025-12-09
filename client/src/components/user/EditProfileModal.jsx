import React, { useState } from "react";
import Button from "../ui/Button";

export default function EditProfileModal({ open, onClose, user, onSave }) {
    if (!open) return null;

    const [form, setForm] = useState({
        name: user.name,
        username: user.username,
        bio: user.bio,
        image: user.image,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSave(form);
        onClose();
    };

    return (
        <div
            className="
                fixed inset-0 z-[999]
                bg-black/40 backdrop-blur-sm
                flex items-center justify-center
                animate-fadeIn
            "
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    w-full max-w-lg rounded-2xl
                    bg-white dark:bg-neutral-900
                    border border-white/20 dark:border-neutral-700
                    shadow-2xl p-8 
                    animate-scaleIn
                "
            >
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

                {/* FORM FIELDS */}
                <div className="space-y-4">
                    <Field label="Name">
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="inputField"
                        />
                    </Field>

                    <Field label="Username">
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="inputField"
                        />
                    </Field>

                    <Field label="Bio">
                        <textarea
                            name="bio"
                            value={form.bio}
                            rows={3}
                            onChange={handleChange}
                            className="inputField resize-none"
                        />
                    </Field>

                    <Field label="Profile Image URL">
                        <input
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            className="inputField"
                        />
                    </Field>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 mt-8">
                    <Button
                        text="Cancel"
                        className="px-5 py-2 rounded-xl bg-neutral-300 dark:bg-neutral-700 text-black dark:text-white"
                        onClick={onClose}
                    />
                    <Button
                        text="Save"
                        className="
                            px-5 py-2 rounded-xl
                            bg-gradient-to-r from-blue-600 to-purple-600 
                            text-white shadow
                        "
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}

const Field = ({ label, children }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {label}
        </label>
        {children}
    </div>
);
