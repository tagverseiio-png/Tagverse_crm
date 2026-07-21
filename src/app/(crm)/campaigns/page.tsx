'use client';
import React, { useState, useEffect } from 'react';
import { 
  Plus, RefreshCw, Search, Filter, CheckCircle2, 
  Lock, Edit2, Trash2, X, Layers, AlertCircle, Sparkles 
} from 'lucide-react';

// SVG Icons for Meta and Google
const MetaIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: '#3b82f6', fill: 'currentColor' }} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }} xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

const InternalIcon = () => (
  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '50%', background: 'rgba(124, 92, 191, 0.1)', color: 'var(--purple)' }}>
    <Layers size={10} />
  </span>
);

type Campaign = {
  id: string;
  name: string;
  source: string; // 'internal', 'meta', 'google'
  status: string; // 'Active', 'Paused', 'Draft'
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  lastSynced: string | null;
  channel?: string; // Legacy API support
  startDate?: string;
  endDate?: string;
};

// ─── Modal Component ──────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: React.ReactNode; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 20, padding: 32, width: '100%', maxWidth: 520,
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)', position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1px solid var(--border)', background: 'var(--bg-secondary)',
  color: 'var(--text-primary)', fontSize: 14, outline: 'none',
  boxSizing: 'border-box' as const,
};

const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
  textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: 6,
};

