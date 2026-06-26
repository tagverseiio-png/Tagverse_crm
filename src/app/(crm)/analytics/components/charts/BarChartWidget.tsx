import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WidgetConfig } from '../../store';
import { mockAnalyticsData } from '../../mockData';

interface BarChartWidgetProps {
  title: string;
  config: WidgetConfig;
}

export function BarChartWidget({ title, config }: BarChartWidgetProps) {
  const moduleData = mockAnalyticsData[config.module as keyof typeof mockAnalyticsData];
  const data = moduleData?.bar || [];

  const getColor = () => {
    switch(config.colorTheme) {
      case 'blue': return 'var(--blue-light)';
      case 'purple': return 'var(--purple-light)';
      case 'emerald': return 'var(--emerald-light)';
      case 'rose': return 'var(--rose-light)';
      default: return 'var(--blue-light)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: 8 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>{title}</h3>
      <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Bar dataKey="revenue" fill={getColor()} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
