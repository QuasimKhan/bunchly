import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Link2, Share2 } from "lucide-react";
import { PreviewPage } from "../components/preview/PreviewModal";
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

    const navigate = useNavigate();

    const profileUrl = `${window.location.origin}/${username}`;

    useSEO({
        title: user
            ? `${user.name} (@${user.username}) – Bunchly`
            : "Profile – Bunchly",
        description: user?.bio || "View digital profiles on Bunchly.",
        image: user?.image || "/og-image.png",
        url: buildUrl(`/${username}`),
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `${
                        import.meta.env.VITE_API_URL
                    }/api/user/public/${username}`
                );
                const data = await res.json();

                if (data.success) {
                    setUser(data.user);
                    setLinks(data.links || []);
                } else {
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

    /* ---------------- Share Handler ---------------- */
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `${user.name} on Bunchly`,
                    text: `Check out ${user.name}'s profile on Bunchly`,
                    url: profileUrl,
                });
            } else {
                await navigator.clipboard.writeText(profileUrl);
                toast.success("Profile link copied");
            }
        } catch {
            toast.error("Unable to share profile");
        }
    };

    /* ---------------- Loading ---------------- */
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-neutral-500">
                <SmartSkeleton variant="profile" />
            </div>
        );
    }

    /* ---------------- Not Found ---------------- */
    if (!user) {
        return <PublicProfileNotFound username={username} />;
    }

    return (
        <div className="relative min-h-screen bg-linear-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
            {/* ---------------- Branding ---------------- */}
            <header className="fixed top-4 left-4 z-50 backdrop-blur-md rounded-xl p-2">
                <Link to="/" aria-label="Bunchly Home">
                    <img
                        src="/img/Bunchly-light.png"
                        className="block dark:hidden w-28 sm:w-36"
                        alt="Bunchly"
                    />
                    <img
                        src="/img/Bunchly-dark.png"
                        className="hidden dark:block w-28 sm:w-36"
                        alt="Bunchly"
                    />
                </Link>
            </header>

            {/* ---------------- Content ---------------- */}
            <main className="flex justify-center px-4 pt-12 pb-20">
                <div className="w-full max-w-md space-y-6">
                    <PreviewPage user={user} links={links} mode="public" />

                    {/* ---------------- Actions ---------------- */}
                    <div className="flex items-center justify-center gap-3">
                        <Button
                            text={`Join ${user.username} on Bunchly`}
                            onClick={() => navigate("/signup")}
                        />
                        <Button
                            variant="secondary"
                            icon={Share2}
                            onClick={handleShare}
                        />
                    </div>

                    {/* ---------------- Footer ---------------- */}
                    <div className="pt-6 text-center">
                        <p className="text-xs text-neutral-500 flex items-center justify-center gap-1">
                            <Link2 className="w-3 h-3" />
                            Powered by
                            <Link
                                to="/"
                                className="font-medium text-indigo-600 hover:underline"
                            >
                                Bunchly
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PublicProfilePage;
