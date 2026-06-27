import React, { useState } from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { Widget } from '../store';
import { KPIWidget } from './charts/KPIWidget';
import { BarChartWidget } from './charts/BarChartWidget';
import { DonutChartWidget } from './charts/DonutChartWidget';
import { LineChartWidget } from './charts/LineChartWidget';
import { PieChartWidget } from './charts/PieChartWidget';
import { FunnelChartWidget } from './charts/FunnelChartWidget';
import { AreaChartWidget } from './charts/AreaChartWidget';
import { useAnalyticsStore } from '../store';

interface WidgetContainerProps {
  widget: Widget;
}

export function WidgetContainer({ widget }: WidgetContainerProps) {
  const { isEditMode, removeWidget, selectWidget, selectedWidgetId } = useAnalyticsStore();
  const isSelected = selectedWidgetId === widget.id;
  const [isHovered, setIsHovered] = useState(false);

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'kpi': return <KPIWidget title={widget.title} config={widget.config} />;
      case 'bar': return <BarChartWidget title={widget.title} config={widget.config} />;
      case 'donut': return <DonutChartWidget title={widget.title} config={widget.config} />;
      case 'line': return <LineChartWidget title={widget.title} config={widget.config} />;
      case 'pie': return <PieChartWidget title={widget.title} config={widget.config} />;
      case 'funnel': return <FunnelChartWidget title={widget.title} config={widget.config} />;
      case 'area': return <AreaChartWidget title={widget.title} config={widget.config} />;
      default: return <div>Unknown widget type</div>;
    }
  };

  return (
    <div 
      className={isEditMode ? 'cursor-grab active:cursor-grabbing' : ''}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'var(--bg-card)',
        border: isSelected && isEditMode ? '2px solid var(--blue)' : '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: isSelected && isEditMode ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
      }}
      onClick={() => isEditMode && selectWidget(widget.id)}
    >
      {/* Edit Mode Overlay / Controls - Visible on Hover */}
      {isEditMode && isHovered && (
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6, zIndex: 10 }}>
          <button 
            style={{ padding: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text-muted)' }}
            onClick={(e) => { e.stopPropagation(); selectWidget(widget.id); }}
            title="Configure Widget"
          >
            <Settings size={14} />
          </button>
          <button 
            style={{ padding: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--rose)' }}
            onClick={(e) => { e.stopPropagation(); removeWidget(widget.id); }}
            title="Remove Widget"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* Actual Widget Content */}
      <div style={{ width: '100%', height: '100%', pointerEvents: isEditMode ? 'none' : 'auto' }}>
        {renderWidgetContent()}
      </div>
    </div>
  );
}
