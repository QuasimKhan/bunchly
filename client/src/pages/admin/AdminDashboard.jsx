import { useEffect, useState } from "react";
import { Users, Link as LinkIcon, DollarSign, Activity, TrendingUp, Trophy, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar 
} from "recharts";
import { useSEO } from "../../hooks/useSEO";
import { buildUrl } from "../../lib/seo";

const AdminDashboard = () => {
    useSEO({
        title: "Admin Dashboard – Bunchly",
        description: "Admin overview.",
        noIndex: true, // Internal page
        url: buildUrl("/admin"),
    });

    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState({ userGrowth: [], revenue: [] });
    const [recentUsers, setRecentUsers] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setRefreshing(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
                setCharts(data.charts);
                setRecentUsers(data.recentUsers);
                setTopUsers(data.topUsers || []);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load admin stats");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
             <div className="flex h-[calc(100vh-100px)] items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Admin Overview</h1>
                    <p className="text-neutral-500 text-sm">Deep insights and platform management.</p>
                </div>
                <button 
                    onClick={fetchStats} 
                    disabled={refreshing}
                    className={`p-2 rounded-xl bg-white dark:bg-[#15151A] border border-neutral-200 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all ${refreshing ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm"}`}
                    title="Refresh Stats"
                >
                    <RefreshCcw className={`w-5 h-5 text-neutral-600 dark:text-neutral-400 ${refreshing ? "animate-spin" : ""}`} />
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    label="Total Users" 
                    value={stats?.totalUsers || 0} 
                    icon={Users} 
                    color="blue"
                    subtext={`${stats?.proUsers} Pro Users`}
                />
                <StatCard 
                    label="Total Links" 
                    value={stats?.totalLinks || 0} 
                    icon={LinkIcon} 
                    color="indigo" 
                />
                <StatCard 
                    label="Total Revenue" 
                    value={`₹${stats?.totalRevenue?.toLocaleString()}`} 
                    icon={DollarSign} 
                    color="green" 
                />
                 <StatCard 
                    label="System Health" 
                    value="98%" 
                    icon={Activity} 
                    color="purple" 
                    subtext="All systems operational"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="bg-white dark:bg-[#15151A] rounded-2xl p-6 border border-neutral-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                             <TrendingUp className="w-5 h-5 text-indigo-500" /> User Growth
                        </h3>
                         <span className="text-xs font-medium text-neutral-400">Last 30 Days</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={charts?.userGrowth}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" strokeOpacity={0.05} vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(val) => new Date(val).getDate()}
                                    dy={10}
                                />
                                <YAxis 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    dx={-10}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: "rgba(17, 17, 26, 0.9)", 
                                        borderRadius: "12px", 
                                        border: "1px solid rgba(255,255,255,0.1)", 
                                        color: "#fff",
                                        backdropFilter: "blur(4px)"
                                    }}
                                    itemStyle={{ color: "#818cf8" }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#6366f1" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorUsers)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white dark:bg-[#15151A] rounded-2xl p-6 border border-neutral-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                         <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                             <DollarSign className="w-5 h-5 text-green-500" /> Revenue Trend
                        </h3>
                        <span className="text-xs font-medium text-neutral-400">Last 30 Days</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts?.revenue}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8}/>
                                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0.3}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" strokeOpacity={0.05} vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(val) => new Date(val).getDate()}
                                    dy={10}
                                />
                                <YAxis 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(val) => `₹${val}`}
                                    dx={-10}
                                />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                                    contentStyle={{ 
                                        backgroundColor: "rgba(17, 17, 26, 0.9)", 
                                        borderRadius: "12px", 
                                        border: "1px solid rgba(255,255,255,0.1)", 
                                        color: "#fff",
                                        backdropFilter: "blur(4px)"
                                    }}
                                    formatter={(val) => [`₹${val}`, "Revenue"]}
                                />
                                <Bar dataKey="amount" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Users List (2/3 width) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-200 dark:border-white/5 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Recent Signups</h2>
                    </div>
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50/50 dark:bg-white/5 text-xs uppercase font-bold text-neutral-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-xl">User</th>
                                    <th className="px-6 py-4 hidden sm:table-cell">Email</th>
                                    <th className="px-6 py-4">Plan</th>
                                    <th className="px-6 py-4 hidden sm:table-cell rounded-tr-xl">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                                {recentUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors group cursor-default">
                                        <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500 hidden sm:table-cell">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                                user.plan === 'pro' 
                                                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800'
                                                    : 'bg-neutral-50 text-neutral-500 border-neutral-200 dark:bg-white/5 dark:text-neutral-400 dark:border-white/10'
                                            }`}>
                                                {user.plan === 'pro' && <TrendingUp className="w-3 h-3 mr-1" />}
                                                {user.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-400 hidden sm:table-cell font-mono text-xs">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Users Widget (1/3 width) */}
                <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-sm flex flex-col">
                    <div className="p-6 border-b border-neutral-200 dark:border-white/5">
                         <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" /> Top Profiles
                        </h2>
                    </div>
                    <div className="p-4 space-y-4 overflow-y-auto flex-1 h-full max-h-[400px]">
                        {topUsers.length === 0 ? (
                            <div className="text-center text-neutral-500 py-10">No data available</div>
                        ) : (
                            topUsers.map((user, idx) => (
                                <div key={user._id} className="flex items-center gap-4 p-3 hover:bg-neutral-50 dark:hover:bg-white/[0.04] rounded-xl transition-colors group">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                        ${idx === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500' : 
                                          idx === 1 ? 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400' :
                                          idx === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-500' :
                                          'bg-neutral-100 text-neutral-500 dark:bg-white/10 dark:text-neutral-500'}
                                    `}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-neutral-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                                                {user.name}
                                            </h4>
                                            <span className="text-xs font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                                                {user.profileViews || 0} views
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-500 truncate">@{user.username}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color, subtext }) => {
    const styles = {
        blue: "from-blue-500 to-cyan-500 shadow-blue-500/20",
        indigo: "from-indigo-500 to-violet-500 shadow-indigo-500/20",
        green: "from-emerald-500 to-teal-500 shadow-emerald-500/20",
        purple: "from-fuchsia-500 to-pink-500 shadow-fuchsia-500/20",
    };

    const iconStyles = {
        blue: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
        indigo: "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10",
        green: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
        purple: "text-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-500/10",
    };

    return (
        <div className="group bg-white dark:bg-[#15151A] rounded-2xl p-6 border border-neutral-200 dark:border-white/5 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            {/* Hover Gradient Effect */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${styles[color]} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity rounded-full -mr-16 -mt-16 pointer-events-none`}></div>

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-sm font-semibold text-neutral-500 mb-1.5">{label}</p>
                    <h3 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tighter">{value}</h3>
                    {subtext && <p className="text-xs text-neutral-400 mt-2 font-medium flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        {subtext}
                    </p>}
                </div>
                <div className={`p-3.5 rounded-xl ${iconStyles[color]} ring-1 ring-inset ring-black/5 dark:ring-white/5 transition-transform group-hover:scale-110 duration-300`}>
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
