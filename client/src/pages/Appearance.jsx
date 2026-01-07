import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LivePreview from "../components/preview/LivePreview";
import Button from "../components/ui/Button";


import { Save, Loader2, Sparkles, TypeIcon, Square, Palette, ImageIcon, Lock } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { THEMES } from "../lib/themes";

// 🎨 Presets with PRO flagging
const GRADIENTS = [
    { value: "from-indigo-500 to-purple-600", isPro: true },
    { value: "from-rose-400 to-orange-300", isPro: true },
    { value: "from-emerald-400 to-cyan-400", isPro: true },
    { value: "from-slate-900 to-slate-700", isPro: true },
    { value: "from-blue-600 to-violet-600", isPro: true },
    { value: "from-fuchsia-500 to-pink-500", isPro: true },
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

const Appearance = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // Initial State
    const [appearance, setAppearance] = useState({
        bgType: "color",
        bgColor: "#ffffff",
        bgGradient: "from-indigo-500 to-purple-600",
        bgImage: "",
        buttonStyle: "fill",
        buttonColor: "#171717",
        buttonFontColor: "#ffffff",
        fontFamily: "Inter",
        fontColor: "#171717",
    });

    // Load user appearance on mount
    useEffect(() => {
        if (user?.appearance) {
            setAppearance({ ...appearance, ...user.appearance });
        }
    }, [user]);

    // Handle Change
    const handleChange = (key, value, isProFeature = false) => {
        if (isProFeature && user.plan !== "pro") {
            toast.error("Upgrade to Pro to unlock this feature", {
                action: {
                    label: "Upgrade",
                    onClick: () => navigate("/dashboard/upgrade")
                }
            });
            return;
        }
        setAppearance((prev) => ({ ...prev, [key]: value }));
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

    // Dummy Links for Preview
    const previewLinks = [
        { _id: "1", title: "My Portfolio", url: "#", icon: "globe", isActive: true },
        { _id: "2", title: "Instagram", url: "#", icon: "instagram", isActive: true },
        { _id: "3", title: "Music Collection", type: "collection", isActive: true },
        { _id: "4", title: "Latest Mix", url: "#", icon: "music", isActive: true, parentId: "3" },
    ];

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 🛠 LEFT COLUMN: EDITOR */}
                <div className="lg:col-span-7 space-y-8 pb-32">
                    
                    {/* Sticky Header */}
                    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-white/5 py-4 -mx-4 px-4 md:px-0 md:mx-0 md:border-none md:bg-transparent md:backdrop-blur-none flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-neutral-900 dark:text-white">
                                <Palette className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
                                Appearance
                            </h1>
                            <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 mt-1 hidden md:block">
                                Customize your profile's look and feel.
                            </p>
                        </div>
                        
                         {/* Mobile Save Button Wrapper to ensure visibility */}
                        <div className="fixed bottom-6 right-6 z-50 md:static md:z-auto">
                            <Button 
                                text={loading ? "Saving..." : "Save Changes"}
                                icon={loading ? Loader2 : Save}
                                disabled={loading}
                                onClick={handleSave}
                                className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xl md:shadow-none rounded-full md:rounded-xl px-6 py-3 md:py-2"
                            />
                        </div>
                    </header>

                    {/* 🎨 THEMES (NEW) */}
                    <Section title="Theme Gallery" icon={Sparkles}>
                        
                        {/* FREE THEMES */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">Free Collection</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {THEMES.filter(t => !t.isPro).map((t) => (
                                    <ThemeCard 
                                        key={t.id} 
                                        theme={t} 
                                        isSelected={appearance.theme === t.id}
                                        onSelect={(theme) => {
                                             setAppearance(prev => ({
                                                 ...prev,
                                                 theme: theme.id,
                                                 bgType: theme.bgType,
                                                 bgColor: theme.bgColor || prev.bgColor,
                                                 bgGradient: theme.bgGradient || prev.bgGradient,
                                                 buttonStyle: theme.buttonStyle,
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

                        {/* PREMIUM THEMES */}
                        <div>
                             <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Premium Collection</h3>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">PRO</span>
                             </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {THEMES.filter(t => t.isPro).map((t) => (
                                    <ThemeCard 
                                        key={t.id} 
                                        theme={t} 
                                        isLocked={user.plan !== "pro"}
                                        isSelected={appearance.theme === t.id}
                                        onSelect={(theme) => {
                                            if (user.plan !== "pro") {
                                                toast.error("Upgrade to Pro to unlock this theme", {
                                                    action: { label: "Upgrade", onClick: () => navigate("/dashboard/upgrade") }
                                                });
                                                return;
                                            }
                                             setAppearance(prev => ({
                                                 ...prev,
                                                 theme: theme.id,
                                                 bgType: theme.bgType,
                                                 bgColor: theme.bgColor || prev.bgColor,
                                                 bgGradient: theme.bgGradient || prev.bgGradient,
                                                 buttonStyle: theme.buttonStyle,
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
                    </Section>

                    {/* background customization (collapsible or always visible) */}
                    <Section title="Custom Background" icon={ImageIcon}>
                        <div className="flex gap-2 p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit mb-6">
                            {["color", "gradient"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleChange("bgType", type, type === "gradient")}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                        appearance.bgType === type
                                            ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white"
                                            : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                                    }`}
                                >
                                    {type === "gradient" && <Sparkles className="w-3 h-3 text-amber-500" />}
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>

                        {appearance.bgType === "color" && (
                            <div className="flex items-center gap-4 animate-fade-in">
                                <label className="flex flex-col gap-2 text-sm font-medium w-full">
                                    Background Key Color
                                    <div className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 p-2 rounded-xl bg-white dark:bg-neutral-800/50 w-full transition-all focus-within:ring-2 ring-indigo-500/20">
                                        <input
                                            type="color"
                                            value={appearance.bgColor}
                                            onChange={(e) => { handleChange("bgColor", e.target.value); handleChange("theme", "custom"); }}
                                            className="w-10 h-10 cursor-pointer rounded-lg bg-transparent border-none appearance-none p-0"
                                        />
                                        <input 
                                            type="text" 
                                            value={appearance.bgColor}
                                            onChange={(e) => { handleChange("bgColor", e.target.value); handleChange("theme", "custom"); }}
                                            className="font-mono text-sm bg-transparent outline-none flex-1 text-neutral-600 dark:text-neutral-300 uppercase"
                                        />
                                    </div>
                                </label>
                            </div>
                        )}

                        {appearance.bgType === "gradient" && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
                                {GRADIENTS.map((grad) => {
                                    const isLocked = grad.isPro && user.plan !== "pro";
                                    return (
                                        <div
                                            key={grad.value}
                                            onClick={() => { handleChange("bgGradient", grad.value, true); handleChange("theme", "custom"); }}
                                            className={`relative h-24 rounded-2xl cursor-pointer bg-gradient-to-br ${grad.value} ring-2 ring-offset-2 dark:ring-offset-neutral-900 transition-all ${
                                                appearance.bgGradient === grad.value
                                                    ? "ring-indigo-600 scale-[1.02]"
                                                    : "ring-transparent hover:scale-[1.02]"
                                            }`}
                                        >
                                            {isLocked && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl">
                                                    <Lock className="w-6 h-6 text-white/90" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </Section>

                    {/* buttons section */}
                    <Section title="Buttons" icon={Square}>
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
                                                className={`relative py-4 px-2 rounded-xl text-xs sm:text-sm font-medium border-2 transition-all flex flex-col items-center gap-2 ${
                                                    appearance.buttonStyle === style.value
                                                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                                                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                                                }`}
                                            >
                                                <span>{style.name}</span>
                                                {isLocked && <Lock className="w-3 h-3 text-neutral-400" />}
                                            </button>
                                        )
                                    })}
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
                     <Section title="Typography" icon={TypeIcon}>
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
                                                className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                                                    appearance.fontFamily === font.value
                                                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                                                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-800/30"
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <span className="text-2xl">Aa</span>
                                                    {isLocked && <Lock className="w-4 h-4 text-neutral-400" />}
                                                </div>
                                                <span className="block text-xs mt-2 opacity-70 font-sans tracking-wide">{font.name}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            
                            <ColorPicker 
                                label="Text Color" 
                                value={appearance.fontColor} 
                                onChange={(v) => handleChange("fontColor", v)} 
                            />
                        </div>
                    </Section>

                </div>

                {/* 📱 RIGHT COLUMN: PREVIEW */}
                <div className="lg:col-span-5 hidden lg:block">
                    <div className="sticky top-8">
                        <div className="bg-neutral-900 rounded-[3rem] border-8 border-neutral-900 p-2 shadow-2xl h-[700px] w-[350px] mx-auto overflow-hidden relative ring-1 ring-white/10">
                            {/* Phone Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-neutral-900 rounded-b-2xl z-20"></div>
                            
                            {/* Screen */}
                            <div className="w-full h-full bg-white dark:bg-neutral-950 rounded-[2.5rem] overflow-hidden relative">
                                <LivePreview user={previewUser} links={previewLinks} mode="preview" />
                            </div>
                        </div>
                        <div className="text-center mt-6 text-sm font-medium text-neutral-500 animate-pulse-slow">
                             Live Preview
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// ---------------- Helper Components ----------------

const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
        <h2 className="text-lg font-bold mb-8 flex items-center gap-3 text-neutral-900 dark:text-white">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            {title}
        </h2>
        {children}
    </div>
);

const ColorPicker = ({ label, value, onChange }) => (
    <label className="flex flex-col gap-3 w-full">
        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{label}</span>
        <div className="flex items-center gap-3 border border-neutral-200 dark:border-neutral-700 pl-2 pr-4 py-2 rounded-xl bg-white dark:bg-neutral-800 w-full transition-all focus-within:ring-2 ring-indigo-500/20">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-10 cursor-pointer rounded-lg bg-transparent border-none appearance-none p-0 shrink-0 shadow-sm"
            />
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
        className={`group relative aspect-[3/4] rounded-2xl border-2 transition-all overflow-hidden flex flex-col items-center justify-end pb-4 ${
            isSelected
                ? "border-indigo-600 ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-neutral-900" 
                : "border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
        }`}
    >
        {/* Preview Background */}
        <div className={`absolute inset-0 z-0 ${theme.preview} transition-transform duration-500 group-hover:scale-110`}></div>
        
        {/* Lock Overlay */}
        {isLocked && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
            </div>
        )}

        {/* Selected Check */}
        {isSelected && (
            <div className="absolute top-2 right-2 z-20 bg-indigo-600 text-white rounded-full p-1 shadow-md">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
        )}

        {/* Label */}
        <div className="relative z-10 px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-xs font-semibold shadow-sm">
            {theme.name}
        </div>
    </button>
);

export default Appearance;
