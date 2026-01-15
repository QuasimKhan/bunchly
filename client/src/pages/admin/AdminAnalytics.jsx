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
  AreaChart,
  Area,
} from "recharts";
import {
  getAnalyticsOverview,
  getAnalyticsTimeSeries,
  getAnalyticsGeoResult,
  getAnalyticsDeviceResult,
  getAnalyticsTopPages,
} from "../../services/adminService";
import { 
    FiUsers, FiActivity, FiGlobe, FiSmartphone, FiMonitor, FiClock, FiPercent, FiArrowUpRight, FiArrowDownRight,
    FiMapPin
} from "react-icons/fi";
import AdminDashboardSkeleton from "../../components/skeletons/AdminDashboardSkeleton";
import { motion } from "framer-motion";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const AdminAnalytics = () => {
  const [period, setPeriod] = useState("7d");
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [overview, setOverview] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]);
  const [geoStats, setGeoStats] = useState([]);
  const [deviceStats, setDeviceStats] = useState({ devices: [], browsers: [], os: [], resolutions: [], mobileStats: {} });
  const [topPages, setTopPages] = useState([]);
  
  // Pagination State for Top Pages
  const [pagesPage, setPagesPage] = useState(1);
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
    } catch (error) {
      console.error("Failed to fetch top pages", error);
    } finally {
      setTableLoading(false);
    }
  };

  if (loading) {
      return <AdminDashboardSkeleton />;
  }

  const bounceRate = overview?.bounceRate ? Math.round(overview.bounceRate) : 0;
  const avgDuration = overview?.avgSessionDuration ? Math.round(overview.avgSessionDuration / 1000) : 0;

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Analytics</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Comprehensive platform insights
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

      {/* Realtime & Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Realtime Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <div className="relative z-10">
                  <h3 className="text-indigo-100 font-medium text-sm mb-1 uppercase tracking-wider">Realtime</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                       <span className="text-5xl font-bold">{overview?.activeUsers}</span>
                       <span className="text-indigo-200 text-sm">active now</span>
                  </div>
                  <div className="h-1 w-full bg-indigo-500/30 rounded-full overflow-hidden mb-4">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: "100%" }} 
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="h-full bg-indigo-200/50"
                      />
                  </div>
                  <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-indigo-100">
                          <span>Top Active Page</span>
                          <span className="font-mono bg-indigo-500/30 px-2 py-0.5 rounded text-xs">/dashboard</span>
                      </div>
                       <div className="flex items-center justify-between text-sm text-indigo-100">
                          <span>Top Device</span>
                          <span className="font-mono bg-indigo-500/30 px-2 py-0.5 rounded text-xs">Mobile</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Key Stats */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Users"
                value={overview?.uniqueVisitors?.toLocaleString()}
                subtext="Unique visitors"
                icon={FiUsers}
                color="blue"
              />
              <StatCard
                title="Avg. Session Duration"
                value={`${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s`}
                subtext="Engagement time"
                icon={FiClock}
                color="emerald"
              />
              <StatCard
                title="Bounce Rate"
                value={`${bounceRate}%`}
                subtext="Single page sessions"
                icon={FiPercent}
                color={bounceRate > 60 ? "rose" : "purple"} // Red if high bounce rate
              />
          </div>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-[#15151A] rounded-3xl p-6 border border-neutral-200/60 dark:border-white/5 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                 <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Audience Growth</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Users vs Sessions over time</p>
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                         <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Views
                     </div>
                     <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                         <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Visitors
                     </div>
                 </div>
             </div>
             <div className="h-[300px] w-full">
                <AreaChartWrapper data={timeSeries} />
             </div>
          </div>

          <div className="lg:col-span-1 bg-white dark:bg-[#15151A] rounded-3xl p-6 border border-neutral-200/60 dark:border-white/5 shadow-sm flex flex-col">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Sessions by Device</h2>
              <div className="flex-1 min-h-[200px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceStats.devices}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceStats.devices.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                            backgroundColor: "#0F0F14", 
                            border: "1px solid rgba(255,255,255,0.1)", 
                            borderRadius: "12px",
                            color: "#fff"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                          <p className="text-xs text-neutral-500 uppercase font-bold">Mobile</p>
                          <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                              {/* Calculate Mobile % */}
                              {(() => {
                                  const total = deviceStats.devices.reduce((a, b) => a + b.value, 0);
                                  const mobile = deviceStats.devices.find(d => d.name === 'mobile')?.value || 0;
                                  const tablet = deviceStats.devices.find(d => d.name === 'tablet')?.value || 0;
                                  return total ? Math.round(((mobile + tablet) / total) * 100) : 0;
                              })()}%
                          </p>
                      </div>
                  </div>
              </div>
              <div className="mt-6 space-y-3">
                  {deviceStats.devices.map((device, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 capitalize">{device.name}</span>
                          </div>
                          <span className="text-sm font-bold text-neutral-900 dark:text-white">{device.value}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Tech & Geo Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Countries */}
          <div className="bg-white dark:bg-[#15151A] rounded-3xl p-6 border border-neutral-200/60 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                      <FiGlobe className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-neutral-900 dark:text-white">Top Locations</h3>
              </div>
              <div className="space-y-4">
                  {geoStats.map((geo, i) => (
                      <div key={i} className="flex items-center justify-between"> 
                          <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-neutral-400 w-4">{i+1}</span>
                              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{geo.name || "Unknown"}</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <div className="w-24 h-1.5 bg-neutral-100 dark:bg-white/10 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500 rounded-full" 
                                    style={{ width: `${(geo.value / Math.max(...geoStats.map(g => g.value))) * 100}%` }}
                                  ></div>
                              </div>
                              <span className="text-xs font-bold text-neutral-900 dark:text-white w-8 text-right">{geo.value}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Browser & OS */}
          <div className="bg-white dark:bg-[#15151A] rounded-3xl p-6 border border-neutral-200/60 dark:border-white/5 shadow-sm">
               <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                      <FiMonitor className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-neutral-900 dark:text-white">Tech Specs</h3>
              </div>
               
               <div className="space-y-6">
                   <div>
                       <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Browser</p>
                       <div className="space-y-3">
                            {deviceStats.browsers.slice(0,3).map((b, i) => (
                                <TechRow key={i} label={b.name} value={b.value} total={overview?.totalViews || 1} color="purple"/>
                            ))}
                       </div>
                   </div>
                   <div>
                       <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Operating System</p>
                       <div className="space-y-3">
                            {deviceStats.os.slice(0,3).map((o, i) => (
                                <TechRow key={i} label={o.name} value={o.value} total={overview?.totalViews || 1} color="pink"/>
                            ))}
                       </div>
                   </div>
               </div>
          </div>

          {/* Screen Resolutions to check responsiveness */}
          <div className="bg-white dark:bg-[#15151A] rounded-3xl p-6 border border-neutral-200/60 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                      <FiSmartphone className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-neutral-900 dark:text-white">Mobile Performance</h3>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-white/5 rounded-2xl mb-6">
                  <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Mobile Bounce Rate</span>
                       <span className="text-lg font-bold text-neutral-900 dark:text-white">
                           { Math.round(deviceStats.mobileStats?.bounceRate || 0) }%
                       </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 dark:bg-white/10 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-emerald-500" 
                         style={{ width: `${Math.min(deviceStats.mobileStats?.bounceRate || 0, 100)}%` }}
                       ></div>
                  </div>
              </div>

               <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Top Resolutions</p>
               <div className="space-y-3">
                    {deviceStats.resolutions?.slice(0, 5).map((r, i) => (
                        <TechRow key={i} label={r.name} value={r.value} total={overview?.totalViews || 1} color="emerald"/>
                    ))}
                    {!deviceStats.resolutions?.length && <p className="text-sm text-neutral-500 italic">No data yet</p>}
               </div>
          </div>
      </div>

       {/* Top Pages Table */}
       <div className="bg-white dark:bg-[#15151A] rounded-3xl border border-neutral-200/60 dark:border-white/5 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-neutral-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Top Pages</h3>
           </div>
           
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
  );
};

/* --- Sub Components --- */

const TechRow = ({ label, value, total, color = "blue" }) => {
    const percent = Math.round((value / total) * 100);
    const colors = {
        blue: "bg-blue-500",
        purple: "bg-purple-500",
        pink: "bg-pink-500",
        emerald: "bg-emerald-500"
    };

    return (
        <div className="flex items-center justify-between text-sm group">
            <span className="text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors truncate max-w-[60%]">
                {label || "Unknown"}
            </span>
            <div className="flex items-center gap-3">
                 <div className="w-16 h-1.5 bg-neutral-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colors[color]}`} style={{ width: `${percent}%` }}></div>
                 </div>
                 <span className="font-bold text-neutral-900 dark:text-white w-6 text-right">{percent}%</span>
            </div>
        </div>
    );
}

// Helper component for smoother chart rendering with gradients
const AreaChartWrapper = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
        </linearGradient>
         <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
        minTickGap={30}
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
        name="Page Views"
        animationDuration={1500}
      />
      <Area
        type="monotone"
        dataKey="visitors"
        stroke="#10b981"
        strokeWidth={3}
        fill="url(#colorVisitors)"
        name="Unique Visitors"
        animationDuration={1500}
      />
    </AreaChart>
    </ResponsiveContainer>
  );
};

const StatCard = ({ title, value, subtext, icon: Icon, color }) => {
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
                    </div>
                     {subtext && <p className="text-xs text-neutral-400 mt-1 font-medium">{subtext}</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
