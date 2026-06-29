'use client';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const kpis = [
  { label: 'Total Leads', value: '1,284', delta: '+18% this week', trend: 'up', color: 'purple', icon: '👤' },
  { label: 'Active Deals', value: '47', delta: '+5 new today', trend: 'up', color: 'blue', icon: '🤝' },
  { label: 'Monthly Revenue', value: '₹2.4L', delta: '+12% vs last month', trend: 'up', color: 'emerald', icon: '💰' },
  { label: 'Invoices Overdue', value: '3', delta: '−2 from last week', trend: 'down', color: 'amber', icon: '🧾' },
  { label: 'Bounce-Rate', value: '34.2%', delta: '+3.1% this campaign', trend: 'up', color: 'rose', icon: '✉' },
];

const pipelineStages = [
  {
    id: 'new', label: 'New Enquiry', color: 'new', deals: [
      { name: 'Riya Sharma', company: 'BloomAds', value: '₹45K', owner: 'JS' },
      { name: 'Karthik R.', company: 'TechVibe', value: '₹80K', owner: 'AM' },
      { name: 'Meera N.', company: 'FreshBrand', value: '₹30K', owner: 'JS' },
    ]
  },
  {
    id: 'engaged', label: 'Engaged', color: 'engaged', deals: [
      { name: 'Arjun Mehta', company: 'GrowthLab', value: '₹1.2L', owner: 'SA' },
      { name: 'Priya K.', company: 'NexaDigital', value: '₹60K', owner: 'JS' },
    ]
  },
  {
    id: 'qualified', label: 'Qualified', color: 'qualified', deals: [
      { name: 'Sameer P.', company: 'MediaCo', value: '₹95K', owner: 'AM' },
      { name: 'Divya T.', company: 'BrandNest', value: '₹2.1L', owner: 'SA' },
    ]
  },
  {
    id: 'proposal', label: 'Proposal Sent', color: 'proposal', deals: [
      { name: 'Raj Verma', company: 'ScaleUp', value: '₹1.8L', owner: 'JS' },
    ]
  },
  {
    id: 'negotiation', label: 'Negotiation', color: 'negotiation', deals: [
      { name: 'Ananya S.', company: 'ClickFarm', value: '₹3.5L', owner: 'AM' },
      { name: 'Vikram L.', company: 'AdSphere', value: '₹2.8L', owner: 'JS' },
    ]
  },
  {
    id: 'won', label: 'Closed Win', color: 'won', deals: [
      { name: 'Nisha D.', company: 'BoldMark', value: '₹4.2L', owner: 'SA' },
    ]
  },
  {
    id: 'lost', label: 'Closed Lose', color: 'lost', deals: [
      { name: 'Mohit B.', company: 'SprintCo', value: '₹70K', owner: 'AM' },
    ]
  },
];

const funnel = [
  { stage: 'New Enquiry', count: 186, pct: 100, color: 'var(--blue)' },
  { stage: 'Engaged', count: 124, pct: 67, color: 'var(--purple)' },
  { stage: 'Qualified', count: 82, pct: 44, color: 'var(--amber)' },
  { stage: 'Proposal', count: 45, pct: 24, color: 'var(--purple)' },
  { stage: 'Negotiation', count: 28, pct: 15, color: 'var(--amber)' },
  { stage: 'Closed Win', count: 19, pct: 10, color: 'var(--emerald)' },
];

