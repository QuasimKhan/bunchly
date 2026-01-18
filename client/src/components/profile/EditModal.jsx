import { useState, useEffect, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { Loader2, UploadCloud, CheckCircle, XCircle, ZoomIn, RotateCw, ImagePlus } from "lucide-react";
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
    const [previewUrl, setPreviewUrl] = useState(value || ""); // kept for future or immediate preview logic

    // CROP fields
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // Upload state
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const fileInputRef = useRef(null);

    useEffect(() => {
        setDraft(value || "");
        setUsernameStatus("");

        setSrc(value || "");
        setPreviewUrl(value || "");
        setFileInputFile(null);

        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setAspect(1);
        setRotation(0);
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
        setPreviewUrl(url); // unused but good for debugging
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
    };

    const handleImageSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
             handleFile(e.target.files[0]);
        }
    };

    const onCropComplete = useCallback((_, croppedAreaPx) => {
        setCroppedAreaPixels(croppedAreaPx);
    }, []);

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
    }, [draft, imageMode, field]);

    /** ===========================
     *  UPLOAD LOGIC
     * =========================== */
    const uploadCroppedImage = async () => {
        if (!src || !croppedAreaPixels) throw new Error("Missing crop data");

        const blob = await getCroppedImg(src, croppedAreaPixels, rotation);
        const fileName = fileInputFile?.name || "profile-edit.jpg";
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

    const handleSubmit = async () => {
        if (imageMode) {
            try {
                // If a new file is selected OR we have a src (existing image) to crop
                if (fileInputFile || src) {
                     const imageUrl = await uploadCroppedImage();
                     onSave({ image: imageUrl });
                }
            } catch (err) {
                console.error(err);
                alert("Failed to process image. Ensure it allows cross-origin access.");
            }
            return;
        }


        if (!draft.trim()) return;
        if (field === "username" && usernameStatus !== "available")
            return alert("Choose a valid username");

        onSave({ [field]: draft.trim() });
    };

    return (
        <Modal 
            open={open} 
            onClose={onClose} 
            size={imageMode ? "lg" : "md"}
            title={imageMode ? "Update Profile Photo" : label}
        >
            <div className="flex flex-col h-full">
                
                {/* ===========================
                    IMAGE MODE
                =========================== */}
                {imageMode ? (
                    <div className="animate-in fade-in duration-300">
                        {/* 1. UPLOAD STATE */}
                        {!src ? (
                             <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => fileInputRef.current?.click()}
                                className="
                                    group relative w-full h-[300px] rounded-3xl 
                                    border-2 border-dashed border-neutral-200 dark:border-neutral-800
                                    bg-neutral-50 dark:bg-neutral-900/50
                                    flex flex-col items-center justify-center gap-5
                                    cursor-pointer transition-all duration-300
                                    hover:border-indigo-500 hover:bg-indigo-50/10 hover:shadow-xl hover:shadow-indigo-500/5
                                "
                            >
                                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm group-hover:scale-110 transition-transform duration-300 ring-1 ring-black/5 dark:ring-white/10">
                                    <ImagePlus className="w-8 h-8 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-lg font-bold text-neutral-900 dark:text-white">
                                        Upload new photo
                                    </p>
                                    <p className="text-sm text-neutral-500 font-medium">
                                        Drag & drop or click to browse
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* 2. CROP STATE - Side by Side Layout */
                            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                                
                                {/* CROPPER */}
                                <div className="relative w-full md:w-3/5 aspect-square md:aspect-[4/3] bg-[#121212] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 shrink-0">
                                    <Cropper
                                        image={src}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={aspect}
                                        rotation={rotation}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onRotationChange={setRotation}
                                        onCropComplete={onCropComplete}
                                        cropShape="round"
                                        showGrid={false}
                                        className="!bg-[#121212]"
                                        mediaProps={{ crossOrigin: 'anonymous' }} 
                                    />
                                </div>

                                {/* CONTROLS PANEL */}
                                <div className="w-full md:w-2/5 flex flex-col justify-between self-stretch gap-6">
                                    <div className="space-y-6">
                                         {/* Zoom Control */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                                <span>Zoom</span>
                                                <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-900 dark:text-white">{zoom.toFixed(1)}x</span>
                                            </div>
                                            <input
                                                type="range"
                                                value={zoom}
                                                min={1}
                                                max={3}
                                                step={0.1}
                                                onChange={(e) => setZoom(Number(e.target.value))}
                                                className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
                                            />
                                        </div>

                                        {/* Rotation Control */}
                                        <div className="space-y-3">
                                             <div className="flex justify-between items-center text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                                <span>Rotation</span>
                                                <button 
                                                    onClick={() => setRotation((r) => r + 90)}
                                                    className="flex items-center gap-1 hover:text-indigo-500 transition-colors"
                                                >
                                                    <RotateCw className="w-3 h-3" />
                                                    <span>+90°</span>
                                                </button>
                                            </div>
                                            <input
                                                type="range"
                                                value={rotation}
                                                min={0}
                                                max={360}
                                                step={1}
                                                onChange={(e) => setRotation(Number(e.target.value))}
                                                className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
                                            />
                                        </div>

                                        {/* Change Image */}
                                        <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-300"
                                        >
                                            Chose different image
                                        </button>
                                    </div>

                                    {/* Footer Actions inside the flex col */}
                                    <div className="pt-6 border-t border-neutral-100 dark:border-white/5 space-y-3">
                                         {/* Upload Progress */}
                                        {isUploading && (
                                            <div className="space-y-1 mb-2">
                                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                                                    <span>Uploading...</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                    <div style={{ width: `${progress}%` }} className="h-full bg-indigo-600 transition-all duration-300" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <Button text="Cancel" variant="ghost" onClick={onClose} className="flex-1" />
                                            <Button
                                                text={isUploading ? "Saving..." : "Apply"}
                                                onClick={handleSubmit}
                                                loading={isUploading}
                                                className="flex-[2] !bg-indigo-600 hover:!bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                                                disabled={!src || !croppedAreaPixels}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                    </div>
                ) : (
                    /* ===========================
                       TEXT MODE (UNCHANGED BUT CLEANER)
                    =========================== */
                    <div className="space-y-6 pt-2">
                        {field === "bio" ? (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Bio</label>
                                <textarea
                                    value={draft}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 160) setDraft(e.target.value);
                                    }}
                                    placeholder="Tell the world about yourself..."
                                    rows={4}
                                    className="
                                        w-full px-4 py-3 rounded-2xl 
                                        bg-neutral-50 dark:bg-neutral-900/50
                                        border-2 border-transparent focus:border-indigo-500/50
                                        text-neutral-900 dark:text-white
                                        placeholder:text-neutral-400
                                        outline-none transition-all resize-none
                                        text-sm leading-relaxed
                                    "
                                />
                                <div className="flex justify-end">
                                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                        draft.length >= 150 
                                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" 
                                            : "text-neutral-400"
                                     }`}>
                                        {draft.length}/160
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">
                                    {field === 'username' ? 'Username' : 'Display Name'}
                                </label>
                                <input
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    className={`
                                        w-full px-4 py-3 rounded-2xl 
                                        bg-neutral-50 dark:bg-neutral-900/50
                                        border-2 
                                        text-neutral-900 dark:text-white font-medium
                                        placeholder:text-neutral-400
                                        outline-none transition-all
                                        ${usernameStatus === 'taken' || usernameStatus === 'invalid' 
                                            ? 'border-red-500/50 focus:border-red-500/50' 
                                            : 'border-transparent focus:border-indigo-500/50'}
                                    `}
                                    placeholder={`Enter your ${field}`}
                                    autoFocus
                                />
                            </div>
                        )}

                        {field === "username" && (
                            <div className="flex items-center gap-2 text-xs font-medium pl-1 min-h-[20px]">
                                {usernameStatus === "checking" && <span className="text-neutral-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Checking...</span>}
                                {usernameStatus === "available" && <span className="text-emerald-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Available</span>}
                                {usernameStatus === "taken" && <span className="text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> Taken</span>}
                            </div>
                        )}

                        <div className="flex justify-between items-center gap-3 pt-4 border-t border-neutral-100 dark:border-white/5 mt-2">
                             <Button text="Cancel" variant="ghost" onClick={onClose} size="sm"/>
                             <Button
                                text="Save"
                                loading={loading}
                                onClick={handleSubmit}
                                className="px-6 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                                disabled={field === "username" && ["invalid", "taken", "checking"].includes(usernameStatus)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
