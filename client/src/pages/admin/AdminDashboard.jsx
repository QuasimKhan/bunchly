import { useEffect, useState } from "react";
import { 
    Users, Link as LinkIcon, DollarSign, Activity, TrendingUp, Trophy, 
    RefreshCcw, Calendar, ArrowRight, ArrowUpRight, ArrowDownRight, 
    Sparkles, MoreHorizontal, ShieldCheck, Mail,
    AmpersandIcon
} from "lucide-react";
import { toast } from "sonner";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, ReferenceLine 
} from "recharts";
import { useSEO } from "../../hooks/useSEO";
import { buildUrl } from "../../lib/seo";
import AdminDashboardSkeleton from "../../components/skeletons/AdminDashboardSkeleton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
    useSEO({
        title: "Admin Dashboard – Bunchly",
        description: "Admin overview.",
        noIndex: true,
        url: buildUrl("/admin"),
    });

    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState({ userGrowth: [], revenue: [] });
    const [recentUsers, setRecentUsers] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Greeting Logic
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        if (!loading) setRefreshing(true);
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

    if (loading) return <AdminDashboardSkeleton />;

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {/* Premium Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-5 h-5 text-amber-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Admin Console</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                        {greeting}, {user?.name || "Admin"}
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
                        Here's your daily platform performance summary.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-white/5 rounded-xl text-sm font-bold text-neutral-600 dark:text-neutral-300 shadow-sm">
                        <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                        <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>

                    <button 
                        onClick={fetchStats} 
                        disabled={refreshing}
                        className={`
                            p-2.5 rounded-xl bg-indigo-600 text-white shadow-lg
                            hover:bg-indigo-700 hover:shadow-indigo-500/40 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-indigo-500/50 
                            ${refreshing ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}
                        `}
                        title="Refresh Stats"
                    >
                        <RefreshCcw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </header>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    label="Total Users" 
                    value={stats?.totalUsers || 0} 
                    icon={Users} 
                    trend={"+12%"}
                    status="success"
                    color="blue"
                    chartData={[40, 30, 45, 50, 60, 75, 80]}
                />
                <StatCard 
                    label="Pro Subscribers" 
                    value={stats?.proUsers || 0} 
                    icon={ShieldCheck} 
                    trend={"+5%"}
                    status="neutral"
                    color="purple" 
                    chartData={[20, 25, 30, 28, 35, 40, 42]}
                />
                <StatCard 
                    label="Total Revenue" 
                    value={`₹${stats?.totalRevenue?.toLocaleString()}`} 
                    icon={DollarSign} 
                    trend={"+24%"}
                    status="success"
                    color="emerald" 
                    chartData={[1000, 1500, 1200, 1800, 2000, 2400, 2800]}
                />
                 <StatCard 
                    label="System Health" 
                    value="99.9%" 
                    icon={Activity} 
                    color="amber" 
                    subtext="All systems operational"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="bg-white dark:bg-[#121212] rounded-[2rem] p-8 border border-neutral-200/80 dark:border-white/5 shadow-xl shadow-neutral-200/50 dark:shadow-black/20 hover:border-indigo-500/20 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-xl text-neutral-900 dark:text-white">User Growth</h3>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">New accounts created (30d)</p>
                        </div>
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <TrendingUp className="w-5 h-5 text-indigo-500" /> 
                        </div>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={charts?.userGrowth}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" strokeOpacity={0.05} vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#A3A3A3" 
                                    fontSize={11} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(val) => new Date(val).getDate()}
                                    dy={10}
                                />
                                <YAxis 
                                    stroke="#A3A3A3" 
                                    fontSize={11} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#6366F1" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorUsers)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white dark:bg-[#121212] rounded-[2rem] p-8 border border-neutral-200/80 dark:border-white/5 shadow-xl shadow-neutral-200/50 dark:shadow-black/20 hover:border-emerald-500/20 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-8">
                         <div>
                            <h3 className="font-bold text-xl text-neutral-900 dark:text-white">Revenue Trend</h3>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">Income generated (30d)</p>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <DollarSign className="w-5 h-5 text-emerald-500" />
                        </div>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts?.revenue}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.3}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" strokeOpacity={0.05} vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#A3A3A3" 
                                    fontSize={11} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(val) => new Date(val).getDate()}
                                    dy={10}
                                />
                                <YAxis 
                                    stroke="#A3A3A3" 
                                    fontSize={11} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(val) => `₹${val}`}
                                    dx={-10}
                                />
                                <Tooltip content={<CustomTooltip formatter={(val) => `₹${val}`} label="Revenue" />} />
                                <Bar 
                                    dataKey="amount" 
                                    fill="url(#colorRevenue)" 
                                    radius={[6, 6, 6, 6]} 
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Users List (2/3 width) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#121212] rounded-[2rem] border border-neutral-200/80 dark:border-white/5 overflow-hidden shadow-xl shadow-neutral-200/50 dark:shadow-black/20 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors duration-500">
                    <div className="p-6 md:p-8 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Recent Signups</h2>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">Latest 5 users joined</p>
                        </div>
                        <button 
                            onClick={() => navigate("/admin/users")} 
                            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-50 dark:bg-white/5 text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 transition-all cursor-pointer"
                        >
                            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    
                    {/* Desktop Table */}
                    <div className="hidden md:block w-full">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50/50 dark:bg-white/[0.02] text-xs uppercase font-extrabold text-neutral-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-4 py-4">Plan</th>
                                    <th className="px-4 py-4 text-right">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                                {recentUsers.map(user => (
                                    <tr key={user._id} onClick={() => navigate(`/admin/users/${user._id}`)} className="group hover:bg-neutral-50/80 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-white dark:from-white/10 dark:to-white/5 flex items-center justify-center text-indigo-900 dark:text-white font-bold text-xs ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
                                                        {user.image ? (
                                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                                                        ) : (
                                                            user.name?.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm truncate max-w-[120px]">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-500 mt-0.5 truncate max-w-[120px]">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                                user.plan === 'pro' 
                                                    ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 border-indigo-200 dark:from-indigo-500/20 dark:to-violet-500/20 dark:text-indigo-300 dark:border-indigo-500/30'
                                                    : 'bg-neutral-50 text-neutral-500 border-neutral-200 dark:bg-white/5 dark:text-neutral-400 dark:border-white/10'
                                            }`}>
                                                {user.plan === 'pro' && <Sparkles className="w-3 h-3 mr-1 fill-current" />}
                                                {user.plan}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-neutral-400 font-mono text-xs text-right">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="md:hidden p-4 space-y-4">
                        {recentUsers.map(user => (
                            <div key={user._id} onClick={() => navigate(`/admin/users/${user._id}`)} className="bg-neutral-50 dark:bg-white/5 rounded-2xl p-4 border border-neutral-200 dark:border-white/5 flex items-center justify-between cursor-pointer active:scale-98 transition-transform">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-900 dark:text-white text-sm">{user.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                                user.plan === 'pro' ? 'bg-indigo-100 text-indigo-700' : 'bg-neutral-200 text-neutral-600'
                                            }`}>
                                                {user.plan}
                                            </span>
                                            <span className="text-xs text-neutral-400">{new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Users Widget (1/3 width) */}
                <div className="bg-white dark:bg-[#121212] rounded-[2rem] border border-neutral-200/80 dark:border-white/5 overflow-hidden shadow-xl shadow-neutral-200/50 dark:shadow-black/20 flex flex-col hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors duration-500">
                    <div className="p-6 md:p-8 border-b border-neutral-200/60 dark:border-white/5">
                         <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-amber-500 fill-amber-500/20" /> Top Performers
                        </h2>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">Most viewed profiles this month</p>
                    </div>
                    <div className="p-6 space-y-4 overflow-y-auto flex-1 h-full max-h-[400px]">
                        {topUsers.length === 0 ? (
                            <div className="text-center text-neutral-500 py-10 flex flex-col items-center gap-2">
                                <Users className="w-8 h-8 opacity-20" />
                                <span className="text-sm">No data available</span>
                            </div>
                        ) : (
                            topUsers.map((user, idx) => (
                                <div key={user._id} className="flex items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-white/[0.04] rounded-2xl transition-all group border border-transparent hover:border-neutral-200 dark:hover:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02]">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-sm ring-4 ring-white dark:ring-[#15151A]
                                        ${idx === 0 ? 'bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900' : 
                                          idx === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900' :
                                          idx === 2 ? 'bg-gradient-to-br from-orange-200 to-orange-400 text-orange-900' :
                                          'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'}
                                    `}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-neutral-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm">
                                                {user.name}
                                            </h4>
                                            <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 bg-white dark:bg-white/10 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                <Activity className="w-3 h-3 text-indigo-500" />
                                                {user.profileViews || 0}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-neutral-400 truncate mt-0.5">@{user.username}</p>
                                    </div>
                                    <button onClick={() => window.open(`/${user.username}`, '_blank')} className="opacity-0 group-hover:opacity-100 p-2 text-neutral-400 hover:text-indigo-600 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

const StatCard = ({ label, value, icon: Icon, color, subtext, trend, status, chartData }) => {
    const colors = {
        blue: "text-blue-600 dark:text-blue-400 from-blue-500/10 to-blue-500/5",
        indigo: "text-indigo-600 dark:text-indigo-400 from-indigo-500/10 to-indigo-500/5",
        emerald: "text-emerald-600 dark:text-emerald-400 from-emerald-500/10 to-emerald-500/5",
        purple: "text-purple-600 dark:text-purple-400 from-purple-500/10 to-purple-500/5",
        amber: "text-amber-600 dark:text-amber-400 from-amber-500/10 to-amber-500/5",
    };

    const StatusIcon = status === 'success' ? ArrowUpRight : status === 'neutral' ? Sparkles : ArrowDownRight;
    const statusColor = status === 'success' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'text-neutral-500 bg-neutral-100 dark:bg-white/10';

    return (
        <div className={`relative group bg-white dark:bg-[#121212] rounded-[2rem] p-6 border border-neutral-200/80 dark:border-white/5 shadow-xl shadow-neutral-200/50 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}>
            {/* Background Gradient Effect */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors[color]} rounded-bl-[4rem] opacity-50 transition-opacity group-hover:opacity-100 pointer-events-none`} />
            
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${colors[color].replace('from-', 'bg-').split(' ')[0].replace('10', '5')} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        <Icon className={`w-6 h-6 ${colors[color].split(' ')[0]}`} />
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${statusColor}`}>
                            <StatusIcon className="w-3 h-3" />
                            {trend}
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight leading-none mb-1">
                        {value}
                    </h3>
                    <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">{label}</p>
                </div>

                {subtext && (
                    <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-white/5">
                        <p className="text-xs font-medium text-neutral-400 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> {subtext}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-3 shadow-2xl">
                <p className="text-neutral-400 text-xs font-medium mb-1">{label}</p>
                <p className="text-white text-sm font-bold">
                    {formatter ? formatter(payload[0].value) : payload[0].value}
                    <span className="text-neutral-500 ml-1 font-normal">
                        {payload[0].name === 'count' ? 'Users' : ''}
                    </span>
                </p>
            </div>
        );
    }
    return null;
};

export default AdminDashboard;
