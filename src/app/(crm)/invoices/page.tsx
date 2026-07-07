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

function toISO(s: string): string {
  if (!s) return new Date().toISOString();
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function fmtDisplayDate(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function mapApiInvoice(inv: Record<string, unknown>): Invoice {
  return {
    id: inv.id as string,
    client: inv.client as string,
    amount: (inv.total as number) ?? 0,
    // Store as ISO strings for correct roundtrip editing
    sentOn: inv.issuedAt ? (inv.issuedAt as string) : new Date().toISOString(),
    expires: inv.dueDate ? (inv.dueDate as string) : '',
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
  const [editMode, setEditMode] = useState<'view' | 'edit'>('edit');
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
    setEditMode('edit');
    setIsModalOpen(true);
  };

  const openEdit = (inv: Invoice, mode: 'view' | 'edit' = 'edit') => {
    setEditingInvoice(inv);
    setIsNewInvoice(false);
    setEditMode(mode);
    setIsModalOpen(true);
  };

  const handleSaveInvoice = async (savedInvoice: Invoice) => {
    const payload = {
      client: savedInvoice.client,
      contact: savedInvoice.contact || undefined,
      email: savedInvoice.email || undefined,
      phone: savedInvoice.phone || undefined,
      scope: savedInvoice.scope || undefined,
      lineItems: savedInvoice.lineItems ?? [],
      gstRate: savedInvoice.gstRate ?? 18,
      discountRate: savedInvoice.discountRate ?? 0,
      currency: savedInvoice.currency ?? '₹',
      terms: savedInvoice.terms || undefined,
      delivery: savedInvoice.delivery || undefined,
      notes: savedInvoice.notes || undefined,
      total: savedInvoice.amount,
      // Only valid invoice statuses: Draft, Sent, Paid, Overdue, Void
      status: (['Draft','Sent','Paid','Overdue','Void'] as const).includes(savedInvoice.status as 'Draft'|'Sent'|'Paid'|'Overdue'|'Void')
        ? savedInvoice.status
        : 'Draft',
      issuedAt: toISO(savedInvoice.sentOn),
      dueDate: savedInvoice.expires ? toISO(savedInvoice.expires) : undefined,
    };

    const url = isNewInvoice ? '/api/invoices' : `/api/invoices/${editingInvoice!.id}`;
    const method = isNewInvoice ? 'POST' : 'PUT';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setIsModalOpen(false);
      fetchInvoices();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(`Save failed: ${err?.error || res.statusText}`);
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
      <div className="card table-wrap" style={{ padding: 0, overflow: 'visible' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading invoices...</div>
        ) : (
          <table style={{ overflow: 'visible' }}>
            <thead>
              <tr>
                <th>Invoice #</th><th>Client</th><th>Amount</th><th>Issued</th><th>Due</th><th>Status</th><th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => openEdit(inv, 'view')}>
                  <td><span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 11 }}>{inv.id.slice(0, 8)}</span></td>
                  <td style={{ fontWeight: 500 }}>{inv.client}</td>
                  <td style={{ fontWeight: 700, color: 'var(--emerald-light)', fontVariantNumeric: 'tabular-nums' }}>{inv.currency || '₹'}{inv.amount.toLocaleString('en-IN')}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{fmtDisplayDate(inv.sentOn)}</td>
                  <td style={{ color: inv.status === 'Overdue' ? 'var(--rose-light)' : 'var(--text-secondary)', fontWeight: inv.status === 'Overdue' ? 600 : 400 }}>{fmtDisplayDate(inv.expires)}</td>
                  <td><span className={STATUS_BADGE[inv.status]}>{inv.status}</span></td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', display: 'inline-block', zIndex: 1 }} onClick={e => e.stopPropagation()}>
                      <button 
                        className="btn btn-ghost" 
                        style={{ padding: '6px 14px', borderRadius: '12px', background: '#EADDFF', color: '#65558F', fontSize: '16px', fontWeight: 900, lineHeight: 1, letterSpacing: '1px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const parent = e.currentTarget.parentElement as HTMLElement;
                          const el = e.currentTarget.nextElementSibling as HTMLElement;
                          
                          document.querySelectorAll('.action-dropdown').forEach(dropdown => {
                            if (dropdown !== el) {
                              (dropdown as HTMLElement).style.display = 'none';
                              (dropdown.parentElement as HTMLElement).style.zIndex = '1';
                            }
                          });

                          if (el) {
                            const isOpening = el.style.display === 'none' || el.style.display === '';
                            el.style.display = isOpening ? 'block' : 'none';
                            parent.style.zIndex = isOpening ? '50' : '1';
                          }
                        }}
                      >
                        ...
                      </button>
                      <div className="action-dropdown" style={{ display: 'none', position: 'absolute', right: 0, top: 'calc(100% + 4px)', zIndex: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', minWidth: 140, padding: '4px' }}>
                        <button className="btn btn-ghost" style={{ width: '100%', textAlign: 'center', padding: '10px 16px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', background: 'transparent', borderBottom: '1px solid var(--border)', borderRadius: '8px 8px 0 0' }} onClick={() => { (document.activeElement as HTMLElement)?.blur(); openEdit(inv, 'view'); }}>
                          View
                        </button>
                        <button className="btn btn-ghost" style={{ width: '100%', textAlign: 'center', padding: '10px 16px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', background: 'transparent', borderBottom: '1px solid var(--border)', borderRadius: 0 }} onClick={() => { (document.activeElement as HTMLElement)?.blur(); openEdit(inv, 'edit'); }}>
                          Edit
                        </button>
                        {(inv.status === 'Sent' || inv.status === 'Overdue') && (
                          <button className="btn btn-ghost" style={{ width: '100%', textAlign: 'center', padding: '10px 16px', fontSize: 14, fontWeight: 600, color: 'var(--blue)', background: 'transparent', borderBottom: '1px solid var(--border)', borderRadius: 0 }} onClick={() => { (document.activeElement as HTMLElement)?.blur(); alert('Remind functionality to be implemented'); }}>
                            Remind
                          </button>
                        )}
                        {inv.status === 'Paid' && (
                          <button className="btn btn-ghost" style={{ width: '100%', textAlign: 'center', padding: '10px 16px', fontSize: 14, fontWeight: 600, color: 'var(--emerald)', background: 'transparent', borderBottom: '1px solid var(--border)', borderRadius: 0 }} onClick={() => { (document.activeElement as HTMLElement)?.blur(); alert('PDF download to be implemented'); }}>
                            PDF
                          </button>
                        )}
                        <button className="btn btn-ghost" style={{ width: '100%', textAlign: 'center', padding: '10px 16px', fontSize: 14, fontWeight: 600, color: 'var(--rose)', background: 'transparent', borderRadius: '0 0 8px 8px' }} onClick={() => { (document.activeElement as HTMLElement)?.blur(); handleDelete(inv.id); }}>
                          Delete
                        </button>
                      </div>
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
          mode={editMode}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveInvoice}
          onDelete={editingInvoice && !isNewInvoice ? () => handleDelete(editingInvoice.id) : undefined}
          docType="Invoice"
          actionLabel="Save Invoice"
        />
      )}
    </div>
  );
}
