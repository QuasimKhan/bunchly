import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
    Flag, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Shield, 
    ExternalLink,
    Search,
    AlertTriangle,
    Trash2,
    Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import SmartSkeleton from "../../components/ui/SmartSkeleton";

const STATUS_COLORS = {
    pending: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
    resolved: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
    dismissed: "bg-neutral-50 text-neutral-600 border-neutral-200 ring-neutral-500/20",
};

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("pending");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [selectedReport, setSelectedReport] = useState(null);
    const [showActionModal, setShowActionModal] = useState(false);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchReports = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const params = new URLSearchParams({
                status: filter,
                search: debouncedSearch
            });
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reports?${params}`, {
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                setReports(data.reports);
            }
        } catch (error) {
            toast.error("Failed to load reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [filter, debouncedSearch]);

    const handleAction = async (actionType) => {
        if (!selectedReport) return;
        
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/${selectedReport._id}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    status: 'resolved', 
                    action: actionType 
                }),
                credentials: "include"
            });
            
            const data = await res.json();
            
            if (data.success) {
                toast.success(actionType === 'strike' ? "Report resolved & strike issued" : "Report resolved");
                // Optimistic update
                setReports(prev => prev.filter(r => r._id !== selectedReport._id)); 
                setShowActionModal(false);
                setSelectedReport(null);
                
                // Refresh to ensure sync
                setTimeout(() => fetchReports(true), 500);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error("Failed to process action");
        }
    };

    const handleDismiss = async (id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/${id}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: 'dismissed' }),
                credentials: "include"
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Report dismissed");
                setReports(prev => prev.filter(r => r._id !== id));
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error("Failed to dismiss report");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/${id}`, {
                method: 'DELETE',
                credentials: "include"
            });
            
            const data = await res.json();

            if (data.success) {
                toast.success("Report deleted");
                setReports(prev => prev.filter(r => r._id !== id));
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error("Failed to delete report");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Reports Center</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                        Monitor and manage reported content to keep the platform safe.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="bg-white dark:bg-[#15151A] rounded-xl border border-neutral-200/60 dark:border-white/5 p-1 flex items-center">
                        {["pending", "resolved", "dismissed"].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                                    filter === s 
                                        ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                                        : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="bg-white dark:bg-[#15151A] rounded-3xl border border-neutral-200/60 dark:border-white/5 shadow-sm overflow-hidden">
                {/* Search Header */}
                <div className="p-4 border-b border-neutral-100 dark:border-white/5 flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input 
                            type="text" 
                            placeholder="Search user, email, or context..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-white/5 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 text-neutral-900 dark:text-white placeholder:text-neutral-400"
                        />
                    </div>
                    <button className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>

                {loading ? (
                    <div className="p-6">
                        <SmartSkeleton variant="table" rows={6} />
                    </div>
                ) : reports.length === 0 ? (
                    <div className="py-24 text-center">
                        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50/50 dark:ring-emerald-500/5">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">All Clear!</h3>
                        <p className="text-neutral-500 max-w-sm mx-auto">
                            No {filter} reports found matching your criteria.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-neutral-50/50 dark:bg-white/[0.02] border-b border-neutral-100 dark:border-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Reported User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Reporter Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Violation</th>
                                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                                {reports.map((report) => (
                                    <tr key={report._id} className="group hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center text-neutral-500 font-bold overflow-hidden ring-2 ring-white dark:ring-[#15151A]">
                                                    {report.reportedUser?.image ? (
                                                        <img src={report.reportedUser.image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        report.reportedUser?.name?.charAt(0) || "U"
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                                                        {report.reportedUser?.name || "Unknown User"}
                                                        {report.reportedUser && (
                                                            <Link to={`/admin/users/${report.reportedUser._id}`} className="text-neutral-400 hover:text-indigo-600 transition-colors">
                                                                <ExternalLink className="w-3 h-3" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-neutral-500">@{report.reportedUser?.username || "unknown"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                    {report.reporterEmail}
                                                </span>
                                                <span className="text-xs text-neutral-400 font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                   IP: {report.reporterIp}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 capitalize">
                                                    {report.reason}
                                                </span>
                                                {report.details && (
                                                    <p className="text-xs text-neutral-500 line-clamp-1 max-w-[200px]" title={report.details}>
                                                        {report.details}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                {report.status === 'pending' ? (
                                                    <>
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedReport(report);
                                                                setShowActionModal(true);
                                                            }}
                                                            className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                                                            title="Resolve"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDismiss(report._id)}
                                                            className="p-2 bg-neutral-100 dark:bg-white/10 text-neutral-500 dark:text-neutral-400 rounded-lg hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors"
                                                            title="Dismiss"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleDelete(report._id)}
                                                        className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                                                        title="Delete Permanently"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Resolve Action Modal */}
            {showActionModal && selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowActionModal(false)} />
                    <div className="relative bg-white dark:bg-[#15151A] rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-scale-in border border-neutral-200 dark:border-white/10">
                        
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50/50 dark:ring-emerald-500/5">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                                Resolve Report
                            </h3>
                            <p className="text-neutral-500 mt-2">
                                Take action against <strong>@{selectedReport.reportedUser?.username}</strong>
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleAction('none')}
                                className="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 group text-left transition-all"
                            >
                                <div>
                                    <div className="font-bold text-neutral-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Resolve Only</div>
                                    <div className="text-xs text-neutral-500 mt-0.5">Mark handled. No strike for user.</div>
                                </div>
                                <CheckCircle className="w-5 h-5 text-neutral-300 group-hover:text-emerald-500" />
                            </button>

                            <button
                                onClick={() => handleAction('strike')}
                                className="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 group text-left transition-all"
                            >
                                <div>
                                    <div className="font-bold text-neutral-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-400">Issue Strike & Resolve</div>
                                    <div className="text-xs text-neutral-500 mt-0.5">Increments strike count. 3 strikes = Ban.</div>
                                </div>
                                <AlertTriangle className="w-5 h-5 text-neutral-300 group-hover:text-red-500" />
                            </button>
                        </div>

                        <Button 
                            text="Cancel"
                            variant="secondary"
                            onClick={() => setShowActionModal(false)}
                            className="w-full mt-6 !rounded-xl !py-3"
                            fullWidth
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
