'use client';
import React, { useState } from 'react';
import { 
  Briefcase, 
  Lock, 
  UserCheck, 
  Truck, 
  Cloud, 
  Handshake, 
  FileSignature, 
  CheckCircle2,
  Trash2,
  Plus,
  PenTool,
  X,
  Info,
  ArrowLeft,
  ArrowRight,
  Check
} from 'lucide-react';
import '../quotes/QuoteBuilder.css';

export type ContractWizardProps = {
  onClose: () => void;
  onSave: (contract: any) => void;
  initialData?: any;
};

const TEMPLATES = [
  { id: "Service Agreement", name: "Service Agreement", desc: "For IT, consulting, and professional services", icon: Briefcase },
  { id: "NDA", name: "Non-Disclosure Agreement", desc: "Protect mutual proprietary and confidential exchange of IPs", icon: Lock },
  { id: "Employment Contract", name: "Employment Contract", desc: "Detailed executive, contractor, and employee agreements", icon: UserCheck },
  { id: "Vendor Agreement", name: "Vendor Agreement", desc: "Procurement, supply chain, hardware delivery covenants", icon: Truck },
  { id: "Subscription Agreement", name: "Subscription Agreement", desc: "SaaS licensing, multi-user accounts, SLA guarantees", icon: Cloud },
  { id: "Partnership Agreement", name: "Partnership Agreement", desc: "Joint ventures, revenue-sharing models, co-selling", icon: Handshake },
  { id: "Custom Blank Contract", name: "Custom Blank Contract", desc: "Start fresh with custom clauses, terms, and values", icon: FileSignature }
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
    serviceLevel: '',

    // NDA
    partnerCompany: '',
    jurisdiction: 'Delaware',
    isMutualNDA: true,
    isPerpetual: false,
    purpose: '',
    requireDestruction: true,

    // Employment
    employeeName: '',
    role: '',
    employmentType: 'Full-time',
    compStructure: '',
    paymentSchedule: 'Monthly',
    isOngoing: true,
    benefits: '',
    noticePeriod: '30 Days',
    nonCompete: false,

    // Vendor
    vendorName: '',
    poNumber: '',
    deliveryTerms: '',
    warrantyTerms: '',
    penaltyClauses: '',

    // Subscription
    seats: '',
    plan: 'Pro',
    slaTier: '',
    billingCycle: 'Annual',
    autoRenewal: true,
    usageLimits: '',

    // Partnership
    partnershipType: 'Revenue Share',
    revenueSplit: '50/50',
    coSellingTerms: '',
    exitTerms: '',

    // Custom
    customClauses: [{ title: '1. First Clause', body: '' }],
  });

  const handleAddClause = () => {
    updateField('customClauses', [...(formData.customClauses || []), { title: '', body: '' }]);
  };

  const handleUpdateClause = (index: number, key: string, value: string) => {
    const newClauses = [...(formData.customClauses || [])];
    newClauses[index][key] = value;
    updateField('customClauses', newClauses);
  };
  
  const handleRemoveClause = (index: number) => {
    const newClauses = (formData.customClauses || []).filter((_: any, i: number) => i !== index);
    updateField('customClauses', newClauses);
  };

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
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', gap: 16 }}>
                {renderInput(formData.isMutualNDA ? 'Party A' : 'Disclosing Party', 'client')}
                {renderInput(formData.isMutualNDA ? 'Party B' : 'Receiving Party', 'partnerCompany')}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', marginTop: 22 }}>
                <input type="checkbox" checked={formData.isMutualNDA} onChange={e => updateField('isMutualNDA', e.target.checked)} /> Mutual NDA
              </label>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>{renderInput('Contact Person', 'contactPerson')}{renderInput('Associated Deal', 'deal')}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', gap: 16 }}>
                {renderInput('Effective Date', 'start', '', 'date')}
                {!formData.isPerpetual && renderInput('Expiration Date', 'end', '', 'date')}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', marginTop: 22 }}>
                <input type="checkbox" checked={formData.isPerpetual} onChange={e => updateField('isPerpetual', e.target.checked)} /> Perpetual
              </label>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Governing Law / Jurisdiction</label>
                <select value={formData.jurisdiction} onChange={e => updateField('jurisdiction', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                  <option>Delaware</option><option>New York</option><option>California</option><option>UK (England & Wales)</option><option>Other</option>
                </select>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', marginTop: 22 }}>
                  <input type="checkbox" checked={formData.requireDestruction} onChange={e => updateField('requireDestruction', e.target.checked)} /> Require Return/Destruction of Materials
                </label>
              </div>
            </div>
            {renderTextArea('Confidentiality Scope', 'scope', 'What info is covered...')}
            {renderTextArea('Purpose of Disclosure', 'purpose', 'Why info is being shared...')}
            {renderTextArea('Internal Notes', 'notes')}
          </>
        );
      case 'Employment Contract':
        return (
          <>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Employee Name', 'employeeName')}{renderInput('Contact Person (HR Rep)', 'contactPerson')}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              {renderInput('Job Title / Role', 'role')}
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Employment Type</label>
                <select value={formData.employmentType} onChange={e => updateField('employmentType', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                  <option>Full-time</option><option>Part-time</option><option>Contractor</option><option>Executive</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              {renderInput('Salary / Compensation', 'valuePerYear', '0', 'number')}
              <div style={{ flex: 1, display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Currency</label>
                  <select value={formData.currency} onChange={e => updateField('currency', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                    <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Pay Frequency</label>
                  <select value={formData.paymentSchedule} onChange={e => updateField('paymentSchedule', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                    <option>Monthly</option><option>Bi-weekly</option><option>Annual</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', gap: 16 }}>
                {renderInput('Start Date', 'start', '', 'date')}
                {!formData.isOngoing && renderInput('End Date', 'end', '', 'date')}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', marginTop: 22 }}>
                <input type="checkbox" checked={formData.isOngoing} onChange={e => updateField('isOngoing', e.target.checked)} /> Ongoing
              </label>
            </div>
            {renderTextArea('Job Responsibilities', 'scope', 'Key duties and expectations...')}
            {renderTextArea('Benefits', 'benefits', 'Insurance, PTO, equity...')}
            <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center' }}>
              {renderInput('Termination / Notice Period', 'noticePeriod', 'e.g. 30 Days')}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', marginTop: 22 }}>
                <input type="checkbox" checked={formData.nonCompete} onChange={e => updateField('nonCompete', e.target.checked)} />
                Non-Compete / Confidentiality
              </label>
            </div>
            {renderTextArea('Internal Notes', 'notes')}
          </>
        );
      case 'Vendor Agreement':
        return (
          <>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Vendor Name', 'vendorName')}{renderInput('Contact Person', 'contactPerson')}</div>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Associated Deal / PO Number', 'poNumber')}
              <div style={{ width: 100 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Currency</label>
                <select value={formData.currency} onChange={e => updateField('currency', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                  <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option>
                </select>
              </div>
            </div>
            {renderInput('Contract Value', 'valuePerYear', '0', 'number')}
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>{renderInput('Start Date', 'start', '', 'date')}{renderInput('End Date', 'end', '', 'date')}</div>
            {renderTextArea('Goods/Services Procured', 'scope')}
            {renderTextArea('Delivery Terms', 'deliveryTerms', 'Timelines, shipping, Incoterms...')}
            {renderTextArea('Payment Terms', 'paymentTerms')}
            {renderTextArea('Warranty / SLA Terms', 'warrantyTerms')}
            {renderTextArea('Penalty Clauses for Late Delivery', 'penaltyClauses')}
            {renderTextArea('Internal Notes', 'notes')}
          </>
        );
      case 'Subscription Agreement':
        return (
          <>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Client Name', 'client')}{renderInput('Contact Person', 'contactPerson')}</div>
            <div style={{ display: 'flex', gap: 16 }}>
              {renderInput('Associated Deal', 'deal')}
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Plan / Tier</label>
                <select value={formData.plan} onChange={e => updateField('plan', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                  <option>Basic</option><option>Pro</option><option>Enterprise</option><option>Custom</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              {renderInput('Number of Licenses / Seats', 'seats', '0', 'number')}
              {renderInput('Contract Value', 'valuePerYear', '0', 'number')}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Currency</label>
                <select value={formData.currency} onChange={e => updateField('currency', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                  <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Billing Cycle</label>
                <select value={formData.billingCycle} onChange={e => updateField('billingCycle', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                  <option>Monthly</option><option>Annual</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', gap: 16 }}>
                {renderInput('Start Date', 'start', '', 'date')}
                {!formData.autoRenewal && renderInput('End Date', 'end', '', 'date')}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)', marginTop: 22 }}>
                <input type="checkbox" checked={formData.autoRenewal} onChange={e => updateField('autoRenewal', e.target.checked)} /> Auto-Renew
              </label>
            </div>
            {renderTextArea('SLA Terms', 'slaTier', 'Uptime %, support response time...')}
            {renderTextArea('Usage Limits / Fair Use Policy', 'usageLimits')}
            {renderTextArea('Internal Notes', 'notes')}
          </>
        );
      case 'Partnership Agreement':
        return (
          <>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Partner Name', 'client')}{renderInput('Contact Person', 'contactPerson')}</div>
            <div style={{ display: 'flex', gap: 16 }}>
              {renderInput('Associated Deal', 'deal')}
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Partnership Type</label>
                <select value={formData.partnershipType} onChange={e => updateField('partnershipType', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                  <option>JV</option><option>Reseller</option><option>Co-marketing</option><option>Revenue Share</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              {renderInput('Revenue Share Split (%) or Value', 'revenueSplit', 'e.g. 50/50 or 10k')}
              <div style={{ width: 100 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Currency</label>
                <select value={formData.currency} onChange={e => updateField('currency', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                  <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>{renderInput('Start Date', 'start', '', 'date')}{renderInput('End Date', 'end', '', 'date')}</div>
            {renderTextArea('Roles & Responsibilities of Each Party', 'scope')}
            {renderTextArea('Co-selling / Co-marketing Terms', 'coSellingTerms')}
            {renderTextArea('Exit / Dissolution Terms', 'exitTerms')}
            {renderTextArea('Internal Notes', 'notes')}
          </>
        );
      case 'Custom Blank Contract':
        return (
          <>
            <div style={{ display: 'flex', gap: 16 }}>{renderInput('Party Name', 'client')}{renderInput('Contact Person', 'contactPerson')}</div>
            <div style={{ display: 'flex', gap: 16 }}>
              {renderInput('Associated Deal', 'deal')}
              <div style={{ width: 100 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Currency</label>
                <select value={formData.currency} onChange={e => updateField('currency', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                  <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>{renderInput('Contract Value', 'valuePerYear', '0', 'number')}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>{renderInput('Start Date', 'start', '', 'date')}{renderInput('End Date', 'end', '', 'date')}</div>
            
            <div style={{ marginTop: 24, marginBottom: 12, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>Custom Clause Builder</div>
            {formData.customClauses?.map((clause: any, index: number) => (
              <div key={index} style={{ padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 12, position: 'relative' }}>
                <button onClick={() => handleRemoveClause(index)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--rose)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
                <div style={{ marginBottom: 12, paddingRight: 32 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Clause Title</label>
                  <input type="text" value={clause.title} onChange={e => handleUpdateClause(index, 'title', e.target.value)} placeholder="e.g. 1. Standard Terms" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Clause Body</label>
                  <textarea rows={3} value={clause.body} onChange={e => handleUpdateClause(index, 'body', e.target.value)} placeholder="Clause description..." style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13, resize: 'none' }} />
                </div>
              </div>
            ))}
            <button className="btn btn-ghost" onClick={handleAddClause} style={{ width: '100%', border: '1px dashed var(--border)', color: 'var(--text-secondary)', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Plus size={16} /> Add Clause
            </button>
            
            {renderTextArea('Payment Terms (Optional)', 'paymentTerms')}
            {renderTextArea('Internal Notes', 'notes')}
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
            {renderTextArea('Scope of Work', 'scope', 'deliverables, milestones')}
            {renderTextArea('Payment Terms', 'paymentTerms', 'net-30, milestone-based, retainer')}
            {renderTextArea('Service Level Expectations (Optional)', 'serviceLevel')}
            {renderTextArea('Internal Notes', 'notes')}
          </>
        );
    }
  };

  const getPreviewContent = () => {
    switch (template) {
      case 'NDA': return (
        <>
          <p style={{ lineHeight: 1.7, color: 'var(--ink2)', textAlign: 'justify', fontSize: 13 }}>This {formData.isMutualNDA ? 'Mutual' : 'One-Way'} Non-Disclosure Agreement is between <strong>{formData.client || 'Party A'}</strong> and <strong>{formData.partnerCompany || 'Party B'}</strong>.</p>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>1. Purpose of Disclosure</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.purpose || 'To explore a potential business relationship.'}</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>2. Scope of Confidential Information</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.scope || 'Definition of confidential items.'}</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>3. Term & Duration</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Effective: {formData.start || 'TBD'}. {formData.isPerpetual ? 'Obligations survive indefinitely (Perpetual).' : `Expires: ${formData.end || 'TBD'}.`}</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>4. Return or Destruction</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.requireDestruction ? 'Receiving party must return or securely destroy all materials upon request.' : 'No strict return/destruction policy specified.'}</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>5. Jurisdiction</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Governed by the laws of <strong>{formData.jurisdiction}</strong>.</div></div>
        </>
      );
      case 'Employment Contract': return (
        <>
          <p style={{ lineHeight: 1.7, color: 'var(--ink2)', textAlign: 'justify', fontSize: 13 }}>Employment agreement for <strong>{formData.employeeName || '[Employee]'}</strong> for the role of <strong>{formData.role || '[Role]'}</strong> ({formData.employmentType}).</p>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>1. Compensation & Term</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Compensation: {formData.currency} {formData.valuePerYear} paid {formData.paymentSchedule}. Term: Starts {formData.start || 'TBD'}. {formData.isOngoing ? 'Employment is ongoing (at-will).' : `Ends: ${formData.end || 'TBD'}.`}</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>2. Responsibilities</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.scope || 'As reasonably assigned by management.'}</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>3. Benefits</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.benefits || 'Standard company benefits apply.'}</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>4. Termination / Notice</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Notice period required: {formData.noticePeriod}.</div></div>
          {formData.nonCompete && <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>5. Non-Compete & Confidentiality</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Standard post-employment non-compete and confidentiality clauses apply.</div></div>}
        </>
      );
      case 'Vendor Agreement': return (
        <>
          <p style={{ lineHeight: 1.7, color: 'var(--ink2)', textAlign: 'justify', fontSize: 13 }}>Vendor Agreement between tagverse.io and <strong>{formData.vendorName || '[Vendor]'}</strong> for PO/Deal: {formData.poNumber || 'TBD'}.</p>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>1. Goods/Services & Delivery</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Scope: {formData.scope || 'Specified goods/services.'} <br/> Delivery Terms: {formData.deliveryTerms}</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>2. Payment & Value</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Contract Value: {formData.currency} {formData.valuePerYear}. <br/> Payment Terms: {formData.paymentTerms}</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>3. Warranty & SLA</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.warrantyTerms || 'Standard warranty applies.'}</div></div>
          {formData.penaltyClauses && <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>4. Penalties for Late Delivery</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.penaltyClauses}</div></div>}
        </>
      );
      case 'Partnership Agreement': return (
        <>
          <p style={{ lineHeight: 1.7, color: 'var(--ink2)', textAlign: 'justify', fontSize: 13 }}>{formData.partnershipType} Agreement between tagverse.io and <strong>{formData.client || '[Partner]'}</strong> for <strong>{formData.deal || '[Deal]'}</strong>.</p>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>1. Roles & Responsibilities</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.scope || 'Defined roles and duties of each party.'}</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>2. Financials / Revenue Split</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.revenueSplit ? `Agreed split/value: ${formData.revenueSplit}` : 'TBD'} ({formData.currency}).</div></div>
          {formData.coSellingTerms && <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>3. Co-Selling & Marketing Terms</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.coSellingTerms}</div></div>}
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>4. Duration & Exit Strategy</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Valid from {formData.start || 'TBD'} to {formData.end || 'TBD'}. <br/> {formData.exitTerms ? `Exit Terms: ${formData.exitTerms}` : 'Standard dissolution terms apply.'}</div></div>
        </>
      );
      case 'Custom Blank Contract': return (
        <>
          <p style={{ lineHeight: 1.7, color: 'var(--ink2)', textAlign: 'justify', fontSize: 13 }}>Custom Agreement between tagverse.io and <strong>{formData.client || '[Party Name]'}</strong> for <strong>{formData.deal || '[Deal]'}</strong>.</p>
          <div style={{ marginTop: 24, marginBottom: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>Overview</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Contract Value: {formData.currency} {formData.valuePerYear}. Valid: {formData.start || 'TBD'} to {formData.end || 'TBD'}.</div></div>
          
          {formData.customClauses?.map((clause: any, index: number) => (
            <div key={index} style={{ marginTop: 24 }}>
              <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>{clause.title || `Clause ${index + 1}`}</div>
              <div style={{ fontSize: 13, color: 'var(--ink2)', whiteSpace: 'pre-wrap' }}>{clause.body || '...'}</div>
            </div>
          ))}

          {formData.paymentTerms && <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>Payment Terms</div><div style={{ fontSize: 13, color: 'var(--ink2)', whiteSpace: 'pre-wrap' }}>{formData.paymentTerms}</div></div>}
        </>
      );
      case 'Subscription Agreement': return (
        <>
          <p style={{ lineHeight: 1.7, color: 'var(--ink2)', textAlign: 'justify', fontSize: 13 }}>SaaS licensing agreement between tagverse.io and <strong>{formData.client || '[Client]'}</strong> for {formData.seats || 0} seats on the <strong>{formData.plan}</strong> plan.</p>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>1. Value & Billing</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Contract Value: {formData.currency} {formData.valuePerYear}. Billing Cycle: {formData.billingCycle}.</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>2. Term & Auto Renewal</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Starts: {formData.start || 'TBD'}. {formData.autoRenewal ? 'This subscription is set to automatically renew.' : `Ends: ${formData.end || 'TBD'}.`}</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>3. SLA Terms</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.slaTier || 'Standard SLA applies.'}</div></div>
          {formData.usageLimits && <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>4. Usage Limits / Fair Use</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.usageLimits}</div></div>}
        </>
      );
      default: return (
        <>
          <p style={{ lineHeight: 1.7, color: 'var(--ink2)', textAlign: 'justify', fontSize: 13 }}>Agreement entered into by <strong>tagverse.io</strong> and <strong>{formData.client || '[Client]'}</strong>.</p>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>1. Scope of Work</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.scope || 'Detailed responsibilities and deliverables.'}</div></div>
          <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>2. Terms</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>Value: {formData.valuePerYear} {formData.currency}. Payment: {formData.paymentTerms}</div></div>
          {formData.serviceLevel && <div style={{ marginTop: 24 }}><div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>3. Service Level Expectations</div><div style={{ fontSize: 13, color: 'var(--ink2)' }}>{formData.serviceLevel}</div></div>}
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
            <PenTool size={20} style={{ color: 'var(--purple)' }} /> Contract Setup
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
            <X size={16} /> Cancel Draft
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
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: template === t.id ? 'var(--purple)' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: template === t.id ? '#fff' : 'var(--purple-light)', transition: 'all 0.2s' }}>
                          <t.icon size={20} />
                        </div>
                        {template === t.id && <CheckCircle2 size={20} style={{ color: 'var(--purple)' }} />}
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

                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'rgba(239, 68, 68, 0.1)', padding: 16, borderRadius: 12, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <Info size={20} style={{ color: 'var(--rose-light)' }} />
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
            <button className="btn btn-ghost" onClick={handlePrev} disabled={step === 1} style={{ opacity: step === 1 ? 0 : 1, display: 'flex', gap: 6, alignItems: 'center' }}>
              <ArrowLeft size={16} /> Back
            </button>
            {step < 3 ? (
              <button className="btn btn-primary" onClick={handleNext} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                Next Step <ArrowRight size={16} />
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
