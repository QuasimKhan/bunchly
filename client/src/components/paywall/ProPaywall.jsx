import Button from "../ui/Button";
import { Lock, Sparkles, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProPaywall = ({
    title = "Upgrade to Bunchly Pro",
    description = "Unlock powerful tools designed to grow your presence faster.",
    features = [
        "Advanced analytics & insights",
        "Unlimited links & collections",
        "Custom domains & branding",
        "Premium themes & layouts",
    ],
    ctaText = "Upgrade to Pro",
}) => {
    const navigate = useNavigate();

    return (
        <section
            role="region"
            aria-label="Pro feature paywall"
            className="flex justify-center px-4 py-10 sm:py-14"
        >
            <div
                className="
                    relative
                    w-full max-w-md
                    rounded-2xl
                    border border-neutral-200 dark:border-neutral-800
                    bg-white dark:bg-neutral-900
                    shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                    dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]
                    overflow-hidden
                "
            >
                {/* Gradient glow */}
                <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
                    <div className="w-80 h-80 bg-indigo-600/20 dark:bg-indigo-500/20 blur-[140px] rounded-full" />
                </div>

                {/* Pro badge */}
                <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 text-xs font-medium">
                        <Crown className="w-3.5 h-3.5" />
                        PRO
                    </span>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 text-center">
                    {/* Icon */}
                    <div className="mx-auto mb-5 w-14 h-14 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                        <Lock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                    </div>

                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-2">
                        {title}
                    </h2>

                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-8">
                        {description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-4 mb-10 text-left">
                        {features.map((feature) => (
                            <li
                                key={feature}
                                className="flex items-start gap-3 text-sm sm:text-base"
                            >
                                <Sparkles className="mt-0.5 w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                <span className="text-neutral-700 dark:text-neutral-300">
                                    {feature}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <Button
                        text={ctaText}
                        size="lg"
                        variant="primary"
                        fullWidth
                        className="
                            shadow-lg
                            transition-transform
                            hover:-translate-y-0.5
                            active:translate-y-0
                        "
                        onClick={() => navigate("/dashboard/upgrade")}
                    />

                    {/* Subtext */}
                    <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-500">
                        Cancel anytime. No hidden charges.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ProPaywall;
