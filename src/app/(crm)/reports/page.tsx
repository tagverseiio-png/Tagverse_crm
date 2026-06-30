'use client';
import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import {
  FileText, TrendingUp, DollarSign, Users, GitMerge,
  Filter, Download, Calendar, Play, Trash2, Plus, Clock,
  ChevronUp, ChevronDown, ChevronsUpDown, RefreshCw,
  CheckCircle, AlertCircle, FileSpreadsheet, File, X,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────
type SortDir = 'asc' | 'desc' | null;
type ReportType = 'sales' | 'revenue' | 'activity' | 'conversion' | 'pipeline';
type FrequencyType = 'daily' | 'weekly' | 'monthly';

// ─── Mock data ────────────────────────────────────────────────────
const AGENTS = ['All agents', 'Alex Johnson', 'Sarah Miller', 'Mike Davis', 'Elena Rodriguez', 'David Chen', 'Lisa Taylor'];
const REGIONS = ['All regions', 'North America', 'Europe', 'Asia-Pacific', 'Latin America'];
const PRODUCTS = ['All products', 'Enterprise', 'Pro', 'Starter', 'SMB'];

const TABLE_ROWS = [
  { id:1,  agent:'Alex Johnson',   region:'North America', product:'Enterprise', deals:42, revenue:125000, leads:68,  converted:34, conversion:50, pipeline:210000, status:'Won'     },
  { id:2,  agent:'Sarah Miller',   region:'Europe',        product:'Pro',        deals:28, revenue:84000,  leads:55,  converted:22, conversion:40, pipeline:140000, status:'Active'  },
  { id:3,  agent:'Mike Davis',     region:'Asia-Pacific',  product:'Enterprise', deals:35, revenue:95000,  leads:72,  converted:30, conversion:42, pipeline:185000, status:'Won'     },
  { id:4,  agent:'Elena Rodriguez',region:'Latin America', product:'Starter',    deals:15, revenue:30000,  leads:90,  converted:12, conversion:13, pipeline:55000,  status:'Active'  },
  { id:5,  agent:'David Chen',     region:'North America', product:'Pro',        deals:20, revenue:75000,  leads:40,  converted:18, conversion:45, pipeline:130000, status:'At Risk' },
  { id:6,  agent:'Lisa Taylor',    region:'Europe',        product:'Enterprise', deals:5,  revenue:250000, leads:12,  converted:5,  conversion:42, pipeline:480000, status:'Won'     },
];

const REVENUE_CHART = [
  { month:'Jan', revenue:38000, target:42000 },
  { month:'Feb', revenue:52000, target:45000 },
  { month:'Mar', revenue:47000, target:48000 },
  { month:'Apr', revenue:63000, target:52000 },
  { month:'May', revenue:58000, target:55000 },
  { month:'Jun', revenue:72000, target:58000 },
];

const PIPELINE_CHART = [
  { stage:'Lead',        value:320, color:'#3b82f6' },
  { stage:'Qualified',   value:210, color:'#8b5cf6' },
  { stage:'Proposal',    value:140, color:'#7B2FFF' },
  { stage:'Negotiation', value:85,  color:'#f59e0b' },
  { stage:'Closed Won',  value:58,  color:'#10b981' },
];

const AI_FUNNEL_DATA = [
  { stage: 'Raw Leads', value: 2500, color: '#3b82f6' },
  { stage: 'MQLs',      value: 1200, color: '#8b5cf6' },
  { stage: 'SQLs',      value: 600,  color: '#10b981' },
  { stage: 'Oppty',     value: 250,  color: '#f59e0b' },
  { stage: 'Won',       value: 150,  color: '#ec4899' },
];

const SAVED_REPORTS = [
  { id:'r1', name:'Q2 Sales Summary',          type:'sales',      createdAt:'2026-06-15', lastRun:'2026-06-28', status:'success' },
  { id:'r2', name:'Monthly Revenue Breakdown', type:'revenue',    createdAt:'2026-06-01', lastRun:'2026-06-29', status:'success' },
  { id:'r3', name:'Lead Conversion – APAC',    type:'conversion', createdAt:'2026-05-20', lastRun:'2026-06-22', status:'error'   },
  { id:'r4', name:'Pipeline Health Check',     type:'pipeline',   createdAt:'2026-06-10', lastRun:'2026-06-27', status:'success' },
];

const SCHEDULED = [
  { id:'s1', name:'Weekly Sales Digest',        frequency:'weekly',  nextRun:'2026-07-06', recipients:3, active:true  },
  { id:'s2', name:'Monthly Revenue Report',     frequency:'monthly', nextRun:'2026-07-01', recipients:5, active:true  },
  { id:'s3', name:'Daily Pipeline Snapshot',    frequency:'daily',   nextRun:'2026-06-30', recipients:2, active:false },
];

// ─── Constants ───────────────────────────────────────────────────
const REPORT_TYPES: { id: ReportType; label: string; icon: React.ElementType; color: string; accentClass: string }[] = [
  { id:'sales',      label:'Sales',           icon:TrendingUp,    color:'#7B2FFF', accentClass:'purple'  },
  { id:'revenue',    label:'Revenue',         icon:DollarSign,    color:'#10b981', accentClass:'emerald' },
  { id:'activity',   label:'Customer activity',icon:Users,        color:'#f59e0b', accentClass:'amber'   },
  { id:'conversion', label:'Lead conversion', icon:GitMerge,      color:'#3b82f6', accentClass:'blue'    },
  { id:'pipeline',   label:'Pipeline',        icon:FileText,      color:'#ec4899', accentClass:'rose'    },
];

const SUMMARY_CARDS = [
  { label:'Total revenue',    value:'$659k', delta:'+14.2%', up:true,  colorClass:'purple' },
  { label:'Deals closed',     value:'145',   delta:'+8.5%',  up:true,  colorClass:'emerald'},
  { label:'Avg conversion',   value:'38.3%', delta:'-2.1%',  up:false, colorClass:'amber'  },
  { label:'Active pipeline',  value:'$1.2M', delta:'+21%',   up:true,  colorClass:'blue'   },
];

const COLUMNS = [
  { key:'agent',      label:'Agent'        },
  { key:'region',     label:'Region'       },
  { key:'product',    label:'Product'      },
  { key:'deals',      label:'Deals'        },
  { key:'revenue',    label:'Revenue'      },
  { key:'conversion', label:'Conv. rate'   },
  { key:'pipeline',   label:'Pipeline'     },
  { key:'status',     label:'Status'       },
];

// ─── Small reusable pieces ───────────────────────────────────────
function Skeleton({ w = '100%', h = 20 }: { w?: string | number; h?: number }) {
  return (
    <div
      style={{ width: w, height: h, borderRadius: 6, background: 'rgba(155,48,255,0.08)', animation: 'pulse 1.5s ease-in-out infinite' }}
    />
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Won:     { bg:'rgba(16,185,129,0.15)', color:'#10b981' },
    Active:  { bg:'rgba(123,47,255,0.15)', color:'#9B30FF' },
    'At Risk':{ bg:'rgba(245,158,11,0.15)',color:'#f59e0b' },
    success: { bg:'rgba(16,185,129,0.15)', color:'#10b981' },
    error:   { bg:'rgba(244,63,94,0.15)',  color:'#f43f5e' },
  };
  const s = map[status] || map['Active'];
  return (
    <span style={{ padding:'2px 10px', borderRadius:99, fontSize:11, fontWeight:700, background:s.bg, color:s.color, fontFamily:'Inter, sans-serif', letterSpacing:0.3 }}>
      {status}
    </span>
  );
}

function SortIcon({ col, sortKey, dir }: { col: string; sortKey: string; dir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown size={13} style={{ opacity:0.3, marginLeft:4 }} />;
  return dir === 'asc' ? <ChevronUp size={13} style={{ marginLeft:4, color:'var(--brand-accent)' }} /> : <ChevronDown size={13} style={{ marginLeft:4, color:'var(--brand-accent)' }} />;
}

// ─── Chart tooltips ──────────────────────────────────────────────
const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:10, padding:'8px 14px', fontFamily:'Inter' }}>
      <p style={{ fontWeight:700, color:'var(--text-primary)', marginBottom:4, fontSize:12 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color:p.color, fontSize:12, fontWeight:600 }}>
          {p.name}: {typeof p.value === 'number' && p.value > 999 ? `$${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

// ─── Main page ───────────────────────────────────────────────────
export default function ReportsPage() {
  // Filters
  const [reportType, setReportType] = useState<ReportType>('sales');
  const [dateRange, setDateRange]   = useState('last30');
  const [agent, setAgent]           = useState('All agents');
  const [region, setRegion]         = useState('All regions');
  const [product, setProduct]       = useState('All products');

  // UI state
  const [loading, setLoading]     = useState(false);
  const [generated, setGenerated] = useState(true);
  const [activeTab, setActiveTab] = useState<'table'|'saved'|'scheduled'>('table');
  const [sortKey, setSortKey]     = useState('revenue');
  const [sortDir, setSortDir]     = useState<SortDir>('desc');
  const [previewModal, setPreviewModal] = useState<'pdf' | 'excel' | null>(null);

  // Saved reports state
  const [saved, setSaved]           = useState(SAVED_REPORTS);
  const [scheduled, setScheduled]   = useState(SCHEDULED);

  // Generate handler
  const handleGenerate = () => {
    setLoading(true);
    setGenerated(false);
    setTimeout(() => { setLoading(false); setGenerated(true); }, 1400);
  };

  // Sort
  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sortedRows = useMemo(() => {
    return [...TABLE_ROWS].sort((a, b) => {
      const va = (a as any)[sortKey];
      const vb = (b as any)[sortKey];
      if (typeof va === 'number') return sortDir === 'asc' ? va - vb : vb - va;
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [sortKey, sortDir]);

  const activeType = REPORT_TYPES.find(r => r.id === reportType)!;

  return (
    <div className="page-content" style={{ fontFamily:'Inter, sans-serif' }}>
      {/* ── Page header ── */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Playfair Display, Georgia, serif', fontSize:26, fontWeight:700, color:'var(--text-primary)', lineHeight:1.2 }}>
          Reports
        </h1>
        <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>
          Generate, schedule and export analytical reports across your CRM data.
        </p>
      </div>

      {/* ── Report type pills ── */}
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {REPORT_TYPES.map(rt => {
          const Icon = rt.icon;
          const active = reportType === rt.id;
          return (
            <button
              key={rt.id}
              onClick={() => setReportType(rt.id)}
              style={{
                display:'flex', alignItems:'center', gap:7,
                padding:'8px 16px', borderRadius:99, border:'1px solid var(--border)',
                background: active ? rt.color : 'var(--bg-card)',
                color: active ? '#fff' : 'var(--text-secondary)',
                fontSize:13, fontWeight:600, cursor:'pointer',
                transition:'all 0.18s', fontFamily:'Inter',
                boxShadow: active ? `0 0 16px ${rt.color}50` : 'none',
              }}
            >
              <Icon size={14} />
              {rt.label}
            </button>
          );
        })}
      </div>

      {/* ── Filters row ── */}
      <div className="card" style={{ padding:'16px 20px', marginBottom:20, display:'flex', gap:12, flexWrap:'wrap', alignItems:'flex-end' }}>
        {/* Date range */}
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.8 }}>Date range</label>
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="report-select">
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="last90">Last 90 days</option>
            <option value="thisQ">This quarter</option>
            <option value="thisY">This year</option>
          </select>
        </div>

        {/* Agent */}
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.8 }}>Agent</label>
          <select value={agent} onChange={e => setAgent(e.target.value)} className="report-select">
            {AGENTS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>

        {/* Region */}
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.8 }}>Region</label>
          <select value={region} onChange={e => setRegion(e.target.value)} className="report-select">
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        {/* Product */}
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.8 }}>Product</label>
          <select value={product} onChange={e => setProduct(e.target.value)} className="report-select">
            {PRODUCTS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        {/* Spacer */}
        <div style={{ flex:1 }} />

        {/* Actions */}
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={handleGenerate} className="btn btn-primary" style={{ gap:6 }}>
            <RefreshCw size={14} />
            Generate
          </button>
          <button className="btn btn-ghost" style={{ gap:6 }}>
            <Calendar size={14} />
            Schedule
          </button>
          <div style={{ position:'relative' }} className="group">
            <button className="btn btn-ghost" style={{ gap:6 }}>
              <Download size={14} />
              Export
            </button>
            {/* Export dropdown — shows on hover via CSS in globals or just display always below */}
          </div>
        </div>

        {/* Export options inline */}
        <div style={{ display:'flex', gap:6 }}>
          {[
            { label:'PDF',   icon:File   },
            { label:'CSV',   icon:FileText  },
            { label:'Excel', icon:FileSpreadsheet },
          ].map(ex => {
            const Icon = ex.icon;
            return (
              <button
                key={ex.label}
                onClick={() => {
                  if (ex.label === 'PDF') setPreviewModal('pdf');
                  else if (ex.label === 'Excel' || ex.label === 'CSV') setPreviewModal('excel');
                }}
                className="btn btn-ghost"
                style={{ padding:'6px 12px', fontSize:12, gap:5 }}
              >
                <Icon size={13} />{ex.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:24 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
            {[1,2,3,4].map(i => <Skeleton key={i} h={90} />)}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <Skeleton h={220} />
            <Skeleton h={220} />
          </div>
          <Skeleton h={260} />
        </div>
      )}

      {/* ── Generated content ── */}
      {!loading && generated && (
        <>
          {/* Summary KPI cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
            {SUMMARY_CARDS.map(card => (
              <div key={card.label} className={`kpi-card ${card.colorClass}`}>
                <div className="kpi-header">
                  <span className="kpi-label">{card.label}</span>
                </div>
                <div className="kpi-value">{card.value}</div>
                <div className={`kpi-delta ${card.up ? 'up' : 'down'}`} style={{ marginTop:6 }}>
                  {card.up ? '↑' : '↓'} {card.delta} vs prev period
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
            {/* Revenue trend */}
            <div className="card">
              <p className="section-title" style={{ fontSize:14, marginBottom:4 }}>Revenue trend</p>
              <p className="section-sub" style={{ marginBottom:16 }}>Actual vs target (last 6 months)</p>
              <div style={{ height:200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REVENUE_CHART} margin={{ top:0, right:8, left:-20, bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(155,48,255,0.08)" />
                    <XAxis dataKey="month" tick={{ fill:'var(--text-muted)', fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:'var(--text-muted)', fontSize:11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Line type="monotone" dataKey="revenue" name="Revenue" stroke="var(--brand-accent)" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="target"  name="Target"  stroke="var(--emerald)"      strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display:'flex', gap:16, marginTop:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:12, height:3, borderRadius:2, background:'var(--brand-accent)' }} />
                  <span style={{ fontSize:11, color:'var(--text-muted)' }}>Revenue</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:12, height:3, borderRadius:2, background:'var(--emerald)', backgroundImage:'repeating-linear-gradient(90deg,var(--emerald) 0 4px,transparent 4px 8px)' }} />
                  <span style={{ fontSize:11, color:'var(--text-muted)' }}>Target</span>
                </div>
              </div>
            </div>

            {/* Pipeline funnel */}
            <div className="card">
              <p className="section-title" style={{ fontSize:14, marginBottom:4 }}>Pipeline funnel</p>
              <p className="section-sub" style={{ marginBottom:16 }}>Deal count by stage</p>
              <div style={{ height:200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PIPELINE_CHART} layout="vertical" margin={{ top:0, right:8, left:60, bottom:0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fill:'var(--text-secondary)', fontSize:11 }} />
                    <Tooltip content={<ChartTip />} />
                    <Bar dataKey="value" name="Deals" radius={[0,6,6,0]} maxBarSize={16}>
                      {PIPELINE_CHART.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── Tabs: Table / Saved / Scheduled ── */}
          <div style={{ display:'flex', gap:0, borderBottom:'1px solid var(--border)', marginBottom:16 }}>
            {[
              { id:'table',     label:'Report table' },
              { id:'saved',     label:'Saved reports' },
              { id:'scheduled', label:'Scheduled'     },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding:'10px 20px', border:'none', cursor:'pointer',
                  background:'transparent', fontFamily:'Inter', fontSize:13,
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? 'var(--brand-highlight)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--brand-highlight)' : '2px solid transparent',
                  transition:'all 0.15s', marginBottom:-1,
                }}
              >{tab.label}</button>
            ))}
          </div>

          {/* ── Report table ── */}
          {activeTab === 'table' && (
            <div className="card" style={{ padding:0, overflow:'hidden' }}>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'Inter' }}>
                  <thead>
                    <tr style={{ background:'var(--bg-secondary)', borderBottom:'1px solid var(--border)' }}>
                      {COLUMNS.map(col => (
                        <th
                          key={col.key}
                          onClick={() => handleSort(col.key)}
                          style={{
                            padding:'12px 16px', textAlign:'left', cursor:'pointer',
                            fontSize:11, fontWeight:700, color:'var(--text-muted)',
                            textTransform:'uppercase', letterSpacing:0.8,
                            userSelect:'none', whiteSpace:'nowrap',
                          }}
                        >
                          <span style={{ display:'inline-flex', alignItems:'center' }}>
                            {col.label}
                            <SortIcon col={col.key} sortKey={sortKey} dir={sortDir} />
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRows.map((row, i) => (
                      <tr
                        key={row.id}
                        style={{
                          borderBottom:'1px solid var(--border)',
                          background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                          transition:'background 0.15s',
                        }}
                      >
                        <td style={{ padding:'13px 16px', fontSize:13, fontWeight:600, color:'var(--text-primary)', whiteSpace:'nowrap' }}>{row.agent}</td>
                        <td style={{ padding:'13px 16px', fontSize:13, color:'var(--text-secondary)' }}>{row.region}</td>
                        <td style={{ padding:'13px 16px', fontSize:13, color:'var(--text-secondary)' }}>{row.product}</td>
                        <td style={{ padding:'13px 16px', fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{row.deals}</td>
                        <td style={{ padding:'13px 16px', fontSize:13, fontWeight:700, color:'var(--brand-highlight)' }}>${row.revenue.toLocaleString()}</td>
                        <td style={{ padding:'13px 16px', fontSize:13, color:'var(--text-secondary)' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div style={{ height:4, width:60, background:'var(--bg-card-hover)', borderRadius:99, overflow:'hidden' }}>
                              <div style={{ height:'100%', width:`${row.conversion}%`, background:`${row.conversion > 40 ? 'var(--emerald)' : 'var(--amber)'}`, borderRadius:99 }} />
                            </div>
                            <span style={{ fontWeight:600 }}>{row.conversion}%</span>
                          </div>
                        </td>
                        <td style={{ padding:'13px 16px', fontSize:13, color:'var(--text-secondary)' }}>${row.pipeline.toLocaleString()}</td>
                        <td style={{ padding:'13px 16px' }}><StatusBadge status={row.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Saved reports ── */}
          {activeTab === 'saved' && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {saved.length === 0 ? (
                <div className="card" style={{ textAlign:'center', padding:48 }}>
                  <FileText size={36} style={{ color:'var(--text-muted)', margin:'0 auto 12px' }} />
                  <p style={{ color:'var(--text-muted)', fontSize:14 }}>No saved reports yet. Generate a report and save it.</p>
                </div>
              ) : saved.map(r => {
                const rt = REPORT_TYPES.find(x => x.id === r.type)!;
                const Icon = rt.icon;
                return (
                  <div key={r.id} className="card" style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px' }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:`${rt.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon size={16} style={{ color:rt.color }} />
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:700, fontSize:14, color:'var(--text-primary)' }}>{r.name}</p>
                      <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>
                        Created {r.createdAt} · Last run {r.lastRun}
                      </p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      {r.status === 'success'
                        ? <CheckCircle size={15} style={{ color:'var(--emerald)' }} />
                        : <AlertCircle size={15} style={{ color:'var(--rose)' }} />}
                      <StatusBadge status={r.status} />
                    </div>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-ghost" style={{ padding:'6px 12px', fontSize:12, gap:5 }}>
                        <Play size={12} />Run
                      </button>
                      <button
                        onClick={() => setSaved(s => s.filter(x => x.id !== r.id))}
                        className="btn btn-ghost"
                        style={{ padding:'6px 10px', color:'var(--rose)', borderColor:'rgba(244,63,94,0.2)' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
              <button className="btn btn-ghost" style={{ gap:6, alignSelf:'flex-start' }}>
                <Plus size={14} />Save current report
              </button>
            </div>
          )}

          {/* ── Scheduled reports ── */}
          {activeTab === 'scheduled' && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {scheduled.map(s => (
                <div key={s.id} className="card" style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px' }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:'var(--bg-glass)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Clock size={16} style={{ color:'var(--brand-accent)' }} />
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700, fontSize:14, color:'var(--text-primary)' }}>{s.name}</p>
                    <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>
                      <span style={{ textTransform:'capitalize' }}>{s.frequency}</span> · Next run {s.nextRun} · {s.recipients} recipients
                    </p>
                  </div>
                  {/* Frequency badge */}
                  <span style={{
                    padding:'3px 11px', borderRadius:99, fontSize:11, fontWeight:700,
                    background: s.frequency === 'daily' ? 'rgba(245,158,11,0.15)' : s.frequency === 'weekly' ? 'rgba(123,47,255,0.15)' : 'rgba(59,130,246,0.15)',
                    color:      s.frequency === 'daily' ? '#f59e0b' : s.frequency === 'weekly' ? '#9B30FF' : '#3b82f6',
                    textTransform:'capitalize',
                  }}>{s.frequency}</span>
                  {/* Active toggle */}
                  <button
                    onClick={() => setScheduled(prev => prev.map(x => x.id === s.id ? { ...x, active:!x.active } : x))}
                    style={{
                      width:42, height:24, borderRadius:99, border:'none', cursor:'pointer',
                      background: s.active ? 'var(--brand-accent)' : 'var(--bg-card-hover)',
                      position:'relative', transition:'background 0.2s', flexShrink:0,
                    }}
                  >
                    <div style={{
                      position:'absolute', top:3, left: s.active ? 20 : 3,
                      width:18, height:18, borderRadius:'50%', background:'#fff',
                      transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.3)',
                    }} />
                  </button>
                  <button
                    onClick={() => setScheduled(prev => prev.filter(x => x.id !== s.id))}
                    className="btn btn-ghost"
                    style={{ padding:'6px 10px', color:'var(--rose)', borderColor:'rgba(244,63,94,0.2)' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button className="btn btn-ghost" style={{ gap:6, alignSelf:'flex-start' }}>
                <Plus size={14} />Add schedule
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Empty state (before first generate) ── */}
      {!loading && !generated && (
        <div className="card" style={{ textAlign:'center', padding:64 }}>
          <FileText size={48} style={{ color:'var(--text-muted)', margin:'0 auto 16px' }} />
          <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:20, color:'var(--text-primary)', marginBottom:8 }}>No report generated</h3>
          <p style={{ fontSize:14, color:'var(--text-muted)', marginBottom:24 }}>Select your filters above and click Generate to build a report.</p>
          <button onClick={handleGenerate} className="btn btn-primary" style={{ margin:'0 auto', gap:8 }}>
            <RefreshCw size={14} />Generate report
          </button>
        </div>
      )}

      {/* ── Preview Modal ── */}
      {previewModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 9999, padding: '2rem'
        }}>
          <div style={{
            background: 'var(--bg-primary)',
            width: '100%', maxWidth: previewModal === 'pdf' ? 794 : 1000,
            height: '90vh', borderRadius: 12, display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                  {previewModal === 'pdf' ? 'Analytical Report Preview (PDF)' : 'Spreadsheet Preview (Excel)'}
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>A4 layout optimized for export</p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    if (previewModal === 'excel') {
                      // Basic CSV export
                      const header = COLUMNS.map(c => c.label).join(',');
                      const rows = TABLE_ROWS.map(r => `${r.agent},${r.region},${r.product},${r.deals},${r.revenue},${r.conversion}%,${r.pipeline},${r.status}`).join('\\n');
                      const blob = new Blob([header + '\\n' + rows], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'CRM_Report.csv';
                      a.click();
                    } else {
                      window.print();
                    }
                  }}
                  style={{ gap: 6 }}
                >
                  <Download size={14} /> Export {previewModal === 'pdf' ? 'PDF' : 'Excel'}
                </button>
                <button className="btn btn-ghost" onClick={() => setPreviewModal(null)} style={{ padding: 8 }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="print-area" style={{ flex: 1, overflowY: 'auto', padding: 40, background: previewModal === 'pdf' ? '#fff' : 'var(--bg-primary)' }}>
              {previewModal === 'pdf' ? (
                <div style={{ color: '#000', fontFamily: 'serif', maxWidth: 700, margin: '0 auto' }}>
                  <h1 style={{ fontSize: 28, borderBottom: '2px solid #000', paddingBottom: 10, marginBottom: 20 }}>CRM Analytical Report</h1>
                  <p style={{ fontSize: 12, color: '#555', marginBottom: 30 }}>Generated on: {new Date().toLocaleDateString()}</p>
                  
                  <h2 style={{ fontSize: 18, marginTop: 20, marginBottom: 10 }}>1. Executive Summary</h2>
                  <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 15 }}>
                    This analytical report provides a comprehensive overview of the CRM performance across selected agents and regions. 
                    The data indicates strong performance in key metrics, with a total revenue of <strong>$659,000</strong> and <strong>145</strong> deals closed.
                    The active pipeline remains robust at <strong>$1.2M</strong>, suggesting healthy future conversion opportunities.
                  </p>

                  {/* AI Summary Placeholder */}
                  <div style={{ padding: '20px', background: '#f8f9fa', borderLeft: '4px solid #6366f1', marginBottom: 25, borderRadius: '0 8px 8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h4 style={{ margin: 0, fontSize: 16, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: 6 }}>
                        ✨ Comprehensive AI Insights <span style={{ fontSize: 10, background: '#e0e7ff', padding: '2px 6px', borderRadius: 4, color: '#3730a3', fontWeight: 'normal' }}>API Placeholder</span>
                      </h4>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div>
                        <p style={{ margin: '0 0 10px 0', fontSize: 13, lineHeight: 1.6, color: '#444' }}>
                          <strong>📈 Accounts & Revenue:</strong> Sustaining 142 Active accounts with an impressively low churn rate (1.2%). The total pipeline velocity remains high at $1.2M.
                        </p>
                        <p style={{ margin: '0 0 10px 0', fontSize: 13, lineHeight: 1.6, color: '#444' }}>
                          <strong>🎯 Campaign Performance:</strong> Overall marketing ROI is at 284%. Google Ads is the most efficient channel (490% ROI), while Meta Ads drives the highest raw lead volume.
                        </p>
                        <p style={{ margin: '0 0 10px 0', fontSize: 13, lineHeight: 1.6, color: '#444' }}>
                          <strong>⚡ Lead Velocity:</strong> Average time-to-close improved by 2 days, now at 12 days. The transition from MQL to SQL maintains a strong 50% conversion rate.
                        </p>
                        <em style={{ color: '#777', fontSize: 11, display: 'block', marginTop: 10 }}>Note: Insights and charts below are mock placeholders for future AI database integration.</em>
                      </div>
                      
                      {/* AI Funnel Chart */}
                      <div style={{ background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #eaeaea' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: 12, fontWeight: 600, color: '#555', textAlign: 'center' }}>Lead Conversion Funnel</p>
                        <div style={{ height: 160 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={AI_FUNNEL_DATA} layout="vertical" margin={{ top:0, right:15, left:50, bottom:0 }}>
                              <XAxis type="number" hide />
                              <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fill:'#777', fontSize:10 }} />
                              <Tooltip content={<ChartTip />} />
                              <Bar dataKey="value" name="Leads" radius={[0,4,4,0]} maxBarSize={12}>
                                {AI_FUNNEL_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 style={{ fontSize: 18, marginTop: 20, marginBottom: 10 }}>2. Key Performance Indicators</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
                    {SUMMARY_CARDS.map(card => (
                      <div key={card.label} style={{ padding: 15, border: '1px solid #ddd', borderRadius: 8 }}>
                        <div style={{ fontSize: 12, color: '#666', textTransform: 'uppercase' }}>{card.label}</div>
                        <div style={{ fontSize: 24, fontWeight: 'bold', margin: '5px 0' }}>{card.value}</div>
                        <div style={{ fontSize: 12, color: card.up ? 'green' : 'red' }}>
                          {card.up ? '↑' : '↓'} {card.delta} vs previous period
                        </div>
                      </div>
                    ))}
                  </div>

                  <h2 style={{ fontSize: 18, marginTop: 20, marginBottom: 10 }}>3. Top Performers & Regional Breakdown</h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginTop: 10 }}>
                    <thead>
                      <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #000' }}>
                        <th style={{ padding: 10, textAlign: 'left' }}>Agent</th>
                        <th style={{ padding: 10, textAlign: 'left' }}>Region</th>
                        <th style={{ padding: 10, textAlign: 'right' }}>Deals</th>
                        <th style={{ padding: 10, textAlign: 'right' }}>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_ROWS.slice(0, 5).map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                          <td style={{ padding: 10 }}>{row.agent}</td>
                          <td style={{ padding: 10 }}>{row.region}</td>
                          <td style={{ padding: 10, textAlign: 'right' }}>{row.deals}</td>
                          <td style={{ padding: 10, textAlign: 'right' }}>${row.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{ fontSize: 12, color: '#555', marginTop: 30, textAlign: 'center' }}>
                    -- End of Report --
                  </p>
                </div>
              ) : (
                <div style={{ width: '100%', overflowX: 'auto', background: 'var(--bg-primary)' }}>
                  
                  {/* AI Summary Placeholder for Spreadsheet View */}
                  <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 20 }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: 15, color: 'var(--brand-accent)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      ✨ Detailed AI Data Summary <span style={{ fontSize: 10, background: 'rgba(123,47,255,0.1)', padding: '2px 6px', borderRadius: 4, color: 'var(--brand-highlight)', fontWeight: 'normal' }}>API Placeholder</span>
                    </h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <div style={{ padding: '6px 12px', background: 'var(--bg-card)', borderRadius: 6, border: '1px solid var(--border)', flex: 1 }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Accounts</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>142 <span style={{ fontSize: 12, color: 'var(--emerald)' }}>(1.2% churn)</span></div>
                          </div>
                          <div style={{ padding: '6px 12px', background: 'var(--bg-card)', borderRadius: 6, border: '1px solid var(--border)', flex: 1 }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Campaign ROI</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>284% <span style={{ fontSize: 12, color: 'var(--emerald)' }}>↑</span></div>
                          </div>
                          <div style={{ padding: '6px 12px', background: 'var(--bg-card)', borderRadius: 6, border: '1px solid var(--border)', flex: 1 }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time to Close</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>12 Days <span style={{ fontSize: 12, color: 'var(--emerald)' }}>(-2d)</span></div>
                          </div>
                        </div>
                        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                          <strong>Insights:</strong> Pipeline is highly efficient this period. The transition from MQL to SQL holds a steady 50% conversion. Google Ads and Meta Ads combined are responsible for 70% of inbound SQLs. <em style={{ opacity: 0.7 }}>(Note: Future implementation will auto-generate this via AI API.)</em>
                        </p>
                      </div>

                      {/* Small Chart */}
                      <div style={{ background: 'var(--bg-card)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>Funnel Drop-off Analysis</p>
                        <div style={{ height: 100 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={AI_FUNNEL_DATA} layout="vertical" margin={{ top:0, right:15, left:40, bottom:0 }}>
                              <XAxis type="number" hide />
                              <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fill:'var(--text-muted)', fontSize:10 }} />
                              <Tooltip content={<ChartTip />} />
                              <Bar dataKey="value" name="Leads" radius={[0,4,4,0]} maxBarSize={10}>
                                {AI_FUNNEL_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
                    <thead>
                      <tr>
                        {COLUMNS.map(c => (
                          <th key={c.key} style={{ padding: '8px 12px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', textAlign: 'left', fontWeight: 'bold' }}>
                            {c.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_ROWS.map((row, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '8px 12px', border: '1px solid var(--border)' }}>{row.agent}</td>
                          <td style={{ padding: '8px 12px', border: '1px solid var(--border)' }}>{row.region}</td>
                          <td style={{ padding: '8px 12px', border: '1px solid var(--border)' }}>{row.product}</td>
                          <td style={{ padding: '8px 12px', border: '1px solid var(--border)' }}>{row.deals}</td>
                          <td style={{ padding: '8px 12px', border: '1px solid var(--border)' }}>${row.revenue.toLocaleString()}</td>
                          <td style={{ padding: '8px 12px', border: '1px solid var(--border)' }}>{row.conversion}%</td>
                          <td style={{ padding: '8px 12px', border: '1px solid var(--border)' }}>${row.pipeline.toLocaleString()}</td>
                          <td style={{ padding: '8px 12px', border: '1px solid var(--border)' }}>{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inline style for select elements */}
      <style>{`
        .report-select {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text-primary);
          padding: 8px 12px;
          font-size: 13px;
          font-family: Inter, sans-serif;
          font-weight: 500;
          outline: none;
          cursor: pointer;
          min-width: 140px;
          transition: border-color 0.15s;
        }
        .report-select:focus {
          border-color: var(--brand-accent);
        }
        .report-select option {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
