'use client';
import { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Package, UserCheck, Activity, BatteryMedium, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';
import { fieldMonitoringFeed } from '@/lib/mockData';

type Agent = {
  id: string;
  name: string;
  phone: string | null;
  status: 'Active' | 'On Delivery' | 'Idle' | 'Offline';
  location: string | null;
  tasksCompleted: number;
  battery: string | null;
  lastUpdate: string;
};

const emptyForm = {
  name: '', phone: '', status: 'Idle' as Agent['status'], location: '', tasksCompleted: 0, battery: '',
};
type FormState = typeof emptyForm;

const kpiIcons: Record<string, React.ReactNode> = {
  blue: <UserCheck size={20} />,
  emerald: <Navigation size={20} />,
  purple: <Package size={20} />,
  rose: <AlertTriangle size={20} />
};

const feedIcons: Record<string, React.ReactNode> = {
  check: <CheckCircle size={14} color="#10b981" />,
  mapPin: <MapPin size={14} color="#6B00CC" />,
  alert: <AlertTriangle size={14} color="#f43f5e" />,
  package: <Package size={14} color="#8b5cf6" />,
  activity: <Activity size={14} color="#10b981" />
};

const activityFeed = fieldMonitoringFeed.map(feed => ({ ...feed, icon: feedIcons[feed.iconType] }));

function AgentModal({
  title, form, errors, onChange, onSubmit, onClose, submitLabel,
}: {
  title: string;
  form: FormState;
  errors: Record<string, string>;
  onChange: (k: keyof FormState, v: string | number) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitLabel: string;
}) {
  const inputStyle = (key: string) => ({
    background: 'var(--bg-secondary)',
    border: `1px solid ${errors[key] ? 'var(--rose)' : 'var(--border)'}`,
    borderRadius: 8, padding: '8px 12px',
    color: 'var(--text-primary)', fontSize: 13,
    fontFamily: 'Inter, sans-serif', outline: 'none',
    width: '100%', boxSizing: 'border-box' as const,
  });
  const selectStyle = { ...inputStyle(''), cursor: 'pointer' };
  const labelStyle = { fontSize: 11, fontWeight: 600 as const, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.05em' };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: 480, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16 }}>✕</button>
        </div>
        {errors.form && (
          <div style={{ padding: '10px 14px', background: 'var(--rose-dim)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, color: 'var(--rose)', fontSize: 12, fontWeight: 500 }}>
            {errors.form}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Agent Name *</label>
            <input style={inputStyle('name')} value={form.name} placeholder="e.g. Jatin M." onChange={e => onChange('name', e.target.value)} />
            {errors.name && <span style={{ fontSize: 11, color: 'var(--rose)' }}>{errors.name}</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Phone</label>
            <input style={inputStyle('phone')} value={form.phone} placeholder="+91 98765 43210" onChange={e => onChange('phone', e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Status</label>
            <select style={selectStyle} value={form.status} onChange={e => onChange('status', e.target.value)}>
              {['Active', 'On Delivery', 'Idle', 'Offline'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle('location')} value={form.location} placeholder="e.g. Depot (Chennai)" onChange={e => onChange('location', e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Tasks Completed</label>
            <input type="number" style={inputStyle('tasksCompleted')} value={form.tasksCompleted} onChange={e => onChange('tasksCompleted', Number(e.target.value))} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Battery</label>
            <input style={inputStyle('battery')} value={form.battery} placeholder="e.g. 85%" onChange={e => onChange('battery', e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={onSubmit} className="btn btn-primary">{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ agent, onConfirm, onClose }: { agent: Agent; onConfirm: () => void; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: 380, maxWidth: '95vw', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>🗑️ Remove Agent</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Are you sure you want to remove <strong style={{ color: 'var(--text-primary)' }}>{agent.name}</strong> from field tracking?</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={onConfirm} style={{ background: 'var(--rose)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Remove</button>
        </div>
      </div>
    </div>
  );
}

function ViewModal({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: 420, maxWidth: '95vw', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{agent.name}</div>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16 }}>✕</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            ['📞 Phone', agent.phone ?? '—'],
            ['🚦 Status', agent.status],
            ['📍 Location', agent.location ?? '—'],
            ['✅ Tasks Completed', String(agent.tasksCompleted)],
            ['🔋 Battery', agent.battery ?? '—'],
            ['🕐 Last Update', new Date(agent.lastUpdate).toLocaleString()],
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

export default function FieldMonitoringPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<FormState>({ ...emptyForm });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [editForm, setEditForm] = useState<FormState>({ ...emptyForm });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const [deleteAgent, setDeleteAgent] = useState<Agent | null>(null);
  const [viewAgent, setViewAgent] = useState<Agent | null>(null);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '200' });
      if (filter !== 'All') params.set('status', filter);
      const res = await fetch(`/api/field-agents?${params}`);
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) setAgents(json.data);
    } catch {
      // keep current state
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  const validate = (f: FormState) => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = 'Name is required';
    return e;
  };

  const handleAdd = async () => {
    const e = validate(addForm);
    if (Object.keys(e).length > 0) { setAddErrors(e); return; }
    const res = await fetch('/api/field-agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addForm),
    });
    if (res.ok) {
      setShowAdd(false);
      fetchAgents();
    } else {
      const json = await res.json().catch(() => ({}));
      setAddErrors({ form: json.error || 'Failed to add agent' });
    }
  };

  const openEdit = (a: Agent) => {
    setEditAgent(a);
    setEditForm({ name: a.name, phone: a.phone ?? '', status: a.status, location: a.location ?? '', tasksCompleted: a.tasksCompleted, battery: a.battery ?? '' });
    setEditErrors({});
  };

  const handleEdit = async () => {
    const e = validate(editForm);
    if (Object.keys(e).length > 0) { setEditErrors(e); return; }
    const res = await fetch(`/api/field-agents/${editAgent!.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      setEditAgent(null);
      fetchAgents();
    } else {
      const json = await res.json().catch(() => ({}));
      setEditErrors({ form: json.error || 'Failed to update agent' });
    }
  };

  const handleDelete = async () => {
    await fetch(`/api/field-agents/${deleteAgent!.id}`, { method: 'DELETE' });
    setDeleteAgent(null);
    fetchAgents();
  };

  const totalAgents = agents.length;
  const activeCount = agents.filter(a => a.status === 'Active' || a.status === 'On Delivery').length;
  const deliveriesToday = agents.reduce((a, ag) => a + ag.tasksCompleted, 0);
  const idleCount = agents.filter(a => a.status === 'Idle' || a.status === 'Offline').length;

  const kpis = [
    { label: 'Total Agents', value: String(totalAgents), delta: 'All assigned', color: 'blue' },
    { label: 'Active in Field', value: String(activeCount), delta: 'Active + On Delivery', color: 'emerald' },
    { label: 'Tasks Completed', value: String(deliveriesToday), delta: 'Across all agents', color: 'purple' },
    { label: 'Idle / Offline', value: String(idleCount), delta: 'Requires attention', color: 'rose' },
  ].map(kpi => ({ ...kpi, icon: kpiIcons[kpi.color] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Field Worker Tracking</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '4px 0 0' }}>Monitor FMCG deliveries, check-ins, and agent status.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setAddForm({ ...emptyForm }); setAddErrors({}); setShowAdd(true); }}>
          <UserCheck size={16} /> + New Agent
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `color-mix(in srgb, var(--${kpi.color}-dim) 50%, transparent)`, color: `var(--${kpi.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {kpi.icon}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{kpi.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{kpi.label}</div>
            </div>
            <div style={{ fontSize: 12, color: `var(--${kpi.color})`, marginTop: 4 }}>
              {kpi.delta}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Left Column: Agent List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 20, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Active Field Agents</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {['All', 'Active', 'On Delivery', 'Idle', 'Offline'].map(f => (
                  <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => setFilter(f)}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th>Status & Location</th>
                    <th>Tasks / Battery</th>
                    <th>Last Update</th>
                    <th style={{ textAlign: 'right', paddingRight: 12 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading agents...</td></tr>
                  ) : (
                    <>
                      {agents.map(agent => (
                        <tr key={agent.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-accent)', fontWeight: 600, fontSize: 13 }}>
                                {agent.name.charAt(0)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 500 }}>{agent.name}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{agent.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <span style={{
                                fontSize: 11, padding: '2px 8px', borderRadius: 12, width: 'fit-content',
                                background: agent.status === 'Active' ? 'var(--blue-dim)' : agent.status === 'On Delivery' ? 'var(--emerald-dim)' : agent.status === 'Idle' ? 'var(--amber-dim)' : 'var(--border)',
                                color: agent.status === 'Active' ? 'var(--brand-accent)' : agent.status === 'On Delivery' ? 'var(--emerald)' : agent.status === 'Idle' ? 'var(--amber)' : 'var(--text-secondary)'
                              }}>
                                {agent.status}
                              </span>
                              <div style={{ fontSize: 12, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MapPin size={12} color="var(--text-secondary)" /> {agent.location ?? '—'}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <div style={{ fontSize: 13, fontWeight: 500 }}>{agent.tasksCompleted} Completed</div>
                              <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <BatteryMedium size={14} /> {agent.battery ?? '—'}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{new Date(agent.lastUpdate).toLocaleString()}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                              <button onClick={() => setViewAgent(agent)} className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }}>View</button>
                              <button onClick={() => openEdit(agent)} style={{ padding: '4px 10px', fontSize: 11, background: 'var(--blue-dim)', color: 'var(--brand-accent)', border: '1px solid var(--brand-accent)', borderRadius: 7, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>✏️ Edit</button>
                              <button onClick={() => setDeleteAgent(agent)} style={{ padding: '4px 10px', fontSize: 11, background: 'var(--rose-dim)', color: 'var(--rose)', border: '1px solid var(--rose)', borderRadius: 7, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {agents.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
                            No agents match this status.
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Live Feed */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} color="var(--brand-accent)" /> WhatsApp Live Feed
            </h2>
            <span style={{ fontSize: 11, background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: 12, animation: 'pulse 2s infinite' }}>Live</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, overflowY: 'auto' }}>
            {activityFeed.map((feed) => (
              <div key={feed.id} style={{ display: 'flex', gap: 12 }}>
                <div style={{ marginTop: 2, background: 'var(--bg-secondary)', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {feed.icon}
                </div>
                <div style={{ flex: 1, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>{feed.agent}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{feed.time}</span>
                  </div>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{feed.action}: </span>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{feed.target}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-ghost" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
            View Full Log
          </button>
        </div>
      </div>

      {showAdd && <AgentModal title="+ New Field Agent" form={addForm} errors={addErrors} onChange={(k, v) => setAddForm(p => ({ ...p, [k]: v }))} onSubmit={handleAdd} onClose={() => setShowAdd(false)} submitLabel="Add Agent" />}
      {editAgent && <AgentModal title={`✏️ Edit — ${editAgent.name}`} form={editForm} errors={editErrors} onChange={(k, v) => setEditForm(p => ({ ...p, [k]: v }))} onSubmit={handleEdit} onClose={() => setEditAgent(null)} submitLabel="Save Changes" />}
      {deleteAgent && <DeleteConfirm agent={deleteAgent} onConfirm={handleDelete} onClose={() => setDeleteAgent(null)} />}
      {viewAgent && <ViewModal agent={viewAgent} onClose={() => setViewAgent(null)} />}
    </div>
  );
}
