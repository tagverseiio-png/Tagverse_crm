'use client';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { reps } from '../mockData';

export default function PerformanceDashboard() {
  const [timeframe, setTimeframe] = useState<'week'|'month'>('month');

  // Chart 1: Revenue per rep
  const revenueData = reps.map(r => ({ name: r.name, revenue: r.revenue, color: r.color }));

  // Chart 2: Deals closed vs tasks done
  const totalDeals = reps.reduce((acc, r) => acc + r.dealsClosed, 0);
  const totalTasks = reps.reduce((acc, r) => acc + r.tasksDone, 0);
  const pieData = [
    { name: 'Deals Closed', value: totalDeals, color: '#10b981' },
    { name: 'Tasks Completed', value: totalTasks, color: '#3b82f6' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="section-title">Performance Dashboard</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setTimeframe('week')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${timeframe === 'week' ? 'bg-[var(--brand-accent)] text-white' : 'bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border border-[var(--border)]'}`}
          >
            This Week
          </button>
          <button 
            onClick={() => setTimeframe('month')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${timeframe === 'month' ? 'bg-[var(--brand-accent)] text-white' : 'bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border border-[var(--border)]'}`}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Bar Chart */}
        <div className="card w-full flex flex-col">
          <h3 className="section-sub uppercase tracking-wider mb-6">Revenue per Rep</h3>
          <div className="h-72 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'var(--bg-card-hover)' }} contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--text-primary)' }} itemStyle={{ color: 'var(--text-primary)' }} />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={20}>
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Distribution Pie Chart */}
        <div className="card w-full flex flex-col">
          <h3 className="section-sub uppercase tracking-wider mb-6">Activity Distribution</h3>
          <div className="h-72 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--text-primary)' }} itemStyle={{ color: 'var(--text-primary)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Outfit' }}>{totalDeals + totalTasks}</span>
              <span className="text-xs text-[var(--text-muted)]">Total Actions</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-[var(--text-secondary)]">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
