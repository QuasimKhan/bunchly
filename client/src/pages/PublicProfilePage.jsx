import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loader2, Globe, Link2, ShieldCheck } from "lucide-react";
import { PreviewPage } from "../components/preview/PreviewModal";
import Button from "../components/ui/Button";
import { useSEO } from "../hooks/useSEO";
import { buildUrl } from "../lib/seo";
import PublicProfileNotFound from "../components/PublicProfileNotFound";

/**
 * PublicProfilePage (Premium / SaaS-grade)
 * --------------------------------------
 * ✔ Clean branding header
 * ✔ Clickable logo → Home
 * ✔ Public trust indicators
 * ✔ Mobile-first centered layout
 * ✔ Premium typography & spacing
 * ✔ Graceful loading & empty states
 */

const PublicProfilePage = () => {
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [links, setLinks] = useState([]);

    const navigate = useNavigate();

    useSEO({
        title: user
            ? `${user.name} (@${user.username}) – Bunchly`
            : "Profile – Bunchly",

        description: user?.bio ? user.bio : "View digital profiles on Bunchly.",

        image: user?.avatar || "/og-image.png",

        url: buildUrl(`/u/${username}`),
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

    /* ---------------- Loading State ---------------- */
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-neutral-500">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p className="mt-3 text-sm">Loading profile…</p>
            </div>
        );
    }

    /* ---------------- Not Found ---------------- */
    if (!user) {
        return <PublicProfileNotFound username={username} />;
    }

    return (
        <div className="relative min-h-screen bg-linear-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
            {/* ---------------- Top Branding Bar ---------------- */}
            <header
                className="
         fixed top-4 left-4 z-50
        sm:top-6 sm:left-6
    
        backdrop-blur-md
        rounded-xl
        p-2
    "
            >
                <Link
                    to="/"
                    className="block select-none"
                    aria-label="Bunchly Home"
                >
                    {/* Light Mode Logo */}
                    <img
                        src="/img/Bunchly-light.png"
                        alt="Bunchly"
                        className="
                block dark:hidden
                w-28 sm:w-36 md:w-44
                transition-all duration-200
            "
                    />

                    {/* Dark Mode Logo */}
                    <img
                        src="/img/Bunchly-dark.png"
                        alt="Bunchly"
                        className="
                hidden dark:block
                w-28 sm:w-36 md:w-44
                transition-all duration-200
            "
                    />
                </Link>
            </header>

            {/* ---------------- Profile Preview ---------------- */}
            <main className="flex justify-center px-4 pt-10 pb-16">
                <div className="w-full max-w-md">
                    <PreviewPage user={user} links={links} mode="public" />

                    {/* Do you want to join user on bunchly  */}

                    <div className="flex justify-center">
                        <Button
                            text={`Join ${user.username} on Bunchly`}
                            onClick={() => navigate("/signup")}
                        />
                    </div>

                    {/* ---------------- Footer Branding ---------------- */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-neutral-500 flex items-center justify-center gap-1">
                            <Link2 className="w-3 h-3" />
                            This page is powered by
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
