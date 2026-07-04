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
            <div><span>Invoice</span> <strong>: {quoteId}</strong></div>
            <div><span>Date</span> <strong>: {fmtDate(issued)}</strong></div>
            {docType === 'Quote' && <div><span>Valid To</span> <strong>: {fmtDate(expires)}</strong></div>}
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
          </div>
        </div>

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
        <div className="bottom-section">
          <div className="terms">
            <h4>Terms & Conditions:</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{notes || 'Please note that the prices are subject to change without prior notice.'}</p>
          </div>

          <div className="totals-box">
            <div className="tot-line">
              <span>Sub Total</span>
              <span>: {currency}{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {cgstRate > 0 || sgstRate > 0 ? (
              <div className="tot-line">
                <span>Tax</span>
                <span>: {currency}{(Math.round(cgstAmt) + Math.round(sgstAmt)).toLocaleString('en-IN')}</span>
              </div>
            ) : null}
            {discountRate > 0 && (
              <div className="tot-line">
                <span>Discount ({discountRate}%)</span>
                <span>: {currency}{Math.round(discountAmt).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="tot-line grand">
              <span>Total</span>
              <span>: {currency}{Math.round(total).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Signature */}
        {docType === 'Invoice' && (
          <div className="signature">
            <div className="sig-line"></div>
            <div className="sig-text">Signature</div>
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
