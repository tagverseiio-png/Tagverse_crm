'use client';
import { useState, useEffect, useCallback } from 'react';

type ApiDeal = {
  pipelineStageKey: string | null;
  value: number;
};

const STAGE_DEFS = [
  { key: 'new', label: 'NEW', color: 'var(--blue)' },
  { key: 'engaged', label: 'ENGAGED', color: 'var(--purple)' },
  { key: 'qualified', label: 'QUALIFIED', color: 'var(--amber)' },
  { key: 'proposal', label: 'PROPOSAL', color: 'var(--brand-accent)' },
  { key: 'negotiation', label: 'NEGOTIATION', color: 'var(--rose)' },
  { key: 'won', label: 'WON', color: 'var(--emerald)' },
];

function fmtVal(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
  return `₹${v}`;
}

export default function FunnelPage() {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [deals, setDeals] = useState<ApiDeal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/deals?limit=1000');
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) {
        setDeals(json.data.map((d: Record<string, unknown>) => ({
          pipelineStageKey: (d.pipelineStageKey as string) ?? null,
          value: (d.value as number) ?? 0,
        })));
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDeals(); }, [fetchDeals]);

  const countFor = (key: string) => deals.filter(d => d.pipelineStageKey === key).length;
  const valueFor = (key: string) => deals.filter(d => d.pipelineStageKey === key).reduce((a, d) => a + d.value, 0);

  const funnelStages = STAGE_DEFS.map(s => ({ ...s, count: countFor(s.key), value: valueFor(s.key) }));
  const maxCount = Math.max(1, ...funnelStages.map(s => s.count));

  const totalDeals = deals.length;
  const totalValue = deals.reduce((a, d) => a + d.value, 0);
  const wonCount = countFor('won');
  const lostCount = countFor('lost');
  const lostValue = valueFor('lost');
  const inProgressCount = totalDeals - wonCount - lostCount;
  const conversionRate = totalDeals > 0 ? Math.round((wonCount / totalDeals) * 100) : 0;
  const avgDealValue = totalDeals > 0 ? Math.round(totalValue / totalDeals) : 0;

  const kpis = [
    { label: 'Total Deals', value: String(totalDeals), icon: '📊', color: 'blue' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, icon: '📈', color: 'emerald' },
    { label: 'Avg. Deal Value', value: fmtVal(avgDealValue), icon: '💰', color: 'purple' },
    { label: 'Lost Value', value: fmtVal(lostValue), icon: '📉', color: 'rose' },
  ];

  const wonPct = totalDeals > 0 ? Math.round((wonCount / totalDeals) * 100) : 0;
  const lostPct = totalDeals > 0 ? Math.round((lostCount / totalDeals) * 100) : 0;
  const inProgressPct = Math.max(0, 100 - wonPct - lostPct);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%', paddingBottom: 24 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 14, color: `var(--${kpi.color})` }}>{kpi.icon}</div>
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
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>How many deals currently sit in each stage</p>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 20 }}>
                {totalDeals} Total Deals
              </div>
            </div>

            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>Loading funnel...</div>
            ) : totalDeals === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No deals yet — create some on the Deals page.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px 20px', gap: 0, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
                {funnelStages.map((stage, i) => {
                  const top_pct = Math.max(8, Math.round((stage.count / maxCount) * 100));
                  const nextCount = i < funnelStages.length - 1 ? funnelStages[i + 1].count : stage.count;
                  const bottom_pct = i < funnelStages.length - 1 ? Math.max(8, Math.round((nextCount / maxCount) * 100)) : top_pct;
                  const isHovered = hoveredStage === stage.key;
                  const prevCount = i > 0 ? funnelStages[i - 1].count : stage.count;
                  const conversion = i === 0 ? '—' : prevCount > 0 ? `${Math.round((stage.count / prevCount) * 100)}%` : '—';

                  return (
                    <div
                      key={stage.key}
                      onMouseEnter={() => setHoveredStage(stage.key)}
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
                        {stage.count}
                      </div>
                      {isHovered ? (
                        <div style={{ fontSize: 13, fontWeight: 600, opacity: 1, marginTop: 4, letterSpacing: 0.5 }}>
                          {stage.label} — {fmtVal(stage.value)} ({conversion} vs prev.)
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.9, marginTop: 2, letterSpacing: 0.5 }}>
                          {stage.label} - {fmtVal(stage.value)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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
                    <th style={{ padding: '12px 0', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right' }}>Stage Value</th>
                  </tr>
                </thead>
                <tbody>
                  {funnelStages.map((s, i) => (
                    <tr key={s.key} style={{ borderBottom: i === funnelStages.length - 1 ? 'none' : '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 0', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{s.label}</td>
                      <td style={{ padding: '14px 0', fontSize: 12, color: 'var(--text-secondary)' }}>{s.count} deals</td>
                      <td style={{ padding: '14px 0', fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right' }}>{fmtVal(s.value)}</td>
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
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', background: 'var(--bg-card-hover)', padding: '4px 8px', borderRadius: 12, border: '1px solid var(--border)' }}>All Time</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Won Deals', pct: `${wonPct}%`, color: 'var(--emerald)' },
                { label: 'Lost Deals', pct: `${lostPct}%`, color: 'var(--rose)' },
                { label: 'In Progress', pct: `${inProgressPct}%`, color: 'var(--brand-accent)' },
              ].map((ratio) => (
                <div key={ratio.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{ratio.label}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{ratio.pct}</span>
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
