import React from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { Widget } from '../store';
import { KPIWidget } from './charts/KPIWidget';
import { BarChartWidget } from './charts/BarChartWidget';
import { DonutChartWidget } from './charts/DonutChartWidget';
import { useAnalyticsStore } from '../store';

interface WidgetContainerProps {
  widget: Widget;
}

export function WidgetContainer({ widget }: WidgetContainerProps) {
  const { isEditMode, removeWidget, selectWidget, selectedWidgetId } = useAnalyticsStore();
  const isSelected = selectedWidgetId === widget.id;

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'kpi': return <KPIWidget title={widget.title} config={widget.config} />;
      case 'bar': return <BarChartWidget title={widget.title} config={widget.config} />;
      case 'donut': return <DonutChartWidget title={widget.title} config={widget.config} />;
      default: return <div>Unknown widget type</div>;
    }
  };

  return (
    <div 
      className={isEditMode ? 'cursor-grab active:cursor-grabbing' : ''}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'var(--bg-card)',
        border: isSelected && isEditMode ? '2px solid var(--blue)' : '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: isSelected && isEditMode ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
      }}
      onClick={() => isEditMode && selectWidget(widget.id)}
    >
      {/* Edit Mode Overlay / Controls */}
      {isEditMode && (
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4, zIndex: 10 }}>
          <button 
            style={{ padding: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', color: 'var(--text-muted)' }}
            onClick={(e) => { e.stopPropagation(); selectWidget(widget.id); }}
          >
            <Settings size={14} />
          </button>
          <button 
            style={{ padding: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', color: 'var(--rose)' }}
            onClick={(e) => { e.stopPropagation(); removeWidget(widget.id); }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* Actual Widget Content */}
      <div style={{ width: '100%', height: '100%', padding: 16, pointerEvents: 'auto' }}>
        {renderWidgetContent()}
      </div>
    </div>
  );
}
