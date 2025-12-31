import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCookieConsent } from "../hooks/useCookieConsent";
import Button from "../components/ui/Button";
import { X } from "lucide-react";

const ConsentBanner = () => {
    const { ready, needsConsent, acceptCookies, rejectCookies } =
        useCookieConsent();

    const location = useLocation();
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    /* -------------------------------------------------
       Show ONLY on Home Page
    -------------------------------------------------- */
    const isHomePage = location.pathname === "/";

    /* -------------------------------------------------
       Entrance animation
    -------------------------------------------------- */
    useEffect(() => {
        if (ready && needsConsent && !dismissed && isHomePage) {
            const t = setTimeout(() => setVisible(true), 200);
            return () => clearTimeout(t);
        }
    }, [ready, needsConsent, dismissed, isHomePage]);

    /* -------------------------------------------------
       Guards
    -------------------------------------------------- */
    if (!ready || !needsConsent || dismissed || !isHomePage) {
        return null;
    }

    return (
        <div
            className={`
                fixed bottom-4 left-4 right-4 z-50
                max-w-3xl mx-auto
                transition-all duration-300 ease-out
                ${
                    visible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                }
            `}
        >
            <div
                className="
                    relative
                    rounded-2xl
                    backdrop-blur-xl
                    bg-white/80 dark:bg-neutral-900/80
                    border border-black/5 dark:border-white/10
                    shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]
                    px-5 py-4
                    flex flex-col sm:flex-row
                    gap-4
                "
            >
                {/* Subtle brand glow */}
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none" />

                {/* Close (dismiss only) */}
                <button
                    onClick={() => setDismissed(true)}
                    className="
                        absolute top-3 right-3
                        p-1.5 rounded-md
                        text-neutral-400 hover:text-neutral-700
                        dark:hover:text-neutral-300
                        transition
                    "
                    aria-label="Close cookie banner"
                >
                    <X size={16} />
                </button>

                {/* Text */}
                <div className="flex-1 pr-6">
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                        We use cookies to improve your experience and understand
                        how Bunchly is used. Essential cookies are always
                        enabled.
                    </p>

                    <a
                        href="/privacy"
                        className="inline-block mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        Learn more
                    </a>
                </div>

                {/* Actions */}
                <div className="flex gap-2 items-center justify-end shrink-0">
                    <Button
                        text="Reject"
                        variant="secondary"
                        onClick={rejectCookies}
                    />
                    <Button text="Accept" onClick={acceptCookies} />
                </div>
            </div>
        </div>
    );
};

export default ConsentBanner;
