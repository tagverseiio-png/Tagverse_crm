import React from 'react';
import { WidgetConfig } from '../../store';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Target, Activity } from 'lucide-react';
import { mockAnalyticsData } from '../../mockData';

interface KPIWidgetProps {
  title: string;
  config: WidgetConfig;
}

export function KPIWidget({ title, config }: KPIWidgetProps) {
  // Use config to dynamically pull from mock data
  const moduleData = mockAnalyticsData[config.module as keyof typeof mockAnalyticsData];
  const metricData = moduleData?.kpi[config.metric as keyof typeof moduleData.kpi];

  // Fallbacks if data doesn't exist
  const mockValue = metricData?.value || '0';
  const mockDelta = metricData?.delta || '0%';
  const isUp = metricData?.isUp ?? true;
  
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', padding: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          width: 36, height: 36, borderRadius: '50%', 
          background: `var(--${config.colorTheme}-dim)`, 
          color: `var(--${config.colorTheme}-light)`, 
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          {getIcon()}
        </div>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, 
          background: isUp ? 'var(--emerald-dim)' : 'var(--rose-dim)', 
          color: isUp ? 'var(--emerald-light)' : 'var(--rose-light)', 
          padding: '2px 6px', borderRadius: 12 
        }}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {mockDelta}
        </div>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{mockValue}</div>
      </div>
    </div>
  );
}
