import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import api from "../../lib/api";
import { toast } from "sonner";
import { Megaphone, Save, Send, AlertCircle, Sparkles, Wand2, LayoutTemplate, CheckCircle2, AlertTriangle, Users, Paperclip, X } from "lucide-react";
import Modal from "../../components/ui/Modal";

const AdminMarketing = () => {
    const [settings, setSettings] = useState({
        saleActive: false,
        saleDiscount: 0,
        saleBannerText: "",
        saleBannerLink: "/dashboard/checkout",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [broadcast, setBroadcast] = useState({
        subject: "",
        content: "",
        testEmail: "",
        audience: "all", // "all" | "pro" | "free" | "specific"
        specificEmail: "",
        attachments: [] // Array of { filename, content (base64) }
    });
    const [sending, setSending] = useState(false);
    
    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: null, // "test" | "broadcast"
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get("/api/settings");
            if (res.data.success && res.data.settings) {
                setSettings(res.data.settings);
            }
        } catch (error) {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            await api.put("/api/settings", settings);
            toast.success("Marketing settings updated!");
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const handleAutoWrite = () => {
        if (!settings.saleBannerText) {
            toast.error("Please set a Banner Text first to generate content.");
            return;
        }

        const discountText = settings.saleDiscount > 0 ? `${settings.saleDiscount}% OFF` : "Special Offer";
        const subject = `🚀 ${settings.saleBannerText} - ${discountText} Inside!`;
        
        const content = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
    <div style="background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 20px; text-center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">${settings.saleBannerText}</h1>
        <p style="color: #e0e7ff; margin-top: 10px; font-size: 18px;">Don't miss out on this limited time deal.</p>
    </div>
    <div style="padding: 40px 30px; text-align: center;">
        <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 30px;">
            We are excited to announce a special promotion! Upgrade your Bunchly account today and get <strong>${discountText}</strong> on your Pro subscription.
        </p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; display: inline-block; margin-bottom: 30px;">
            <p style="margin: 0; color: #4b5563; font-size: 14px; font-weight: 600;">USE CODE AT CHECKOUT</p>
            <p style="margin: 5px 0 0 0; color: #4f46e5; font-size: 24px; font-weight: 900; letter-spacing: 1px;">SPECIAL OFFER</p>
        </div>
        <div>
            <a href="${window.location.origin}${settings.saleBannerLink}?apply_offer=true" style="background-color: #4f46e5; color: white; padding: 16px 32px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
                Claim ${discountText} Now
            </a>
        </div>
        <p style="margin-top: 40px; color: #9ca3af; font-size: 12px;">
            Offer valid for a limited time. Terms and conditions apply.
        </p>
    </div>
</div>
        `.trim();

        setBroadcast({ ...broadcast, subject, content });
        toast.success("Email content auto-generated! ✨");
    };

    const initiateBroadcast = (type) => {
        if (!broadcast.subject || !broadcast.content) {
            toast.error("Subject and content are required");
            return;
        }
        if (type === "test" && !broadcast.testEmail) {
            toast.error("Enter a test email address");
            return;
        }
        setConfirmModal({ isOpen: true, type });
    };

    const handleConfirmSend = async () => {
        const isTest = confirmModal.type === "test";
        setConfirmModal({ ...confirmModal, isOpen: false }); 
        
        setSending(true);
        try {
            const payload = isTest 
                ? { 
                    ...broadcast, 
                    testEmail: broadcast.testEmail,
                    // Send attachments in test too
                    attachments: broadcast.attachments 
                  }
                : { 
                    subject: broadcast.subject, 
                    content: broadcast.content,
                    audience: broadcast.audience,
                    specificEmail: broadcast.specificEmail,
                    attachments: broadcast.attachments
                  }; 

            const res = await api.post("/api/settings/broadcast", payload);
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send broadcast");
        } finally {
            setSending(false);
        }
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
        
        const newAttachments = [];

        for (const file of files) {
            if (file.size > MAX_SIZE) {
                toast.error(`File ${file.name} is too large (Max 5MB)`);
                continue;
            }
            
            try {
                const base64 = await readFileAsBase64(file);
                newAttachments.push({
                    filename: file.name,
                    content: base64.split(',')[1] // Remove data URL prefix
                });
            } catch (err) {
                toast.error("Failed to read file");
            }
        }

        setBroadcast(prev => ({ 
            ...prev, 
            attachments: [...prev.attachments, ...newAttachments] 
        }));
    };

    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const removeAttachment = (index) => {
        setBroadcast(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Marketing Control</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage global sales and email campaigns.</p>
                </div>
                {settings.saleActive && (
                    <div className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-pulse border border-indigo-100 dark:border-indigo-500/20">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Sale is Active
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: Sale Settings */}
                <div className="xl:col-span-5 space-y-6">
                    <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-neutral-200 dark:border-white/5 p-6 shadow-xl shadow-black/5 relative overflow-hidden group">
                        
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20">
                                    <Megaphone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Global Sale</h2>
                                    <p className="text-xs text-neutral-500 font-medium">Site-wide banner configuration</p>
                                </div>
                            </div>
                            
                            {/* Toggle */}
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={settings.saleActive}
                                    onChange={(e) => setSettings({ ...settings, saleActive: e.target.checked })}
                                />
                                <div className="w-14 h-8 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-500/20 rounded-full peer dark:bg-neutral-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 shadow-inner"></div>
                            </label>
                        </div>

                        <div className="space-y-5 relative z-10">
                            <InputField
                                label="Banner Headline"
                                value={settings.saleBannerText}
                                onChange={(e) => setSettings({ ...settings, saleBannerText: e.target.value })}
                                placeholder="e.g. Black Friday Flash Sale"
                            />
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField
                                    label="Discount %"
                                    type="number"
                                    value={settings.saleDiscount}
                                    onChange={(e) => setSettings({ ...settings, saleDiscount: Number(e.target.value) })}
                                    placeholder="50"
                                />
                                <InputField
                                    label="Target Link"
                                    value={settings.saleBannerLink}
                                    onChange={(e) => setSettings({ ...settings, saleBannerLink: e.target.value })}
                                    placeholder="/dashboard/checkout"
                                />
                            </div>

                            {/* Live Preview Card */}
                            <div className="pt-4 border-t border-neutral-100 dark:border-white/5">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 block flex items-center gap-1">
                                    <LayoutTemplate className="w-3 h-3" /> Live Preview
                                </label>
                                <div className="rounded-xl overflow-hidden relative group/preview cursor-default">
                                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white flex items-center justify-between gap-3 shadow-inner">
                                        <div className="flex items-center gap-2 text-sm font-medium truncate">
                                            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse shrink-0" />
                                            <span className="truncate">{settings.saleBannerText || "Your Sale Text"}</span>
                                            {settings.saleDiscount > 0 && (
                                                <span className="bg-white text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0">
                                                    {settings.saleDiscount}% OFF
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold opacity-80 border-b border-white/50">Claim</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button 
                                text={saving ? "Saving..." : "Save Configuration"}
                                icon={Save} 
                                onClick={handleSaveSettings} 
                                loading={saving}
                                fullWidth
                                className="h-12 shadow-xl shadow-indigo-500/20"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Email Broadcaster */}
                <div className="xl:col-span-7 h-full">
                    <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-neutral-200 dark:border-white/5 p-6 shadow-xl shadow-black/5 h-full flex flex-col relative overflow-hidden">
                         {/* Decorative Background */}
                         <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
                                    <Send className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Smart Broadcaster</h2>
                                    <p className="text-xs text-neutral-500 font-medium">Send branded HTML emails</p>
                                </div>
                            </div>
                            
                            <Button
                                text="Magic Write"
                                icon={Wand2}
                                size="sm"
                                variant="secondary"
                                onClick={handleAutoWrite}
                                className="w-full sm:w-auto bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:scale-105 active:scale-95 transition-all shadow-sm"
                            />
                        </div>

                        <div className="space-y-5 flex-1 flex flex-col relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Audience</label>
                                    <div className="relative">
                                        <select
                                            value={broadcast.audience}
                                            onChange={(e) => setBroadcast({ ...broadcast, audience: e.target.value })}
                                            className="w-full h-[46px] px-4 pl-10 bg-white dark:bg-[#151515] border border-neutral-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer text-sm text-neutral-900 dark:text-white appearance-none transition-all hover:bg-neutral-50 dark:hover:bg-white/5"
                                        >
                                            <option value="all" className="bg-white dark:bg-black text-neutral-900 dark:text-white">All Users</option>
                                            <option value="pro" className="bg-white dark:bg-black text-neutral-900 dark:text-white">Pro Plan Only</option>
                                            <option value="free" className="bg-white dark:bg-black text-neutral-900 dark:text-white">Free Plan Only</option>
                                            <option value="specific" className="bg-white dark:bg-black text-neutral-900 dark:text-white">Specific User</option>
                                        </select>
                                        <Users className="w-4 h-4 text-neutral-500 dark:text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5">
                                    {broadcast.audience === 'specific' ? (
                                        <InputField
                                            label="Recipient Email"
                                            value={broadcast.specificEmail}
                                            onChange={(e) => setBroadcast({ ...broadcast, specificEmail: e.target.value })}
                                            placeholder="user@example.com"
                                            className="h-[46px]"
                                        />
                                    ) : (
                                        <InputField
                                             label="Subject Line"
                                             value={broadcast.subject}
                                             onChange={(e) => setBroadcast({ ...broadcast, subject: e.target.value })}
                                             placeholder="Tip: Use emojis 🚀"
                                             className="h-[46px]"
                                        />
                                    )}
                                </div>
                            </div>
                            
                            {/* If specific, shows subject line below. If not, subject is in grid above. Keeping logic simpler: */}
                            {broadcast.audience === 'specific' && (
                                <InputField
                                    label="Subject Line"
                                    value={broadcast.subject}
                                    onChange={(e) => setBroadcast({ ...broadcast, subject: e.target.value })}
                                    placeholder="Tip: Use emojis 🚀"
                                />
                            )}

                            <div className="flex-1 flex flex-col group/editor">
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1 mb-2 flex justify-between">
                                    <span>HTML Content</span>
                                    <span className="text-[10px] text-neutral-400 font-normal bg-neutral-100 dark:bg-white/5 px-2 py-0.5 rounded-full">Markdown Supported</span>
                                </label>
                                <div className="flex-1 relative group bg-neutral-50 dark:bg-black/20 rounded-xl border border-neutral-200 dark:border-white/10 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all overflow-hidden flex flex-col">
                                    <textarea
                                        value={broadcast.content}
                                        onChange={(e) => setBroadcast({ ...broadcast, content: e.target.value })}
                                        className="w-full h-full min-h-[250px] p-4 bg-transparent border-none outline-none font-mono text-sm resize-none custom-scrollbar text-neutral-900 dark:text-white leading-relaxed"
                                        placeholder="<p>Write your awesome update here...</p>"
                                    />
                                    
                                    {/* Editor Toolbar (Bottom) */}
                                    <div className="p-2 border-t border-neutral-200 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-white/5 backdrop-blur-sm">
                                        
                                        {/* Attachments */}
                                         <div className="flex items-center gap-2">
                                            <input 
                                                id="file-upload"
                                                type="file" 
                                                multiple 
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <label 
                                                htmlFor="file-upload"
                                                className="p-2 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-lg text-neutral-500 dark:text-neutral-400 cursor-pointer transition-colors tooltip flex items-center gap-2"
                                                title="Attach files"
                                            >
                                                <Paperclip className="w-4 h-4" />
                                                <span className="text-xs font-medium hidden sm:inline">Attach</span>
                                            </label>
                                            
                                            {broadcast.attachments.length > 0 && (
                                                <div className="flex items-center gap-2 overflow-x-auto max-w-[200px] sm:max-w-[300px] no-scrollbar">
                                                    {broadcast.attachments.map((file, i) => (
                                                        <div key={i} className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 pl-2 pr-1 py-1 rounded text-[11px] font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20 whitespace-nowrap">
                                                            <span className="truncate max-w-[80px]">{file.filename}</span>
                                                            <button 
                                                                onClick={() => removeAttachment(i)}
                                                                className="p-0.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-full transition-colors cursor-pointer"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-[10px] text-neutral-400 font-mono px-2">
                                            {broadcast.content.length} chars
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 flex gap-3 text-xs sm:text-sm text-amber-800 dark:text-amber-200">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>Broadcasting to all users is irreversible. Emails are queued and sent in batches to ensure deliverability.</p>
                            </div>

                            <div className="pt-4 border-t border-neutral-100 dark:border-white/5 flex flex-col md:flex-row gap-4 items-stretch md:items-end">
                                <div className="w-full relative flex-1">
                                    <InputField
                                        label="Test Recipient"
                                        value={broadcast.testEmail}
                                        onChange={(e) => setBroadcast({ ...broadcast, testEmail: e.target.value })}
                                        placeholder="Enter your email"
                                        className="h-[46px]"
                                    />
                                     <span className="absolute right-3 top-[38px] text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 pointer-events-none">
                                        PREVIEW
                                     </span>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <Button 
                                        text="Send Test" 
                                        variant="outline"
                                        onClick={() => initiateBroadcast("test")}
                                        loading={sending}
                                        className="h-[46px] flex-1 md:flex-none whitespace-nowrap px-6 hover:bg-neutral-50 dark:hover:bg-white/5 cursor-pointer"
                                    />
                                    <Button 
                                        text="Broadcast All" 
                                        icon={Send}
                                        onClick={() => initiateBroadcast("broadcast")}
                                        loading={sending}
                                        className="!bg-emerald-600 hover:!bg-emerald-700 h-[46px] shadow-lg shadow-emerald-500/20 flex-1 md:flex-none whitespace-nowrap px-6 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal open={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}>
                <div className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 
                        ${confirmModal.type === "broadcast" ? "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400" : "bg-indigo-100 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400"}
                    `}>
                        {confirmModal.type === "broadcast" ? <AlertTriangle className="w-8 h-8" /> : <Send className="w-8 h-8" />}
                    </div>

                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                        {confirmModal.type === "broadcast" ? "Ready to Broadcast?" : "Send Test Email?"}
                    </h3>

                    <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-xs mx-auto">
                        {confirmModal.type === "broadcast" 
                            ? (
                                <span>
                                    This will queue an email to <strong className="text-neutral-900 dark:text-white">{broadcast.audience === 'all' ? 'ALL active users' : broadcast.audience === 'specific' ? broadcast.specificEmail : broadcast.audience + ' users'}</strong>. This action cannot be undone.
                                </span>
                            ) 
                            : `Sending a test preview to: ${broadcast.testEmail}`
                        }
                    </p>

                    <div className="flex items-center gap-3">
                        <Button 
                            text="Cancel"
                            variant="secondary"
                            onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                            fullWidth
                            className="h-12"
                        />
                        <Button 
                            text={confirmModal.type === "broadcast" ? "Yes, Broadcast" : "Send Now"}
                            onClick={handleConfirmSend}
                            fullWidth
                            className={`h-12 ${confirmModal.type === "broadcast" ? "!bg-red-600 hover:!bg-red-700 shadow-lg shadow-red-500/20" : "!bg-indigo-600 hover:!bg-indigo-700 shadow-lg shadow-indigo-500/20"}`}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminMarketing;
