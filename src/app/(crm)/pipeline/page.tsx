'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { MessageSquare, Send } from 'lucide-react';

import { pipelineWhatsAppActivity } from '@/lib/mockData';

function fmtVal(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  return `₹${(v / 1000).toFixed(0)}K`;
}

const STAGE_COLOR_PALETTE = [
  { color: 'new', headerColor: '#3b82f6' },
  { color: 'engaged', headerColor: '#7c5cbf' },
  { color: 'qualified', headerColor: '#f59e0b' },
  { color: 'proposal', headerColor: '#6366f1' },
  { color: 'negotiation', headerColor: '#f97316' },
  { color: 'won', headerColor: '#10b981' },
  { color: 'lost', headerColor: '#f43f5e' },
];

function slugify(label: string) {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'stage';
}

type StageInfo = { id: string; key: string; label: string; color: string; headerColor: string; order: number };
type PipelineOption = { id: string; name: string; icon: string | null };
type PipelineDeal = {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: string;
  owner: string;
  days: number;
  source: string;
};

function mapApiDeal(d: Record<string, unknown>): PipelineDeal {
  const assignedTo = d.assignedTo as { name?: string } | null;
  const initials = assignedTo?.name
    ? assignedTo.name.split(' ').map((p: string) => p[0]).join('').toUpperCase().slice(0, 2)
    : '—';
  const updatedAt = d.updatedAt as string | undefined;
  const days = updatedAt ? Math.floor((Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const contact = d.contact as { name?: string } | null;
  return {
    id: d.id as string,
    name: (d.title as string) || '',
    company: (d.client as string) || contact?.name || 'Unknown',
    value: (d.value as number) ?? 0,
    stage: (d.pipelineStageKey as string) || '',
    owner: initials,
    days,
    source: (d.source as string) || 'Manual Entry',
  };
}

export default function PipelinePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pipelines, setPipelines] = useState<PipelineOption[]>([]);
  const [pipelineId, setPipelineId] = useState('');
  const [stages, setStages] = useState<StageInfo[]>([]);
  const [deals, setDeals] = useState<PipelineDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [boardMenuOpen, setBoardMenuOpen] = useState(false);
  const boardMenuRef = useRef<HTMLDivElement>(null);

  // Drag state
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [draggedStageId, setDraggedStageId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

  // Fields for new / edit deal
  const [newDealName, setNewDealName] = useState('');
  const [newDealCompany, setNewDealCompany] = useState('');
  const [newDealValue, setNewDealValue] = useState('');
  const [newDealStage, setNewDealStage] = useState('new');
  // Editing context
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boardMenuRef.current && !boardMenuRef.current.contains(e.target as Node)) setBoardMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchPipelineList = useCallback(async (preferId?: string) => {
    try {
      const res = await fetch('/api/pipelines');
      const json = await res.json();
      if (!res.ok || !Array.isArray(json.data)) { setLoading(false); return; }
      const raw: Record<string, unknown>[] = json.data;
      setPipelines(raw.map(p => ({ id: p.id as string, name: p.name as string, icon: (p.icon as string) ?? null })));
      const preferred = preferId ? raw.find(p => p.id === preferId) : null;
      const def = preferred || raw.find(p => p.isDefault) || raw[0];
      if (!def) { setLoading(false); return; }
      setPipelineId(def.id as string);
      const rawStages = (def.stages as Record<string, unknown>[]) || [];
      setStages(
        rawStages
          .sort((a, b) => (a.order as number) - (b.order as number))
          .map(s => ({
            id: s.id as string,
            key: s.key as string,
            label: s.label as string,
            color: (s.color as string) || 'new',
            headerColor: (s.headerColor as string) || '#3b82f6',
            order: (s.order as number) ?? 0,
          }))
      );
    } catch {
      setLoading(false);
    }
  }, []);

  const fetchDeals = useCallback(async (pid: string) => {
    if (!pid) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/deals?pipelineId=${pid}&limit=200`);
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) setDeals((json.data as Record<string, unknown>[]).map(mapApiDeal));
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPipelineList(); }, [fetchPipelineList]);
  useEffect(() => { if (pipelineId) fetchDeals(pipelineId); }, [pipelineId, fetchDeals]);

  const switchPipeline = (id: string) => {
    setPipelineId(id);
    fetchPipelineList(id);
  };

  // ─── Board (Pipeline) management ───
  const handleAddBoard = async () => {
    const name = window.prompt('New board name:');
    if (!name || !name.trim()) return;
    const res = await fetch('/api/pipelines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), stages: [{ key: 'new', label: 'New', color: 'new', headerColor: '#3b82f6', order: 0 }] }),
    });
    if (res.ok) {
      const json = await res.json();
      fetchPipelineList(json.data.id);
    }
    setBoardMenuOpen(false);
  };

  const handleRenameBoard = async () => {
    const current = pipelines.find(p => p.id === pipelineId);
    const name = window.prompt('Rename board:', current?.name ?? '');
    if (!name || !name.trim()) return;
    await fetch(`/api/pipelines/${pipelineId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    });
    fetchPipelineList(pipelineId);
    setBoardMenuOpen(false);
  };

  const handleDeleteBoard = async () => {
    if (pipelines.length <= 1) { window.alert('You need at least one board.'); return; }
    const current = pipelines.find(p => p.id === pipelineId);
    if (!window.confirm(`Delete board "${current?.name}"? Deals in it will be unassigned from this pipeline.`)) return;
    await fetch(`/api/pipelines/${pipelineId}`, { method: 'DELETE' });
    setBoardMenuOpen(false);
    fetchPipelineList();
  };

  // ─── Stage (column) management ───
  const handleAddStage = async () => {
    const label = window.prompt('New column name:');
    if (!label || !label.trim()) return;
    const palette = STAGE_COLOR_PALETTE[stages.length % STAGE_COLOR_PALETTE.length];
    const res = await fetch(`/api/pipelines/${pipelineId}/stages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: `${slugify(label)}_${Date.now().toString(36)}`, label: label.trim(), ...palette }),
    });
    if (res.ok) fetchPipelineList(pipelineId);
  };

  const handleRenameStage = async (stage: StageInfo) => {
    const label = window.prompt('Rename column:', stage.label);
    if (!label || !label.trim() || label.trim() === stage.label) return;
    await fetch(`/api/pipelines/stages/${stage.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: label.trim() }),
    });
    fetchPipelineList(pipelineId);
  };

  const handleDeleteStage = async (stage: StageInfo) => {
    const dealsInStage = deals.filter(d => d.stage === stage.key).length;
    const msg = dealsInStage > 0
      ? `Delete column "${stage.label}"? ${dealsInStage} deal(s) in it will become unassigned.`
      : `Delete column "${stage.label}"?`;
    if (!window.confirm(msg)) return;
    await fetch(`/api/pipelines/stages/${stage.id}`, { method: 'DELETE' });
    fetchPipelineList(pipelineId);
    fetchDeals(pipelineId);
  };

  // ─── Column drag-to-reorder ───
  const handleStageDrop = async (targetStage: StageInfo) => {
    if (!draggedStageId || draggedStageId === targetStage.id) { setDraggedStageId(null); return; }
    const fromIdx = stages.findIndex(s => s.id === draggedStageId);
    const toIdx = stages.findIndex(s => s.id === targetStage.id);
    if (fromIdx === -1 || toIdx === -1) { setDraggedStageId(null); return; }
    const reordered = [...stages];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    const withOrder = reordered.map((s, i) => ({ ...s, order: i }));
    setStages(withOrder);
    setDraggedStageId(null);
    await fetch(`/api/pipelines/${pipelineId}/stages`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(withOrder.map(s => ({ id: s.id, order: s.order }))),
    });
  };

  // ─── Card drag-to-move ───
  const handleCardDrop = async (targetStage: StageInfo) => {
    setDragOverStageId(null);
    if (!draggedDealId) return;
    const deal = deals.find(d => d.id === draggedDealId);
    setDraggedDealId(null);
    if (!deal || deal.stage === targetStage.key) return;
    setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, stage: targetStage.key } : d));
    await fetch(`/api/deals/${deal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pipelineStageKey: targetStage.key }),
    });
    fetchDeals(pipelineId);
  };

  const openModalForNew = (stageId: string) => {
    setNewDealName('');
    setNewDealCompany('');
    setNewDealValue('');
    setNewDealStage(stageId);
    setEditingDealId(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (deal: PipelineDeal) => {
    setNewDealName(deal.name);
    setNewDealCompany(deal.company);
    setNewDealValue(String(deal.value));
    setNewDealStage(deal.stage);
    setEditingDealId(deal.id);
    setIsModalOpen(true);
  };

  const handleDeleteDeal = async (dealId: string) => {
    try {
      await fetch(`/api/deals/${dealId}`, { method: 'DELETE' });
      fetchDeals(pipelineId);
    } catch {
      // silently fail
    }
  };

  const handleSaveDeal = async () => {
    if (!newDealName.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: newDealName,
        client: newDealCompany || 'Unknown',
        value: Number(newDealValue) || 0,
        pipelineId,
        pipelineStageKey: newDealStage,
        source: editingDealId ? undefined : 'Manual Entry',
      };
      const url = editingDealId ? `/api/deals/${editingDealId}` : '/api/deals';
      const method = editingDealId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        setIsModalOpen(false);
        setNewDealName('');
        setNewDealCompany('');
        setNewDealValue('');
        setNewDealStage('new');
        setEditingDealId(null);
        fetchDeals(pipelineId);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  const dealsByStage = (stageKey: string) => deals.filter(d => d.stage === stageKey);
  const totalValue = deals.reduce((a, d) => a + d.value, 0);
  const wonStageKey = stages.find(s => s.key === 'won')?.key ?? 'won';
  const wonValue = dealsByStage(wonStageKey).reduce((a, d) => a + d.value, 0);
  const totalDeals = deals.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Board Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {pipelines.map(p => (
            <button
              key={p.id}
              onClick={() => switchPipeline(p.id)}
              style={{
                padding: '7px 14px', fontSize: 12, fontWeight: 600, borderRadius: 8,
                background: pipelineId === p.id ? 'var(--purple-dim)' : 'var(--bg-card)',
                color: pipelineId === p.id ? 'var(--brand-accent)' : 'var(--text-muted)',
                border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              {p.icon ?? '📋'} {p.name}
            </button>
          ))}
        </div>
        <div ref={boardMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setBoardMenuOpen(o => !o)}
            className="btn btn-ghost"
            style={{ padding: '7px 12px', fontSize: 12 }}
          >⋮ Board</button>
          {boardMenuOpen && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, marginTop: 6, width: 180,
              background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10,
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)', zIndex: 200, padding: 6,
              display: 'flex', flexDirection: 'column', gap: 2,
            }}>
              <button onClick={handleAddBoard} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 12, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', borderRadius: 6 }} className="hover-bg">+ New Board</button>
              <button onClick={handleRenameBoard} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 12, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', borderRadius: 6 }} className="hover-bg">✏️ Rename Board</button>
              <button onClick={handleDeleteBoard} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 12, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--rose)', borderRadius: 6 }} className="hover-bg">🗑️ Delete Board</button>
            </div>
          )}
        </div>
      </div>

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
            <button key={v} onClick={() => setView(v)} style={{ padding: '7px 16px', fontSize: 12, fontWeight: 600, background: view === v ? 'var(--purple-dim)' : 'transparent', color: view === v ? 'var(--brand-accent)' : 'var(--text-muted)', border: 'none', cursor: 'pointer', borderRight: '1px solid var(--border)', fontFamily: 'Inter, sans-serif', textTransform: 'capitalize' }}>
              {v === 'kanban' ? '⬡ Kanban' : '≡ List'}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => openModalForNew(stages[0]?.key ?? 'new')}>+ New Deal</button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>Loading pipeline...</div>
      ) : (
        <>
          {/* Kanban Board */}
          {view === 'kanban' && (
            <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
              <div style={{ display: 'flex', gap: 16, minWidth: 'max-content' }}>
                {stages.map(col => {
                  const colDeals = dealsByStage(col.key);
                  const isDragOver = dragOverStageId === col.id;
                  return (
                    <div
                      key={col.id}
                      style={{ width: 300, flexShrink: 0, opacity: draggedStageId === col.id ? 0.4 : 1 }}
                      onDragOver={e => { e.preventDefault(); if (draggedDealId) setDragOverStageId(col.id); }}
                      onDragLeave={() => { if (dragOverStageId === col.id) setDragOverStageId(null); }}
                      onDrop={() => { if (draggedStageId) handleStageDrop(col); else if (draggedDealId) handleCardDrop(col); }}
                    >
                      {/* Column Header */}
                      <div
                        draggable
                        onDragStart={() => setDraggedStageId(col.id)}
                        onDragEnd={() => setDraggedStageId(null)}
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: `3px solid ${col.headerColor}`, borderRadius: '10px 10px 0 0', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'grab' }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{col.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className={`pipeline-col-count ${col.color}`} style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 8 }}>{colDeals.length}</span>
                          <button onClick={() => handleRenameStage(col)} title="Rename column" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12 }}>✏️</button>
                          <button onClick={() => handleDeleteStage(col)} title="Delete column" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--rose)', fontSize: 12 }}>✕</button>
                        </div>
                      </div>
                      {/* Deals */}
                      <div style={{
                        background: isDragOver ? 'var(--purple-dim)' : 'var(--bg-glass)',
                        border: `1px solid ${isDragOver ? 'var(--purple)' : 'var(--border)'}`,
                        borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '12px',
                        display: 'flex', flexDirection: 'column', gap: 12, minHeight: 120, transition: 'background 0.15s, border-color 0.15s',
                      }}>
                        {colDeals.map(deal => (
                          <div
                            key={deal.id}
                            className="deal-card"
                            draggable
                            onDragStart={() => setDraggedDealId(deal.id)}
                            onDragEnd={() => { setDraggedDealId(null); setDragOverStageId(null); }}
                            style={{ position: 'relative', padding: '14px', cursor: 'grab', opacity: draggedDealId === deal.id ? 0.4 : 1 }}
                            onClick={() => openModalForEdit(deal)}
                          >
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{deal.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{deal.company}</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--emerald)' }}>{fmtVal(deal.value)}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 11, color: deal.days > 10 ? 'var(--rose)' : 'var(--text-muted)' }}>{deal.days}d</span>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white' }}>{deal.owner}</div>
                              </div>
                            </div>
                            {/* Delete button */}
                            <button
                              onClick={e => { e.stopPropagation(); handleDeleteDeal(deal.id); }}
                              style={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--rose)',
                                cursor: 'pointer',
                                fontSize: 12,
                              }}
                            >✕</button>
                          </div>
                        ))}
                        <button style={{ border: '1px dashed var(--border)', borderRadius: 8, padding: '8px', fontSize: 11, color: 'var(--text-muted)', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => openModalForNew(col.key)}>+ Add Deal</button>
                      </div>
                    </div>
                  );
                })}

                {/* Add Column */}
                <div style={{ width: 220, flexShrink: 0 }}>
                  <button
                    onClick={handleAddStage}
                    style={{
                      width: '100%', height: 52, border: '1px dashed var(--border)', borderRadius: 10,
                      background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
                      fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                    }}
                  >+ Add Column</button>
                </div>
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
                  {deals.map(deal => {
                    const col = stages.find(s => s.key === deal.stage) || { label: deal.stage, color: 'new' };
                    return (
                      <tr key={deal.id} style={{ cursor: 'pointer', position: 'relative' }} onClick={() => openModalForEdit(deal)}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{deal.name}</td>
                        <td>{deal.company}</td>
                        <td style={{ fontWeight: 700, color: 'var(--emerald)' }}>{fmtVal(deal.value)}</td>
                        <td><span className={`badge ${col.color}`}>{col.label}</span></td>
                        <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{deal.source}</td>
                        <td style={{ color: deal.days > 10 ? 'var(--rose)' : 'var(--text-muted)', fontSize: 12 }}>{deal.days}d</td>
                        <td><div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white' }}>{deal.owner}</div></td>
                        <td>
                          <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={e => { e.stopPropagation(); handleDeleteDeal(deal.id); }}>Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                  {deals.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 14 }}>
                        No deals in this pipeline yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
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
                        {stages.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 10, marginTop: 24 }}>
                  <button className="btn btn-primary" onClick={handleSaveDeal}>{saving ? 'Saving...' : editingDealId ? 'Update Deal' : 'Create Deal'}</button>
                  <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </div>

              {/* Right Side: WhatsApp Activity Feed (Only show when editing) */}
              {editingDealId ? (
                <div style={{ width: 350, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-glass)' }}>
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
                          color: msg.internal ? 'var(--brand-accent)' : 'var(--text-primary)',
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
