'use client';
import { useState } from 'react';
import { MessageSquare, CheckCircle, Package, AlertTriangle, Send } from 'lucide-react';

import { pipelineInitial, pipelineWhatsAppActivity } from '@/lib/mockData';
function fmtVal(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  return `₹${(v / 1000).toFixed(0)}K`;
}

export default function PipelinePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pipelineState, setPipelineState] = useState(pipelineInitial);
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
  const wonValue = (pipelineState.find(s => s.id === 'confirmed')?.deals || []).reduce((a, d) => a + d.value, 0);
  const totalDeals = pipelineState.flatMap(s => s.deals).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Pipeline Value', value: fmtVal(totalValue), color: 'purple' },
          { label: 'Confirmed Orders', value: fmtVal(wonValue), color: 'emerald' },
          { label: 'Active Deals', value: String(totalDeals), color: 'blue' },
          { label: 'Avg. Deal Size', value: fmtVal(Math.round(totalValue / totalDeals || 0)), color: 'amber' },
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

      {/* New/Edit Deal Modal with WhatsApp Integration */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: 850, padding: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)', boxShadow: '0 12px 40px rgba(0,0,0,0.2)', height: '80vh', overflow: 'hidden' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{editingDealId ? `Deal: ${newDealCompany}` : 'Create New Deal'}</h3>
                {editingDealId && <span style={{ fontSize: 11, background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 4 }}><MessageSquare size={12}/> WhatsApp Linked</span>}
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Left Side: Deal Details */}
              <div style={{ flex: 1, padding: 24, overflowY: 'auto', borderRight: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Deal Information</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Deal Name</label>
                    <input type="text" value={newDealName} onChange={e => setNewDealName(e.target.value)} placeholder="e.g. 10x 5L Floor Cleaner" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Company / Client</label>
                    <input type="text" value={newDealCompany} onChange={e => setNewDealCompany(e.target.value)} placeholder="Search companies..." style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Value (₹)</label>
                      <input type="number" value={newDealValue} onChange={e => setNewDealValue(e.target.value)} placeholder="0" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Pipeline Stage</label>
                      <select value={newDealStage} onChange={e => setNewDealStage(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                        <option value="new">New Enquiry</option>
                        <option value="sample">Sample Delivered</option>
                        <option value="quote">Quote Sent</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="confirmed">Order Confirmed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 10, marginTop: 24 }}>
                  <button className="btn btn-primary" onClick={handleSaveDeal}>{editingDealId ? 'Update Deal' : 'Create Deal'}</button>
                  <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </div>

              {/* Right Side: WhatsApp Activity Feed (Only show when editing) */}
              {editingDealId ? (
                <div style={{ width: 350, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MessageSquare size={14} /> WhatsApp Activity Feed
                    </h4>
                  </div>
                  
                  {/* Messages Feed */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {pipelineWhatsAppActivity.map(msg => (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.internal ? 'flex-end' : 'flex-start' }}>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{msg.sender} • {msg.date} {msg.time}</span>
                        <div style={{ 
                          background: msg.internal ? 'var(--blue-dim)' : 'var(--bg-secondary)', 
                          color: msg.internal ? 'var(--blue-light)' : 'var(--text-primary)',
                          padding: '8px 12px', 
                          borderRadius: '8px', 
                          borderBottomLeftRadius: msg.internal ? '8px' : '0px',
                          borderBottomRightRadius: msg.internal ? '0px' : '8px',
                          fontSize: 13,
                          maxWidth: '85%',
                          border: msg.internal ? 'none' : '1px solid var(--border)'
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input Simulator */}
                  <div style={{ padding: 16, borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input type="text" placeholder="Reply via WhatsApp..." style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                      <button className="btn btn-primary" style={{ padding: '8px', borderRadius: '50%' }}>
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ width: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: 'var(--bg-card)', padding: 24, textAlign: 'center', borderLeft: '1px solid var(--border)' }}>
                  <MessageSquare size={32} color="var(--text-muted)" style={{ marginBottom: 16 }} />
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>WhatsApp Integration</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Save this deal to start tracking WhatsApp conversations with the client automatically.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
