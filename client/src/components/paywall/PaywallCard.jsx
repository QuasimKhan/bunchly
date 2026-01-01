import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

const PaywallCard = ({
    title = "Pro feature",
    description = "Upgrade to Pro to unlock this feature.",
    ctaText = "Upgrade to Pro",
}) => {
    const navigate = useNavigate();

    return (
        <div
            className="
                relative
                mt-4
                rounded-2xl
                border border-neutral-200 dark:border-neutral-800
                bg-gradient-to-br from-neutral-50 to-white
                dark:from-neutral-900 dark:to-neutral-950
                p-5
                shadow-sm
            "
        >
            {/* Lock icon */}
            <div
                className="
                    absolute -top-3 -left-3
                    w-10 h-10
                    rounded-full
                    bg-indigo-600
                    flex items-center justify-center
                    shadow-md
                "
            >
                <Lock className="w-5 h-5 text-white" />
            </div>

            <div className="ml-8">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {title}
                </h4>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {description}
                </p>

                <div className="mt-3">
                    <Button
                        text={ctaText}
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate("/dashboard/upgrade")}
                        className="!text-indigo-600 hover:!text-indigo-700"
                    />
                </div>
            </div>
        </div>
    );
};

export default PaywallCard;
