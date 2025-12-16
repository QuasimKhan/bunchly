import React, { useState } from "react";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { Mail, Lock, User, EyeClosed, Eye, EyeIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const Signup = () => {
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    //username
    const [usernameStatus, setUsernameStatus] = useState(null);
    // null | "checking" | "available" | "taken" | "invalid" | "reserved"

    let usernameTimer = null;

    const [showResend, setShowResend] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { signup, resendVerification, authLoading } = useAuth();
    const navigate = useNavigate();

    const checkUsername = async (value) => {
        if (!value.trim()) {
            setUsernameStatus(null);
            return;
        }

        setUsernameStatus("checking");

        try {
            const res = await fetch(
                `${
                    import.meta.env.VITE_API_URL
                }/api/auth/check-username?username=${value}`
            );

            const data = await res.json();

            if (!data.success && data.message.includes("Invalid")) {
                setUsernameStatus("invalid");
                return;
            }

            if (!data.success && data.message.includes("reserved")) {
                setUsernameStatus("reserved");
                return;
            }

            setUsernameStatus(data.available ? "available" : "taken");
        } catch {
            setUsernameStatus("invalid");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));

        if (name === "username") {
            clearTimeout(usernameTimer);
            const clean = value.toLowerCase().trim();

            usernameTimer = setTimeout(() => {
                checkUsername(clean);
            }, 500); // debounce
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ name: "", username: "", email: "", password: "" });
        setShowResend(false);

        let valid = true;
        if (!form.name.trim()) {
            setErrors((p) => ({ ...p, name: "Name is required" }));
            valid = false;
        }
        if (!form.username.trim()) {
            setErrors((p) => ({ ...p, username: "Username is required" }));
            valid = false;
        } else if (usernameStatus !== "available") {
            setErrors((p) => ({
                ...p,
                username: "Choose a valid available username",
            }));
            valid = false;
        }

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
            await signup({
                name: form.name,
                username: form.username,
                email: form.email,
                password: form.password,
            });

            toast.success("Account created! Please verify your email");
            navigate(
                `/verify-email-sent?email=${encodeURIComponent(
                    form.email.trim()
                )}`
            );
        } catch (err) {
            toast.error(err?.message || "Signup failed");
            if (err?.unverified) setShowResend(true);
        }
    };

    const handleResend = async () => {
        try {
            setResendLoading(true);
            const msg = await resendVerification(form.email.trim());
            toast.success(msg || "Verification link sent");
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

    const handleGoogleSignup = () => {
        setGoogleLoading(true);
        window.location.href = `${
            import.meta.env.VITE_API_URL
        }/api/auth/google`;
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 relative">
            <div className="absolute top-4 right-4 z-20">
                <ThemeToggle />
            </div>

            {/* LEFT BRANDING PANEL */}
            <div className="hidden lg:flex flex-col justify-between relative bg-[#0F0F14] dark:bg-black px-12 py-16 overflow-hidden">
                {/* Animated Background Glows */}
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

                {/* Main Title + Marketing Highlights */}
                <div className="flex">
                    <div className="relative z-20 mt-10 animate-slide-up">
                        <h1 className="text-4xl font-bold tracking-tight text-white leading-snug">
                            Build Your <br />
                            <span className="text-indigo-400">
                                Smart Profile
                            </span>
                            <br />
                            In Minutes 🚀
                        </h1>

                        <p className="text-gray-300 text-lg mt-4 max-w-sm">
                            Showcase your identity with a clean, modern and
                            powerful Bunchly page.
                        </p>

                        {/* Marketing Highlights */}
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-3 text-gray-300">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                                Fully customizable profile & links
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                Track clicks & audience insights
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                Share everywhere with one smart link
                            </div>
                        </div>
                    </div>

                    {/* Phone Mockup Preview */}
                    <div className=" z-20 animate-float">
                        <img
                            src="/img/mockup_phone.png"
                            alt="Bunchly Preview"
                            className="w-64 drop-shadow-2xl rounded-3xl border border-white/10"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-20 text-gray-400 text-sm mt-auto animate-fade-in">
                    © {new Date().getFullYear()} Bunchly. All rights reserved.
                </div>
            </div>

            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-300 dark:border-gray-700 rounded-2xl p-8 shadow-xl text-center">
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

                    <h1 className="text-3xl font-bold mb-2">
                        Create your account ✨
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        Join Bunchly and build your smart profile
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <InputField
                            label="Username"
                            icon={User}
                            type="text"
                            name="username"
                            placeholder="yourusername"
                            value={form.username}
                            onChange={handleChange}
                            error={errors.username}
                        />

                        {/* Username Status Messaging (PREMIUM UI) */}
                        {usernameStatus === "checking" && (
                            <div
                                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm 
                        px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/30 
                        border border-blue-200 dark:border-blue-800 animate-fade-in"
                            >
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                                Checking availability...
                            </div>
                        )}

                        {usernameStatus === "available" && (
                            <div
                                className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm 
                        px-3 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 
                        border border-green-200 dark:border-green-800 animate-fade-in"
                            >
                                <span>✓</span>
                                Username is available
                            </div>
                        )}

                        {usernameStatus === "taken" && (
                            <div
                                className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm 
                        px-3 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 
                        border border-red-200 dark:border-red-800 animate-fade-in"
                            >
                                <span>✗</span>
                                Username already taken
                            </div>
                        )}

                        {usernameStatus === "invalid" && (
                            <div
                                className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 text-sm 
                        px-3 py-1 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 
                        border border-yellow-300 dark:border-yellow-800 animate-fade-in"
                            >
                                ⚠ Username must be 3–20 characters (letters,
                                numbers, . _ -)
                            </div>
                        )}

                        {usernameStatus === "reserved" && (
                            <div
                                className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-sm 
                        px-3 py-1 rounded-lg bg-orange-50 dark:bg-orange-900/20 
                        border border-orange-200 dark:border-orange-800 animate-fade-in"
                            >
                                🔒 This username is reserved
                            </div>
                        )}

                        <InputField
                            label="Name"
                            icon={User}
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                        />
                        <InputField
                            label="Email"
                            icon={Mail}
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}
                        />
                        <InputField
                            label="Password"
                            icon={Lock}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            error={errors.password}
                            eye={showPassword ? EyeClosed : EyeIcon}
                            onClick={() => setShowPassword(!showPassword)}
                        />
                        <Button
                            text="Create Account"
                            fullWidth
                            type="submit"
                            loading={authLoading}
                        />
                    </form>

                    {showResend && (
                        <div className="mt-4 text-center">
                            <p className="text-red-500 text-sm mb-2">
                                This email is already registered but not
                                verified.
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

                    <div className="my-6 flex items-center justify-center gap-3">
                        <span className="h-px w-20 bg-gray-300 dark:bg-gray-600" />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                            Or continue with
                        </span>
                        <span className="h-px w-20 bg-gray-300 dark:bg-gray-600" />
                    </div>

                    <button
                        onClick={handleGoogleSignup}
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
                        Already have an account?
                        <Link
                            to="/login"
                            className="ml-1 text-indigo-500 hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
