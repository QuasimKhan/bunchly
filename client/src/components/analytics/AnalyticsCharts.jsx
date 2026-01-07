import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Premium Color Palette
const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#3b82f6'];

export const ClicksChart = ({ data, range }) => {
    if (!data || data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-gray-400">No activity in this period</div>;
    }

    // Fill missing dates
    const chartData = [];
    for (let i = range - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const found = data.find(item => item._id === dateStr);
        
        chartData.push({
            date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d),
            clicks: found ? found.count : 0
        });
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#6B7280' }} 
                        dy={10}
                        minTickGap={30} // Prevent crowd
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#6B7280' }} 
                    />
                    <Tooltip 
                        cursor={{ fill: '#6366f1', opacity: 0.1 }}
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            backgroundColor: 'white',
                            color: '#1F2937'
                        }}
                    />
                     <defs>
                        <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        </linearGradient>
                    </defs>
                    <Bar 
                        dataKey="clicks" 
                        fill="url(#barColor)" 
                        radius={[4, 4, 0, 0]} 
                        barSize={32}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const DonutChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">No data</div>;
    }

    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip 
                         contentStyle={{ 
                            borderRadius: '8px', 
                            border: 'none', 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            fontSize: '12px'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
                {data.slice(0, 4).map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-xs text-gray-500 capitalize">{entry._id || 'Unknown'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
