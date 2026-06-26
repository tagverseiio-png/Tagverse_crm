import React, { useEffect, useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useAnalyticsStore } from '../store';
import { WidgetContainer } from './WidgetContainer';

export function CanvasGrid() {
  const { layout, widgets, isEditMode, setLayout } = useAnalyticsStore();
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    // Simple resize observer to make the grid responsive
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

  return (
    <div id="grid-container" style={{ width: '100%', height: '100%', minHeight: 500 }}>
      <GridLayout
        className={`layout ${isEditMode ? 'edit-mode' : ''}`}
        layout={layout}
        cols={12}
        rowHeight={30} // Finer grid control, 30px per row
        width={width}
        onLayoutChange={handleLayoutChange}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        margin={[16, 16]}
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

      {/* Grid background for edit mode */}
      {isEditMode && (
        <style dangerouslySetInnerHTML={{__html: `
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
