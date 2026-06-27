'use client';
import { useState } from 'react';

const initialPipeline = [
  {
    id: 'new', label: 'New Enquiry', color: 'new', headerColor: 'var(--blue)',
    deals: [
      { id: 1, name: 'Riya Sharma', company: 'BloomAds', value: 45000, owner: 'JS', days: 0, source: 'Meta Ads' },
      { id: 2, name: 'Karthik R.', company: 'TechVibe', value: 80000, owner: 'AM', days: 1, source: 'Form' },
      { id: 3, name: 'Meera N.', company: 'FreshBrand', value: 30000, owner: 'JS', days: 0, source: 'Referral' },
    ],
  },
  {
    id: 'engaged', label: 'Engaged', color: 'engaged', headerColor: 'var(--purple)',
    deals: [
      { id: 4, name: 'Arjun Mehta', company: 'GrowthLab', value: 120000, owner: 'SA', days: 3, source: 'Form' },
      { id: 5, name: 'Priya K.', company: 'NexaDigital', value: 60000, owner: 'JS', days: 2, source: 'Referral' },
    ],
  },
  {
    id: 'qualified', label: 'Qualified', color: 'qualified', headerColor: 'var(--amber)',
    deals: [
      { id: 6, name: 'Sameer P.', company: 'MediaCo', value: 95000, owner: 'AM', days: 5, source: 'LinkedIn' },
      { id: 7, name: 'Divya T.', company: 'BrandNest', value: 210000, owner: 'SA', days: 4, source: 'Meta Ads' },
    ],
  },
  {
    id: 'proposal', label: 'Proposal Sent', color: 'proposal', headerColor: 'var(--purple)',
    deals: [
      { id: 8, name: 'Raj Verma', company: 'ScaleUp', value: 180000, owner: 'JS', days: 7, source: 'LinkedIn' },
    ],
  },
  {
    id: 'negotiation', label: 'Negotiation', color: 'negotiation', headerColor: 'var(--amber)',
    deals: [
      { id: 9, name: 'Ananya S.', company: 'ClickFarm', value: 350000, owner: 'AM', days: 12, source: 'Cold Email' },
      { id: 10, name: 'Vikram L.', company: 'AdSphere', value: 280000, owner: 'JS', days: 10, source: 'Referral' },
    ],
  },
  {
    id: 'won', label: 'Closed Win', color: 'won', headerColor: 'var(--emerald)',
    deals: [
      { id: 11, name: 'Nisha D.', company: 'BoldMark', value: 420000, owner: 'SA', days: 18, source: 'Meta Ads' },
    ],
  },
  {
    id: 'lost', label: 'Closed Lose', color: 'lost', headerColor: 'var(--rose)',
    deals: [
      { id: 12, name: 'Mohit B.', company: 'SprintCo', value: 70000, owner: 'AM', days: 21, source: 'Cold Email' },
    ],
  },
];

function fmtVal(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  return `₹${(v / 1000).toFixed(0)}K`;
}

