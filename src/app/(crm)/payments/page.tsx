'use client';
import { useState, useMemo } from 'react';
import {
  type Payment,
  paymentsData as INITIAL_PAYMENTS,
  paymentsRecentActivity as RECENT_ACTIVITY,
  paymentsCollectionMethods as COLLECTION_METHODS,
  paymentsStatusBadge as STATUS_BADGE,
} from '@/lib/mockData';

function fmt(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  return `₹${v.toLocaleString('en-IN')}`;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mClient, setMClient] = useState('');
  const [mInvoice, setMInvoice] = useState('');
  const [mAmount, setMAmount] = useState('');
  const [mMethod, setMMethod] = useState<Payment['method']>('UPI');
  const [mStatus, setMStatus] = useState<Payment['status']>('Received');

  const filtered = useMemo(() => payments.filter(p => {
    const ms = p.client.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.invoiceId.toLowerCase().includes(search.toLowerCase());
    return ms && (filterMethod === 'All' || p.method === filterMethod) && (filterStatus === 'All' || p.status === filterStatus);
  }), [payments, search, filterMethod, filterStatus]);

  const collected = payments.filter(p => p.status === 'Received').reduce((a, p) => a + p.amount, 0);
  const pending = payments.filter(p => p.status === 'Pending').reduce((a, p) => a + p.amount, 0);
  const txnCount = payments.length;
  const failedCount = payments.filter(p => p.status === 'Failed').length;

  const handleRecord = () => {
    if (!mClient.trim()) return;
    setPayments(p => [{
      id: `#PAY-${Math.floor(882 + Math.random() * 100)}`,
      client: mClient, invoiceId: mInvoice,
      amount: Number(mAmount) || 0,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      method: mMethod, status: mStatus
    }, ...p]);
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-credit-card" style={{ color: 'var(--amber)', fontSize: 24 }}></i> Payments
          </div>
          <div className="section-sub" style={{ fontSize: 13, marginTop: 4 }}>Collections, transaction history, and pending follow-ups.</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setMClient(''); setMInvoice(''); setMAmount(''); setMMethod('UPI'); setMStatus('Received'); setIsModalOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-plus"></i> Record Payment
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Collected This Month', value: fmt(collected), delta: '↑ 22% vs May', color: 'emerald' },
          { label: 'Pending Collection', value: fmt(pending), delta: `Across ${payments.filter(p => p.status === 'Pending').length} invoices`, color: 'amber', neg: true },
          { label: 'Transactions', value: String(txnCount), delta: 'This month', color: 'blue' },
          { label: 'Failed / Returned', value: String(failedCount), delta: 'Needs follow-up', color: 'rose', neg: true },
        ].map(k => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-label" style={{ marginBottom: 6 }}>{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div style={{ fontSize: 12, color: k.neg ? 'var(--rose-light)' : 'var(--emerald-light)', marginTop: 4 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Two-col insight cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent Activity */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Recent Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 0', borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: a.iconBg, color: a.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                  <i className={`ti ${a.icon}`}></i>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collection by Method + Pending Follow-ups */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Collection by Method</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {COLLECTION_METHODS.map(m => (
              <div key={m.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.amount}</span>
                </div>
                <div style={{ height: 7, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 4, width: `${m.pct}%`, background: m.color, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Pending Follow-ups</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <tbody>
                {payments.filter(p => p.status === 'Failed' || p.status === 'Pending').map((p, i, arr) => (
                  <tr key={p.id} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>{p.client}</td>
                    <td style={{ padding: '8px 0', textAlign: 'right' }}>
                      <span className={STATUS_BADGE[p.status]}>{p.status === 'Failed' ? 'Returned' : '12 days overdue'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }}></i>
          <input type="text" placeholder="Search transactions…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
        </div>
        <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
          {['All', 'UPI', 'NEFT', 'Cheque', 'Pending'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
          {['All', 'Received', 'Pending', 'Failed'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Transactions Table */}
      <div className="card table-wrap" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>Txn ID</th><th>Client</th><th>Invoice</th><th>Amount</th><th>Date</th><th>Method</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{p.id}</span></td>
                <td style={{ fontWeight: 500 }}>{p.client}</td>
                <td style={{ color: 'var(--blue)', fontFamily: 'monospace', fontSize: 12 }}>{p.invoiceId}</td>
                <td style={{ fontWeight: 700, color: 'var(--emerald-light)', fontVariantNumeric: 'tabular-nums' }}>{fmt(p.amount)}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{p.date}</td>
                <td><span className="badge">{p.method}</span></td>
                <td><span className={STATUS_BADGE[p.status]}>{p.status}</span></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No transactions match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 460, padding: 24, background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)', boxShadow: '0 12px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Record Payment</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Client</label>
                  <input type="text" value={mClient} onChange={e => setMClient(e.target.value)} placeholder="e.g. Arka Systems"
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Invoice ID</label>
                  <input type="text" value={mInvoice} onChange={e => setMInvoice(e.target.value)} placeholder="e.g. INV-2091"
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Amount (₹)</label>
                <input type="number" value={mAmount} onChange={e => setMAmount(e.target.value)} placeholder="0"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Method</label>
                  <select value={mMethod} onChange={e => setMMethod(e.target.value as Payment['method'])}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                    {['UPI', 'NEFT', 'Cheque', 'Pending'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Status</label>
                  <select value={mStatus} onChange={e => setMStatus(e.target.value as Payment['status'])}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                    {['Received', 'Pending', 'Failed'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleRecord}>Record Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
