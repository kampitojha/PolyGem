import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MOCK_DASHBOARD_DATA } from '../constants';
import { DashboardData } from '../types';
import { Activity, Users, DollarSign, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData[]>(MOCK_DASHBOARD_DATA);
  const [visitors, setVisitors] = useState(12450);
  const [revenue, setRevenue] = useState(45231);
  const [activeUsers, setActiveUsers] = useState(843);
  const [updateFlash, setUpdateFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateFlash(true);
      setTimeout(() => setUpdateFlash(false), 200);

      // Simulate live data updates
      setData(prevData => {
        const newData = [...prevData];
        const lastItem = { ...newData[newData.length - 1] };
        
        // Shift time
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        // Create new point
        const newPoint = {
          name: timeStr,
          uv: Math.floor(Math.random() * 5000) + 1000,
          pv: Math.floor(Math.random() * 5000) + 1000,
          amt: Math.floor(Math.random() * 5000) + 1000,
        };

        return [...newData.slice(1), newPoint];
      });

      setVisitors(prev => prev + Math.floor(Math.random() * 10) - 2);
      setRevenue(prev => prev + Math.floor(Math.random() * 100));
      setActiveUsers(prev => Math.max(0, prev + Math.floor(Math.random() * 20) - 10));

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, prefix = '' }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between transition-all duration-300 hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className={`text-2xl font-bold text-gray-900 ${updateFlash ? 'opacity-70' : 'opacity-100'} transition-opacity duration-200`}>
          {prefix}{value.toLocaleString()}
        </h3>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  );

  return (
    <div className="h-full p-6 max-w-7xl mx-auto space-y-6 overflow-y-auto">
      
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-600" />
          Live Analytics
        </h2>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 animate-pulse">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Live Updating
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Visitors" value={visitors} icon={Users} color="bg-blue-500" />
        <StatCard title="Real-time Revenue" value={revenue} prefix="$" icon={DollarSign} color="bg-green-500" />
        <StatCard title="Active Users" value={activeUsers} icon={TrendingUp} color="bg-purple-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        
        {/* Main Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Traffic Overview</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" hide />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="uv" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                  animationDuration={500}
                />
                <Line 
                  type="monotone" 
                  dataKey="pv" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={false} 
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Server Load</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" hide />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="amt" fill="#8b5cf6" radius={[4, 4, 0, 0]} animationDuration={500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="bg-indigo-900 rounded-xl p-6 text-white flex items-center justify-between overflow-hidden relative">
         <div className="relative z-10">
            <h3 className="font-bold text-xl mb-2">System Status</h3>
            <p className="text-indigo-200">All systems operational. Next scheduled maintenance in 2 days.</p>
         </div>
         <div className="relative z-10 flex gap-4">
            <div className="text-center">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-xs text-indigo-300 uppercase">Uptime</div>
            </div>
            <div className="text-center">
                <div className="text-2xl font-bold">12ms</div>
                <div className="text-xs text-indigo-300 uppercase">Latency</div>
            </div>
         </div>
         {/* Decorative BG elements */}
         <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-indigo-800 rounded-full opacity-50 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-indigo-600 rounded-full opacity-50 blur-3xl"></div>
      </div>
    </div>
  );
};
