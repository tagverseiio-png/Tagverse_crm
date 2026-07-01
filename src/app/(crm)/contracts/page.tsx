'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import ContractWizard from './ContractWizard';
import ContractDetailsModal from './ContractDetailsModal';

type Contract = {
  id: string; template: string; client: string; valuePerYear: number; currency: string; start: string;
  end: string; progress: number; status: 'Active' | 'Pending Signature' | 'Expiring' | 'Terminated';
  [key: string]: any;
};

// Core relational fields — everything else the wizard collects (jurisdiction,
// seats, billingCycle, etc.) is template-specific and stored in `data`.
const CORE_FIELDS = ['template', 'client', 'employeeName', 'vendorName', 'valuePerYear', 'currency', 'start', 'end', 'status', 'progress'];

function toIsoOrUndefined(s: unknown): string | undefined {
  if (typeof s !== 'string' || !s) return undefined;
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

function fmtDateDisplay(s: unknown): string {
  if (typeof s !== 'string' || !s) return '—';
  const d = new Date(s);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function mapApiContract(c: Record<string, unknown>): Contract {
  const extra = (c.data as Record<string, unknown>) || {};
  return {
    ...extra,
    id: c.id as string,
    template: c.template as string,
    client: c.client as string,
    valuePerYear: (c.valuePerYear as number) ?? 0,
    currency: (c.currency as string) ?? 'INR',
    start: fmtDateDisplay(c.start),
    end: fmtDateDisplay(c.end),
    progress: (c.progress as number) ?? 0,
    status: c.status as Contract['status'],
  };
}

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
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '200' });
      if (search) params.set('search', search);
      if (filterStatus !== 'All') params.set('status', filterStatus);
      const res = await fetch(`/api/contracts?${params}`);
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) setContracts(json.data.map(mapApiContract));
    } catch {
      // keep current state
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => { fetchContracts(); }, [fetchContracts]);

  const filtered = useMemo(() => contracts, [contracts]);

  const totalARR = contracts.filter(c => c.status === 'Active').reduce((a, c) => a + c.valuePerYear, 0);
  const expiring = contracts.filter(c => c.status === 'Expiring').length;
  const pendingSig = contracts.filter(c => c.status === 'Pending Signature').length;
  const active = contracts.filter(c => c.status === 'Active').length;

  const openNew = () => { setEditingContract(null); setIsWizardOpen(true); };
  const openEdit = (c: Contract) => { setEditingContract(c); setIsWizardOpen(true); };
  const openView = (c: Contract) => { setViewingContract(c); };

  const handleSaveWizard = async (data: Record<string, unknown>) => {
    const primaryName = (data.client as string) || (data.employeeName as string) || (data.vendorName as string) || 'Unknown';
    if (!primaryName.trim()) return;

    const extra: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      if (!CORE_FIELDS.includes(k)) extra[k] = v;
    }

    const payload = {
      template: data.template,
      client: primaryName,
      valuePerYear: Number(data.valuePerYear) || 0,
      currency: data.currency,
      start: toIsoOrUndefined(data.start),
      end: toIsoOrUndefined(data.end),
      status: data.status,
      data: extra,
    };

    const url = editingContract ? `/api/contracts/${editingContract.id}` : '/api/contracts';
    const method = editingContract ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setIsWizardOpen(false);
      fetchContracts();
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/contracts/${id}`, { method: 'DELETE' });
    setIsWizardOpen(false);
    fetchContracts();
  };

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
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading contracts...</div>
        ) : (
        <table>
          <thead>
            <tr>
              <th>Contract</th><th>Counterparty</th><th>Type</th><th>Value / yr</th><th>Start</th><th>End</th><th style={{ minWidth: 120 }}>Progress</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => openView(c)}>
                <td><span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 11 }}>{c.id.slice(0, 8)}</span></td>
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
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => openView(c)}>
                      <i className="ti ti-eye"></i> View
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => openEdit(c)}>
                      <i className="ti ti-edit"></i> Edit
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, color: 'var(--rose)', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => handleDelete(c.id)}>
                      <i className="ti ti-trash"></i>
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
        )}
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
