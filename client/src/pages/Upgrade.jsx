import { useState } from "react";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { Crown, Check, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Upgrade = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isPro = user?.plan === "pro";
    const [loading, setLoading] = useState(false);

    const handleUpgrade = () => {
        if (loading || isPro) return;
        setLoading(true);
        
        const params = new URLSearchParams(location.search);
        const applyOffer = params.get("apply_offer");
        
        let target = '/dashboard/checkout';
        if (applyOffer) {
            target += '?apply_offer=true';
        }
        
        navigate(target);
    };

    return (
        <div className="py-20 px-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-14">
                <h1 className="text-3xl md:text-4xl font-bold">
                    Upgrade your plan
                </h1>
                <p className="mt-3 text-neutral-500 max-w-xl mx-auto">
                    Unlock premium tools built for creators and professionals
                    who want to grow faster.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Free Plan */}
                <PlanCard
                    muted
                    title="Free"
                    price="₹0"
                    subtitle="For getting started"
                    features={[
                        "Up to 5 links",
                        "Basic profile",
                        "Default theme",
                        "Bunchly branding",
                    ]}
                    cta={
                        <Button
                            text={isPro ? "Free plan" : "Current plan"}
                            disabled
                            fullWidth
                        />
                    }
                />

                {/* Pro Plan */}
                <PlanCard
                    highlighted
                    title="Pro"
                    price="₹49 / month"
                    subtitle="For creators & professionals"
                    badge="Most Popular"
                    icon={<Crown className="w-5 h-5 text-indigo-600" />}
                    features={[
                        "Unlimited links",
                        "Advanced analytics",
                        "Custom themes",
                        "Remove branding",
                        "Priority features",
                    ]}
                    cta={
                        isPro ? (
                            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600/10 text-indigo-600 font-medium">
                                <Sparkles className="w-4 h-4" />
                                You’re on Pro
                            </div>
                        ) : (
                            <Button
                                text={
                                    loading ? "Processing…" : "Upgrade to Pro"
                                }
                                icon={loading ? Loader2 : undefined}
                                loading={loading}
                                variant="primary"
                                fullWidth
                                onClick={handleUpgrade}
                                className="shadow-lg"
                            />
                        )
                    }
                />
            </div>

            <p className="mt-12 text-center text-xs text-neutral-500">
                Cancel anytime · No hidden charges · Secure payments
            </p>
        </div>
    );
};

export default Upgrade;

/* ================= Sub Components ================= */

const PlanCard = ({
    title,
    price,
    subtitle,
    features,
    cta,
    highlighted,
    badge,
    icon,
    muted,
}) => {
    return (
        <div
            className={`
                relative rounded-2xl p-8
                bg-white dark:bg-neutral-900
                border
                ${
                    highlighted
                        ? "border-indigo-600 shadow-2xl"
                        : "border-neutral-200 dark:border-neutral-800"
                }
                ${muted ? "opacity-90" : ""}
            `}
        >
            {badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                    {badge}
                </span>
            )}

            <div className="flex items-center gap-2 mb-2">
                {icon}
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>

            <p className="text-neutral-500 text-sm">{subtitle}</p>

            <p className="mt-4 text-3xl font-bold">{price}</p>

            <ul className="mt-6 space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                {features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-indigo-600" />
                        {f}
                    </li>
                ))}
            </ul>

            <div className="mt-8">{cta}</div>
        </div>
    );
};
