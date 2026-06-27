'use client';

import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { CanvasGrid } from './CanvasGrid';
import { WidgetConfigurator } from './WidgetConfigurator';
import { useAnalyticsStore } from '../store';
import { AddWidgetModal } from './AddWidgetModal';

export function AnalyticsDashboard() {
  const { isEditMode } = useAnalyticsStore();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <TopBar onAddClick={() => setShowAddModal(true)} />
      
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
          <CanvasGrid />
        </div>
        
        {isEditMode && <WidgetConfigurator />}
      </div>

      {showAddModal && <AddWidgetModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
