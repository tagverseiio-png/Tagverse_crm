import React from 'react';
import { useAnalyticsStore } from '../store';
import { X } from 'lucide-react';
import { analyticsWidgetTypeOptions, analyticsModules, analyticsMetrics, analyticsColorThemes } from '@/lib/mockData';

export function WidgetConfigurator() {
  const { isEditMode, widgets, selectedWidgetId, selectWidget, updateWidgetConfig, updateWidgetTitle, updateWidgetType } = useAnalyticsStore();

  if (!isEditMode || !selectedWidgetId) return null;

  const widget = widgets.find(w => w.id === selectedWidgetId);
  if (!widget) return null;

  const labelStyle = { fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, marginBottom: 8, display: 'block' };
  const inputStyle = { width: '100%', padding: '8px 12px', fontSize: 13, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', outline: 'none' };

  return (
    <div style={{ width: 320, flexShrink: 0, borderLeft: '1px solid var(--border)', paddingLeft: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Configure Widget</h3>
        <button onClick={() => selectWidget(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelStyle}>Widget Title</label>
          <input 
            type="text" 
            value={widget.title}
            onChange={(e) => updateWidgetTitle(widget.id, e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Widget Type</label>
          <select
            value={widget.type}
            onChange={(e) => updateWidgetType(widget.id, e.target.value as any)}
            style={inputStyle}
          >
            {analyticsWidgetTypeOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Data Module</label>
          <select
            value={widget.config.module}
            onChange={(e) => updateWidgetConfig(widget.id, { module: e.target.value })}
            style={inputStyle}
          >
            {analyticsModules.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Metric Aggregation</label>
          <select
            value={widget.config.metric}
            onChange={(e) => updateWidgetConfig(widget.id, { metric: e.target.value })}
            style={inputStyle}
          >
            {analyticsMetrics.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Color Theme</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {analyticsColorThemes.map(color => (
              <button
                key={color}
                onClick={() => updateWidgetConfig(widget.id, { colorTheme: color })}
                style={{
                  width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
                  border: widget.config.colorTheme === color ? '2px solid var(--text-primary)' : '2px solid transparent',
                  background: `var(--${color})`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
