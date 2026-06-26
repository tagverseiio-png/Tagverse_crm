'use client';
import { useState, useMemo } from 'react';

type Quote = {
  id: string; client: string; amount: number; sentOn: string;
  expires: string; status: 'Draft' | 'Sent' | 'Accepted' | 'Expired' | 'Invoiced';
};

const INITIAL_QUOTES: Quote[] = [
  { id: '#Q-1042', client: 'Arka Systems', amount: 120000, sentOn: 'Jun 10', expires: 'Jun 30', status: 'Sent' },
  { id: '#Q-1041', client: 'Nexus Retail', amount: 85000, sentOn: 'Jun 8', expires: 'Jun 28', status: 'Accepted' },
  { id: '#Q-1040', client: 'Indra Logistics', amount: 240000, sentOn: 'Jun 5', expires: 'Jun 25', status: 'Sent' },
  { id: '#Q-1039', client: 'Vega Partners', amount: 60000, sentOn: 'May 28', expires: 'Jun 17', status: 'Expired' },
  { id: '#Q-1038', client: 'BlueStar Media', amount: 45500, sentOn: 'May 20', expires: 'Jun 10', status: 'Accepted' },
  { id: '#Q-1037', client: 'GrowthLab Inc.', amount: 95000, sentOn: 'May 15', expires: 'Jun 4', status: 'Draft' },
];

function fmt(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  return `₹${v.toLocaleString('en-IN')}`;
}

