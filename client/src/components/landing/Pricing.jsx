import AnimateOnScroll from "../AnimateOnScroll";
import Button from "../ui/Button";
import { Check, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
    const navigate = useNavigate();

    return (
        <section id="pricing" className="py-28 px-6 scroll-mt-32">
            <div className="max-w-5xl mx-auto text-center">
                <AnimateOnScroll>
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Simple, honest pricing
                    </h2>
                    <p className="mt-3 text-neutral-600 dark:text-neutral-400">
                        Start free. Upgrade only when you need more power.
                    </p>
                </AnimateOnScroll>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* FREE PLAN */}
                    <AnimateOnScroll>
                        <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-left">
                            <h3 className="text-xl font-semibold">Free</h3>
                            <p className="mt-2 text-neutral-500 text-sm">
                                For getting started
                            </p>

                            <p className="mt-6 text-4xl font-bold">₹0</p>

                            <ul className="mt-6 space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    Up to limited links
                                </li>
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    Basic profile & theme
                                </li>
                                <li className="flex gap-2">
                                    <Lock className="w-4 h-4 text-neutral-400" />
                                    No analytics
                                </li>
                                <li className="flex gap-2">
                                    <Lock className="w-4 h-4 text-neutral-400" />
                                    Bunchly branding
                                </li>
                            </ul>

                            <div className="mt-8">
                                <Button
                                    text="Get started for free"
                                    variant="outline"
                                    fullWidth
                                    onClick={() => navigate("/signup")}
                                />
                            </div>
                        </div>
                    </AnimateOnScroll>

                    {/* PRO PLAN */}
                    <AnimateOnScroll>
                        <div className="relative p-8 rounded-2xl border-2 border-indigo-600 bg-white dark:bg-neutral-900 text-left shadow-lg">
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                                Most Popular
                            </span>

                            <h3 className="text-xl font-semibold">Pro</h3>
                            <p className="mt-2 text-neutral-500 text-sm">
                                For creators & professionals
                            </p>

                            <p className="mt-6 text-4xl font-bold">
                                ₹49{" "}
                                <span className="text-base font-normal text-neutral-500">
                                    / month
                                </span>
                            </p>

                            <ul className="mt-6 space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    Unlimited links
                                </li>
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    Analytics (views & clicks)
                                </li>
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    Remove Bunchly branding
                                </li>
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    Priority access to new features
                                </li>
                            </ul>

                            <div className="mt-8">
                                <Button
                                    text="Upgrade to Pro"
                                    fullWidth
                                    onClick={() =>
                                        navigate("/dashboard/upgrade")
                                    }
                                />
                            </div>
                        </div>
                    </AnimateOnScroll>
                </div>

                <p className="mt-10 text-xs text-neutral-500">
                    Cancel anytime. No hidden charges.
                </p>
            </div>
        </section>
    );
};

export default Pricing;
