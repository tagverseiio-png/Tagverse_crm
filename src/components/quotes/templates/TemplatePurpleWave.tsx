import React from 'react';
import { TemplateRendererProps } from './types';

export default function TemplatePurpleWave(props: TemplateRendererProps) {
  const { docType, quoteId, issued, expires, company, contact, email, phone, scope, items, currency, subtotal, discountRate, discountAmt, cgstRate, cgstAmt, sgstRate, sgstAmt, total, notes, terms, delivery, fmtDate } = props;

  const isInvoice = docType === 'Invoice';

  return (
    <div className="tpl-purple-wave" style={{
      position: 'relative',
      background: '#fff',
      color: '#333',
      fontFamily: "'Inter', sans-serif",
      paddingBottom: '60px',
      width: '100%',
      maxWidth: '700px',
      margin: '0 auto',
      boxShadow: '0 2px 4px rgba(0,0,0,.06), 0 8px 32px rgba(0,0,0,.16)'
    }}>
      <style>{`
        .tpl-purple-wave {
          display: flex;
          flex-direction: column;
        }
        .pw-header {
          position: relative;
          background: #fff;
          overflow: hidden;
          min-height: 140px;
        }
        .pw-header-wave {
          position: absolute;
          top: -30px;
          right: -40px;
          width: 70%;
          padding-top: 55%;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          z-index: 1;
        }
        .pw-header-content {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 24px 28px;
          gap: 12px;
        }
        .pw-brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
          font-weight: 800;
          color: #111;
          letter-spacing: -0.5px;
        }
        .pw-brand-logo span {
          color: #7c3aed;
        }
        .pw-doc-box {
          background: #8b5cf6;
          color: #fff;
          padding: 12px 16px;
          border-radius: 10px;
          width: 200px;
          flex-shrink: 0;
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.2);
        }
        .pw-doc-title {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
          text-align: center;
        }
        .pw-doc-meta {
          font-size: 11px;
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 4px;
        }
        .pw-contact-bar {
          background: #6d28d9;
          color: #fff;
          padding: 8px 20px;
          display: flex;
          gap: 24px;
          font-size: 12px;
          align-items: center;
        }
        /* ── Parties grid (Bill To / Prepared By / Payment Info) ── */
        .pw-parties {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 20px 20px;
        }
        .pw-party-box {
          background: #f3f4f6;
          padding: 16px 20px;
          border-radius: 8px;
          border-left: 4px solid #7c3aed;
        }
        .pw-party-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #7c3aed;
          margin-bottom: 6px;
        }
        .pw-party-name {
          font-size: 15px;
          font-weight: 700;
          color: #111;
          margin-bottom: 4px;
        }
        .pw-party-detail {
          font-size: 11px;
          color: #6b7280;
          line-height: 1.6;
        }
        .pw-payment-box {
          background: #f3f4f6;
          padding: 16px 20px;
          border-radius: 8px;
          border-left: 4px solid #4f46e5;
        }
        .pw-payment-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #6b7280;
          padding: 2px 0;
        }
        .pw-payment-row span:first-child {
          font-weight: 600;
          color: #374151;
        }
        /* ── Scope bar ── */
        .pw-scope-bar {
          margin: 0 20px 16px;
          background: #ede9fe;
          border-radius: 6px;
          padding: 8px 14px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pw-scope-label {
          font-weight: 700;
          color: #7c3aed;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 1px;
        }
        /* ── Table ── */
        .pw-table-wrap {
          margin: 0 20px 24px;
        }
        .pw-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        .pw-table th {
          background: #7c3aed;
          color: #fff;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }
        .pw-table th:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
        .pw-table th:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; text-align: right; }
        .pw-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .pw-table td:last-child {
          text-align: right;
          font-weight: 600;
        }
        /* ── Totals ── */
        .pw-summary {
          margin: 0 20px;
          display: flex;
          justify-content: flex-end;
        }
        .pw-totals {
          width: 260px;
          background: #f9fafb;
          border-radius: 8px;
          padding: 14px;
        }
        .pw-tot-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 13px;
          color: #4b5563;
        }
        .pw-tot-grand {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          background: linear-gradient(90deg, #8b5cf6, #6d28d9);
          color: white;
          font-weight: 700;
          font-size: 16px;
          border-radius: 6px;
          margin-top: 8px;
        }
        /* ── Terms ── */
        .pw-terms {
          margin: 24px 20px;
          font-size: 11px;
          color: #4b5563;
        }
        .pw-terms h4 {
          color: #6d28d9;
          font-size: 13px;
          margin-bottom: 8px;
        }
        /* ── Signature (Invoice only) ── */
        .pw-sig-section {
          margin: 16px 20px 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
        .pw-sig-block {
          border-top: 2px solid #d1d5db;
          padding-top: 10px;
        }
        .pw-sig-label {
          font-size: 11px;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 4px;
        }
        .pw-sig-sub {
          font-size: 10px;
          color: #9ca3af;
        }
        /* ── Footer ── */
        .pw-footer-note {
          margin: 16px 20px 8px;
          font-size: 10px;
          color: #9ca3af;
          text-align: center;
          font-style: italic;
        }
        .pw-footer-wave {
          position: relative;
          left: -20px;
          width: calc(100% + 40px);
          height: 80px;
          background: linear-gradient(135deg, #c4b5fd, #8b5cf6);
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
          z-index: 0;
          opacity: 0.25;
          margin-top: 20px;
          flex-shrink: 0;
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="pw-header">
        <div className="pw-header-wave"></div>
        <div className="pw-header-content">
          <div className="pw-brand-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <div>tagverse<span>.io</span></div>
          </div>
          <div className="pw-doc-box">
            <div className="pw-doc-title">{isInvoice ? 'Invoice' : 'Quotation'}</div>
            <div className="pw-doc-meta">
              <span>{isInvoice ? 'Invoice No:' : 'Quote No:'}</span>
              <span>{quoteId}</span>
              <span>Date Issued:</span>
              <span>{fmtDate(issued)}</span>
              <span>{isInvoice ? 'Due Date:' : 'Valid Until:'}</span>
              <span>{fmtDate(expires)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTACT BAR ── */}
      <div className="pw-contact-bar">
        <div>📞 contact@tagverse.io</div>
        <div>🌐 www.tagverse.io</div>
      </div>

      {/* ── PARTIES ── */}
      <div className="pw-parties">
        {/* Bill To / Quote For */}
        <div className="pw-party-box">
          <div className="pw-party-label">{isInvoice ? 'Bill To' : 'Quote For'}</div>
          <div className="pw-party-name">{company || 'Client Company'}</div>
          <div className="pw-party-detail">
            {contact && <>{contact}<br /></>}
            {email && <>{email}<br /></>}
            {phone && <>{phone}<br /></>}
          </div>
        </div>

        {/* Invoice: Payment Info | Quote: Prepared By */}
        {isInvoice ? (
          <div className="pw-payment-box">
            <div className="pw-party-label" style={{ color: '#4f46e5' }}>Payment Info</div>
            <div className="pw-party-name" style={{ color: '#4f46e5', fontSize: 13 }}>tagverse.io</div>
            <div className="pw-payment-row" style={{ marginTop: 8 }}>
              <span>Account No</span><span>: 000 111 222 333</span>
            </div>
            <div className="pw-payment-row">
              <span>A/c Name</span><span>: tagverse.io</span>
            </div>
            <div className="pw-payment-row">
              <span>Bank</span><span>: HDFC Bank</span>
            </div>
            <div className="pw-payment-row" style={{ marginTop: 6 }}>
              <span>Due Date</span><span>: {fmtDate(expires)}</span>
            </div>
          </div>
        ) : (
          <div className="pw-party-box" style={{ borderLeftColor: '#4f46e5' }}>
            <div className="pw-party-label" style={{ color: '#4f46e5' }}>Prepared By</div>
            <div className="pw-party-name" style={{ color: '#4f46e5' }}>tagverse.io</div>
            <div className="pw-party-detail">
              Digital Growth Partner<br />
              contact@tagverse.io<br />
              www.tagverse.io
            </div>
          </div>
        )}
      </div>

      {/* ── SCOPE ── */}
      {scope && (
        <div className="pw-scope-bar">
          <span className="pw-scope-label">{isInvoice ? 'Description' : 'Scope'}</span>
          <span>{scope}</span>
        </div>
      )}

      {/* ── LINE ITEMS TABLE ── */}
      <div className="pw-table-wrap">
        <table className="pw-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Description</th>
              <th style={{ textAlign: 'center' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>{isInvoice ? 'Unit Price' : 'Price'}</th>
              <th>{isInvoice ? 'Amount' : 'Total'}</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20, color: '#9ca3af' }}>Add line items...</td></tr>
            ) : items.map((it, idx) => (
              <tr key={it.id}>
                <td style={{ width: 40 }}>{(idx + 1).toString().padStart(2, '0')}</td>
                <td>{it.desc || 'Untitled'}</td>
                <td style={{ textAlign: 'center' }}>{it.qty}</td>
                <td style={{ textAlign: 'right' }}>{currency}{it.price.toLocaleString('en-IN')}</td>
                <td>{currency}{(it.qty * it.price).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── TOTALS ── */}
      <div className="pw-summary">
        <div className="pw-totals">
          <div className="pw-tot-row">
            <span>Subtotal</span>
            <span>{currency}{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {discountRate > 0 && (
            <div className="pw-tot-row">
              <span>Discount ({discountRate}%)</span>
              <span>-{currency}{Math.round(discountAmt).toLocaleString('en-IN')}</span>
            </div>
          )}
          {cgstRate > 0 && (
            <div className="pw-tot-row">
              <span>CGST ({cgstRate}%)</span>
              <span>{currency}{Math.round(cgstAmt).toLocaleString('en-IN')}</span>
            </div>
          )}
          {sgstRate > 0 && (
            <div className="pw-tot-row">
              <span>SGST ({sgstRate}%)</span>
              <span>{currency}{Math.round(sgstAmt).toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="pw-tot-grand">
            <span>{isInvoice ? 'Amount Due' : 'Total'}</span>
            <span>{currency}{Math.round(total).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* ── TERMS ── */}
      <div className="pw-terms">
        <h4>{isInvoice ? 'Invoice Notes & Terms' : 'Terms & Conditions'}</h4>
        <div style={{ whiteSpace: 'pre-wrap', marginBottom: 12 }}>{notes}</div>
        <div>• <strong>Payment:</strong> {terms}</div>
        <div>• <strong>Delivery:</strong> {delivery || 'As agreed'}</div>
        {!isInvoice && (
          <div style={{ marginTop: 8, color: '#9ca3af', fontStyle: 'italic' }}>
            This quotation is valid until {fmtDate(expires)}. Prices are subject to change after expiry.
          </div>
        )}
      </div>

      {/* ── SIGNATURE — Invoice only ── */}
      {isInvoice && (
        <div className="pw-sig-section">
          <div className="pw-sig-block">
            <div className="pw-sig-label">Authorised by — tagverse.io</div>
            <div className="pw-sig-sub">Signature &amp; Date</div>
          </div>
          <div className="pw-sig-block">
            <div className="pw-sig-label">Accepted by — Client</div>
            <div className="pw-sig-sub">Signature &amp; Date</div>
          </div>
        </div>
      )}

      {/* ── FOOTER NOTE ── */}
      <div className="pw-footer-note">
        This {isInvoice ? 'invoice' : 'quotation'} is confidential and intended solely for the named recipient.
      </div>

      <div className="pw-footer-wave"></div>
    </div>
  );
}
