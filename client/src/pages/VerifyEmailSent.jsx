import { MailCheck, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import api from "../lib/api";
import { toast } from "sonner";

export default function VerifyEmailSent() {
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const [params] = useSearchParams();
    const email = params.get("email"); // optional but useful if sent

    const handleResend = async () => {
        if (cooldown > 0) return;

        setLoading(true);
        try {
            await api.post("/api/auth/resend-verification", { email });
            toast.success("Verification email sent again!");
            setCooldown(30); // 30-second cooldown

            const interval = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (e) {
            toast.error(
                e?.response?.data?.message ||
                    "Could not resend verification email"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <MailCheck className="w-16 h-16 text-indigo-500 mb-4" />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Check your email 📩
            </h1>

            <p className="text-gray-700 dark:text-gray-300 mt-2 max-w-md">
                We’ve sent a verification link to your inbox. Please open it to
                activate your account.
            </p>

            {/* RESEND BUTTON */}
            <button
                onClick={handleResend}
                disabled={loading || cooldown > 0}
                className="
                    mt-6 px-6 py-2 rounded-xl
                    bg-indigo-600 text-white
                    hover:bg-indigo-700 transition
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-2
                "
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    "Resend Email"
                )}
                {cooldown > 0 && <span>({cooldown}s)</span>}
            </button>

            <Link
                to="/login"
                className="mt-4 text-indigo-500 hover:underline text-sm"
            >
                Back to Login
            </Link>
        </div>
    );
}
