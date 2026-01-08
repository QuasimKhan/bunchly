import React, { useState, useEffect } from "react";
import { 
    Tag, Plus, Trash2, Percent, DollarSign, Search, Loader2, 
    Eye, EyeOff, Copy, Check, TrendingUp, Filter, MoreHorizontal, X,
    Calendar, Edit2, AlertCircle, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import SmartSkeleton from "../../components/ui/SmartSkeleton";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalConfig, setModalConfig] = useState({ show: false, mode: 'create', data: null });
    const [deleteModal, setDeleteModal] = useState({ show: false, coupon: null });
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all"); 

    const fetchCoupons = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/coupons`, { credentials: "include" });
            const data = await res.json();
            if (data.success) setCoupons(data.coupons);
        } catch (error) {
            toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCoupons(); }, []);

    const filteredCoupons = coupons.filter(c => {
        const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              c.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "all" ? true : filter === "active" ? c.isActive : !c.isActive;
        return matchesSearch && matchesFilter;
    });

    const handleDelete = async () => {
        const id = deleteModal.coupon._id;
        setDeleteModal({ show: false, coupon: null });
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/coupons/${id}`, {
                method: "DELETE", credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Coupon deleted successfully");
                fetchCoupons();
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch (error) {
            toast.error("Error deleting coupon");
        }
    };

    const stats = {
        total: coupons.length,
        active: coupons.filter(c => c.isActive).length,
        redemptions: coupons.reduce((acc, c) => acc + (c.usedCount || 0), 0)
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in">
            {/* Header & Stats */}
            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
                            <div className="p-2 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <Tag className="w-8 h-8" />
                            </div>
                            Coupons & Offers
                        </h1>
                        <p className="text-neutral-500 font-medium ml-1 mt-2">Create and manage discount codes for your users.</p>
                    </div>
                    <button 
                        onClick={() => setModalConfig({ show: true, mode: 'create', data: null })}
                        className="group flex items-center gap-3 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-2xl text-sm font-bold shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all cursor-pointer active:scale-95"
                    >
                        <div className="bg-white/20 dark:bg-black/10 rounded-full p-1 group-hover:rotate-90 transition-transform">
                            <Plus className="w-4 h-4" />
                        </div>
                        Create New Offer
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Offers" value={stats.total} icon={Tag} color="blue" />
                    <StatCard title="Active Now" value={stats.active} icon={Check} color="emerald" />
                    <StatCard title="Total Redemptions" value={stats.redemptions} icon={TrendingUp} color="violet" />
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white/80 dark:bg-[#15151A]/80 backdrop-blur-xl p-2 rounded-3xl border border-neutral-200 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-lg shadow-neutral-200/50 dark:shadow-none sticky top-24 z-20">
                <div className="relative w-full sm:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by code or description..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-neutral-100 dark:bg-black/50 border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold transition-all outline-none"
                    />
                </div>
                <div className="flex bg-neutral-100 dark:bg-black/50 p-1.5 rounded-2xl w-full sm:w-auto">
                    {["all", "active", "inactive"].map((f) => (
                         <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                                filter === f 
                                ? "bg-white dark:bg-[#15151A] text-indigo-600 dark:text-indigo-400 shadow-md transform scale-[1.02]" 
                                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content List */}
            {loading ? <SmartSkeleton variant="table" /> : (
                <div className="bg-white/50 dark:bg-[#15151A]/50 backdrop-blur-sm rounded-[2rem] border border-neutral-200 dark:border-white/5 shadow-xl dark:shadow-none overflow-hidden min-h-[400px]">
                    {filteredCoupons.length > 0 ? (
                        <div className="w-full">
                            {/* Desktop Headers */}
                            <div className="hidden md:grid grid-cols-12 gap-6 px-8 py-5 bg-neutral-50/50 dark:bg-white/5 text-[11px] font-black tracking-widest text-neutral-400 uppercase border-b border-neutral-200 dark:border-white/5">
                                <div className="col-span-3">Code / Offer</div>
                                <div className="col-span-2">Value</div>
                                <div className="col-span-2">Usage</div>
                                <div className="col-span-2">Visibility</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-1 text-right">Actions</div>
                            </div>
                            
                            {/* List */}
                            <div className="divide-y divide-neutral-100 dark:divide-white/5">
                                {filteredCoupons.map(coupon => (
                                    <CouponRow 
                                        key={coupon._id} 
                                        coupon={coupon} 
                                        onToggleVisibility={() => handleToggle(coupon, 'isPublic', 
                                            `${import.meta.env.VITE_API_URL}/api/admin/coupons/${coupon._id}/visibility`
                                        )}
                                        onToggleStatus={() => handleToggle(coupon, 'isActive', 
                                            `${import.meta.env.VITE_API_URL}/api/admin/coupons/${coupon._id}`
                                        )}
                                        onEdit={() => setModalConfig({ show: true, mode: 'edit', data: coupon })}
                                        onDelete={() => setDeleteModal({ show: true, coupon })}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center py-32 text-neutral-400">
                            <div className="w-20 h-20 bg-neutral-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <Search className="w-10 h-10 opacity-30" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">No coupons found</h3>
                            <p className="text-sm max-w-xs text-center leading-relaxed">We couldn't find any coupons matching your search. Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Smart Create/Edit Modal */}
            {modalConfig.show && (
                <CouponFormModal 
                    mode={modalConfig.mode}
                    initialData={modalConfig.data}
                    onClose={() => setModalConfig({ show: false, mode: 'create', data: null })} 
                    onRefresh={fetchCoupons} 
                />
            )}
            
            {/* Delete Confirmation */}
            <Modal 
                open={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, coupon: null })}
            >
                <div className="flex flex-col items-center text-center p-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 mb-6 shadow-xl shadow-red-500/10">
                        <Trash2 className="w-8 h-8" />
                    </div>
                    
                    <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-2">
                        Delete Coupon?
                    </h2>

                    <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-[300px] leading-relaxed">
                        Are you sure you want to delete <strong className="text-neutral-900 dark:text-white bg-neutral-100 dark:bg-white/10 px-2 py-0.5 rounded font-mono">{deleteModal.coupon?.code}</strong>? This action will permanently remove it from database.
                    </p>

                    <div className="flex items-center justify-center gap-3 w-full">
                        <Button
                            className="flex-1 py-3"
                            variant="ghost"
                            onClick={() => setDeleteModal({ show: false, coupon: null })}
                            text="Cancel"
                        />

                        <Button
                            className="flex-1 !py-3 !bg-red-600 hover:!bg-red-700 text-white border-none cursor-pointer shadow-lg shadow-red-500/20"
                            onClick={handleDelete}
                            text="Delete Forever"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );

    // Helpers
    async function handleToggle(coupon, field, url) {
        // Optimistic Update
        const newValue = !coupon[field];
        setCoupons(prev => prev.map(c => c._id === coupon._id ? { ...c, [field]: newValue } : c));
        
        try {
            const res = await fetch(url, { method: "PATCH", credentials: "include" });
            const data = await res.json();
            if (!data.success) throw new Error("Failed");
            toast.success("Updated successfully");
        } catch (err) {
            toast.error("Update failed");
            fetchCoupons(); // Revert
        }
    }
};

// --- Sub-components ---

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-[#15151A] p-6 rounded-3xl border border-neutral-200 dark:border-white/5 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all hover:-translate-y-1">
        <div>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-2">{title}</p>
            <p className="text-4xl font-black text-neutral-900 dark:text-white tabular-nums tracking-tight">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400 group-hover:scale-110 transition-transform shadow-inner`}>
            <Icon className="w-7 h-7" />
        </div>
    </div>
);

const CouponRow = ({ coupon, onToggleStatus, onToggleVisibility, onEdit, onDelete }) => {
    const copyCode = () => {
        navigator.clipboard.writeText(coupon.code);
        toast.success("Code copied!");
    };

    return (
        <div className="grid md:grid-cols-12 gap-6 p-6 items-center hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors group">
            {/* Code */}
            <div className="md:col-span-3 flex items-center gap-4">
                <div onClick={copyCode} className="cursor-pointer group/code relative">
                    <div className="px-4 py-3 bg-white dark:bg-black/40 rounded-xl text-neutral-900 dark:text-white font-mono font-bold text-lg border border-neutral-200 dark:border-white/10 group-hover/code:border-indigo-500 group-hover/code:text-indigo-600 dark:group-hover/code:text-indigo-400 shadow-sm transition-all">
                        {coupon.code}
                    </div>
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-sm text-neutral-900 dark:text-white truncate">{coupon.description || "Promo Code"}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5 flex gap-1 items-center">
                       {new Date(coupon.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Value */}
            <div className="md:col-span-2">
                <span className={`inline-flex items-center gap-1 font-black px-3 py-1.5 rounded-lg text-sm border ${
                    coupon.discountType === 'percent' 
                    ? 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-500/20' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-500/20'
                }`}>
                    {coupon.discountType === 'percent' ? <Percent className="w-3.5 h-3.5"/> : <DollarSign className="w-3.5 h-3.5"/>}
                    {coupon.discountValue}{coupon.discountType === 'percent' ? '%' : ''} OFF
                </span>
            </div>

            {/* Usage */}
            <div className="md:col-span-2">
                 <div className="flex flex-col">
                    <span className="font-bold text-neutral-900 dark:text-white tabular-nums flex items-center gap-2">
                        {coupon.usedCount} <span className="text-[10px] font-normal text-neutral-400 uppercase tracking-wide">Redeemed</span>
                    </span>
                    <span className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                        Limit: {coupon.maxUses ? coupon.maxUses : '∞'}
                    </span>
                </div>
            </div>

            {/* Visibility - Public/Hidden */}
            <div className="md:col-span-2">
                <button 
                    onClick={onToggleVisibility}
                    className={`flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-full transition-all border cursor-pointer active:scale-95 uppercase tracking-wide ${
                        coupon.isPublic 
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100' 
                        : 'text-neutral-400 bg-neutral-100 dark:bg-white/5 border-neutral-200 dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-white/10'
                    }`}
                >
                    {coupon.isPublic ? <><Eye className="w-3 h-3" /> Public</> : <><EyeOff className="w-3 h-3" /> Hidden</>}
                </button>
            </div>

            {/* Status - Active/Inactive (Toggle) */}
            <div className="md:col-span-2">
                <button 
                    onClick={onToggleStatus}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border w-fit cursor-pointer ${
                        coupon.isActive 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-500/30 hover:bg-emerald-100" 
                        : "bg-neutral-50 text-neutral-500 border-neutral-200 dark:bg-white/5 dark:text-neutral-400 dark:border-white/10 hover:bg-neutral-100"
                    }`}
                >
                    <span className={`w-2 h-2 rounded-full ${coupon.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'}`} />
                    {coupon.isActive ? "Active" : "Inactive"}
                </button>
            </div>

            {/* Actions */}
            <div className="md:col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                    onClick={onEdit}
                    className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors cursor-pointer"
                    title="Edit Coupon"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button 
                    onClick={onDelete}
                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                    title="Delete Coupon"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const CouponFormModal = ({ mode, initialData, onClose, onRefresh }) => {
    const isEdit = mode === 'edit';
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discountType: "percent",
        discountValue: "",
        maxUses: "",
        expiresAt: "",
        description: "",
        isPublic: false,
        razorpayOfferId: ""
    });

    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                code: initialData.code,
                discountType: initialData.discountType,
                discountValue: initialData.discountValue,
                maxUses: initialData.maxUses || "",
                expiresAt: initialData.expiresAt ? new Date(initialData.expiresAt).toISOString().split('T')[0] : "",
                description: initialData.description || "",
                isPublic: initialData.isPublic,
                razorpayOfferId: initialData.razorpayOfferId || ""
            });
        }
    }, [isEdit, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = isEdit 
                ? `${import.meta.env.VITE_API_URL}/api/admin/coupons/${initialData._id}/edit`
                : `${import.meta.env.VITE_API_URL}/api/admin/coupons`;
            
            const method = isEdit ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                toast.success(isEdit ? "Coupon updated" : "Coupon created successfully");
                onRefresh();
                onClose();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            toast.error("Error submitting form");
        } finally {
            setLoading(false);
        }
    };

    const isSynced = isEdit && !!initialData.razorpayOfferId;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            
            <div className="relative bg-[#FDFDFD] dark:bg-[#15151A] rounded-[2rem] w-full max-w-xl border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-neutral-200 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-white/5">
                    <div>
                        <h3 className="font-black text-2xl text-neutral-900 dark:text-white flex items-center gap-2">
                            {isEdit ? 'Edit Coupon' : 'Create Offer'}
                            {isSynced && <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Synced</span>}
                        </h3>
                        <p className="text-sm font-medium text-neutral-500">{isEdit ? `Modifying offer ${initialData.code}` : "Add a new discount code to the system."}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Code & Type Row */}
                    <div className="grid grid-cols-5 gap-4">
                         <div className="col-span-3">
                            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2 ml-1">Coupon Code</label>
                            <input 
                                required type="text" 
                                disabled={isEdit} // Cannot change code
                                className={`w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3.5 uppercase font-mono text-xl font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
                                placeholder="SAVE20"
                                value={formData.code}
                                onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                            />
                        </div>
                        <div className="col-span-2">
                             <label className="block text-xs font-bold text-neutral-500 uppercase mb-2 ml-1">Value</label>
                             <div className="relative">
                                <input 
                                    required type="number" 
                                    disabled={isSynced} // Cannot change value if synced
                                    className={`w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl pl-4 pr-12 py-3.5 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isSynced ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    placeholder="20"
                                    value={formData.discountValue}
                                    onChange={e => setFormData({...formData, discountValue: Number(e.target.value)})}
                                />
                                <div className="absolute right-2 top-2 bottom-2">
                                    <select 
                                        disabled={isSynced}
                                        className="h-full bg-neutral-100 dark:bg-white/10 border-none rounded-lg text-xs font-bold px-2 cursor-pointer focus:ring-0"
                                        value={formData.discountType}
                                        onChange={e => setFormData({...formData, discountType: e.target.value})}
                                    >
                                        <option value="percent">%</option>
                                        <option value="fixed">₹</option>
                                    </select>
                                </div>
                             </div>
                        </div>
                    </div>
                    
                    {isSynced && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-200 dark:border-amber-500/20">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            Value & Code cannot be changed for synced coupons to maintain data integrity.
                        </div>
                    )}

                    {/* Limits & Expiry */}
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2 ml-1">Max Uses (Optional)</label>
                            <input 
                                type="number" 
                                className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                                placeholder="∞ Unlimited"
                                value={formData.maxUses}
                                onChange={e => setFormData({...formData, maxUses: e.target.value ? Number(e.target.value) : ''})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2 ml-1">Expires On (Optional)</label>
                            <input 
                                type="date" 
                                className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-neutral-500 dark:text-neutral-300"
                                value={formData.expiresAt}
                                onChange={e => setFormData({...formData, expiresAt: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-2 ml-1">Description</label>
                         <input 
                            type="text" 
                            className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                            placeholder="e.g. Welcome offer for new users"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    {/* Razorpay Offer ID - Create Mode Only */}
                    {!isEdit && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                            <div className="flex items-start justify-between mb-3">
                                <label className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase">
                                    <ShieldCheck className="w-4 h-4" /> Razorpay Integration
                                </label>
                                <a 
                                    href="https://dashboard.razorpay.com/app/offers" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                >
                                    View Offers →
                                </a>
                            </div>
                            <input 
                                type="text" 
                                className="w-full bg-white dark:bg-black/50 border border-indigo-200 dark:border-indigo-500/30 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                                placeholder="Auto-create (Leave Empty) or paste offer_ID"
                                value={formData.razorpayOfferId}
                                onChange={e => setFormData({...formData, razorpayOfferId: e.target.value.trim()})}
                            />
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-2 leading-relaxed opacity-80">
                                Leave blank to <strong>auto-generate</strong> a new Razorpay offer. Paste an ID only if linking to an existing one.
                            </p>
                        </div>
                    )}

                    {/* Toggles */}
                    <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-white/5 rounded-2xl border border-neutral-200 dark:border-white/5 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors" onClick={() => setFormData({...formData, isPublic: !formData.isPublic})}>
                        <div className={`w-12 h-7 rounded-full p-1 transition-colors ${formData.isPublic ? 'bg-indigo-600' : 'bg-neutral-300 dark:bg-neutral-700'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-neutral-900 dark:text-white">Public Suggestion</p>
                            <p className="text-[11px] text-neutral-500">Show this coupon in the checkout "Best Offers" section.</p>
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        type="submit" 
                        className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <>{isEdit ? "Update Coupon" : "Create Coupon"}</>} 
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminCoupons;
