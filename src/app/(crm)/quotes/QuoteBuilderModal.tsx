import React, { useState, useEffect } from 'react';
import { TEMPLATE_RENDERERS } from '@/components/quotes/templates';
import { QUOTE_TEMPLATES } from '@/config/quoteTemplates';
import './QuoteBuilder.css';

export type LineItem = {
  id: number;
  desc: string;
  qty: number;
  price: number;
};

export type Quote = {
  id: string;
  client: string;
  amount: number;
  sentOn: string;
  expires: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Expired' | 'Invoiced' | 'Paid' | 'Overdue' | 'Rejected';
  contact?: string;
  email?: string;
  phone?: string;
  scope?: string;
  templateId?: string;
  lineItems?: LineItem[];
  gstRate?: number;
  discountRate?: number;
  notes?: string;
  terms?: string;
  delivery?: string;
  currency?: string;
};

interface Props {
  initialQuote?: Quote | null;
  initialTemplate?: string;
  onClose: () => void;
  onSave: (quote: Quote) => void;
  docType?: 'Quote' | 'Invoice';
  actionLabel?: string;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (s: string) => {
  if (!s) return '—';
  const parts = s.split('-');
  if (parts.length !== 3) return s;
  const [y, m, d] = parts;
  return `${months[+m - 1]} ${+d}, ${y}`;
};
const iso = (d: Date) => d.toISOString().split('T')[0];

const defaultNotes = "Prices are valid until the expiry date. Any work outside the agreed scope will be quoted separately and requires written approval before proceeding.";

export default function QuoteBuilderModal({ initialQuote, initialTemplate, onClose, onSave, docType = 'Quote', actionLabel = 'Save Quote' }: Props) {
  const today = new Date();
  const exp30 = new Date(today); exp30.setDate(exp30.getDate() + 30);

  const [qid, setQid] = useState(initialQuote?.id || `#QT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [status, setStatus] = useState<Quote['status']>(initialQuote?.status || 'Draft');

  // Try to parse existing sentOn/expires if they are in 'MMM D, YYYY' format back to YYYY-MM-DD
  // For simplicity, just set today if missing
  const [issued, setIssued] = useState(iso(today));
  const [expires, setExpires] = useState(iso(exp30));

  const [template, setTemplate] = useState(initialQuote?.templateId || initialTemplate || 'modern');

  const [currency, setCurrency] = useState(initialQuote?.currency || '₹');
  const [company, setCompany] = useState(initialQuote?.client || '');
  const [contact, setContact] = useState(initialQuote?.contact || '');
  const [email, setEmail] = useState(initialQuote?.email || '');
  const [phone, setPhone] = useState(initialQuote?.phone || '');
  const [scope, setScope] = useState(initialQuote?.scope || '');

  const [items, setItems] = useState<LineItem[]>(initialQuote?.lineItems || [
    { id: 1, desc: 'Brand Identity Design', qty: 1, price: 18000 },
    { id: 2, desc: 'Website Development (5 pages)', qty: 1, price: 32000 }
  ]);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);

  const [cgstRate, setCgstRate] = useState((initialQuote?.gstRate ?? 18) / 2);
  const [sgstRate, setSgstRate] = useState((initialQuote?.gstRate ?? 18) / 2);
  const [discountRate, setDiscountRate] = useState(initialQuote?.discountRate ?? 0);
  const [terms, setTerms] = useState(initialQuote?.terms || '50% advance, 50% on delivery');
  const [delivery, setDelivery] = useState(initialQuote?.delivery || '');
  const [notes, setNotes] = useState(initialQuote?.notes || defaultNotes);

  // Esc key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // When opening as an invoice, update the ID to INV prefix if it's currently QT
  useEffect(() => {
    if (docType === 'Invoice' && qid.startsWith('#Q')) {
      setQid(qid.replace('#Q', '#INV').replace('#QT', '#INV'));
    }
  }, [docType, qid]);

  const addItem = () => {
    const id = Date.now();
    setItems([...items, { id, desc: '', qty: 1, price: 0 }]);
    setActiveItemId(id);
  };

  const removeItem = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setItems(items.filter(i => i.id !== id));
    if (activeItemId === id) setActiveItemId(null);
  };

  const updateItem = (id: number, field: keyof LineItem, val: string | number) => {
    setItems(items.map(it => it.id === id ? { ...it, [field]: field === 'desc' ? val : (Number(val) || 0) } : it));
  };

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const discountAmt = subtotal * (discountRate / 100);
  const cgstAmt = (subtotal - discountAmt) * (cgstRate / 100);
  const sgstAmt = (subtotal - discountAmt) * (sgstRate / 100);
  const total = subtotal - discountAmt + cgstAmt + sgstAmt;

  const handleSave = () => {
    onSave({
      id: qid,
      client: company || 'Untitled Client',
      amount: total,
      sentOn: issued ? fmtDate(issued) : fmtDate(iso(today)),
      expires: expires ? fmtDate(expires) : fmtDate(iso(exp30)),
      status,
      contact,
      email,
      phone,
      scope,
      templateId: template,
      lineItems: items,
      gstRate: cgstRate + sgstRate,
      discountRate,
      notes,
      terms,
      delivery,
      currency
    });
  };

  const getStatusClass = (s: string) => {
    switch (s) {
      case 'Draft': return 'sp-draft';
      case 'Sent': return 'sp-sent';
      case 'Accepted': return 'sp-accepted';
      case 'Expired': return 'sp-expired';
      case 'Rejected': return 'sp-expired';
      case 'Invoiced': return 'sp-sent';
      case 'Paid': return 'sp-accepted';
      case 'Overdue': return 'sp-expired';
      default: return 'sp-draft';
    }
  };

  // Prevent closing when clicking inside modal content
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="quote-builder-wrapper">
      <div className="overlay" onClick={handleOverlayClick}>
        <div className="editor">

          <div className="editor-bar">
            <div className="editor-bar-l">
              <div className="e-logo">tagverse<span>.io</span></div>
              <div className="e-sep"></div>
              <div className="e-chip">{qid}</div>
              <div className="e-status-dot"></div>
              <div className="e-label">{status} — editing</div>
            </div>
            <div className="editor-bar-r">
              <button className="btn-close" onClick={onClose}>Close</button>
              <button className="btn-export" onClick={handleSave}>
                {actionLabel}
              </button>
            </div>
          </div>

          <div className="editor-body">

            <div className="panel">
              <div className="ps">
                <div className="ps-title">Document</div>
                <div className="pf">
                  <label>Template</label>
                  <select className="pi" value={template} onChange={e => setTemplate(e.target.value)}>
                    {QUOTE_TEMPLATES.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="pr">
                  <div className="pf">
                    <label>{docType} ID</label>
                    <input className="pi" value={qid} onChange={e => setQid(e.target.value)} />
                  </div>
                  {docType === 'Quote' ? (
                    <div className="pf">
                      <label>Status</label>
                      <select className="pi" value={status} onChange={e => setStatus(e.target.value as any)}>
                        <option>Draft</option><option>Sent</option><option>Accepted</option><option>Expired</option><option>Rejected</option>
                      </select>
                    </div>
                  ) : (
                    <div className="pf">
                      <label>Status</label>
                      <select className="pi" value={status} onChange={e => setStatus(e.target.value as any)}>
                        <option>Draft</option><option>Sent</option><option>Paid</option><option>Overdue</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="pr">
                  <div className="pf"><label>Issued</label><input className="pi" type="date" value={issued} onChange={e => setIssued(e.target.value)} /></div>
                  <div className="pf"><label>{docType === 'Invoice' ? 'Due Date' : 'Expires'}</label><input className="pi" type="date" value={expires} onChange={e => setExpires(e.target.value)} /></div>
                </div>
                <div className="pf">
                  <label>Currency</label>
                  <select className="pi" value={currency} onChange={e => setCurrency(e.target.value)}>
                    <option value="₹">₹ Indian Rupee (INR)</option>
                    <option value="$">$ US Dollar (USD)</option>
                    <option value="€">€ Euro (EUR)</option>
                  </select>
                </div>
              </div>

              <div className="ps">
                <div className="ps-title">Client</div>
                <div className="pf"><label>Company</label><input className="pi" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Arka Systems Pvt Ltd" /></div>
                <div className="pf"><label>Contact Person</label><input className="pi" value={contact} onChange={e => setContact(e.target.value)} placeholder="e.g. Rajesh Kumar" /></div>
                <div className="pf"><label>Email</label><input className="pi" value={email} onChange={e => setEmail(e.target.value)} placeholder="client@company.com" /></div>
                <div className="pf"><label>Phone</label><input className="pi" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" /></div>
                <div className="pf"><label>Project / Scope Title</label><input className="pi" value={scope} onChange={e => setScope(e.target.value)} placeholder="e.g. Brand Identity + Website" /></div>
              </div>

              <div className="ps">
                <div className="ps-title">Line Items</div>
                <div>
                  {items.map(it => (
                    it.id === activeItemId ? (
                      <div className="ie" key={it.id}>
                        <div className="ie-hd">
                          <span>Edit Item</span>
                          <button className="im-del" onClick={(e) => removeItem(it.id, e)}>✕</button>
                        </div>
                        <div className="pf" style={{ marginBottom: 6 }}>
                          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--brand)', display: 'block', marginBottom: 3 }}>Description</label>
                          <input
                            value={it.desc}
                            placeholder="e.g. Logo Design, Landing Page…"
                            onChange={e => updateItem(it.id, 'desc', e.target.value)}
                            style={{ width: '100%', border: '1px solid rgba(74,63,212,.25)', borderRadius: 6, padding: '7px 9px', fontSize: 12, fontFamily: "'DM Sans',sans-serif", color: 'var(--ink)', background: 'var(--white)', outline: 'none', WebkitAppearance: 'none' }}
                          />
                        </div>
                        <div className="ie-grid">
                          <div className="ie-field"><label>Qty</label><input type="number" value={it.qty} min="1" onChange={e => updateItem(it.id, 'qty', e.target.value)} /></div>
                          <div className="ie-field"><label>Unit Price</label><input type="number" value={it.price} min="0" onChange={e => updateItem(it.id, 'price', e.target.value)} /></div>
                        </div>
                      </div>
                    ) : (
                      <div className="im" key={it.id} onClick={() => setActiveItemId(it.id)}>
                        <div className="im-name">{it.desc || 'Untitled item'}</div>
                        <div className="im-meta">{it.qty} × {currency}{it.price.toLocaleString('en-IN')} = <b>{currency}{(it.qty * it.price).toLocaleString('en-IN')}</b></div>
                        <button className="im-del" onClick={(e) => removeItem(it.id, e)}>✕</button>
                      </div>
                    )
                  ))}
                </div>
                <button className="add-line" onClick={addItem}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                  Add service or product
                </button>
              </div>

              <div className="ps">
                <div className="ps-title">Pricing</div>
                <div className="tot-row">
                  <span>CGST</span>
                  <select value={cgstRate} onChange={e => setCgstRate(Number(e.target.value))}>
                    <option value="0">None (0%)</option><option value="2.5">2.5%</option><option value="6">6%</option><option value="9">9%</option><option value="14">14%</option>
                  </select>
                </div>
                <div className="tot-row">
                  <span>SGST</span>
                  <select value={sgstRate} onChange={e => setSgstRate(Number(e.target.value))}>
                    <option value="0">None (0%)</option><option value="2.5">2.5%</option><option value="6">6%</option><option value="9">9%</option><option value="14">14%</option>
                  </select>
                </div>
                <div className="tot-row">
                  <span>Discount</span>
                  <span><input type="number" value={discountRate} min="0" max="100" style={{ width: 46, textAlign: 'center' }} onChange={e => setDiscountRate(Number(e.target.value))} /> %</span>
                </div>
                <div className="tot-row tot-grand"><span>Total</span><span>{currency}{Math.round(total).toLocaleString('en-IN')}</span></div>
              </div>

              <div className="ps">
                <div className="ps-title">Terms & Notes</div>
                <div className="pf">
                  <label>Payment Terms</label>
                  <select className="pi" value={terms} onChange={e => setTerms(e.target.value)}>
                    <option>50% advance, 50% on delivery</option>
                    <option>100% advance</option>
                    <option>Net 15 days</option>
                    <option>Net 30 days</option>
                    <option>Due on receipt</option>
                  </select>
                </div>
                <div className="pf"><label>Delivery Timeline</label><input className="pi" value={delivery} onChange={e => setDelivery(e.target.value)} placeholder="e.g. 4–6 weeks" /></div>
                <div className="pf">
                  <label>Notes</label>
                  <textarea className="pi" value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </div>

            </div>

            <div className="preview">
              {(() => {
                const Renderer = TEMPLATE_RENDERERS[template] || TEMPLATE_RENDERERS['modern'];
                return (
                  <Renderer
                    quoteId={qid}
                    docType={docType}
                    issued={issued}
                    expires={expires}
                    company={company}
                    contact={contact}
                    email={email}
                    phone={phone}
                    scope={scope}
                    items={items}
                    currency={currency}
                    subtotal={subtotal}
                    discountRate={discountRate}
                    discountAmt={discountAmt}
                    cgstRate={cgstRate}
                    cgstAmt={cgstAmt}
                    sgstRate={sgstRate}
                    sgstAmt={sgstAmt}
                    total={total}
                    notes={notes}
                    terms={terms}
                    delivery={delivery}
                    fmtDate={fmtDate}
                  />
                );
              })()}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
