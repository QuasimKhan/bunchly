import React from 'react';
import { FolderOpen, FolderClosed, ChevronDown, ExternalLink, ShoppingBag } from "lucide-react";
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
        buttonRoundness = "xl", 
        buttonColor = "#171717",
        buttonFontColor = "#ffffff",
        fontFamily = "Inter",
        fontColor = "#171717",
        profileBorderColor = "", // New
        profileGlowColor = "",   // New
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
        if(bgBlur > 0) bgLayerStyle.transform = "scale(1.05)"; 
    } else if (bgType === "gradient") {
         // Support Tailwind utilities, arbitrary values, AND custom theme classes
         if (bgGradient.includes("bg-") || bgGradient.includes("[") || bgGradient.startsWith("theme-")) {
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
            color: buttonFontColor 
        };
        
        if (buttonStyle === "soft") return { 
            ...base, 
            backgroundColor: buttonColor.startsWith("#") ? `${buttonColor}15` : buttonColor, 
            color: buttonFontColor,
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

    // RENDER BLOCK
    const renderBlock = (link) => {
        // 1. SECTION HEADER
        if (link.type === 'header') {
            return (
                <motion.div variants={itemVariants} className="w-full py-4 text-center">
                    <h2 className="text-lg font-bold opacity-90 tracking-tight" style={{ color: fontColor }}>
                        {link.title}
                    </h2>
                </motion.div>
            );
        }

        // 2. PRODUCT
        if (link.type === 'product') {
            return (
                <motion.a
                    variants={itemVariants}
                    href={mode === 'public' ? `${import.meta.env.VITE_API_URL}/api/links/${link._id}/redirect` : '#'}
                    target="_blank" rel="noreferrer"
                    onClick={(e) => handleLinkClick(e, link)}
                    className={`group w-full flex items-center gap-4 p-3 ${roundnessClass} transition-all active:scale-[0.98] hover:scale-[1.01] hover:shadow-xl relative overflow-hidden bg-white/90 dark:bg-neutral-900/80 backdrop-blur-sm cursor-pointer border border-transparent hover:border-black/5 dark:hover:border-white/10`}
                    style={{ ...btnStyle, padding: '0.75rem' }} 
                >
                    {/* Image */}
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden shadow-inner relative`}>
                        {link.imageUrl ? (
                            <img src={link.imageUrl} alt={link.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-neutral-600">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                        )}
                        {/* Price Badge Overlay */}
                         {link.price && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold text-center py-1">
                                {link.currency === 'INR' ? '₹' : link.currency === 'EUR' ? '€' : link.currency === 'GBP' ? '£' : '$'}{link.price}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col items-start justify-center gap-1.5 h-full">
                        <span className="font-bold text-sm sm:text-lg leading-tight line-clamp-2 text-left tracking-tight">
                            {link.title}
                        </span>
                        
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                                <ShoppingBag className="w-3 h-3" /> Shop
                            </span>
                        </div>
                    </div>
                    
                    {/* CTA Arrow/Icon */}
                    <div className="pr-2 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                         <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                            <ExternalLink className="w-4 h-4" />
                         </div>
                    </div>
                </motion.a>
            );
        }

        // 3. COLLECTION
        if (link.type === 'collection') {
            const children = activeLinks.filter(c => c.parentId === link._id);
            const isExpanded = expanded[link._id];

            return (
                <motion.div variants={itemVariants} className="w-full">
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
                                <div className="flex flex-col gap-3 pl-4 mt-3 border-l-2 border-white/10 ml-6 py-1">
                                    {children.map((child) => (
                                       <div key={child._id} className="w-full">
                                            {/* Reuse renderBlock logic but strip outer motion.div variants if recursing to avoid double animation triggering unexpectedly or just inline logic */}
                                            {/* Simplified for children to be a bit smaller/denser usually */}
                                            {renderChildBlock(child)}
                                       </div>
                                    ))}
                                    {children.length === 0 && <div className="text-xs opacity-50 py-2 italic pl-2">Empty Collection</div>}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            );
        }

        // 4. STANDARD LINK
        return (
            <motion.a
                variants={itemVariants}
                href={mode === 'public' ? `${import.meta.env.VITE_API_URL}/api/links/${link._id}/redirect` : '#'}
                target="_blank" rel="noreferrer"
                onClick={(e) => handleLinkClick(e, link)}
                className={`group flex items-center gap-4 px-5 py-4.5 ${roundnessClass} transition-all active:scale-[0.98] hover:scale-[1.01] hover:shadow-lg relative overflow-hidden`}
                style={btnStyle}
            >
                {/* Hover Sheen */}
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
    };

    // Helper for nested blocks (slightly different styling or same?)
    // For now, let's reuse generally, but maybe smaller?
    const renderChildBlock = (link) => {
        if (link.type === 'product') {
            return (
                 <a
                    href={mode === 'public' ? `${import.meta.env.VITE_API_URL}/api/links/${link._id}/redirect` : '#'}
                    target="_blank" rel="noreferrer"
                    onClick={(e) => handleLinkClick(e, link)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors bg-white/5 cursor-pointer group"
                    style={{ color: fontColor }}
                >
                     <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden shrink-0 border border-black/5 shadow-sm relative">
                        {link.imageUrl ? (
                             <img src={link.imageUrl} alt={link.title} className="w-full h-full object-cover transition-transform group-hover:scale-110"/>
                        ) : (
                             <ShoppingBag className="w-5 h-5 m-auto text-neutral-400"/>
                        )}
                        {/* Tiny Price Tag */}
                        {link.price && (
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold text-center leading-none py-0.5">
                                {link.currency === 'INR' ? '₹' : '$'}{link.price}
                            </div>
                        )}
                     </div>
                     <div className="flex-1 min-w-0">
                         <div className="text-sm font-semibold truncate group-hover:underline decoration-white/30 underline-offset-2">{link.title}</div>
                         <div className="text-[10px] opacity-70 uppercase tracking-wider flex items-center gap-1">
                            Shop
                         </div>
                     </div>
                     <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                </a>
            );
        }
        if (link.type === 'header') return null; // Headers inside collections? Maybe support, maybe not. Let's hide for now or show as text.
        
        // Standard Link Child
        return (
            <a
                href={mode === 'public' ? `${import.meta.env.VITE_API_URL}/api/links/${link._id}/redirect` : '#'}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => handleLinkClick(e, link)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                style={{ color: fontColor }}
            >
                <LinkFavicon url={link.url} icon={link.icon} size={20} />
                <span className="text-sm font-semibold truncate">{link.title}</span>
                <ExternalLink className="w-3 h-3 opacity-40 ml-auto" />
            </a>
        );
    };

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
             {/* 1. Background Layer */}
            <div 
                className={`${mode === 'public' ? 'fixed' : 'absolute'} inset-0 z-0 ${bgClass}`} 
                style={bgLayerStyle} 
            />

            {/* 2. Overlay Layer (Black Opacity) */}
            <div 
                className={`${mode === 'public' ? 'fixed' : 'absolute'} inset-0 z-0 bg-black pointer-events-none transition-opacity duration-300`} 
                style={{ opacity: bgOverlay }} 
            />

            {/* 3. Noise Texture */}
            <div className={`${mode === 'public' ? 'fixed' : 'absolute'} inset-0 z-0 opacity-[0.03] pointer-events-none bg-repeat`} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>

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
                            <div className="relative p-1 rounded-full">
                                {/* Profile Glow Config */}
                                <img 
                                    src={user.image} 
                                    alt="Profile" 
                                    className="w-28 h-28 rounded-full object-cover shadow-2xl mx-auto transition-transform duration-500 group-hover:scale-105 relative z-10" 
                                    style={{ 
                                        border: profileBorderColor ? `3px solid ${profileBorderColor}` : '3px solid rgba(255,255,255,0.1)',
                                    }}
                                />
                                 {/* Custom Glow behind avatar */}
                                 {profileGlowColor && (
                                     <div 
                                        className={`absolute -inset-4 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 -z-10`}
                                        style={{ 
                                            background: !profileGlowColor.startsWith('bg-') ? profileGlowColor : undefined 
                                        }}
                                    >
                                        {profileGlowColor.startsWith('bg-') && <div className={`w-full h-full ${profileGlowColor}`}></div>}
                                    </div>
                                 )}
                            </div>
                        ) : (
                            <div 
                                className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl ring-4 ring-white/10 mx-auto" 
                                style={{ 
                                    backgroundColor: buttonColor, 
                                    color: buttonFontColor,
                                    border: profileBorderColor ? `3px solid ${profileBorderColor}` : 'none'
                                }}
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
                        {activeLinks.filter(l => !l.parentId).map((link) => (
                             <React.Fragment key={link._id}>
                                {renderBlock(link)}
                             </React.Fragment>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LivePreview;
