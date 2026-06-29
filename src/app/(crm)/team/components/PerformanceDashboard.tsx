'use client';
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { reps } from '../mockData';

export default function PerformanceDashboard() {
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('month');

  // Sorted descending by revenue — highest earner on top
  const revenueData = [...reps]
    .sort((a, b) => b.revenue - a.revenue)
    .map(r => ({ name: r.name.split(' ')[0], fullName: r.name, revenue: r.revenue, color: r.color }));

  const totalDeals  = reps.reduce((acc, r) => acc + r.dealsClosed, 0);
  const totalTasks  = reps.reduce((acc, r) => acc + r.tasksDone,   0);
  const pieData = [
    { name: 'Deals Closed',    value: totalDeals, color: '#10b981' },
    { name: 'Tasks Completed', value: totalTasks,  color: '#8b5cf6' },
  ];

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      return (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '8px 14px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{d.fullName}</p>
          <p style={{ color: 'var(--emerald)', fontWeight: 600, fontSize: 13 }}>
            ${d.revenue.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const d = payload[0];
      return (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '8px 14px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{d.name}</p>
          <p style={{ color: d.payload.color, fontWeight: 600, fontSize: 13 }}>{d.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="section-title">Performance Dashboard</h2>
          <p className="section-sub" style={{ marginTop: 2 }}>Revenue ranking & activity breakdown</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['week', 'month'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: '6px 16px',
                borderRadius: 999,
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.18s ease',
                background: timeframe === tf ? 'var(--brand-accent)' : 'var(--bg-card-hover)',
                color:      timeframe === tf ? '#fff'                : 'var(--text-muted)',
                boxShadow:  timeframe === tf ? 'var(--shadow-glow-purple)' : 'none',
              }}
            >
              {tf === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Charts grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* ── Revenue bar chart (sorted) ── */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <p className="kpi-label" style={{ marginBottom: 16 }}>Revenue per Rep</p>
          <div style={{ flex: 1, height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                barCategoryGap="30%"
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  width={70}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(123,47,255,0.06)' }} />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]} maxBarSize={18}>
                  {revenueData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Donut chart ── */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p className="kpi-label" style={{ marginBottom: 16, alignSelf: 'flex-start' }}>Activity Distribution</p>

          <div style={{ position: 'relative', width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centre label */}
            <div
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 30, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                {totalDeals + totalTasks}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'Inter', fontWeight: 500 }}>
                Total Actions
              </span>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
            {pieData.map(item => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'Inter' }}>{item.name}</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit', lineHeight: 1 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
