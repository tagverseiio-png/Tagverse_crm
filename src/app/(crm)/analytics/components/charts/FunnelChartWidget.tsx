import React from 'react';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer } from 'recharts';
import { WidgetConfig } from '../../store';
import { mockAnalyticsData } from '../../mockData';

interface FunnelChartWidgetProps {
  title: string;
  config: WidgetConfig;
}

export function FunnelChartWidget({ title, config }: FunnelChartWidgetProps) {
  const moduleData = mockAnalyticsData[config.module as keyof typeof mockAnalyticsData];
  const data = moduleData?.funnel || [
    { value: 100, name: 'Visitors', fill: 'var(--blue)' },
    { value: 80, name: 'Engaged', fill: 'var(--purple)' },
    { value: 50, name: 'Leads', fill: 'var(--emerald)' },
    { value: 20, name: 'Customers', fill: 'var(--rose)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '16px 20px' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{title}</h3>
      <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '13px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
            />
            <Funnel dataKey="value" data={data} isAnimationActive>
              <LabelList position="right" fill="var(--text-primary)" stroke="none" dataKey="name" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
