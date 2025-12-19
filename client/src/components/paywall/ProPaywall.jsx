import Button from "../ui/Button";
import { Lock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProPaywall = ({
    title = "This is a Pro feature",
    description = "Upgrade to Pro to unlock this feature and more premium tools.",
    features = [
        "Advanced analytics",
        "Unlimited links",
        "Custom domains",
        "Premium themes",
    ],
    ctaText = "Upgrade to Pro",
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center p-6">
            <div
                className="
                    relative
                    w-full max-w-md
                    rounded-2xl
                    border border-gray-200 dark:border-gray-800
                    bg-white dark:bg-neutral-900
                    shadow-xl
                    overflow-hidden
                "
            >
                {/* Glow */}
                <div className="absolute inset-0 -z-10 flex justify-center">
                    <div className="w-72 h-72 bg-indigo-600/10 blur-[120px] rounded-full" />
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-indigo-600" />
                    </div>

                    <h2 className="text-xl font-semibold mb-2">{title}</h2>

                    <p className="text-sm text-neutral-500 mb-6">
                        {description}
                    </p>

                    {/* Feature list */}
                    <ul className="space-y-3 mb-8 text-left">
                        {features.map((f) => (
                            <li
                                key={f}
                                className="flex items-center gap-3 text-sm"
                            >
                                <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>

                    <Button
                        text={ctaText}
                        size="lg"
                        variant="primary"
                        onClick={() => navigate("/upgrade")}
                        fullWidth
                        className="shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProPaywall;
