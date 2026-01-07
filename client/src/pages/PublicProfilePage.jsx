import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Share2 } from "lucide-react";
import LivePreview from "../components/preview/LivePreview"; // New consistent component
import Button from "../components/ui/Button";
import { useSEO } from "../hooks/useSEO";
import { buildUrl } from "../lib/seo";
import PublicProfileNotFound from "../components/PublicProfileNotFound";
import { toast } from "sonner";
import SmartSkeleton from "../components/ui/SmartSkeleton";

const PublicProfilePage = () => {
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [links, setLinks] = useState([]);
    const [isSuspended, setIsSuspended] = useState(false);

    const navigate = useNavigate();
    const profileUrl = `${window.location.origin}/${username}`;

    useSEO({
        title: isSuspended 
            ? "Account Suspended – Bunchly"
            : user
                ? `${user.name || user.username} (@${user.username}) – Bunchly`
                : "Profile – Bunchly",
        description: user?.bio || "View digital profiles on Bunchly.",
        image: user?.image || "/og-image.png",
        url: buildUrl(`/${username}`),
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
                    // Check specifically for banned flag from backend
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

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `${user.username} on Bunchly`,
                    text: `Check out my links!`,
                    url: profileUrl,
                });
            } else {
                await navigator.clipboard.writeText(profileUrl);
                toast.success("Link copied!");
            }
        } catch {
            toast.error("Failed to share");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><SmartSkeleton variant="profile" /></div>;
    
    // Handle Suspended State
    if (isSuspended) return <SuspendedAccount username={username} />;
    
    if (!user) return <PublicProfileNotFound username={username} />;

    return (
        <div className="min-h-screen w-full relative">
            {/* LivePreview acts as the main background + content container */}
            <LivePreview 
                user={user} 
                links={links} 
                mode="public" 
                className="min-h-screen" // Ensure it covers viewport
            />

            {/* Floating UI: Branding / Share (Overlay) */}
            <div className="fixed bottom-6 w-full flex flex-col items-center gap-3 pointer-events-none z-50">
                
                {/* Share Button Block */}
                <div className="pointer-events-auto shadow-2xl shadow-black/10 rounded-full">
                    <Button 
                        icon={Share2}
                        text="Share"
                        onClick={handleShare}
                        size="sm"
                        className="rounded-full !px-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:scale-105 transition-transform font-semibold text-xs"
                    />
                </div>

                {/* Bunchly Branding */}
                <Link to="/" className="pointer-events-auto opacity-40 hover:opacity-100 transition-opacity drop-shadow-sm flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/20">
                     <img src="/img/Bunchly-light.png" className="h-4 block dark:hidden invert" alt="Bunchly" />
                     <img src="/img/Bunchly-dark.png" className="h-4 hidden dark:block" alt="Bunchly" />
                </Link>
            </div>
        </div>
    );
};

/* --------------------------------------------------
   SUSPENDED ACCOUNT COMPONENT
-------------------------------------------------- */
import { ShieldAlert, AlertTriangle } from "lucide-react";

const SuspendedAccount = ({ username }) => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral-50 dark:bg-[#0F0F14] px-4 text-center">
            <div className="max-w-md w-full bg-white dark:bg-[#15151A] rounded-3xl p-8 border border-neutral-200 dark:border-white/5 shadow-xl shadow-neutral-100/50 dark:shadow-none animate-fade-in-up">
                
                <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 dark:text-red-500">
                    <ShieldAlert className="w-10 h-10" />
                </div>

                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                    Account Suspended
                </h1>
                
                <p className="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
                    The profile <strong>@{username}</strong> is currently unavailable due to a violation of our Terms of Service.
                </p>

                <div className="bg-neutral-50 dark:bg-black/20 rounded-xl p-4 border border-neutral-100 dark:border-white/5 mb-8">
                    <div className="flex gap-3 text-left">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            If you believe this is an error, please contact our support team for assistance regarding Case ID: <span className="font-mono text-neutral-900 dark:text-white">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                <Link to="/">
                    <Button 
                        text="Go to Homepage"
                        className="w-full justify-center"
                    />
                </Link>
            </div>

            <div className="mt-8 opacity-40 hover:opacity-100 transition-opacity">
                 <img src="/img/Bunchly-light.png" className="h-5 block dark:hidden" alt="Bunchly" />
                 <img src="/img/Bunchly-dark.png" className="h-5 hidden dark:block" alt="Bunchly" />
            </div>
        </div>
    );
};

export default PublicProfilePage;
