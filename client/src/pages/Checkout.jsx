import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
    Loader2, 
    Check, 
    Tag, 
    CreditCard, 
    ShieldCheck, 
    Sparkles, 
    Zap, 
    Lock,
    Gift,
    Info,
    ArrowLeft,
    ArrowRight,
    X
} from "lucide-react";
import { toast } from "sonner";
import Button from "../components/ui/Button";

const Checkout = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    
    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [publicCoupons, setPublicCoupons] = useState([]);

    // Pricing Constants
    const BASE_PRICE = 49;
    const PLATFORM_FEE = 1; // ₹1 Handling Fee

    useEffect(() => {
        if (user?.plan === 'pro') {
            navigate('/dashboard');
        }
        fetchPublicCoupons();
    }, [user, navigate]);

    const fetchPublicCoupons = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/coupons/public`);
            const data = await res.json();
            if (data.success) {
                setPublicCoupons(data.coupons);
            }
        } catch (error) {
            console.error("Failed to fetch offers");
        }
    };

    // Calculate Totals
    const calculateTotal = () => {
        let discount = 0;
        if (appliedCoupon) {
            if (appliedCoupon.discountType === 'percent') {
                discount = BASE_PRICE * (appliedCoupon.discountValue / 100);
            } else {
                discount = appliedCoupon.discountValue;
            }
        }
        // Ensure total doesn't drop below 0 (or minimum charge)
        return Math.max(1, BASE_PRICE + PLATFORM_FEE - discount);
    };

    const handleValidateCoupon = async (codeToUse) => {
        const code = codeToUse || couponCode;
        if (!code.trim()) return;
        
        setCouponLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/validate-coupon`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                setAppliedCoupon(data.coupon);
                setCouponCode(data.coupon.code); // Update input if clicked from suggestion
                toast.success("Offer applied successfully!");
            } else {
                setAppliedCoupon(null);
                toast.error(data.message || "Invalid coupon");
            }
        } catch (error) {
            toast.error("Failed to validate coupon");
        } finally {
            setCouponLoading(false);
        }
    };

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            // 1. Create Order
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ couponCode: appliedCoupon?.code }),
                credentials: "include"
            });
            const data = await res.json();

            if (!data.success) throw new Error(data.message);

            const { order_id, amount, currency, key } = data;

       

            // 2. Open Razorpay
            const options = {
                key: key,
                amount: amount,
                currency: currency,
                order_id: order_id,
                name: "Bunchly Pro",
                description: "Monthly Plan",
                image: (import.meta.env.VITE_APP_URL && !import.meta.env.VITE_APP_URL.includes('localhost')) 
                    ? `${import.meta.env.VITE_APP_URL}/img/Bunchly-light.png` 
                    : undefined, // Avoid Mixed Content error on localhost
                handler: async (response) => {
                    setVerifying(true);
                    try {

                        
                        const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ 
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                couponCode: appliedCoupon?.code 
                            }),
                            credentials: "include"
                        });
                        
                        
                        const verifyData = await verifyRes.json();
                        
                        
                        if (verifyRes.ok && verifyData.success) {
                            await refreshUser();
                            toast.success("Welcome to the Pro Club! 🚀");
                            navigate('/dashboard');
                        } else {
                            toast.error(verifyData.message || "Verification failed. Please contact support.");
                        }
                    } catch (error) {
                        toast.error("Verification error");
                    } finally {
                        setVerifying(false);
                        setLoading(false); 
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email
                },
                theme: {
                    color: "#4f46e5"
                },
                modal: {
                    ondismiss: () => setLoading(false)
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            toast.error(error.message || "Payment initiation failed");
            setLoading(false);
        }
    };

    const finalPrice = calculateTotal();
    const discountAmount = appliedCoupon ? (appliedCoupon.discountType === 'percent' ? (BASE_PRICE * appliedCoupon.discountValue / 100) : appliedCoupon.discountValue) : 0;

    return (
        <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white font-sans selection:bg-indigo-500/30 transition-colors duration-300">
            {/* Animated Mesh Gradient Background - Adapts to Theme */}
            <div className="fixed inset-0 z-0 overflow-hidden pointers-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 dark:bg-purple-900/40 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/40 dark:bg-indigo-900/40 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-[100px] animate-bounce delay-700" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 md:py-12 lg:py-20 animate-fade-in-up">
                {/* Header */}
                <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="group flex items-center gap-2 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-6 uppercase tracking-wider transition-colors cursor-pointer"
                        >
                            <span className="p-1 rounded-full bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 group-hover:bg-neutral-300 dark:group-hover:bg-white/10 transition-all">
                                <ArrowLeft className="w-4 h-4" />
                            </span>
                            Back
                        </button>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-400 dark:from-white dark:via-neutral-200 dark:to-neutral-500 mb-4">
                            Unlock Everything.
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                            Upgrade to <span className="text-neutral-900 dark:text-white font-bold">Pro</span> and give your bio link superpowers. 
                            Unlimited links, analytics, and premium customization.
                        </p>
                    </div>
                    {/* Trust Badges */}
                     <div className="flex gap-4 self-start md:self-end">
                         <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 backdrop-blur-md shadow-sm dark:shadow-none">
                            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-emerald-500 dark:text-emerald-400 mb-1 md:mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Secure AES-256</span>
                         </div>
                         <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 backdrop-blur-md shadow-sm dark:shadow-none">
                            <Lock className="w-5 h-5 md:w-6 md:h-6 text-indigo-500 dark:text-indigo-400 mb-1 md:mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Encrypted</span>
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Premium Plan Card */}
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <div className="relative group perspective-1000">
                            {/* Card Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur opacity-20 dark:opacity-30 group-hover:opacity-40 dark:group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                            
                            {/* Card Content */}
                            <div className="relative bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl shadow-indigo-500/5 dark:shadow-none">
                                {/* Abstract Shapes */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                                <Zap className="absolute top-10 right-10 w-48 h-48 md:w-64 md:h-64 text-neutral-900/[0.03] dark:text-white/[0.03] rotate-12 pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-gradient-to-r dark:from-amber-200/20 dark:to-yellow-400/20 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-200 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
                                        <Sparkles className="w-3 h-3 fill-amber-500 dark:fill-amber-200" /> Most Popular Choice
                                    </div>

                                    <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Pro Monthly</h3>
                                    <div className="flex items-baseline gap-2 mb-8">
                                        <span className="text-6xl font-black text-neutral-900 dark:text-white tracking-tight">₹49</span>
                                        <span className="text-xl text-neutral-500">/mo</span>
                                    </div>

                                    <div className="space-y-6 mb-10">
                                        {[
                                            { icon: Check, text: "Unlimited Links & Folders", sub: "Create as many links as you need" },
                                            { icon: Sparkles, text: "Advanced Analytics", sub: "Track clicks, views, and locations" },
                                            { icon: Lock, text: "Remove 'By Bunchly'", sub: "Full white-label experience" },
                                            { icon: Zap, text: "Priority Support", sub: "Skip the queue assistance" },
                                            { icon: Gift, text: "Premium Themes", sub: "Access exclusive designs" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-4 group/item">
                                                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/5 group-hover/item:bg-indigo-50 dark:group-hover/item:bg-indigo-500/20 group-hover/item:border-indigo-200 dark:group-hover/item:border-indigo-500/50 transition-colors">
                                                    <item.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover/item:text-indigo-700 dark:group-hover/item:text-indigo-300" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-neutral-900 dark:text-white text-lg leading-none mb-1">{item.text}</p>
                                                    <p className="text-sm text-neutral-500">{item.sub}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/5 text-sm text-neutral-600 dark:text-neutral-400">
                                        <Info className="w-4 h-4 shrink-0 text-indigo-500 dark:text-indigo-400" />
                                        Plan renews manually. No surprise charges, cancel anytime.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment Sidebar */}
                    <div className="lg:col-span-5 relative order-1 lg:order-2">
                        <div className="sticky top-8 space-y-6">
                            
                            {/* Order Summary Card */}
                            <div className="relative bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden shadow-xl shadow-neutral-200/50 dark:shadow-none">
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                                    Order Summary
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                                        <span>Pro Monthly Plan</span>
                                        <span className="text-neutral-900 dark:text-white font-medium">₹{BASE_PRICE.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400 items-center">
                                        <span className="flex items-center gap-2">
                                            Platform Fee
                                            <div className="group/tooltip relative">
                                                <Info className="w-3.5 h-3.5 cursor-help" />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-neutral-900 dark:bg-black border border-white/10 rounded-xl text-xs text-white/90 dark:text-neutral-400 text-center opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none backdrop-blur-md shadow-xl">
                                                    Secure payment processing fee
                                                </div>
                                            </div>
                                        </span>
                                        <span className="text-neutral-900 dark:text-white font-medium">₹{PLATFORM_FEE.toFixed(2)}</span>
                                    </div>

                                    {appliedCoupon && (
                                        <div className="flex justify-between items-center py-3 px-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl animate-in slide-in-from-right-4">
                                            <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                                                <Tag className="w-4 h-4" /> 
                                                {appliedCoupon.code}
                                            </span>
                                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">-₹{discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="h-px bg-neutral-200 dark:bg-white/10 my-6" />

                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-bold text-neutral-900 dark:text-white">Total</span>
                                        <div className="text-right">
                                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                                ₹{finalPrice.toFixed(0)}
                                            </div>
                                            <p className="text-[10px] text-neutral-500 dark:text-neutral-500 font-bold uppercase tracking-widest mt-1">Due today</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Coupon Section */}
                            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-neutral-200/50 dark:shadow-none">
                                <label className="block text-[10px] font-bold uppercase text-neutral-500 tracking-wider mb-4">
                                    Discount Code
                                </label>
                                
                                <div className="relative flex gap-2 mb-6">
                                    <input 
                                        type="text" 
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="ENTER CODE"
                                        disabled={!!appliedCoupon || couponLoading}
                                        className="w-full bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm font-bold text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all uppercase disabled:opacity-50"
                                    />
                                    {appliedCoupon ? (
                                        <button 
                                            onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}
                                            className="absolute right-2 top-2 bottom-2 px-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg text-xs font-bold hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleValidateCoupon()}
                                            disabled={!couponCode || couponLoading}
                                            className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-200 disabled:dark:bg-neutral-800 text-white disabled:text-neutral-400 disabled:dark:text-neutral-500 rounded-lg text-xs font-bold transition-all disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {couponLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : "APPLY"}
                                        </button>
                                    )}
                                </div>

                                {/* Recommended Coupons */}
                                {publicCoupons.length > 0 && !appliedCoupon && (
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                            <Gift className="w-3 h-3" /> Available Offers
                                        </p>
                                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                                            {publicCoupons.map(c => (
                                                <button 
                                                    key={c.code}
                                                    onClick={() => handleValidateCoupon(c.code)}
                                                    className="snap-start shrink-0 group flex items-center gap-3 pl-3 pr-4 py-2 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500/50 transition-all cursor-pointer active:scale-95 shadow-sm dark:shadow-none"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500 hover:border-indigo-200 dark:hover:border-indigo-500 transition-colors">
                                                        <Tag className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-300 group-hover:text-indigo-700 dark:group-hover:text-white" />
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="text-xs font-bold text-neutral-900 dark:text-white">{c.code}</div>
                                                        <div className="text-[10px] text-neutral-500 dark:text-indigo-300">{c.description}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Payment Button */}
                            <button
                                onClick={handleSubscribe}
                                disabled={loading || verifying}
                                className="group relative w-full overflow-hidden rounded-2xl bg-indigo-600 dark:bg-white p-px transition-all hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)] dark:hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative flex items-center justify-center gap-3 bg-white dark:bg-black rounded-[15px] px-6 py-4 transition-colors group-hover:bg-transparent">
                                    {verifying ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-white group-hover:text-white" />
                                            <span className="font-bold text-indigo-900 dark:text-white group-hover:text-white tracking-wide">VERIFYING PAYMENT...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-black text-lg text-indigo-900 dark:text-white group-hover:text-white tracking-wide group-hover:tracking-wider transition-all">
                                                CONFIRM & PAY ₹{finalPrice.toFixed(0)}
                                            </span>
                                            <div className="p-1.5 bg-indigo-50 dark:bg-white/10 rounded-full group-hover:bg-white/20">
                                                <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-white group-hover:text-white" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </button>

                            <p className="text-center text-[10px] text-neutral-500 leading-relaxed">
                                By confirming, you agree to our Terms of Service.<br/>
                                This is a secure 256-bit SSL encrypted payment.
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
