import { useState, useEffect } from "react";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { Mail, Lock, EyeClosed, EyeIcon, ArrowRight, Sparkles } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useSEO } from "../hooks/useSEO";
import { buildUrl } from "../lib/seo";
import { motion } from "framer-motion";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = new URLSearchParams(location.search).get("redirect");

    /* ---------------- Form State ---------------- */
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });
    
    /* ---------------- UI State ---------------- */
    const [showResend, setShowResend] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showcaseUsers, setShowcaseUsers] = useState([]);

    const { login, resendVerification, authLoading } = useAuth();

    /* ---------------- SEO ---------------- */
    useSEO({
        title: "Login – Bunchly",
        description: "Login to your Bunchly account.",
        noIndex: true,
        url: buildUrl("/login"),
    });

    /* ---------------- Fetch Showcase ---------------- */
    useEffect(() => {
        const fetchShowcase = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/showcase`);
                const data = await res.json();
                if (data.success && data.users?.length > 0) {
                    setShowcaseUsers(data.users);
                } else {
                    setShowcaseUsers([
                        { _id: 1, image: "https://i.pravatar.cc/100?img=10" },
                        { _id: 2, image: "https://i.pravatar.cc/100?img=11" },
                        { _id: 3, image: "https://i.pravatar.cc/100?img=12" },
                        { _id: 4, image: "https://i.pravatar.cc/100?img=13" },
                    ]);
                }
            } catch (err) {
                 setShowcaseUsers([
                    { _id: 1, image: "https://i.pravatar.cc/100?img=10" },
                    { _id: 2, image: "https://i.pravatar.cc/100?img=11" },
                    { _id: 3, image: "https://i.pravatar.cc/100?img=12" },
                    { _id: 4, image: "https://i.pravatar.cc/100?img=13" },
                ]);
            }
        };
        fetchShowcase();
    }, []);

    /* ---------------- Handlers ---------------- */
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
            toast.success("Welcome back!");
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
            navigate(`/verify-email-sent?email=${encodeURIComponent(form.email.trim())}`);
        } catch (err) {
            toast.error(err?.message || "Failed to resend");
        } finally {
            setResendLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setGoogleLoading(true);
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
    };

    return (
        <div className="min-h-[100dvh] w-full flex flex-col lg:grid lg:grid-cols-2 bg-white dark:bg-black overflow-hidden relative">
            
            {/* THEME TOGGLE */}
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            {/* LEFT PANEL (Branding) */}
            <div className="hidden lg:flex relative flex-col justify-between bg-[#0F0F14] text-white p-12 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
                        className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
                    />
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}
                        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"
                    />
                    <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-20"></div>
                </div>

                {/* Logo */}
                <Link to="/" className="relative z-10 w-fit">
                    <img src="/img/Bunchly-dark.png" alt="Bunchly" className="h-10 w-auto" />
                </Link>

                {/* Hero Content */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 max-w-lg mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6 text-sm font-medium text-indigo-300">
                        <Sparkles className="w-4 h-4" />
                        <span>Welcome Back</span>
                    </div>
                    
                    <h1 className="text-5xl font-bold tracking-tight mb-6 leading-[1.15]">
                        Your audience is <br/>
                        waiting for you.
                    </h1>
                    <p className="text-lg text-neutral-400 leading-relaxed mb-8">
                        Continue building your digital empire. Monitor analytics, update your links, and grow your brand.
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {showcaseUsers.slice(0, 4).map((user, idx) => (
                                <motion.div 
                                    key={user._id} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (idx * 0.1) }}
                                    className={`w-10 h-10 rounded-full border-2 border-[#0F0F14] bg-neutral-800 flex items-center justify-center text-xs overflow-hidden`}
                                >
                                    <img 
                                        src={user.image} 
                                        alt={user.username || "User"} 
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            ))}
                        </div>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                            className="text-sm font-medium text-neutral-300"
                        >
                            Trusted by top creators
                        </motion.div>
                    </div>
                </motion.div>

                {/* Copyright */}
                <div className="relative z-10 text-neutral-500 text-sm">
                    © {new Date().getFullYear()} Bunchly Inc.
                </div>
            </div>

            {/* RIGHT PANEL (Form) */}
            <div className="relative flex-1 flex flex-col justify-center px-4 sm:px-12 py-12 lg:px-20 bg-white dark:bg-neutral-950 overflow-hidden isolate">
                
                {/* Background Gradients (Mobile/Dark Mode) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse dark:block hidden" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse delay-700 dark:block hidden" />
                </div>

                {/* Mobile Header (Brand) */}
                <div className="lg:hidden flex justify-center mb-8">
                    <Link to="/">
                        <img src="/img/Bunchly-light.png" alt="Bunchly" className="h-8 dark:invert" />
                    </Link>
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-sm mx-auto"
                >
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Welcome Back</h2>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Enter your credentials to access your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField
                            label="Email"
                            icon={Mail}
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}
                        />

                        <div>
                            <InputField
                                label="Password"
                                icon={Lock}
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                error={errors.password}
                                eye={showPassword ? EyeClosed : EyeIcon}
                                onClick={() => setShowPassword(!showPassword)}
                            />
                            <div className="text-right mt-1">
                                <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            text="Sign In"
                            fullWidth
                            type="submit"
                            loading={authLoading}
                            className="h-12 text-base active:scale-[0.98] transition-all"
                            icon={ArrowRight}
                        />
                    </form>

                     {/* Resend Logic */}
                     {showResend && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 text-center"
                        >
                            <p className="text-red-600 dark:text-red-400 text-sm mb-3">
                                Account exists but not verified.
                            </p>
                            <Button
                                text="Resend Verification"
                                fullWidth
                                size="sm"
                                variant="outline"
                                onClick={handleResend}
                                loading={resendLoading}
                                className="!border-red-200 !text-red-600 hover:!bg-red-50"
                            />
                        </motion.div>
                    )}

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-black text-neutral-500">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all active:scale-[0.98] text-neutral-700 dark:text-neutral-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        {googleLoading ? (
                             <div className="w-5 h-5 border-2 border-neutral-400 border-t-neutral-900 dark:border-t-white rounded-full animate-spin"/>
                        ) : (
                            <>
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                                <span>Google</span>
                            </>
                        )}
                    </button>

                    <p className="mt-8 text-center text-sm text-neutral-500">
                        Don't have an account?{" "}
                        <Link to={`/signup${location.search}`} className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
                            Create free account
                        </Link>
                    </p>
                </motion.div>

                {/* Mobile Footer Links */}
                <div className="lg:hidden mt-12 text-center text-xs text-neutral-400 flex justify-center gap-4">
                    <Link to="/privacy">Privacy</Link>
                    <span>•</span>
                    <Link to="/terms">Terms</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
