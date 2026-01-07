
import React from 'react';
import { ICONS } from "../../lib/iconPalette";
import { ExternalLink, FolderOpen, FolderClosed, ChevronDown } from "lucide-react";
import TickBadge from "../ui/TickBadge";
import LinkFavicon from "../link-card/LinkFavicon"; 

/**
 * Reusable Live Preview Component (Stateless UI)
 * - Used in: PreviewModal, LivePreviewPanel (Dashboard)
 */
export const LivePreview = ({
    user = {},
    links = [],
    mode = "preview", // 'preview' (interactive accordion) or 'public' (actual links)
    className = ""
}) => {
    // We maintain 'expanded' state locally for the preview interactivity
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

    // 🎨 Appearance Extractor
    const appearance = user.appearance || {};
    const {
        bgType = "color",
        bgColor = "#ffffff",
        bgGradient = "from-indigo-500 to-purple-600",
        bgImage = "",
        buttonStyle = "fill",
        buttonColor = "#171717",
        buttonFontColor = "#ffffff",
        fontFamily = "Inter",
        fontColor = "#171717",
    } = appearance;

    // 🎨 Dynamic CSS
    const textStyle = { fontFamily, color: fontColor };
    
    // Background Logic
    const containerStyle = { ...textStyle };
    let bgClass = "";
    
    if (bgType === "color") containerStyle.backgroundColor = bgColor;
    else if (bgType === "image" && bgImage) {
        containerStyle.backgroundImage = `url(${bgImage})`;
        containerStyle.backgroundSize = "cover";
        containerStyle.backgroundPosition = "center";
    } else if (bgType === "gradient") {
        bgClass = `bg-gradient-to-br ${bgGradient}`;
    }

    // Button Style Logic (Base Premium Look)
    const getButtonStyle = () => {
        const base = { border: "none", boxShadow: "none" };
        if (buttonStyle === "fill") return { ...base, backgroundColor: buttonColor, color: buttonFontColor };
        if (buttonStyle === "outline") return { ...base, backgroundColor: "transparent", border: `2px solid ${buttonColor}`, color: buttonColor };
        if (buttonStyle === "soft") return { ...base, backgroundColor: `${buttonColor}20`, color: buttonColor };
        if (buttonStyle === "shadow") return { ...base, backgroundColor: buttonColor, color: buttonFontColor, boxShadow: `4px 4px 0px 0px ${fontColor}40` };
        if (buttonStyle === "hard-shadow") return { ...base, backgroundColor: buttonColor, color: buttonFontColor, border: `2px solid ${fontColor}`, boxShadow: `4px 4px 0px 0px ${fontColor}` };
        return base;
    };
    const btnStyle = getButtonStyle();

    const handleLinkClick = (e, link) => {
        if (mode === "preview") { e.preventDefault(); return; }
        // Public click tracking would be handled here
    };

    return (
        <div className={`relative w-full h-full flex flex-col px-6 pt-20 pb-24 overflow-y-auto no-scrollbar scroll-smooth ${bgClass} ${className}`} style={containerStyle}>
             {/* Premium Noise Overlay */}
             <div className="absolute inset-0 z-0 texture-noise opacity-50 mix-blend-overlay pointer-events-none fixed"></div>
             
             {/* Main Content */}
             <div className="relative z-10 w-full max-w-[480px] mx-auto flex flex-col items-center animate-fade-in">
                 {/* Avatar */}
                 {user.image ? (
                    <img src={user.image} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg ring-4 ring-white/20 mx-auto" />
                ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-lg ring-4 ring-white/20 mx-auto" style={{ backgroundColor: buttonColor, color: buttonFontColor }}>
                        {initial}
                    </div>
                )}

                {/* Username */}
                <h3 className="text-lg font-semibold tracking-tight flex items-center justify-center gap-2 mb-1 opacity-90 mx-auto">
                    @{user.username}
                    <TickBadge tier={user.plan === "pro" ? "pro" : "free"} />
                </h3>

                {/* Bio */}
                {user.bio && <p className="text-sm text-center mb-8 leading-relaxed opacity-80 max-w-[90%] mx-auto">{user.bio}</p>}

                {/* Links List */}
                <div className="w-full flex flex-col gap-4 pb-12">
                    {activeLinks.filter(l => !l.parentId).map((link) => {
                        
                        // COLLECTION RENDER
                        if (link.type === "collection") {
                            const children = activeLinks.filter(c => c.parentId === link._id);
                            const isExpanded = expanded[link._id];

                            return (
                                <div key={link._id} className="w-full group/collection">
                                    <button
                                        onClick={(e) => toggleCollection(link._id, e)}
                                        className="w-full relative overflow-hidden flex items-center gap-4 px-5 py-4 rounded-2xl transition-all active:scale-[0.98] z-10 hover:brightness-105"
                                        style={btnStyle}
                                    >
                                        {/* Icon */}
                                        <div className="shrink-0 flex items-center justify-center">
                                            {link.icon ? (
                                                <LinkFavicon url={link.url} icon={link.icon} size={24} />
                                            ) : (
                                                <div className="w-8 h-8 flex items-center justify-center text-current opacity-90">
                                                    {isExpanded ? <FolderOpen className="w-6 h-6"/> : <FolderClosed className="w-6 h-6"/>}
                                                </div>
                                            )}
                                        </div>

                                        {/* Title + Count */}
                                        <div className="flex-1 text-left min-w-0">
                                            <span className="block font-semibold tracking-wide truncate text-lg">
                                                {link.title}
                                            </span>
                                            <span className="text-xs opacity-70 font-medium">
                                                {children.length} Links
                                            </span>
                                        </div>

                                        {/* Arrow */}
                                        <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} style={{ color: 'currentColor' }}>
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </button>

                                    {/* Accordion Body */}
                                    <div className={`
                                        transition-all duration-300 ease-in-out overflow-hidden
                                        ${isExpanded ? "max-h-[800px] opacity-100 mt-2" : "max-h-0 opacity-0"}
                                    `}>
                                        <div className="flex flex-col gap-3 pl-3 sm:pl-4 border-l-2 border-white/20 ml-4 py-2">
                                            {children.map((child) => (
                                                <a
                                                    key={child._id}
                                                    href={
                                                        mode === 'public' 
                                                            ? `${import.meta.env.VITE_API_URL}/api/links/${child._id}/redirect`
                                                            : '#'
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => handleLinkClick(e, child)}
                                                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md border border-white/10 hover:scale-[1.01]"
                                                    style={{ color: fontColor }}
                                                >
                                                    <div className="shrink-0 flex items-center justify-center">
                                                        <LinkFavicon url={child.url} icon={child.icon} size={20} />
                                                    </div>
                                                    <span className="text-sm font-semibold truncate flex-1">{child.title}</span>
                                                    <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                                                </a>
                                            ))}
                                            {children.length === 0 && (
                                                <div className="text-center text-xs opacity-50 py-2 italic">Empty</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        // STANDARD LINK RENDER
                        return (
                            <a
                                key={link._id}
                                href={
                                    mode === 'public' 
                                        ? `${import.meta.env.VITE_API_URL}/api/links/${link._id}/redirect`
                                        : '#'
                                }
                                target="_blank" rel="noreferrer"
                                onClick={(e) => handleLinkClick(e, link)}
                                className="group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all active:scale-[0.98] hover:brightness-105"
                                style={btnStyle}
                            >
                                <div className="shrink-0 flex items-center justify-center">
                                     <LinkFavicon url={link.url} icon={link.icon} size={24} />
                                </div>
                                
                                <span className="flex-1 font-semibold tracking-wide text-center pr-10 truncate text-lg">
                                    {link.title}
                                </span>
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LivePreview;
