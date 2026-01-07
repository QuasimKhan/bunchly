import AnimateOnScroll from "../AnimateOnScroll";
import Button from "../ui/Button";
import { Check, Lock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SpotlightCard from "../ui/SpotlightCard";

const Pricing = () => {
    const navigate = useNavigate();

    return (
        <section id="pricing" className="py-16 sm:py-32 px-5 sm:px-6 relative overflow-hidden bg-white dark:bg-[#050505]">
             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-5xl mx-auto text-center relative z-10">
                <AnimateOnScroll>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Simple, honest <span className="text-gradient-premium">pricing</span>
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 sm:mb-16">
                        Start free. Upgrade only when you need more power.
                    </p>
                </AnimateOnScroll>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <AnimateOnScroll delay={0.1}>
                         <SpotlightCard className="h-full bg-white dark:bg-neutral-900 border-gray-200 dark:border-white/10 shadow-sm hover:shadow-lg transition-shadow">
                            <div className="p-8 h-full flex flex-col text-left">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Free</h3>
                                <p className="mt-2 text-gray-500 text-sm">
                                    Forever free for everyone.
                                </p>

                                <div className="mt-6 mb-8">
                                    <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">₹0</span>
                                </div>

                                <Button
                                    text="Get Started Free"
                                    onClick={() => navigate("/signup")}
                                    variant="outline"
                                    fullWidth
                                    className="mb-8 border-gray-200 dark:border-gray-800"
                                />

                                <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-300 flex-1">
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span>Unlimited links</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span>Custom themes</span>
                                    </li>
                                    <li className="flex items-center gap-3 opacity-50">
                                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                                            <Lock className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <span>Basic analytics</span>
                                    </li>
                                     <li className="flex items-center gap-3 opacity-50">
                                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                                            <Lock className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <span>Remove Bunchly branding</span>
                                    </li>
                                </ul>
                            </div>
                        </SpotlightCard>
                    </AnimateOnScroll>

                    {/* Pro Plan */}
                    <AnimateOnScroll delay={0.2}>
                         <div className="relative group h-full">
                            {/* Gradient Border Effect */}
                            <div className="absolute -inset-[2px] bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-[2px] opacity-100" />
                            
                            <SpotlightCard className="h-full bg-white dark:bg-neutral-900 relative !border-transparent">
                                <div className="p-8 h-full flex flex-col text-left">
                                    <div className="absolute top-0 right-0 p-6">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                                            <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                                            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 tracking-wide uppercase">Popular</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent w-fit">Pro</h3>
                                    <p className="mt-2 text-gray-500 text-sm">
                                        For power users & brands.
                                    </p>

                                    <div className="mt-6 mb-8">
                                        <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">₹49</span>
                                        <span className="text-lg text-gray-400 font-medium whitespace-nowrap"> / mo</span>
                                    </div>

                                    <Button
                                        text="Start Pro Trial"
                                        onClick={() => navigate("/signup?plan=pro")}
                                        variant="primary"
                                        fullWidth
                                        className="mb-8 shadow-lg shadow-indigo-500/25"
                                    />

                                    <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                                        <li className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-indigo-600" />
                                            </div>
                                            <span className="font-medium">Everything in Free</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-indigo-600" />
                                            </div>
                                            <span>Remove Bunchly branding</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-indigo-600" />
                                            </div>
                                            <span>Advanced analytics & insights</span>
                                        </li>
                                         <li className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-indigo-600" />
                                            </div>
                                            <span>SEO customization</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-indigo-600" />
                                            </div>
                                            <span>Priority support</span>
                                        </li>
                                    </ul>
                                </div>
                            </SpotlightCard>
                        </div>
                    </AnimateOnScroll>
                </div>
                
                <p className="mt-12 text-sm text-gray-500 dark:text-gray-400">
                    All prices in INR. Cancel anytime.
                </p>
            </div>
        </section>
    );
};

export default Pricing;
