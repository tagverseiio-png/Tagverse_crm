import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { analyticsInitialLayout, analyticsInitialWidgets } from '@/lib/mockData';

export type WidgetType = 'kpi' | 'bar' | 'donut' | 'line' | 'pie' | 'funnel' | 'area';

export interface WidgetConfig {
  module: string;
  metric: string;
  groupBy?: string;
  colorTheme: string;
  dateRange?: string;
  dataSource?: string;
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  config: WidgetConfig;
}

// Removing LayoutItem since we are using fluid layout with dnd-kit

export interface GlobalFilters {
  dateRange: string;
  pipeline: string;
  owner: string;
  tag: string;
}

interface AnalyticsState {
  isEditMode: boolean;
  activeViewId: string;
  // layout: LayoutItem[]; // Removed in favor of fluid layout
  widgets: Widget[];
  selectedWidgetId: string | null;
  globalFilters: GlobalFilters;

  setEditMode: (isEdit: boolean) => void;
  setGlobalFilters: (filters: Partial<GlobalFilters>) => void;
  reorderWidgets: (startIndex: number, endIndex: number) => void;
  addWidget: (type: WidgetType, x?: number, y?: number) => void;
  removeWidget: (id: string) => void;
  updateWidgetConfig: (id: string, config: Partial<WidgetConfig>) => void;
  updateWidgetTitle: (id: string, title: string) => void;
  updateWidgetType: (id: string, type: WidgetType) => void;
  selectWidget: (id: string | null) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// const initialLayout = analyticsInitialLayout;

const initialWidgets = analyticsInitialWidgets as Widget[];

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      isEditMode: false,
      activeViewId: 'default',
      // layout: initialLayout,
      widgets: initialWidgets,
      selectedWidgetId: null,
      globalFilters: {
        dateRange: '30days',
        pipeline: 'all',
        owner: 'all',
        tag: 'all'
      },

      setEditMode: (isEdit) => set({ isEditMode: isEdit, selectedWidgetId: null }),

      setGlobalFilters: (filters) => set((state) => ({
        globalFilters: { ...state.globalFilters, ...filters }
      })),

      reorderWidgets: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.widgets);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { widgets: result };
      }),

      addWidget: (type, x = 0, y = 100) => set((state) => {
        const id = `w_${generateId()}`;
        const newWidget: Widget = {
          id,
          type,
          title: `New ${type.toUpperCase()} Widget`,
          config: { module: 'Deals', metric: 'count', colorTheme: 'blue' }
        };

        return {
          widgets: [...state.widgets, newWidget],
        };
      }),

      removeWidget: (id) => set((state) => ({
        widgets: state.widgets.filter((w) => w.id !== id),
        selectedWidgetId: state.selectedWidgetId === id ? null : state.selectedWidgetId
      })),

      updateWidgetConfig: (id, config) => set((state) => ({
        widgets: state.widgets.map((w) => w.id === id ? { ...w, config: { ...w.config, ...config } } : w)
      })),

      updateWidgetTitle: (id, title) => set((state) => ({
        widgets: state.widgets.map((w) => w.id === id ? { ...w, title } : w)
      })),

      updateWidgetType: (id, type) => set((state) => ({
        widgets: state.widgets.map((w) => w.id === id ? { ...w, type } : w)
      })),

      selectWidget: (id) => set({ selectedWidgetId: id })
    }),
    {
      name: 'crm-analytics-dashboard-v2',
      partialize: (state) => ({ widgets: state.widgets, globalFilters: state.globalFilters }),
    }
  )
);
