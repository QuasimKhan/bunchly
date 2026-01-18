import { useState, useEffect, useRef } from "react";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { Mail, Lock, User, EyeClosed, EyeIcon, ArrowRight, Sparkles, Check, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useSEO } from "../hooks/useSEO";
import { buildUrl } from "../lib/seo";
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
    const navigate = useNavigate();
    const location = useLocation();

    /* ---------------- Claim Username ---------------- */
    const suggestedUsername = location.state?.suggestedUsername || "";

    /* ---------------- Form State ---------------- */
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    /* ---------------- Username Status ---------------- */
    const [usernameStatus, setUsernameStatus] = useState(null); // null, "checking", "available", "taken", "reserved", "invalid"
    const usernameTimer = useRef(null);
    const abortController = useRef(null);

    /* ---------------- UI State ---------------- */
    const [showResend, setShowResend] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showcaseUsers, setShowcaseUsers] = useState([]);

    /* ---------------- Password Strength ---------------- */
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        hasLower: false,
        hasUpper: false,
        hasNumber: false,
        hasSpecial: false,
    });

    const checkStrength = (pass) => {
        const hasLower = /[a-z]/.test(pass);
        const hasUpper = /[A-Z]/.test(pass);
        const hasNumber = /\d/.test(pass);
        const hasSpecial = /[@$!%*?&]/.test(pass);
        const isLongEnough = pass.length >= 8;

        let score = 0;
        if (isLongEnough) score++;
        if (hasLower) score++;
        if (hasUpper) score++;
        if (hasNumber) score++;
        if (hasSpecial) score++;

        setPasswordStrength({ score, hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough });
    };

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

    const { signup, resendVerification, authLoading } = useAuth();

    /* ---------------- SEO ---------------- */
    useSEO({
        title: "Create Account – Bunchly",
        description: "Create your Bunchly account.",
        noIndex: true,
        url: buildUrl("/signup"),
    });

    /* ---------------- Username Check ---------------- */
    const checkUsername = async (value) => {
        // Cancel previous request
        if (abortController.current) {
            abortController.current.abort();
        }

        if (!value) {
            setUsernameStatus(null);
            return;
        }

        setUsernameStatus("checking");

        // Create new controller
        abortController.current = new AbortController();

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/check-username?username=${value}`,
                { signal: abortController.current.signal }
            );
            const data = await res.json();

            if (!data.success && data.message?.includes("Invalid")) {
                setUsernameStatus("invalid");
                return;
            }

            if (!data.success && data.message?.includes("reserved")) {
                setUsernameStatus("reserved");
                return;
            }

            setUsernameStatus(data.available ? "available" : "taken");
        } catch (error) {
            if (error.name === "AbortError") return; // Ignore aborted requests
            setUsernameStatus("invalid");
        }
    };

    /* ---------------- Prefill Username ---------------- */
    useEffect(() => {
        if (suggestedUsername) {
            const clean = suggestedUsername.toLowerCase();
            setForm((prev) => ({ ...prev, username: clean }));
            checkUsername(clean);
        }
    }, [suggestedUsername]);

    /* ---------------- Handle Change ---------------- */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === "username") {
            clearTimeout(usernameTimer.current);
            const clean = value.toLowerCase().trim();

            usernameTimer.current = setTimeout(() => {
                checkUsername(clean);
            }, 500);
        }

        if (name === "password") {
            checkStrength(value);
        }
    };

    /* ---------------- Submit ---------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ name: "", username: "", email: "", password: "", confirmPassword: "" });
        setShowResend(false);

        let valid = true;

        if (!form.name.trim()) {
            setErrors((p) => ({ ...p, name: "Name is required" }));
            valid = false;
        }

        if (!form.username.trim()) {
            setErrors((p) => ({ ...p, username: "Username is required" }));
            valid = false;
        } else if (usernameStatus === "checking") {
            setErrors((p) => ({ ...p, username: "Checking availability..." }));
            valid = false;
        } else if (usernameStatus !== "available") {
            setErrors((p) => ({ ...p, username: "Choose a valid available username" }));
            valid = false;
        }

        if (!form.email.trim()) {
            setErrors((p) => ({ ...p, email: "Email is required" }));
            valid = false;
        }

        if (!form.password.trim()) {
            setErrors((p) => ({ ...p, password: "Password is required" }));
            valid = false;
        } else if (passwordStrength.score < 5) { // Needs all 5 checks
             setErrors((p) => ({ ...p, password: "Password is too weak" }));
             valid = false;
        }

        if (form.password !== form.confirmPassword) {
            setErrors((p) => ({ ...p, confirmPassword: "Passwords do not match" }));
            valid = false;
        }

        if (!valid) return;

        try {
            const data = await signup({
                name: form.name,
                username: form.username,
                email: form.email,
                password: form.password,
                confirmPassword: form.confirmPassword, // Pass confirmPassword
            });

            if (data.success) {
                navigate(
                    `/verify-email-sent?email=${encodeURIComponent(
                        form.email
                    )}`
                );
            }
        } catch (err) {
            toast.error(err?.message || "Signup failed");
            if (err?.unverified) setShowResend(true);
        }
    };

    /* ---------------- Resend ---------------- */
    const handleResend = async () => {
        try {
            setResendLoading(true);
            const msg = await resendVerification(form.email.trim());
            toast.success(msg || "Verification link sent");
            navigate(`/verify-email-sent?email=${encodeURIComponent(form.email.trim())}`);
        } catch (err) {
            toast.error(err?.message || "Failed to resend");
        } finally {
            setResendLoading(false);
        }
    };

    /* ---------------- Google Signup ---------------- */
    const handleGoogleSignup = () => {
        setGoogleLoading(true);
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
    };

    /* ---------------- Components: Strength Item ---------------- */
    const StrengthItem = ({ fulfilled, text }) => (
        <div className={`flex items-center gap-2 text-xs transition-colors duration-300 ${fulfilled ? "text-emerald-500" : "text-neutral-400"}`}>
            {fulfilled ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-neutral-300 dark:border-neutral-600" />}
            <span>{text}</span>
        </div>
    );

    return (
        <div className="min-h-[100dvh] w-full flex flex-col lg:grid lg:grid-cols-2 bg-white dark:bg-black overflow-hidden relative">
            
            {/* THEME TOGGLE (Absolute Top Right) */}
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            {/* LEFT PANEL (Branding - Hidden on Mobile, Visible on Desktop) */}
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
                    
                    <h1 className="text-5xl font-bold tracking-tight mb-6 leading-[1.15]">
                        Claim your corner <br/>
                        of the internet.
                    </h1>
                    <p className="text-lg text-neutral-400 leading-relaxed mb-8">
                        The only link-in-bio tool you'll ever need. Beautiful, fast, and feature-packed profiles designed to convert.
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
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Create account</h2>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Start building your page for free. No credit card required.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <InputField
                                label="Claim Username"
                                icon={User}
                                type="text"
                                name="username"
                                placeholder="bunchly.in/username"
                                value={form.username}
                                onChange={handleChange}
                                error={errors.username}
                                className="!pl-10"
                            />
                            
                            {/* Status Indicator */}
                            <div className="mt-2 min-h-[20px] transition-all">
                                {usernameStatus === "checking" && (
                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-blue-500 flex items-center gap-1.5 font-medium"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"/>Checking...</motion.span>
                                )}
                                {usernameStatus === "available" && (
                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-emerald-500 flex items-center gap-1.5 font-medium">✓ Available</motion.span>
                                )}
                                {usernameStatus === "taken" && (
                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-500 flex items-center gap-1.5 font-medium">✗ Taken</motion.span>
                                )}
                                {usernameStatus === "reserved" && (
                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-purple-500 flex items-center gap-1.5 font-medium">⚠ Reserved</motion.span>
                                )}
                                {usernameStatus === "invalid" && (
                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-amber-500 flex items-center gap-1.5 font-medium">⚠ Invalid format</motion.span>
                                )}
                            </div>
                        </div>

                        <InputField
                            label="Full Name"
                            icon={null}
                            type="text"
                            name="name"
                            placeholder="e.g. Alex Smith"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                        />

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
                                placeholder="Create a strong password"
                                value={form.password}
                                onChange={handleChange}
                                error={errors.password}
                                eye={showPassword ? EyeClosed : EyeIcon}
                                onClick={() => setShowPassword(!showPassword)}
                            />

                            {/* Password Strength Meter - Only show if typing */}
                            <AnimatePresence>
                                {form.password.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 bg-neutral-50 dark:bg-white/5 rounded-lg p-3 overflow-hidden"
                                    >
                                        <div className="flex gap-1 mb-2">
                                            {[1,2,3,4,5].map(step => (
                                                <div 
                                                    key={step} 
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                        passwordStrength.score >= step 
                                                            ? (passwordStrength.score < 3 ? 'bg-red-500' : (passwordStrength.score < 5 ? 'bg-amber-500' : 'bg-emerald-500'))
                                                            : 'bg-neutral-200 dark:bg-neutral-700'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <StrengthItem fulfilled={passwordStrength.isLongEnough} text="8+ Characters" />
                                            <StrengthItem fulfilled={passwordStrength.hasUpper} text="Uppercase (A-Z)" />
                                            <StrengthItem fulfilled={passwordStrength.hasLower} text="Lowercase (a-z)" />
                                            <StrengthItem fulfilled={passwordStrength.hasNumber} text="Number (0-9)" />
                                            <StrengthItem fulfilled={passwordStrength.hasSpecial} text="Symbol (!@#$)" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div>
                            <InputField
                                label="Confirm Password"
                                icon={Lock}
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                eye={showConfirmPassword ? EyeClosed : EyeIcon}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                            {form.confirmPassword && form.password === form.confirmPassword && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-emerald-500 font-medium mt-1 flex items-center gap-1"
                                >
                                    <Check className="w-3 h-3" /> Passwords match
                                </motion.p>
                            )}
                        </div>

                        <Button
                            text="Create Account"
                            fullWidth
                            type="submit"
                            loading={authLoading}
                            className="h-12 text-base active:scale-[0.98] transition-all" // REMOVED SHADOWS
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
                        onClick={handleGoogleSignup}
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
                        Already have an account?{" "}
                        <Link to={`/login${location.search}`} className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
                            Sign In
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

export default Signup;
