import React, { useEffect, useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useAnalyticsStore } from '../store';
import { WidgetContainer } from './WidgetContainer';
import { LayoutDashboard } from 'lucide-react';

export function CanvasGrid() {
  const { layout, widgets, isEditMode, setLayout } = useAnalyticsStore();
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('grid-container');
      if (container) setWidth(container.offsetWidth);
    };

    window.addEventListener('resize', updateWidth);
    updateWidth();

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  };

  if (layout.length === 0) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, border: '1px dashed var(--border)' }}>
          <LayoutDashboard size={32} style={{ opacity: 0.5 }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Your Dashboard is Empty</h3>
        <p style={{ fontSize: 14 }}>Click "Edit Layout" and add some components to get started.</p>
      </div>
    );
  }

  return (
    <div id="grid-container" style={{ width: '100%', height: '100%', minHeight: 500 }}>
      <GridLayout
        className={`layout ${isEditMode ? 'edit-mode' : ''}`}
        layout={layout}
        cols={12}
        rowHeight={15}
        width={width}
        onLayoutChange={handleLayoutChange}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        margin={[20, 20]}
        draggableHandle=".cursor-grab"
      >
        {layout.map((l) => {
          const widget = widgets.find((w) => w.id === l.i);
          if (!widget) return <div key={l.i} />;
          return (
            <div key={l.i}>
              <WidgetContainer widget={widget} />
            </div>
          );
        })}
      </GridLayout>

      {isEditMode && (
        <style dangerouslySetInnerHTML={{
          __html: `
          .edit-mode {
            background-image: radial-gradient(var(--border) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          .react-resizable-handle {
            background-image: none !important;
            
            width: 15px;
            height: 15px;
            bottom: 5px;
            right: 5px;
            background-color: var(--blue);
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.2s;
          }
          .react-grid-item:hover .react-resizable-handle {
            opacity: 1;
          }
        `}} />
      )}
    </div>
  );
}