const STATUS_BADGE: Record<string, string> = {
  Draft: 'badge',
  Sent: 'badge amber',
  Accepted: 'badge emerald',
  Expired: 'badge rose',
  Invoiced: 'badge blue',
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mClient, setMClient] = useState('');
  const [mAmount, setMAmount] = useState('');
  const [mStatus, setMStatus] = useState<Quote['status']>('Draft');
  const [mExpires, setMExpires] = useState('');

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invQuoteId, setInvQuoteId] = useState<string | null>(null);
  const [invClient, setInvClient] = useState('');
  const [invAmount, setInvAmount] = useState('');

  const filtered = useMemo(() => quotes.filter(q => {
    const ms = q.client.toLowerCase().includes(search.toLowerCase()) || q.id.toLowerCase().includes(search.toLowerCase());
    return ms && (filterStatus === 'All' || q.status === filterStatus);
  }), [quotes, search, filterStatus]);

  const totalValue = quotes.filter(q => q.status === 'Accepted' || q.status === 'Sent').reduce((a, q) => a + q.amount, 0);
  const accepted = quotes.filter(q => q.status === 'Accepted').length;
  const pending = quotes.filter(q => q.status === 'Sent').length;

  const openNew = () => {
    setMClient(''); setMAmount(''); setMStatus('Draft'); setMExpires('');
    setEditingId(null); setIsModalOpen(true);
  };
  const openEdit = (q: Quote) => {
    setMClient(q.client); setMAmount(String(q.amount)); setMStatus(q.status); setMExpires(q.expires);
    setEditingId(q.id); setIsModalOpen(true);
  };
  const handleSave = () => {
    if (!mClient.trim()) return;
    if (editingId) {
      setQuotes(p => p.map(q => q.id === editingId ? { ...q, client: mClient, amount: Number(mAmount), status: mStatus, expires: mExpires } : q));
    } else {
      const newQ: Quote = {
        id: `#Q-${Math.floor(1000 + Math.random() * 9000)}`, client: mClient,
        amount: Number(mAmount) || 0, sentOn: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        expires: mExpires, status: mStatus
      };
      setQuotes(p => [newQ, ...p]);
    }
    setIsModalOpen(false);
  };
  const handleDelete = (id: string) => { setQuotes(p => p.filter(q => q.id !== id)); setIsModalOpen(false); };

  const openInvoice = (q: Quote) => {
    setInvClient(q.client);
    setInvAmount(String(q.amount));
    setInvQuoteId(q.id);
    setIsInvoiceModalOpen(true);
  };

  const handleCreateInvoice = () => {
    if (invQuoteId) {
      setQuotes(p => p.map(q => q.id === invQuoteId ? { ...q, client: invClient, amount: Number(invAmount), status: 'Invoiced' } : q));
    }
    setIsInvoiceModalOpen(false);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-file-description" style={{ color: 'var(--blue)', fontSize: 24 }}></i> Quotes
          </div>
          <div className="section-sub" style={{ fontSize: 13, marginTop: 4 }}>Manage proposals sent to prospects and clients.</div>
        </div>
        <button className="btn btn-primary" onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-plus"></i> New Quote
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Sent', value: String(quotes.length), delta: '↑ 12% this month', color: 'blue' },
          { label: 'Pending Approval', value: String(pending), delta: 'Awaiting response', color: 'amber' },
          { label: 'Accepted', value: String(accepted), delta: `${Math.round((accepted / quotes.length) * 100)}% rate`, color: 'emerald' },
          { label: 'Total Value', value: fmt(totalValue), delta: 'Across open quotes', color: 'purple' },
        ].map(k => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-label" style={{ marginBottom: 6 }}>{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div style={{ fontSize: 12, color: 'var(--emerald-light)', marginTop: 4 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }}></i>
          <input type="text" placeholder="Search quotes…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
          {['All', 'Draft', 'Sent', 'Accepted', 'Expired', 'Invoiced'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card table-wrap" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>Quote #</th><th>Client</th><th>Amount</th><th>Sent On</th><th>Expires</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(q => (
              <tr key={q.id} style={{ cursor: 'pointer' }} onClick={() => openEdit(q)}>
                <td><span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{q.id}</span></td>
                <td style={{ fontWeight: 500 }}>{q.client}</td>
                <td style={{ fontWeight: 700, color: 'var(--emerald-light)', fontVariantNumeric: 'tabular-nums' }}>{fmt(q.amount)}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{q.sentOn}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{q.expires}</td>
                <td><span className={STATUS_BADGE[q.status]}>{q.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => openEdit(q)}>
                      <i className="ti ti-edit"></i> Edit
                    </button>
                    {q.status === 'Accepted' && (
                      <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); openInvoice(q); }} style={{ padding: '4px 10px', fontSize: 12, color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-file-invoice"></i> Invoice
                      </button>
                    )}
                    {q.status === 'Expired' && (
                      <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-refresh"></i> Resend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No quotes match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 460, padding: 24, background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)', boxShadow: '0 12px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{editingId ? 'Edit Quote' : 'Create Quote'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[{ label: 'Client / Company', val: mClient, set: setMClient, placeholder: 'e.g. Arka Systems', type: 'text' }].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>{f.label}</label>
                  <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Amount (₹)</label>
                  <input type="number" value={mAmount} onChange={e => setMAmount(e.target.value)} placeholder="0"
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Status</label>
                  <select value={mStatus} onChange={e => setMStatus(e.target.value as Quote['status'])}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                    {['Draft', 'Sent', 'Accepted', 'Expired'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Expires</label>
                <input type="text" value={mExpires} onChange={e => setMExpires(e.target.value)} placeholder="e.g. Jun 30"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {editingId ? <button className="btn btn-ghost" style={{ color: 'var(--rose)' }} onClick={() => handleDelete(editingId)}>Delete</button> : <div />}
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>{editingId ? 'Save Changes' : 'Create Quote'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 400, padding: 24, background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)', boxShadow: '0 12px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Convert to Invoice</h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>Review the details before moving this quote to invoices.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Client</label>
                <input type="text" value={invClient} onChange={e => setInvClient(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Amount (₹)</label>
                <input type="number" value={invAmount} onChange={e => setInvAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={() => setIsInvoiceModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateInvoice} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="ti ti-file-invoice"></i> Move to Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
