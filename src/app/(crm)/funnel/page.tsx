'use client';

const kpis = [
  { label: 'Conversion Rate', value: '18.2%', delta: '+2.4%', isUp: true, icon: '📈', color: 'blue' },
  { label: 'Avg. Time to Close', value: '42 Days', delta: '-5 Days', isUp: true, icon: '⏱', color: 'emerald' },
  { label: 'Revenue Velocity', value: '$12.4K / Day', delta: '+12%', isUp: true, icon: '📊', color: 'purple' },
  { label: 'Leakage Amount', value: '$420.5K', delta: '+4.2%', isUp: false, icon: '📉', color: 'rose' },
];

const funnelData = [
  { stage: 'LEADS', value: 840, conversion: '72%', totalPct: '100%' },
  { stage: 'QUALIFIED', value: 605, conversion: '62%', totalPct: '72%' },
  { stage: 'PROPOSAL', value: 375, conversion: '63%', totalPct: '45%' },
  { stage: 'NEGOTIATION', value: 236, conversion: '64%', totalPct: '28%' },
  { stage: 'CLOSING', value: 151, conversion: '-', totalPct: '18%' },
];

const performanceMetrics = [
  { name: 'Lead Entry', volume: '840 deals', value: '$2.1M', time: '4 days', dropoff: '28%', dropColor: 'var(--text-secondary)' },
  { name: 'Qualification', volume: '605 deals', value: '$1.8M', time: '12 days', dropoff: '38%', dropColor: 'var(--rose)' },
  { name: 'Demo/Proposal', volume: '375 deals', value: '$1.2M', time: '18 days', dropoff: '37%', dropColor: 'var(--text-secondary)' },
  { name: 'Negotiation', volume: '236 deals', value: '$840K', time: '22 days', dropoff: '36%', dropColor: 'var(--text-secondary)' },
  { name: 'Closing', volume: '151 deals', value: '$560K', time: '7 days', dropoff: '12%', dropColor: 'var(--text-secondary)' },
];

const aiInsights = [
  { title: 'Leakage in Qualification', text: '38% drop-off at Qualification is higher than your team average (24%). Verify if BANT criteria is too strict.', type: 'warning' },
  { title: 'Bottleneck at Demo Stage', text: 'Average time in Proposal/Demo stage has increased to 18 days. Consider automated follow-up sequences.', type: 'warning' },
  { title: 'Closing High Velocity', text: 'Win rate at negotiation is up 5% this month. Great performance on discount management!', type: 'success' },
];

