import React from 'react';
import { useAnalyticsStore } from '../store';
import { Filter, Calendar, Users, Tag, Building2 } from 'lucide-react';

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
        <select 
          style={selectStyle} 
          value={globalFilters.dateRange} 
          onChange={(e) => setGlobalFilters({ dateRange: e.target.value })}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="30days">Last 30 Days</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, color: 'var(--text-muted)' }}>▼</div>
      </div>

      <div style={{ position: 'relative' }}>
        <Building2 size={14} style={iconStyle} />
        <select 
          style={selectStyle} 
          value={globalFilters.pipeline} 
          onChange={(e) => setGlobalFilters({ pipeline: e.target.value })}
        >
          <option value="all">All Pipelines</option>
          <option value="sales">Sales Pipeline</option>
          <option value="marketing">Marketing Pipeline</option>
          <option value="renewals">Renewals</option>
        </select>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, color: 'var(--text-muted)' }}>▼</div>
      </div>

      <div style={{ position: 'relative' }}>
        <Users size={14} style={iconStyle} />
        <select 
          style={selectStyle} 
          value={globalFilters.owner} 
          onChange={(e) => setGlobalFilters({ owner: e.target.value })}
        >
          <option value="all">All Owners</option>
          <option value="me">Assigned to Me</option>
          <option value="unassigned">Unassigned</option>
        </select>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, color: 'var(--text-muted)' }}>▼</div>
      </div>

      <div style={{ position: 'relative' }}>
        <Tag size={14} style={iconStyle} />
        <select 
          style={selectStyle} 
          value={globalFilters.tag} 
          onChange={(e) => setGlobalFilters({ tag: e.target.value })}
        >
          <option value="all">All Tags</option>
          <option value="enterprise">Enterprise</option>
          <option value="smb">SMB</option>
          <option value="vip">VIP</option>
        </select>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, color: 'var(--text-muted)' }}>▼</div>
      </div>
    </div>
  );
}
