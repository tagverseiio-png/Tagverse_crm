'use client';

const kpis = [
  { label: 'Monthly Recurring Revenue', value: '$85,420', delta: '+12.5%', isUp: true, icon: '$', color: 'blue' },
  { label: 'Active Client Accounts', value: '142', delta: '+3', isUp: true, icon: '👥', color: 'purple' },
  { label: 'Avg. Campaign ROI', value: '284%', delta: '+24.2%', isUp: true, icon: '🎯', color: 'emerald' },
  { label: 'Churn Rate (Q3)', value: '1.2%', delta: '-0.4%', isUp: false, icon: '📉', color: 'rose' },
];

const campaigns = [
  { name: 'Summer Growth 2024', id: '#CAM-124', client: 'Global Tech Inc', budget: '$12,500', spent: '$8,400', roi: '+240%', status: 'Active' },
  { name: 'Brand Awareness Q3', id: '#CAM-228', client: 'Solaris Systems', budget: '$5,000', spent: '$5,000', roi: '+115%', status: 'Completed' },
  { name: 'Lead Gen Retargeting', id: '#CAM-324', client: 'Nexus Retail', budget: '$8,000', spent: '$2,100', roi: '+310%', status: 'Active' },
  { name: 'Holiday Special Promo', id: '#CAM-424', client: 'Bright Horizon', budget: '$20,000', spent: '$0', roi: '0%', status: 'Scheduled' },
  { name: 'Product Launch X', id: '#CAM-524', client: 'Vortex Apps', budget: '$15,000', spent: '$14,800', roi: '-12%', status: 'Review' },
];

