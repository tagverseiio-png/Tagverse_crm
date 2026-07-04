import React from 'react';
import { TemplateRendererProps } from './types';

export default function TemplatePurpleWave(props: TemplateRendererProps) {
  const { docType, quoteId, issued, expires, company, contact, email, phone, scope, items, currency, subtotal, discountRate, discountAmt, cgstRate, cgstAmt, sgstRate, sgstAmt, total, notes, terms, delivery, fmtDate } = props;

  return (
    <div className="tpl-purple-wave" style={{
      position: 'relative',
      background: '#fff',
      color: '#333',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
      minHeight: '100%',
      paddingBottom: '60px'
    }}>
      <style>{`
        .tpl-purple-wave {
          display: flex;
          flex-direction: column;
        }
        .pw-header {
          position: relative;
          height: 180px;
          background: #fff;
          overflow: hidden;
        }
        .pw-header-wave {
          position: absolute;
          top: -50px;
          right: -50px;
          width: 600px;
          height: 300px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          z-index: 1;
        }
        .pw-header-content {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          padding: 40px;
        }
        .pw-brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 28px;
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
          padding: 16px 24px;
          border-radius: 12px;
          width: 240px;
          box-shadow: 0 10px 25px rgba(124, 58, 237, 0.2);
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
          padding: 8px 40px;
          display: flex;
          gap: 24px;
          font-size: 12px;
          align-items: center;
        }
        .pw-client-box {
          background: #f3f4f6;
          margin: 30px 40px;
          padding: 16px 20px;
          border-radius: 8px;
          border-left: 4px solid #7c3aed;
        }
        .pw-client-grid {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 8px;
          font-size: 13px;
        }
        .pw-client-grid strong {
          color: #4b5563;
        }
        .pw-table-wrap {
          margin: 0 40px 30px;
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
        .pw-summary {
          margin: 0 40px;
          display: flex;
          justify-content: flex-end;
        }
        .pw-totals {
          width: 300px;
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
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
        .pw-terms {
          margin: 40px;
          font-size: 11px;
          color: #4b5563;
        }
        .pw-terms h4 {
          color: #6d28d9;
          font-size: 13px;
          margin-bottom: 8px;
        }
        .pw-footer-wave {
          position: absolute;
          bottom: -150px;
          left: -100px;
          width: 100%;
          height: 250px;
          background: linear-gradient(135deg, #c4b5fd, #8b5cf6);
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
          z-index: 0;
          opacity: 0.2;
        }
      `}</style>

      <div className="pw-header">
        <div className="pw-header-wave"></div>
        <div className="pw-header-content">
          <div className="pw-brand-logo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <div>tagverse<span>.io</span></div>
          </div>
          <div className="pw-doc-box">
            <div className="pw-doc-title">{docType === 'Invoice' ? 'Invoice' : 'Quotation'}</div>
            <div className="pw-doc-meta">
              <span>{docType === 'Invoice' ? 'Invoice No:' : 'Quote No:'}</span>
              <span>{quoteId}</span>
              <span>Date:</span>
              <span>{fmtDate(issued)}</span>
              <span>{docType === 'Invoice' ? 'Due Date:' : 'Valid Until:'}</span>
              <span>{fmtDate(expires)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pw-contact-bar">
        <div>📞 contact@tagverse.io</div>
        <div>🌐 www.tagverse.io</div>
      </div>

      <div className="pw-client-box">
        <div className="pw-client-grid">
          <strong>Client Name:</strong>
          <div>{company || '—'}</div>
          <strong>Project Scope:</strong>
          <div>{scope || '—'}</div>
          {contact && (
            <>
              <strong>Contact:</strong>
              <div>{contact} ({phone || email})</div>
            </>
          )}
        </div>
      </div>

      <div className="pw-table-wrap">
        <table className="pw-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Description</th>
              <th style={{textAlign: 'center'}}>Qty</th>
              <th style={{textAlign: 'right'}}>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{textAlign: 'center', padding: 20, color: '#9ca3af'}}>Add line items...</td></tr>
            ) : items.map((it, idx) => (
              <tr key={it.id}>
                <td style={{width: 40}}>{(idx + 1).toString().padStart(2, '0')}</td>
                <td>{it.desc || 'Untitled'}</td>
                <td style={{textAlign: 'center'}}>{it.qty}</td>
                <td style={{textAlign: 'right'}}>{currency}{it.price.toLocaleString('en-IN')}</td>
                <td>{currency}{(it.qty * it.price).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pw-summary">
        <div className="pw-totals">
          <div className="pw-tot-row">
            <span>Subtotal</span>
            <span>{currency}{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {discountRate > 0 && (
            <div className="pw-tot-row">
              <span>Discount</span>
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
            <span>Total</span>
            <span>{currency}{Math.round(total).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="pw-terms">
        <h4>Terms & Conditions</h4>
        <div style={{ whiteSpace: 'pre-wrap', marginBottom: 12 }}>{notes}</div>
        <div>• <strong>Payment:</strong> {terms}</div>
        <div>• <strong>Delivery:</strong> {delivery || 'As agreed'}</div>
      </div>

      <div className="pw-footer-wave"></div>
    </div>
  );
}
