import React, { useState } from "react";
import InputField from "../components/ui/InputField";
import SubmitButton from "../components/ui/SubmitButton";
import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const Signup = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [showResend, setShowResend] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const { signup, resendVerification, authLoading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ============================
    //      HANDLE SIGNUP
    // ============================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({ name: "", email: "", password: "" });
        setShowResend(false);

        let valid = true;

        if (!form.name.trim()) {
            setErrors((prev) => ({ ...prev, name: "Name is required" }));
            valid = false;
        }

        if (!form.email.trim()) {
            setErrors((prev) => ({ ...prev, email: "Email is required" }));
            valid = false;
        }

        if (!form.password.trim()) {
            setErrors((prev) => ({
                ...prev,
                password: "Password is required",
            }));
            valid = false;
        }

        if (!valid) return;

        try {
            await signup(form.name, form.email, form.password);

            toast.success("Account created! Please verify your email");
            navigate(`/verify-email-sent?email=${form.email}`);
        } catch (err) {
            toast.error(err.message);

            if (err.unverified) {
                setShowResend(true);
            }
        }
    };

    // ============================
    //   HANDLE RESEND EMAIL
    // ============================
    const handleResend = async () => {
        try {
            setResendLoading(true);

            const message = await resendVerification(form.email);
            toast.success(message);

            navigate(`/verify-email-sent?email=${form.email}`);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setResendLoading(false);
        }
    };

    // ============================
    //       GOOGLE SIGNUP
    // ============================
    const handleGoogleSignup = () => {
        window.location.href = `${
            import.meta.env.VITE_API_URL
        }/api/auth/google`;
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 relative">
            {/* Theme Toggle */}
            <div className="absolute top-4 right-4 z-20">
                <ThemeToggle />
            </div>

            {/* Left Branding Panel */}
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-b from-purple-600 via-indigo-600 to-blue-600">
                <img
                    src="/img/linkhub_light.png"
                    className="w-40 drop-shadow-xl dark:hidden"
                    alt="LinkHub Logo"
                />
                <img
                    src="/img/linkhub_dark.png"
                    className="w-40 drop-shadow-xl hidden dark:block"
                    alt="LinkHub Logo"
                />
            </div>

            {/* Right Panel */}
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

                    <h1 className="text-3xl font-bold mb-2">
                        Create your account ✨
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        Join LinkHub and build your smart profile
                    </p>

                    {/* FORM */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <InputField
                            label="Name"
                            type="text"
                            name="name"
                            icon={User}
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                        />

                        <InputField
                            label="Email"
                            type="email"
                            name="email"
                            icon={Mail}
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            name="password"
                            icon={Lock}
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            error={errors.password}
                        />

                        <SubmitButton
                            text="Create Account"
                            fullWidth
                            loading={authLoading}
                        />
                    </form>

                    {/* RESEND VERIFICATION BLOCK */}
                    {showResend && (
                        <div className="mt-4 text-center">
                            <p className="text-red-500 text-sm mb-2">
                                This email is already registered but not
                                verified.
                            </p>

                            <SubmitButton
                                text="Resend Verification Email"
                                fullWidth
                                size="sm"
                                loading={resendLoading}
                                onClick={handleResend}
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

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleSignup}
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

                    {/* Footer */}
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
