import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import api from "../../lib/api";
import { toast } from "sonner";
import { Megaphone, Save, Send, AlertCircle, Sparkles, Wand2, LayoutTemplate, CheckCircle2, AlertTriangle, Users, Paperclip, X, Zap } from "lucide-react";
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
    <div style="background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 20px; text-align: center;">
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
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20 px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-neutral-200/50 dark:border-white/5">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
                            <Megaphone className="w-6 h-6" />
                        </div>
                        Marketing Control
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2 font-medium">Manage global sales campaigns and email broadcasts.</p>
                </div>
                {settings.saleActive && (
                    <div className="self-start md:self-auto px-5 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-pulse border border-indigo-200 dark:border-indigo-500/30 shadow-sm">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                        </span>
                        Sale Active
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: Sale Settings */}
                <div className="xl:col-span-5 space-y-6">
                    <div className="bg-white dark:bg-[#121212] rounded-[2rem] border border-neutral-200 dark:border-white/5 p-8 shadow-2xl shadow-neutral-200/50 dark:shadow-black/20 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
                        
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Global Sale</h2>
                                    <p className="text-sm text-neutral-500 font-medium">Site-wide banner configuration</p>
                                </div>
                            </div>
                            
                            {/* Toggle */}
                            <label className="relative inline-flex items-center cursor-pointer group/toggle">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={settings.saleActive}
                                    onChange={(e) => setSettings({ ...settings, saleActive: e.target.checked })}
                                />
                                <div className="w-16 h-9 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-500/20 rounded-full peer dark:bg-neutral-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 shadow-inner group-hover/toggle:shadow-md transition-shadow"></div>
                            </label>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <InputField
                                label="Banner Headline"
                                value={settings.saleBannerText}
                                onChange={(e) => setSettings({ ...settings, saleBannerText: e.target.value })}
                                placeholder="e.g. Black Friday Flash Sale"
                                className="!h-12 !text-base cursor-pointer"
                            />
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <InputField
                                    label="Discount %"
                                    type="number"
                                    value={settings.saleDiscount}
                                    onChange={(e) => setSettings({ ...settings, saleDiscount: Number(e.target.value) })}
                                    placeholder="50"
                                    className="!h-12 cursor-pointer"
                                />
                                <InputField
                                    label="Target Link"
                                    value={settings.saleBannerLink}
                                    onChange={(e) => setSettings({ ...settings, saleBannerLink: e.target.value })}
                                    placeholder="/dashboard/checkout"
                                    className="!h-12 cursor-pointer"
                                />
                            </div>

                            {/* Live Preview Card */}
                            <div className="pt-6 border-t border-neutral-100 dark:border-white/5">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <LayoutTemplate className="w-4 h-4" /> Live Mobile Preview
                                </label>
                                <div className="rounded-2xl overflow-hidden relative group/preview cursor-default shadow-lg shadow-indigo-500/10 ring-1 ring-black/5 dark:ring-white/10 transform hover:scale-[1.02] transition-transform duration-300">
                                    <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 p-4 text-white flex items-center justify-between gap-4 animate-gradient-x bg-[length:200%_200%]">
                                        <div className="flex items-center gap-3 text-sm font-medium overflow-hidden">
                                            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse shrink-0" />
                                            <div className="flex flex-col min-w-0">
                                                <span className="truncate font-bold text-shadow-sm">{settings.saleBannerText || "Black Friday Mega Sale"}</span>
                                                <span className="text-[10px] opacity-90 truncate">Limited time only • Ends soon</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {settings.saleDiscount > 0 && (
                                                <span className="bg-white text-indigo-700 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shadow-sm">
                                                    {settings.saleDiscount}% OFF
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Button 
                                text={saving ? "Saving Changes..." : "Save Configuration"}
                                icon={Save} 
                                onClick={handleSaveSettings} 
                                loading={saving}
                                fullWidth
                                className="h-14 text-base hover:bg-indigo-700 transition-all active:scale-[0.98]"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Email Broadcaster */}
                <div className="xl:col-span-7 h-full">
                    <div className="bg-white dark:bg-[#121212] rounded-[2rem] border border-neutral-200 dark:border-white/5 p-8 shadow-2xl shadow-neutral-200/50 dark:shadow-black/20 h-full flex flex-col relative overflow-hiddenhover:border-emerald-500/30 transition-all duration-500">
                         {/* Decorative Background */}
                         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl ring-1 ring-emerald-500/20">
                                    <Send className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Smart Broadcaster</h2>
                                    <p className="text-sm text-neutral-500 font-medium">Send branded HTML emails to users</p>
                                </div>
                            </div>
                            
                            <Button
                                text="Magic Write"
                                icon={Wand2}
                                size="sm"
                                variant="secondary"
                                onClick={handleAutoWrite}
                                className="w-full sm:w-auto bg-white dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 !rounded-xl !py-2.5 !px-4"
                            />
                        </div>

                        <div className="space-y-6 flex-1 flex flex-col relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Target Audience</label>
                                    <div className="relative group/select">
                                        <select
                                            value={broadcast.audience}
                                            onChange={(e) => setBroadcast({ ...broadcast, audience: e.target.value })}
                                            className="w-full h-[52px] px-4 pl-11 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 cursor-pointer text-sm text-neutral-900 dark:text-white appearance-none transition-all  font-medium"
                                        >
                                            <option value="all">All Users</option>
                                            <option value="pro">Pro Plan Only</option>
                                            <option value="free">Free Plan Only</option>
                                            <option value="specific">Specific User</option>
                                        </select>
                                        <Users className="w-5 h-5 text-neutral-400 group-hover/select:text-emerald-500 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    {broadcast.audience === 'specific' ? (
                                        <InputField
                                            label="Recipient Email"
                                            value={broadcast.specificEmail}
                                            onChange={(e) => setBroadcast({ ...broadcast, specificEmail: e.target.value })}
                                            placeholder="user@example.com"
                                            className="!h-[52px] cursor-pointer"
                                        />
                                    ) : (
                                        <InputField
                                             label="Subject Line"
                                             value={broadcast.subject}
                                             onChange={(e) => setBroadcast({ ...broadcast, subject: e.target.value })}
                                             placeholder="Tip: Use emojis 🚀"
                                             className="!h-[52px] cursor-pointer"
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
                                    className="!h-[52px] cursor-pointer"
                                />
                            )}

                            <div className="flex-1 flex flex-col group/editor">
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1 mb-2 flex justify-between items-center">
                                    <span>HTML Content</span>
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">Markdown Supported</span>
                                </label>
                                <div className="flex-1 relative group bg-neutral-50 dark:bg-[#1A1A1A] rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all overflow-hidden flex flex-col shadow-inner">
                                    <textarea
                                        value={broadcast.content}
                                        onChange={(e) => setBroadcast({ ...broadcast, content: e.target.value })}
                                        className="w-full h-full min-h-[300px] p-6 bg-transparent border-none outline-none font-mono text-sm resize-none custom-scrollbar text-neutral-900 dark:text-white leading-relaxed cursor-text"
                                        placeholder="<p>Write your awesome update here...</p>"
                                    />
                                    
                                    {/* Editor Toolbar (Bottom) */}
                                    <div className="p-3 border-t border-neutral-200 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-white/5 backdrop-blur-sm">
                                        
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
                                                className="px-3 py-1.5 hover:bg-neutral-200/50 dark:hover:bg-white/10 rounded-lg text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors tooltip flex items-center gap-2 text-xs font-bold border border-transparent hover:border-neutral-200 dark:hover:border-white/10"
                                            >
                                                <Paperclip className="w-3.5 h-3.5" />
                                                <span className="hidden sm:inline">Attach Files</span>
                                            </label>
                                            
                                            {broadcast.attachments.length > 0 && (
                                                <div className="flex items-center gap-2 overflow-x-auto max-w-[150px] sm:max-w-[300px] no-scrollbar mask-linear-fade">
                                                    {broadcast.attachments.map((file, i) => (
                                                        <div key={i} className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 pl-2 pr-1 py-1 rounded-md text-[10px] font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20 whitespace-nowrap shadow-sm">
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

                                        <div className="text-[10px] uppercase font-bold text-neutral-400 px-2 tracking-wider">
                                            {broadcast.content.length} chars
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl p-4 flex gap-3 text-xs sm:text-sm text-amber-800 dark:text-amber-200 items-start">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="leading-relaxed font-medium">Broadcasting is irreversible. Emails are queued and sent in batches. Always test before sending to all users.</p>
                            </div>

                            <div className="pt-6 border-t border-neutral-100 dark:border-white/5 flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
                                <div className="w-full relative flex-1">
                                    <InputField
                                        label="Test Recipient"
                                        value={broadcast.testEmail}
                                        onChange={(e) => setBroadcast({ ...broadcast, testEmail: e.target.value })}
                                        placeholder="Enter your email"
                                        className="!h-11 md:!h-[52px] cursor-pointer"
                                    />
                                     <span className="absolute right-3 top-[34px] md:top-[38px] text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-500 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 pointer-events-none">
                                        PREVIEW
                                     </span>
                                </div>
                                <div className="flex gap-3 w-full lg:w-auto">
                                    <Button 
                                        text="Send Test" 
                                        variant="outline"
                                        onClick={() => initiateBroadcast("test")}
                                        loading={sending}
                                        className="!h-11 md:!h-[52px] flex-1 lg:flex-none whitespace-nowrap px-6 !rounded-xl !border-neutral-200 dark:!border-white/10 hover:!bg-neutral-50 dark:hover:!bg-white/5 cursor-pointer text-sm md:text-base"
                                    />
                                    <Button 
                                        text="Broadcast All" 
                                        icon={Send}
                                        onClick={() => initiateBroadcast("broadcast")}
                                        loading={sending}
                                        className="!bg-emerald-600 hover:!bg-emerald-700 !h-11 md:!h-[52px] flex-1 lg:flex-none whitespace-nowrap px-8 cursor-pointer !rounded-xl text-sm md:!text-base !font-bold !border-0"
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
                    <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ring-8 ring-opacity-50
                        ${confirmModal.type === "broadcast" 
                            ? "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400 ring-red-50 dark:ring-red-900/10" 
                            : "bg-indigo-100 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400 ring-indigo-50 dark:ring-indigo-900/10"}
                    `}>
                        {confirmModal.type === "broadcast" ? <AlertTriangle className="w-10 h-10" /> : <Send className="w-10 h-10" />}
                    </div>

                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
                        {confirmModal.type === "broadcast" ? "Ready to Broadcast?" : "Send Test Email?"}
                    </h3>

                    <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-sm mx-auto leading-relaxed text-sm">
                        {confirmModal.type === "broadcast" 
                            ? (
                                <span>
                                    This will queue an email to <strong className="text-neutral-900 dark:text-white font-bold bg-neutral-100 dark:bg-white/10 px-1 rounded">{broadcast.audience === 'all' ? 'ALL active users' : broadcast.audience === 'specific' ? broadcast.specificEmail : broadcast.audience + ' users'}</strong>. This action cannot be undone.
                                </span>
                            ) 
                            : `Sending a test preview to: ${broadcast.testEmail}`
                        }
                    </p>

                    <div className="flex gap-4">
                        <Button 
                            text="Cancel"
                            variant="secondary"
                            onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                            fullWidth
                            className="!h-12 !rounded-xl"
                        />
                        <Button 
                            text={confirmModal.type === "broadcast" ? "Yes, Broadcast" : "Send Now"}
                            onClick={handleConfirmSend}
                            fullWidth
                            className={`!h-12 !rounded-xl !text-base !font-bold ${confirmModal.type === "broadcast" ? "!bg-red-600 hover:!bg-red-700" : "!bg-indigo-600 hover:!bg-indigo-700"}`}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminMarketing;
