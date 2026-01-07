import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    User, Mail, Calendar, Shield, Link as LinkIcon, 
    CreditCard, AlertTriangle, CheckCircle, Ban, ExternalLink, Trash2, Gift, LogOut, ShieldAlert
} from "lucide-react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { toast } from "sonner";
import SmartSkeleton from "../../components/ui/SmartSkeleton";

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
    const [currentAction, setCurrentAction] = useState(null); // { type: 'delete_link', payload: id, title, message, danger: true }
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
       ACTION HANDLERS (Open Modals)
    -------------------------------------------------- */
    const requestAction = (type, payload) => {
        const actions = {
            'delete_link': {
                title: "Remove Content?",
                message: "This link will be permanently deleted from the user's profile. This is a moderation action.",
                danger: true,
                confirmText: "Delete Link",
                payload
            },
            'revoke_pro': {
                title: "Revoke Pro Access?",
                message: "The user will be immediately downgraded to the Free plan. They will lose access to all Pro features.",
                danger: true,
                confirmText: "Revoke Access",
                payload
            },
            'ban_user': {
                title: "Ban User Account?",
                message: "This user will be logged out and prevented from accessing the platform. Their profiles will be hidden.",
                danger: true,
                confirmText: "Ban User",
                payload
            },
            'unban_user': {
                title: "Unban User?",
                message: "Access will be restored for this user immediately.",
                danger: false,
                confirmText: "Restore Access",
                payload
            },
            'delete_account': {
                title: "Permanently Delete Account?",
                message: "This is a destructive action. All data (links, analytics, user info) will be wiped forever.",
                danger: true,
                confirmText: "Delete Account",
                payload
            }
        };

        setCurrentAction({ type, ...actions[type] });
        setShowActionModal(true);
    };

    /* --------------------------------------------------
       EXECUTE ACTIONS
    -------------------------------------------------- */
    const executeAction = async () => {
        if (!currentAction) return;
        setProcessing(true);

        try {
            let res;
            
            // DELETE LINK
            if (currentAction.type === 'delete_link') {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/links/${currentAction.payload}`, {
                    method: "DELETE",
                    credentials: "include"
                });
            } 
            
            // REVOKE PRO
            else if (currentAction.type === 'revoke_pro') {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/plan`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ plan: 'free' }),
                    credentials: "include"
                });
            }

            // BAN / UNBAN
            else if (currentAction.type === 'ban_user' || currentAction.type === 'unban_user') {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
                    method: 'PATCH',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isBanned: currentAction.type === 'ban_user' }),
                    credentials: "include"
                });
            }

            // DELETE ACCOUNT
            else if (currentAction.type === 'delete_account') {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
                    method: 'DELETE',
                    credentials: "include"
                });
            }

            // HANDLE RESPONSE
            if (res.ok) {
                const json = await res.json();
                toast.success(json.message || "Action completed successfully");
                
                if (currentAction.type === 'delete_account') {
                    navigate("/admin/users");
                } else {
                    fetchUserDetails();
                }
            } else {
                throw new Error("Action failed");
            }

        } catch (error) {
            toast.error("Operation failed. Please try again.");
            console.error(error);
        } finally {
            setProcessing(false);
            setShowActionModal(false);
            setCurrentAction(null);
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
             {/* Header */}
            <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 p-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-neutral-100 dark:bg-white/10 overflow-hidden flex-shrink-0">
                             {user.image ? (
                                 <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                             ) : (
                                 <User className="w-full h-full p-6 text-neutral-400" />
                             )}
                        </div>
                        {isBanned && (
                            <div className="absolute -bottom-2 -right-2 bg-red-500 text-white p-1.5 rounded-full border-4 border-white dark:border-[#15151A]">
                                <Ban className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{user.name}</h1>
                            {user.plan === 'pro' && (
                                <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded uppercase">PRO</span>
                            )}
                            {user.role === 'admin' && (
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase">ADMIN</span>
                            )}
                        </div>
                        <p className="text-neutral-500 font-mono flex items-center justify-center md:justify-start gap-2">
                            @{user.username} • {user.email}
                            {user.isVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-neutral-500 pt-2">
                             <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                             <span className="flex items-center gap-1"><LinkIcon className="w-4 h-4" /> {stats.totalLinks} Links</span>
                             <span className="flex items-center gap-1"><ExternalLink className="w-4 h-4" /> {user.profileViews} Views</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[200px]">
                         <Button 
                             onClick={() => window.open(`/${user.username}`, '_blank')}
                             variant="secondary"
                             text="View Public Profile"
                             icon={ExternalLink}
                             fullWidth 
                         />
                         
                         {user.plan !== 'pro' ? (
                             <Button 
                                 onClick={() => setShowPlanModal(true)}
                                 text="Gift Pro Plan"
                                 icon={Gift}
                                 fullWidth
                                 className="bg-amber-500 hover:bg-amber-600 border-transparent text-white shadow-lg shadow-amber-500/20"
                             />
                         ) : (
                             <Button 
                                 onClick={() => requestAction('revoke_pro')}
                                 variant="outline"
                                 text="Revoke Pro Access"
                                 icon={Ban}
                                 fullWidth
                                 className="text-red-500 border-red-200 hover:bg-red-50"
                             />
                         )}

                        {isBanned ? (
                            <Button 
                                onClick={() => requestAction('unban_user')}
                                variant="secondary"
                                text="Unban Account"
                                icon={Shield}
                                className="bg-green-100 text-green-700 hover:bg-green-200 border-transparent"
                                fullWidth
                            />
                        ) : (
                            <Button 
                                onClick={() => requestAction('ban_user')}
                                variant="secondary"
                                text="Ban Account"
                                icon={Ban}
                                className="bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border-transparent"
                                fullWidth
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap items-center gap-1 bg-white dark:bg-[#15151A] p-1 rounded-xl border border-neutral-200 dark:border-white/5 w-fit">
                {["overview", "links", "payments", "danger"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
                            ${activeTab === tab 
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none" 
                                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                            }
                        `}
                    >
                        {tab === 'danger' ? <span className="flex items-center gap-1 text-red-500"><AlertTriangle className="w-3 h-3" /> Danger</span> : tab}
                    </button>
                ))}
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
                        </div>
                    </div>
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
                </div>
            )}

            {/* TAB CONTENT: Links (Moderation) */}
             {activeTab === 'links' && (
                <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-sm animate-fade-in">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 dark:bg-white/5">
                            <tr className="text-left text-neutral-500">
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">URL</th>
                                <th className="px-6 py-4">Clicks</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-neutral-200 dark:divide-white/5">
                            {links.map(link => (
                                <tr key={link._id}>
                                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">{link.title}</td>
                                    <td className="px-6 py-4 text-neutral-500 truncate max-w-[200px]">
                                        <a href={link.url} target="_blank" rel="noreferrer" className="hover:underline text-indigo-500">{link.url}</a>
                                    </td>
                                    <td className="px-6 py-4">{link.clicks}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${link.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {link.isActive ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => requestAction('delete_link', link._id)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Delete Link (Moderation)"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                              {links.length === 0 && (
                                <tr><td colSpan="5" className="p-8 text-center text-neutral-500">No links found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* TAB CONTENT: Payments */}
            {activeTab === 'payments' && (
                <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-sm animate-fade-in">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 dark:bg-white/5">
                            <tr className="text-left text-neutral-500">
                                <th className="px-6 py-4">Invoice</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-neutral-200 dark:divide-white/5">
                            {payments.map(pay => (
                                <tr key={pay._id}>
                                    <td className="px-6 py-4 font-mono text-xs text-neutral-500">{pay.invoiceNumber}</td>
                                    <td className="px-6 py-4 font-medium">₹{(pay.amount / 100).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-neutral-500">{new Date(pay.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                         <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                            pay.status === 'paid' ? 'bg-green-100 text-green-700' : 
                                            pay.status === 'refunded' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                         }`}>
                                            {pay.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr><td colSpan="4" className="p-8 text-center text-neutral-500">No payment history</td></tr>
                            )}
                        </tbody>
                    </table>
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
                                className="flex items-center justify-center gap-2 bg-white dark:bg-black text-green-600 border border-green-200 px-4 py-3 rounded-lg font-medium shadow-sm hover:bg-green-50 transition-colors"
                            >
                                <CheckCircle className="w-4 h-4" /> Restore User Access
                            </button>
                         ) : (
                            <button 
                                onClick={() => requestAction('ban_user')}
                                className="flex items-center justify-center gap-2 bg-white dark:bg-black text-orange-600 border border-orange-200 px-4 py-3 rounded-lg font-medium shadow-sm hover:bg-orange-50 transition-colors"
                            >
                                <Ban className="w-4 h-4" /> Ban User Access
                            </button>
                         )}

                         <button 
                            onClick={() => requestAction('delete_account')}
                            className="flex items-center justify-center gap-2 bg-red-600 text-white border border-transparent px-4 py-3 rounded-lg font-medium shadow-sm hover:bg-red-700 transition-colors"
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
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                            {currentAction.title}
                        </h2>
                        <p className="text-sm text-neutral-500 mb-6">
                            {currentAction.message}
                        </p>
                        
                        <div className="flex gap-3">
                            <Button variant="secondary" text="Cancel" onClick={() => setShowActionModal(false)} fullWidth />
                            <Button 
                                text={processing ? "Processing..." : currentAction.confirmText} 
                                onClick={executeAction} 
                                disabled={processing}
                                fullWidth 
                                className={currentAction.danger ? "bg-red-600 hover:bg-red-700 text-white border-transparent" : "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent"}
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
                            className="w-full p-3 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
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
                            className="bg-amber-500 hover:bg-amber-600 border-transparent text-white"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const InfoRow = ({ label, value, icon: Icon, color }) => (
    <div className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-white/5 last:border-0">
        <div className="flex items-center gap-3 text-neutral-500">
            {Icon && <Icon className={`w-4 h-4 ${color || ""}`} />}
            <span>{label}</span>
        </div>
        <span className={`font-medium ${color || "text-neutral-900 dark:text-white"}`}>{value}</span>
    </div>
);

export default AdminUserDetail;