const activities = [
  { dot: 'purple', text: <><strong>Riya Sharma</strong> moved to <strong>Engaged</strong> stage</>, time: '2m ago' },
  { dot: 'emerald', text: <><strong>Invoice #1047</strong> marked as <strong>Paid</strong> — ₹1.8L received</>, time: '14m ago' },
  { dot: 'blue', text: <><strong>n8n</strong>: New lead from Meta Ads routed to <strong>Arjun Mehta</strong></>, time: '28m ago' },
  { dot: 'amber', text: <><strong>Quote #Q-2041</strong> sent to <strong>ScaleUp</strong> for ₹1.8L</>, time: '1h ago' },
  { dot: 'rose', text: <><strong>Drip sequence</strong> triggered for 12 new leads from campaign</>, time: '2h ago' },
  { dot: 'purple', text: <><strong>Task</strong> "Follow up — NexaDigital" due in 2 hours, assigned to <strong>JS</strong></>, time: '3h ago' },
  { dot: 'blue', text: <><strong>Instagram post</strong> published for campaign <em>SummerSocial</em></>, time: '4h ago' },
];

const recentLeads = [
  { name: 'Riya Sharma', company: 'BloomAds', source: 'Meta Ads', stage: 'new', score: 82, owner: 'JS', time: '2m ago' },
  { name: 'Arjun Mehta', company: 'GrowthLab', source: 'Website Form', stage: 'engaged', score: 71, owner: 'SA', time: '28m ago' },
  { name: 'Priya K.', company: 'NexaDigital', source: 'Referral', stage: 'engaged', score: 67, owner: 'JS', time: '1h ago' },
  { name: 'Raj Verma', company: 'ScaleUp', source: 'LinkedIn DM', stage: 'proposal', score: 91, owner: 'JS', time: '3h ago' },
  { name: 'Divya T.', company: 'BrandNest', source: 'Meta Ads', stage: 'qualified', score: 88, owner: 'SA', time: '5h ago' },
];

const tasks = [
  { title: 'Follow up — NexaDigital proposal', due: 'Today 4pm', priority: 'high', owner: 'JS' },
  { title: 'Book discovery call — GrowthLab', due: 'Today 6pm', priority: 'high', owner: 'SA' },
  { title: 'Send revised quote — ScaleUp', due: 'Tomorrow', priority: 'medium', owner: 'JS' },
  { title: 'Review SEO report — BoldMark', due: 'Thu', priority: 'low', owner: 'AM' },
];

// ─── Components ──────────────────────────────────────────────────────────────

function KpiCard({ label, value, delta, trend, color, icon }: typeof kpis[0]) {
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

function DealCard({ name, company, value, owner }: { name: string; company: string; value: string; owner: string }) {
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

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Pipeline Kanban + Funnel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 16 }}>
        {/* Kanban */}
        <div className="card" style={{ padding: '16px 18px' }}>
          <div className="section-header">
            <div>
              <div className="section-title">Deal Pipeline</div>
              <div className="section-sub">Drag deals across stages to update status</div>
            </div>
            <button className="btn btn-ghost" style={{ fontSize: 12 }}>View All →</button>
          </div>
          <div className="pipeline-board">
            {pipelineStages.map((col) => (
              <div key={col.id} className={`pipeline-col ${col.color}`}>
                <div className="pipeline-col-header">
                  <span className="pipeline-col-title">{col.label}</span>
                  <span className="pipeline-col-count">{col.deals.length}</span>
                </div>
                <div className="pipeline-cards">
                  {col.deals.map((d) => <DealCard key={d.name} {...d} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel */}
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Conversion Funnel</div>
              <div className="section-sub">This month</div>
            </div>
          </div>
          <div className="funnel-bar" style={{ gap: 10 }}>
            {funnel.map((f) => (
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
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 700, color: 'var(--emerald)' }}>10.2%</span>
              <span style={{ fontSize: 11, color: 'var(--emerald)', background: 'var(--emerald-dim)', padding: '2px 7px', borderRadius: 8 }}>↑ +1.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads + Activity + Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px 260px', gap: 16 }}>

        {/* Recent Leads */}
        <div className="card" style={{ padding: '16px 18px' }}>
          <div className="section-header">
            <div>
              <div className="section-title">Recent Leads</div>
              <div className="section-sub">Latest from Meta Ads, forms & webhooks</div>
            </div>
            <button className="btn btn-ghost" style={{ fontSize: 12 }}>All Leads →</button>
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
                {recentLeads.map((l) => (
                  <tr key={l.name} style={{ cursor: 'pointer' }}>
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
                ))}
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
            {activities.map((a, i) => (
              <div key={i} className="activity-item">
                <div className={`activity-dot ${a.dot}`} />
                <div className="activity-text">{a.text}</div>
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
            {tasks.map((t, i) => (
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
          {[
            { name: 'Lead Ingestion Pipeline', runs: '1,204', lastRun: '2m ago', status: 'active' },
            { name: 'Stage Change Automation', runs: '384', lastRun: '14m ago', status: 'active' },
            { name: 'Billing Cron (Daily 9am)', runs: '62', lastRun: '5h ago', status: 'active' },
            { name: 'Weekly Report Generator', runs: '12', lastRun: '2d ago', status: 'active' },
          ].map((wf) => (
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