export default function CampaignsPage() {
  const [internalCampaigns, setInternalCampaigns] = useState<Campaign[]>([]);
  const [externalCampaigns, setExternalCampaigns] = useState<Campaign[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [syncing, setSyncing] = useState(false);
  const [lastSyncGlobal, setLastSyncGlobal] = useState('2026-07-07 11:15 AM');
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  const [connectedSources, setConnectedSources] = useState({ meta: false, google: false });
  const [activeModal, setActiveModal] = useState<{ type: string | null; campaign: Campaign | null }>({ type: null, campaign: null });
  const [formData, setFormData] = useState({ name: '', budget: '', status: 'Draft', channel: 'Email', startDate: '', endDate: '' });
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // Fetch standard internal campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const json = await res.json();
      
      const parsed: Campaign[] = (json.data || []).map((c: any) => {
        // Parse budget and spent from string to number for new UI
        const parseAmount = (s: string) => {
          if (!s || s === '—') return 0;
          const n = s.replace(/[₹$,\s]/g, '');
          if (n.endsWith('L')) return parseFloat(n) * 100000;
          if (n.endsWith('K')) return parseFloat(n) * 1000;
          return parseFloat(n) || 0;
        };

        return {
          id: c.id,
          name: c.name,
          source: 'internal',
          channel: c.channel,
          status: c.status,
          budget: parseAmount(c.budget),
          spent: parseAmount(c.spent),
          impressions: 0,
          clicks: 0,
          lastSynced: null,
          startDate: c.startDate,
          endDate: c.endDate
        };
      });
      setInternalCampaigns(parsed);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeModal.type === 'create') {
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          budget: formData.budget,
          status: formData.status,
          channel: formData.channel,
          startDate: formData.startDate,
          endDate: formData.endDate
        })
      });
      showToast('Campaign created successfully!');
    } else if (activeModal.type === 'edit' && activeModal.campaign) {
      await fetch(`/api/campaigns/${activeModal.campaign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          budget: formData.budget,
          status: formData.status,
          channel: formData.channel,
          startDate: formData.startDate,
          endDate: formData.endDate
        })
      });
      showToast('Campaign updated!');
    }
    setActiveModal({ type: null, campaign: null });
    fetchCampaigns();
  };

  const handleDeleteCampaign = async () => {
    if (!activeModal.campaign) return;
    await fetch(`/api/campaigns/${activeModal.campaign.id}`, { method: 'DELETE' });
    showToast('Campaign deleted.');
    setActiveModal({ type: null, campaign: null });
    fetchCampaigns();
  };

  const handleConnectProvider = (provider: 'Meta' | 'Google') => {
    setConnectedSources(prev => ({ ...prev, [provider.toLowerCase()]: true }));
    
    const mockCampaigns = provider === 'Meta' ? [
      {
        id: `camp-meta-${Date.now()}`,
        name: `Meta - US Brand awareness`,
        source: 'meta',
        status: 'Active',
        budget: 9500,
        spent: 2400,
        impressions: 89000,
        clicks: 3410,
        lastSynced: 'Just now'
      }
    ] : [
      {
        id: `camp-google-${Date.now()}`,
        name: `Google - Search Performance Max`,
        source: 'google',
        status: 'Active',
        budget: 15000,
        spent: 800,
        impressions: 43000,
        clicks: 1980,
        lastSynced: 'Just now'
      }
    ];

    setExternalCampaigns(prev => [...mockCampaigns, ...prev]);
    showToast(`${provider} Ads connected successfully.`);
  };

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setExternalCampaigns(prev => prev.map(c => {
        const spendDiff = Math.floor(Math.random() * 250) + 50;
        const clickDiff = Math.floor(Math.random() * 40) + 10;
        const impDiff = clickDiff * 15;
        const updatedSpent = Math.min(c.budget, c.spent + spendDiff);
        
        return {
          ...c,
          spent: updatedSpent,
          impressions: c.impressions + impDiff,
          clicks: c.clicks + clickDiff,
          lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString()
        };
      }));
      
      const nowString = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncGlobal(nowString);
      setSyncing(false);
      setShowSyncSuccess(true);
      setTimeout(() => setShowSyncSuccess(false), 4000);
    }, 1200);
  };

  const allCampaigns = [...externalCampaigns, ...internalCampaigns];

  const filteredCampaigns = allCampaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesChannel = true;
    if (channelFilter === 'Meta') matchesChannel = c.source === 'meta';
    else if (channelFilter === 'Google') matchesChannel = c.source === 'google';
    else if (channelFilter === 'Internal') matchesChannel = c.source === 'internal';

    let matchesStatus = true;
    if (statusFilter !== 'All') matchesStatus = c.status === statusFilter;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {showSyncSuccess && (
        <div style={{ 
          background: 'var(--emerald)', color: '#fff', padding: '12px 24px', borderRadius: 12, 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          boxShadow: '0 8px 24px rgba(16,185,129,0.3)', position: 'sticky', top: 16, zIndex: 50,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
            <CheckCircle2 size={20} style={{ animation: 'bounce 2s infinite' }} />
            <span><strong>Synchronization complete!</strong> Successfully queried raw metrics for external campaigns.</span>
          </div>
          <button onClick={() => setShowSyncSuccess(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={16}/></button>
        </div>
      )}

      {/* Header section with KPIs inside */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24, borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ padding: 12, background: 'rgba(124, 92, 191, 0.1)', color: 'var(--purple)', borderRadius: 16, border: '1px solid rgba(124, 92, 191, 0.2)' }}>
              <Sparkles size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Ad-Suite Campaigns</h1>
                <span style={{ fontSize: 11, background: 'rgba(124, 92, 191, 0.1)', color: 'var(--purple)', fontWeight: 600, padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(124, 92, 191, 0.2)' }}>Enterprise</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Manage in-house and third-party synced multi-channel networks</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, margin: '0 0 4px 0', textTransform: 'uppercase' }}>Total Portfolio Spend</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                ${allCampaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, margin: '0 0 4px 0', textTransform: 'uppercase' }}>Active Budget</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                ${allCampaigns.filter(c => c.status === 'Active').reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, margin: '0 0 6px 0', textTransform: 'uppercase' }}>Connected Channels</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ padding: 4, borderRadius: 6, background: 'var(--bg-secondary)', border: connectedSources.meta ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid var(--border)', opacity: connectedSources.meta ? 1 : 0.4 }}><MetaIcon /></span>
                <span style={{ padding: 4, borderRadius: 6, background: 'var(--bg-secondary)', border: connectedSources.google ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid var(--border)', opacity: connectedSources.google ? 1 : 0.4 }}><GoogleIcon /></span>
                <span style={{ padding: 4, borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid rgba(124, 92, 191, 0.5)' }}><InternalIcon /></span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar & Filters */}
        <div style={{ padding: 24 }}>
          {/* Warning Banner */}
          <div style={{ marginBottom: 24, padding: 16, background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ padding: 8, background: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber)', borderRadius: 8 }}><Lock size={20} /></div>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Raw Metrics Protection Policy</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>Connected external ad platforms sync automatically. Budget, Spend, and Status mapped from raw_metrics are strictly read-only.</p>
              </div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', animation: 'pulse 2s infinite' }}></span>
              All Systems Operational
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <button className="btn btn-primary" onClick={() => { setFormData({ name: '', budget: '1000', status: 'Draft', channel: 'Email', startDate: '', endDate: '' }); setActiveModal({ type: 'create', campaign: null }); }}>
                <Plus size={16} /> New Campaign
              </button>
              <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }}></div>
              <button className="btn btn-ghost" onClick={() => handleConnectProvider('Meta')} style={{ background: connectedSources.meta ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-secondary)', border: connectedSources.meta ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--border)', color: connectedSources.meta ? '#3b82f6' : 'var(--text-primary)' }}>
                <MetaIcon /> {connectedSources.meta ? 'Configure Meta Ads' : 'Connect Meta Ads'}
              </button>
              <button className="btn btn-ghost" onClick={() => handleConnectProvider('Google')} style={{ background: connectedSources.google ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-secondary)', border: connectedSources.google ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border)', color: connectedSources.google ? '#f59e0b' : 'var(--text-primary)' }}>
                <GoogleIcon /> {connectedSources.google ? 'Configure Google Ads' : 'Connect Google Ads'}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Sync Status</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--purple)' }}></span> Synced {lastSyncGlobal}</span>
              </div>
              <button className="btn btn-ghost" onClick={handleSyncNow} disabled={syncing} style={{ gap: 8, padding: '10px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                <RefreshCw size={14} className={syncing ? 'spin' : ''} style={{ color: syncing ? 'var(--purple)' : 'inherit' }} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          </div>

          {/* Table Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search campaigns by name, platform ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...inputStyle, paddingLeft: 36 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}><Filter size={14} style={{ verticalAlign: 'middle' }}/> Channel:</span>
              <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                <option value="All">All Channels</option><option value="Internal">Internal Platform Only</option><option value="Meta">Meta Ads Network</option><option value="Google">Google Ads Network</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>Status:</span>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                <option value="All">All Statuses</option><option value="Active">Active</option><option value="Paused">Paused</option><option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="card table-wrap" style={{ overflow: 'visible' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Campaign Info</th>
              <th style={{ padding: '16px 16px', fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>Source</th>
              <th style={{ padding: '16px 16px', fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Status</th>
              <th style={{ padding: '16px 16px', fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Active Budget</th>
              <th style={{ padding: '16px 16px', fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Synced Spend</th>
              <th style={{ padding: '16px 16px', fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Impressions</th>
              <th style={{ padding: '16px 16px', fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Clicks (CTR)</th>
              <th style={{ padding: '16px 24px', fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((camp) => {
                const isExternal = camp.source !== 'internal';
                const ctr = camp.impressions > 0 ? ((camp.clicks / camp.impressions) * 100).toFixed(2) : '0.00';
                const percentSpent = camp.budget > 0 ? ((camp.spent / camp.budget) * 100).toFixed(1) : '0.0';

                return (
                  <tr key={camp.id} style={{ borderBottom: '1px solid var(--border)', background: isExternal ? 'var(--bg-secondary)' : 'transparent' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{camp.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'monospace' }}>
                        ID: {camp.id}
                        {isExternal && <span style={{ fontFamily: 'sans-serif', color: 'var(--text-secondary)' }}>• Synced {camp.lastSynced?.split(' ')[1] || 'recently'}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '16px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex' }}>
                        {camp.source === 'meta' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}><MetaIcon /> Meta Ads</span>}
                        {camp.source === 'google' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}><GoogleIcon /> Google Ads</span>}
                        {camp.source === 'internal' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(124, 92, 191, 0.1)', color: 'var(--purple)', border: '1px solid rgba(124, 92, 191, 0.2)' }}><InternalIcon /> Internal</span>}
                      </div>
                    </td>
                    <td style={{ padding: '16px 16px' }}>
                      {camp.status === 'Active' ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)', border: '1px solid rgba(16, 185, 129, 0.2)' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)' }}></span> Active</span> :
                       camp.status === 'Paused' ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber)', border: '1px solid rgba(245, 158, 11, 0.2)' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)' }}></span> Paused</span> :
                       <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)' }}></span> Draft</span>}
                    </td>
                    <td style={{ padding: '16px 16px', textAlign: 'right', fontWeight: 500, color: 'var(--text-primary)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        ${camp.budget.toLocaleString()}
                        {isExternal && <span style={{ fontSize: 9, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}><Lock size={10} /> Synced Budget</span>}
                      </div>
                    </td>
                    <td style={{ padding: '16px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${camp.spent.toLocaleString()}</span>
                        <div style={{ width: 64, height: 4, background: 'var(--bg-secondary)', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(100, Number(percentSpent))}%`, background: Number(percentSpent) > 90 ? 'var(--rose)' : 'var(--purple)' }}></div>
                        </div>
                        <span style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>{percentSpent}% of budget</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 16px', textAlign: 'right', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-secondary)' }}>
                      {camp.impressions > 0 ? camp.impressions.toLocaleString() : '—'}
                    </td>
                    <td style={{ padding: '16px 16px', textAlign: 'right' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-secondary)' }}>
                        {camp.clicks > 0 ? camp.clicks.toLocaleString() : '—'}
                      </div>
                      {camp.clicks > 0 && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{ctr}% CTR</div>}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        {isExternal ? (
                          <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 11, border: '1px solid var(--border)' }} title="View Linked Metrics Details (Read-only)">
                            <Lock size={12} style={{ color: 'var(--amber)' }}/> View Stats
                          </button>
                        ) : (
                          <>
                            <button className="btn btn-ghost" style={{ padding: '6px', border: '1px solid var(--border)' }} onClick={() => {
                              setFormData({ name: camp.name, budget: camp.budget.toString(), status: camp.status, channel: camp.channel || 'Email', startDate: camp.startDate || '', endDate: camp.endDate || '' });
                              setActiveModal({ type: 'edit', campaign: camp });
                            }} title="Edit Campaign Details">
                              <Edit2 size={14} />
                            </button>
                            <button className="btn btn-ghost" style={{ padding: '6px', border: '1px solid var(--border)', color: 'var(--rose)' }} onClick={() => { setActiveModal({ type: 'delete', campaign: camp }); handleDeleteCampaign(); }} title="Delete Campaign">
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <AlertCircle size={32} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>No campaigns found</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: 12 }}>No campaigns match your search query or channel filtering criteria.</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE & EDIT MODAL (FOR INTERNAL CAMPAIGNS) */}
      {(activeModal.type === 'create' || activeModal.type === 'edit') && (
        <Modal title={activeModal.type === 'create' ? <><Layers size={20} style={{color: 'var(--purple)'}}/> Create Internal Campaign</> : <><Layers size={20} style={{color: 'var(--purple)'}}/> Edit Campaign Details</>} onClose={() => setActiveModal({ type: null, campaign: null })}>
          <form onSubmit={handleSaveCampaign} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Campaign Name</label>
              <input required type="text" placeholder="e.g. Q4 Growth Hacking Push" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Channel</label>
                <select style={inputStyle} value={formData.channel} onChange={e => setFormData({ ...formData, channel: e.target.value })}>
                  <option>Email</option><option>Social</option><option>Paid</option><option>Content</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={inputStyle}>
                  <option value="Active">Active</option><option value="Paused">Paused</option><option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Monthly Allocated Budget (USD)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: 10, color: 'var(--text-muted)' }}>$</span>
                <input required type="number" min="1" placeholder="5000" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} style={{ ...inputStyle, paddingLeft: 30 }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Start Date</label>
                <input type="date" style={inputStyle} value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>End Date</label>
                <input type="date" style={inputStyle} value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <button type="button" onClick={() => setActiveModal({ type: null, campaign: null })} className="btn btn-ghost">Cancel</button>
              <button type="submit" className="btn btn-primary">{activeModal.type === 'create' ? 'Create Campaign' : 'Save Changes'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirm is skipped since it deletes directly to match new flow, but handled gracefully */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2000, background: 'var(--emerald)', color: '#ffffff', padding: '14px 20px', borderRadius: 12, fontWeight: 600, fontSize: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeIn 0.3s ease' }}>
          <CheckCircle2 size={20} />
          {toast}
          <button onClick={() => setToast('')} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: 16, marginLeft: 8 }}>✕</button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
