'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import QuoteBuilderModal, { Quote } from './QuoteBuilderModal';

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

function parseDisplayDate(s: string): string {
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function mapApiQuote(q: Record<string, unknown>): Quote {
  return {
    id: q.id as string,
    client: q.client as string,
    amount: (q.total as number) ?? 0,
    sentOn: q.issuedAt ? new Date(q.issuedAt as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    expires: q.expiresAt ? new Date(q.expiresAt as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    status: q.status as Quote['status'],
    contact: (q.contact as string) ?? undefined,
    email: (q.email as string) ?? undefined,
    phone: (q.phone as string) ?? undefined,
    scope: (q.scope as string) ?? undefined,
    lineItems: (q.lineItems as Quote['lineItems']) ?? [],
    gstRate: (q.gstRate as number) ?? 18,
    discountRate: (q.discountRate as number) ?? 0,
    notes: (q.notes as string) ?? undefined,
    terms: (q.terms as string) ?? undefined,
    delivery: (q.delivery as string) ?? undefined,
    currency: (q.currency as string) ?? '₹',
  };
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '200' });
      if (search) params.set('search', search);
      if (filterStatus !== 'All') params.set('status', filterStatus);
      const res = await fetch(`/api/quotes?${params}`);
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) setQuotes(json.data.map(mapApiQuote));
    } catch {
      // keep current state
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  const filtered = useMemo(() => quotes, [quotes]);

  const totalValue = quotes.filter(q => q.status === 'Accepted' || q.status === 'Sent').reduce((a, q) => a + q.amount, 0);
  const accepted = quotes.filter(q => q.status === 'Accepted').length;
  const pending = quotes.filter(q => q.status === 'Sent').length;

  const openNew = () => {
    setEditingQuote(null);
    setIsModalOpen(true);
  };

  const openEdit = (q: Quote) => {
    setEditingQuote(q);
    setIsModalOpen(true);
  };

  const handleSaveQuote = async (savedQuote: Quote) => {
    const payload = {
      client: savedQuote.client,
      contact: savedQuote.contact,
      email: savedQuote.email,
      phone: savedQuote.phone,
      scope: savedQuote.scope,
      lineItems: savedQuote.lineItems ?? [],
      gstRate: savedQuote.gstRate ?? 18,
      discountRate: savedQuote.discountRate ?? 0,
      currency: savedQuote.currency ?? '₹',
      terms: savedQuote.terms,
      delivery: savedQuote.delivery,
      notes: savedQuote.notes,
      total: savedQuote.amount,
      status: savedQuote.status,
      issuedAt: parseDisplayDate(savedQuote.sentOn),
      expiresAt: parseDisplayDate(savedQuote.expires),
    };

    const isExisting = editingQuote && quotes.some(q => q.id === editingQuote.id);
    const url = isExisting ? `/api/quotes/${editingQuote!.id}` : '/api/quotes';
    const method = isExisting ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setIsModalOpen(false);
      fetchQuotes();
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
    setIsModalOpen(false);
    fetchQuotes();
  };

  const openInvoice = (q: Quote) => {
    setEditingQuote(q);
    setIsInvoiceModalOpen(true);
  };

  const handleCreateInvoice = async (savedQuote: Quote) => {
    if (!editingQuote) return;
    const payload = {
      quoteId: editingQuote.id,
      client: savedQuote.client,
      contact: savedQuote.contact,
      email: savedQuote.email,
      phone: savedQuote.phone,
      scope: savedQuote.scope,
      lineItems: savedQuote.lineItems ?? [],
      gstRate: savedQuote.gstRate ?? 18,
      discountRate: savedQuote.discountRate ?? 0,
      currency: savedQuote.currency ?? '₹',
      terms: savedQuote.terms,
      delivery: savedQuote.delivery,
      notes: savedQuote.notes,
      total: savedQuote.amount,
      status: savedQuote.status === 'Paid' || savedQuote.status === 'Overdue' ? savedQuote.status : 'Sent',
      issuedAt: parseDisplayDate(savedQuote.sentOn),
      dueDate: parseDisplayDate(savedQuote.expires),
    };
    const res = await fetch('/api/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setIsInvoiceModalOpen(false);
      fetchQuotes();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-file-description" style={{ color: 'var(--blue)', fontSize: 24 }}></i> Quotation
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
          { label: 'Total Sent', value: String(quotes.length), delta: 'All quotes', color: 'blue' },
          { label: 'Pending Approval', value: String(pending), delta: 'Awaiting response', color: 'amber' },
          { label: 'Accepted', value: String(accepted), delta: `${Math.round((accepted / Math.max(1, quotes.length)) * 100)}% rate`, color: 'emerald' },
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
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading quotes...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Quote #</th><th>Client</th><th>Amount</th><th>Sent On</th><th>Expires</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id} style={{ cursor: 'pointer' }} onClick={() => openEdit(q)}>
                  <td><span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 11 }}>{q.id.slice(0, 8)}</span></td>
                  <td style={{ fontWeight: 500 }}>{q.client}</td>
                  <td style={{ fontWeight: 700, color: 'var(--emerald-light)', fontVariantNumeric: 'tabular-nums' }}>{q.currency || '₹'}{q.amount.toLocaleString('en-IN')}</td>
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
                      <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }} style={{ padding: '4px 10px', fontSize: 12, color: 'var(--rose)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No quotes match your filters.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Advanced Quote Builder Modal */}
      {isModalOpen && (
        <QuoteBuilderModal
          initialQuote={editingQuote}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveQuote}
        />
      )}

      {/* Invoice Modal using the same builder */}
      {isInvoiceModalOpen && (
        <QuoteBuilderModal
          initialQuote={editingQuote}
          onClose={() => setIsInvoiceModalOpen(false)}
          onSave={handleCreateInvoice}
          docType="Invoice"
          actionLabel="Move to Invoice"
        />
      )}
    </div>
  );
}
