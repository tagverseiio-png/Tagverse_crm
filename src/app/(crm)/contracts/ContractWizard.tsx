'use client';
import React, { useState } from 'react';
import '../quotes/QuoteBuilder.css';

export type ContractWizardProps = {
  onClose: () => void;
  onSave: (contract: any) => void;
  initialData?: any;
};

const TEMPLATES = [
  { id: "Service Agreement", name: "Service Agreement", desc: "For IT, consulting, and professional services" },
  { id: "NDA", name: "Non-Disclosure Agreement", desc: "Protect mutual proprietary and confidential exchange of IPs" },
  { id: "Employment Contract", name: "Employment Contract", desc: "Detailed executive, contractor, and employee agreements" },
  { id: "Vendor Agreement", name: "Vendor Agreement", desc: "Procurement, supply chain, hardware delivery covenants" },
  { id: "Subscription Agreement", name: "Subscription Agreement", desc: "SaaS licensing, multi-user accounts, SLA guarantees" },
  { id: "Partnership Agreement", name: "Partnership Agreement", desc: "Joint ventures, revenue-sharing models, co-selling" },
  { id: "Custom Blank Contract", name: "Custom Blank Contract", desc: "Start fresh with custom clauses, terms, and values" }
];

export default function ContractWizard({ onClose, onSave, initialData }: ContractWizardProps) {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState('Service Agreement');
  const [formData, setFormData] = useState({
    client: initialData?.client || '',
    contactPerson: initialData?.contactPerson || '',
    deal: initialData?.deal || '',
    valuePerYear: initialData?.valuePerYear || '',
    currency: initialData?.currency || 'USD',
    start: initialData?.start || '',
    end: initialData?.end || '',
    status: initialData?.status || 'Active',
    owner: initialData?.owner || 'John Doe',
    scope: initialData?.scopeOfWork || '',
    paymentTerms: initialData?.paymentTerms || '',
    notes: initialData?.notes || '',
  });

  const handleNext = () => setStep(p => Math.min(3, p + 1));
  const handlePrev = () => setStep(p => Math.max(1, p - 1));

  const handleCreate = () => {
    onSave({
      client: formData.client,
      valuePerYear: Number(formData.valuePerYear) || 0,
      start: formData.start,
      end: formData.end,
      status: formData.status,
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div className="card" style={{
        width: '95vw', maxWidth: 1400, height: '94vh', background: 'var(--bg-secondary)',
        border: '1px solid var(--border-bright)', borderRadius: 16, display: 'flex', overflow: 'hidden', padding: 0
      }}>
        
        {/* Sidebar Steps */}
        <div style={{ width: 260, background: 'var(--bg-card)', padding: 24, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 32px 0', fontSize: 18, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-writing-sign" style={{ color: 'var(--purple)' }}></i> Contract Setup
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
            {[
              { s: 1, title: 'Choose Template', desc: 'Select baseline terms' },
              { s: 2, title: 'Contract Details', desc: 'Fill in parameters' },
              { s: 3, title: 'Review & Finish', desc: 'Final audit & generation' }
            ].map(item => (
              <div key={item.s} style={{ display: 'flex', gap: 12, opacity: step === item.s ? 1 : 0.5, transition: '0.2s' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: step >= item.s ? 'var(--purple)' : 'transparent',
                  border: step >= item.s ? 'none' : '2px solid var(--text-muted)',
                  color: step >= item.s ? '#fff' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold'
                }}>
                  {step > item.s ? '✓' : item.s}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: step === item.s ? 'var(--purple-light)' : 'var(--text-primary)' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-ghost" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', justifyContent: 'center' }}>
            <i className="ti ti-x"></i> Cancel Draft
          </button>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
            {step === 1 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Select a Template</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Choose a starting point for your contract to auto-populate standard clauses.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {TEMPLATES.map(t => (
                    <div key={t.id} onClick={() => setTemplate(t.id)} style={{
                      padding: 20, borderRadius: 12, cursor: 'pointer', border: `2px solid ${template === t.id ? 'var(--purple)' : 'var(--border)'}`,
                      background: template === t.id ? 'var(--purple-alpha)' : 'var(--bg-card)', transition: 'all 0.2s'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple-light)' }}>
                          <i className="ti ti-file-text" style={{ fontSize: 20 }}></i>
                        </div>
                        {template === t.id && <i className="ti ti-circle-check-filled" style={{ color: 'var(--purple)', fontSize: 20 }}></i>}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', gap: 32, height: '100%' }}>
                <div style={{ width: '32%', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', paddingRight: 8 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Contract Details</h2>
                  
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Client Name</label>
                      <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} placeholder="Company Name"
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Contact Person</label>
                      <input type="text" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} placeholder="e.g. Jane Doe"
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Associated Deal</label>
                      <input type="text" value={formData.deal} onChange={e => setFormData({...formData, deal: e.target.value})} placeholder="e.g. Q3 Migration"
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                    </div>
                    <div style={{ width: 100 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Currency</label>
                      <select value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                        {['USD', 'EUR', 'GBP', 'INR'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Contract Value</label>
                    <input type="number" value={formData.valuePerYear} onChange={e => setFormData({...formData, valuePerYear: e.target.value})} placeholder="0"
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                  </div>

                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Start Date</label>
                      <input type="date" value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})}
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>End Date</label>
                      <input type="date" value={formData.end} onChange={e => setFormData({...formData, end: e.target.value})}
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Scope of Work</label>
                    <textarea rows={2} value={formData.scope} onChange={e => setFormData({...formData, scope: e.target.value})} placeholder="Define responsibilities and deliverables..."
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13, resize: 'none' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Payment Terms</label>
                    <textarea rows={2} value={formData.paymentTerms} onChange={e => setFormData({...formData, paymentTerms: e.target.value})} placeholder="e.g. Net 30, 50% upfront..."
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13, resize: 'none' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Internal Notes</label>
                    <textarea rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Add internal context..."
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13, resize: 'none' }} />
                  </div>
                </div>

                {/* Live Preview Panel */}
                <div className="quote-builder-wrapper preview" style={{ flex: 1, borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div className="doc" style={{ margin: '20px auto', maxHeight: 'calc(100% - 40px)', overflowY: 'auto', width: '90%', maxWidth: '800px', borderRadius: 8 }}>
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
                        <div className="dh-word">{TEMPLATES.find(t => t.id === template)?.name || 'Contract'}</div>
                        <div className="dh-num">CTR-{new Date().getFullYear()}-00{Math.floor(Math.random()*100 + 10)}</div>
                      </div>
                    </div>
                    
                    <div className="doc-meta" style={{ gridTemplateColumns: '1fr 1fr' }}>
                       <div className="dm"><div className="dm-key">Effective Date</div><div className="dm-val">{formData.start || '[Select Start Date]'}</div></div>
                       <div className="dm"><div className="dm-key">Valid Until</div><div className="dm-val">{formData.end || '[Select End Date]'}</div></div>
                    </div>

                    <div className="doc-parties">
                      <div className="dp">
                        <div className="dp-key">Client</div>
                        <div className="dp-co">{formData.client || 'Client Company'}</div>
                        <div className="dp-line">{formData.contactPerson || 'Contact Person'}</div>
                      </div>
                      <div className="dp">
                        <div className="dp-key">Provider</div>
                        <div className="dp-co" style={{ color: 'var(--brand)' }}>tagverse.io</div>
                        <div className="dp-line">contact@tagverse.io<br />www.tagverse.io</div>
                      </div>
                    </div>

                    <div style={{ marginTop: 32, padding: '0 40px' }}>
                      <p style={{ lineHeight: 1.7, color: 'var(--ink2)', textAlign: 'justify', fontSize: 13 }}>This Agreement is entered into by and between <strong>tagverse.io</strong> (hereinafter referred to as the "Provider"), and <strong>{formData.client || '[Client Name]'}</strong> (hereinafter referred to as the "Client"). Both parties hereby agree to be bound by the terms detailed below.</p>
                    </div>

                    <div style={{ paddingBottom: 24 }}>
                                           <div style={{ marginTop: 24, padding: '0 40px' }}>
                        <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>1. Scope of Work</div>
                        <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7, textAlign: 'justify' }}>
                          {formData.scope || 'Detailed responsibilities and deliverables.'}
                        </div>
                      </div>

                      <div style={{ marginTop: 24, padding: '0 40px' }}>
                        <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>2. Compensation & Terms</div>
                        <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7, textAlign: 'justify' }}>
                          The Client agrees to a total contract value of <strong>{formData.currency === 'INR' ? '₹' : formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : '£'}{Number(formData.valuePerYear || 0).toLocaleString('en-US')}</strong>. 
                          <br/><br/>
                          <strong>Payment Terms:</strong> {formData.paymentTerms || 'Standard terms apply.'}
                        </div>
                      </div>

                      <div style={{ marginTop: 24, padding: '0 40px' }}>
                        <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>3. Term and Termination</div>
                        <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7, textAlign: 'justify' }}>
                           This agreement shall commence on the Effective Date and shall conclude on <strong>{formData.end || '[Select End Date]'}</strong>, unless terminated earlier by either party with a 30-day written notice in accordance with standard termination clauses.
                        </div>
                      </div>
                      
                      {formData.notes && (
                         <div style={{ marginTop: 24, padding: '0 40px', marginBottom: 24 }}>
                           <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>4. Special Provisions</div>
                           <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7, fontStyle: 'italic', textAlign: 'justify' }}>
                              {formData.notes}
                           </div>
                         </div>
                      )}
                    </div>

                    <div className="doc-sig" style={{ marginTop: 60 }}>
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

                    <div className="doc-footer">
                      <div className="df-left">This contract is confidential and intended solely for the named recipient.</div>
                      <div className="df-right">
                        <div className="df-brand">tagverse.io</div>
                        <div>contact@tagverse.io · www.tagverse.io</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Review & Finalize</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Please verify the contract details before generation.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                  <div style={{ padding: 16, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Client</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{formData.client || '—'}</div>
                  </div>
                  <div style={{ padding: 16, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Template Applied</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{TEMPLATES.find(t => t.id === template)?.name}</div>
                  </div>
                  <div style={{ padding: 16, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Contract Value</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--emerald-light)' }}>₹{Number(formData.valuePerYear || 0).toLocaleString('en-IN')} / yr</div>
                  </div>
                  <div style={{ padding: 16, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Duration</div>
                    <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{formData.start || 'TBD'} to {formData.end || 'TBD'}</div>
                  </div>
                </div>

                <div style={{ padding: 16, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <i className="ti ti-info-circle" style={{ color: 'var(--rose-light)', fontSize: 20 }}></i>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--rose-light)', marginBottom: 4 }}>Ready to Generate</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Upon creation, this contract will be added to the registry and a PDF copy will be generated for signatures. Ensure all values are accurate.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div style={{ padding: '16px 32px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-ghost" onClick={handlePrev} disabled={step === 1} style={{ opacity: step === 1 ? 0.5 : 1 }}>
              <i className="ti ti-arrow-left"></i> Back
            </button>
            {step < 3 ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Next Step <i className="ti ti-arrow-right"></i>
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleCreate} style={{ background: 'var(--emerald)', borderColor: 'var(--emerald)' }}>
                Create Contract <i className="ti ti-check"></i>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      `}} />
    </div>
  );
}
