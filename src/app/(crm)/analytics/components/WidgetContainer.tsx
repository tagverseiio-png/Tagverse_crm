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
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface WidgetContainerProps {
  widget: Widget;
}

export function WidgetContainer({ widget }: WidgetContainerProps) {
  const { isEditMode, removeWidget, selectWidget, selectedWidgetId } = useAnalyticsStore();
  const isSelected = selectedWidgetId === widget.id;
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

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

  // Define fixed sizes based on widget type
  let widgetWidth = 'calc(50% - 10px)';
  let minWidth = 400;
  let widgetHeight = 380;
  let flexGrow = 0;

  if (widget.type === 'kpi') {
    widgetWidth = 'calc(25% - 15px)';
    minWidth = 240;
    widgetHeight = 160;
    flexGrow = 1;
  } else if (widget.type === 'pie' || widget.type === 'donut') {
    widgetWidth = '380px'; // Square shape
    minWidth = 380;
    widgetHeight = 380;
  } else if (widget.type === 'funnel') {
    widgetWidth = '380px'; // Horizontally reduced
    minWidth = 380;
    widgetHeight = 460; // Gain some height vertically
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'relative',
        width: widgetWidth,
        minWidth: minWidth,
        height: widgetHeight,
        background: 'var(--bg-card)',
        border: isSelected && isEditMode ? '2px solid var(--blue)' : '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: isSelected && isEditMode ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
        flexGrow: flexGrow,
      }}
      className={isEditMode ? 'cursor-grab active:cursor-grabbing' : ''}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => isEditMode && selectWidget(widget.id)}
      {...attributes}
      {...listeners}
    >
      {/* Edit Mode Overlay / Controls - Visible on Hover */}
      {isEditMode && isHovered && (
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6, zIndex: 10 }}>
          <button
            style={{ padding: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text-muted)' }}
            onClick={(e) => { e.stopPropagation(); selectWidget(widget.id); }}
            title="Configure Widget"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Settings size={14} />
          </button>
          <button
            style={{ padding: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--rose)' }}
            onClick={(e) => { e.stopPropagation(); removeWidget(widget.id); }}
            title="Remove Widget"
            onPointerDown={(e) => e.stopPropagation()}
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

