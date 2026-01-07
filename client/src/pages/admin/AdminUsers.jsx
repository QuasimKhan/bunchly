import { useEffect, useState } from "react";
import { Search, Ban, Trash2, CheckCircle, SlidersHorizontal, MoreHorizontal, ShieldAlert, ShieldCheck, Eye } from "lucide-react";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
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
                        className="px-4 py-2 bg-white dark:bg-[#15151A] border border-neutral-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

            {/* Users Table */}
            <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 dark:bg-white/5 border-b border-neutral-100 dark:border-white/5">
                            <tr className="text-left text-neutral-500 font-medium">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Plan / Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02]">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                                                {user.image && <img src={user.image} alt={user.name} className="w-full h-full object-cover" />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-neutral-900 dark:text-white">{user.name}</div>
                                                <div className="text-xs text-neutral-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                         <div className="flex gap-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                user.plan === 'pro' 
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                    : 'bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-400'
                                            }`}>
                                                {user.plan}
                                            </span>
                                            {user.role === 'admin' && (
                                                <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.flags?.isBanned ? (
                                            <span className="inline-flex items-center gap-1 text-red-600 text-xs font-semibold bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded-full">
                                                <Ban className="w-3 h-3" /> Banned
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded-full">
                                                <CheckCircle className="w-3 h-3" /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-neutral-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => window.open(`/admin/users/${user._id}`, '_self')}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            {user._id !== currentUser._id && (
                                                <>
                                                    {user.flags?.isBanned ? (
                                                        <button 
                                                            onClick={() => handleAction(user, 'unban')}
                                                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                            title="Unban User"
                                                        >
                                                            <ShieldCheck className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleAction(user, 'ban')}
                                                            className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                                                            title="Ban User"
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    
                                                    <button 
                                                        onClick={() => handleAction(user, 'delete')}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t border-neutral-200 dark:border-white/5">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-lg"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-neutral-500">
                        Page {page} of {totalPages}
                    </span>
                    <button 
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-lg"
                    >
                        Next
                    </button>
                </div>
            </div>

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
