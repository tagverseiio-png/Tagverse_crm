import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { WidgetConfig } from '../../store';
import { mockAnalyticsData } from '../../mockData';

interface PieChartWidgetProps {
  title: string;
  config: WidgetConfig;
}

export function PieChartWidget({ title, config }: PieChartWidgetProps) {
  const moduleData = mockAnalyticsData[config.module as keyof typeof mockAnalyticsData];
  const data = moduleData?.donut || [];

  const COLORS = {
    blue: ['var(--blue)', 'var(--blue-light)', 'var(--blue-dim)'],
    purple: ['var(--purple)', 'var(--purple-light)', 'var(--purple-dim)'],
    emerald: ['var(--emerald)', 'var(--emerald-light)', 'var(--emerald-dim)'],
    rose: ['var(--rose)', 'var(--rose-light)', 'var(--rose-dim)'],
    amber: ['var(--amber)', 'var(--amber-light)', 'var(--amber-dim)'],
  };

  const themeColors = COLORS[config.colorTheme as keyof typeof COLORS] || COLORS.blue;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '16px 20px' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{title}</h3>
      <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
              stroke="var(--bg-card)"
              strokeWidth={2}
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={themeColors[index % themeColors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '13px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
