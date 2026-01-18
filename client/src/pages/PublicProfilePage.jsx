import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Share2, Flag } from "lucide-react";
import LivePreview from "../components/preview/LivePreview";
import { useSEO } from "../hooks/useSEO";
import { buildUrl } from "../lib/seo";
import PublicProfileNotFound from "../components/PublicProfileNotFound";
import SmartSkeleton from "../components/ui/SmartSkeleton";
import ShareCard from "../components/profile/ShareCard";
import SuspendedAccount from "../components/SuspendedAccount"; // Assuming this exists or I need to find where it was
import { AnimatePresence } from "framer-motion";

import ReportModal from "../components/profile/ReportModal";

const PublicProfilePage = () => {
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [links, setLinks] = useState([]);
    const [isSuspended, setIsSuspended] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showReport, setShowReport] = useState(false);

    const navigate = useNavigate();
    const profileUrl = `${window.location.origin}/${username}`;

    const structuredData = useMemo(() => user ? {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": user.name || user.username,
        "alternateName": user.username,
        "url": profileUrl,
        "image": user.image,
        "description": user.bio,
        "sameAs": links.filter(l => l.url && l.isActive).map(l => l.url)
    } : null, [user, links, profileUrl]);

    useSEO({
        title: isSuspended 
            ? "Account Suspended – Bunchly"
            : user
                ? `${user.name || user.username} (@${user.username}) – Bunchly`
                : "Profile – Bunchly",
        description: user?.bio || "View digital profiles on Bunchly.",
        image: user?.image || "/og-image.png",
        url: buildUrl(`/${username}`),
        structuredData,
        type: "profile",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/user/public/${username}`
                );
                const data = await res.json();
                
                if (data.success) {
                    setUser(data.user);
                    setLinks(data.links || []);
                    setIsSuspended(false);
                } else {
                    if (data.isBanned || res.status === 403 || (res.status === 404 && data.isBanned)) {
                        setIsSuspended(true);
                    }
                    setUser(null);
                }
            } catch (err) {
                console.error("Public profile error:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    const handleShare = () => {
        setShowShare(true);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><SmartSkeleton variant="profile" /></div>;
    
    if (isSuspended) return <SuspendedAccount />;
    
    if (!user) return <PublicProfileNotFound username={username} />;

    return (
        <div className="min-h-screen w-full relative bg-white dark:bg-black">
            <LivePreview 
                user={user} 
                links={links} 
                mode="public" 
                className="min-h-screen"
            />

            {/* Floating Action Bar */}
            <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none flex justify-center pb-safe animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500 fill-mode-backwards">
                <div className="pointer-events-auto flex items-center gap-2 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-neutral-200 dark:border-white/10 shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
                    {!(user?.plan === 'pro' && user?.appearance?.hideBranding) && (
                        <>
                            <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors group">
                                {/* Adaptive Logo */}
                                <img src="/img/Bunchly-light.png" alt="Bunchly" className="h-7 block dark:hidden opacity-90 group-hover:opacity-100 transition-opacity" />
                                <img src="/img/Bunchly-dark.png" alt="Bunchly" className="h-7 hidden dark:block opacity-90 group-hover:opacity-100 transition-opacity" />
                                
                                {/* Fallback Text if images fail to load or for SEO */}
                                <span className="sr-only">Bunchly</span>
                            </Link>
                            
                            <div className="w-[1px] h-6 bg-neutral-200 dark:bg-white/10 mx-1"></div>
                        </>
                    )}

                    <button 
                        onClick={handleShare}
                        className="p-2.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors active:scale-95 flex items-center justify-center transform hover:rotate-12 duration-300"
                        aria-label="Share Profile"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>

                    {/* Report Button */}
                    <button 
                        onClick={() => setShowReport(true)}
                        className="p-2.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors active:scale-95 flex items-center justify-center group"
                        aria-label="Report Profile"
                    >
                        <Flag className="w-5 h-5 group-hover:fill-current transition-colors" />
                    </button>
                </div>
            </div>

            {/* Share Modal */}
            <AnimatePresence>
                {showShare && <ShareCard user={user} onClose={() => setShowShare(false)} />}
                {showReport && <ReportModal user={user} onClose={() => setShowReport(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default PublicProfilePage;
