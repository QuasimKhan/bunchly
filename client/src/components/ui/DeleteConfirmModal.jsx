import React from "react";
import Button from "./Button";
import Modal from "./Modal";
import { AlertTriangle, Trash2 } from "lucide-react";

const DeleteConfirmModal = ({ open, onClose, onConfirm, deleting, title = "Delete Item?", description = "This action cannot be undone." }) => {
    return (
        <Modal open={open} onClose={onClose} size="sm" hideClose>
            <div className="flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center mb-6 ring-8 ring-red-50/50 dark:ring-red-900/5 animate-in zoom-in duration-300">
                    <Trash2 className="w-10 h-10 text-red-500" strokeWidth={1.5} />
                </div>
                
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    {title}
                </h2>

                <p className="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed px-4">
                    {description} 
                    <br/>
                    <span className="text-xs font-semibold text-red-500/80 mt-2 block uppercase tracking-wide">Are you sure?</span>
                </p>

                <div className="grid grid-cols-2 gap-3 w-full">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        text="Cancel"
                        className="rounded-xl font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    />

                    <Button
                        className="!bg-red-600 hover:!bg-red-700 text-white border-none rounded-xl font-bold shadow-lg shadow-red-500/30"
                        onClick={onConfirm}
                        text={deleting ? "Deleting..." : "Yes, Delete"}
                        loading={deleting}
                        disabled={deleting}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default DeleteConfirmModal;
