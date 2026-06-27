'use client';
import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Campaign = {
  name: string; channel: string; budget: string; spent: string;
  dates: string; status: string; badgeChannel: string; badgeStatus: string;
};

// ─── Modal Component ──────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
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
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Toast Component ──────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 2000,
      background: 'var(--emerald)', color: '#ffffff',
      padding: '14px 20px', borderRadius: 12, fontWeight: 600, fontSize: 14,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeIn 0.3s ease'
    }}>
      <i className="ti ti-check-circle" style={{ fontSize: 20 }}></i>
      {message}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: 16, marginLeft: 8 }}>✕</button>
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

// ─── Page Component ───────────────────────────────────────────────────────────
export default function CampaignsPage() {
  const kpis = [
    { label: 'Active campaigns', value: '6', delta: '+2 this month', trend: 'up', color: 'purple' },
    { label: 'Total reach', value: '48K', delta: 'Across all channels', trend: 'up', color: 'blue' },
    { label: 'Avg. open rate', value: '28.4%', delta: '+3.1% vs last mo.', trend: 'up', color: 'emerald' },
    { label: 'Conversions', value: '312', delta: '+22% this month', trend: 'up', color: 'amber' },
  ];

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { name: 'Q3 product launch', channel: 'Email', budget: '₹80K', spent: '₹52K', dates: 'Jun 1 – Jul 15', status: 'Active', badgeChannel: 'purple', badgeStatus: 'emerald' },
    { name: 'Referral drive — June', channel: 'Social', budget: '₹30K', spent: '₹12K', dates: 'Jun 10 – Jun 30', status: 'Active', badgeChannel: 'blue', badgeStatus: 'emerald' },
    { name: 'Re-engagement blast', channel: 'Email', budget: '₹15K', spent: '—', dates: 'Jul 1 – Jul 10', status: 'Draft', badgeChannel: 'purple', badgeStatus: 'amber' },
    { name: 'Google Ads — brand', channel: 'Paid', budget: '₹1.2L', spent: '₹1.2L', dates: 'May 1 – May 31', status: 'Done', badgeChannel: 'rose', badgeStatus: 'rose' },
    { name: 'Webinar promo', channel: 'Social', budget: '₹20K', spent: '₹8K', dates: 'Jun 20 – Jul 5', status: 'Paused', badgeChannel: 'blue', badgeStatus: 'amber' },
  ]);

  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [channelFilter, setChannelFilter] = useState('All channels');

  const [form, setForm] = useState({ name: '', channel: 'Email', budget: '', startDate: '', endDate: '', status: 'Draft' });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleCreate = () => {
    if (!form.name.trim() || !form.budget.trim()) return;
    const channelBadge: Record<string, string> = { Email: 'purple', Social: 'blue', Paid: 'rose', Content: 'emerald' };
    const statusBadge: Record<string, string> = { Draft: 'amber', Active: 'emerald', Paused: 'amber', Done: 'rose' };
    setCampaigns(prev => [...prev, {
      name: form.name, channel: form.channel, budget: form.budget, spent: '—',
      dates: form.startDate && form.endDate ? `${form.startDate} – ${form.endDate}` : 'TBD',
      status: form.status, badgeChannel: channelBadge[form.channel] || 'blue',
      badgeStatus: statusBadge[form.status] || 'amber',
    }]);
    setForm({ name: '', channel: 'Email', budget: '', startDate: '', endDate: '', status: 'Draft' });
    setShowNewModal(false);
    showToast('Campaign created successfully!');
  };

  const handleEdit = (i: number) => {
    const c = campaigns[i];
    const [start, end] = c.dates.includes('–') ? c.dates.split('–').map(s => s.trim()) : ['', ''];
    setForm({ name: c.name, channel: c.channel, budget: c.budget, startDate: start, endDate: end, status: c.status });
    setEditingIdx(i);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingIdx === null) return;
    const channelBadge: Record<string, string> = { Email: 'purple', Social: 'blue', Paid: 'rose', Content: 'emerald' };
    const statusBadge: Record<string, string> = { Draft: 'amber', Active: 'emerald', Paused: 'amber', Done: 'rose' };
    setCampaigns(prev => prev.map((c, i) => i === editingIdx ? {
      ...c, name: form.name, channel: form.channel, budget: form.budget,
      dates: form.startDate && form.endDate ? `${form.startDate} – ${form.endDate}` : c.dates,
      status: form.status, badgeChannel: channelBadge[form.channel] || 'blue',
      badgeStatus: statusBadge[form.status] || 'amber',
    } : c));
    setShowEditModal(false); setEditingIdx(null);
    showToast('Campaign updated!');
  };

  const handleDelete = (i: number) => {
    setCampaigns(prev => prev.filter((_, idx) => idx !== i));
    showToast('Campaign deleted.');
  };

  const filtered = campaigns.filter(c => {
    const matchName = c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All statuses' || c.status === statusFilter;
    const matchChannel = channelFilter === 'All channels' || c.channel === channelFilter;
    return matchName && matchStatus && matchChannel;
  });

  const statsCampaign = editingIdx !== null ? campaigns[editingIdx] : null;

  const CampaignForm = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={labelStyle}>Campaign Name</label>
        <input style={inputStyle} placeholder="e.g. Summer Sale 2025" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Channel</label>
          <select style={inputStyle} value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}>
            <option>Email</option><option>Social</option><option>Paid</option><option>Content</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option>Draft</option><option>Active</option><option>Paused</option><option>Done</option>
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Budget</label>
        <input style={inputStyle} placeholder="e.g. ₹50K" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Start Date</label>
          <input type="date" style={inputStyle} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle}>End Date</label>
          <input type="date" style={inputStyle} value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 20 }}>Campaigns</div>
          <div className="section-sub" style={{ fontSize: 13 }}>Plan, run, and track marketing campaigns</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm({ name: '', channel: 'Email', budget: '', startDate: '', endDate: '', status: 'Draft' }); setShowNewModal(true); }}>
          <i className="ti ti-plus"></i> New campaign
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {kpis.map((k) => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-header"><span className="kpi-label">{k.label}</span></div>
            <div className="kpi-value">{k.value}</div>
            <div className={`kpi-delta ${k.trend}`}>{k.trend === 'up' ? '↑' : '↓'} {k.delta}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input type="text" placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
          <option>All statuses</option><option>Active</option><option>Draft</option><option>Done</option><option>Paused</option>
        </select>
        <select value={channelFilter} onChange={e => setChannelFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
          <option>All channels</option><option>Email</option><option>Social</option><option>Paid</option>
        </select>
      </div>

      {/* Table */}
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: '28%' }}>Campaign</th>
              <th style={{ width: '12%' }}>Channel</th>
              <th style={{ width: '10%' }}>Budget</th>
              <th style={{ width: '10%' }}>Spent</th>
              <th style={{ width: '14%' }}>Dates</th>
              <th style={{ width: '12%' }}>Status</th>
              <th style={{ width: '14%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No campaigns found.</td></tr>
            ) : filtered.map((c, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</td>
                <td><span className={`badge ${c.badgeChannel}`}>{c.channel}</span></td>
                <td style={{ fontWeight: 600 }}>{c.budget}</td>
                <td>{c.spent}</td>
                <td>{c.dates}</td>
                <td><span className={`badge ${c.badgeStatus}`}>{c.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => { setEditingIdx(campaigns.indexOf(c)); setShowStatsModal(true); }}>
                      <i className="ti ti-chart-bar"></i> Stats
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => handleEdit(campaigns.indexOf(c))}>
                      <i className="ti ti-edit"></i> Edit
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12, color: 'var(--rose)' }} onClick={() => handleDelete(campaigns.indexOf(c))}>
                      <i className="ti ti-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Campaign Modal */}
      {showNewModal && (
        <Modal title="Create New Campaign" onClose={() => setShowNewModal(false)}>
          <CampaignForm />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={() => setShowNewModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Create Campaign</button>
          </div>
        </Modal>
      )}

      {/* Edit Campaign Modal */}
      {showEditModal && (
        <Modal title="Edit Campaign" onClose={() => setShowEditModal(false)}>
          <CampaignForm />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveEdit}>Save Changes</button>
          </div>
        </Modal>
      )}

      {/* Stats Modal */}
      {showStatsModal && editingIdx !== null && (
        <Modal title={`Campaign Stats — ${campaigns[editingIdx]?.name}`} onClose={() => setShowStatsModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Impressions', value: '24,810', color: 'var(--blue)' },
              { label: 'Clicks', value: '3,420', color: 'var(--purple)' },
              { label: 'Conversions', value: '312', color: 'var(--emerald)' },
              { label: 'CTR', value: '13.8%', color: 'var(--amber)' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={() => setShowStatsModal(false)}>Close</button>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }` }} />
    </div>
  );
}
