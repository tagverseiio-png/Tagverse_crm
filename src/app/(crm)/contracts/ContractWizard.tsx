'use client';
import React, { useState } from 'react';

export type ContractWizardProps = {
  onClose: () => void;
  onSave: (contract: any) => void;
  initialData?: any;
};

const TEMPLATES = [
  { id: 'SLA', name: 'Service Level Agreement', desc: 'Standard terms for service delivery' },
  { id: 'NDA', name: 'Non-Disclosure Agreement', desc: 'Confidentiality and IP protection' },
  { id: 'EMP', name: 'Employment Contract', desc: 'Standard employee onboarding terms' },
  { id: 'CUST', name: 'Custom Agreement', desc: 'Blank slate for custom terms' },
];

export default function ContractWizard({ onClose, onSave, initialData }: ContractWizardProps) {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState('SLA');
  const [formData, setFormData] = useState({
    client: initialData?.client || '',
    valuePerYear: initialData?.valuePerYear || '',
    start: initialData?.start || '',
    end: initialData?.end || '',
    status: initialData?.status || 'Active',
    owner: 'John Doe',
    notes: '',
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
        width: '100%', maxWidth: 1200, height: '94vh', background: 'var(--bg-secondary)',
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
                <div style={{ width: '42%', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', paddingRight: 8 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Contract Details</h2>
                  
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Client Name</label>
                    <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} placeholder="Company Name"
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                  </div>
                  
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Annual Value (₹)</label>
                      <input type="number" value={formData.valuePerYear} onChange={e => setFormData({...formData, valuePerYear: e.target.value})} placeholder="0"
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Status</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                        {['Active', 'Pending Signature', 'Expiring', 'Terminated'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Start Date</label>
                      <input type="text" value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})} placeholder="e.g. Jan 1 2025"
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>End Date</label>
                      <input type="text" value={formData.end} onChange={e => setFormData({...formData, end: e.target.value})} placeholder="e.g. Dec 31 2025"
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Internal Notes</label>
                    <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Add context or specific clauses..."
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13, resize: 'none' }} />
                  </div>
                </div>

                {/* Live Preview Panel */}
                <div style={{ flex: 1, background: '#1a1d24', borderRadius: 12, padding: 24, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--emerald-light)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)', animation: 'pulse 2s infinite' }}></div>
                    Live Document Compilation
                  </div>
                  <div style={{ 
                    background: '#fff', color: '#111827', flex: 1, borderRadius: 6, padding: '48px 40px', 
                    fontSize: 13, fontFamily: '"Times New Roman", Times, serif', overflowY: 'auto',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                  }}>
                    <div style={{ borderBottom: '2px solid #111827', paddingBottom: 16, marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0, textTransform: 'uppercase', color: '#111827', letterSpacing: 0.5 }}>Tagverse Inc.</h1>
                        <div style={{ fontSize: 11, color: '#4b5563', marginTop: 6, lineHeight: 1.4 }}>100 Innovation Drive, Tech District<br/>San Francisco, CA 94105</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', color: '#374151', letterSpacing: 1 }}>{TEMPLATES.find(t => t.id === template)?.name || 'Contract Agreement'}</div>
                        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 6 }}>Ref: CTR-{new Date().getFullYear()}-00{Math.floor(Math.random()*100 + 10)}</div>
                      </div>
                    </div>

                    <p style={{ marginBottom: 20 }}><strong>Effective Date:</strong> {formData.start || '[Select Start Date]'}</p>
                    
                    <p style={{ marginBottom: 16, lineHeight: 1.7, textAlign: 'justify' }}>This Agreement is entered into by and between <strong>Tagverse Inc.</strong> (hereinafter referred to as the "Provider"), and <strong>{formData.client || '[Client Name]'}</strong> (hereinafter referred to as the "Client"). Both parties hereby agree to be bound by the terms detailed below.</p>
                    
                    <p style={{ fontWeight: 'bold', textTransform: 'uppercase', marginTop: 32, marginBottom: 12, borderBottom: '1px solid #e5e7eb', paddingBottom: 6 }}>1. Services & Consideration</p>
                    <p style={{ lineHeight: 1.7, color: '#374151', textAlign: 'justify' }}>The Client agrees to a total contract value of <strong>₹{Number(formData.valuePerYear || 0).toLocaleString('en-IN')}</strong> annually. The Provider shall deliver the services according to the standard operating procedures and service level guidelines defined in the primary schedule.</p>
                    
                    <p style={{ fontWeight: 'bold', textTransform: 'uppercase', marginTop: 32, marginBottom: 12, borderBottom: '1px solid #e5e7eb', paddingBottom: 6 }}>2. Term and Termination</p>
                    <p style={{ lineHeight: 1.7, color: '#374151', textAlign: 'justify' }}>This agreement shall commence on the Effective Date and shall conclude on <strong>{formData.end || '[Select End Date]'}</strong>, unless terminated earlier by either party with a 30-day written notice in accordance with standard termination clauses.</p>

                    {formData.notes && (
                      <>
                        <p style={{ fontWeight: 'bold', textTransform: 'uppercase', marginTop: 32, marginBottom: 12, borderBottom: '1px solid #e5e7eb', paddingBottom: 6 }}>3. Special Provisions</p>
                        <p style={{ lineHeight: 1.7, color: '#374151', fontStyle: 'italic', textAlign: 'justify' }}>{formData.notes}</p>
                      </>
                    )}
                    
                    <div style={{ marginTop: 80, display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ width: '40%' }}>
                        <div style={{ borderBottom: '1px solid #111827', height: 40, display: 'flex', alignItems: 'flex-end', paddingBottom: 4, fontStyle: 'italic', color: '#4f46e5', fontSize: 16 }}>{formData.owner || 'John Doe'}</div>
                        <div style={{ fontSize: 11, marginTop: 8, fontWeight: 'bold' }}>PROVIDER AUTHORIZED SIGNATURE</div>
                        <div style={{ fontSize: 10, color: '#4b5563', marginTop: 3 }}>Tagverse Inc.</div>
                      </div>
                      <div style={{ width: '40%' }}>
                        <div style={{ borderBottom: '1px solid #111827', height: 40 }}></div>
                        <div style={{ fontSize: 11, marginTop: 8, fontWeight: 'bold' }}>CLIENT AUTHORIZED SIGNATURE</div>
                        <div style={{ fontSize: 10, color: '#4b5563', marginTop: 3 }}>{formData.client || '[Client Name]'}</div>
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
