import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import api from "../../lib/api";
import { toast } from "sonner";
import { Megaphone, Save, Send, AlertCircle } from "lucide-react";

const AdminMarketing = () => {
    const [settings, setSettings] = useState({
        saleActive: false,
        saleDiscount: 0,
        saleBannerText: "",
        saleBannerLink: "/dashboard/checkout",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Email Broadcast State
    const [broadcast, setBroadcast] = useState({
        subject: "",
        content: "<h2>New Feature Alert 🚀</h2><p>Write your HTML content here...</p>",
        testEmail: "",
    });
    const [sending, setSending] = useState(false);

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

    const handleSendBroadcast = async (isTest = false) => {
        if (!broadcast.subject || !broadcast.content) {
            toast.error("Subject and content are required");
            return;
        }

        if (isTest && !broadcast.testEmail) {
            toast.error("Enter a test email address");
            return;
        }

        if (!isTest && !confirm("Are you sure you want to send this to ALL users? This cannot be undone.")) {
            return;
        }

        setSending(true);
        try {
            const payload = isTest 
                ? { ...broadcast, testEmail: broadcast.testEmail }
                : { subject: broadcast.subject, content: broadcast.content }; // omit testEmail to trigger bulk

            const res = await api.post("/api/settings/broadcast", payload);
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send broadcast");
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading settings...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">Marketing Control Center</h1>

            {/* SECTION 1: GLOBAL SALE SETTINGS */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                            <Megaphone className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Global Sale Banner</h2>
                            <p className="text-sm text-neutral-500">Manage site-wide announcements and discounts.</p>
                        </div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={settings.saleActive}
                            onChange={(e) => setSettings({ ...settings, saleActive: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        <span className="ml-3 text-sm font-medium text-neutral-900 dark:text-neutral-300">
                            {settings.saleActive ? "Active" : "Inactive"}
                        </span>
                    </label>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                        label="Banner Text"
                        value={settings.saleBannerText}
                        onChange={(e) => setSettings({ ...settings, saleBannerText: e.target.value })}
                        placeholder="e.g. Black Friday Sale: 50% Off!"
                    />
                    <InputField
                        label="Banner Link"
                        value={settings.saleBannerLink}
                        onChange={(e) => setSettings({ ...settings, saleBannerLink: e.target.value })}
                        placeholder="/dashboard/checkout"
                    />
                    <InputField
                        label="Discount Percentage"
                        type="number"
                        value={settings.saleDiscount}
                        onChange={(e) => setSettings({ ...settings, saleDiscount: Number(e.target.value) })}
                        placeholder="0"
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <Button 
                        text="Save Changes" 
                        icon={Save} 
                        onClick={handleSaveSettings} 
                        loading={saving}
                    />
                </div>
            </div>

            {/* SECTION 2: EMAIL BROADCAST */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                        <Send className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Email Broadcasting</h2>
                        <p className="text-sm text-neutral-500">Send simplified HTML emails to your users.</p>
                    </div>
                </div>

                <div className="space-y-4">
                     <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3 text-sm text-amber-800 dark:text-amber-200">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>Emails are sent in batches to avoid rate limits. A broadcast to thousands of users may take several minutes to complete.</p>
                    </div>

                    <InputField
                        label="Email Subject"
                        value={broadcast.subject}
                        onChange={(e) => setBroadcast({ ...broadcast, subject: e.target.value })}
                        placeholder="e.g. New Features are here!"
                    />

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            HTML Content
                        </label>
                        <textarea
                            value={broadcast.content}
                            onChange={(e) => setBroadcast({ ...broadcast, content: e.target.value })}
                            className="w-full h-48 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-end pt-4 border-t border-neutral-200 dark:border-neutral-800">
                        <div className="flex-1 w-full">
                            <InputField
                                label="Test Email Address"
                                value={broadcast.testEmail}
                                onChange={(e) => setBroadcast({ ...broadcast, testEmail: e.target.value })}
                                placeholder="my-email@example.com"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                text="Send Test" 
                                variant="outline"
                                onClick={() => handleSendBroadcast(true)}
                                loading={sending}
                            />
                            <Button 
                                text="Broadcast to All" 
                                onClick={() => handleSendBroadcast(false)}
                                loading={sending}
                                className="!bg-indigo-600 hover:!bg-indigo-700"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMarketing;
