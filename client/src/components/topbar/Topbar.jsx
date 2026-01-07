import { Menu, Share2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { navItems } from "../../constants/navItems";
import Button from "../ui/Button";

const Topbar = ({ toggleSidebar }) => {
    const location = useLocation();
    
    // Determine current page title
    const currentItem = navItems.find(item => item.href === location.pathname);
    const title = currentItem ? currentItem.label : "Dashboard";

    return (
        <header
            className="
                sticky top-0 z-30
                w-full px-8 py-4
                bg-[#F5F6FA]/80 dark:bg-[#0F0F14]/80
                backdrop-blur-xl border-b border-transparent
                flex items-center justify-between
            "
        >
            {/* Left side */}
            <div className="flex items-center gap-4">
                {/* Hamburger for mobile */}
                <button
                    className="lg:hidden p-2 -ml-2 text-neutral-600 dark:text-neutral-300"
                    onClick={toggleSidebar}
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                        {title}
                    </h1>
                </div>
            </div>

            {/* Right side Actions (Contextual) */}
            <div className="flex items-center gap-3">
                 <a 
                    href={`/${useAuth().user?.username}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="
                        hidden sm:flex items-center gap-2 px-4 py-2 
                        bg-white dark:bg-neutral-900 
                        border border-neutral-200 dark:border-neutral-800 
                        rounded-full text-sm font-semibold
                        text-neutral-700 dark:text-neutral-300
                        hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400
                        transition-all shadow-sm
                    "
                 >
                    <span>My Bunchly</span>
                    <Share2 className="w-3.5 h-3.5" />
                 </a>
            </div>
        </header>
    );
};

// Start import in replacement
import { useAuth } from "../../context/AuthContext";

export default Topbar;
