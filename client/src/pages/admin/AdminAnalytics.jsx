import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
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
  Legend,
  AreaChart, // Added AreaChart
  Area,      // Added Area
} from "recharts";
import {
  getAnalyticsOverview,
  getAnalyticsTimeSeries,
  getAnalyticsGeoResult,
  getAnalyticsDeviceResult,
  getAnalyticsTopPages,
} from "../../services/adminService";
import { FiUsers, FiActivity, FiGlobe, FiSmartphone, FiMonitor, FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import AdminDashboardSkeleton from "../../components/skeletons/AdminDashboardSkeleton";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const AdminAnalytics = () => {
  const [period, setPeriod] = useState("7d");
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [overview, setOverview] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]);
  const [geoStats, setGeoStats] = useState([]);
  const [deviceStats, setDeviceStats] = useState({ devices: [], browsers: [], os: [] });
  const [topPages, setTopPages] = useState([]);
  
  // Pagination State for Top Pages
  const [pagesPage, setPagesPage] = useState(1);
  const [pagesTotal, setPagesTotal] = useState(0);
  const [pagesLimit] = useState(10);
  const [tableLoading, setTableLoading] = useState(false);

  // Initial Fetch
  useEffect(() => {
    fetchMainData();
  }, [period]);

  // Fetch when page changes
  useEffect(() => {
    fetchTopPages();
  }, [pagesPage, period]);

  const fetchMainData = async () => {
    setLoading(true);
    try {
      const [ov, ts, geo, dev] = await Promise.all([
        getAnalyticsOverview(period),
        getAnalyticsTimeSeries(period),
        getAnalyticsGeoResult(period),
        getAnalyticsDeviceResult(period),
      ]);

      setOverview(ov);
      setTimeSeries(ts);
      setGeoStats(geo);
      setDeviceStats(dev);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopPages = async () => {
    setTableLoading(true);
    try {
      const res = await getAnalyticsTopPages(period, pagesPage, pagesLimit);
      setTopPages(res.data || []);
      setPagesTotal(res.pagination?.pages || 1);
    } catch (error) {
      console.error("Failed to fetch top pages", error);
    } finally {
      setTableLoading(false);
    }
  };

  if (loading) {
      return <AdminDashboardSkeleton />;
  }

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Analytics</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time insights & performance metrics
          </p>
        </div>
        <div className="flex items-center p-1 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl w-fit shadow-sm">
          {["24h", "7d", "30d"].map((p) => (
            <button
              key={p}
              onClick={() => { setPeriod(p); setPagesPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                period === p
                  ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/5"
              }`}
            >
              {p === "24h" ? "24h" : p === "7d" ? "7d" : "30d"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Page Views"
            value={overview?.totalViews?.toLocaleString()}
            icon={FiActivity}
            color="blue"
          />
          <StatCard
            title="Unique Visitors"
            value={overview?.uniqueVisitors?.toLocaleString()}
            icon={FiUsers}
            color="emerald"
          />
          <StatCard
            title="Active Now"
            value={overview?.activeUsers}
            subtext="users in last 5 min"
            icon={FiMonitor}
            color="rose"
            live={true}
          />
        </div>

        {/* ... */}

        {/* Top Pages Table */}
        <div className="bg-white dark:bg-[#15151A] rounded-3xl border border-neutral-200/60 dark:border-white/5 shadow-sm overflow-hidden">
          {/* ... */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50/50 dark:bg-white/[0.02] text-xs uppercase font-bold text-neutral-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Page URL</th>
                  <th className="px-6 py-4 text-right cursor-help" title="Total page loads">Page Views</th>
                  <th className="px-6 py-4 text-right cursor-help" title="Distinct IP addresses">Unique Visitors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-white/5 relative">
                {tableLoading && (
                  <tr className="absolute inset-0 z-10 bg-white/50 dark:bg-black/50 backdrop-blur-[1px] flex items-center justify-center h-full w-full">
                     <td colSpan="3" className="w-full h-full"></td>
                  </tr>
                )}
                {topPages.map((page, index) => (
                  <tr key={index} className="hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white font-medium font-mono truncate max-w-[200px] sm:max-w-none">
                       <a href={page.path.startsWith('http') ? page.path : `https://${window.location.host}${page.path}`} target="_blank" rel="noreferrer" className="hover:text-indigo-500 transition-colors flex items-center gap-2">
                          {page.path}
                       </a>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                        {page.views.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400 text-right">
                      {page.visitors.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {topPages.length === 0 && !tableLoading && (
                   <tr>
                      <td colSpan="3" className="text-center py-8 text-neutral-500">No data available for this period</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for smoother chart rendering with gradients
const AreaChartWrapper = ({ data }) => {
  return (
    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" strokeOpacity={0.05} vertical={false} />
      <XAxis 
        dataKey="date" 
        stroke="#A3A3A3" 
        fontSize={12} 
        tickLine={false} 
        axisLine={false} 
        dy={10}
      />
      <YAxis 
        stroke="#A3A3A3" 
        fontSize={12} 
        tickLine={false} 
        axisLine={false} 
        dx={-10}
      />
      <Tooltip
        contentStyle={{ 
            backgroundColor: "#0F0F14", 
            border: "1px solid rgba(255,255,255,0.1)", 
            borderRadius: "12px", 
            color: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
        }}
        itemStyle={{ color: "#e4e4e7" }}
        cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '4 4' }}
      />
      <Legend iconType="circle" />
      <Area
        type="monotone"
        dataKey="views"
        stroke="#6366f1"
        strokeWidth={3}
        fill="url(#colorViews)"
        name="Total Views"
        animationDuration={1500}
      />
      <Line
        type="monotone"
        dataKey="visitors"
        stroke="#10b981"
        strokeWidth={3}
        dot={false}
        name="Unique Visitors"
        animationDuration={1500}
      />
    </AreaChart>
  );
};

const StatCard = ({ title, value, subtext, icon: Icon, color, live }) => {
    const styles = {
        blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10",
        emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
        purple: "text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-500/10",
        rose: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10",
    };

    return (
        <div className="group bg-white dark:bg-[#15151A] rounded-3xl p-6 border border-neutral-200/60 dark:border-white/5 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
             <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                         <div className={`p-2 rounded-xl ${styles[color] || styles.blue}`}>
                            <Icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">{title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h3 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">{value}</h3>
                        {live && (
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                            </span>
                        )}
                    </div>
                     {subtext && <p className="text-xs text-neutral-400 mt-1 font-medium">{subtext}</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