export default function AnalyticsDashboard() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, height: '100%' }}>
      {/* Main Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingRight: 8 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit, sans-serif', margin: 0, color: 'var(--text-primary)' }}>Analytics Dashboard</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Real-time performance metrics across all client accounts.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-ghost" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>⏱ Schedule Report</button>
            <button className="btn btn-primary">↓ Export Data</button>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {kpis.map((kpi, i) => (
            <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `var(--${kpi.color}-dim)`, color: `var(--${kpi.color}-light)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                  {kpi.icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, background: kpi.isUp ? 'var(--emerald-dim)' : 'var(--rose-dim)', color: kpi.isUp ? 'var(--emerald-light)' : 'var(--rose-light)', padding: '2px 6px', borderRadius: 12 }}>
                  {kpi.isUp ? '↗' : '↘'} {kpi.delta}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 2 }}>{kpi.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* MRR Trend */}
          <div className="card">
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>MRR Growth Trend</h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Monthly recurring revenue over the last 7 months</p>
            </div>
            <div style={{ height: 200, position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', position: 'absolute', width: '100%', top: 0, left: 0, zIndex: 0 }}>
                {[100, 75, 50, 25, 0].map(val => (
                  <div key={val} style={{ borderBottom: '1px dashed var(--border)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-card)', paddingRight: 8, transform: 'translateY(-50%)' }}>${val}k</span>
                  </div>
                ))}
              </div>
              <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, paddingLeft: 30, paddingBottom: 20 }}>
                <path d="M0,120 C40,110 80,130 120,110 C160,90 200,70 240,65 C280,60 320,40 360,20" fill="none" stroke="var(--blue-light)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              </svg>
              <div style={{ position: 'absolute', bottom: -5, left: 30, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)' }}>
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
              </div>
            </div>
          </div>

          {/* ROI Analysis Bar Chart */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>Platform ROI Analysis</h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Comparison of ad spend vs. generated revenue</p>
              </div>
              <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>⋮</span>
            </div>
            <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', position: 'relative', paddingLeft: 40, paddingBottom: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', position: 'absolute', width: 'calc(100% - 40px)', top: 0, left: 40, zIndex: 0 }}>
                {[42000, 31500, 21000, 10500, 0].map(val => (
                  <div key={val} style={{ borderBottom: '1px dashed var(--border)' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-card)', paddingRight: 8, position: 'absolute', left: 0, transform: 'translate(-100%, -50%)' }}>{val}</span>
                  </div>
                ))}
              </div>
              {[
                { name: 'Meta Ads', spend: 40, rev: 80 },
                { name: 'LinkedIn', spend: 20, rev: 55 },
                { name: 'TikTok', spend: 30, rev: 15 },
              ].map(plat => (
                <div key={plat.name} style={{ display: 'flex', gap: 4, height: '100%', alignItems: 'flex-end', zIndex: 1, position: 'relative' }}>
                  <div style={{ width: 16, height: `${plat.spend}%`, background: 'var(--border-bright)', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ width: 16, height: `${plat.rev}%`, background: 'var(--blue)', borderRadius: '4px 4px 0 0' }} />
                  <span style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{plat.name}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-bright)' }} /> Ad Spend
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)' }} /> Revenue
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>Active Campaign Reports</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Detailed breakdown of live marketing initiatives</p>
            </div>
            <div>
              <input type="text" placeholder="Filter reports..." style={{ padding: '8px 12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', borderRadius: 6, fontSize: 12, width: 200, outline: 'none' }} />
            </div>
          </div>
          
          <div className="table-wrap">
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Campaign Name</th>
                  <th style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Client</th>
                  <th style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Budget</th>
                  <th style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Spent</th>
                  <th style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>ROI</th>
                  <th style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>ID: {c.id}</div>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: 13 }}>{c.client}</td>
                    <td style={{ padding: '12px 8px', fontSize: 13 }}>{c.budget}</td>
                    <td style={{ padding: '12px 8px', fontSize: 13 }}>{c.spent}</td>
                    <td style={{ padding: '12px 8px', fontSize: 13, fontWeight: 600, color: c.roi.startsWith('+') ? 'var(--emerald)' : c.roi.startsWith('-') ? 'var(--rose)' : 'var(--text-muted)' }}>{c.roi}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ 
                        fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 12,
                        background: c.status === 'Active' ? 'var(--blue)' : c.status === 'Completed' ? 'var(--border)' : c.status === 'Scheduled' ? 'transparent' : 'var(--rose)',
                        color: c.status === 'Active' ? '#fff' : c.status === 'Completed' ? 'var(--text-secondary)' : c.status === 'Scheduled' ? 'var(--text-primary)' : '#fff',
                        border: c.status === 'Scheduled' ? '1px solid var(--border)' : 'none'
                      }}>{c.status}</span>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      <a href="#" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>View Details ↗</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Showing 1 to 5 of 24 reports</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ padding: '6px 12px', border: '1px solid var(--border)', background: 'transparent', borderRadius: 6, fontSize: 12, cursor: 'pointer', color: 'var(--text-muted)' }}>Previous</button>
              <button style={{ padding: '6px 12px', border: '1px solid var(--border)', background: 'var(--bg-card)', borderRadius: 6, fontSize: 12, cursor: 'pointer', color: 'var(--text-primary)' }}>Next</button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 12, padding: '0 8px' }}>
          <div>© 2024 Tagverse CRM &nbsp;&nbsp;&nbsp; Privacy Policy &nbsp;&nbsp;&nbsp; Terms of Service</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)' }} /> System Operational</div>
        </div>

      </div>

      {/* Right Sidebar Filters */}
      <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 24, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--blue)' }}>▼</span> Report Filters
          </h2>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>›</span>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>Date Range</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {['Last 30 Days', 'Last Quarter', 'Last 6 Mos', 'Year to Date'].map((r, i) => (
              <button key={r} style={{ 
                padding: '8px', border: i === 0 ? '1px solid var(--blue-light)' : '1px solid var(--border)', 
                background: i === 0 ? 'var(--blue-dim)' : 'transparent', 
                color: i === 0 ? 'var(--blue-light)' : 'var(--text-secondary)', 
                borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: i===0 ? 600 : 400 
              }}>{r}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>Marketing Channels</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Google Ads', 'Meta Ads', 'LinkedIn', 'TikTok', 'Email Marketing'].map((ch, i) => (
              <label key={ch} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked={i < 3} style={{ accentColor: 'var(--blue)' }} /> {ch}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>Client Accounts</div>
          <input type="text" placeholder="Search clients..." style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', borderRadius: 6, fontSize: 12, marginBottom: 12, outline: 'none' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Global Tech Inc', 'Solaris Systems', 'Nexus Retail', 'Bright Horizon', 'Vortex Apps', 'Zenith Logistics'].map(cl => (
              <label key={cl} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--blue)' }} /> 
                <span style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--blue-dim)', color: 'var(--blue-light)', fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 600 }}>{cl[0]}</span>
                {cl}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Apply Filters</button>
          <button style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>Reset to Defaults</button>
        </div>

        {/* Forecast Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--blue-dim)', color: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📄</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Q3 Forecast</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Estimated $120k growth</div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            Based on current spend and ROI trends, your agency is projected to hit milestones 14 days earlier than expected.
          </p>
        </div>
      </div>
    </div>
  );
}
