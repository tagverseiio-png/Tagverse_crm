import React from 'react';
import { TemplateRendererProps } from './types';

export default function TemplateModern(props: TemplateRendererProps) {
  const { docType, quoteId, issued, expires, company, contact, email, phone, scope, items, currency, subtotal, discountRate, discountAmt, cgstRate, cgstAmt, sgstRate, sgstAmt, total, notes, terms, delivery, fmtDate } = props;

  return (
    <div className="tpl-modern">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-text">{docType === 'Invoice' ? 'INVOICE' : 'QUOTATION'}</div>
      </div>

      <div className="main-content">
        {/* Header Section */}
        <div className="header-section">
          <div className="invoice-details">
            <div><span>{docType === 'Invoice' ? 'Invoice' : 'Quote'} No</span> <strong>: {quoteId}</strong></div>
            <div><span>Date</span> <strong>: {fmtDate(issued)}</strong></div>
            <div><span>{docType === 'Invoice' ? 'Due Date' : 'Valid Until'}</span> <strong>: {fmtDate(expires)}</strong></div>
          </div>
          
          <div className="company-header">
            <h1 className="company-name">tagverse.io</h1>
            <div className="company-tagline">Digital Growth Partner</div>
          </div>
        </div>

        {/* Parties Section */}
        <div className="parties-section">
          <div className="bill-to">
            <h3>{docType === 'Invoice' ? 'Invoice To:' : 'Quote For:'}</h3>
            <div className="client-name">{company || 'Client Name'}</div>
            <p>
              {contact ? <>{contact}<br/></> : null}
              {email ? <>{email}<br/></> : null}
              {phone ? <>{phone}<br/></> : null}
            </p>
          </div>

          {docType === 'Invoice' ? (
            <div className="payment-info">
              <h3>Payment Info:</h3>
              <div className="info-row">
                <span>Account No</span>
                <span>: 000 111 222 333</span>
              </div>
              <div className="info-row">
                <span>A/c Name</span>
                <span>: tagverse.io</span>
              </div>
              <div className="info-row">
                <span>Bank Details</span>
                <span>: HDFC Bank</span>
              </div>
              <div className="info-row">
                <span>Due Date</span>
                <span>: {fmtDate(expires)}</span>
              </div>
            </div>
          ) : (
            <div className="payment-info">
              <h3>Prepared By:</h3>
              <div className="info-row" style={{ fontWeight: 600, color: '#7c3aed' }}>
                <span>tagverse.io</span>
              </div>
              <div className="info-row">
                <span>Digital Growth Partner</span>
              </div>
              <div className="info-row">
                <span>contact@tagverse.io</span>
              </div>
              <div className="info-row">
                <span>www.tagverse.io</span>
              </div>
            </div>
          )}
        </div>

        {/* Scope Section */}
        {scope && (
          <div style={{ margin: '0 0 12px', background: '#f3f0ff', borderRadius: 6, padding: '8px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', fontSize: 10, letterSpacing: 1 }}>{docType === 'Invoice' ? 'Description' : 'Scope'}</span>
            <span>{scope}</span>
          </div>
        )}

        {/* Table Section */}
        <div className="table-container">
          <div className="item-row header">
            <div className="col-sl">SL.</div>
            <div className="col-desc">Product Description</div>
            <div className="col-price">Price</div>
            <div className="col-qty">Qty</div>
            <div className="col-total">Total</div>
          </div>
          
          {items.length === 0 ? (
            <div className="item-row body" style={{ justifyContent: 'center', color: '#9CA3AF', fontStyle: 'italic', padding: '20px' }}>
              Add line items using the panel on the left
            </div>
          ) : (
            items.map((it, idx) => (
              <div className="item-row body" key={it.id || idx}>
                <div className="col-sl">{(idx + 1).toString().padStart(2, '0')}.</div>
                <div className="col-desc">{it.desc || 'Untitled'}</div>
                <div className="col-price">{currency}{it.price.toLocaleString('en-IN')}</div>
                <div className="col-qty">{it.qty}</div>
                <div className="col-total">{currency}{(it.qty * it.price).toLocaleString('en-IN')}</div>
              </div>
            ))
          )}
        </div>

        {/* Totals Section */}
        <div className="mod-totals-section">
          <div className="mod-totals-inner">
            <div className="tot-line">
              <span>Subtotal</span>
              <span>{currency}{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {cgstRate > 0 && (
              <div className="tot-line">
                <span>CGST ({cgstRate}%)</span>
                <span>{currency}{Math.round(cgstAmt).toLocaleString('en-IN')}</span>
              </div>
            )}
            {sgstRate > 0 && (
              <div className="tot-line">
                <span>SGST ({sgstRate}%)</span>
                <span>{currency}{Math.round(sgstAmt).toLocaleString('en-IN')}</span>
              </div>
            )}
            {discountRate > 0 && (
              <div className="tot-line">
                <span>Discount ({discountRate}%)</span>
                <span>-{currency}{Math.round(discountAmt).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="tot-line grand">
              <span>Total</span>
              <span>{currency}{Math.round(total).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Terms Section */}
        <div className="mod-terms-section">
          <h4>{docType === 'Invoice' ? 'NOTES & TERMS' : 'TERMS & CONDITIONS'}</h4>
          {notes && <p style={{ whiteSpace: 'pre-wrap', marginBottom: 12 }}>{notes}</p>}
          <div className="mod-terms-meta">
            {terms && <div><strong>Payment:</strong> {terms}</div>}
            {delivery && <div><strong>Delivery:</strong> {delivery}</div>}
          </div>
          {!docType || docType === 'Quote' ? (
            <p style={{ marginTop: 12, color: '#9ca3af', fontStyle: 'italic', fontSize: 11 }}>
              This quotation is valid until {fmtDate(expires)}. Prices are subject to change after expiry.
            </p>
          ) : null}
        </div>

        {/* Signature */}
        {docType === 'Invoice' && (
          <div className="mod-sig-section">
            <div className="sig-block">
              <div className="sig-label">AUTHORISED BY — TAGVERSE.IO</div>
              <div className="sig-line"></div>
              <div className="sig-text">Signature &amp; Date</div>
            </div>
            <div className="sig-block">
              <div className="sig-label">ACCEPTED BY — {company ? company.toUpperCase() : 'CLIENT'}</div>
              <div className="sig-line"></div>
              <div className="sig-text">Signature &amp; Date</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="footer-shape">
        <div className="contact-info">
          <span>Email</span>
          <span>: contact@tagverse.io</span>
          
          <span>Web</span>
          <span>: www.tagverse.io</span>
          
          <span>Address</span>
          <span>: India</span>
        </div>
      </div>
    </div>
  );
}
