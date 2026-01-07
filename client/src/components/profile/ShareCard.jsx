import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, X, Share2, Copy } from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";

const ShareCard = ({ user, onClose }) => {
    const cardRef = useRef(null);
    const profileUrl = `${window.location.origin}/${user.username}`;
    const [generating, setGenerating] = React.useState(false);

    const handleDownload = async () => {
        if (!cardRef.current || generating) return;
        setGenerating(true);
        try {
            // Wait a moment for fonts/images to be ready
            await new Promise(resolve => setTimeout(resolve, 100));
            const dataUrl = await toPng(cardRef.current, { 
                cacheBust: true, 
                pixelRatio: 2, // High resolution
                backgroundColor: 'transparent'
            });
            const link = document.createElement("a");
            link.download = `${user.username}-bunchly.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Image saved to gallery!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save image");
        } finally {
            setGenerating(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success("Link copied!");
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Check out ${user.username} on Bunchly`,
                    text: user.bio || "One link for everything.",
                    url: profileUrl,
                });
            } catch (err) {
               // ignore
            }
        } else {
            handleCopyLink();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-[320px]"> {/* Compact Width */}
                
                <div className="bg-white dark:bg-[#18181B] rounded-[28px] p-5 w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200 overflow-hidden ring-1 ring-white/10 relative">
                    
                    {/* Close Button - Internal & Explicit */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-500 dark:text-neutral-400 transition-colors z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <h3 className="text-lg font-bold text-center mb-5 text-neutral-900 dark:text-white tracking-tight">Share Profile</h3>

                    {/* The Card to be captured */}
                    <div 
                        ref={cardRef}
                        className="aspect-[4/5] w-full rounded-2xl overflow-hidden relative flex flex-col items-center justify-center p-6 mb-6 select-none shadow-xl transform transition-transform"
                        style={{
                            background: "radial-gradient(circle at 0% 0%, #4f46e5 0%, transparent 55%), radial-gradient(circle at 100% 100%, #ec4899 0%, transparent 55%), #0f172a",
                        }}
                    >
                        {/* Noise texture overlay */}
                        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>

                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col items-center gap-4 shadow-2xl w-full max-w-[200px]">
                            {/* Profile Pic */}
                            <div className="relative">
                                {user.image ? (
                                    <img src={user.image} alt={user.username} className="w-16 h-16 rounded-full object-cover border-[3px] border-white shadow-lg" crossOrigin="anonymous" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-indigo-600 shadow-lg">
                                        {user.username[0].toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute -bottom-1.5 -right-1.5 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-sm">
                                    @{user.username}
                                </div>
                            </div>

                            {/* Premium QR Code */}
                            <div className="bg-white p-3 rounded-2xl shadow-sm border border-neutral-100">
                                <QRCodeSVG 
                                    value={profileUrl} 
                                    size={130}
                                    level="M"
                                    fgColor="#1e1b4b" // Premium Dark Indigo
                                    bgColor="#ffffff"
                                    imageSettings={{
                                        src: "/apple-touch-icon.png",
                                        x: undefined,
                                        y: undefined,
                                        height: 28,
                                        width: 28,
                                        excavate: true,
                                    }}
                                />
                            </div>

                            {/* Brand Logo Below QR */}
                            <img 
                                src="/img/Bunchly-dark.png" 
                                alt="Bunchly" 
                                className="h-8 object-contain opacity-95 drop-shadow-sm mt-1" 
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={handleNativeShare} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 group">
                            <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                <Share2 className="w-4 h-4" />
                            </div>
                            Share
                        </button>
                        <button onClick={handleCopyLink} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 group">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                <Copy className="w-4 h-4" />
                            </div>
                            Copy
                        </button>
                        <button onClick={handleDownload} disabled={generating} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 group disabled:opacity-50">
                            <div className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                                <Download className="w-4 h-4" />
                            </div>
                            Save
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ShareCard;