export default function FunnelPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%', paddingBottom: 24 }}>
      
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ padding: '8px 12px', border: '1px solid var(--border)', background: 'var(--bg-card)', borderRadius: 6, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            📅 Last 30 Days <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>▼</span>
          </button>
          <button style={{ padding: '8px 12px', border: '1px solid var(--border)', background: 'var(--bg-card)', borderRadius: 6, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            ⟳ Standard Pipeline <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>▼</span>
          </button>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>↓ Export Report</button>
          <button className="btn btn-primary">+ New Custom Goal</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, color: `var(--${kpi.color})` }}>{kpi.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: kpi.isUp ? 'var(--emerald)' : 'var(--rose)' }}>
                {kpi.isUp ? '↗' : '↘'} {kpi.delta}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 2 }}>{kpi.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        
        {/* Left Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Funnel Visualization */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>Funnel Visualization</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Deals flow and conversion across stages</p>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 20 }}>
                840 Total Leads
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0 20px' }}>
              {funnelData.map((stage, i) => {
                const width = 100 - (i * 12);
                const opacity = 1 - (i * 0.15);
                const isLast = i === funnelData.length - 1;
                
                return (
                  <div key={stage.stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    {/* Stage Bar */}
                    <div style={{ 
                      width: `${width}%`, 
                      background: isLast ? 'transparent' : `rgba(59, 130, 246, ${opacity})`, 
                      border: isLast ? '1px solid var(--border)' : 'none',
                      color: isLast ? 'var(--text-muted)' : '#fff',
                      padding: '12px 0', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{stage.stage}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{stage.value}</div>
                    </div>
                    
                    {/* Connection/Conversion text */}
                    {!isLast && (
                      <div style={{ margin: '8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: 12 }}>↘</span> {stage.conversion} Conversion
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                          {funnelData[i + 1].totalPct} of Total
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Last stage text */}
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>
                18% of Total
              </div>
            </div>
          </div>

          {/* Stage Performance Metrics Table */}
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Stage Performance Metrics</h3>
            <div className="table-wrap">
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px 0', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Stage Name</th>
                    <th style={{ padding: '12px 0', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Deal Volume</th>
                    <th style={{ padding: '12px 0', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Stage Value</th>
                    <th style={{ padding: '12px 0', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Avg. Time</th>
                    <th style={{ padding: '12px 0', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right' }}>Drop-off Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceMetrics.map((m, i) => (
                    <tr key={i} style={{ borderBottom: i === performanceMetrics.length - 1 ? 'none' : '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 0', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{m.name}</td>
                      <td style={{ padding: '14px 0', fontSize: 12, color: 'var(--text-secondary)' }}>{m.volume}</td>
                      <td style={{ padding: '14px 0', fontSize: 12, color: 'var(--text-secondary)' }}>{m.value}</td>
                      <td style={{ padding: '14px 0', fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14 }}>⏱</span> {m.time}
                      </td>
                      <td style={{ padding: '14px 0', textAlign: 'right' }}>
                        <span style={{ 
                          fontSize: 11, fontWeight: 700, color: m.dropColor === 'var(--rose)' ? '#fff' : m.dropColor, 
                          background: m.dropColor === 'var(--rose)' ? 'var(--rose)' : 'var(--bg-card)', 
                          padding: '3px 8px', borderRadius: 12,
                          border: m.dropColor === 'var(--rose)' ? 'none' : '1px solid var(--border)'
                        }}>{m.dropoff}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* AI Optimization */}
          <div style={{ background: 'var(--blue-dim)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 8 }}>
              💡 AI Optimization
            </h3>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '4px 0 20px 0' }}>Generated based on Q3 pipeline trends</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {aiInsights.map((insight, i) => (
                <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ fontSize: 14, marginTop: 2 }}>{insight.type === 'warning' ? '⚠' : '📈'}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{insight.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10 }}>{insight.text}</div>
                      <a href="#" style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>View Detailed Analytics</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drop-off Distribution */}
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Drop-off Distribution</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 20px 0' }}>Frequency of deals exiting the funnel</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
              {/* Grid lines */}
              <div style={{ position: 'absolute', top: 0, left: 80, right: 0, bottom: 0, display: 'flex', justifyContent: 'space-between', zIndex: 0 }}>
                {[1,2,3,4].map(line => <div key={line} style={{ width: 1, height: '100%', background: 'var(--border)', borderStyle: 'dashed' }} />)}
              </div>
              
              {[
                { stage: 'Leads', pct: 90 },
                { stage: 'Qualified', pct: 60 },
                { stage: 'Proposal', pct: 40 },
                { stage: 'Negotiation', pct: 25 },
                { stage: 'Closing', pct: 15 },
              ].map((item) => (
                <div key={item.stage} style={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
                  <div style={{ width: 80, fontSize: 11, color: 'var(--text-secondary)' }}>{item.stage}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 16, width: `${item.pct}%`, background: 'var(--blue)', borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Win/Loss Ratio */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>Win/Loss Ratio</h3>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', background: 'var(--bg-card-hover)', padding: '4px 8px', borderRadius: 12, border: '1px solid var(--border)' }}>Current Quarter</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Won Deals', pct: '64%', color: 'var(--blue)' },
                { label: 'Lost Deals', pct: '22%', color: 'var(--rose)', valColor: 'var(--rose)' },
                { label: 'In Progress', pct: '14%', color: 'var(--blue-light)' },
              ].map((ratio) => (
                <div key={ratio.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{ratio.label}</span>
                    <span style={{ color: ratio.valColor || 'var(--text-primary)' }}>{ratio.pct}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg-card-hover)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: ratio.pct, background: ratio.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
