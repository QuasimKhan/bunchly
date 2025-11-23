import React, { useState } from "react";
import InputField from "../components/ui/InputField";
import { Lock, Mail } from "lucide-react";
import SubmitButton from "../components/ui/SubmitButton";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [showResend, setShowResend] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const { login, resendVerification, authLoading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ============================
    //         HANDLE LOGIN
    // ============================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({ email: "", password: "" });
        setShowResend(false);

        let valid = true;

        if (!form.email.trim()) {
            setErrors((p) => ({ ...p, email: "Email is required" }));
            valid = false;
        }

        if (!form.password.trim()) {
            setErrors((p) => ({ ...p, password: "Password is required" }));
            valid = false;
        }

        if (!valid) return;

        try {
            await login(form.email, form.password);

            toast.success("Logged in successfully");
            navigate("/dashboard");
        } catch (err) {
            const message =
                err?.response?.data?.message || err?.message || "Login failed";

            const unverified =
                err?.response?.data?.unverified || err?.unverified || false;

            toast.error(message);

            if (unverified) {
                setShowResend(true);
            }
        }
    };

    // ============================
    //   RESEND VERIFICATION EMAIL
    // ============================
    const handleResend = async () => {
        try {
            setResendLoading(true);
            const msg = await resendVerification(form.email);

            toast.success(msg);
            setShowResend(false);
        } catch (err) {
            toast.error(err?.message || "Failed to resend");
        } finally {
            setResendLoading(false);
        }
    };

    // ============================
    //      GOOGLE LOGIN
    // ============================
    const handleGoogleLogin = () => {
        window.location.href = `${
            import.meta.env.VITE_API_URL
        }/api/auth/google`;
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 relative">
            {/* Theme Toggle */}
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            {/* Left Branding Panel */}
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-b from-purple-600 via-indigo-600 to-blue-600 p-10">
                <img
                    src="/img/linkhub_light.png"
                    className="w-40 drop-shadow-lg dark:hidden"
                    alt="LinkHub Logo"
                />
                <img
                    src="/img/linkhub_dark.png"
                    className="w-40 drop-shadow-lg hidden dark:block"
                    alt="LinkHub Logo"
                />
            </div>

            {/* Right Form Panel */}
            <div className="flex items-center justify-center p-6">
                <div
                    className="
                    w-full max-w-md
                    bg-white/40 dark:bg-gray-800/40
                    backdrop-blur-xl
                    border border-gray-300 dark:border-gray-700
                    rounded-2xl p-8 shadow-xl
                    text-center
                "
                >
                    {/* Mobile Logo */}
                    <img
                        src="/img/linkhub_light.png"
                        alt="LinkHub"
                        className="w-28 mx-auto mb-4 block dark:hidden"
                    />
                    <img
                        src="/img/linkhub_dark.png"
                        alt="LinkHub"
                        className="w-28 mx-auto mb-4 hidden dark:block"
                    />

                    <h1 className="text-3xl font-bold mb-2">Welcome Back 👋</h1>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        Login to your LinkHub account
                    </p>

                    {/* LOGIN FORM */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <InputField
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            icon={Mail}
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            icon={Lock}
                            value={form.password}
                            onChange={handleChange}
                            error={errors.password}
                        />

                        <SubmitButton
                            text="Login"
                            fullWidth
                            size="md"
                            loading={authLoading}
                        />
                    </form>

                    {/* RESEND VERIFICATION BLOCK */}
                    {showResend && (
                        <div className="mt-4 text-center">
                            <p className="text-sm text-red-500 mb-2">
                                Your email is not verified.
                            </p>

                            <SubmitButton
                                text="Resend Verification Email"
                                fullWidth
                                size="sm"
                                onClick={handleResend}
                                loading={resendLoading}
                            />
                        </div>
                    )}

                    {/* Divider */}
                    <div className="my-6 flex items-center justify-center gap-3">
                        <span className="h-px w-20 bg-gray-300 dark:bg-gray-600"></span>
                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                            Or continue with
                        </span>
                        <span className="h-px w-20 bg-gray-300 dark:bg-gray-600"></span>
                    </div>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        className="
                            w-full py-2 rounded-xl
                            bg-gray-200 dark:bg-gray-700
                            border border-gray-300 dark:border-gray-600
                            flex items-center justify-center gap-3
                            hover:bg-gray-300 dark:hover:bg-gray-600
                            transition cursor-pointer
                        "
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-6">
                        Don’t have an account?
                        <Link
                            to="/signup"
                            className="ml-1 text-indigo-500 hover:underline"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
