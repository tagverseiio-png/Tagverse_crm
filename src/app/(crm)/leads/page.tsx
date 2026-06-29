'use client';
import { useState } from 'react';
import { leadsInitial as initialLeads, leadsStageFilters as stageFilters, leadsSources as sources, leadsStages as stages, type Lead } from '@/lib/mockData';


const emptyForm = {
  name: '', company: '', phone: '', email: '',
  source: 'Meta Ads', stage: 'new', score: 50,
  owner: 'JS', intent: '', whatsapp: false,
};

type FormState = typeof emptyForm;

/* ─────────── Shared Modal Form ─────────── */
function LeadModal({
  title, form, errors, onChange, onSubmit, onClose, submitLabel,
}: {
  title: string;
  form: FormState;
  errors: Record<string, string>;
  onChange: (k: keyof FormState, v: string | number | boolean) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitLabel: string;
}) {
  const inputStyle = (key: string) => ({
    background: 'var(--bg-secondary)',
    border: `1px solid ${errors[key] ? 'var(--rose)' : 'var(--border)'}`,
    borderRadius: 8,
    padding: '8px 12px',
    color: 'var(--text-primary)',
    fontSize: 13,
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  });

  const selectStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '8px 12px',
    color: 'var(--text-primary)',
    fontSize: 13,
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    width: '100%',
    cursor: 'pointer',
  };

  const labelStyle = {
    fontSize: 11, fontWeight: 600 as const,
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 16, padding: 28,
          width: 540, maxWidth: '95vw', maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Fill in the details below</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16 }}>✕</button>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Full Name *</label>
            <input style={inputStyle('name')} value={form.name} placeholder="e.g. Riya Sharma"
              onChange={e => onChange('name', e.target.value)} />
            {errors.name && <span style={{ fontSize: 11, color: 'var(--rose)' }}>{errors.name}</span>}
          </div>

          {/* Company */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Company</label>
            <input style={inputStyle('company')} value={form.company} placeholder="e.g. BloomAds"
              onChange={e => onChange('company', e.target.value)} />
          </div>

          {/* Phone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Phone *</label>
            <input style={inputStyle('phone')} value={form.phone} placeholder="+91 98765 43210"
              onChange={e => onChange('phone', e.target.value)} />
            {errors.phone && <span style={{ fontSize: 11, color: 'var(--rose)' }}>{errors.phone}</span>}
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Email *</label>
            <input style={inputStyle('email')} value={form.email} type="email" placeholder="name@company.com"
              onChange={e => onChange('email', e.target.value)} />
            {errors.email && <span style={{ fontSize: 11, color: 'var(--rose)' }}>{errors.email}</span>}
          </div>

          {/* Source */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Source</label>
            <select style={selectStyle} value={form.source} onChange={e => onChange('source', e.target.value)}>
              {sources.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* Stage */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Stage</label>
            <select style={selectStyle} value={form.stage} onChange={e => onChange('stage', e.target.value)}>
              {stages.map(o => <option key={o} value={o} style={{ textTransform: 'capitalize' }}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
          </div>

          {/* Intent */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Intent / Service</label>
            <input style={inputStyle('intent')} value={form.intent} placeholder="e.g. SEO + Social"
              onChange={e => onChange('intent', e.target.value)} />
          </div>

          {/* Owner */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Owner Initials</label>
            <input style={inputStyle('owner')} value={form.owner} placeholder="JS"
              onChange={e => onChange('owner', e.target.value)} />
          </div>

          {/* Score slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Lead Score (0–100)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="range" min={0} max={100} value={form.score}
                onChange={e => onChange('score', Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--purple)' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', minWidth: 28, textAlign: 'right' }}>{form.score}</span>
            </div>
          </div>

          {/* WhatsApp */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
            <label style={labelStyle}>WhatsApp Active</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.whatsapp}
                onChange={e => onChange('whatsapp', e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--emerald)', cursor: 'pointer' }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{form.whatsapp ? '🟢 Yes' : '⚫ No'}</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={onSubmit} className="btn btn-primary">{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Delete Confirm Modal ─────────── */
function DeleteConfirm({ lead, onConfirm, onClose }: { lead: Lead; onConfirm: () => void; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: 380, maxWidth: '95vw', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>🗑️ Delete Lead</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{lead.name}</strong> from <strong style={{ color: 'var(--text-primary)' }}>{lead.company}</strong>? This action cannot be undone.
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={onConfirm} style={{ background: 'var(--rose)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── View Detail Modal ─────────── */
function ViewModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: 460, maxWidth: '95vw', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{lead.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lead.company}</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16 }}>✕</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            ['📞 Phone', lead.phone],
            ['✉️ Email', lead.email],
            ['🏷️ Source', lead.source],
            ['🎯 Intent', lead.intent],
            ['📊 Stage', lead.stage.charAt(0).toUpperCase() + lead.stage.slice(1)],
            ['⭐ Score', String(lead.score)],
            ['💬 WhatsApp', lead.whatsapp ? '🟢 Active' : '⚫ Inactive'],
            ['👤 Owner', lead.owner],
            ['🕐 Added', lead.created],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4, borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="btn btn-ghost">Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Main Page ─────────── */
export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Add modal
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<FormState>({ ...emptyForm });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  // Edit modal
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState<FormState>({ ...emptyForm });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  // Delete confirm
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);

  // View modal
  const [viewLead, setViewLead] = useState<Lead | null>(null);

  const filtered = leads.filter(l =>
    (filter === 'all' || l.stage === filter) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()))
  );

  const validate = (f: FormState) => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = 'Name is required';
    if (!f.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = 'Invalid email';
    if (!f.phone.trim()) e.phone = 'Phone is required';
    return e;
  };

  /* ── Add Lead ── */
  const handleAdd = () => {
    const e = validate(addForm);
    if (Object.keys(e).length > 0) { setAddErrors(e); return; }
    setLeads(prev => [{
      id: Date.now(),
      name: addForm.name.trim(), company: addForm.company.trim(),
      phone: addForm.phone.trim(), email: addForm.email.trim(),
      source: addForm.source, stage: addForm.stage,
      score: Number(addForm.score), owner: addForm.owner.trim() || 'JS',
      intent: addForm.intent.trim(), whatsapp: addForm.whatsapp,
      created: 'just now',
    }, ...prev]);
    setShowAdd(false);
  };

  /* ── Open Edit ── */
  const openEdit = (l: Lead) => {
    setEditLead(l);
    setEditForm({ name: l.name, company: l.company, phone: l.phone, email: l.email, source: l.source, stage: l.stage, score: l.score, owner: l.owner, intent: l.intent, whatsapp: l.whatsapp });
    setEditErrors({});
  };

  /* ── Save Edit ── */
  const handleEdit = () => {
    const e = validate(editForm);
    if (Object.keys(e).length > 0) { setEditErrors(e); return; }
    setLeads(prev => prev.map(l =>
      l.id === editLead!.id
        ? { ...l, name: editForm.name, company: editForm.company, phone: editForm.phone, email: editForm.email, source: editForm.source, stage: editForm.stage, score: Number(editForm.score), owner: editForm.owner || 'JS', intent: editForm.intent, whatsapp: editForm.whatsapp }
        : l
    ));
    setEditLead(null);
  };

  /* ── Delete ── */
  const handleDelete = () => {
    setLeads(prev => prev.filter(l => l.id !== deleteLead!.id));
    setDeleteLead(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Contacts', value: leads.length.toLocaleString(), color: 'blue' },
          { label: 'New This Week', value: '48', color: 'purple' },
          { label: 'Hot Leads (Score ≥ 80)', value: leads.filter(l => l.score >= 80).length.toString(), color: 'amber' },
          { label: 'Avg. Lead Score', value: (leads.reduce((s, l) => s + l.score, 0) / (leads.length || 1)).toFixed(1), color: 'emerald' },
        ].map(s => (
          <div key={s.label} className={`kpi-card ${s.color}`}>
            <div className="kpi-label" style={{ marginBottom: 8 }}>{s.label}</div>
            <div className="kpi-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 240, position: 'relative', flexShrink: 0 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or company..."
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px 8px 36px', color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', flex: 1 }}>
          {stageFilters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 12px', fontSize: 11, fontWeight: 600, background: filter === f ? 'var(--purple-dim)' : 'transparent', color: filter === f ? '#000' : 'var(--text-muted)', border: 'none', cursor: 'pointer', textTransform: 'capitalize', borderRight: '1px solid var(--border)', fontFamily: 'Inter, sans-serif', flex: 1 }}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => { setAddForm({ ...emptyForm }); setAddErrors({}); setShowAdd(true); }} style={{ whiteSpace: 'nowrap' }}>
          + New Lead
        </button>
        <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>+ Import CSV</button>
      </div>

      {/* Leads Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Intent</th>
                <th>Stage</th>
                <th>Score</th>
                <th>WA</th>
                <th>Owner</th>
                <th>Added</th>
                <th style={{ textAlign: 'right', paddingRight: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{l.name}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{l.company}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l.email}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{l.phone}</td>
                  <td><span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--border)', padding: '2px 8px', borderRadius: 6 }}>{l.source}</span></td>
                  <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{l.intent}</td>
                  <td><span className={`badge ${l.stage}`}>{l.stage === 'won' ? '✓ Won' : l.stage === 'lost' ? '✗ Lost' : l.stage}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 36, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${l.score}%`, height: '100%', background: l.score >= 80 ? 'var(--emerald)' : l.score >= 60 ? 'var(--amber)' : 'var(--rose)', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: l.score >= 80 ? 'var(--emerald)' : l.score >= 60 ? 'var(--amber)' : 'var(--rose)' }}>{l.score}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 16 }}>{l.whatsapp ? '🟢' : '⚫'}</td>
                  <td><div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white' }}>{l.owner}</div></td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.created}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                      {/* View */}
                      <button
                        onClick={() => setViewLead(l)}
                        className="btn btn-ghost"
                        title="View details"
                        style={{ padding: '4px 10px', fontSize: 11 }}
                      >View</button>
                      {/* Edit */}
                      <button
                        onClick={() => openEdit(l)}
                        title="Edit lead"
                        style={{ padding: '4px 10px', fontSize: 11, background: 'var(--blue-dim)', color: 'var(--brand-accent)', border: '1px solid var(--brand-accent)', borderRadius: 7, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                      >✏️ Edit</button>
                      {/* Delete */}
                      <button
                        onClick={() => setDeleteLead(l)}
                        title="Delete lead"
                        style={{ padding: '4px 10px', fontSize: 11, background: 'var(--rose-dim)', color: 'var(--rose)', border: '1px solid var(--rose)', borderRadius: 7, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                      >🗑️ Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Lead Modal ── */}
      {showAdd && (
        <LeadModal
          title="+ New Lead"
          form={addForm}
          errors={addErrors}
          onChange={(k, v) => setAddForm(prev => ({ ...prev, [k]: v }))}
          onSubmit={handleAdd}
          onClose={() => setShowAdd(false)}
          submitLabel="Add Lead"
        />
      )}

      {/* ── Edit Lead Modal ── */}
      {editLead && (
        <LeadModal
          title={`✏️ Edit — ${editLead.name}`}
          form={editForm}
          errors={editErrors}
          onChange={(k, v) => setEditForm(prev => ({ ...prev, [k]: v }))}
          onSubmit={handleEdit}
          onClose={() => setEditLead(null)}
          submitLabel="Save Changes"
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteLead && (
        <DeleteConfirm
          lead={deleteLead}
          onConfirm={handleDelete}
          onClose={() => setDeleteLead(null)}
        />
      )}

      {/* ── View Modal ── */}
      {viewLead && (
        <ViewModal
          lead={viewLead}
          onClose={() => setViewLead(null)}
        />
      )}
    </div>
  );
}
