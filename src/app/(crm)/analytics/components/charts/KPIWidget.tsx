import React from 'react';
import { WidgetConfig } from '../../store';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Target, Activity } from 'lucide-react';
import { mockAnalyticsData } from '../../mockData';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface KPIWidgetProps {
  title: string;
  config: WidgetConfig;
}

export function KPIWidget({ title, config }: KPIWidgetProps) {
  const moduleData = mockAnalyticsData[config.module as keyof typeof mockAnalyticsData];
  const metricData = moduleData?.kpi[config.metric as keyof typeof moduleData.kpi];

  const mockValue = metricData?.value || '0';
  const mockDelta = metricData?.delta || '0%';
  const isUp = metricData?.isUp ?? true;
  
  // Use a generic sparkline data if none is explicitly provided, based on the module's bar data
  const sparklineData = moduleData?.bar?.map((item: any) => ({ value: item.revenue || item.value || Math.random() * 100 })) || [];

  const getIcon = () => {
    switch (config.colorTheme) {
      case 'blue': return <DollarSign size={20} />;
      case 'purple': return <Users size={20} />;
      case 'emerald': return <Target size={20} />;
      case 'rose': return <Activity size={20} />;
      default: return <Activity size={20} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '12px 16px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Sparkline */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', opacity: 0.15, pointerEvents: 'none' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData}>
            <Line type="monotone" dataKey="value" stroke={`var(--${config.colorTheme})`} strokeWidth={3} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
        <div style={{ 
          width: 40, height: 40, borderRadius: '12px', 
          background: `var(--${config.colorTheme}-dim)`, 
          color: `var(--${config.colorTheme}-light)`, 
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          {getIcon()}
        </div>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, 
          background: isUp ? 'var(--emerald-dim)' : 'var(--rose-dim)', 
          color: isUp ? 'var(--emerald-light)' : 'var(--rose-light)', 
          padding: '4px 8px', borderRadius: '16px' 
        }}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {mockDelta}
        </div>
      </div>
      <div style={{ marginTop: 'auto', zIndex: 1 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{mockValue}</div>
      </div>
    </div>
  );
}
