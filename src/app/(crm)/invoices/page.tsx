'use client';
import { useState, useEffect, useCallback } from 'react';
import QuoteBuilderModal, { Quote as Invoice } from '../quotes/QuoteBuilderModal';

const STATUS_BADGE: Record<string, string> = {
  Draft: 'badge',
  Sent: 'badge amber',
  Paid: 'badge emerald',
  Overdue: 'badge rose',
  Void: 'badge',
};

function fmt(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  return `₹${v.toLocaleString('en-IN')}`;
}

function parseDisplayDate(s: string): string {
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function mapApiInvoice(inv: Record<string, unknown>): Invoice {
  return {
    id: inv.id as string,
    client: inv.client as string,
    amount: (inv.total as number) ?? 0,
    sentOn: inv.issuedAt ? new Date(inv.issuedAt as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    expires: inv.dueDate ? new Date(inv.dueDate as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    status: inv.status as Invoice['status'],
    contact: (inv.contact as string) ?? undefined,
    email: (inv.email as string) ?? undefined,
    phone: (inv.phone as string) ?? undefined,
    scope: (inv.scope as string) ?? undefined,
    lineItems: (inv.lineItems as Invoice['lineItems']) ?? [],
    gstRate: (inv.gstRate as number) ?? 18,
    discountRate: (inv.discountRate as number) ?? 0,
    notes: (inv.notes as string) ?? undefined,
    terms: (inv.terms as string) ?? undefined,
    delivery: (inv.delivery as string) ?? undefined,
    currency: (inv.currency as string) ?? '₹',
  };
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isNewInvoice, setIsNewInvoice] = useState(false);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '200' });
      if (search) params.set('search', search);
      if (filterStatus !== 'All') params.set('status', filterStatus);
      const res = await fetch(`/api/invoices?${params}`);
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) setInvoices(json.data.map(mapApiInvoice));
    } catch {
      // keep current state
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const totalInvoiced = invoices.reduce((a, i) => a + i.amount, 0);
  const outstanding = invoices.filter(i => i.status === 'Overdue' || i.status === 'Sent').reduce((a, i) => a + i.amount, 0);
  const paidThisMonth = invoices.filter(i => i.status === 'Paid').reduce((a, i) => a + i.amount, 0);
  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;

  const openNew = () => {
    setEditingInvoice({
      id: '',
      client: '',
      amount: 0,
      sentOn: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      expires: '',
      status: 'Draft',
    });
    setIsNewInvoice(true);
    setIsModalOpen(true);
  };

  const openEdit = (inv: Invoice) => {
    setEditingInvoice(inv);
    setIsNewInvoice(false);
    setIsModalOpen(true);
  };

  const handleSaveInvoice = async (savedInvoice: Invoice) => {
    const payload = {
      client: savedInvoice.client,
      contact: savedInvoice.contact,
      email: savedInvoice.email,
      phone: savedInvoice.phone,
      scope: savedInvoice.scope,
      lineItems: savedInvoice.lineItems ?? [],
      gstRate: savedInvoice.gstRate ?? 18,
      discountRate: savedInvoice.discountRate ?? 0,
      currency: savedInvoice.currency ?? '₹',
      terms: savedInvoice.terms,
      delivery: savedInvoice.delivery,
      notes: savedInvoice.notes,
      total: savedInvoice.amount,
      status: savedInvoice.status,
      issuedAt: parseDisplayDate(savedInvoice.sentOn),
      dueDate: parseDisplayDate(savedInvoice.expires),
    };

    const url = isNewInvoice ? '/api/invoices' : `/api/invoices/${editingInvoice!.id}`;
    const method = isNewInvoice ? 'POST' : 'PUT';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setIsModalOpen(false);
      fetchInvoices();
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
    setIsModalOpen(false);
    fetchInvoices();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-file-invoice" style={{ color: 'var(--emerald)', fontSize: 24 }}></i> Invoices
          </div>
          <div className="section-sub" style={{ fontSize: 13, marginTop: 4 }}>Track billing, collections, and payment status.</div>
        </div>
        <button className="btn btn-primary" onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-plus"></i> New Invoice
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Invoiced', value: fmt(totalInvoiced), delta: 'All invoices', color: 'blue' },
          { label: 'Outstanding', value: fmt(outstanding), delta: `${overdueCount} overdue`, color: 'rose', neg: true },
          { label: 'Paid', value: fmt(paidThisMonth), delta: 'Collected to date', color: 'emerald' },
          { label: 'Overdue Count', value: String(overdueCount), delta: 'Needs follow-up', color: 'purple' },
        ].map(k => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-label" style={{ marginBottom: 6 }}>{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div style={{ fontSize: 12, color: k.neg ? 'var(--rose-light)' : 'var(--emerald-light)', marginTop: 4 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }}></i>
          <input type="text" placeholder="Search invoices…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
          {['All', 'Draft', 'Sent', 'Paid', 'Overdue'].map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="btn btn-ghost" onClick={() => { setSearch(''); setFilterStatus('All'); }} style={{ fontSize: 13 }}>
          <i className="ti ti-x"></i> Clear
        </button>
      </div>

      {/* Table */}
      <div className="card table-wrap" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading invoices...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Invoice #</th><th>Client</th><th>Amount</th><th>Issued</th><th>Due</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => openEdit(inv)}>
                  <td><span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 11 }}>{inv.id.slice(0, 8)}</span></td>
                  <td style={{ fontWeight: 500 }}>{inv.client}</td>
                  <td style={{ fontWeight: 700, color: 'var(--emerald-light)', fontVariantNumeric: 'tabular-nums' }}>{inv.currency || '₹'}{inv.amount.toLocaleString('en-IN')}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{inv.sentOn}</td>
                  <td style={{ color: inv.status === 'Overdue' ? 'var(--rose-light)' : 'var(--text-secondary)', fontWeight: inv.status === 'Overdue' ? 600 : 400 }}>{inv.expires}</td>
                  <td><span className={STATUS_BADGE[inv.status]}>{inv.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                      {(inv.status === 'Sent' || inv.status === 'Overdue') && (
                        <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <i className="ti ti-send"></i> Remind
                        </button>
                      )}
                      {inv.status === 'Paid' && (
                        <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <i className="ti ti-download"></i> PDF
                        </button>
                      )}
                      <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => openEdit(inv)}>
                        <i className="ti ti-edit"></i> Edit
                      </button>
                      <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, color: 'var(--rose)', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => handleDelete(inv.id)}>
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No invoices match your filters.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Advanced Invoice Builder Modal */}
      {isModalOpen && (
        <QuoteBuilderModal
          initialQuote={editingInvoice}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveInvoice}
          docType="Invoice"
          actionLabel="Save Invoice"
        />
      )}
    </div>
  );
}
