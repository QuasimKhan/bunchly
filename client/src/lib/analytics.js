let analyticsLoaded = false;

export const loadAnalytics = () => {
    if (analyticsLoaded) return;

    const script = document.createElement("script");
    script.src = "https://plausible.io/js/script.js";
    script.defer = true;
    script.setAttribute("data-domain", "bunchly.netlify.app"); // replace later

    document.head.appendChild(script);
    analyticsLoaded = true;
};
