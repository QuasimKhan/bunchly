import { useEffect, useState } from "react";
import { Search, Ban, Trash2, CheckCircle, SlidersHorizontal, MoreHorizontal, ShieldAlert, ShieldCheck, Eye } from "lucide-react";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
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

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [page, search, roleFilter]);

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

    return (
        <div className="space-y-6 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">User Management</h1>
                    <p className="text-neutral-500 text-sm">Manage user accounts, roles, and status.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <select 
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-[#15151A] border border-neutral-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Free Users</option>
                        <option value="pro">Pro Users</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
            </header>

            {/* Search */}
            <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 p-4 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name, email, or username..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:ring-0 text-neutral-900 dark:text-white placeholder:text-neutral-400"
                    />
                </div>
            </div>

            {/* Users List Data Grid */}
            {loading ? (
                <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 p-6">
                    <SmartSkeleton variant="table" rows={8} />
                </div>
            ) : (
                <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 shadow-sm overflow-hidden">
                    {/* Desktop Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-neutral-50/50 dark:bg-white/5 border-b border-neutral-200 dark:border-white/5 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                        <div className="col-span-4">User</div>
                        <div className="col-span-3">Plan / Role</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Joined</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {/* Content */}
                    <div className="divide-y divide-neutral-100 dark:divide-white/5">
                        {users.map((user) => (
                            <div key={user._id} className="group p-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                {/* User Info */}
                                <div className="w-full md:col-span-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white/10 overflow-hidden flex-shrink-0 ring-2 ring-white dark:ring-[#15151A]">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-400 font-bold">
                                                {user.name?.charAt(0) || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-semibold text-neutral-900 dark:text-white truncate">{user.name}</div>
                                        <div className="text-xs text-neutral-500 truncate">{user.email}</div>
                                    </div>
                                </div>
                                
                                {/* Plan & Role (Mobile: Row) */}
                                <div className="w-full md:col-span-3 flex items-center gap-2 pl-14 md:pl-0">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                        user.plan === 'pro' 
                                            ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800'
                                            : 'bg-neutral-50 text-neutral-500 border-neutral-200 dark:bg-white/5 dark:text-neutral-400 dark:border-white/10'
                                    }`}>
                                        {user.plan}
                                    </span>
                                    {user.role === 'admin' && (
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                                            Admin
                                        </span>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="w-full md:col-span-2 flex items-center pl-14 md:pl-0">
                                    {user.flags?.isBanned ? (
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/10 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-900/20">
                                            <Ban className="w-3 h-3" /> Banned
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/20">
                                            <CheckCircle className="w-3 h-3" /> Active
                                        </span>
                                    )}
                                </div>

                                {/* Joined Date */}
                                <div className="w-full md:col-span-2 text-sm text-neutral-500 pl-14 md:pl-0">
                                    <span className="md:hidden text-xs text-neutral-400 mr-2">Joined:</span>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </div>

                                {/* Actions */}
                                <div className="w-full md:col-span-1 flex items-center justify-end gap-1">
                                    <button 
                                        onClick={() => window.open(`/admin/users/${user._id}`, '_self')}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors cursor-pointer"
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <div className="flex gap-1"> 
                                        {user._id !== currentUser._id && (
                                            <>
                                                <button 
                                                    onClick={() => handleAction(user, user.flags?.isBanned ? 'unban' : 'ban')}
                                                    className={`p-2 rounded-lg transition-colors cursor-pointer ${user.flags?.isBanned ? 'text-emerald-500 hover:bg-emerald-50' : 'text-amber-500 hover:bg-amber-50'}`}
                                                >
                                                    {user.flags?.isBanned ? <ShieldCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(user, 'delete')}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {users.length === 0 && (
                            <div className="p-8 text-center text-neutral-500">
                                No users found matching your search.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4 bg-neutral-50/50 dark:bg-white/5 border-t border-neutral-200 dark:border-white/5">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-neutral-600 dark:text-neutral-400 disabled:opacity-50 hover:bg-white dark:hover:bg-white/10 rounded-lg shadow-sm transition-all cursor-pointer border border-neutral-200 dark:border-white/5"
                        >
                            Previous
                        </button>
                        <span className="text-xs font-medium text-neutral-500">
                            Page {page} of {totalPages}
                        </span>
                        <button 
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-neutral-600 dark:text-neutral-400 disabled:opacity-50 hover:bg-white dark:hover:bg-white/10 rounded-lg shadow-sm transition-all cursor-pointer border border-neutral-200 dark:border-white/5"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white capitalize">
                        {actionType === 'delete' ? 'Delete User?' : `${actionType} User?`}
                    </h2>
                    <p className="text-sm text-neutral-500 mt-2 mb-6">
                        Are you sure you want to {actionType} <strong>{selectedUser?.name}</strong>? 
                        {actionType === 'delete' && " This action creates a permanent data loss and cannot be undone."}
                    </p>
                    <div className="flex gap-3">
                        <Button 
                            variant="secondary" 
                            text="Cancel" 
                            onClick={() => setShowConfirmModal(false)} 
                            fullWidth 
                        />
                        <Button 
                            text="Confirm" 
                            onClick={confirmAction} 
                            className="bg-red-600 hover:bg-red-700 text-white border-transparent"
                            fullWidth 
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminUsers;
