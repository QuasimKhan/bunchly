import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, Loader2, ArrowRight, Moon, Sun } from "lucide-react";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // Theme toggle
    const toggleTheme = () => {
        const theme =
            document.documentElement.getAttribute("data-theme") === "dark"
                ? "light"
                : "dark";
        document.documentElement.setAttribute("data-theme", theme);
        toast.info(`${theme === "dark" ? "Dark" : "Light"} mode enabled`);
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            return toast.error("All fields are required.");
        }

        try {
            setLoading(true);
            await login(form.email, form.password);
            toast.success("Logged in successfully");
            navigate("/dashboard");
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Invalid credentials"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

        window.location.href = `${API_URL}/api/auth/google`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-base-200 relative transition-colors">
            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 btn btn-sm btn-ghost"
            >
                <Sun className="w-5 h-5 dark:hidden" />
                <Moon className="w-5 h-5 hidden dark:block" />
            </button>

            {/* Card */}
            <div className="card w-full max-w-md shadow-xl bg-base-100 p-8 border border-base-300 rounded-xl">
                {/* Title */}
                <h1 className="text-3xl font-bold text-center mb-2">
                    Welcome Back 👋
                </h1>
                <p className="text-center text-base-content/60 mb-6">
                    Login to your account to continue
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Email</span>
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-base-content/50" />
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="input input-bordered w-full pl-10"
                                required
                            />
                        </div>
                    </label>

                    {/* Password */}
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Password</span>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-base-content/50" />
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="input input-bordered w-full pl-10"
                                required
                            />
                        </div>
                    </label>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full mt-4"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            <>
                                Login
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="divider my-6">Or continue with</div>

                {/* Google Button */}
                <button
                    className="btn btn-outline w-full flex items-center gap-3"
                    onClick={handleGoogleLogin}
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Continue with Google
                </button>

                {/* Footer */}
                <p className="text-center text-sm mt-6 text-base-content/70">
                    Don’t have an account?
                    <a href="/signup" className="link link-primary ml-1">
                        Create one
                    </a>
                </p>
            </div>
        </div>
    );
}
