import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSEO } from "../../hooks/useSEO";
import { buildUrl } from "../../lib/seo";
import { MessageSquare, Calendar, User, Tag, CheckCircle2, AlertCircle, HelpCircle, Bug, Lightbulb, Filter, Search, Trash2, Mail, MoreHorizontal, X, Send, AlertTriangle } from "lucide-react";
import api from "../../lib/api";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import SmartSkeleton from "../../components/ui/SmartSkeleton";

const AdminFeedback = () => {
    useSEO({
        title: "Feedback Management – Bunchly Admin",
        description: "View and manage user feedback.",
        noIndex: true,
        url: buildUrl("/admin/feedback"),
    });

    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [search, setSearch] = useState("");

    // Actions
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyMessage, setReplyMessage] = useState("");
    const [replying, setReplying] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    
    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchFeedback();
        // Close menus on click outside
        const handleClickOutside = () => setActiveMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchFeedback = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/feedback"); 
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

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await api.patch(`/api/feedback/${id}/status`, { status: newStatus });
            if (res.data.success) {
                toast.success(`Status updated to ${newStatus}`);
                setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, status: newStatus } : f));
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const initiateDelete = (feedback) => {
        setFeedbackToDelete(feedback);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!feedbackToDelete) return;
        setDeleting(true);
        try {
            const res = await api.delete(`/api/feedback/${feedbackToDelete._id}`);
            if (res.data.success) {
                toast.success("Feedback deleted");
                setFeedbacks(prev => prev.filter(f => f._id !== feedbackToDelete._id));
                setShowDeleteModal(false);
                setFeedbackToDelete(null);
            }
        } catch (error) {
            toast.error("Failed to delete feedback");
        } finally {
            setDeleting(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        setReplying(true);
        try {
            const res = await api.post(`/api/feedback/${selectedFeedback._id}/reply`, {
                message: replyMessage,
                subject: `Re: ${selectedFeedback.type === 'bug' ? 'Bug Report' : 'Feedback'} - Bunchly`
            });
            
            if (res.data.success) {
                toast.success("Reply sent successfully");
                setShowReplyModal(false);
                setReplyMessage("");
                // Auto update status if new
                if (selectedFeedback.status === 'new') {
                    setFeedbacks(prev => prev.map(f => f._id === selectedFeedback._id ? { ...f, status: 'in-progress' } : f));
                }
                setSelectedFeedback(null);
            }
        } catch (error) {
            toast.error("Failed to send reply");
        } finally {
            setReplying(false);
        }
    };

    const filteredFeedbacks = feedbacks.filter(item => {
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        const matchesType = typeFilter === "all" || item.type === typeFilter;
        const matchesSearch = item.message.toLowerCase().includes(search.toLowerCase()) || 
                              item.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                              item.user?.email?.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesType && matchesSearch;
    });

    const getTypeIcon = (type) => {
        switch (type) {
            case "bug": return <Bug className="w-4 h-4 text-red-500" />;
            case "feature": return <Lightbulb className="w-4 h-4 text-amber-500" />;
            default: return <MessageSquare className="w-4 h-4 text-blue-500" />;
        }
    };
    
    const getTypeStyles = (type) => {
        switch (type) {
            case "bug": return "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-900/30";
            case "feature": return "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30";
            default: return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-900/30";
        }
    };

    const StatusBadge = ({ status, id }) => {
        const styles = {
            new: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-900/30",
            read: "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-400 border-neutral-200 dark:border-white/10",
            "in-progress": "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
            resolved: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30",
        };

        const isActive = activeMenu === `status-${id}`;
        
        return (
            <div className="relative inline-block z-10">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(isActive ? null : `status-${id}`);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border transition-all active:scale-95 flex items-center gap-1.5 ${styles[status]}`}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                    {status}
                </button>
                {/* Status Picker Dropdown */}
                {isActive && (
                    <div className="absolute left-0 top-full mt-2 w-36 bg-white dark:bg-[#1A1A20] rounded-xl shadow-xl border border-neutral-200 dark:border-white/10 z-[60] p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                        {['new', 'in-progress', 'resolved', 'read'].map(s => (
                            <button
                                key={s}
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleStatusUpdate(id, s); 
                                    setActiveMenu(null);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors ${s === status ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'text-neutral-500 dark:text-neutral-400'}`}
                            >
                                {status === s && <CheckCircle2 className="w-3 h-3" />}
                                <span className={status === s ? "" : "ml-5"}>{s}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in-up pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200 dark:border-white/5">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 text-white">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        User Feedback
                    </h1>
                    <p className="text-neutral-500 text-sm mt-3 font-medium max-w-lg leading-relaxed">
                        Track, manage, and respond to user bug reports and feature requests.
                    </p>
                </div>
                {/* Filters */}
                <div className="bg-white dark:bg-[#15151A] p-1.5 rounded-2xl shadow-sm border border-neutral-200/60 dark:border-white/5 flex flex-wrap gap-2 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input 
                            type="text" 
                            placeholder="Search feedback..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-transparent rounded-xl text-sm w-full md:w-64 focus:bg-neutral-50 dark:focus:bg-white/5 outline-none transition-colors border-transparent focus:border-neutral-200 dark:focus:border-white/10 border"
                        />
                    </div>
                    <div className="h-9 w-[1px] bg-neutral-200 dark:bg-white/10 mx-1 hidden md:block"></div>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-transparent hover:bg-neutral-50 dark:hover:bg-white/5 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-300 outline-none cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-white/10 transition-all"
                    >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                    <select 
                        value={typeFilter} 
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-3 py-2 bg-transparent hover:bg-neutral-50 dark:hover:bg-white/5 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-300 outline-none cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-white/10 transition-all"
                    >
                        <option value="all">All Types</option>
                        <option value="bug">Bugs</option>
                        <option value="feature">Features</option>
                        <option value="general">General</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <SmartSkeleton variant="table" rows={6} />
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredFeedbacks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#15151A] rounded-3xl border border-neutral-200 dark:border-white/5 shadow-sm border-dashed">
                            <div className="w-16 h-16 bg-neutral-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-neutral-300">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">No feedback found</h3>
                            <p className="text-neutral-500 text-sm">Try adjusting your filters or search query.</p>
                        </div>
                    ) : (
                        filteredFeedbacks.map((item) => (
                            <div 
                                key={item._id} 
                                className={`bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 p-5 md:p-6 shadow-sm hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-500/20 transition-all duration-300 group relative ${(activeMenu === item._id || activeMenu === `status-${item._id}`) ? 'z-20' : 'z-0'}`}
                            > 
                                {/* Decoration Line */}
                                <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl transition-colors ${
                                    item.type === 'bug' ? 'bg-red-500' : item.type === 'feature' ? 'bg-amber-500' : 'bg-blue-500'
                                }`}></div>

                                <div className="flex flex-col lg:flex-row gap-6 items-start pl-3">
                                    {/* User Info Column */}
                                    <div className="flex items-center gap-4 min-w-[220px]">
                                        {item.user?.image ? (
                                            <img src={item.user.image} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-white/10 shadow-sm" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-white/5 dark:to-white/10 text-neutral-600 dark:text-neutral-400 flex items-center justify-center font-bold text-lg shadow-inner border border-white/50 dark:border-white/5">
                                                {item.user?.username?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-neutral-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {item.user?.name || "Unknown"}
                                            </div>
                                            <div className="text-sm text-neutral-500 font-medium">{item.user?.email}</div>
                                            <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1 min-w-0 w-full space-y-3">
                                        <div className="flex items-center flex-wrap gap-2">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 border ${getTypeStyles(item.type)}`}>
                                                {getTypeIcon(item.type)} {item.type}
                                            </span>
                                            <span className="text-xs text-neutral-400 hidden sm:inline-block">•</span>
                                            <span className="text-xs text-neutral-400 font-mono">ID: {item._id.slice(-6)}</span>
                                        </div>
                                        
                                        <div className="relative">
                                            <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                                                {item.message}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions Column */}
                                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 w-full lg:w-auto justify-between lg:justify-start pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-100 dark:border-white/5 mt-2 lg:mt-0">
                                        <StatusBadge status={item.status} id={item._id} />
                                        
                                        <div className="flex items-center gap-2 mt-1">
                                            <button 
                                                onClick={() => {
                                                    setSelectedFeedback(item);
                                                    setShowReplyModal(true);
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-900/30"
                                            >
                                                <Mail className="w-3.5 h-3.5" /> Reply
                                            </button>
                                            
                                            <div className="relative z-10">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenu(activeMenu === item._id ? null : item._id);
                                                    }}
                                                    className={`p-2 rounded-lg transition-colors ${activeMenu === item._id ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-white/10'}`}
                                                >
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                                {activeMenu === item._id && (
                                                    <div className="absolute right-0 lg:left-auto lg:right-0 bottom-full lg:bottom-auto lg:top-full mt-1 w-40 bg-white dark:bg-[#1A1A20] rounded-xl shadow-xl border border-neutral-200 dark:border-white/10 z-[60] py-1 origin-top-right animate-in fade-in zoom-in-95 duration-100">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); initiateDelete(item); setActiveMenu(null); }}
                                                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" /> Delete Feedback
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Reply Modal */}
            <Modal open={showReplyModal} onClose={() => setShowReplyModal(false)}>
                <div className="w-full">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100 dark:border-white/5">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Reply to {selectedFeedback?.user?.name}</h2>
                            <p className="text-sm text-neutral-500">Sending via Email to <span className="text-indigo-600 font-medium">{selectedFeedback?.user?.email}</span></p>
                        </div>
                    </div>

                    {selectedFeedback && (
                        <div className="bg-neutral-50 dark:bg-white/5 p-4 rounded-xl mb-6 text-sm text-neutral-600 dark:text-neutral-400 italic border-l-4 border-neutral-300 dark:border-neutral-700">
                            "{selectedFeedback.message}"
                        </div>
                    )}

                    <div className="space-y-2 mb-6">
                         <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide ml-1">
                            Your Reply
                        </label>
                        <textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Write your response here..."
                            className="w-full h-40 p-4 bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none shadow-sm"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <Button 
                            text="Cancel" 
                            variant="secondary" 
                            onClick={() => setShowReplyModal(false)} 
                        />
                        <Button 
                            text="Send Reply" 
                            icon={Send}
                            loading={replying}
                            onClick={handleReply}
                            disabled={!replyMessage.trim()}
                        />
                    </div>
                </div>
            </Modal>
            
            {/* Delete Confirmation Modal */}
            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="w-full max-w-sm mx-auto text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-6 ring-8 ring-red-50 dark:ring-red-900/10">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Delete Feedback?</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-8">
                        Are you sure you want to delete this feedback? This action cannot be undone and the data will be lost forever.
                    </p>
                    
                    <div className="flex gap-3 justify-center">
                        <Button 
                            text="Cancel" 
                            variant="secondary" 
                            onClick={() => setShowDeleteModal(false)}
                            className="w-full" 
                        />
                        <Button 
                            text="Delete Forever" 
                            onClick={confirmDelete}
                            loading={deleting}
                            className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-red-600/20"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminFeedback;
