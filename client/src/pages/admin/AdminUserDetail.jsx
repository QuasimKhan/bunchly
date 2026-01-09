import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    User, Mail, Calendar, Shield, Link as LinkIcon, 
    CreditCard, AlertTriangle, CheckCircle, Ban, ExternalLink, Trash2, Gift, LogOut, ShieldAlert, Folder, Copy, RotateCcw, DollarSign,
    Monitor, Globe, MapPin, Laptop
} from "lucide-react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { toast } from "sonner";
import SmartSkeleton from "../../components/ui/SmartSkeleton";
import LinkFavicon from "../../components/link-card/LinkFavicon";

const AdminUserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    // Action States
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    
    // Unified Action State
    const [currentAction, setCurrentAction] = useState(null); 
    const [planPeriod, setPlanPeriod] = useState(1);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/details`, {
                credentials: "include"
            });
            const json = await res.json();
            if (json.success) {
                setData(json);
            } else {
                toast.error("User not found");
                navigate("/admin/users");
            }
        } catch (error) {
            toast.error("Failed to load user details");
        } finally {
            setLoading(false);
        }
    };

    /* --------------------------------------------------
       ACTION HANDLERS
    -------------------------------------------------- */
    const requestAction = (type, payload) => {
        const actions = {
            'delete_link': {
                title: "Remove Content?",
                message: "This link will be permanently deleted. This is a moderation action.",
                danger: true,
                confirmText: "Delete Link",
                payload
            },
            'revoke_pro': {
                title: "Revoke Pro Access?",
                message: "User will be downgraded to free immediately.",
                danger: true,
                confirmText: "Revoke Access",
                payload
            },
            'ban_user': {
                title: "Ban User Account?",
                message: "User will be logged out and profile hidden.",
                danger: true,
                confirmText: "Ban User",
                payload
            },
            'unban_user': {
                title: "Unban User?",
                message: "Access will be restored immediately.",
                danger: false,
                confirmText: "Restore Access",
                payload
            },
            'delete_account': {
                title: "Permanently Delete?",
                message: "All data will be wiped forever.",
                danger: true,
                confirmText: "Delete Account",
                payload
            },
            'refund_payment': {
                title: "Refund Payment?",
                message: "This will process a full refund via Razorpay and revert the user to the Free plan. This cannot be undone.",
                danger: true,
                confirmText: "Process Refund",
                payload
            },
            'logout_session': {
                title: "Terminate Session?",
                message: "User will be logged out from this specific device immediately.",
                danger: true,
                confirmText: "Logout Device",
                payload
            },
            'logout_all': {
                title: "Logout Everywhere?",
                message: "User will be logged out from ALL active sessions.",
                danger: true,
                confirmText: "Logout Everywhere",
                payload
            }
        };

        setCurrentAction({ type, ...actions[type] });
        setShowActionModal(true);
    };

    const executeAction = async () => {
        if (!currentAction) return;
        setProcessing(true);

        try {
            const { type, payload } = currentAction;
            let res;

            if (type === 'delete_link') {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/links/${payload}`, { method: 'DELETE', credentials: "include" });
            } 
            else if (type === 'revoke_pro') {
                // Determine if we need to update via plan endpoint
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/plan`, {
                    method: 'PATCH',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ plan: 'free' }),
                    credentials: "include"
                });
            }
            else if (type === 'ban_user' || type === 'unban_user') {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
                    method: 'PATCH',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isBanned: type === 'ban_user' }),
                    credentials: "include"
                });
            }
            else if (type === 'delete_account') {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, { method: 'DELETE', credentials: "include" });
                if (res.ok) {
                    toast.success("Account deleted");
                    navigate('/admin/users');
                    return;
                }
            }
            else if (type === 'refund_payment') {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/payments/${payload}/refund`, {
                    method: 'POST',
                    credentials: "include"
                });
            }
            else if (type === 'logout_session') {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/logout-session`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: id, sessionId: payload }),
                    credentials: "include"
                });
            }
            else if (type === 'logout_all') {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/logout-all`, {
                    method: 'POST',
                    credentials: "include"
                });
            }

            const data = await res.json();
            if (data.success) {
                toast.success(data.message || "Action completed successfully");
                fetchUserDetails();
                setShowActionModal(false);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.message || "Action failed");
        } finally {
            setProcessing(false);
        }
    };





    // Gift Pro Logic (Separate because of inputs)
    const handleGiftPro = async () => {
        setProcessing(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/plan`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    plan: 'pro',
                    period: planPeriod
                }),
                credentials: "include"
            });
            const json = await res.json();
            if (json.success) {
                toast.success("User plan updated successfully");
                setShowPlanModal(false);
                fetchUserDetails();
            }
        } catch (error) {
            toast.error("Failed to update plan");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-8"><SmartSkeleton variant="profile" /></div>;
    if (!data) return null;

    const { user, links, payments, stats } = data;
    const isBanned = user.flags?.isBanned;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-20">
             {/* Premium Header */}
            <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-white/5 shadow-2xl">
                 {/* Background Gradient */}
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-900/40 dark:to-purple-900/40 backdrop-blur-3xl"></div>
                 
                 <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-start gap-8">
                    {/* Avatar Ring */}
                    <div className="group relative mx-auto md:mx-0">
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-white dark:bg-[#15151A] p-2 shadow-xl ring-1 ring-black/5 dark:ring-white/10 rotate-3 transition-transform group-hover:rotate-0">
                             <div className="w-full h-full rounded-2xl overflow-hidden relative">
                                {user.image ? (
                                     <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                 ) : (
                                     <div className="w-full h-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center">
                                         <User className="w-12 h-12 text-neutral-300" />
                                     </div>
                                 )}
                             </div>
                        </div>
                         {/* Status Badge */}
                         {isBanned && (
                             <div className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-xl shadow-lg rotate-12 animate-pulse">
                                 <Ban className="w-5 h-5" />
                             </div>
                         )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4 w-full text-center md:text-left">
                        <div>
                             <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">{user.name}</h1>
                                {user.plan === 'pro' && (
                                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-wider shadow-sm">
                                        PRO
                                    </span>
                                )}
                                {user.role === 'admin' && (
                                     <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm shadow-indigo-500/30">
                                        Admin
                                    </span>
                                )}
                             </div>
                             <p className="text-neutral-500 text-lg flex flex-wrap items-center justify-center md:justify-start gap-2">
                                @{user.username}
                                <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
                                {user.email}
                                {user.isVerified && <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-50 dark:fill-blue-500/20" />}
                             </p>
                        </div>

                         {/* Stats Row */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 border-t border-neutral-200/50 dark:border-white/5 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                    <LinkIcon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white leading-none">{stats.totalLinks}</div>
                                    <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide mt-1">Total Links</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                                    <ExternalLink className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white leading-none">{user.profileViews}</div>
                                    <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide mt-1">Profile Views</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-base font-bold text-neutral-900 dark:text-white leading-none">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide mt-1">Joined Date</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Stack */}
                    <div className="flex flex-col gap-3 w-full md:w-auto min-w-[180px]">
                        <Button 
                             onClick={() => window.open(`/${user.username}`, '_blank')}
                             variant="secondary"
                             text="View Profile"
                             icon={ExternalLink}
                             className="flex-1 cursor-pointer w-full justify-center"
                         />
                         
                         {user.plan !== 'pro' ? (
                             <Button 
                                 onClick={() => setShowPlanModal(true)}
                                 text="Gift Pro"
                                 icon={Gift}
                                 className="flex-1 bg-amber-500 hover:bg-amber-600 border-transparent text-white shadow-lg shadow-amber-500/20 cursor-pointer w-full justify-center"
                             />
                         ) : (
                             <Button 
                                 onClick={() => requestAction('revoke_pro')}
                                 variant="outline"
                                 text="Revoke Pro"
                                 icon={Ban}
                                 className="flex-1 text-red-500 border-red-200 hover:bg-red-50 cursor-pointer w-full justify-center"
                             />
                         )}

                        {isBanned ? (
                            <Button 
                                onClick={() => requestAction('unban_user')}
                                variant="secondary"
                                text="Unban"
                                icon={Shield}
                                className="flex-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200 cursor-pointer w-full justify-center"
                            />
                        ) : (
                            <Button 
                                onClick={() => requestAction('ban_user')}
                                variant="secondary"
                                text="Ban Access"
                                icon={Ban}
                                className="flex-1 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border-transparent cursor-pointer w-full justify-center"
                            />
                        )}
                    </div>
                 </div>
            </div>

            {/* Scrollable Tabs Navigation */}
            <div className="w-full overflow-x-auto pb-2 no-scrollbar">
                <div className="flex items-center gap-1 bg-white dark:bg-[#15151A] p-1.5 rounded-xl border border-neutral-200 dark:border-white/5 min-w-max">
                    {["overview", "devices", "links", "payments", "danger"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                                flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all cursor-pointer whitespace-nowrap
                                ${activeTab === tab 
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/5"
                                }
                            `}
                        >
                            {tab === 'links' && <LinkIcon className="w-4 h-4" />}
                            {tab === 'payments' && <CreditCard className="w-4 h-4" />}
                            {tab === 'devices' && <Monitor className="w-4 h-4" />}
                            {tab === 'danger' ? <span className="flex items-center gap-1 text-red-500"><ShieldAlert className="w-4 h-4" /> Danger Zone</span> : tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* TAB CONTENT: Overview */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="bg-white dark:bg-[#15151A] rounded-2xl p-6 border border-neutral-200 dark:border-white/5 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-white">Account Status</h3>
                        <div className="space-y-4">
                            <InfoRow 
                                label="Email Verified" 
                                value={user.isVerified ? "Yes" : "No"} 
                                icon={user.isVerified ? CheckCircle : AlertTriangle}
                                color={user.isVerified ? "text-green-500" : "text-amber-500"}
                            />
                            <InfoRow 
                                label="Account Standing" 
                                value={user.flags?.isBanned ? "BANNED" : "Good"} 
                                icon={user.flags?.isBanned ? Ban : CheckCircle}
                                color={user.flags?.isBanned ? "text-red-500" : "text-green-500"}
                            />
                             <InfoRow 
                                label="Auth Provider" 
                                value={user.authProvider} 
                                icon={Shield}
                            />
                            <InfoRow 
                                label="User ID" 
                                value={<span className="font-mono text-xs">{user._id}</span>} 
                                icon={User}
                            />
                            {user.loginHistory && user.loginHistory.length > 0 && (
                                <InfoRow 
                                    label="Last Login" 
                                    value={`${user.loginHistory[user.loginHistory.length-1].location?.city || 'Unknown'}, ${user.loginHistory[user.loginHistory.length-1].location?.country || ''}`} 
                                    icon={MapPin}
                                />
                            )}
                        </div>
                    </div>

                     <div className="space-y-6">
                        <div className="bg-white dark:bg-[#15151A] rounded-2xl p-6 border border-neutral-200 dark:border-white/5 shadow-sm">
                            <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-white">Usage Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-white/5">
                                    <span className="text-neutral-500">Total Links Created</span>
                                    <span className="font-bold text-neutral-900 dark:text-white">{stats.totalLinks}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-white/5">
                                    <span className="text-neutral-500">Lifetime Profile Views</span>
                                    <span className="font-bold text-neutral-900 dark:text-white">{user.profileViews}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-white/5">
                                    <span className="text-neutral-500">Plan Status</span>
                                    <span className="font-bold text-neutral-900 dark:text-white uppercase">{user.plan}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-white/5">
                                    <span className="text-neutral-500">Pro Expiry</span>
                                    <span className="font-bold text-neutral-900 dark:text-white">
                                        {user.planExpiresAt ? new Date(user.planExpiresAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Personal Details Card */}
                        <div className="bg-white dark:bg-[#15151A] rounded-2xl p-6 border border-neutral-200 dark:border-white/5 shadow-sm">
                             <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-white">Personal Details</h3>
                             <div className="space-y-4">
                                <InfoRow 
                                    label="Public Profile" 
                                    value={user.preferences?.publicProfile?.isPublic ? "Visible" : "Hidden"} 
                                    icon={Globe}
                                />
                                <InfoRow 
                                    label="Language" 
                                    value={user.preferences?.language?.toUpperCase() || "EN"} 
                                    icon={Globe}
                                />
                                <InfoRow 
                                    label="Timezone" 
                                    value={user.preferences?.timezone || "UTC"} 
                                    icon={MapPin}
                                />
                                <div className="pt-2">
                                     <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Bio</span>
                                     <p className="text-sm text-neutral-700 dark:text-neutral-300 italic bg-neutral-50 dark:bg-white/5 p-3 rounded-lg border border-neutral-100 dark:border-white/5">
                                        {user.bio || "No bio set."}
                                     </p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Devices & Security */}
            {activeTab === 'devices' && (
                <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-sm animate-fade-in">
                    {(!user.loginHistory || user.loginHistory.length === 0) ? (
                        <div className="p-12 text-center text-neutral-500 flex flex-col items-center gap-2">
                            <Monitor className="w-8 h-8 text-neutral-300" />
                            <p>No login history available yet.</p>
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <div className="p-4 flex justify-end bg-neutral-50 dark:bg-white/5 border-b border-neutral-200 dark:border-white/5 sticky left-0">
                                <Button 
                                    onClick={() => requestAction('logout_all')}
                                    variant="outline"
                                    text="Logout All Devices"
                                    icon={LogOut}
                                    className="text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                                />
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-neutral-50 dark:bg-white/5">
                                    <tr className="text-left text-neutral-500">
                                        <th className="px-6 py-4 whitespace-nowrap">Device / OS</th>
                                        <th className="px-6 py-4 whitespace-nowrap">Browser</th>
                                        <th className="px-6 py-4 whitespace-nowrap">Location</th>
                                        <th className="px-6 py-4 whitespace-nowrap">Status</th>
                                        <th className="px-6 py-4 whitespace-nowrap text-right">Time</th>
                                        <th className="px-6 py-4 whitespace-nowrap text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-white/5">
                                    {[...user.loginHistory].reverse().map((log, index) => (
                                        <tr key={index} className="group hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-neutral-100 dark:bg-white/10 rounded-lg text-neutral-600 dark:text-neutral-400">
                                                        {log.device.includes('Mobile') ? <span className="text-xs">📱</span> : <Laptop className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-neutral-900 dark:text-white">{log.device || "Unknown Device"}</div>
                                                        <div className="text-xs text-neutral-500">{log.os}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-neutral-400" />
                                                    {log.browser}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                 <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-red-500" />
                                                    <span className="font-medium text-neutral-900 dark:text-white">
                                                        {log.location?.city || "Unknown"}, {log.location?.country || ""}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {log.isActive ? (
                                                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase flex items-center gap-1 w-fit">
                                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Active
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded-full bg-neutral-100 text-neutral-500 dark:bg-white/10 dark:text-neutral-400 text-xs font-bold uppercase">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-neutral-500">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {log.isActive && (
                                                    <button 
                                                        onClick={() => requestAction('logout_session', log.sessionId)}
                                                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                                                        title="Logout Device"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: Links (Premium Grouped) */}
             {activeTab === 'links' && (
                <div className="space-y-8 animate-fade-in">
                    {/* Collections */}
                    {links.filter(l => l.type === 'collection').length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-1">Collections</h3>
                            <div className="grid gap-4">
                                {links.filter(l => l.type === 'collection').map(collection => {
                                    const childLinks = links.filter(l => l.parentId === collection._id || l.parentId?._id === collection._id);
                                    return (
                                        <div key={collection._id} className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-sm">
                                            {/* Folder Header */}
                                            <div className="p-4 bg-neutral-50/50 dark:bg-white/5 border-b border-neutral-200 dark:border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                                        <Folder className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-neutral-900 dark:text-white">{collection.title}</h4>
                                                        <div className="text-xs text-neutral-500 font-medium">{childLinks.length} Items</div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => requestAction('delete_link', collection._id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete Collection"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            
                                            {/* Child Links */}
                                            <div className="divide-y divide-neutral-100 dark:divide-white/5 bg-white dark:bg-[#15151A]">
                                                {childLinks.map(link => (
                                                    <LinkRow key={link._id} link={link} isChild requestAction={requestAction} />
                                                ))}
                                                {childLinks.length === 0 && (
                                                    <div className="p-6 text-center text-xs text-neutral-400 italic">Empty Collection</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Standalone Links */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-1">
                            {links.some(l => l.type === 'collection') ? 'Standalone Links' : 'All Links'}
                        </h3>
                        <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-sm divide-y divide-neutral-100 dark:divide-white/5">
                            {links.filter(l => l.type === 'link' && !l.parentId).map(link => (
                                <LinkRow key={link._id} link={link} requestAction={requestAction} />
                            ))}
                            {links.filter(l => l.type === 'link' && !l.parentId).length === 0 && (
                                <div className="p-12 text-center text-neutral-500 flex flex-col items-center gap-2">
                                    <LinkIcon className="w-8 h-8 text-neutral-300" />
                                    <p>No standalone links found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Payments */}
            {activeTab === 'payments' && (
                <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-sm animate-fade-in">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50 dark:bg-white/5">
                                <tr className="text-left text-neutral-500">
                                    <th className="px-6 py-4 whitespace-nowrap">Invoice</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Amount</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Date</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Status</th>
                                    <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-white/5">
                                {payments.map(pay => (
                                    <tr key={pay._id}>
                                        <td className="px-6 py-4 font-mono text-xs text-neutral-500 whitespace-nowrap">{pay.invoiceNumber}</td>
                                        <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white whitespace-nowrap">₹{(pay.amount / 100).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-neutral-500 whitespace-nowrap">{new Date(pay.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                pay.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 
                                                pay.status === 'refunded' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {pay.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {pay.status === 'paid' && (
                                                <button 
                                                    onClick={() => requestAction('refund_payment', pay._id)}
                                                    className="p-2 text-neutral-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-lg transition-colors cursor-pointer"
                                                    title="Refund Payment"
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {payments.length === 0 && (
                                    <tr><td colSpan="5" className="p-8 text-center text-neutral-500">No payment history</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* TAB CONTENT: Danger Zone */}
             {activeTab === 'danger' && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-2xl p-6 animate-fade-in">
                    <h3 className="text-red-700 dark:text-red-400 font-bold text-lg mb-4 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5" /> Danger Zone
                    </h3>
                    <p className="text-sm text-red-600/80 mb-6 max-w-2xl">
                        These actions are critical. They can suspend users, delete data, or completely wipe accounts. Please proceed with extreme caution.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {isBanned ? (
                            <button 
                                onClick={() => requestAction('unban_user')}
                                className="flex items-center justify-center gap-2 bg-white dark:bg-black text-green-600 border border-green-200 px-4 py-3 rounded-lg font-medium shadow-sm hover:bg-green-50 transition-colors cursor-pointer"
                            >
                                <CheckCircle className="w-4 h-4" /> Restore User Access
                            </button>
                         ) : (
                            <button 
                                onClick={() => requestAction('ban_user')}
                                className="flex items-center justify-center gap-2 bg-white dark:bg-black text-orange-600 border border-orange-200 px-4 py-3 rounded-lg font-medium shadow-sm hover:bg-orange-50 transition-colors cursor-pointer"
                            >
                                <Ban className="w-4 h-4" /> Ban User Access
                            </button>
                         )}

                         <button 
                            onClick={() => requestAction('delete_account')}
                            className="flex items-center justify-center gap-2 bg-red-600 text-white border border-transparent px-4 py-3 rounded-lg font-medium shadow-sm hover:bg-red-700 transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" /> Delete Account Permanently
                        </button>
                    </div>
                </div>
            )}

            {/* ACTION MODAL */}
            <Modal open={showActionModal} onClose={() => setShowActionModal(false)}>
                {currentAction && (
                    <div className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                            currentAction.danger ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                             {currentAction.type === 'refund_payment' ? <DollarSign className="w-6 h-6" /> : (currentAction.type === 'logout_all' || currentAction.type === 'logout_session') ? <LogOut className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                            {currentAction.title}
                        </h2>
                        
                         {currentAction.type === 'refund_payment' ? (
                            <p className="text-sm text-neutral-500 mt-2 mb-6">
                                {currentAction.message}
                                <br/><br/>
                                <span className="text-red-500 font-semibold">This action cannot be undone.</span>
                            </p>
                        ) : (
                            <p className="text-sm text-neutral-500 mb-6">
                                {currentAction.message}
                            </p>
                        )}
                        
                        <div className="flex gap-3">
                            <Button variant="secondary" text="Cancel" onClick={() => setShowActionModal(false)} fullWidth />
                            <Button 
                                text={processing ? "Processing..." : currentAction.confirmText} 
                                onClick={executeAction} 
                                disabled={processing}
                                fullWidth 
                                className={`cursor-pointer ${currentAction.danger ? "bg-red-600 hover:bg-red-700 text-white border-transparent" : "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent"}`}
                            />
                        </div>
                    </div>
                )}
            </Modal>

            {/* GIFT PRO MODAL */}
            <Modal open={showPlanModal} onClose={() => setShowPlanModal(false)}>
                 <div className="text-center">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Gift className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Gift Pro Plan</h2>
                    <p className="text-sm text-neutral-500 mb-6">Grant <strong>Pro</strong> features to {user.name} for free.</p>
                    
                    <div className="space-y-4 mb-6 text-left">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Duration (Months)</label>
                        <select 
                            value={planPeriod}
                            onChange={(e) => setPlanPeriod(e.target.value)}
                            className="w-full p-3 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 dark:text-white cursor-pointer"
                        >
                            <option value="1">1 Month</option>
                            <option value="3">3 Months</option>
                            <option value="6">6 Months</option>
                            <option value="12">1 Year</option>
                            <option value="120">Lifetime (10 Years)</option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="secondary" text="Cancel" onClick={() => setShowPlanModal(false)} fullWidth />
                        <Button 
                            text={processing ? "Applying..." : "Grant Access"} 
                            onClick={handleGiftPro} 
                            disabled={processing}
                            fullWidth 
                            className="bg-amber-500 hover:bg-amber-600 border-transparent text-white cursor-pointer"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const InfoRow = ({ label, value, icon: Icon, color }) => (
    <div className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-white/5 last:border-0 text-sm">
        <div className="flex items-center gap-3 text-neutral-500">
            {Icon && <Icon className={`w-4 h-4 ${color || ""}`} />}
            <span>{label}</span>
        </div>
        <span className={`font-medium ${color || "text-neutral-900 dark:text-white"}`}>{value}</span>
    </div>
);

const LinkRow = ({ link, isChild, requestAction, copyToClipboard = (t) => { navigator.clipboard.writeText(t); toast.success("Copied!"); } }) => (
    <div className={`group flex flex-col md:flex-row md:items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors ${isChild ? 'pl-4 md:pl-8 border-l-4 border-transparent hover:border-indigo-500' : ''}`}>
        <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
                <LinkFavicon url={link.url} icon={link.icon} size={40} />
            </div>
            <div className="min-w-0">
                <h4 className="font-bold text-neutral-900 dark:text-white truncate text-sm">{link.title}</h4>
                <a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-neutral-500 hover:text-indigo-500 truncate block mt-0.5">
                    {link.url}
                </a>
            </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pl-14 md:pl-0">
            <div className="flex items-center gap-4 text-xs font-medium text-neutral-500">
                <span className="flex items-center gap-1.5" title="Clicks">
                    <ExternalLink className="w-3.5 h-3.5" /> {link.clicks}
                </span>
                <span className={`flex items-center gap-1.5 ${link.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    <CheckCircle className="w-3.5 h-3.5" /> {link.isActive ? 'Active' : 'Hidden'}
                </span>
            </div>

            <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={() => copyToClipboard(link.url)}
                    className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    title="Copy URL"
                >
                    <Copy className="w-4 h-4" />
                </button>
                 <button 
                    onClick={() => window.open(link.url, '_blank')}
                    className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    title="Open URL"
                >
                    <ExternalLink className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => requestAction('delete_link', link._id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Link"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);

export default AdminUserDetail;
