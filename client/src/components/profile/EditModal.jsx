import { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Loader2, UploadCloud, CheckCircle, XCircle } from "lucide-react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import api from "../../lib/api";
import getCroppedImg from "../../lib/cropImage.js";

export default function EditModal({
    open,
    onClose,
    label,
    field,
    value,
    onSave,
    loading = false,
    imageMode = false,
}) {
    if (!open) return null;

    // TEXT fields
    const [draft, setDraft] = useState(value || "");
    const [usernameStatus, setUsernameStatus] = useState("");

    // IMAGE fields
    const [src, setSrc] = useState(value || "");
    const [fileInputFile, setFileInputFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(value || "");

    // CROP fields
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // Upload state
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setDraft(value || "");
        setUsernameStatus("");

        setSrc(value || "");
        setPreviewUrl(value || "");
        setFileInputFile(null);

        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setAspect(1);
        setCroppedAreaPixels(null);

        setProgress(0);
        setIsUploading(false);
    }, [value, field, open]);

    /** ===========================
     *  HANDLE FILE SELECTION
     * =========================== */
    const handleFile = (file) => {
        if (!file) return;
        setFileInputFile(file);
        const url = URL.createObjectURL(file);
        setSrc(url);
        setPreviewUrl(url);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
    };

    const handleImageSelect = (e) => {
        handleFile(e.target.files[0]);
    };

    /** ===========================
     *  GENERATE CROPPED PREVIEW
     * =========================== */
    const updatePreview = useCallback(
        async (areaPixels) => {
            if (!src) return;
            try {
                const blob = await getCroppedImg(src, areaPixels);
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
            } catch (err) {
                console.error("Preview generation failed:", err);
            }
        },
        [src]
    );

    /** ===========================
     *  CROP COMPLETE HANDLER
     * =========================== */
    const onCropComplete = useCallback(
        async (_, croppedAreaPx) => {
            setCroppedAreaPixels(croppedAreaPx);
            await updatePreview(croppedAreaPx);
        },
        [updatePreview]
    );

    /** ===========================
     *  USERNAME CHECK
     * =========================== */
    useEffect(() => {
        if (imageMode || field !== "username") return;
        if (!draft.trim()) {
            setUsernameStatus("");
            return;
        }

        const username = draft.trim().toLowerCase();
        setUsernameStatus("checking");

        const delay = setTimeout(async () => {
            try {
                const res = await api.get(
                    `/api/auth/check-username?username=${username}`
                );
                setUsernameStatus(res.data.available ? "available" : "taken");
            } catch {
                setUsernameStatus("invalid");
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [draft]);

    /** ===========================
     *  UPLOAD CROPPED IMAGE
     * =========================== */
    const uploadCroppedImage = async () => {
        if (!src || !croppedAreaPixels) throw new Error("Missing crop data");

        const blob = await getCroppedImg(src, croppedAreaPixels);
        const fileName = fileInputFile?.name || "avatar.jpg";
        const finalFile = new File([blob], fileName, { type: "image/jpeg" });

        const formData = new FormData();
        formData.append("image", finalFile);

        setIsUploading(true);
        setProgress(0);

        const res = await api.post("/api/user/profile/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
            onUploadProgress: (e) => {
                if (!e.total) return;
                setProgress(Math.round((e.loaded * 100) / e.total));
            },
        });

        setIsUploading(false);
        setProgress(0);

        if (!res.data?.success)
            throw new Error(res.data?.message || "Upload failed");

        return res.data.image;
    };

    /** ===========================
     *  SUBMIT HANDLER
     * =========================== */
    const handleSubmit = async () => {
        if (imageMode) {
            try {
                if (!fileInputFile && src) return onSave({ image: src });
                if (!fileInputFile) return;

                const imageUrl = await uploadCroppedImage();
                onSave({ image: imageUrl });
            } catch (err) {
                alert(err.message);
            }
            return;
        }

        if (!draft.trim()) return;
        if (field === "username" && usernameStatus !== "available")
            return alert("Choose a valid username");

        onSave({ [field]: draft.trim() });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div
                className="
                    w-full 
                    max-h-[85vh] overflow-y-auto custom-scrollbar
                "
                style={{ overscrollBehavior: "contain" }}
            >
                <h2 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-white">
                    {label}
                </h2>

                {/* ===========================
                    IMAGE MODE
                =========================== */}
                {imageMode ? (
                    <>
                        {/* DROPZONE */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() =>
                                document.getElementById("uploadInput")?.click()
                            }
                            className="
                                w-full rounded-xl border-2 border-dashed 
                                border-neutral-300 dark:border-neutral-700
                                bg-neutral-50 dark:bg-neutral-800/50
                                py-8 px-4 flex flex-col items-center gap-3
                                cursor-pointer text-center
                                hover:border-indigo-500/50 hover:bg-indigo-50/10 transition-all
                            "
                        >
                            <UploadCloud className="w-10 h-10 opacity-50" />
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                Drag & drop or click to choose an image
                            </p>
                            <p className="text-xs text-neutral-400">
                                JPG, PNG, WEBP • Recommended 600×600
                            </p>
                        </div>

                        <input
                            id="uploadInput"
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />

                        {/* CROP UI */}
                        {src && (
                            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Cropper */}
                                <div className="md:col-span-2 w-full h-64 md:h-72 bg-neutral-200 dark:bg-neutral-800 rounded-xl overflow-hidden relative border border-neutral-200 dark:border-neutral-700">
                                    <Cropper
                                        image={src}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={aspect}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                    />
                                </div>

                                {/* Controls */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            Zoom
                                        </label>
                                        <input
                                            type="range"
                                            min={1}
                                            max={3}
                                            step={0.05}
                                            value={zoom}
                                            onChange={(e) =>
                                                setZoom(+e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            Aspect Ratio
                                        </label>
                                        <select
                                            className="border p-2 rounded-lg bg-white dark:bg-neutral-800 dark:border-neutral-700 text-sm"
                                            value={aspect}
                                            onChange={(e) =>
                                                setAspect(+e.target.value)
                                            }
                                        >
                                            <option value={1}>
                                                1:1 (Square)
                                            </option>
                                            <option value={4 / 5}>4:5</option>
                                            <option value={16 / 9}>16:9</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Progress */}
                        {isUploading && (
                            <div className="mt-5 bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                    style={{ width: `${progress}%` }}
                                    className="h-full bg-indigo-600 transition-all rounded-full"
                                />
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end items-center gap-3">
                            <Button text="Cancel" variant="ghost" onClick={onClose} />
                            <Button
                                text={
                                    isUploading
                                        ? `Uploading ${progress}%`
                                        : "Upload & Save"
                                }
                                onClick={handleSubmit}
                                loading={isUploading}
                                className="!bg-indigo-600 hover:!bg-indigo-700 text-white"
                                disabled={!fileInputFile || !croppedAreaPixels}
                            />
                        </div>
                    </>
                ) : (
                    /* ===========================
                       TEXT MODE
                    =========================== */
                    <>
                        {field === "bio" ? (
                            <div className="space-y-2">
                                <textarea
                                    value={draft}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 160) {
                                            setDraft(e.target.value);
                                        }
                                    }}
                                    placeholder="Tell the world about yourself..."
                                    rows={4}
                                    className="
                                        w-full px-4 py-3 rounded-xl 
                                        border border-neutral-300 dark:border-neutral-700
                                        bg-white dark:bg-neutral-900 
                                        text-neutral-900 dark:text-white
                                        focus:ring-2 ring-indigo-500/50 outline-none
                                        transition-all resize-none
                                        placeholder:text-neutral-400
                                    "
                                />
                                <div className="flex justify-end">
                                    <span className={`text-xs font-medium ${draft.length >= 150 ? "text-amber-500" : "text-neutral-400"}`}>
                                        {draft.length}/160 characters
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <input
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                className="
                                    w-full px-4 py-3 rounded-xl 
                                    border border-neutral-300 dark:border-neutral-700
                                    bg-white dark:bg-neutral-900 
                                    text-neutral-900 dark:text-white
                                    focus:ring-2 ring-indigo-500/50 outline-none
                                    transition-all
                                "
                                placeholder={`Enter your ${field}`}
                            />
                        )}

                        {field === "username" && (
                            <p className="mt-2 text-sm h-5">
                                {usernameStatus === "checking" && (
                                    <span className="flex items-center gap-1 text-blue-500">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Checking…
                                    </span>
                                )}
                                {usernameStatus === "available" && (
                                    <span className="flex text-emerald-600 items-center gap-1">
                                        <CheckCircle className="w-4 h-4" />{" "}
                                        <span>Username available</span>
                                    </span>
                                )}
                                {usernameStatus === "taken" && (
                                    <span className="flex text-red-500 items-center gap-1">
                                        <XCircle className="w-4 h-4" />{" "}
                                        <span>Already taken</span>
                                    </span>
                                )}
                                {usernameStatus === "invalid" && (
                                    <span className="text-amber-500">
                                        Invalid username
                                    </span>
                                )}
                            </p>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                text="Cancel"
                                variant="ghost"
                                onClick={onClose}
                            />
                            <Button
                                text="Save"
                                loading={loading}
                                onClick={handleSubmit}
                                className="!bg-indigo-600 hover:!bg-indigo-700 text-white"
                                disabled={
                                    field === "username" &&
                                    ["invalid", "taken", "checking"].includes(
                                        usernameStatus
                                    )
                                }
                            />
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
