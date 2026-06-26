import React from 'react';
import { useAnalyticsStore } from '../store';
import { Download, Share2, Edit3, Save, X, Calendar } from 'lucide-react';

export function TopBar() {
  const { isEditMode, setEditMode } = useAnalyticsStore();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
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
              <Calendar size={16} /> Last 30 Days
            </button>
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
  );
}
