import React from 'react';
import { useAnalyticsStore, WidgetType } from '../store';
import { LayoutGrid, BarChart2, PieChart, Plus } from 'lucide-react';

export function WidgetPalette() {
  const { isEditMode, addWidget } = useAnalyticsStore();

  if (!isEditMode) return null;

  const handleAdd = (type: WidgetType) => {
    addWidget(type, 0, 100); 
  };

  const buttonStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
    padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', 
    cursor: 'pointer', marginBottom: 12, width: '100%', textAlign: 'left' as const
  };

  return (
    <div style={{ width: 256, flexShrink: 0, borderRight: '1px solid var(--border)', paddingRight: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Add Widget</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => handleAdd('kpi')} style={buttonStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 8, borderRadius: 6, background: 'var(--blue-dim)', color: 'var(--blue-light)' }}><LayoutGrid size={16} /></div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>KPI Card</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Single metric summary</div>
            </div>
          </div>
          <Plus size={16} style={{ color: 'var(--text-muted)' }} />
        </button>

        <button onClick={() => handleAdd('bar')} style={buttonStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 8, borderRadius: 6, background: 'var(--purple-dim)', color: 'var(--purple-light)' }}><BarChart2 size={16} /></div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Bar Chart</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Compare categories</div>
            </div>
          </div>
          <Plus size={16} style={{ color: 'var(--text-muted)' }} />
        </button>

        <button onClick={() => handleAdd('donut')} style={buttonStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 8, borderRadius: 6, background: 'var(--emerald-dim)', color: 'var(--emerald-light)' }}><PieChart size={16} /></div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Donut Chart</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Part-to-whole ratio</div>
            </div>
          </div>
          <Plus size={16} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
    </div>
  );
}
