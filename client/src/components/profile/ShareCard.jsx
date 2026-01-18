import React, { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, X, Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { toPng, toBlob } from "html-to-image";

const ShareCard = ({ user, onClose }) => {
    const cardRef = useRef(null);
    const profileUrl = `${window.location.origin}/${user.username}`;
    const [generating, setGenerating] = useState(false);

    // 💎 Premium "Obsidian" Gradient
    const cardGradient = "linear-gradient(145deg, #0f172a 0%, #1e1b4b 45%, #000000 100%)";
    const accentColor = "#6366f1"; // Indigo-500

    const handleDownload = async () => {
        if (!cardRef.current || generating) return;
        setGenerating(true);
        try {
            // Wait for render stability
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const dataUrl = await toPng(cardRef.current, { 
                cacheBust: true, 
                pixelRatio: 4, 
                backgroundColor: null, // Transparent bg for rounded corners
                style: { transform: 'none', margin: 0 }, // Reset positioning for capture
            });
            
            const link = document.createElement("a");
            link.download = `${user.username}-bunchly-card.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Saved to gallery!");
        } catch (err) {
            console.error(err);
            toast.error("Could not save image.");
        } finally {
            setGenerating(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success("Link copied!");
    };

    const handleNativeShare = async () => {
        setGenerating(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 100));

            const shareTitle = `Connect with ${user.name || user.username}`;
            const shareText = `Scan to connect with me on Bunchly!\n\n${profileUrl}`;
            
            if (navigator.canShare && navigator.canShare({ files: [new File([], 'test.png', { type: 'image/png' })] }) && cardRef.current) {
                 const blob = await toBlob(cardRef.current, { 
                    cacheBust: true, 
                    pixelRatio: 3, 
                    style: { transform: 'none', margin: 0 },
                });
                
                if (blob) {
                    const file = new File([blob], `bunchly-${user.username}.png`, { type: "image/png" });
                    const fileShareData = { 
                        files: [file],
                        title: shareTitle,
                        text: shareText,
                        url: profileUrl 
                    };
                    
                    if (navigator.canShare(fileShareData)) {
                        await navigator.share(fileShareData);
                        return;
                    }
                }
            }

            // Fallback
            if (navigator.share) {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: profileUrl,
                });
            } else {
                handleCopyLink();
            }
        } catch (err) {
            console.error("Share failed:", err);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
            <div className="relative w-full max-w-[220px] flex flex-col gap-3 scale-100 animate-in zoom-in-95 duration-300 my-auto">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute -top-8 right-0 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer border border-white/5 active:scale-95 z-50"
                    aria-label="Close"
                >
                    <X className="w-3.5 h-3.5" />
                </button>

                {/* 🪪 THE PREMIUM CAPTURE CARD */}
                {/* We remove transforms from this specific container during capture to fix the "disturbed design" bug */}
                <div 
                    ref={cardRef}
                    className="relative w-full aspect-[9/14] rounded-[20px] overflow-hidden flex flex-col items-center justify-between p-4 shadow-2xl select-none group"
                    style={{ background: cardGradient }}
                >
                    {/* --- BACKGROUND FX --- */}
                    {/* Noise Texture */}
                    <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")` }}></div>
                    
                    {/* Ambient Glows */}
                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/30 rounded-full blur-[60px] pointer-events-none" />
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-[60px] pointer-events-none" />

                    {/* --- TOP: PROFILE --- */}
                    <div className="relative z-10 flex flex-col items-center text-center gap-2 w-full mt-1">
                        <div className="relative p-0.5 rounded-full bg-gradient-to-br from-white/30 to-white/5 backdrop-blur-sm border border-white/10 shadow-xl">
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-900 border-2 border-neutral-900/50">
                                {user.image ? (
                                    <img src={user.image} alt={user.username} className="w-full h-full object-cover" crossOrigin="anonymous" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-indigo-400 bg-neutral-800">
                                        {user.username[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            {/* Verification Badge (Visual Only) */}
                            {
                                user.plan !== "free" && (
                                    <div className="absolute bottom-0 right-0 bg-yellow-500 text-white p-0.5 rounded-full border-[1.5px] border-[#0f172a] shadow-sm">
                                        <Check className="w-2 h-2" strokeWidth={3} />
                                    </div>
                                )
                            }
                        </div>
                        
                        <div>
                             <h2 className="text-white font-bold text-base tracking-tight leading-tight drop-shadow-md">
                                {user.name || user.username}
                            </h2>
                            <p className="text-indigo-200/80 text-[10px] font-medium m-0.5 uppercase tracking-widest">
                                @{user.username}
                            </p>
                        </div>
                    </div>

                    {/* --- CENTER: QR CODE PLAQUE --- */}
                    <div className="relative z-10 bg-neutral-900 p-2.5 rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-white/10 group-hover:scale-[1.02] transition-transform duration-500 will-change-transform">
                         <QRCodeSVG 
                            value={profileUrl} 
                            size={100}
                            level="H" 
                            fgColor="#ffffff" // Dark Slate
                            bgColor="#0f172a"
                            imageSettings={{
                                src: "/favicon.ico",
                                x: undefined,
                                y: undefined,
                                height: 20,
                                width: 20,
                                excavate: true,
                            }}
                        />
                         <p className="text-center text-[7px] font-bold text-neutral-400 uppercase tracking-widest mt-1.5">Scan me</p>
                    </div>

                    {/* --- FOOTER: BRANDING --- */}
                    <div className="relative z-10 mt-4">
                        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg group-hover:bg-white/10 transition-colors duration-500">
                             <span className="text-[7px] text-indigo-200/60 font-bold tracking-widest uppercase">Powered by</span>
                            <img src="/img/Bunchly-dark.png" alt="Bunchly" className="h-4 opacity-90 drop-shadow-sm" />
                        </div>
                    </div>
                </div>

                {/* --- ACTION BAR --- */}
                <div className="grid grid-cols-3 gap-4 px-2">
                    <ActionButton 
                        icon={Share2} 
                        label="Share" 
                        onClick={handleNativeShare} 
                        loading={generating}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/50 shadow-indigo-500/25"
                    />
                    <ActionButton 
                        icon={Copy} 
                        label="Copy" 
                        onClick={handleCopyLink} 
                        className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 shadow-black/20"
                    />
                    <ActionButton 
                        icon={Download} 
                        label="Save" 
                        onClick={handleDownload} 
                        loading={generating}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 shadow-black/20"
                    />
                </div>
            </div>
        </div>
    );
};

// Helper for sleek buttons
const ActionButton = ({ icon: Icon, label, onClick, loading, className = "" }) => (
    <button 
        onClick={onClick}
        disabled={loading}
        className={`flex flex-col items-center justify-center gap-2 py-3.5 px-2 rounded-2xl border shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer ${className}`}
    >
        <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/10 mb-1`}>
            <Icon className="w-5 h-5" />
        </div>
        <span className="text-[11px] font-bold tracking-wide uppercase">{loading ? "..." : label}</span>
    </button>
);

export default ShareCard;
