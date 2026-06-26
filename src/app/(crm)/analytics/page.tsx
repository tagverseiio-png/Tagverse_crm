import React from 'react';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

export const metadata = {
  title: 'Analytics Dashboard | Tagverse CRM',
  description: 'Real-time performance metrics and customizable views.',
};

export default function AnalyticsPage() {
  return (
    <div className="h-[calc(100vh-80px)] p-6">
      <AnalyticsDashboard />
    </div>
  );
}
