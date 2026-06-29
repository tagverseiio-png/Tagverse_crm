import React, { useMemo } from 'react';
import { useAnalyticsStore } from '../store';
import { WidgetContainer } from './WidgetContainer';
import { LayoutDashboard } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

export function CanvasGrid() {
  const { widgets, isEditMode, reorderWidgets } = useAnalyticsStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);
      reorderWidgets(oldIndex, newIndex);
    }
  };

  const widgetIds = useMemo(() => widgets.map((w) => w.id), [widgets]);

  if (widgets.length === 0) {
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
    <div id="grid-container" style={{ width: '100%', minHeight: 500, paddingBottom: 40 }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
          <div 
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 20, 
              alignItems: 'flex-start',
              position: 'relative'
            }}
          >
            {widgets.map((widget) => (
              <WidgetContainer key={widget.id} widget={widget} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

