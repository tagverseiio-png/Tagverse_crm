'use client';
import { useState } from 'react';

const kpis = [
  { label: 'Conversion Rate', value: '18.2%', delta: '+2.4%', isUp: true, icon: '📈', color: 'blue' },
  { label: 'Avg. Time to Close', value: '42 Days', delta: '-5 Days', isUp: true, icon: '⏱', color: 'emerald' },
  { label: 'Revenue Velocity', value: '$12.4K / Day', delta: '+12%', isUp: true, icon: '📊', color: 'purple' },
  { label: 'Leakage Amount', value: '$420.5K', delta: '+4.2%', isUp: false, icon: '📉', color: 'rose' },
];

const funnelData = [
  { stage: 'LEADS', value: 840, conversion: '72%', totalPct: '100%', color: 'var(--blue)' },
  { stage: 'QUALIFIED', value: 605, conversion: '62%', totalPct: '72%', color: 'var(--purple)' },
  { stage: 'PROPOSAL', value: 375, conversion: '63%', totalPct: '45%', color: 'var(--amber)' },
  { stage: 'NEGOTIATION', value: 236, conversion: '64%', totalPct: '28%', color: 'var(--rose)' },
  { stage: 'CLOSING', value: 151, conversion: '-', totalPct: '18%', color: 'var(--emerald)' },
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
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

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

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px 20px', gap: 0, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
              {funnelData.map((stage, i) => {
                const top_pct = parseInt(stage.totalPct);
                const bottom_pct = i < funnelData.length - 1 ? parseInt(funnelData[i+1].totalPct) : top_pct;
                const isHovered = hoveredStage === stage.stage;
                
                return (
                  <div 
                    key={stage.stage} 
                    onMouseEnter={() => setHoveredStage(stage.stage)}
                    onMouseLeave={() => setHoveredStage(null)}
                    style={{ 
                      width: '100%', 
                      height: isHovered ? '90px' : '70px',
                      background: stage.color, 
                      clipPath: `polygon(${(100 - top_pct) / 2}% 0%, ${(100 + top_pct) / 2}% 0%, ${(100 + bottom_pct) / 2}% 100%, ${(100 - bottom_pct) / 2}% 100%)`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                      zIndex: isHovered ? 10 : 1,
                      position: 'relative'
                    }}>
                    <div style={{ fontSize: isHovered ? 18 : 14, fontWeight: 700, transition: 'all 0.3s' }}>
                      {stage.totalPct}
                    </div>
                    {isHovered ? (
                      <div style={{ fontSize: 13, fontWeight: 600, opacity: 1, marginTop: 4, letterSpacing: 0.5 }}>
                        {stage.stage} — {stage.value} Deals ({stage.conversion} Conv.)
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.9, marginTop: 2, letterSpacing: 0.5 }}>
                        {stage.stage} - {stage.value}
                      </div>
                    )}
                  </div>
                );
              })}
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
