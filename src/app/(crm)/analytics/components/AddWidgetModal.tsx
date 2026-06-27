import React from 'react';
import { useAnalyticsStore, WidgetType } from '../store';
import { X, LayoutGrid, BarChart2, PieChart, LineChart, Filter, Activity, Plus } from 'lucide-react';

interface AddWidgetModalProps {
  onClose: () => void;
}

export function AddWidgetModal({ onClose }: AddWidgetModalProps) {
  const { addWidget } = useAnalyticsStore();

  const handleAdd = (type: WidgetType) => {
    addWidget(type, 0, 100); 
    onClose();
  };

  const buttonStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
    padding: 16, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-card)', 
    cursor: 'pointer', width: '100%', textAlign: 'left' as const, transition: 'all 0.2s ease',
  };

  const widgets: { type: WidgetType; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    { type: 'kpi', label: 'KPI Card', desc: 'Single metric summary with sparkline', icon: <LayoutGrid size={18} />, color: 'blue' },
    { type: 'bar', label: 'Bar Chart', desc: 'Compare categories across a dimension', icon: <BarChart2 size={18} />, color: 'purple' },
    { type: 'line', label: 'Line Chart', desc: 'View trends over time', icon: <LineChart size={18} />, color: 'emerald' },
    { type: 'pie', label: 'Pie Chart', desc: 'Part-to-whole ratio (solid)', icon: <PieChart size={18} />, color: 'amber' },
    { type: 'donut', label: 'Donut Chart', desc: 'Part-to-whole ratio (hollow)', icon: <PieChart size={18} />, color: 'rose' },
    { type: 'funnel', label: 'Funnel Chart', desc: 'Conversion rates across stages', icon: <Filter size={18} />, color: 'blue' },
    { type: 'area', label: 'Area Chart', desc: 'Volume trends over time', icon: <Activity size={18} />, color: 'purple' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 24, width: 600, maxWidth: '90vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 48px rgba(0,0,0,0.4)' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Add Component</h2>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Select a widget type to add to your dashboard grid.</div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>
        
        <div style={{ padding: 32, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="custom-scrollbar hover-bg-wrapper">
          {widgets.map(w => (
            <button key={w.type} onClick={() => handleAdd(w.type)} style={buttonStyle} className="hover-lift">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `var(--${w.color}-dim)`, color: `var(--${w.color}-light)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {w.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{w.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{w.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .hover-bg-wrapper button:hover { border-color: var(--border-bright) !important; background: var(--bg-card-hover) !important; }
        `}} />
      </div>
    </div>
  );
}
