import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSEO } from "../../hooks/useSEO";
import { buildUrl } from "../../lib/seo";
import { MessageSquare, Calendar, User, Tag, CheckCircle2, AlertCircle, HelpCircle, Bug, Lightbulb } from "lucide-react";
import api from "../../lib/api";

const AdminFeedback = () => {
    useSEO({
        title: "Feedback Management – Bunchly Admin",
        description: "View user feedback.",
        noIndex: true,
        url: buildUrl("/admin/feedback"),
    });

    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const res = await api.get("/api/feedback"); // Helper handles credentials
            if (res.data.success) {
                setFeedbacks(res.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load feedback");
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "bug": return <Bug className="w-4 h-4 text-red-500" />;
            case "feature": return <Lightbulb className="w-4 h-4 text-amber-500" />;
            default: return <MessageSquare className="w-4 h-4 text-blue-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            new: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
            read: "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-400",
            "in-progress": "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
            resolved: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || styles.new}`}>
                {status}
            </span>
        );
    };

    if (loading) {
         return (
             <div className="flex h-[calc(100vh-100px)] items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-indigo-500" />
                        User Feedback
                    </h1>
                    <p className="text-neutral-500 text-sm mt-1">Review bug reports and feature requests.</p>
                </div>
                <div className="text-sm font-medium text-neutral-500">
                    Total: {feedbacks.length}
                </div>
            </header>

            <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-50/50 dark:bg-white/5 text-xs uppercase font-bold text-neutral-500 tracking-wider">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-xl">Type</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4 w-1/2">Message</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 rounded-tr-xl">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                            {feedbacks.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-neutral-500">
                                        No feedback found.
                                    </td>
                                </tr>
                            ) : (
                                feedbacks.map((item) => (
                                    <tr key={item._id} className="hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 capitalize font-medium text-neutral-700 dark:text-neutral-300">
                                                {getTypeIcon(item.type)}
                                                {item.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {item.user?.image ? (
                                                     <img src={item.user.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                                                        {item.user?.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-neutral-900 dark:text-white">{item.user?.name || "Unknown"}</span>
                                                    <span className="text-xs text-neutral-500">{item.user?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2 hover:line-clamp-none transition-all cursor-pointer" title={item.message}>
                                                {item.message}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-400 whitespace-nowrap">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                            <span className="text-xs ml-1 opacity-70">
                                                {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminFeedback;
