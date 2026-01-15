import React from 'react';
import { 
    Calendar, 
    BarChart3, 
    TrendingUp, 
    MousePointer2, 
    Link as LinkIcon, 
    ExternalLink,
    Plus 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';

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
    
    const data = analytics || { profileViews: 0, totalClicks: 0, ctr: 0, history: [] };
    const ctr = data.profileViews > 0 
        ? Math.round((data.totalClicks / data.profileViews) * 100) 
        : 0;

    return (
        <div className="space-y-6 mb-8">
            <div className="grid grid-cols-3 gap-4">
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

            {/* Performance Chart */}
            <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                         <h3 className="font-bold text-gray-900 dark:text-white">Traffic History</h3>
                         <p className="text-sm text-gray-500">Views over last period</p>
                    </div>
                </div>
                <div className="h-[200px] w-full">
                    {data.history && data.history.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.history}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 12, fill: '#9CA3AF'}} 
                                    dy={10}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: "#0A0A0A", 
                                        border: "1px solid rgba(255,255,255,0.1)", 
                                        borderRadius: "12px", 
                                        color: "#fff" 
                                    }}
                                    cursor={{ stroke: '#6366F1', strokeWidth: 1 }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="views" 
                                    stroke="#4f46e5" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorViews)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <BarChart3 className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-sm">No traffic data yet</p>
                        </div>
                    )}
                </div>
            </div>
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
    <div className="space-y-6 mb-8">
        <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
            ))}
        </div>
        <div className="h-[200px] bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse" />
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

/* ================= DETAILED ANALYTICS ================= */
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export const DetailedAnalytics = ({ analytics, loading }) => {
    if (loading) return null;
    if (!analytics) return null;

    const { topCountries, deviceBreakdown, referrerBreakdown, topLinks } = analytics;

    // Small helper for empty states
    const HasData = (arr) => arr && arr.length > 0;

    return (
        <div className="space-y-6 animate-fade-in-up">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Top Locations */}
                <div className="bg-white dark:bg-[#0A0A0A] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top Locations</h3>
                    <div className="h-[200px]">
                        {HasData(topCountries) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topCountries} layout="vertical" margin={{ left: 0, right: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="_id" 
                                        type="category" 
                                        width={80} 
                                        tick={{fontSize: 11, fill: '#9CA3AF'}}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip 
                                        cursor={{fill: 'var(--gray-100)', opacity: 0.1}}
                                        contentStyle={{ backgroundColor: "#0A0A0A", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                                    />
                                    <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20}>
                                        {topCountries.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-sm text-gray-400">No location data</div>
                        )}
                    </div>
                </div>

                {/* 2. Device Breakdown */}
                <div className="bg-white dark:bg-[#0A0A0A] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Devices</h3>
                    <div className="h-[200px] relative">
                         {HasData(deviceBreakdown) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="count"
                                        nameKey="_id"
                                    >
                                        {deviceBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: "#0A0A0A", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
                                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                         ) : (
                            <div className="h-full flex items-center justify-center text-sm text-gray-400">No device data</div>
                         )}
                    </div>
                </div>
            </div>

            {/* 3. Top Links & Referrers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Top Links */}
                 <div className="bg-white dark:bg-[#0A0A0A] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top Performing Links</h3>
                    <div className="space-y-3">
                        {HasData(topLinks) ? topLinks.slice(0, 5).map(link => (
                            <div key={link._id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                    <div className="truncate">
                                        <p className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{link.title || 'Untitled'}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{link.url}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md">
                                    {link.clicks}
                                </span>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-400 text-center py-4">No clicks yet</p>
                        )}
                    </div>
                </div>

                {/* Referrers */}
                 <div className="bg-white dark:bg-[#0A0A0A] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top Referrers</h3>
                    <div className="space-y-3">
                        {HasData(referrerBreakdown) ? referrerBreakdown.slice(0, 5).map((ref, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm border-b border-gray-50 dark:border-white/5 last:border-0 pb-2 last:pb-0">
                                <span className="text-gray-600 dark:text-gray-300 font-medium">{ref._id || 'Direct / Unknown'}</span>
                                <span className="text-gray-900 dark:text-white font-bold">{ref.count}</span>
                            </div>
                        )) : (
                             <p className="text-sm text-gray-400 text-center py-4">No referrer data</p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};
