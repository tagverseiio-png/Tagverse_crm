import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { WidgetConfig } from '../../store';
import { mockAnalyticsData } from '../../mockData';

interface DonutChartWidgetProps {
  title: string;
  config: WidgetConfig;
}

export function DonutChartWidget({ title, config }: DonutChartWidgetProps) {
  const moduleData = mockAnalyticsData[config.module as keyof typeof mockAnalyticsData];
  const data = moduleData?.donut || [];

  const getColors = () => {
    return ['var(--blue)', 'var(--purple-light)', 'var(--emerald)', 'var(--rose)'];
  };
  
  const COLORS = getColors();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: 8 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>{title}</h3>
      <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', color: 'var(--text-muted)' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
