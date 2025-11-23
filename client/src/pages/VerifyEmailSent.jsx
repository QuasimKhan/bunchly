import { MailCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { toast } from "sonner";
import { useState } from "react";
import api from "../lib/api";

export default function VerifyEmailSent() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const email = params.get("email") || "";

    const [cooldown, setCooldown] = useState(0);
    const [loading, setLoading] = useState(false);

    // ================================
    //        RESEND VERIFICATION
    // ================================
    const handleResend = async () => {
        if (cooldown > 0) return; // Prevent multiple clicks

        setLoading(true);
        try {
            await api.post("/api/auth/resend-verification", { email });

            toast.success("Verification email sent again!");

            // Start 30s cooldown
            setCooldown(30);
            const timer = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
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
                We’ve sent a verification link to{" "}
                <strong>{email || "your email"}</strong>. <br />
                Please open it to activate your account.
                <br />
                The link expires in 10 minutes.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                {/* Back to Login */}
                <Button
                    text="Back to Login"
                    fullWidth
                    size="md"
                    onClick={() => navigate("/login")}
                />

                {/* Resend Button */}
                <Button
                    text={
                        cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Email"
                    }
                    fullWidth
                    size="md"
                    variant="primary"
                    loading={loading}
                    onClick={handleResend}
                    disabled={cooldown > 0}
                />
            </div>
        </div>
    );
}
