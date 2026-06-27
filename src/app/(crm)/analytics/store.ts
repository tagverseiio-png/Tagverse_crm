import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export interface GlobalFilters {
  dateRange: string;
  pipeline: string;
  owner: string;
  tag: string;
}

interface AnalyticsState {
  isEditMode: boolean;
  activeViewId: string;
  layout: LayoutItem[];
  widgets: Widget[];
  selectedWidgetId: string | null;
  globalFilters: GlobalFilters;

  setEditMode: (isEdit: boolean) => void;
  setGlobalFilters: (filters: Partial<GlobalFilters>) => void;
  setLayout: (layout: LayoutItem[]) => void;
  addWidget: (type: WidgetType, x?: number, y?: number) => void;
  removeWidget: (id: string) => void;
  updateWidgetConfig: (id: string, config: Partial<WidgetConfig>) => void;
  updateWidgetTitle: (id: string, title: string) => void;
  updateWidgetType: (id: string, type: WidgetType) => void;
  selectWidget: (id: string | null) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialLayout: LayoutItem[] = [
  { i: 'w1', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
  { i: 'w2', x: 3, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
  { i: 'w3', x: 6, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
  { i: 'w4', x: 9, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
  { i: 'w5', x: 0, y: 4, w: 8, h: 10, minW: 4, minH: 8 },
  { i: 'w6', x: 8, y: 4, w: 4, h: 10, minW: 3, minH: 8 },
  { i: 'w7', x: 0, y: 14, w: 4, h: 10, minW: 3, minH: 8 },
  { i: 'w8', x: 4, y: 14, w: 4, h: 10, minW: 3, minH: 8 },
  { i: 'w9', x: 8, y: 14, w: 4, h: 10, minW: 3, minH: 8 },
];

const initialWidgets: Widget[] = [
  { id: 'w1', type: 'kpi', title: 'Monthly Revenue', config: { module: 'Deals', metric: 'sum', colorTheme: 'blue' } },
  { id: 'w2', type: 'kpi', title: 'Active Clients', config: { module: 'Accounts', metric: 'count', colorTheme: 'purple' } },
  { id: 'w3', type: 'kpi', title: 'Avg ROI', config: { module: 'Campaigns', metric: 'avg', colorTheme: 'emerald' } },
  { id: 'w4', type: 'kpi', title: 'Churn Rate', config: { module: 'Accounts', metric: 'avg', colorTheme: 'rose' } },

  { id: 'w5', type: 'area', title: 'Revenue Trend (YoY)', config: { module: 'Deals', metric: 'sum', colorTheme: 'blue' } },
  { id: 'w6', type: 'donut', title: 'Leads by Source', config: { module: 'Leads', metric: 'count', colorTheme: 'purple' } },

  { id: 'w7', type: 'funnel', title: 'Sales Pipeline Conversion', config: { module: 'Deals', metric: 'count', colorTheme: 'emerald' } },
  { id: 'w8', type: 'bar', title: 'Platform ROI Analysis', config: { module: 'Campaigns', metric: 'sum', colorTheme: 'rose' } },
  { id: 'w9', type: 'pie', title: 'Account Distribution', config: { module: 'Accounts', metric: 'count', colorTheme: 'amber' } },
];

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      isEditMode: false,
      activeViewId: 'default',
      layout: initialLayout,
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

      setLayout: (layout) => set({ layout }),

      addWidget: (type, x = 0, y = 100) => set((state) => {
        const id = `w_${generateId()}`;
        const newWidget: Widget = {
          id,
          type,
          title: `New ${type.toUpperCase()} Widget`,
          config: { module: 'Deals', metric: 'count', colorTheme: 'blue' }
        };

        const w = type === 'kpi' ? 3 : 6;
        const h = type === 'kpi' ? 4 : 11;
        const minW = type === 'kpi' ? 2 : 4;
        const minH = type === 'kpi' ? 3 : 8;

        const newLayoutItem: LayoutItem = {
          i: id, x, y, w, h, minW, minH
        };
        return {
          widgets: [...state.widgets, newWidget],
          layout: [...state.layout, newLayoutItem]
        };
      }),

      removeWidget: (id) => set((state) => ({
        widgets: state.widgets.filter((w) => w.id !== id),
        layout: state.layout.filter((l) => l.i !== id),
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
      partialize: (state) => ({ layout: state.layout, widgets: state.widgets, globalFilters: state.globalFilters }),
    }
  )
);
