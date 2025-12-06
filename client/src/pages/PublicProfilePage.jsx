import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PreviewPage } from "../components/preview/PreviewModal"; // ⬅ We already created this

const PublicProfilePage = () => {
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [links, setLinks] = useState([]);

    useEffect(() => {
        // Fetch public profile data
        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/public/${username}`
                );
                const data = await res.json();

                if (data.success) {
                    setUser(data.user);
                    setLinks(data.links);
                }
            } catch (err) {
                console.error("Public profile error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-neutral-500">
                Loading…
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-neutral-500">
                Profile not found
            </div>
        );
    }

    return (
        <div className="min-h-screen flex justify-center items-start pt-10">
            <PreviewPage user={user} links={links} />
        </div>
    );
};

export default PublicProfilePage;
