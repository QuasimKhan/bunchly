import React from "react";
import Button from "./Button";
import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({ open, onClose, onConfirm, deleting }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Delete this link?
                </h2>

                <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-[200px]">
                    This action cannot be undone. Are you sure you want to proceed?
                </p>

                <div className="flex items-center justify-center gap-3 w-full">
                    <Button
                        className="flex-1"
                        variant="ghost"
                        onClick={onClose}
                        text="Cancel"
                    />

                    <Button
                        className="flex-1 !bg-red-600 hover:!bg-red-700 text-white border-none"
                        onClick={onConfirm}
                        text={deleting ? "Deleting..." : "Delete"}
                        loading={deleting}
                        disabled={deleting}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default DeleteConfirmModal;
