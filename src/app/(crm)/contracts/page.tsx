'use client';
import { useState, useMemo } from 'react';
import ContractWizard from './ContractWizard';
import ContractDetailsModal from './ContractDetailsModal';

type Contract = {
  id: string; template: string; client: string; valuePerYear: number; currency: string; start: string;
  end: string; progress: number; status: 'Active' | 'Pending Signature' | 'Expiring' | 'Terminated';
  [key: string]: any;
};

const INITIAL_CONTRACTS: Contract[] = [
  { id: '#CTR-055', template: 'Service Agreement', client: 'Arka Systems', valuePerYear: 480000, currency: 'INR', start: 'Jan 1 2025', end: 'Dec 31 2025', progress: 48, status: 'Active' },
  { id: '#CTR-054', template: 'NDA', client: 'Nexus Retail', valuePerYear: 0, currency: 'USD', start: 'Mar 1 2025', end: 'Feb 28 2026', progress: 30, status: 'Pending Signature', jurisdiction: 'New York', scope: 'Financial Data & Retail Strategies' },
  { id: '#CTR-053', template: 'Employment Contract', client: 'John Connor', employeeName: 'John Connor', valuePerYear: 960000, currency: 'INR', start: 'Jul 1 2024', end: 'Jun 30 2025', progress: 91, status: 'Expiring', role: 'Senior Developer', compStructure: 'Base + Equity', probation: 'Completed' },
  { id: '#CTR-052', template: 'Vendor Agreement', client: 'Vega Partners', valuePerYear: 180000, currency: 'USD', start: 'Feb 1 2025', end: 'Jan 31 2026', progress: 35, status: 'Active', scope: 'Cloud Servers', paymentTerms: 'Net 60' },
  { id: '#CTR-051', template: 'Subscription Agreement', client: 'BlueStar Media', valuePerYear: 120000, currency: 'USD', start: 'Apr 1 2025', end: 'Mar 31 2026', progress: 20, status: 'Active', plan: 'Enterprise Tier', seats: '50', billingCycle: 'Annual' },
];

function fmt(v: number, currency: string = 'INR') {
  if (!v) return '-';
  const sym = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  if (v >= 100000 && currency === 'INR') return `${sym}${(v / 100000).toFixed(1)}L`;
  return `${sym}${v.toLocaleString('en-US')}`;
}

const STATUS_BADGE: Record<string, string> = {
  Active: 'badge emerald',
  'Pending Signature': 'badge amber',
  Expiring: 'badge rose',
  Terminated: 'badge',
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);

  const filtered = useMemo(() => contracts.filter(c => {
    const counterparty = (c.client || c.employeeName || c.vendorName || '').toLowerCase();
    const ms = counterparty.includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    return ms && (filterStatus === 'All' || c.status === filterStatus);
  }), [contracts, search, filterStatus]);

  const totalARR = contracts.filter(c => c.status === 'Active').reduce((a, c) => a + c.valuePerYear, 0);
  const expiring = contracts.filter(c => c.status === 'Expiring').length;
  const pendingSig = contracts.filter(c => c.status === 'Pending Signature').length;
  const active = contracts.filter(c => c.status === 'Active').length;

  const openNew = () => { setEditingContract(null); setIsWizardOpen(true); };
  const openEdit = (c: Contract) => { setEditingContract(c); setIsWizardOpen(true); };
  const openView = (c: Contract) => { setViewingContract(c); };
  
  const handleSaveWizard = (data: any) => {
    const primaryName = data.client || data.employeeName || data.vendorName || 'Unknown';
    if (!primaryName.trim()) return;
    
    if (editingContract) {
      setContracts(p => p.map(c => c.id === editingContract.id ? { ...c, ...data, client: primaryName } : c));
    } else {
      setContracts(p => [{
        ...data,
        id: `#CTR-${Math.floor(56 + Math.random() * 100)}`,
        client: primaryName,
        progress: 0,
      }, ...p]);
    }
    setIsWizardOpen(false);
  };
  const handleDelete = (id: string) => { setContracts(p => p.filter(c => c.id !== id)); setIsWizardOpen(false); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-writing-sign" style={{ color: 'var(--purple)', fontSize: 24 }}></i> Contracts
          </div>
          <div className="section-sub" style={{ fontSize: 13, marginTop: 4 }}>Active agreements, renewal pipeline, and ARR tracking.</div>
        </div>
        <button className="btn btn-primary" onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-plus"></i> New Contract
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Active Contracts', value: String(active), delta: '↑ 2 this month', color: 'emerald' },
          { label: 'Expiring in 30d', value: String(expiring), delta: 'Renewal needed', color: 'rose', neg: true },
          { label: 'Awaiting Signature', value: String(pendingSig), delta: 'Sent for review', color: 'amber' },
          { label: 'Total ARR', value: fmt(totalARR, 'INR'), delta: '↑ 15% YoY', color: 'purple' },
        ].map(k => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-label" style={{ marginBottom: 6 }}>{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div style={{ fontSize: 12, color: k.neg ? 'var(--rose-light)' : 'var(--emerald-light)', marginTop: 4 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }}></i>
          <input type="text" placeholder="Search contracts…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
          {['All', 'Active', 'Pending Signature', 'Expiring', 'Terminated'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card table-wrap" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>Contract</th><th>Counterparty</th><th>Type</th><th>Value / yr</th><th>Start</th><th>End</th><th style={{ minWidth: 120 }}>Progress</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => openView(c)}>
                <td><span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{c.id}</span></td>
                <td style={{ fontWeight: 500 }}>{c.client || c.employeeName || c.vendorName}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{c.template}</td>
                <td style={{ fontWeight: 700, color: 'var(--emerald-light)', fontVariantNumeric: 'tabular-nums' }}>{fmt(c.valuePerYear, c.currency)}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{c.start}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{c.end}</td>
                <td>
                  <div style={{ fontSize: 11, color: c.progress > 80 ? 'var(--rose-light)' : 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>{c.progress}%</div>
                  <div style={{ height: 5, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden', width: '100%' }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${c.progress}%`, background: c.progress > 80 ? 'var(--rose)' : 'var(--emerald)' }} />
                  </div>
                </td>
                <td><span className={STATUS_BADGE[c.status]}>{c.status}</span></td>
                <td onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {c.status === 'Expiring' && (
                      <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-refresh"></i> Renew
                      </button>
                    )}
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => openView(c)}>
                      <i className="ti ti-eye"></i> View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No contracts match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal / Wizard */}
      {isWizardOpen && (
        <ContractWizard
          onClose={() => setIsWizardOpen(false)}
          onSave={handleSaveWizard}
          initialData={editingContract || undefined}
        />
      )}
      {viewingContract && (
        <ContractDetailsModal
          contract={viewingContract}
          onClose={() => setViewingContract(null)}
        />
      )}
    </div>
  );
}
