'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  dashboardKpis,
  dashboardActivityItems,
  dashboardTasks,
  dashboardWorkflows,
} from '@/lib/mockData';

function fmtINR(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
  return `₹${v}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface DealCard {
  id: string;
  name: string;
  company: string;
  value: string;
  owner: string;
}

interface PipelineStage {
  id: string;
  label: string;
  key: string;
  color: string;
  headerColor: string;
  deals: DealCard[];
}

interface FunnelItem {
  stage: string;
  count: number;
  pct: number;
  color: string;
}

interface RecentLead {
  id: string;
  name: string;
  company: string;
  source: string;
  stage: string;
  score: number;
  owner: string;
  time: string;
}

// ─── Derive JSX activity text from structured mock data ───────────────────────
function renderActivityText(a: typeof dashboardActivityItems[0]) {
  if ('leadName' in a && a.leadName) {
    return <><strong>{a.leadName}</strong> moved to <strong>{a.stage}</strong> stage</>;
  }
  if ('invoice' in a && a.invoice) {
    return <><strong>Invoice {a.invoice}</strong> {a.action} — {a.amount} received</>;
  }
  if ('source' in a && a.source) {
    return <><strong>n8n</strong>: New lead from {a.source} routed to <strong>{a.assignee}</strong></>;
  }
  if ('quote' in a && a.quote) {
    return <><strong>Quote {a.quote}</strong> sent to <strong>{a.client}</strong> for {a.amount}</>;
  }
  if ('leadCount' in a && a.leadCount) {
    return <><strong>Drip sequence</strong> triggered for {a.leadCount} new leads from campaign</>;
  }
  if ('task' in a && a.task) {
    return <><strong>Task</strong> &quot;{a.task}&quot; due in 2 hours, assigned to <strong>{a.owner}</strong></>;
  }
  if ('post' in a && a.post) {
    return <><strong>{a.post}</strong> published for campaign <em>{a.campaign}</em></>;
  }
  return null;
}

// ─── Components ──────────────────────────────────────────────────────────────

function KpiCard({ label, value, delta, trend, color, icon }: typeof dashboardKpis[0]) {
  return (
    <div className={`kpi-card ${color}`}>
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
        <div className={`kpi-icon ${color}`}>{icon}</div>
      </div>
      <div className="kpi-value">{value}</div>
      <div className={`kpi-delta ${trend}`}>{trend === 'up' ? '↑' : '↓'} {delta}</div>
    </div>
  );
}

function DealCardUI({ name, company, value, owner }: DealCard) {
  return (
    <div className="deal-card">
      <div className="deal-card-name">{name}</div>
      <div className="deal-card-company">{company}</div>
      <div className="deal-card-footer">
        <span className="deal-card-value">{value}</span>
        <div className="deal-card-avatar">{owner}</div>
      </div>
    </div>
  );
}

// ─── Skeleton loaders ─────────────────────────────────────────────────────────

function PipelineSkeleton() {
  return (
    <div className="pipeline-board" style={{ opacity: 0.5 }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="pipeline-col new">
          <div className="pipeline-col-header">
            <span className="pipeline-col-title" style={{ background: 'var(--border)', borderRadius: 4, width: 80, height: 12, display: 'inline-block' }} />
          </div>
          <div className="pipeline-cards">
            {[1, 2].map((j) => (
              <div key={j} className="deal-card" style={{ background: 'var(--border)', height: 60 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [kpis, setKpis] = useState(dashboardKpis);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelItem[]>([]);
  const [conversionRate, setConversionRate] = useState<string>('0.0');
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // KPIs
  useEffect(() => {
    fetch('/api/dashboard/kpis')
      .then(r => r.json())
      .then(json => {
        if (!json.data) return;
        const d = json.data;
        setKpis([
          { label: 'Total Leads', value: String(d.totalLeads), delta: 'All time', trend: 'up', color: 'purple', icon: '👤' },
          { label: 'Active Deals', value: String(d.activeDeals), delta: 'In pipeline', trend: 'up', color: 'blue', icon: '🤝' },
          { label: 'Monthly Revenue', value: fmtINR(d.monthlyRevenue), delta: 'Won this month', trend: 'up', color: 'emerald', icon: '💰' },
          { label: 'Invoices Overdue', value: String(d.overdueInvoices), delta: 'Needs attention', trend: 'down', color: 'amber', icon: '🧾' },
          { label: 'Email clicked', value: '34.2%', delta: '+3.1% this campaign', trend: 'up', color: 'rose', icon: '✉' },
        ]);
      })
      .catch(() => { });
  }, []);

  // Pipeline + Funnel + Recent Leads
  useEffect(() => {
    setLoadingOverview(true);
    fetch('/api/dashboard/overview')
      .then(r => r.json())
      .then(json => {
        if (!json.data) return;
        const d = json.data;
        if (d.pipelineStages?.length) setPipelineStages(d.pipelineStages);
        if (d.funnelData?.length) setFunnelData(d.funnelData);
        if (d.conversionRate) setConversionRate(d.conversionRate);
        if (d.recentLeads?.length) setRecentLeads(d.recentLeads);
      })
      .catch(() => { })
      .finally(() => setLoadingOverview(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Pipeline Kanban + Funnel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 16, alignItems: 'stretch', minHeight: 360 }}>
        {/* Kanban */}
        <div className="card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="section-header">
            <div>
              <div className="section-title">Deal Pipeline</div>
              <div className="section-sub">Drag deals across stages to update status</div>
            </div>
            <Link href="/pipeline" className="btn btn-ghost" style={{ fontSize: 12, textDecoration: 'none' }}>View All →</Link>
          </div>
          {loadingOverview ? (
            <PipelineSkeleton />
          ) : pipelineStages.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No pipeline data yet. <Link href="/pipeline" style={{ color: 'var(--purple)' }}>Set up your pipeline →</Link>
            </div>
          ) : (
            <div className="pipeline-board">
              {pipelineStages.map((col) => (
                <div key={col.id} className={`pipeline-col ${col.color}`}>
                  <div className="pipeline-col-header">
                    <span className="pipeline-col-title">{col.label}</span>
                    <span className="pipeline-col-count">{col.deals.length}</span>
                  </div>
                  <div className="pipeline-cards">
                    {col.deals.length === 0 ? (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>No deals</div>
                    ) : (
                      col.deals.map((d) => <DealCardUI key={d.id} {...d} />)
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Funnel */}
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Conversion Funnel</div>
              <div className="section-sub">This month</div>
            </div>
          </div>
          {loadingOverview ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Loading…</div>
          ) : funnelData.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>No funnel data yet</div>
          ) : (
            <>
              <div className="funnel-bar" style={{ gap: 10 }}>
                {funnelData.map((f) => (
                  <div key={f.stage} className="funnel-stage">
                    <span className="funnel-label">{f.stage}</span>
                    <div className="funnel-track">
                      <div className="funnel-fill" style={{ width: `${f.pct}%`, background: f.color }} />
                    </div>
                    <span className="funnel-count">{f.count}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, padding: '12px 0', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Overall Conversion Rate</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 700, color: 'var(--emerald)' }}>{conversionRate}%</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Leads + Activity + Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px 260px', gap: 16 }}>

        {/* Recent Leads */}
        <div className="card" style={{ padding: '16px 18px' }}>
          <div className="section-header">
            <div>
              <div className="section-title">Recent Leads</div>
              <div className="section-sub">Latest from Meta Ads, forms &amp; webhooks</div>
            </div>
            <Link href="/leads" className="btn btn-ghost" style={{ fontSize: 12, textDecoration: 'none' }}>All Leads →</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Source</th>
                  <th>Stage</th>
                  <th>Score</th>
                  <th>Owner</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {loadingOverview ? (
                  [1, 2, 3, 4].map((i) => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                        <td key={j}><span style={{ display: 'inline-block', width: '80%', height: 10, background: 'var(--border)', borderRadius: 4 }} /></td>
                      ))}
                    </tr>
                  ))
                ) : recentLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, padding: '24px 0' }}>
                      No leads yet. <Link href="/leads" style={{ color: 'var(--purple)' }}>Add your first lead →</Link>
                    </td>
                  </tr>
                ) : (
                  recentLeads.map((l) => (
                    <tr key={l.id} style={{ cursor: 'pointer' }}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{l.name}</td>
                      <td>{l.company}</td>
                      <td><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.source}</span></td>
                      <td><span className={`badge ${l.stage}`}>{l.stage}</span></td>
                      <td>
                        <span style={{ fontSize: 12, fontWeight: 700, color: l.score >= 80 ? 'var(--emerald)' : l.score >= 60 ? 'var(--amber)' : 'var(--rose)' }}>
                          {l.score}
                        </span>
                      </td>
                      <td>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white' }}>
                          {l.owner}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{l.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">
                <span className="live-dot" />Activity Feed
              </div>
            </div>
          </div>
          <div className="activity-list">
            {dashboardActivityItems.map((a, i) => (
              <div key={i} className="activity-item">
                <div className={`activity-dot ${a.dot}`} />
                <div className="activity-text">{renderActivityText(a)}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">⚡ Urgent Tasks</div>
              <div className="section-sub">Assigned to team today</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dashboardTasks.map((t, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{t.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 8,
                    background: t.priority === 'high' ? 'var(--rose-dim)' : t.priority === 'medium' ? 'var(--amber-dim)' : 'var(--blue-dim)',
                    color: t.priority === 'high' ? 'var(--rose)' : t.priority === 'medium' ? 'var(--amber)' : 'var(--brand-accent)',
                  }}>
                    {t.priority}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.due}</span>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'white' }}>{t.owner}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" style={{ width: '100%', marginTop: 12, justifyContent: 'center', fontSize: 12 }}>
            View All 7 Tasks →
          </button>
        </div>
      </div>

      {/* n8n Automation Status */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div className="section-header" style={{ marginBottom: 12 }}>
          <div>
            <div className="section-title">🤖 Automation Hub (n8n)</div>
            <div className="section-sub">Live status of active workflows</div>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--emerald)', background: 'var(--emerald-dim)', padding: '4px 10px', borderRadius: 8 }}>
            <span className="live-dot" style={{ marginRight: 0 }} />
            All systems operational
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {dashboardWorkflows.map((wf) => (
            <div key={wf.name} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{wf.name}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', marginBottom: 2 }}>{wf.runs}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>total runs · last {wf.lastRun}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
