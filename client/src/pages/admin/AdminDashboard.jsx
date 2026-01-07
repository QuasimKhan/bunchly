import { useEffect, useState } from "react";
import { Users, Link as LinkIcon, DollarSign, Activity, TrendingUp, Trophy } from "lucide-react";
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

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState({ userGrowth: [], revenue: [] });
    const [recentUsers, setRecentUsers] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
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
            <header>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Admin Overview</h1>
                <p className="text-neutral-500 text-sm">Deep insights and platform management.</p>
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
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" strokeOpacity={0.1} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(val) => new Date(val).getDate()}
                                />
                                <YAxis 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: "#1F2937", 
                                        borderRadius: "8px", 
                                        border: "none", 
                                        color: "#fff" 
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#6366f1" 
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
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" strokeOpacity={0.1} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(val) => new Date(val).getDate()}
                                />
                                <YAxis 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(val) => `₹${val}`}
                                />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{ 
                                        backgroundColor: "#1F2937", 
                                        borderRadius: "8px", 
                                        border: "none", 
                                        color: "#fff" 
                                    }}
                                    formatter={(val) => [`₹${val}`, "Revenue"]}
                                />
                                <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50 dark:bg-white/5">
                                <tr className="text-left text-neutral-500">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Plan</th>
                                    <th className="px-6 py-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-white/5">
                                {recentUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02]">
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                user.plan === 'pro' 
                                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                                    : 'bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-400'
                                            }`}>
                                                {user.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500">
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
    const colors = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
        green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    };

    return (
        <div className="bg-white dark:bg-[#15151A] rounded-2xl p-6 border border-neutral-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-neutral-500 mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">{value}</h3>
                    {subtext && <p className="text-xs text-neutral-400 mt-1 font-medium">{subtext}</p>}
                </div>
                <div className={`p-3 rounded-xl ${colors[color]} ring-1 ring-inset ring-black/5 dark:ring-white/10`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
