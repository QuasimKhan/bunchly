import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LivePreview from "../components/preview/LivePreview";
import Button from "../components/ui/Button";
import UpgradeModal from "../components/dashboard/UpgradeModal";

import { Save, Loader2, Sparkles, TypeIcon, Square, Palette, ImageIcon, Lock, Check, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { THEMES } from "../lib/themes";
import { useSEO } from "../hooks/useSEO";
import { buildUrl } from "../lib/seo";
import { getLinks } from "../services/linkService";

// 🎨 Presets with PRO flagging
const GRADIENTS = [
    { value: "from-indigo-500 to-purple-600", isPro: false },
    { value: "from-slate-900 to-slate-700", isPro: false },
    { value: "from-blue-600 to-violet-600", isPro: false },
    { value: "from-rose-400 to-orange-300", isPro: true },
    { value: "from-emerald-400 to-cyan-400", isPro: true },
    { value: "from-fuchsia-500 to-pink-500", isPro: true },
    { value: "from-amber-200 to-yellow-500", isPro: true },
    { value: "from-teal-400 to-gray-800", isPro: true },
    { value: "from-sky-400 to-indigo-900", isPro: true },
];

const FONTS = [
    { name: "Modern (Inter)", value: "Inter", isPro: false },
    { name: "Elegant (Serif)", value: "serif", isPro: true },
    { name: "Mono (Code)", value: "monospace", isPro: true },
    { name: "Playful (Comic)", value: "cursive", isPro: true },
];

const BUTTON_STYLES = [
    { name: "Fill", value: "fill", isPro: false },
    { name: "Outline", value: "outline", isPro: false },
    { name: "Soft", value: "soft", isPro: true },
    { name: "Shadow", value: "shadow", isPro: true },
    { name: "Brutal", value: "hard-shadow", isPro: true },
];

const BUTTON_ROUNDNESS = [
    { name: "Sharp", value: "none" },
    { name: "Rounded", value: "lg" },
    { name: "Soft", value: "xl" },
    { name: "Pill", value: "full" },
];

const Appearance = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useSEO({
        title: "Appearance – Bunchly",
        description: "Customize your profile appearance.",
        noIndex: true,
        url: buildUrl("/dashboard/appearance"),
    });
    
    // Initial State
    const [appearance, setAppearance] = useState({
        bgType: "color",
        bgColor: "#ffffff",
        bgGradient: "from-indigo-500 to-purple-600",
        bgImage: "",
        bgBlur: 0,
        bgOverlay: 0,
        buttonStyle: "fill",
        buttonRoundness: "xl",
        buttonColor: "#171717",
        buttonFontColor: "#ffffff",
        fontFamily: "Inter",
        fontColor: "#171717",
        theme: "custom", 
        hideBranding: false,
    });

    const [selectedCategory, setSelectedCategory] = useState("All");

    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Load user appearance on mount
    useEffect(() => {
        if (user?.appearance) {
            setAppearance({ ...appearance, ...user.appearance });
        }
    }, [user]);

    // Pro Check Helper
    const checkPro = (isProFeature) => {
        if (isProFeature && user.plan !== "pro") {
            setShowUpgradeModal(true);
            return false;
        }
        return true;
    };

    // Handle Change
    const handleChange = async (key, value, isProFeature = false, autoSave = false) => {
        if (!checkPro(isProFeature)) return;
        
        // Optimistic Update
        setAppearance(prev => {
            const newApp = { ...prev, [key]: value };
            
            // Trigger Auto-Save if requested
            if (autoSave) {
                // Debounce or immediate? Toggles should be immediate.
                axios.patch(
                    `${import.meta.env.VITE_API_URL}/api/user/update-profile`,
                    { appearance: newApp },
                    { withCredentials: true }
                ).then(res => {
                    if (res.data.success) {
                        toast.success("Saved!", { duration: 1500 });
                        setUser(res.data.user);
                    }
                }).catch(err => {
                    console.error("Auto-save failed:", err);
                    toast.error("Failed to save");
                    // Revert on failure
                    setAppearance(current => ({ ...current, [key]: !value })); 
                });
            }
            return newApp;
        });
    };

    // Save Changes
    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/user/update-profile`,
                { appearance },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success("Appearance updated!");
                setUser(res.data.user); // Update context
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to update appearance");
        } finally {
            setLoading(false);
        }
    };

    // Preview User Object
    const previewUser = {
        ...user,
        appearance: appearance,
    };

    // Real Links for Preview
    const [previewLinks, setPreviewLinks] = useState([]);

    useEffect(() => {
        const loadLinks = async () => {
             try {
                 const data = await getLinks();
                 setPreviewLinks(data);
             } catch (err) {
                 console.error("Failed to load preview links");
             }
        };
        loadLinks();
    }, []);

    return (
        <div className="min-h-screen p-0 md:p-8 pb-32 md:pb-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                
                {/* 🛠 LEFT COLUMN: EDITOR */}
                <div className="lg:col-span-7 space-y-8 px-4 pt-4 md:px-0 md:pt-0">
                    
                    {/* Header */}
                    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3 text-neutral-900 dark:text-white">
                                <Palette className="w-8 h-8 text-indigo-600" />
                                Appearance
                            </h1>
                            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                                Customize your profile's look and feel.
                            </p>
                        </div>
                        
                        {/* Desktop Save Button */}
                        <div className="hidden md:block">
                            <Button 
                                text={loading ? "Saving..." : "Save Changes"}
                                icon={loading ? Loader2 : Save}
                                disabled={loading}
                                onClick={handleSave}
                                className="bg-white text-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-white dark:hover:bg-neutral-200 shadow-xl shadow-neutral-900/10 dark:shadow-white/5 rounded-xl px-6 py-2.5 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                            />
                        </div>
                    </header>

                    {/* 🎨 THEMES */}
                    <Section title="Theme Gallery" icon={Sparkles} description="Premium presets & styles">
                         <div className="space-y-6">
                            
                            {/* Category Tabs */}
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 md:mx-0 md:px-0">
                                {["All", "Minimal", "Animated", "Dark", "Graphics", "Nature"].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                                            selectedCategory === cat
                                                ? "bg-neutral-900 dark:bg-white text-white dark:text-black shadow-lg shadow-neutral-500/20"
                                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Theme Grid (Scrollable) */}
                            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-1 p-1">
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                                    {THEMES
                                        .filter(t => selectedCategory === "All" || t.category === selectedCategory)
                                        .map((t) => (
                                        <ThemeCard 
                                            key={t.id} 
                                            theme={t} 
                                            isLocked={t.isPro && user.plan !== "pro"}
                                            isSelected={appearance.theme === t.id}
                                            onSelect={(theme) => {
                                                if (theme.isPro && !checkPro(true)) return;
                                                setAppearance(prev => ({
                                                    ...prev,
                                                    theme: theme.id,
                                                    bgType: theme.bgType,
                                                    bgColor: theme.bgColor || prev.bgColor,
                                                    bgGradient: theme.bgGradient || prev.bgGradient,
                                                    bgImage: theme.bgType === 'image' ? theme.bgImage : "",
                                                    bgBlur: 0,
                                                    bgOverlay: 0,
                                                    buttonStyle: theme.buttonStyle,
                                                    buttonRoundness: theme.buttonRoundness || "xl",
                                                    buttonColor: theme.buttonColor,
                                                    buttonFontColor: theme.buttonFontColor,
                                                    fontFamily: theme.fontFamily,
                                                    fontColor: theme.fontColor,
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* background customization */}
                    <Section title="Custom Background" icon={ImageIcon} description="Fine-tune your backdrop">
                        <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-fit mb-6">
                            {["color", "gradient", "image"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleChange("bgType", type, type === "image" && user.plan !== "pro")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                                        appearance.bgType === type
                                            ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white ring-1 ring-black/5 dark:ring-white/10"
                                            : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                                    }`}
                                >
                                    {type === "gradient" && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                                    {type === "image" && <ImageIcon className="w-3.5 h-3.5 text-rose-500" />}
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>

                        {appearance.bgType === "color" && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="flex flex-col gap-2 text-sm font-medium w-full">
                                    Background Key Color
                                    <div className="flex items-center gap-3 border border-neutral-200 dark:border-neutral-700 p-2 rounded-xl bg-white dark:bg-neutral-800/50 w-full transition-all focus-within:ring-2 ring-indigo-500/20 focus-within:border-indigo-500/50">
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-inner ring-1 ring-black/10 dark:ring-white/10">
                                            <input
                                                type="color"
                                                value={appearance.bgColor}
                                                onChange={(e) => { handleChange("bgColor", e.target.value); handleChange("theme", "custom"); }}
                                                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-none"
                                            />
                                        </div>
                                        <input 
                                            type="text" 
                                            value={appearance.bgColor}
                                            onChange={(e) => { handleChange("bgColor", e.target.value); handleChange("theme", "custom"); }}
                                            className="font-mono text-sm bg-transparent outline-none flex-1 text-neutral-600 dark:text-neutral-300 uppercase tracking-wide"
                                        />
                                    </div>
                                </label>
                            </div>
                        )}

                        {appearance.bgType === "gradient" && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                {GRADIENTS.map((grad) => {
                                    const isLocked = grad.isPro && user.plan !== "pro";
                                    return (
                                        <div
                                            key={grad.value}
                                            onClick={() => { handleChange("bgGradient", grad.value, grad.isPro); handleChange("theme", "custom"); }}
                                            className={`relative aspect-video rounded-xl cursor-pointer bg-gradient-to-br ${grad.value} ring-2 ring-offset-2 dark:ring-offset-neutral-900 transition-all ${
                                                appearance.bgGradient === grad.value
                                                    ? "ring-indigo-600 scale-[1.02] shadow-lg"
                                                    : "ring-transparent hover:scale-[1.02] hover:shadow-md"
                                            }`}
                                        >
                                            {isLocked && (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-xl z-20">
                                                    <Lock className="w-5 h-5 text-white/90 mb-1" />
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">PRO</span>
                                                </div>
                                            )}
                                            {appearance.bgGradient === grad.value && (
                                                <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md p-1 rounded-full">
                                                     <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {appearance.bgType === "image" && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                                {appearance.bgImage ? (
                                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm group">
                                        <img src={appearance.bgImage} alt="Custom Background" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-3 items-center justify-center backdrop-blur-sm">
                                            <label className="cursor-pointer px-4 py-2 bg-white text-black rounded-lg font-bold text-sm hover:scale-105 active:scale-95 transition-transform shadow-lg">
                                                Change Image
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if(!file) return;
                                                        setLoading(true);
                                                        const formData = new FormData();
                                                        formData.append("image", file);
                                                        try {
                                                            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/profile/upload-bg`, formData, { withCredentials: true });
                                                            if(res.data.success) {
                                                                setAppearance(prev => ({ ...prev, bgImage: res.data.bgImage, bgType: 'image', theme: 'custom' }));
                                                                toast.success("Background uploaded!");
                                                            }
                                                        } catch(err) {
                                                            toast.error("Upload failed");
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    }}
                                                />
                                            </label>
                                            <button 
                                                onClick={() => setAppearance(prev => ({ ...prev, bgImage: "", bgType: "color" }))}
                                                className="px-4 py-2 bg-red-500/90 text-white rounded-lg font-bold text-sm hover:bg-red-600 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all cursor-pointer group">
                                        <div className="p-4 bg-white dark:bg-neutral-800 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                            <ImageIcon className="w-6 h-6 text-neutral-400 dark:text-neutral-500" />
                                        </div>
                                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Upload custom image</span>
                                        <span className="text-xs text-neutral-400 mt-1">Max 5MB (JPG, PNG, WEBP)</span>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if(!file) return;
                                                setLoading(true);
                                                const formData = new FormData();
                                                formData.append("image", file);
                                                try {
                                                    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/profile/upload-bg`, formData, { withCredentials: true });
                                                    if(res.data.success) {
                                                        setAppearance(prev => ({ ...prev, bgImage: res.data.bgImage, bgType: 'image', theme: 'custom' }));
                                                        toast.success("Background uploaded!");
                                                    }
                                                } catch(err) {
                                                    toast.error("Upload failed");
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                        />
                                    </label>
                                )}

                                {/* Advanced Photo Controls */}
                                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-5">
                                    <label className="space-y-3 block">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Overlay Opacity</span>
                                            <span className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-500">
                                                {Math.round((appearance.bgOverlay || 0) * 100)}%
                                            </span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="0.9" 
                                            step="0.05"
                                            value={appearance.bgOverlay || 0}
                                            onChange={(e) => handleChange("bgOverlay", parseFloat(e.target.value))}
                                            className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                    </label>

                                    <label className="space-y-3 block">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Blur Amount</span>
                                            <span className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-500">
                                                {appearance.bgBlur || 0}px
                                            </span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="20" 
                                            step="1"
                                            value={appearance.bgBlur || 0}
                                            onChange={(e) => handleChange("bgBlur", parseInt(e.target.value))}
                                            className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                    </label>
                                </div>
                            </div>
                        )}
                    </Section>

                    <Section title="Buttons" icon={Square} description="Shape & feel of your links">
                        <div className="space-y-8">
                            <div>
                                <label className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 block">Button Style</label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                    {BUTTON_STYLES.map((style) => {
                                        const isLocked = style.isPro && user.plan !== "pro";
                                        return (
                                            <button
                                                key={style.value}
                                                onClick={() => handleChange("buttonStyle", style.value, style.isPro)}
                                                className={`relative py-4 px-2 rounded-xl text-xs sm:text-sm font-medium border transition-all flex flex-col items-center gap-2 cursor-pointer ${
                                                    appearance.buttonStyle === style.value
                                                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-600 shadow-sm"
                                                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-800/20"
                                                } ${isLocked ? "opacity-75" : ""}`}
                                            >
                                                <span>{style.name}</span>
                                                {isLocked && (
                                                    <div className="absolute inset-0 bg-black/5 dark:bg-black/40 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                                                        <Lock className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 block">Button Roundness</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {BUTTON_ROUNDNESS.map((round) => (
                                        <button
                                            key={round.value}
                                            onClick={() => handleChange("buttonRoundness", round.value)}
                                            className={`relative py-3 px-2 rounded-xl text-xs sm:text-sm font-medium border transition-all flex flex-col items-center gap-2 cursor-pointer ${
                                                appearance.buttonRoundness === round.value
                                                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-600 shadow-sm"
                                                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-800/20"
                                            }`}
                                        >
                                            <span>{round.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ColorPicker 
                                    label="Button Color" 
                                    value={appearance.buttonColor} 
                                    onChange={(v) => handleChange("buttonColor", v)} 
                                />
                                <ColorPicker 
                                    label="Button Text" 
                                    value={appearance.buttonFontColor} 
                                    onChange={(v) => handleChange("buttonFontColor", v)} 
                                />
                            </div>
                        </div>
                    </Section>

                     {/* fonts section */}
                     <Section title="Typography" icon={TypeIcon} description="Fonts & text styles">
                        <div className="space-y-8">
                            <div>
                                <label className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 block">Font Family</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {FONTS.map((font) => {
                                        const isLocked = font.isPro && user.plan !== "pro";
                                        return (
                                            <button
                                                key={font.value}
                                                onClick={() => handleChange("fontFamily", font.value, font.isPro)}
                                                style={{ fontFamily: font.value }}
                                                className={`relative p-5 rounded-2xl border text-left transition-all cursor-pointer overflow-hidden ${
                                                    appearance.fontFamily === font.value
                                                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-600 shadow-sm"
                                                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-800/20 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                                                } ${isLocked ? "opacity-75" : ""}`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <span className="text-3xl leading-none opacity-80">Aa</span>
                                                    {isLocked ? (
                                                        <div className="absolute inset-0 bg-black/5 dark:bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                                                            <Lock className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                                                        </div>
                                                    ) : (
                                                        appearance.fontFamily === font.value && <Check className="w-4 h-4 text-indigo-600" />
                                                    )}
                                                </div>
                                                <span className="block text-xs mt-3 opacity-60 font-sans tracking-wider uppercase font-semibold">{font.name}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            
                            <ColorPicker 
                                label="Global Text Color" 
                                value={appearance.fontColor} 
                                onChange={(v) => handleChange("fontColor", v)} 
                            />
                        </div>
                    </Section>

                    {/* branding section */}
                    <Section title="Branding" icon={Lock} description="Manage your profile footer">
                        <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-800/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                    <img src="/favicon.ico" alt="" className="w-5 h-5 opacity-50 grayscale" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Hide Bunchly Branding</h4>
                                    <p className="text-xs text-neutral-500">Remove the logo from your profile footer.</p>
                                </div>
                            </div>
                            
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={appearance.hideBranding}
                                    onChange={(e) => handleChange("hideBranding", e.target.checked, true, true)}
                                    className="sr-only peer"
                                />
                                <div className={`w-11 h-6 bg-neutral-200 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600`}></div>
                                
                                {user.plan !== "pro" && (
                                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 cursor-not-allowed z-10 flex items-center justify-center rounded-full">
                                        <Lock className="w-3 h-3 text-neutral-600" />
                                    </div>
                                )}
                            </label>
                        </div>
                    </Section>

                </div>

                {/* 📱 RIGHT COLUMN: PREVIEW */}
                <div className="lg:col-span-5 hidden lg:block">
                    <div className="sticky top-8">
                        <div className="bg-neutral-900 rounded-[3rem] border-[10px] border-neutral-900 p-2 shadow-2xl h-[720px] w-[360px] mx-auto overflow-hidden relative ring-1 ring-white/10">
                          
                            
                            
                            {/* Side Buttons */}
                            <div className="absolute top-24 -right-3 w-1 h-12 bg-neutral-800 rounded-r-md"></div>
                            <div className="absolute top-24 -left-3 w-1 h-8 bg-neutral-800 rounded-l-md"></div>
                            <div className="absolute top-36 -left-3 w-1 h-12 bg-neutral-800 rounded-l-md"></div>

                            {/* Screen */}
                            <div className="w-full h-full bg-white dark:bg-neutral-950 rounded-[2.2rem] overflow-hidden relative border border-neutral-800">
                                <LivePreview user={previewUser} links={previewLinks} mode="preview" />
                            </div>
                        </div>
                        <div className="text-center mt-6 text-sm font-medium text-neutral-400">
                             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-sm backdrop-blur-sm mb-6 sm:mb-8 transition-transform hover:scale-105 cursor-default">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                             Live Preview
                        </span>
                    </div>
                        </div>
                    </div>
                </div>

                {/* 📱 MOBILE SAVE BAR */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border-t border-neutral-200 dark:border-white/10 z-50 md:hidden animate-in slide-in-from-bottom-full duration-500">
                    <div className="max-w-md mx-auto">
                        <Button 
                            text={loading ? "Saving..." : "Save Changes"}
                            icon={loading ? Loader2 : Save}
                            disabled={loading}
                            onClick={handleSave}
                            fullWidth
                            className="bg-white text-neutral-900 hover:bg-neutral-800 dark:text-white dark:hover:bg-neutral-200 shadow-xl rounded-xl py-3.5 font-bold"
                        />
                    </div>
                </div>

                <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
            </div>
        </div>
    );
};

// ---------------- Helper Components ----------------

const Section = ({ title, icon: Icon, children, description }) => (
    <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-8">
             <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {title}
                </h2>
            </div>
            {description && <p className="text-sm text-neutral-500 dark:text-neutral-400 ml-[3.25rem]">{description}</p>}
        </div>
        {children}
    </div>
);

const ColorPicker = ({ label, value, onChange }) => (
    <label className="flex flex-col gap-3 w-full group">
        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{label}</span>
        <div className="flex items-center gap-3 border border-neutral-200 dark:border-neutral-700 p-2 pr-4 rounded-xl bg-white dark:bg-neutral-800 w-full transition-all group-focus-within:ring-2 ring-indigo-500/20 group-focus-within:border-indigo-500/50">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm ring-1 ring-black/10 dark:ring-white/10 shrink-0">
                <input
                    type="color"
                    value={/^#[0-9A-F]{6}$/i.test(value) ? value : "#000000"}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-none"
                />
            </div>
             <input 
                type="text" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="font-mono text-sm bg-transparent outline-none flex-1 text-neutral-600 dark:text-neutral-300 uppercase w-full"
            />
        </div>
    </label>
);

const ThemeCard = ({ theme, isSelected, isLocked, onSelect }) => (
    <button
        onClick={() => onSelect(theme)}
        className={`group relative aspect-[3/4] rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col items-center justify-end pb-4 cursor-pointer ${
            isSelected
                ? "border-indigo-600 ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-neutral-900 shadow-lg" 
                : "border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 shadow-sm"
        }`}
    >
        {/* Preview Background */}
        <div className={`absolute inset-0 z-0 ${theme.preview} transition-transform duration-500 group-hover:scale-110`}></div>
        
        {/* Active Overlay (Subtle) */}
        {!isSelected && <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/5 transition-colors duration-300 z-0"></div>}

        {/* Lock Overlay */}
        {isLocked && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center gap-2">
                <Lock className="w-6 h-6 text-white/90" />
                <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest bg-white/20 px-2 py-1 rounded">Locked</span>
            </div>
        )}

        {/* Selected Check */}
        {isSelected && (
            <div className="absolute top-2 right-2 z-20 bg-indigo-600 text-white rounded-full p-1 shadow-md animate-in zoom-in duration-200">
                 <Check className="w-3 h-3" strokeWidth={4} />
            </div>
        )}

        {/* Label */}
        <div className="relative z-10 px-3 py-1.5 bg-white/95 dark:bg-black/85 backdrop-blur-md rounded-full text-xs font-semibold shadow-md transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
            {theme.name}
        </div>
    </button>
);

export default Appearance;
