import React, { useState } from "react";
import InputField from "../components/ui/InputField";
import { Lock, Mail } from "lucide-react";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [showResend, setShowResend] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const { login, resendVerification, authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = new URLSearchParams(location.search).get("redirect");

    const handleChange = (e) =>
        setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

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
            const success = await login(form.email.trim(), form.password);
            toast.success("Logged in successfully");
            if (success) {
                if (redirectTo && redirectTo.startsWith("/")) {
                    navigate(redirectTo, { replace: true });
                } else {
                    navigate("/dashboard", { replace: true });
                }
            }
        } catch (err) {
            const message = err?.message || "Login failed";
            const unverified = !!err?.unverified;
            toast.error(message);
            if (unverified) setShowResend(true);
        }
    };

    const handleResend = async () => {
        try {
            setResendLoading(true);
            const msg = await resendVerification(form.email.trim());
            toast.success(msg || "Verification email sent");
            setShowResend(false);
            navigate(
                `/verify-email-sent?email=${encodeURIComponent(
                    form.email.trim()
                )}`
            );
        } catch (err) {
            toast.error(err?.message || "Failed to resend");
        } finally {
            setResendLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setGoogleLoading(true);
        window.location.href = `${
            import.meta.env.VITE_API_URL
        }/api/auth/google`;
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 relative">
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            {/* LEFT PANEL — EXACT MATCH WITH SIGNUP */}
            <div className="hidden lg:flex flex-col justify-between relative bg-[#0F0F14] dark:bg-black px-12 py-16 overflow-hidden">
                {/* Glowing Background Animations */}
                <div className="absolute inset-0">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
                </div>

                {/* Logo */}
                <div className="relative z-20 flex items-center animate-fade-in">
                    <img
                        src="/img/Bunchly-light.png"
                        alt="Bunchly"
                        className="w-44 drop-shadow-2xl dark:hidden"
                    />
                    <img
                        src="/img/Bunchly-dark.png"
                        alt="Bunchly"
                        className="w-44 drop-shadow-2xl hidden dark:block"
                    />
                </div>

                {/* Title & Text */}
                <div className="relative z-20 mt-10 animate-slide-up">
                    <h1 className="text-4xl font-bold tracking-tight text-white leading-snug">
                        Welcome Back to
                        <br />
                        <span className="text-indigo-400">
                            Your Smart Profile
                        </span>
                    </h1>

                    <p className="text-gray-300 text-lg mt-4 max-w-sm">
                        Manage your links, grow your digital presence, and share
                        everything that matters — beautifully and effortlessly.
                    </p>
                </div>

                {/* Phone Mockup */}
                <div className="relative z-20 mt-10 flex justify-center animate-float">
                    <img
                        src="/img/mockup_phone.png"
                        alt="Bunchly Preview"
                        className="w-64 drop-shadow-2xl rounded-3xl border border-white/10"
                    />
                </div>

                <div className="relative z-20 text-gray-400 text-sm mt-auto">
                    © {new Date().getFullYear()} Bunchly. All rights reserved.
                </div>
            </div>

            {/* RIGHT PANEL — FORM */}
            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-300 dark:border-gray-700 rounded-2xl p-8 shadow-xl text-center">
                    {/* Logo (mobile only) */}
                    <img
                        src="/img/Bunchly-light.png"
                        alt="Bunchly"
                        className="w-28 mx-auto mb-4 block dark:hidden"
                    />
                    <img
                        src="/img/Bunchly-dark.png"
                        alt="Bunchly"
                        className="w-28 mx-auto mb-4 hidden dark:block"
                    />

                    <h1 className="text-3xl font-bold mb-2">Welcome Back 👋</h1>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        Login to your Bunchly account
                    </p>

                    {/* FORM */}
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

                        <Button
                            text="Login"
                            fullWidth
                            size="md"
                            type="submit"
                            loading={authLoading}
                        />
                    </form>

                    {/* RESEND VERIFICATION */}
                    {showResend && (
                        <div className="mt-4 text-center">
                            <p className="text-sm text-red-500 mb-2">
                                Your email is not verified.
                            </p>

                            <Button
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
                        <span className="h-px w-20 bg-gray-300 dark:bg-gray-600" />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                            Or continue with
                        </span>
                        <span className="h-px w-20 bg-gray-300 dark:bg-gray-600" />
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-2 rounded-xl bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center gap-3 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
                        disabled={googleLoading}
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            className="w-5 h-5"
                        />
                        {googleLoading
                            ? "Redirecting..."
                            : "Continue with Google"}
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
