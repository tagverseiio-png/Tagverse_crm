import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WidgetConfig } from '../../store';
import { mockAnalyticsData } from '../../mockData';

interface AreaChartWidgetProps {
  title: string;
  config: WidgetConfig;
}

export function AreaChartWidget({ title, config }: AreaChartWidgetProps) {
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
  
  const getLightColor = () => {
    switch(config.colorTheme) {
      case 'blue': return 'var(--blue-light)';
      case 'purple': return 'var(--purple-light)';
      case 'emerald': return 'var(--emerald-light)';
      case 'rose': return 'var(--rose-light)';
      default: return 'var(--blue-light)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '16px 20px' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>{title}</h3>
      <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`colorValue_${config.colorTheme}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getLightColor()} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={getLightColor()} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '13px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
              labelStyle={{ color: 'var(--text-muted)', marginBottom: 4 }}
            />
            <Area type="monotone" dataKey="revenue" stroke={getColor()} fillOpacity={1} fill={`url(#colorValue_${config.colorTheme})`} strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
