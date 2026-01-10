import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
    Flag, 
    MoreVertical, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Shield, 
    ExternalLink,
    Search,
    AlertTriangle,
    Trash2
} from "lucide-react";
import { Link } from "react-router-dom";

const STATUS_COLORS = {
    pending: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
    resolved: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
    dismissed: "bg-neutral-100 text-neutral-600 border-neutral-200 ring-neutral-500/20",
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

    const fetchReports = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/reports`, {
                params: { 
                    status: filter,
                    search: debouncedSearch
                },
                withCredentials: true
            });
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
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/reports/${selectedReport._id}`,
                { 
                    status: 'resolved', 
                    action: actionType 
                },
                { withCredentials: true }
            );
            
            toast.success(actionType === 'strike' ? "Report resolved & strike issued" : "Report resolved");
            setReports(prev => prev.filter(r => r._id !== selectedReport._id)); // Remove from list if viewing pending, or update status if viewing all
            setShowActionModal(false);
            setSelectedReport(null);
            fetchReports(); // Refresh to be safe with filters
        } catch (error) {
            toast.error("Failed to process action");
        }
    };

    const handleDismiss = async (id) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/reports/${id}`,
                { status: 'dismissed' },
                { withCredentials: true }
            );
            toast.success("Report dismissed");
            setReports(prev => prev.filter(r => r._id !== id)); // Remove from pending view
            fetchReports();
        } catch (error) {
            toast.error("Failed to dismiss report");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) return;
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/reports/${id}`,
                { withCredentials: true }
            );
            toast.success("Report deleted");
            setReports(prev => prev.filter(r => r._id !== id));
        } catch (error) {
            toast.error("Failed to delete report");
        }
    };

    return (
        <div className="p-6 md:p-10 min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] overflow-x-hidden">
            <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-500/10 rounded-xl text-red-600 dark:text-red-500">
                                <Flag className="w-6 h-6" />
                            </div>
                            Reports Center
                        </h1>
                        <p className="text-neutral-500 mt-2 text-lg font-medium">
                            Monitor and manage reported content to keep Bunchly safe.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                         {/* Search Bar */}
                         <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search user or email..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white dark:bg-[#15151A] border border-neutral-200 dark:border-white/10 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64 transition-all shadow-sm"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex bg-neutral-100 dark:bg-[#15151A] p-1 rounded-xl border border-neutral-200 dark:border-white/5">
                            {["pending", "resolved", "dismissed", ""].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
                                        filter === s 
                                            ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm" 
                                            : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
                                    }`}
                                >
                                    {s || "All"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-[#15151A] rounded-3xl shadow-xl shadow-neutral-200/50 dark:shadow-none border border-neutral-200 dark:border-white/5 overflow-hidden">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"/>
                            <p className="text-neutral-400 font-medium animate-pulse">Loading reports...</p>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="p-24 text-center">
                            <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">All Caught Up!</h3>
                            <p className="text-neutral-500 max-w-sm mx-auto">
                                No reports found matching your criteria. Great job keeping the platform clean!
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-neutral-50/50 dark:bg-white/5 border-b border-neutral-100 dark:border-white/5">
                                    <tr>
                                        <th className="p-5 text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Reported User</th>
                                        <th className="p-5 text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Reporter</th>
                                        <th className="p-5 text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Violation</th>
                                        <th className="p-5 text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Context</th>
                                        <th className="p-5 text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Date</th>
                                        <th className="p-5 text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Status</th>
                                        <th className="p-5 text-xs font-extrabold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                                    {reports.map((report) => (
                                        <tr key={report._id} className="group hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 min-w-[2.5rem] rounded-xl bg-neutral-100 dark:bg-white/10 overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-500/20 transition-all">
                                                        <img src={report.reportedUser?.image || "/default-avatar.png"} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                                                            {report.reportedUser?.name}
                                                            <Link to={`/admin/users/${report.reportedUser?._id}`} className="text-neutral-400 hover:text-indigo-500 transition-colors p-1 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md">
                                                                <ExternalLink className="w-3 h-3" />
                                                            </Link>
                                                        </div>
                                                        <div className="text-xs font-medium text-neutral-500">@{report.reportedUser?.username}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                                                        {report.reporterEmail}
                                                    </span>
                                                    <span className="text-xs text-neutral-400 font-mono mt-0.5">
                                                       {report.reporterIp}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 capitalize tracking-wide">
                                                    {report.reason}
                                                </span>
                                            </td>
                                            <td className="p-5 bg-white/0">
                                                <div className="max-w-xs whitespace-normal">
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed" title={report.details}>
                                                        {report.details || <span className="italic opacity-50">No additional context provided.</span>}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2 text-sm font-medium text-neutral-500">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ring-1 ${STATUS_COLORS[report.status] || STATUS_COLORS.pending}`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {report.status === 'pending' ? (
                                                        <>
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedReport(report);
                                                                    setShowActionModal(true);
                                                                }}
                                                                className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-sm"
                                                                title="Resolve Report"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDismiss(report._id)}
                                                                className="p-2 bg-white text-neutral-400 rounded-lg hover:bg-neutral-50 hover:text-neutral-600 border border-neutral-200 transition-colors shadow-sm"
                                                                title="Dismiss as False Alarm"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleDelete(report._id)}
                                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200 transition-colors shadow-sm"
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
                        <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowActionModal(false)} />
                        <div className="relative bg-white dark:bg-[#15151A] rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-scale-in border border-neutral-200 dark:border-white/10">
                            
                            <div className="mb-6 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 flex items-center justify-center">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                                        Resolve Report
                                    </h3>
                                    <p className="text-neutral-500 text-sm">
                                        Action for <strong>@{selectedReport.reportedUser?.username}</strong>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleAction('none')}
                                    className="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all group text-left bg-white dark:bg-transparent shadow-sm hover:shadow-md"
                                >
                                    <div>
                                        <div className="font-bold text-neutral-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Resolve Only</div>
                                        <div className="text-xs text-neutral-500 mt-0.5">Mark handled. No penalty for user.</div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full border-2 border-neutral-200 group-hover:border-emerald-500 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleAction('strike')}
                                    className="w-full flex items-center justify-between p-4 rounded-xl border border-red-100 dark:border-white/10 bg-red-50/50 dark:bg-red-500/5 hover:bg-red-50 hover:border-red-500 dark:hover:bg-red-900/10 hover:text-red-700 dark:hover:text-red-400 transition-all group text-left shadow-sm hover:shadow-md"
                                >
                                    <div>
                                        <div className="font-bold text-red-900 dark:text-red-200">Resolve & Issue Strike ⚠️</div>
                                        <div className="text-xs text-red-700 dark:text-red-400 mt-0.5">Increments strike count. 3 strikes = Auto-Ban.</div>
                                    </div>
                                    <AlertTriangle className="w-5 h-5 text-red-300 group-hover:text-red-600 transition-colors" />
                                </button>
                            </div>

                            <button 
                                onClick={() => setShowActionModal(false)}
                                className="w-full mt-6 py-3 text-sm font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReports;
