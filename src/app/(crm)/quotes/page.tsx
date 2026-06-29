'use client';
import { useState, useMemo } from 'react';
import QuoteBuilderModal, { Quote } from './QuoteBuilderModal';

import { quotesInitial } from '@/lib/mockData';

const INITIAL_QUOTES: Quote[] = quotesInitial as Quote[];

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
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

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
    setEditingQuote(null);
    setIsModalOpen(true);
  };
  
  const openEdit = (q: Quote) => {
    setEditingQuote(q);
    setIsModalOpen(true);
  };
  
  const handleSaveQuote = (savedQuote: Quote) => {
    if (editingQuote) {
      setQuotes(p => p.map(q => q.id === savedQuote.id ? savedQuote : q));
    } else {
      setQuotes(p => [savedQuote, ...p]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => { setQuotes(p => p.filter(q => q.id !== id)); setIsModalOpen(false); };

  const openInvoice = (q: Quote) => {
    setEditingQuote(q);
    setIsInvoiceModalOpen(true);
  };

  const handleCreateInvoice = (savedQuote: Quote) => {
    // The savedQuote might have an #INV- prefix now instead of #Q- 
    // We try matching by replacing prefixes if necessary
    setQuotes(p => p.map(q => 
      (q.id === savedQuote.id || q.id.replace('#Q', '#INV').replace('#QT', '#INV') === savedQuote.id) 
        ? { ...savedQuote, status: 'Invoiced' } 
        : q
    ));
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
