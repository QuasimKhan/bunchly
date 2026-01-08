import React, { useEffect, useState } from "react";
import { 
    Banknote, 
    TrendingUp, 
    Users, 
    CreditCard, 
    ArrowUpRight, 
    ArrowDownRight,
    Download,
    Printer,
    PieChart as PieIcon,
    Wallet,
    Mail,
    Loader2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import SmartSkeleton from "../../components/ui/SmartSkeleton";
import { toast } from "sonner";
import Button from "../../components/ui/Button";

const AdminRevenue = () => {
    const [loading, setLoading] = useState(true);
    const [emailSending, setEmailSending] = useState(false);
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [range, setRange] = useState('30d');

    useEffect(() => {
        const fetchRevenue = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/revenue?range=${range}`, {
                    credentials: "include"
                });
                const data = await res.json();
                if (data.success) {
                    setStats(data.stats);
                    setChartData(data.chartData);
                    setTransactions(data.recentTransactions);
                }
            } catch (error) {
                toast.error("Failed to load revenue data");
            } finally {
                setLoading(false);
            }
        };
        fetchRevenue();
    }, [range]);

    const handleExportCSV = () => {
        if (!transactions.length) return toast.error("No data to export");
        
        const headers = ["Date", "User", "Email", "Plan", "Amount", "Status", "Method", "Invoice"];
        const rows = transactions.map(t => [
            new Date(t.createdAt).toLocaleDateString(),
            t.userId?.name || "Unknown",
            t.userId?.email || "N/A",
            t.plan,
            (t.amount / 100).toFixed(2),
            t.status,
            t.provider,
            t.invoiceNumber
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `revenue_report_${range}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Report downloaded");
    };

    const handlePrint = () => {
        window.print();
    };

    const handleEmailReport = async () => {
        setEmailSending(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/revenue/email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ range }),
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error("Failed to send email");
            }
        } catch (error) {
            toast.error("Failed to send email");
        } finally {
            setEmailSending(false);
        }
    };

    if (loading && !stats) return <div className="p-8"><SmartSkeleton variant="table" /></div>;

    // Pie Data
    const pieData = stats ? [
        { name: 'Net Revenue', value: stats.netRevenue, color: '#10b981' }, // Emerald 500
        { name: 'Refunds', value: stats.refundsValue, color: '#f97316' }   // Orange 500
    ] : [];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10 print:p-0 print:max-w-none">
            {/* Print Styles */}
            <style>{`
                @media print {
                    aside, header, nav, .no-print { display: none !important; }
                    body { background: white !important; color: black !important; }
                    .print-break { break-inside: avoid; }
                    .print-hidden { display: none !important; }
                    .print-header { display: flex !important; }
                    /* Force charts to fit */
                    .recharts-responsive-container { height: 300px !important; }
                }
            `}</style>

            {/* Print Only Header */}
            <div className="hidden print-header items-center justify-between border-b-2 border-neutral-900 pb-6 mb-8">
                <div className="flex items-center gap-3">
                    <img src="/img/Bunchly-light.png" className="w-32" alt="Bunchly" />
                </div>
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-neutral-900 uppercase tracking-widest">Revenue Report</h1>
                    <p className="text-sm text-neutral-500 font-medium mt-1">
                        CONFIDENTIAL • Generated on {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print-hidden">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                            <Banknote className="w-6 h-6" />
                        </div>
                        Revenue Analytics
                    </h1>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                     {/* Range Filter */}
                    <div className="flex bg-white dark:bg-[#15151A] p-1 rounded-xl border border-neutral-200 dark:border-white/5 shadow-sm">
                        {['7d', '30d', '90d', '1y', 'all'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`
                                    px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wide transition-all cursor-pointer
                                    ${range === r 
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30" 
                                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/5"
                                    }
                                `}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <div className="h-8 w-px bg-neutral-200 dark:bg-white/10 mx-1 hidden md:block"></div>

                    <button 
                        onClick={handleEmailReport}
                        disabled={emailSending}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl text-sm font-medium hover:bg-neutral-50 dark:hover:bg-white/10 transition-colors cursor-pointer text-neutral-600 dark:text-neutral-300 disabled:opacity-50"
                    >
                        {emailSending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Mail className="w-4 h-4" />}
                        
                    </button>

                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl text-sm font-medium hover:bg-neutral-50 dark:hover:bg-white/10 transition-colors cursor-pointer text-neutral-600 dark:text-neutral-300"
                    >
                        <Printer className="w-4 h-4" />
                    </button>

                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white border border-transparent rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print-break">
                <StatCard 
                    title="Gross Revenue" 
                    value={`₹${stats?.grossRevenue?.toLocaleString() || '0'}`} 
                    subvalue="Total before refunds"
                    icon={Banknote} 
                    color="indigo"
                />
                <StatCard 
                    title="Net Revenue" 
                    value={stats ? `₹${stats.netRevenue.toLocaleString()}` : "₹0"}
                    subvalue="Real earnings (after refunds)"
                    trend="up"
                    icon={Wallet} 
                    color="emerald"
                />
                <StatCard 
                    title="Avg. Order Value" 
                    value={stats ? `₹${Math.round(stats.aov).toLocaleString()}` : "₹0"}
                    subvalue="Revenue per transaction"
                    icon={TrendingUp} 
                    color="purple"
                />
                 <StatCard 
                    title="Refund Rate" 
                    value={`${stats?.refundRate || 0}%`}
                    subvalue={`₹${stats?.refundsValue?.toLocaleString() || 0} reversed`}
                    trend={stats?.refundRate > 5 ? "down" : "up"}
                    inverse
                    icon={CreditCard} 
                    color="orange"
                />
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print-break">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#15151A] rounded-3xl p-6 border border-neutral-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-8 print-hidden">
                        <div>
                            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Revenue Growth</h3>
                            <p className="text-sm text-neutral-500">Income trend over selected period</p>
                        </div>
                    </div>
                    {/* Print Header only for chart block to maintain context if needed, or rely on main header */}
                    <div className="hidden print-block mb-4">
                        <h3 className="font-bold text-lg text-black">Revenue Trend</h3>
                    </div>
                    
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.2} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#9ca3af', fontSize: 12}} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#9ca3af', fontSize: 12}}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: '#1f2937', 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}
                                    itemStyle={{color: '#fff'}}
                                    formatter={(value) => [`₹${value}`, "Revenue"]}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#6366f1" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorRevenue)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Chart (Pie) */}
                <div className="bg-white dark:bg-[#15151A] rounded-3xl p-6 border border-neutral-200 dark:border-white/5 shadow-sm flex flex-col">
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-2">Revenue Distribution</h3>
                    <p className="text-sm text-neutral-500 mb-6">Net vs Refunds</p>

                    <div className="flex-1 min-h-[250px] relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value) => `₹${value.toLocaleString()}`}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                             <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                                 {stats ? `${(stats.refundRate)}%` : '0%'}
                             </div>
                             <div className="text-xs text-neutral-500 font-medium">Refund Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white dark:bg-[#15151A] rounded-3xl border border-neutral-200 dark:border-white/5 shadow-sm overflow-hidden print-break">
                 <div className="p-6 border-b border-neutral-200 dark:border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Recent Transactions</h3>
                 </div>
                 
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-neutral-500">
                        <thead className="bg-neutral-50 dark:bg-white/5 text-xs text-neutral-400 uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Invoice</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-white/5">
                            {transactions.map((txn) => (
                                <tr key={txn._id} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xs ring-2 ring-white dark:ring-[#15151A]">
                                            {txn.userId?.name?.charAt(0) || "U"}
                                        </div>
                                        <span className="font-semibold text-neutral-900 dark:text-white">
                                            {txn.userId?.name || "Unknown"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(txn.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{txn.invoiceNumber}</td>
                                    <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">
                                        ₹{(txn.amount / 100).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide inline-flex items-center gap-1 ${
                                            txn.status === 'paid' 
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' 
                                                : 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                                        }`}>
                                            {txn.status === 'paid' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                            {txn.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-neutral-400 italic">No transactions in this period</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};

// ... StatCard remains same ... (I will include it to ensure file completeness)
const StatCard = ({ title, value, subvalue, trend, icon: Icon, color, inverse }) => {
    const isPositive = trend === 'up';
    const trendColor = inverse 
        ? (isPositive ? 'text-red-500' : 'text-emerald-500') 
        : (isPositive ? 'text-emerald-500' : 'text-red-500');
        
    const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

    const colorClasses = {
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
        emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
        orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    };

    return (
        <div className="bg-white dark:bg-[#15151A] p-6 rounded-3xl border border-neutral-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-neutral-100 dark:bg-white/5 ${trendColor}`}>
                        <TrendIcon className="w-3 h-3" />
                    </div>
                )}
            </div>
            <div>
                <p className="text-neutral-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">{value}</h3>
                {subvalue && <p className={`text-xs mt-2 ${trend ? trendColor : 'text-neutral-400'}`}>{subvalue}</p>}
            </div>
        </div>
    );
};

export default AdminRevenue;
