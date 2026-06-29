import React from 'react';

export type ContractDetailsModalProps = {
  contract: any;
  onClose: () => void;
};

export default function ContractDetailsModal({ contract, onClose }: ContractDetailsModalProps) {
  const { template, id, status, client, valuePerYear, currency, start, end, progress } = contract;

  const STATUS_COLORS: any = {
    Active: 'var(--emerald)',
    'Pending Signature': 'var(--amber)',
    Expiring: 'var(--rose)',
    Terminated: 'var(--text-muted)'
  };
  const statusColor = STATUS_COLORS[status] || 'var(--text-primary)';

  const formatCurrency = (val: number) => {
    if (!val) return '0';
    return val >= 100000 ? `${(val / 100000).toFixed(1)}L` : val.toLocaleString('en-US');
  };
  const curSymbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  const renderTimeline = () => (
    <div style={{ marginTop: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)', fontFamily: 'inherit' }}>Activity Timeline</div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--purple)' }}></div> Drafted</div>
        <div style={{ width: 30, height: 1, background: 'var(--border)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--purple)' }}></div> Legal Approved</div>
        <div style={{ width: 30, height: 1, background: 'var(--border)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: status === 'Active' ? 'var(--emerald)' : 'var(--border-bright)' }}></div> {status === 'Active' ? 'Activated' : 'Awaiting Signatures'}</div>
      </div>
    </div>
  );

  const renderSignatures = () => (
    <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
      <div style={{ flex: 1, padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8 }}>Provider Signature</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--emerald)', fontSize: 13, fontWeight: 500 }}>
          <i className="ti ti-check" style={{ fontSize: 16 }}></i> Signed (tagverse.io)
        </div>
      </div>
      <div style={{ flex: 1, padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8 }}>{template === 'Employment Contract' ? 'Employee' : 'Client'} Signature</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: status === 'Active' ? 'var(--emerald)' : 'var(--amber)', fontSize: 13, fontWeight: 500 }}>
          {status === 'Active' ? <><i className="ti ti-check" style={{ fontSize: 16 }}></i> Signed ({client || contract.employeeName || 'Client'})</> : <><i className="ti ti-clock" style={{ fontSize: 16 }}></i> Pending</>}
        </div>
      </div>
    </div>
  );

  const renderApprovals = (roles: string[]) => (
    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
      {roles.map((r, i) => (
        <span key={i} style={{ padding: '4px 8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
          <i className="ti ti-check" style={{ color: 'var(--emerald)', marginRight: 4 }}></i> {r}
        </span>
      ))}
    </div>
  );

  const renderTemplateSpecific = () => {
    switch (template) {
      case 'NDA':
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Confidential Scope</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{contract.scope || 'All IP and business plans'}</div>
              </div>
              <div className="card" style={{ padding: 16, background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Jurisdiction</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--purple-light)' }}>{contract.jurisdiction || 'Delaware'}</div>
              </div>
            </div>
            {renderApprovals(['Legal Review', 'IP Committee'])}
          </>
        );
      case 'Employment Contract':
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 24 }}>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Annual Salary</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--emerald-light)' }}>{curSymbol}{formatCurrency(valuePerYear)}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{contract.compStructure || 'Base'}</div>
              </div>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Tenure / Dates</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{start || 'TBD'} to {end || 'Permanent'}</div>
                <div style={{ height: 4, background: 'var(--bg-card)', borderRadius: 2, marginTop: 8 }}><div style={{ height: '100%', width: `${progress || 0}%`, background: 'var(--purple)', borderRadius: 2 }}></div></div>
              </div>
              <div className="card" style={{ padding: 16, borderLeft: contract.probation ? '3px solid var(--amber)' : '' }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Probation End</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{contract.probation || 'N/A'}</div>
              </div>
            </div>
            {contract.nonCompete && (
               <div style={{ padding: 12, marginTop: 16, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--rose-light)', fontSize: 12, borderRadius: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                 <i className="ti ti-alert-triangle"></i> Includes Non-Compete Clause
               </div>
            )}
          </>
        );
      case 'Vendor Agreement':
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Scope of Supply</div>
                <div style={{ fontSize: 14 }}>{contract.scope || 'General Supply'}</div>
              </div>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Payment Release</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{contract.paymentTerms || 'Net 30'}</div>
              </div>
            </div>
            {contract.notes && (
              <div style={{ padding: 12, marginTop: 16, background: 'var(--amber-alpha)', color: 'var(--amber)', fontSize: 12, borderRadius: 8, border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <strong>Handling Notes:</strong> {contract.notes}
              </div>
            )}
          </>
        );
      case 'Subscription Agreement':
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 24 }}>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Plan / Seats</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{contract.plan || 'Pro Tier'} <span style={{ color: 'var(--text-muted)' }}>({contract.seats || '1'} seats)</span></div>
              </div>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Annual Value</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--emerald-light)' }}>{curSymbol}{formatCurrency(valuePerYear)}</div>
              </div>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Billing Cycle</div>
                <div style={{ fontSize: 14 }}>{contract.billingCycle || 'Annual'}</div>
              </div>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>SLA Tier</div>
                <div style={{ fontSize: 14 }}>{contract.slaTier || 'Standard'}</div>
              </div>
            </div>
            {contract.autoRenewal && (
              <div style={{ padding: 8, marginTop: 16, display: 'inline-flex', background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 12, borderRadius: 16, gap: 6, alignItems: 'center' }}>
                <i className="ti ti-refresh" style={{ color: 'var(--emerald)' }}></i> Auto-Renewal Enabled
              </div>
            )}
          </>
        );
      case 'Partnership Agreement':
        return (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, padding: 16, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Party A</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>tagverse.io</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><i className="ti ti-arrows-exchange"></i></div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Party B</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{client || 'Partner'}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Revenue Split</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--purple-light)' }}>{contract.revenueSplit || '50/50'}</div>
                <div style={{ display: 'flex', height: 6, width: '100%', borderRadius: 3, overflow: 'hidden', marginTop: 8 }}>
                  <div style={{ width: '50%', background: 'var(--purple)' }}></div><div style={{ width: '50%', background: 'var(--purple-alpha)' }}></div>
                </div>
              </div>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Total Value</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--emerald-light)' }}>{curSymbol}{formatCurrency(valuePerYear)}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Funding Tranches: {contract.fundingTranches || 'Milestone-based'}</div>
              </div>
            </div>
            {renderApprovals(['Legal Review', 'Finance'])}
          </>
        );
      default: // Service Agreement & Custom
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Scope of Work</div>
              <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{contract.scope || 'Standard services as agreed.'}</div>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Payment Terms</div>
              <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{contract.paymentTerms || 'Standard Terms'}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 800, maxHeight: '90vh', background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{id}</div>
              <span style={{ padding: '4px 10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
                {template}
              </span>
              <span style={{ padding: '4px 10px', background: `color-mix(in srgb, ${statusColor} 15%, transparent)`, color: statusColor, border: `1px solid color-mix(in srgb, ${statusColor} 30%, transparent)`, borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                {status}
              </span>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Counterparty: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{client || contract.employeeName || contract.vendorName || 'N/A'}</span></div>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: 8 }}>
            <i className="ti ti-x" style={{ fontSize: 20 }}></i>
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          
          {/* Top KPI row for relevant templates */}
          {!['NDA', 'Employment Contract', 'Subscription Agreement', 'Partnership Agreement'].includes(template) && (
             <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
               <div>
                 <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Contract Value</div>
                 <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--emerald-light)' }}>{curSymbol}{formatCurrency(valuePerYear)}</div>
               </div>
               <div style={{ width: 1, background: 'var(--border)' }}></div>
               <div>
                 <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Duration</div>
                 <div style={{ fontSize: 15, fontWeight: 500 }}>{start || 'TBD'} to {end || 'TBD'}</div>
               </div>
             </div>
          )}

          {renderTemplateSpecific()}
          
          {renderSignatures()}
          {renderTimeline()}

          <div style={{ marginTop: 32, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
             <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)', fontFamily: 'inherit' }}><i className="ti ti-paperclip"></i> Attached Documents</div>
             <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ padding: '8px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                   <i className="ti ti-file-type-pdf" style={{ color: 'var(--rose-light)' }}></i> Signed_Contract.pdf
                </div>
                {template === 'NDA' && (
                  <div style={{ padding: '8px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                     <i className="ti ti-file-type-doc" style={{ color: 'var(--blue)' }}></i> IP_Schedule_A.docx
                  </div>
                )}
             </div>
          </div>

        </div>
        
      </div>
    </div>
  );
}
