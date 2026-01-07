import React from 'react';
import { FolderOpen, FolderClosed, ChevronDown, ExternalLink } from "lucide-react";
import TickBadge from "../ui/TickBadge";
import LinkFavicon from "../link-card/LinkFavicon"; 
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reusable Live Preview Component (Stateless UI)
 * - Used in: PreviewModal, LivePreviewPanel (Dashboard), PublicProfilePage
 */
export const LivePreview = ({
    user = {},
    links = [],
    mode = "preview", // 'preview' | 'public'
    className = ""
}) => {
    const [expanded, setExpanded] = React.useState({});

    const toggleCollection = (id, e) => {
        e.preventDefault();
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const activeLinks = links.filter((l) => l.isActive);
    
    // User Initials
    const getInitial = () => {
        if (user.image) return null;
        if (user.name) return user.name.charAt(0).toUpperCase();
        if (user.email) return user.email.charAt(0).toUpperCase();
        if (user.username) return user.username.charAt(0).toUpperCase();
        return "?";
    };
    const initial = getInitial();

    // 🎨 Appearance
    const appearance = user.appearance || {};
    const {
        bgType = "color",
        bgColor = "#ffffff",
        bgGradient = "from-indigo-500 to-purple-600",
        bgImage = "",
        bgBlur = 0, 
        bgOverlay = 0, 
        buttonStyle = "fill",
        buttonRoundness = "xl", // New
        buttonColor = "#171717",
        buttonFontColor = "#ffffff",
        fontFamily = "Inter",
        fontColor = "#171717",
    } = appearance;

    // Background Logic
    let bgClass = "bg-white"; 
    const bgLayerStyle = {
        transition: 'all 0.5s ease',
    };
    
    // Roundness Logic
    const roundnessMap = {
        "none": "rounded-none",
        "md": "rounded-md",
        "lg": "rounded-lg",
        "xl": "rounded-2xl",
        "full": "rounded-full"
    };
    const roundnessClass = roundnessMap[buttonRoundness] || "rounded-2xl";

    if (bgType === "color") {
        bgLayerStyle.backgroundColor = bgColor;
    } else if (bgType === "image" && bgImage) {
        bgLayerStyle.backgroundImage = `url(${bgImage})`;
        bgLayerStyle.backgroundSize = "cover";
        bgLayerStyle.backgroundPosition = "center";
        bgLayerStyle.filter = `blur(${bgBlur}px)`;
        // Note: transform scale needed to prevent white edges when blurring? 
        // For simplicity, we assume blur is small or image is large.
        if(bgBlur > 0) bgLayerStyle.transform = "scale(1.05)"; 
    } else if (bgType === "gradient") {
         if (bgGradient.includes("bg-") || bgGradient.includes("[")) {
            bgClass = bgGradient;
        } else {
            bgClass = `bg-gradient-to-br ${bgGradient}`;
        }
    }

    // Button Style Logic
    const getButtonStyle = () => {
        const base = { 
            border: "none", 
            boxShadow: "none",
            backdropFilter: "blur(0px)",
        };

        if (buttonStyle === "fill") return { ...base, backgroundColor: buttonColor, color: buttonFontColor };
        
        if (buttonStyle === "outline") return { 
            ...base, 
            backgroundColor: "transparent", 
            border: `2px solid ${buttonColor}`, 
            color: buttonColor 
        };
        
        if (buttonStyle === "soft") return { 
            ...base, 
            backgroundColor: buttonColor.startsWith("#") ? `${buttonColor}15` : buttonColor, 
            // Fallback for non-hex if somehow it creeps in, though themes.js is fixed.
            color: buttonColor,
            backdropFilter: "blur(10px)",
        };
        
        if (buttonStyle === "shadow") return { 
            ...base, 
            backgroundColor: buttonColor, 
            color: buttonFontColor, 
            boxShadow: `6px 6px 0px 0px ${fontColor}20`,
            transform: "translate(-2px, -2px)"
        };
        
        if (buttonStyle === "hard-shadow") return { 
            ...base, 
            backgroundColor: buttonColor, 
            color: buttonFontColor, 
            border: `2px solid ${fontColor}`, 
            boxShadow: `6px 6px 0px 0px ${fontColor}` 
        };

        return base;
    };
    const btnStyle = getButtonStyle();

    const handleLinkClick = (e, link) => {
        if (mode === "preview") { e.preventDefault(); return; }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
    };

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
             {/* 1. Background Layer */}
            <div 
                className={`absolute inset-0 z-0 ${bgClass}`} 
                style={bgLayerStyle} 
            />

            {/* 2. Overlay Layer (Black Opacity) */}
            <div 
                className="absolute inset-0 z-0 bg-black pointer-events-none transition-opacity duration-300" 
                style={{ opacity: bgOverlay }} 
            />

            {/* 3. Noise Texture */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-repeat" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>

            {/* 4. Scrollable Content Area */}
            <div 
                className="relative z-10 w-full h-full overflow-y-auto no-scrollbar scroll-smooth px-4 sm:px-6 pt-20 pb-32"
                style={{ fontFamily, color: fontColor }}
            >
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="w-full max-w-[480px] mx-auto flex flex-col items-center"
                >
                     {/* Avatar */}
                     <motion.div variants={itemVariants} className="mb-6 group relative">
                        {user.image ? (
                            <div className="relative">
                                <img 
                                    src={user.image} 
                                    alt="Profile" 
                                    className="w-28 h-28 rounded-full object-cover shadow-2xl ring-4 ring-white/10 mx-auto transition-transform duration-500 group-hover:scale-105" 
                                />
                                 {/* Subtle glow behind avatar */}
                                <div 
                                    className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 -z-10"
                                ></div>
                            </div>
                        ) : (
                            <div 
                                className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl ring-4 ring-white/10 mx-auto" 
                                style={{ backgroundColor: buttonColor, color: buttonFontColor }}
                            >
                                {initial}
                            </div>
                        )}
                     </motion.div>
    
                    {/* Username */}
                    <motion.div variants={itemVariants} className="text-center mb-2">
                        <h3 className="text-xl font-bold tracking-tight flex items-center justify-center gap-2">
                            @{user.username}
                            <TickBadge tier={user.plan === "pro" ? "pro" : "free"} />
                        </h3>
                    </motion.div>
    
                    {/* Bio */}
                    {user.bio && (
                        <motion.p variants={itemVariants} className="text-base text-center mb-10 leading-relaxed opacity-90 max-w-[90%] font-medium">
                            {user.bio}
                        </motion.p>
                    )}
    
                    {/* Links List */}
                    <div className="w-full flex flex-col gap-4 pb-12">
                        {activeLinks.filter(l => !l.parentId).map((link) => {
                            
                            // COLLECTION
                            if (link.type === "collection") {
                                const children = activeLinks.filter(c => c.parentId === link._id);
                                const isExpanded = expanded[link._id];
    
                                return (
                                    <motion.div variants={itemVariants} key={link._id} className="w-full">
                                        <button
                                            onClick={(e) => toggleCollection(link._id, e)}
                                            className={`w-full relative overflow-hidden flex items-center gap-4 px-5 py-4.5 ${roundnessClass} transition-all active:scale-[0.98] z-10 group`}
                                            style={btnStyle}
                                        >
                                            <div className="shrink-0 flex items-center justify-center">
                                                {link.icon ? (
                                                    <LinkFavicon url={link.url} icon={link.icon} size={24} />
                                                ) : (
                                                    <div className="opacity-80">
                                                        {isExpanded ? <FolderOpen className="w-6 h-6"/> : <FolderClosed className="w-6 h-6"/>}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 text-left min-w-0">
                                                <span className="block font-bold tracking-tight truncate text-lg">
                                                    {link.title}
                                                </span>
                                            </div>
                                            <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} style={{ color: 'currentColor' }}>
                                                <ChevronDown className="w-5 h-5 opacity-70" />
                                            </div>
                                        </button>
    
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="flex flex-col gap-3 pl-6 mt-3 border-l-2 border-white/10 ml-6 py-1">
                                                        {children.map((child) => (
                                                            <a
                                                                key={child._id}
                                                                href={mode === 'public' ? `${import.meta.env.VITE_API_URL}/api/links/${child._id}/redirect` : '#'}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                onClick={(e) => handleLinkClick(e, child)}
                                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                                                style={{ color: fontColor }}
                                                            >
                                                                <LinkFavicon url={child.url} icon={child.icon} size={20} />
                                                                <span className="text-sm font-semibold truncate">{child.title}</span>
                                                                <ExternalLink className="w-3 h-3 opacity-40 ml-auto" />
                                                            </a>
                                                        ))}
                                                        {children.length === 0 && <div className="text-xs opacity-50 py-2 italic pl-2">Empty Collection</div>}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )
                            }
    
                            // STANDARD LINK
                            return (
                                <motion.a
                                    variants={itemVariants}
                                    key={link._id}
                                    href={mode === 'public' ? `${import.meta.env.VITE_API_URL}/api/links/${link._id}/redirect` : '#'}
                                    target="_blank" rel="noreferrer"
                                    onClick={(e) => handleLinkClick(e, link)}
                                    className={`group flex items-center gap-4 px-5 py-4.5 ${roundnessClass} transition-all active:scale-[0.98] hover:scale-[1.01] hover:shadow-lg relative overflow-hidden`}
                                    style={btnStyle}
                                >
                                    {/* Hover Sheen Effect for standard fills */}
                                    {buttonStyle === 'fill' && (
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none skew-x-12"></div>
                                    )}
    
                                    <div className="shrink-0 flex items-center justify-center">
                                         <LinkFavicon url={link.url} icon={link.icon} size={24} />
                                    </div>
                                    
                                    <span className="flex-1 font-bold tracking-tight text-center pr-10 truncate text-lg">
                                        {link.title}
                                    </span>
                                </motion.a>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LivePreview;
