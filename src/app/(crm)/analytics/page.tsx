import React from 'react';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

export const metadata = {
  title: 'Analytics Dashboard | Tagverse CRM',
  description: 'Real-time performance metrics and customizable views.',
};

export default function AnalyticsPage() {
  return (
    <div style={{ height: 'calc(100vh - 80px)', padding: '24px' }}>
      <AnalyticsDashboard />
    </div>
  );
}
