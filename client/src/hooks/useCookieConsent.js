import { useEffect, useState, useCallback } from "react";

/* =====================================================
   CONFIG (centralized, future-proof)
===================================================== */

const CONSENT_KEY = "bunchly_cookie_consent";
const CONSENT_VERSION = "v1"; // bump when policy changes

export const CONSENT_STATUS = {
    ACCEPTED: "accepted",
    REJECTED: "rejected",
};

/* =====================================================
   HOOK
===================================================== */

export const useCookieConsent = () => {
    const [status, setStatus] = useState(null); // null | accepted | rejected
    const [ready, setReady] = useState(false);

    /* ---------------- LOAD CONSENT ---------------- */

    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const raw = localStorage.getItem(CONSENT_KEY);
            if (!raw) {
                setStatus(null);
            } else {
                const parsed = JSON.parse(raw);

                // invalidate if version mismatch
                if (parsed.version !== CONSENT_VERSION) {
                    localStorage.removeItem(CONSENT_KEY);
                    setStatus(null);
                } else {
                    setStatus(parsed.status);
                }
            }
        } catch {
            setStatus(null);
        } finally {
            setReady(true);
        }
    }, []);

    /* ---------------- HELPERS ---------------- */

    const persist = useCallback((nextStatus) => {
        if (typeof window === "undefined") return;

        localStorage.setItem(
            CONSENT_KEY,
            JSON.stringify({
                status: nextStatus,
                version: CONSENT_VERSION,
                timestamp: Date.now(),
            })
        );

        setStatus(nextStatus);
    }, []);

    const acceptCookies = useCallback(() => {
        persist(CONSENT_STATUS.ACCEPTED);
    }, [persist]);

    const rejectCookies = useCallback(() => {
        persist(CONSENT_STATUS.REJECTED);
    }, [persist]);

    /* ---------------- DERIVED FLAGS ---------------- */

    const hasConsented = status === CONSENT_STATUS.ACCEPTED;
    const hasRejected = status === CONSENT_STATUS.REJECTED;
    const needsConsent = status === null;

    return {
        /* state */
        status,
        ready,

        /* actions */
        acceptCookies,
        rejectCookies,

        /* helpers */
        hasConsented,
        hasRejected,
        needsConsent,
    };
};