export default function PipelinePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pipelineState, setPipelineState] = useState(initialPipeline);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  // Fields for new / edit deal
  const [newDealName, setNewDealName] = useState('');
  const [newDealCompany, setNewDealCompany] = useState('');
  const [newDealValue, setNewDealValue] = useState('');
  const [newDealStage, setNewDealStage] = useState('new');
  // Editing context
  const [editingDealId, setEditingDealId] = useState<number | null>(null);
  const [editingColId, setEditingColId] = useState<string | null>(null);

  const openModalForNew = (stageId: string) => {
    setNewDealName('');
    setNewDealCompany('');
    setNewDealValue('');
    setNewDealStage(stageId);
    setEditingDealId(null);
    setEditingColId(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (colId: string, deal: any) => {
    setNewDealName(deal.name);
    setNewDealCompany(deal.company);
    setNewDealValue(String(deal.value));
    setNewDealStage(colId);
    setEditingDealId(deal.id);
    setEditingColId(colId);
    setIsModalOpen(true);
  };

  // Add delete handler
  const handleDeleteDeal = (colId: string, dealId: number) => {
    // Remove the deal from the specific column
    const updated = pipelineState.map(col =>
      col.id === colId ? { ...col, deals: col.deals.filter(d => d.id !== dealId) } : col
    );
    setPipelineState(updated);
  };

  const handleSaveDeal = () => {
    if (!newDealName.trim()) return;
    const deal = {
      id: editingDealId ?? Math.random(),
      name: newDealName,
      company: newDealCompany || 'Unknown',
      value: Number(newDealValue) || 0,
      owner: 'JL',
      days: 0,
      source: 'Manual Entry',
    };
    // Remove existing deal (if editing) from all columns
    const cleaned = pipelineState.map(col => ({
      ...col,
      deals: col.deals.filter(d => d.id !== deal.id),
    }));
    // Add deal to selected stage
    const updated = cleaned.map(col =>
      col.id === newDealStage ? { ...col, deals: [...col.deals, deal] } : col
    );
    setPipelineState(updated);
    setIsModalOpen(false);
    setNewDealName('');
    setNewDealCompany('');
    setNewDealValue('');
    setNewDealStage('new');
    setEditingDealId(null);
    setEditingColId(null);
  };

  const totalValue = pipelineState.flatMap(s => s.deals).reduce((a, d) => a + d.value, 0);
  const wonValue = (pipelineState.find(s => s.id === 'won')?.deals || []).reduce((a, d) => a + d.value, 0);
  const totalDeals = pipelineState.flatMap(s => s.deals).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Pipeline Value', value: fmtVal(totalValue), color: 'purple' },
          { label: 'Closed Won (Month)', value: fmtVal(wonValue), color: 'emerald' },
          { label: 'Active Deals', value: String(totalDeals - 2), color: 'blue' },
          { label: 'Avg. Deal Size', value: fmtVal(Math.round(totalValue / totalDeals)), color: 'amber' },
        ].map(k => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-label" style={{ marginBottom: 8 }}>{k.label}</div>
            <div className="kpi-value">{k.value}</div>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {(['kanban', 'list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '7px 16px', fontSize: 12, fontWeight: 600, background: view === v ? 'var(--purple-dim)' : 'transparent', color: view === v ? 'var(--purple-light)' : 'var(--text-muted)', border: 'none', cursor: 'pointer', borderRight: '1px solid var(--border)', fontFamily: 'Inter, sans-serif', textTransform: 'capitalize' }}>
              {v === 'kanban' ? '⬡ Kanban' : '≡ List'}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => openModalForNew('new')}>+ New Deal</button>
      </div>

      {/* Kanban Board */}
      {view === 'kanban' && (
        <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <div style={{ display: 'flex', gap: 16, minWidth: 'max-content' }}>
            {pipelineState.map(col => (
              <div key={col.id} style={{ width: 300, flexShrink: 0 }}>
                {/* Column Header */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: `3px solid ${col.headerColor}`, borderRadius: '10px 10px 0 0', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{col.label}</span>
                  <span className={`pipeline-col-count ${col.color}`} style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 8 }}>{col.deals.length}</span>
                </div>
                {/* Deals */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 120 }}>
                  {col.deals.map(deal => (
                    <div key={deal.id} className="deal-card" style={{ position: 'relative', padding: '14px' }} onClick={() => openModalForEdit(col.id, deal)}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{deal.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{deal.company}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--emerald-light)' }}>{fmtVal(deal.value)}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, color: deal.days > 10 ? 'var(--rose-light)' : 'var(--text-muted)' }}>{deal.days}d</span>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white' }}>{deal.owner}</div>
                        </div>
                      </div>
                      {/* Delete button */}
                      <button
                        onClick={e => { e.stopPropagation(); handleDeleteDeal(col.id, deal.id); }}
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--rose-light)',
                          cursor: 'pointer',
                          fontSize: 12,
                        }}
                      >✕</button>
                    </div>
                  ))}
                  <button style={{ border: '1px dashed var(--border)', borderRadius: 8, padding: '8px', fontSize: 11, color: 'var(--text-muted)', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => openModalForNew(col.id)}>+ Add Deal</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Deal</th>
                <th>Company</th>
                <th>Value</th>
                <th>Stage</th>
                <th>Source</th>
                <th>Age</th>
                <th>Owner</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pipelineState.flatMap(col => col.deals.map(deal => (
                <tr key={deal.id} style={{ cursor: 'pointer', position: 'relative' }} onClick={() => openModalForEdit(col.id, deal)}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{deal.name}</td>
                  <td>{deal.company}</td>
                  <td style={{ fontWeight: 700, color: 'var(--emerald-light)' }}>{fmtVal(deal.value)}</td>
                  <td><span className={`badge ${col.color}`}>{col.label}</span></td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{deal.source}</td>
                  <td style={{ color: deal.days > 10 ? 'var(--rose-light)' : 'var(--text-muted)', fontSize: 12 }}>{deal.days}d</td>
                  <td><div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white' }}>{deal.owner}</div></td>
                  <td>
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={e => { e.stopPropagation(); handleDeleteDeal(col.id, deal.id); }}>Delete</button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Deal Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 420, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)', boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{editingDealId ? 'Edit Deal' : 'Create New Deal'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Deal Name</label>
                <input type="text" value={newDealName} onChange={e => setNewDealName(e.target.value)} placeholder="e.g. Website Redesign" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Company / Client</label>
                <input type="text" value={newDealCompany} onChange={e => setNewDealCompany(e.target.value)} placeholder="Search companies..." style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Value (₹)</label>
                  <input type="number" value={newDealValue} onChange={e => setNewDealValue(e.target.value)} placeholder="0" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Pipeline Stage</label>
                  <select value={newDealStage} onChange={e => setNewDealStage(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                    <option value="new">New Enquiry</option>
                    <option value="engaged">Engaged</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal Sent</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Closed Win</option>
                    <option value="lost">Closed Lose</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveDeal}>{editingDealId ? 'Update Deal' : 'Create Deal'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
