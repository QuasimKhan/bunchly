import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import api from "../lib/api";

export default function VerifyEmail() {
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");
    const [canResend, setCanResend] = useState(false);
    const [params] = useSearchParams();
    const token = params.get("token");
    const uid = params.get("uid");
    const navigate = useNavigate();

    useEffect(() => {
        async function verify() {
            if (!token || !uid) {
                setStatus("error");
                setMessage("Invalid verification link");
                return;
            }
            try {
                const res = await api.get(
                    `/api/auth/verify?token=${token}&uid=${uid}`
                );
                setStatus("success");
                setMessage(res.data?.message || "Email verified");
                // auto-redirect to login after 3s
                setTimeout(() => navigate("/login"), 3000);
            } catch (error) {
                const msg =
                    error?.response?.data?.message || "Verification failed";
                setMessage(msg);
                setStatus("error");
                // if token expired or unused -> allow resend
                const unverified = error?.response?.data?.unverified || false;
                const expired = error?.response?.status === 400 || false;
                if (unverified || expired) setCanResend(true);
            }
        }
        verify();
    }, [token, uid]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            {status === "loading" && (
                <>
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                        Verifying your email…
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Please wait a moment.
                    </p>
                </>
            )}

            {status === "success" && (
                <>
                    <CheckCircle className="w-14 h-14 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Email Verified 🎉
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        {message}
                    </p>
                    <Link
                        to="/login"
                        className="mt-6 inline-block px-6 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md"
                    >
                        Go to Login
                    </Link>
                </>
            )}

            {status === "error" && (
                <>
                    <XCircle className="w-14 h-14 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Verification Failed ❌
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        {message}
                    </p>

                    <div className="mt-6 flex flex-col items-center gap-3">
                        <Link
                            to="/login"
                            className="inline-block px-6 py-2 rounded-xl bg-gray-300 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
                        >
                            Back to Login
                        </Link>
                        {canResend && (
                            <Link
                                to={`/verify-email-sent?email=${
                                    params.get("email") || ""
                                }`}
                                className="text-indigo-500 hover:underline text-sm"
                            >
                                Request a new verification email
                            </Link>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
