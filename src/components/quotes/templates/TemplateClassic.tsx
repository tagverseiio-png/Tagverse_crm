import React from 'react';
import { TemplateRendererProps } from './types';

export default function TemplateClassic(props: TemplateRendererProps) {
  const { docType, quoteId, issued, expires, company, contact, email, phone, scope, items, currency, subtotal, discountRate, discountAmt, cgstRate, cgstAmt, sgstRate, sgstAmt, total, notes, terms, delivery, fmtDate } = props;

  return (
    <div className="doc">
      <div className="doc-accent"></div>

      <div className="doc-header">
        <div className="dh-brand">
          <div className="dh-name">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
              <rect width="22" height="22" rx="5" fill="#4A3FD4" />
              <path d="M4 11L8.5 6.5L13 11L8.5 15.5Z" fill="white" opacity=".9" />
              <path d="M9 11L13.5 6.5L16 9L11.5 13.5Z" fill="white" opacity=".5" />
            </svg>
            tagverse<span className="dh-name-dot">.</span>io
          </div>
          <div className="dh-tag">Digital Growth Partner</div>
        </div>
        <div className="dh-right">
          <div className="dh-word">{docType === 'Invoice' ? 'Invoice' : 'Quotation'}</div>
          <div className="dh-num">{quoteId}</div>
        </div>
      </div>

      <div className="doc-meta">
        <div className="dm"><div className="dm-key">Date Issued</div><div className="dm-val">{fmtDate(issued)}</div></div>
        <div className="dm"><div className="dm-key">{docType === 'Invoice' ? 'Due Date' : 'Valid Until'}</div><div className="dm-val">{fmtDate(expires)}</div></div>
      </div>

      <div className="doc-parties">
        <div className="dp">
          <div className="dp-key">Bill To</div>
          <div className="dp-co">{company || 'Client Company'}</div>
          <div className="dp-line">
            <span>{contact || 'Contact Name'}</span><br />
            <span>{email || 'email@company.com'}</span><br />
            <span>{phone || '+91 00000 00000'}</span>
          </div>
        </div>
        <div className="dp">
          <div className="dp-key">Prepared By</div>
          <div className="dp-co" style={{ color: 'var(--brand)' }}>tagverse.io</div>
          <div className="dp-line">
            Digital Growth Partner<br />
            contact@tagverse.io<br />
            www.tagverse.io
          </div>
        </div>
      </div>

      <div className="doc-scope">
        <div className="scope-label">Scope</div>
        <div className="scope-val">{scope || 'Project / Scope Title'}</div>
      </div>

      <div className="doc-table-wrap">
        <table className="dt">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td className="dt-empty" colSpan={4}>Add line items using the panel on the left</td></tr>
            ) : items.map((it) => (
              <tr key={it.id}>
                <td>{it.desc || <em style={{ color: 'var(--ink4)', fontWeight: 400 }}>Untitled</em>}</td>
                <td>{it.qty}</td>
                <td>{currency}{it.price.toLocaleString('en-IN')}</td>
                <td>{currency}{(it.qty * it.price).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="doc-totals">
        <div className="dtot">
          <div className="dtot-row"><span>Subtotal</span><span className="v">{currency}{subtotal.toLocaleString('en-IN')}</span></div>
          {discountRate > 0 && (
            <div className="dtot-row"><span>Discount ({discountRate}%)</span><span className="v">−{currency}{Math.round(discountAmt).toLocaleString('en-IN')}</span></div>
          )}
          {cgstRate > 0 && (
            <div className="dtot-row"><span>CGST ({cgstRate}%)</span><span className="v">{currency}{Math.round(cgstAmt).toLocaleString('en-IN')}</span></div>
          )}
          {sgstRate > 0 && (
            <div className="dtot-row"><span>SGST ({sgstRate}%)</span><span className="v">{currency}{Math.round(sgstAmt).toLocaleString('en-IN')}</span></div>
          )}
          <div className="dtot-grand"><span>Total</span><span className="v">{currency}{Math.round(total).toLocaleString('en-IN')}</span></div>
        </div>
      </div>

      <div className="doc-notes">
        <div className="dn-key">Notes & Terms</div>
        <div className="dn-text" style={{ whiteSpace: 'pre-wrap' }}>{notes}</div>
        <div className="dn-meta">
          <div><strong>Payment:</strong> <span>{terms}</span></div>
          <div><strong>Delivery:</strong> <span>{delivery || '—'}</span></div>
        </div>
      </div>

      {docType === 'Invoice' && (
        <div className="doc-sig">
          <div className="sig-block">
            <div className="sig-label">Authorised by — tagverse.io</div>
            <div className="sig-line"></div>
            <div className="sig-sub">Signature &amp; Date</div>
          </div>
          <div className="sig-block">
            <div className="sig-label">Accepted by — Client</div>
            <div className="sig-line"></div>
            <div className="sig-sub">Signature &amp; Date</div>
          </div>
        </div>
      )}

      <div className="doc-footer">
        <div className="df-left">This {docType === 'Invoice' ? 'invoice' : 'quotation'} is confidential and intended solely for the named recipient.</div>
        <div className="df-right">
          <div className="df-brand">tagverse.io</div>
          <div>contact@tagverse.io · www.tagverse.io</div>
        </div>
      </div>
    </div>
  );
}
