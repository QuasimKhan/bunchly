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
       Do NOT show on public profile pages (/u/:username)
    -------------------------------------------------- */
    const isPublicProfile = location.pathname.startsWith("/u/");

    /* -------------------------------------------------
       Entrance animation
    -------------------------------------------------- */
    useEffect(() => {
        if (ready && needsConsent && !dismissed && !isPublicProfile) {
            const t = setTimeout(() => setVisible(true), 150);
            return () => clearTimeout(t);
        }
    }, [ready, needsConsent, dismissed, isPublicProfile]);

    /* -------------------------------------------------
       Guards
    -------------------------------------------------- */
    if (!ready || !needsConsent || dismissed || isPublicProfile) {
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
                    border border-neutral-200 dark:border-neutral-800
                    bg-white dark:bg-neutral-900
                    shadow-xl
                    px-5 py-4
                    flex flex-col sm:flex-row
                    gap-4
                "
            >
                {/* Close button (does NOT save consent) */}
                <button
                    onClick={() => setDismissed(true)}
                    className="
                        absolute top-3 right-3
                        p-1 rounded-md
                        text-neutral-400 hover:text-neutral-700
                        dark:hover:text-neutral-300
                    "
                    aria-label="Close cookie banner"
                >
                    <X size={16} />
                </button>

                {/* Text */}
                <div className="flex-1 pr-6">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        We use cookies to improve your experience and understand
                        how Bunchly is used. Essential cookies are always
                        enabled.
                    </p>

                    <a
                        href="/privacy"
                        className="inline-block mt-1 text-xs text-indigo-600 hover:underline"
                    >
                        Learn more
                    </a>
                </div>

                {/* Actions */}
                <div className="flex gap-2 items-center justify-end">
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
