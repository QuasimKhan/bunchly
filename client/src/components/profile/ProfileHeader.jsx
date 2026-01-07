
import React from 'react';
import { Camera, Calendar, Mail } from 'lucide-react';
import TickBadge from '../ui/TickBadge';

const ProfileHeader = ({ user, onEditImage }) => {
    // Determine gradient based on plan
    const isPro = user.plan === 'pro';
    const gradientClass = isPro 
        ? "from-indigo-500 via-purple-500 to-pink-500" 
        : "from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900";

    return (
        <div className="relative mb-12">
            {/* Banner/Background (Optional flair) */}
            <div className={`h-32 w-full rounded-t-[2.5rem] bg-gradient-to-r ${gradientClass} opacity-20 dark:opacity-10 absolute top-0 left-0 -z-10`} />

            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 px-6 sm:px-10 pt-16">
                
                {/* 1. Avatar Section */}
                <div className="relative group shrink-0">
                    <div className={`relative p-1.5 rounded-[2rem] bg-white dark:bg-[#0a0a0a] shadow-2xl`}>
                        <div className={`rounded-[1.7rem] overflow-hidden w-32 h-32 sm:w-40 sm:h-40 relative bg-neutral-100 dark:bg-neutral-900`}>
                            <img
                                src={user.image || "/default-avatar.png"}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay on hover */}
                            <div 
                                onClick={onEditImage}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                            >
                                <Camera className="w-8 h-8 text-white/90 drop-shadow-md" />
                            </div>
                        </div>
                    </div>
                    {/* Floating Edit Button (Mobile Friendly) */}
                    <button
                        onClick={onEditImage}
                        className="absolute bottom-2 -right-2 p-2.5 rounded-full bg-white dark:bg-neutral-800 shadow-lg border border-neutral-100 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:scale-110 active:scale-95 transition-all sm:hidden"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                </div>

                {/* 2. Identity Section */}
                <div className="flex-1 text-center sm:text-left pb-2">
                    <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-4 mb-2">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            {user.name}
                        </h1>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20">
                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                {user.plan}
                            </span>
                            {isPro && <TickBadge tier="pro" className="w-4 h-4" />}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-y-2 gap-x-6 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                        <span className="flex items-center gap-1.5">
                            <span className="text-neutral-300 dark:text-neutral-600">@</span>
                            {user.username}
                        </span>
                        
                        <span className="hidden sm:inline w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        
                        <span className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4 opacity-70" />
                            {user.email}
                        </span>

                        <span className="hidden sm:inline w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />

                        <span className="flex items-center gap-1.5 opacity-80">
                            <Calendar className="w-4 h-4 opacity-70" />
                            Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* 3. Action / Status (Optional) */}
            </div>
        </div>
    );
};

export default ProfileHeader;
