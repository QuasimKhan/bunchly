import { useEffect, useRef, useState } from "react";
import Button from "./Button";

export default function UserMenu({ user, items = [] }) {
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
        };

        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    // Helper to run actions + close menu
    const handleClick = (action) => {
        setOpenMenu(false);
        if (typeof action === "function") action();
    };

    return (
        <div ref={menuRef} className="relative">
            {/* Avatar Button */}
            <div
                onClick={() => setOpenMenu((p) => !p)}
                className="cursor-pointer active:scale-95"
            >
                {user.image ? (
                    <img
                        src={user.image}
                        className="w-10 h-10 rounded-full object-cover border shadow"
                    />
                ) : (
                    <div
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 
                                   flex items-center justify-center text-white font-bold uppercase"
                    >
                        {user?.name?.[0] || user?.email?.[0]}
                    </div>
                )}
            </div>

            {/* Dropdown */}
            {openMenu && (
                <div
                    className="
                        absolute top-12 right-0 w-48 p-3
                        bg-white dark:bg-gray-900 
                        rounded-xl shadow-xl border 
                        animate-scaleIn z-50
                    "
                >
                    {/* Top info */}
                    <p className="font-semibold">{user?.name || user?.email}</p>
                    <hr className="my-3 opacity-30" />

                    {/* Dynamic Items */}
                    <div className="flex flex-col gap-2">
                        {items.map((item, index) => (
                            <Button
                                key={index}
                                text={item.label}
                                fullWidth
                                size="sm"
                                variant={item.variant || "default"}
                                onClick={() => handleClick(item.action)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
