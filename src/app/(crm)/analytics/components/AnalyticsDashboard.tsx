'use client';

import React from 'react';
import { TopBar } from './TopBar';
import { WidgetPalette } from './WidgetPalette';
import { CanvasGrid } from './CanvasGrid';
import { WidgetConfigurator } from './WidgetConfigurator';
import { useAnalyticsStore } from '../store';

export function AnalyticsDashboard() {
  const { isEditMode } = useAnalyticsStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <TopBar />
      
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {isEditMode && <WidgetPalette />}
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
          <CanvasGrid />
        </div>
        
        {isEditMode && <WidgetConfigurator />}
      </div>
    </div>
  );
}
