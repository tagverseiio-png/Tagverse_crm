import React from 'react';
import { useAnalyticsStore } from '../store';
import { Download, Share2, Edit3, Save, X, Plus } from 'lucide-react';
import { GlobalFilters } from './GlobalFilters';

interface TopBarProps {
  onAddClick: () => void;
}

export function TopBar({ onAddClick }: TopBarProps) {
  const { isEditMode, setEditMode } = useAnalyticsStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            Analytics Dashboard
            {isEditMode && <span style={{ fontSize: 10, padding: '2px 8px', background: 'var(--blue-dim)', color: 'var(--blue-light)', borderRadius: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Edit Mode</span>}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Real-time performance metrics across all client accounts.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isEditMode ? (
            <>
              <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <Share2 size={16} /> Share
              </button>
              <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <Download size={16} /> Export
              </button>
              <button 
                onClick={() => setEditMode(true)}
                className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}
              >
                <Edit3 size={16} /> Edit Layout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onAddClick}
                className="btn btn-cta" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--blue)', marginRight: 12 }}
              >
                <Plus size={16} /> Add Component
              </button>
              <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />
              <button 
                onClick={() => setEditMode(false)}
                className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <X size={16} /> Cancel
              </button>
              <button 
                onClick={() => setEditMode(false)}
                className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Save size={16} /> Save Changes
              </button>
            </>
          )}
        </div>
      </div>
      <GlobalFilters />
    </div>
  );
}
