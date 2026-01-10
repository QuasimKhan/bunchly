import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { Link, ShoppingBag, Layers, FolderPlus, ArrowRight, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { getLinkPreview } from "../../services/linkService";

const BLOCK_TYPES = [
    { id: 'link', label: 'Link', icon: Link, color: "text-indigo-500", desc: "URL, Video, Music" },
    { id: 'product', label: 'Product', icon: ShoppingBag, color: "text-emerald-500", desc: "Sell or recommend" },
    { id: 'header', label: 'Header', icon: Layers, color: "text-rose-500", desc: "Divide sections" },
    { id: 'collection', label: 'Collection', icon: FolderPlus, color: "text-purple-500", desc: "Group standard links" },
];

const AddBlockModal = ({ open, onClose, onCreate, parentId = null }) => {
    const [step, setStep] = useState(1); // 1: Type Selection, 2: Details
    const [type, setType] = useState('link'); // selected type
    const [loading, setLoading] = useState(false);
    const [fetchingMeta, setFetchingMeta] = useState(false);
    
    // Form Data
    const [formData, setFormData] = useState({
        title: "",
        url: "",
        imageUrl: "", // For products
        icon: "", // For links (custom favicon)
        price: "",
        currency: "INR",
        layout: "list",
    });

    // Reset when opening
    useEffect(() => {
        if (open) {
            setStep(1);
            setType('link');
            setFormData({ title: "", url: "", imageUrl: "", icon: "", price: "", currency: "INR", layout: "list" });
            setLoading(false);
            setFetchingMeta(false);
        }
    }, [open]);

    // Handlers
    const handleNext = () => setStep(2);
    
    // Smart Auto-Fill
    const handleFetchMetadata = async () => {
        if (!formData.url) return;
        // avoid re-fetching if just focusing out without change? (optional optimization)
        
        setFetchingMeta(true);
        try {
            const meta = await getLinkPreview(formData.url);
            if (meta) {
                const updates = {};
                // Title
                if (!formData.title && meta.title) updates.title = meta.title;
                
                // Product Image
                if (type === 'product') {
                    if (!formData.imageUrl && meta.image) updates.imageUrl = meta.image;
                }
                
                // Link Favicon/Icon
                if (type === 'link') {
                    // Try to use the fetched icon for better quality, else backend/LinkFavicon fallback
                    if (!formData.icon && meta.icon) updates.icon = meta.icon; 
                }

                setFormData(prev => ({ ...prev, ...updates }));
                
                if (Object.keys(updates).length > 0) {
                     toast.success("Details auto-filled!");
                }
            }
        } catch (err) {
            // silent fail on blur usually better, or specific toast for button click
            console.error("Meta fetch fail", err);
        } finally {
            setFetchingMeta(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onCreate({ ...formData, type, parentId });
             // onClose called by parent usually, but we can do it here too if success
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            {step === 1 ? (
                // STEP 1: SELECT TYPE
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl font-bold font-heading text-neutral-900 dark:text-white">Add Content</h2>
                        <p className="text-neutral-500 text-sm mt-1">Choose what you want to add to your page</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 cursor-pointer">
                        {BLOCK_TYPES.map((block) => (
                            <button
                                key={block.id}
                                disabled={parentId && block.id === 'collection'} // Can't nest collections
                                onClick={() => { setType(block.id); handleNext(); }}
                                className={`
                                    relative p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer
                                    ${parentId && block.id === 'collection' ? 'opacity-40 grayscale cursor-not-allowed border-neutral-200 dark:border-neutral-800' : 'border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 hover:shadow-lg dark:hover:border-indigo-500 dark:hover:bg-neutral-800/50'}
                                    bg-neutral-50/50 dark:bg-neutral-900/20
                                `}
                            >
                                <div className={`w-10 h-10 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm mb-3 ${block.color}`}>
                                    <block.icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-neutral-900 dark:text-white">{block.label}</h3>
                                <p className="text-xs text-neutral-500 mt-0.5">{block.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                // STEP 2: DETAILS
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <button 
                            type="button" 
                            onClick={() => setStep(1)} 
                            className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                            <ArrowRight className="w-3 h-3 rotate-180" /> Back
                        </button>
                        <h2 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                             {BLOCK_TYPES.find(b => b.id === type)?.label} Details
                        </h2>
                    </div>

                    {/* DYNAMIC FIELDS BASED ON TYPE */}
                    
                    {/* URL Field (Link + Product) */}
                    {(type === 'link' || type === 'product') && (
                        <div className="relative">
                            <InputField 
                                label="URL"
                                value={formData.url}
                                onChange={e => setFormData({...formData, url: e.target.value})}
                                onBlur={handleFetchMetadata} // Auto-fetch on blur
                                placeholder="https://..."
                                required
                            />
                            {/* Visual Feedback for Fetching */}
                            {fetchingMeta && (
                                <div className="absolute top-9 right-3 text-indigo-500 animate-pulse">
                                     <Sparkles className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Title Field (All types) */}
                    <div className="relative">
                        <InputField 
                            label="Title / Name"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            placeholder={type === 'header' ? "e.g. My Favorites" : "Title"}
                            required
                        />
                         {/* Link Icon Preview (Favicon) */}
                         {type === 'link' && formData.icon && (
                            <div className="absolute top-8 right-3 w-6 h-6 rounded overflow-hidden border border-neutral-200">
                                <img src={formData.icon} alt="Icon" className="w-full h-full object-cover" />
                            </div>
                         )}
                    </div>

                    {/* Product Specifics */}
                    {type === 'product' && (
                        <div className="space-y-4 p-4 bg-neutral-50 dark:bg-neutral-800/30 rounded-xl border border-neutral-100 dark:border-neutral-800">
                             <div className="flex gap-4">
                                 {/* Image Preview / Input */}
                                 <div className="shrink-0 w-20 h-20 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden relative group">
                                     {formData.imageUrl ? (
                                         <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                     ) : (
                                         <ImageIcon className="w-8 h-8 text-neutral-300" />
                                     )}
                                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                         <span className="text-[10px] text-white font-medium text-center px-1">Img URL</span>
                                     </div>
                                 </div>
                                 <div className="flex-1 space-y-3">
                                     <InputField 
                                        label="Product Image Link"
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                                        placeholder="https://image.com/..."
                                     />
                                 </div>
                             </div>

                             <div className="grid grid-cols-2 gap-3">
                                <InputField 
                                    label="Price"
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: e.target.value})}
                                    placeholder="0.00"
                                />
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Currency</label>
                                    <select
                                        value={formData.currency}
                                        onChange={e => setFormData({...formData, currency: e.target.value})}
                                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                                    >
                                        <option value="INR">INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                             </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <Button 
                            text="Create Block" 
                            type="submit" 
                            loading={loading} 
                            fullWidth 
                            className="cursor-pointer"
                        />
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default AddBlockModal;
