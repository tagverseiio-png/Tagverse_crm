import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WidgetConfig } from '../../store';
import { mockAnalyticsData } from '../../mockData';

interface LineChartWidgetProps {
  title: string;
  config: WidgetConfig;
}

export function LineChartWidget({ title, config }: LineChartWidgetProps) {
  const moduleData = mockAnalyticsData[config.module as keyof typeof mockAnalyticsData];
  const data = moduleData?.bar || [];

  const getColor = () => {
    switch(config.colorTheme) {
      case 'blue': return 'var(--blue)';
      case 'purple': return 'var(--purple)';
      case 'emerald': return 'var(--emerald)';
      case 'rose': return 'var(--rose)';
      default: return 'var(--blue)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '16px 20px' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>{title}</h3>
      <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '13px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
              labelStyle={{ color: 'var(--text-muted)', marginBottom: 4 }}
            />
            <Line type="monotone" dataKey="revenue" stroke={getColor()} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'var(--bg-card)' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
