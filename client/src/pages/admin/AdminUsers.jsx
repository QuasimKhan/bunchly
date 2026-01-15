import { useEffect, useState } from "react";
import { Search, Ban, Trash2, CheckCircle, SlidersHorizontal, MoreHorizontal, ShieldAlert, ShieldCheck, Eye, Shield, Users, Filter, Download, CheckCircleIcon } from "lucide-react";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import RoleModal from "../../components/admin/RoleModal";
import SmartSkeleton from "../../components/ui/SmartSkeleton";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

const AdminUsers = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // Modal States
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState(null); // 'ban' | 'delete' | 'unban'
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null); // ID of active menu user
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
            setActiveMenu(null); // Close menus on filter change
        }, 500); 
        return () => clearTimeout(timer);
    }, [page, search, roleFilter]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page,
                limit: 10,
                search,
                role: roleFilter
            });
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users?${params}`, {
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (user, type) => {
        setSelectedUser(user);
        setActionType(type);
        setShowConfirmModal(true);
    };

    const confirmAction = async () => {
        if (!selectedUser) return;

        try {
            let res;
            if (actionType === 'delete') {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${selectedUser._id}`, {
                    method: 'DELETE',
                    credentials: "include"
                });
            } else if (actionType === 'ban' || actionType === 'unban') {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${selectedUser._id}`, {
                    method: 'PATCH',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isBanned: actionType === 'ban' }),
                    credentials: "include"
                });
            }

            const data = await res.json();
            if (data.success) {
                toast.success(`User ${actionType === 'delete' ? 'deleted' : actionType + 'ned'} successfully`);
                fetchUsers();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.message || "Action failed");
        } finally {
            setShowConfirmModal(false);
            setSelectedUser(null);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`User role updated to ${newRole}`);
                fetchUsers();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.message || "Failed to update role");
        }
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            // Fetch all matching users for export (custom limit)
            const params = new URLSearchParams({
                search,
                role: roleFilter,
                limit: 1000 // Reasonable limit for export
            });
            
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users?${params}`, { credentials: "include" });
            const data = await res.json();
            
            if (data.success && data.users.length > 0) {
                // Generate CSV
                const headers = ["ID", "Name", "Email", "Status", "Plan", "Role", "Joined Date"];
                const csvContent = [
                    headers.join(","),
                    ...data.users.map(u => [
                        u._id,
                        `"${u.name}"`,
                        u.email,
                        u.flags?.isBanned ? "Banned" : "Active",
                        u.plan,
                        u.role,
                        new Date(u.createdAt).toISOString().split('T')[0]
                    ].join(","))
                ].join("\n");

                // Download
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("Export downloaded");
            } else {
                toast.error("No data to export");
            }
        } catch (error) {
            toast.error("Export failed");
            console.error(error);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                     <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">User Management</h1>
                     <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                        View, search, and manage all users on the platform.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" /> {exporting ? "Exporting..." : "Export"}
                    </button>
                </div>
            </div>

            {/* Filters & Search Bar */}
            <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200/60 dark:border-white/5 p-2 shadow-sm flex flex-col md:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input 
                        type="text" 
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-neutral-900 dark:text-white placeholder:text-neutral-400 font-medium"
                    />
                </div>
                <div className="h-8 w-px bg-neutral-200 dark:bg-white/10 hidden md:block"></div>
                <div className="w-full md:w-auto px-2">
                    <select 
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full md:w-48 px-4 py-2.5 bg-neutral-50 dark:bg-white/5 border-none rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-300 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                        <option value="all" className="text-black">All Roles</option>
                        <option value="user" className="text-black">Free Users</option>
                        <option value="pro" className="text-black">Pro Users</option>
                        <option value="admin" className="text-black">Admins</option>
                    </select>
                </div>
            </div>

            {/* Users List Data Grid */}
            {loading ? (
                <div className="bg-white dark:bg-[#15151A] rounded-3xl border border-neutral-200 dark:border-white/5 p-6">
                    <SmartSkeleton variant="table" rows={8} />
                </div>
            ) : (
                <div className="bg-white dark:bg-[#15151A] rounded-3xl border border-neutral-200/60 dark:border-white/5 shadow-sm overflow-hidden">
                    {/* Desktop Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 p-5 bg-neutral-50/50 dark:bg-white/[0.02] border-b border-neutral-100 dark:border-white/5 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                        <div className="col-span-4 pl-2">User Details</div>
                        <div className="col-span-3">Plan & Role</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Joined Date</div>
                        <div className="col-span-1 text-right pr-2">Actions</div>
                    </div>

                    {/* Content */}
                    <div className="divide-y divide-neutral-100 dark:divide-white/5">
                        {users.map((user) => (
                            <div key={user._id} className="group p-5 flex flex-col md:grid md:grid-cols-12 gap-4 items-center hover:bg-neutral-50/80 dark:hover:bg-white/[0.02] transition-colors">
                                {/* User Info */}
                                <div className="w-full md:col-span-4 flex items-center gap-4 pl-2">
                                    <div className="relative">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-neutral-100 to-white dark:from-white/10 dark:to-white/5 flex items-center justify-center text-neutral-600 dark:text-neutral-300 font-bold text-sm ring-2 ring-white dark:ring-[#15151A] shadow-sm">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-full" />
                                            ) : (
                                                user.name?.charAt(0) || "U"
                                            )}
                                        </div>
                                        {user.plan === 'pro' && (
                                            <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white rounded-full p-0.5 ring-2 ring-white dark:ring-[#15151A]">
                                                <CheckCircleIcon className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-semibold text-neutral-900 dark:text-white truncate">{user.name}</div>
                                        <div className="text-xs text-neutral-500 truncate flex items-center gap-1">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Plan & Role */}
                                <div className="w-full md:col-span-3 flex items-center gap-2 pl-14 md:pl-0">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                        user.plan === 'pro' 
                                            ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 border-indigo-200 dark:from-indigo-500/20 dark:to-violet-500/20 dark:text-indigo-300 dark:border-indigo-500/30'
                                            : 'bg-neutral-50 text-neutral-500 border-neutral-200 dark:bg-white/5 dark:text-neutral-400 dark:border-white/10'
                                    }`}>
                                        {user.plan}
                                    </span>
                                    {user.role === 'admin' && (
                                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                                            <Shield className="w-3 h-3" /> Admin
                                        </span>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="w-full md:col-span-2 flex items-center pl-14 md:pl-0">
                                    {user.flags?.isBanned ? (
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/10 px-3 py-1 rounded-full border border-red-100 dark:border-red-900/20">
                                            <Ban className="w-3 h-3" /> Banned
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/20">
                                            <CheckCircle className="w-3 h-3" /> Active
                                        </span>
                                    )}
                                </div>

                                {/* Joined Date */}
                                <div className="w-full md:col-span-2 text-sm text-neutral-500 pl-14 md:pl-0">
                                    <span className="md:hidden text-xs text-neutral-400 mr-2">Joined:</span>
                                    {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </div>

                                {/* Actions */}
                                <div className="w-full md:col-span-1 flex items-center justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => window.open(`/admin/users/${user._id}`, '_self')}
                                        className="p-2 text-neutral-500 hover:text-indigo-600 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <div className="relative">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenu(activeMenu === user._id ? null : user._id);
                                            }}
                                            className={`p-2 rounded-lg transition-colors cursor-pointer ${activeMenu === user._id ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-white/10'}`}
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        {/* Dropdown Menu */}
                                        {activeMenu === user._id && (
                                            <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-[#1A1A20] rounded-xl shadow-xl border border-neutral-200 dark:border-white/10 z-50 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setSelectedUser(user); setShowRoleModal(true); setActiveMenu(null); }}
                                                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 flex items-center gap-2"
                                                >
                                                    <Shield className="w-3.5 h-3.5" /> Edit Role
                                                </button>
                                                {user._id !== currentUser._id && (
                                                    <>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleAction(user, user.flags?.isBanned ? 'unban' : 'ban'); setActiveMenu(null); }}
                                                            className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-white/5 flex items-center gap-2 ${user.flags?.isBanned ? 'text-emerald-600' : 'text-amber-600'}`}
                                                        >
                                                            {user.flags?.isBanned ? <ShieldCheck className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                                                            {user.flags?.isBanned ? 'Unban User' : 'Ban User'}
                                                        </button>
                                                        <div className="h-px bg-neutral-100 dark:bg-white/5 my-1" />
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleAction(user, 'delete'); setActiveMenu(null); }}
                                                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {users.length === 0 && (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-neutral-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">No Users Found</h3>
                                <p className="text-neutral-500 text-sm mt-1">
                                    Try adjusting your search or filters to find what you're looking for.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-[#15151A] border-t border-neutral-100 dark:border-white/5">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-neutral-600 dark:text-neutral-400 disabled:opacity-50 hover:bg-neutral-50 dark:hover:bg-white/5 rounded-lg transition-all cursor-pointer border border-neutral-200 dark:border-white/5"
                        >
                            Previous
                        </button>
                        <span className="text-xs font-medium text-neutral-400">
                            Page {page} of {totalPages}
                        </span>
                        <button 
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-neutral-600 dark:text-neutral-400 disabled:opacity-50 hover:bg-neutral-50 dark:hover:bg-white/5 rounded-lg transition-all cursor-pointer border border-neutral-200 dark:border-white/5"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
                <div className="text-center p-2">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-8 ring-red-50/50 dark:ring-red-900/10">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white capitalize">
                        {actionType === 'delete' ? 'Delete User?' : `${actionType} User?`}
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 mb-8 max-w-[280px] mx-auto leading-relaxed">
                        Are you sure you want to {actionType} <span className="font-bold text-neutral-900 dark:text-white">{selectedUser?.name}</span>? 
                        {actionType === 'delete' && " This action creates a permanent data loss and cannot be undone."}
                    </p>
                    <div className="flex gap-3">
                        <Button 
                            variant="secondary" 
                            text="Cancel" 
                            onClick={() => setShowConfirmModal(false)} 
                            className="!rounded-xl !py-2.5"
                            fullWidth 
                        />
                        <Button 
                            text={actionType === 'delete' ? "Delete Forever" : "Confirm"} 
                            onClick={confirmAction} 
                            className="bg-red-600 hover:bg-red-700 text-white border-transparent !rounded-xl !py-2.5 shadow-lg shadow-red-500/20"
                            fullWidth 
                        />
                    </div>
                </div>
            </Modal>

            {/* Role Management Modal */}
            <RoleModal 
                user={selectedUser}
                open={showRoleModal}
                onClose={() => {
                    setShowRoleModal(false);
                    setSelectedUser(null);
                }}
                onUpdate={handleRoleUpdate}
            />
        </div>
    );
};

export default AdminUsers;
