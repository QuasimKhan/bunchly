import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const AnalyticsTracker = () => {
    const location = useLocation();
    const sessionIdRef = useRef('');

    // Initialize session ID once per session (browser tab session)
    useEffect(() => {
        let sid = sessionStorage.getItem('bunchly_sid');
        if (!sid) {
            sid = uuidv4();
            sessionStorage.setItem('bunchly_sid', sid);
        }
        sessionIdRef.current = sid;

        // Ensure visitor ID exists (persistent)
        let vid = localStorage.getItem('bunchly_vid');
        if (!vid) {
            vid = uuidv4();
            localStorage.setItem('bunchly_vid', vid);
        }
    }, []);

    useEffect(() => {
        const trackPageview = async () => {
            try {
                const screenRes = `${window.screen.width}x${window.screen.height}`;
                const viewport = `${window.innerWidth}x${window.innerHeight}`;
                const language = navigator.language || navigator.userLanguage;
                
                await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/collect`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        path: location.pathname + location.search,
                        eventType: 'pageview',
                        sessionId: sessionIdRef.current,
                        visitorId: localStorage.getItem('bunchly_vid'),
                        screenResolution: screenRes,
                        viewport: viewport,
                        language: language,
                        referrer: document.referrer
                    }),
                    // Use keepalive to ensure request completes even if page unloads (though less relevant for SPA nav)
                    keepalive: true 
                });
            } catch (error) {
                // Silently fail to not disrupt user experience
                console.warn('Analytics tracking failed', error);
            }
        };

        // Small delay to ensure route is settled and title might be updated (if we tracked title)
        // Also helps with not blocking main thread immediately on nav
        const timeoutId = setTimeout(trackPageview, 500);

        return () => clearTimeout(timeoutId);
    }, [location]);

    return null; // This component handles side effects only
};

export default AnalyticsTracker;
