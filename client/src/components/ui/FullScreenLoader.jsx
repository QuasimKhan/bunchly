import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const FullScreenLoader = ({
    logoLight = "/img/Bunchly-dark.png",
    logoDark = "/img/Bunchly-light.png",
    message = "Launching your experience...",
}) => {
    const cardRef = useRef(null);
    const dotRef = useRef(null);
    const glowRef1 = useRef(null);
    const glowRef2 = useRef(null);

    useEffect(() => {
        // Fade + lift card smoothly
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 30, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: "power3.out",
            }
        );

        // Pulsing glowing dot
        gsap.to(dotRef.current, {
            scale: 1.3,
            repeat: -1,
            yoyo: true,
            duration: 0.9,
            ease: "power2.inOut",
        });

        // Ambient glow movement
        gsap.to(glowRef1.current, {
            scale: 1.2,
            opacity: 0.6,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        gsap.to(glowRef2.current, {
            scale: 1.3,
            opacity: 0.5,
            duration: 7,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
    }, []);

    return (
        <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0E0E10]">
            {/* Glows */}
            <div
                ref={glowRef1}
                className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full 
                bg-indigo-500/30 blur-[120px]"
            ></div>

            <div
                ref={glowRef2}
                className="absolute -bottom-52 -right-52 w-[520px] h-[520px] rounded-full 
                bg-purple-500/30 blur-[140px]"
            ></div>

            {/* Main Glass Card */}
            <div
                ref={cardRef}
                className="relative z-10 w-full max-w-sm p-10 rounded-3xl
                bg-white/10 backdrop-blur-2xl border border-white/20
                shadow-[0_20px_50px_rgba(0,0,0,0.45)]
                flex flex-col items-center justify-center gap-6"
            >
                {/* Glass reflections */}
                <div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-b 
                    from-white/10 to-transparent pointer-events-none"
                ></div>

                <div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-tr 
                    from-white/5 to-transparent pointer-events-none"
                ></div>

                {/* Logos */}
                <img
                    src={logoLight}
                    alt="logo"
                    className="w-24 block dark:hidden opacity-90"
                />
                <img
                    src={logoDark}
                    alt="logo"
                    className="w-24 hidden dark:block opacity-90"
                />

                {/* GSAP Dot Loader */}
                <div
                    ref={dotRef}
                    className="w-5 h-5 rounded-full 
                    bg-gradient-to-br from-indigo-500 to-purple-600
                    shadow-[0_0_20px_rgba(99,102,241,0.7)]"
                ></div>

                <p className="text-gray-200 text-sm tracking-widest opacity-80">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default FullScreenLoader;
