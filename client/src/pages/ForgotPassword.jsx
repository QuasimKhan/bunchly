import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Lock, KeyRound, CheckCircle2, Sparkles, EyeClosed, EyeIcon, Check } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "../components/ThemeToggle";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
    const [loading, setLoading] = useState(false);
    
    // Forms
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetToken, setResetToken] = useState(null);

    // UI States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showcaseUsers, setShowcaseUsers] = useState([]);

    const otpInputRefs = useRef([]);

    /* ---------------- Password Strength ---------------- */
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        hasLower: false,
        hasUpper: false,
        hasNumber: false,
        hasSpecial: false,
        isLongEnough: false
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

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setPassword(val);
        checkStrength(val);
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

    // ----------------------------------------------------------------------
    // STEP 1: SEND EMAIL
    // ----------------------------------------------------------------------
    const handleSendEmail = async (e) => {
        e.preventDefault();
        if (!email.trim()) return toast.error("Please enter your email");

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            
            if (data.success) {
                toast.success(data.message);
                setStep(2);
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (err) {
            toast.error("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------------------------------------------
    // STEP 2: VERIFY OTP
    // ----------------------------------------------------------------------
    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value.slice(0, 1); // Limit to 1 char
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Focus next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1].focus();
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpString = otp.join("");
        if (otpString.length !== 6) return toast.error("Please enter complete 6-digit code");

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpString }),
            });
            const data = await res.json();

            if (data.success) {
                setResetToken(data.resetToken);
                toast.success("Code verified successfully");
                setStep(3);
            } else {
                toast.error(data.message || "Invalid OTP");
            }
        } catch (err) {
            toast.error("Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------------------------------------------
    // STEP 3: RESET PASSWORD
    // ----------------------------------------------------------------------
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!password) return toast.error("Please enter a new password");
        if (passwordStrength.score < 5) return toast.error("Password is too weak. Please meet all requirements.");
        if (password !== confirmPassword) return toast.error("Passwords do not match");

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, resetToken }),
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Password reset successfully! Redirecting...");
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);
            } else {
                toast.error(data.message || "Failed to reset password");
            }
        } catch (err) {
            toast.error("Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------------------------------------------
    // COMPONENTS
    // ----------------------------------------------------------------------
    const StrengthItem = ({ fulfilled, text }) => (
        <div className={`flex items-center gap-2 text-xs transition-colors duration-300 ${fulfilled ? "text-emerald-500" : "text-neutral-400"}`}>
            {fulfilled ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-neutral-300 dark:border-neutral-600" />}
            <span>{text}</span>
        </div>
    );

    return (
        <div className="min-h-[100dvh] w-full flex flex-col lg:grid lg:grid-cols-2 bg-white dark:bg-black overflow-hidden relative">
            
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            {/* LEFT PANEL */}
            <div className="hidden lg:flex relative flex-col justify-between bg-[#0F0F14] text-white p-12 overflow-hidden">
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

                <Link to="/" className="relative z-10 w-fit">
                    <img src="/img/Bunchly-dark.png" alt="Bunchly" className="h-10 w-auto" />
                </Link>

                <div className="relative z-10 max-w-lg mb-20">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6 text-sm font-medium text-indigo-300">
                        <KeyRound className="w-4 h-4" />
                        <span>Secure Recovery</span>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight mb-6 leading-[1.15]">
                        Don't worry, <br/>
                        we've got you.
                    </h1>
                    <p className="text-lg text-neutral-400 leading-relaxed mb-8">
                        It happens to the best of us. Follow the steps to verify your identity and get back to building.
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
                </div>

                <div className="relative z-10 text-neutral-500 text-sm">
                    © {new Date().getFullYear()} Bunchly Inc.
                </div>
            </div>

            {/* RIGHT PANEL (WIZARD) */}
            <div className="relative flex-1 flex flex-col justify-center px-4 sm:px-12 py-12 lg:px-20 bg-white dark:bg-neutral-950">
                
                {/* Mobile Header */}
                <div className="lg:hidden flex justify-center mb-12">
                     <Link to="/">
                        <img src="/img/Bunchly-light.png" alt="Bunchly" className="h-8 dark:invert" />
                    </Link>
                </div>

                <div className="w-full max-w-sm mx-auto min-h-[400px]">
                    <AnimatePresence mode="wait">
                        
                        {/* ---------------- STEP 1: EMAIL ---------------- */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-8">
                                    <Link to="/login" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 mb-6 transition-colors">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Login
                                    </Link>
                                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Forgot Password?</h2>
                                    <p className="text-neutral-500 dark:text-neutral-400">
                                        Enter your email to receive a verification code.
                                    </p>
                                </div>

                                <form onSubmit={handleSendEmail} className="space-y-6">
                                    <InputField
                                        label="Email Address"
                                        icon={Mail}
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoFocus
                                    />
                                    <Button
                                        text="Send Code"
                                        fullWidth
                                        type="submit"
                                        loading={loading}
                                        className="h-12 text-base"
                                        icon={ArrowRight}
                                    />
                                </form>
                            </motion.div>
                        )}

                        {/* ---------------- STEP 2: OTP ---------------- */}
                        {step === 2 && (
                             <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-8">
                                    <button onClick={() => setStep(1)} className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 mb-6 transition-colors">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Change Email
                                    </button>
                                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Check your inbox</h2>
                                    <p className="text-neutral-500 dark:text-neutral-400">
                                        We sent a 6-digit code to <span className="text-neutral-900 dark:text-white font-medium">{email}</span>
                                    </p>
                                </div>

                                <form onSubmit={handleVerifyOtp} className="space-y-8">
                                    <div className="flex gap-2 justify-between">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => (otpInputRefs.current[index] = el)}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className="w-12 h-14 text-center text-2xl font-bold bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-neutral-900 dark:text-white"
                                            />
                                        ))}
                                    </div>
                                    <Button
                                        text="Verify & Continue"
                                        fullWidth
                                        type="submit"
                                        loading={loading}
                                        className="h-12 text-base"
                                    />
                                    <div className="text-center">
                                        <button 
                                            type="button"
                                            onClick={handleSendEmail}
                                            disabled={loading}
                                            className="text-sm text-indigo-600 hover:underline"
                                        >
                                            Resend code
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* ---------------- STEP 3: RESET ---------------- */}
                        {step === 3 && (
                             <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-8">
                                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Create new password</h2>
                                    <p className="text-neutral-500 dark:text-neutral-400">
                                        Your identity has been verified. Set your new secure password.
                                    </p>
                                </div>

                                <form onSubmit={handleResetPassword} className="space-y-6">
                                    <div>
                                        <InputField
                                            label="New Password"
                                            icon={Lock}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Min. 8 chars"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            eye={showPassword ? EyeClosed : EyeIcon}
                                            onClick={() => setShowPassword(!showPassword)}
                                            autoFocus
                                        />
                                        
                                        {/* Password Strength Meter */}
                                        <AnimatePresence>
                                            {password.length > 0 && (
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
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            eye={showConfirmPassword ? EyeClosed : EyeIcon}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        />
                                        {confirmPassword && password === confirmPassword && (
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
                                        text="Reset Password"
                                        fullWidth
                                        type="submit"
                                        loading={loading}
                                        className="h-12 text-base"
                                        icon={Sparkles}
                                    />
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
