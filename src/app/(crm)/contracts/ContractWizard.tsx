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
  const [template, setTemplate] = useState(initialData?.template || 'Service Agreement');
  
  // Generic + template-specific form state
  const [formData, setFormData] = useState({
    // Common / Service
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

    // NDA
    partnerCompany: '',
    jurisdiction: 'Delaware',
    durationYears: '2',
    restrictions: '',

    // Employment
    employeeName: '',
    role: '',
    compStructure: '',
    paymentSchedule: 'Monthly',
    probation: '',
    nonCompete: false,

    // Vendor
    vendorName: '',
    poNumber: '',
    deliveryTerms: '',
    complianceReqs: '',

    // Subscription
    seats: '',
    plan: 'Pro Tier',
    slaTier: '99.9% Uptime',
    billingCycle: 'Annual Upfront',
    autoRenewal: true,
    discountNotes: '',

    // Partnership
    revenueSplit: '50/50',
    fundingTranches: '',
    terminationConditions: '',
    ipOwnership: '',

    // Custom
    approvers: '',
    partyNames: ''
  });

  const handleNext = () => setStep(p => Math.min(3, p + 1));
  const handlePrev = () => setStep(p => Math.max(1, p - 1));

  const handleCreate = () => {
    onSave({
      ...formData,
      template,
      valuePerYear: Number(formData.valuePerYear) || 0,
    });
  };

  const updateField = (field: string, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const renderInput = (label: string, field: string, placeholder: string = '', type: string = 'text') => (
    <div style={{ flex: 1 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>{label}</label>
      <input type={type} value={(formData as any)[field]} onChange={e => updateField(field, type === 'checkbox' ? e.target.checked : e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
    </div>
  );

  const renderTextArea = (label: string, field: string, placeholder: string = '') => (
    <div style={{ flex: 1, marginTop: 12 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>{label}</label>
      <textarea rows={2} value={(formData as any)[field]} onChange={e => updateField(field, e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13, resize: 'none' }} />
    </div>
  );

  const renderFormFields = () => {
    switch (template) {
      case 'NDA':
        return (
          <>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Client Company', 'client')}{renderInput('Partner Company', 'partnerCompany')}</div>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Contact Person', 'contactPerson')}{renderInput('Associated Deal/JV', 'deal')}</div>
            <div style={{ display: 'flex', gap: 16 }}>
              {renderInput('Duration (Years)', 'durationYears', 'e.g. 2', 'number')}
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Jurisdiction</label>
                <select value={formData.jurisdiction} onChange={e => updateField('jurisdiction', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                  <option>Delaware</option><option>New York</option><option>California</option><option>UK (England & Wales)</option>
                </select>
              </div>
            </div>
            {renderTextArea('Scope of Confidential Info', 'scope', 'Define IP and data...')}
            {renderTextArea('Special Restrictions', 'restrictions', 'Any carve-outs or exceptions...')}
          </>
        );
      case 'Employment Contract':
        return (
          <>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Employee Name', 'employeeName')}{renderInput('Role', 'role')}</div>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Annual Salary', 'valuePerYear', '0', 'number')}{renderInput('Start Date', 'start', '', 'date')}</div>
            {renderTextArea('Responsibilities', 'scope')}
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>{renderInput('Comp Structure', 'compStructure', 'Base + Bonus')}{renderInput('Payment Schedule', 'paymentSchedule')}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center' }}>
              {renderInput('Probation Period', 'probation', 'e.g. 3 Months')}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)' }}>
                <input type="checkbox" checked={formData.nonCompete} onChange={e => updateField('nonCompete', e.target.checked)} />
                Include Non-Compete Clause
              </label>
            </div>
          </>
        );
      case 'Vendor Agreement':
        return (
          <>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Vendor Name', 'vendorName')}{renderInput('Contact Person', 'contactPerson')}</div>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('PO / Deal Name', 'poNumber')}{renderInput('Total Value', 'valuePerYear', '0', 'number')}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>{renderInput('Start Date', 'start', '', 'date')}{renderInput('Expected Delivery', 'end', '', 'date')}</div>
            {renderTextArea('Scope of Supply', 'scope', 'Items, specs, materials...')}
            {renderTextArea('Delivery Terms', 'deliveryTerms', 'Shipping, inspection...')}
            {renderTextArea('Compliance Reqs', 'complianceReqs', 'Certifications needed...')}
            {renderTextArea('Special Handling', 'notes', 'Environmental controls...')}
          </>
        );
      case 'Subscription Agreement':
        return (
          <>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Client Company', 'client')}{renderInput('Contact Person', 'contactPerson')}</div>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Plan Name', 'plan')}{renderInput('Number of Seats', 'seats', '0', 'number')}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              {renderInput('Annual Value', 'valuePerYear', '0', 'number')}
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Billing Cycle</label>
                <select value={formData.billingCycle} onChange={e => updateField('billingCycle', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                  <option>Annual Upfront</option><option>Monthly</option><option>Quarterly</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center' }}>
              {renderInput('Start Date', 'start', '', 'date')}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)' }}>
                <input type="checkbox" checked={formData.autoRenewal} onChange={e => updateField('autoRenewal', e.target.checked)} /> Auto-Renewal enabled
              </label>
            </div>
            {renderTextArea('SLA Tier', 'slaTier', 'Uptime %, support levels...')}
          </>
        );
      case 'Partnership Agreement':
        return (
          <>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Partner Company', 'client')}{renderInput('Contact Person', 'contactPerson')}</div>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('JV / Project Name', 'deal')}{renderInput('Total Value', 'valuePerYear', '0', 'number')}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>{renderInput('Start Date', 'start', '', 'date')}{renderInput('End Date', 'end', '', 'date')}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>{renderInput('Revenue Split', 'revenueSplit', 'e.g. 60/40')}</div>
            {renderTextArea('Scope of Collaboration', 'scope')}
            {renderTextArea('Funding Tranches', 'fundingTranches')}
            {renderTextArea('IP Ownership & Liability', 'ipOwnership')}
          </>
        );
      case 'Custom Blank Contract':
        return (
          <>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Counterparty Name', 'client')}{renderInput('Contact Person', 'contactPerson')}</div>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Contract Value', 'valuePerYear', '0', 'number')}{renderInput('Currency', 'currency')}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>{renderInput('Start Date', 'start', '', 'date')}{renderInput('End Date', 'end', '', 'date')}</div>
            {renderTextArea('Full Scope / Terms', 'scope')}
            {renderTextArea('Payment Terms', 'paymentTerms')}
            {renderTextArea('Custom Approvers', 'approvers', 'Comma separated...')}
          </>
        );
      default:
        return (
          <>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Client Name', 'client')}{renderInput('Contact Person', 'contactPerson')}</div>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Associated Deal', 'deal')}
              <div style={{ width: 100 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Currency</label>
                <select value={formData.currency} onChange={e => updateField('currency', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                  <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option>
                </select>
              </div>
            </div>
            {renderInput('Contract Value / Yr', 'valuePerYear', '0', 'number')}
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>{renderInput('Start Date', 'start', '', 'date')}{renderInput('End Date', 'end', '', 'date')}</div>
            {renderTextArea('Scope of Work', 'scope')}
            {renderTextArea('Payment Terms', 'paymentTerms')}
            {renderTextArea('Internal Notes', 'notes')}
          </>
        );
    }
  };

  const getPreviewContent = () => {
    switch (template) {
      case 'NDA': return (
        <>
          <p style={{ lineHeight: 1.7, color: 'var(--ink2)', textAlign: 'justify', fontSize: 13 }}>This Mutual Non-Disclosure Agreement is between <strong>tagverse.io</strong> and <strong>{formData.client || '[Company]'}</strong>.</p>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>1. Scope of Confidential Information</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.scope || 'Definition of confidential items.'}</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>2. Jurisdiction</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Governed by the laws of <strong>{formData.jurisdiction}</strong>.</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>3. Duration</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Valid for {formData.durationYears} years.</div></div>
        </>
      );
      case 'Employment Contract': return (
        <>
          <p style={{ lineHeight: 1.7, color: 'var(--ink2)', textAlign: 'justify', fontSize: 13 }}>Employment agreement for <strong>{formData.employeeName || '[Employee]'}</strong> for the role of <strong>{formData.role || '[Role]'}</strong>.</p>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>1. Compensation</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Base: {formData.valuePerYear} ({formData.currency}). Structure: {formData.compStructure}. Schedule: {formData.paymentSchedule}.</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>2. Responsibilities</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.scope}</div></div>
          {formData.nonCompete && <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>3. Non-Compete</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Standard post-employment non-compete applies.</div></div>}
        </>
      );
      case 'Partnership Agreement': return (
        <>
          <p style={{ lineHeight: 1.7, color: 'var(--ink2)', textAlign: 'justify', fontSize: 13 }}>Joint Venture/Partnership for <strong>{formData.deal || '[JV]'}</strong> between tagverse and {formData.client}.</p>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>1. Revenue Split</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Agreed split: <strong>{formData.revenueSplit}</strong>.</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>2. Scope</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.scope}</div></div>
        </>
      );
      case 'Subscription Agreement': return (
        <>
          <p style={{ lineHeight: 1.7, color: 'var(--ink2)', textAlign: 'justify', fontSize: 13 }}>SaaS licensing agreement for {formData.seats} seats on {formData.plan}.</p>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>1. SLA & Billing</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>SLA: {formData.slaTier}. Billing: {formData.billingCycle}.</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>2. Auto Renewal</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.autoRenewal ? 'Enabled' : 'Disabled'}</div></div>
        </>
      );
      default: return (
        <>
          <p style={{ lineHeight: 1.7, color: 'var(--ink2)', textAlign: 'justify', fontSize: 13 }}>Agreement entered into by <strong>tagverse.io</strong> and <strong>{formData.client || '[Client]'}</strong>.</p>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>1. Scope of Work</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.scope || 'Detailed responsibilities and deliverables.'}</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>2. Terms</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Value: {formData.valuePerYear} {formData.currency}. Payment: {formData.paymentTerms}</div></div>
        </>
      );
    }
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
          <div style={{ margin: '0 0 32px 0', fontSize: 18, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontFamily: 'inherit' }}>
            <i className="ti ti-writing-sign" style={{ color: 'var(--purple)' }}></i> Contract Setup
          </div>
          
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
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0', fontFamily: 'inherit' }}>Select a Template</div>
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
                <div style={{ width: '32%', minWidth: '320px', display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: 8 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0', fontFamily: 'inherit' }}>Contract Details</div>
                  {renderFormFields()}
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
                       <div className="dm"><div className="dm-key">Start Date</div><div className="dm-val">{formData.start || '[TBD]'}</div></div>
                       <div className="dm"><div className="dm-key">End Date</div><div className="dm-val">{formData.end || '[TBD]'}</div></div>
                    </div>

                    <div style={{ marginTop: 32, padding: '0 40px' }}>
                      {getPreviewContent()}
                    </div>

                    <div className="doc-sig" style={{ marginTop: 60 }}>
                      <div className="sig-block">
                        <div className="sig-label">Authorised by — tagverse.io</div>
                        <div className="sig-line"></div>
                        <div className="sig-sub">Signature &amp; Date</div>
                      </div>
                      <div className="sig-block">
                        <div className="sig-label">Accepted by — {template === 'Employment Contract' ? 'Employee' : 'Client'}</div>
                        <div className="sig-line"></div>
                        <div className="sig-sub">Signature &amp; Date</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0', fontFamily: 'inherit' }}>Review & Finalize</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Please verify the contract details before generation.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                  <div style={{ padding: 16, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Primary Counterparty</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{formData.client || formData.employeeName || formData.vendorName || '—'}</div>
                  </div>
                  <div style={{ padding: 16, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Template Applied</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{TEMPLATES.find(t => t.id === template)?.name}</div>
                  </div>
                  <div style={{ padding: 16, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Contract Value</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--emerald-light)' }}>{formData.currency} {Number(formData.valuePerYear || 0).toLocaleString('en-US')} / yr</div>
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
