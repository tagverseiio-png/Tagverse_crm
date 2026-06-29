import React from 'react';
import { useAnalyticsStore } from '../store';
import { Filter, Calendar, Users, Tag, Building2 } from 'lucide-react';
import { analyticsFilterOptions } from '@/lib/mockData';

export function GlobalFilters() {
  const { globalFilters, setGlobalFilters } = useAnalyticsStore();
  
  const selectStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    padding: '6px 12px 6px 32px',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    appearance: 'none' as const,
    cursor: 'pointer',
    minWidth: '140px'
  };

  const iconStyle = {
    position: 'absolute' as const,
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none' as const
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>
        <Filter size={16} /> Filters:
      </div>

      <div style={{ position: 'relative' }}>
        <Calendar size={14} style={iconStyle} />
        <select style={selectStyle} value={globalFilters.dateRange} onChange={(e) => setGlobalFilters({ dateRange: e.target.value })}>
          {analyticsFilterOptions.dateRange.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, color: 'var(--text-muted)' }}>▼</div>
      </div>

      <div style={{ position: 'relative' }}>
        <Building2 size={14} style={iconStyle} />
        <select style={selectStyle} value={globalFilters.pipeline} onChange={(e) => setGlobalFilters({ pipeline: e.target.value })}>
          {analyticsFilterOptions.pipeline.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, color: 'var(--text-muted)' }}>▼</div>
      </div>

      <div style={{ position: 'relative' }}>
        <Users size={14} style={iconStyle} />
        <select style={selectStyle} value={globalFilters.owner} onChange={(e) => setGlobalFilters({ owner: e.target.value })}>
          {analyticsFilterOptions.owner.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, color: 'var(--text-muted)' }}>▼</div>
      </div>

      <div style={{ position: 'relative' }}>
        <Tag size={14} style={iconStyle} />
        <select style={selectStyle} value={globalFilters.tag} onChange={(e) => setGlobalFilters({ tag: e.target.value })}>
          {analyticsFilterOptions.tag.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, color: 'var(--text-muted)' }}>▼</div>
      </div>
    </div>
  );
}
