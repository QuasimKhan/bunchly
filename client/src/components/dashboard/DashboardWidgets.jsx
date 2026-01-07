import React from 'react';
import { 
    Calendar, 
    BarChart3, 
    TrendingUp, 
    MousePointer2, 
    ArrowUpRight, 
    Link as LinkIcon, 
    ExternalLink,
    Plus 
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ================= WELCOME HEADER ================= */
export const WelcomeHeader = ({ user }) => {
    const time = new Date();
    const hours = time.getHours();
    let greeting = "Good morning";
    if (hours >= 12 && hours < 17) greeting = "Good afternoon";
    if (hours >= 17) greeting = "Good evening";

    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateStr = time.toLocaleDateString('en-US', dateOptions);

    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4" />
                    {dateStr}
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {greeting}, {user.name?.split(" ")[0]} 
                    <span className="inline-block ml-2 animate-wave">👋</span>
                </h1>
            </div>
            
            <div className="flex items-center gap-3">
                 <Link 
                    to="/dashboard/links" 
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-medium text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Link
                </Link>
                <a 
                    href={`/${user.username}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-white/20 transition-all font-medium text-sm"
                >
                    <ExternalLink className="w-4 h-4" />
                    View Profile
                </a>
            </div>
        </div>
    );
};

/* ================= QUICK STATS ================= */
export const QuickStats = ({ analytics, loading }) => {
    if (loading) return <QuickStatsSkeleton />;
    
    // Fallback if analytics fetch fails or is locked
    const data = analytics || { profileViews: 0, totalClicks: 0, ctr: 0 };
    const ctr = data.profileViews > 0 
        ? Math.round((data.totalClicks / data.profileViews) * 100) 
        : 0;

    return (
        <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard 
                label="Profile Views" 
                value={data.profileViews} 
                icon={BarChart3} 
                color="blue"
            />
            <StatCard 
                label="Total Clicks" 
                value={data.totalClicks} 
                icon={MousePointer2} 
                color="indigo"
            />
            <StatCard 
                label="Click Rate" 
                value={`${ctr}%`} 
                icon={TrendingUp} 
                color="purple"
            />
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
    };

    return (
        <div className="bg-white dark:bg-[#0A0A0A] p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-gray-200 dark:hover:border-white/10 transition-colors">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
                <Icon className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
    );
};

const QuickStatsSkeleton = () => (
    <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
        ))}
    </div>
);

/* ================= RECENT LINKS ================= */
export const RecentLinks = ({ links, loading }) => {
    if (loading) return <div className="animate-pulse h-40 bg-gray-100 dark:bg-white/5 rounded-2xl" />;

    const recent = links ? [...links].sort((a,b) => b.createdAt - a.createdAt).slice(0, 3) : [];

    return (
        <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white">Recent Links</h3>
                <Link to="/dashboard/links" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                    Manage all
                </Link>
            </div>

            <div className="space-y-3">
                {recent.length > 0 ? recent.map(link => (
                    <div key={link._id} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            <LinkIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{link.title}</p>
                            <p className="text-xs text-gray-500 truncate">{link.url}</p>
                        </div>
                        <div className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                            {link.clicks} clicks
                        </div>
                    </div>
                )) : (
                    <p className="text-sm text-gray-500 text-center py-4">No links created yet.</p>
                )}
            </div>
        </div>
    );
};
