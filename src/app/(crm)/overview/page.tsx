'use client';

import React, { useEffect, useState } from 'react';
// ── Inline SVG icons ──────────────────────────────────────────────────────────
const TrendingUp = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const TrendingDown = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
  </svg>
);
const Briefcase = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const DollarSign = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const CheckSquare = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);
const Megaphone = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);
const FileText = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);
const Loader2 = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

import styles from './overview.module.css';

const formatCurrency = (val: number) => {
  if (!val) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

export default function OverviewPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    deals: [] as any[],
    campaigns: [] as any[],
    tasks: [] as any[],
    companies: [] as any[],
    invoices: [] as any[],
    contracts: [] as any[],
    activities: [] as any[],
    assets: [] as any[],
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const fetchJson = async (url: string) => {
          try {
            const res = await fetch(url);
            if (!res.ok) return [];
            const json = await res.json();
            return json.data || json || [];
          } catch {
            return [];
          }
        };

        const [
          deals,
          campaigns,
          tasks,
          companies,
          invoices,
          contracts,
          activities,
          content
        ] = await Promise.all([
          fetchJson('/api/deals'),
          fetchJson('/api/campaigns'),
          fetchJson('/api/tasks'),
          fetchJson('/api/companies'),
          fetchJson('/api/invoices'),
          fetchJson('/api/contracts'),
          fetchJson('/api/activities'),
          fetchJson('/api/content')
        ]);

        setData({
          deals: Array.isArray(deals) ? deals : [],
          campaigns: Array.isArray(campaigns) ? campaigns : [],
          tasks: Array.isArray(tasks) ? tasks : [],
          companies: Array.isArray(companies) ? companies : [],
          invoices: Array.isArray(invoices) ? invoices : [],
          contracts: Array.isArray(contracts) ? contracts : [],
          activities: Array.isArray(activities) ? activities : [],
          assets: Array.isArray(content) ? content : [],
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--brand-accent)' }}>
        <Loader2 size={48} />
        <style dangerouslySetInnerHTML={{ __html: `.spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }` }} />
      </div>
    );
  }

  // Pre-calculate KPIs
  const activeDealsCount = data.deals.filter(d => d.stage?.toLowerCase() !== 'closed won' && d.stage?.toLowerCase() !== 'closed lost').length;
  const pipelineValue = data.deals.filter(d => d.stage?.toLowerCase() !== 'closed won' && d.stage?.toLowerCase() !== 'closed lost').reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const openTasksCount = data.tasks.filter(t => t.status !== 'done' && t.status !== 'Completed').length;
  const activeCampaignsCount = data.campaigns.filter(c => c.status === 'Active').length;

  const funnelStages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
  const funnelData = funnelStages.map(stage => {
    // Basic fuzzy match for stage name
    const stageDeals = data.deals.filter(d => {
      const dStage = d.stage || d.pipelineStageKey || '';
      return dStage.toLowerCase().includes(stage.toLowerCase());
    });
    return {
      stage,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0)
    };
  });

  return (
    <div className={styles.container}>
      
      {/* SECTION A: KPI Metric Bar */}
      <section className={styles.kpiGrid}>
        <div className={styles.card}>
          <div>
            <div className={styles.cardTitle}>Active Deals</div>
            <div className={styles.cardValue}>{activeDealsCount}</div>
            <div className={`${styles.cardChange} ${styles.changePositive}`}>
              <TrendingUp size={14} />
              <span>12% from last month</span>
            </div>
          </div>
          <div className={`${styles.cardIcon} ${styles.cardIconPurple}`}>
            <Briefcase size={20} />
          </div>
        </div>

        <div className={styles.card}>
          <div>
            <div className={styles.cardTitle}>Pipeline Value</div>
            <div className={styles.cardValue}>{formatCurrency(pipelineValue)}</div>
            <div className={`${styles.cardChange} ${styles.changePositive}`}>
              <TrendingUp size={14} />
              <span>8.4% growth</span>
            </div>
          </div>
          <div className={`${styles.cardIcon} ${styles.cardIconEmerald}`}>
            <DollarSign size={20} />
          </div>
        </div>

        <div className={styles.card}>
          <div>
            <div className={styles.cardTitle}>Open Tasks Today</div>
            <div className={styles.cardValue} style={{ color: 'var(--amber)' }}>{openTasksCount}</div>
            <div className={`${styles.cardChange} ${styles.changeNegative}`}>
              <TrendingDown size={14} />
              <span>Remaining work</span>
            </div>
          </div>
          <div className={`${styles.cardIcon} ${styles.cardIconAmber}`}>
            <CheckSquare size={20} />
          </div>
        </div>

        <div className={styles.card}>
          <div>
            <div className={styles.cardTitle}>Active Campaigns</div>
            <div className={styles.cardValue} style={{ color: 'var(--blue)' }}>{activeCampaignsCount}</div>
            <div className={`${styles.cardChange} ${styles.changePositive}`}>
              <TrendingUp size={14} />
              <span>Marketing ROI up</span>
            </div>
          </div>
          <div className={`${styles.cardIcon}`} style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>
            <Megaphone size={20} />
          </div>
        </div>
      </section>

      {/* SECTION B: Company Snapshot Cards */}
      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Portfolio & Stage Coverage</h2>
          <span className={styles.sectionSub}>Swipe or scroll horizontally →</span>
        </div>
        <div className={`${styles.horizontalScroll} custom-scrollbar`}>
          {data.companies.length > 0 ? data.companies.map(company => (
            <div key={company.id} className={styles.companyCard}>
              <div className={styles.companyHeader}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div className={styles.companyLogo} style={{ backgroundColor: company.color || 'var(--purple-dim)', color: 'var(--purple)' }}>
                    {company.logo || company.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className={styles.companyName}>{company.name}</h4>
                    <span className={styles.companyIndustry}>{company.industry || 'Technology'}</span>
                  </div>
                </div>
                <div className={`${styles.companyStage} ${
                  company.stage === 'Closed Won' ? styles.stageWon :
                  company.stage === 'Lead' ? styles.stageLead :
                  styles.stageActive
                }`}>
                  {company.stage || 'Active'}
                </div>
              </div>
              <div className={styles.companyMetrics}>
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>Pipeline</span>
                  <span className={styles.metricValue}>{formatCurrency(company.dealValue || 0)}</span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>Health</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div className={styles.healthBar}>
                      <div className={styles.healthFill} style={{ width: `${company.health || 85}%` }}></div>
                    </div>
                    <span className={styles.metricValue} style={{ color: 'var(--emerald)' }}>{company.health || 85}%</span>
                  </div>
                </div>
              </div>
            </div>
          )) : <div style={{ color: 'var(--text-muted)' }}>No companies found.</div>}
        </div>
      </section>
      
      {/* SECTION C: Pipeline Funnel & Top Deals (2 Column) */}
      <section className={styles.twoColumnGrid}>
        <div className={styles.listSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Pipeline Progression</h2>
              <p className={styles.sectionSub}>Distribution of company portfolios</p>
            </div>
            <span className={styles.link}>View Funnel</span>
          </div>

          <div className={styles.funnelGrid}>
            {funnelData.map((stage, idx) => {
              const colors = [
                { color: 'var(--text-secondary)' },
                { color: 'var(--brand-accent)', bg: 'var(--blue-dim)' },
                { color: 'var(--amber)', bg: 'var(--amber-dim)' },
                { color: 'var(--brand-primary)', bg: 'var(--purple-dim)' },
                { color: 'var(--emerald)', bg: 'var(--emerald-dim)' }
              ][idx];

              return (
                <div key={stage.stage} className={styles.funnelStage} style={{ background: colors.bg }}>
                  <div className={styles.funnelStageLabel} style={{ color: colors.color }}>{idx + 1}. {stage.stage}</div>
                  <div className={styles.funnelStageCount}>{stage.count}<span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}> cos</span></div>
                  <div className={styles.funnelStageValue} style={{ color: colors.color }}>{formatCurrency(stage.value)}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.listSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Top Weighted Deals</h3>
              <p className={styles.sectionSub}>Highest priority transactions</p>
            </div>
            <span className={styles.link}>View Deals</span>
          </div>

          <div className={styles.listContainer}>
            {data.deals.length > 0 ? [...data.deals].sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0)).slice(0, 4).map((deal, index) => {
              const companyName = deal.company?.name || deal.client || 'Unknown Client';
              return (
                <div key={deal.id} className={styles.listItem}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div className={styles.avatar} style={{ background: 'var(--blue-dim)', color: 'var(--brand-accent)' }}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className={styles.listTitle}>{deal.title}</div>
                      <div className={styles.listSub}>
                        <span style={{ background: 'var(--bg-glass)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{companyName}</span>
                        <span>{deal.stage || deal.pipelineStageKey}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.listRight}>
                    <div className={styles.listRightValue}>{formatCurrency(deal.value)}</div>
                    <div>{deal.expectedClose ? new Date(deal.expectedClose).toLocaleDateString() : 'TBD'}</div>
                  </div>
                </div>
              );
            }) : <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>No deals found.</div>}
          </div>
        </div>
      </section>

      {/* SECTION D: Marketing Campaigns & Recent Assets */}
      <section className={styles.twoColumnGrid}>
        <div className={styles.listSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Marketing Campaigns</h3>
              <p className={styles.sectionSub}>Recent campaign performance</p>
            </div>
            <span className={styles.link}>View Campaigns</span>
          </div>

          <div className={styles.listContainer}>
            {data.campaigns.length > 0 ? data.campaigns.slice(0, 4).map((camp, idx) => {
              // Parse out the spent string if it comes as a formatted string from the API
              let spentDisplay = typeof camp.spent === 'number' ? formatCurrency(camp.spent) : camp.spent;
              
              return (
                <div key={camp.id || idx} className={styles.listItem}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div className={styles.avatar} style={{ background: `var(--blue-dim)`, color: `var(--blue)` }}>
                      <Megaphone size={16} />
                    </div>
                    <div>
                      <div className={styles.listTitle}>{camp.name}</div>
                      <div className={styles.listSub}>
                        <span style={{ background: 'var(--bg-glass)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{camp.channel || 'Multi'}</span>
                        <span>{camp.startDate ? new Date(camp.startDate).toLocaleDateString() : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.listRight}>
                    <div className={styles.listRightValue}>{spentDisplay} <span style={{fontSize:'11px', color:'var(--text-muted)', fontWeight:500}}>spent</span></div>
                    <div style={{ color: camp.status === 'Active' ? 'var(--emerald)' : 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>{camp.status}</div>
                  </div>
                </div>
              );
            }) : <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>No active campaigns.</div>}
          </div>
        </div>

        <div className={styles.listSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Recent Assets</h3>
              <p className={styles.sectionSub}>Latest uploads from Content Hub</p>
            </div>
            <span className={styles.link}>View Assets</span>
          </div>

          <div className={styles.listContainer}>
            {data.assets.length > 0 ? data.assets.slice(0, 4).map((asset, idx) => (
              <div key={asset.id || idx} className={styles.listItem}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div className={styles.avatar} style={{ background: asset.bg || 'var(--purple-dim)', color: asset.color || 'var(--purple)' }}>
                    {asset.icon || <FileText size={16}/>}
                  </div>
                  <div>
                    <div className={styles.listTitle}>{asset.name || asset.title}</div>
                    <div className={styles.listSub}>
                      <span>{asset.size || '0 KB'}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.listRight}>
                  <div>{asset.date || asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : 'Just now'}</div>
                </div>
              </div>
            )) : <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>No assets found in Content Hub.</div>}
          </div>
        </div>
      </section>

      {/* SECTION E: Finance & Team Activity */}
      <section className={styles.twoColumnGrid}>
        <div className={styles.listSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Financials & Contracts</h3>
              <p className={styles.sectionSub}>Pending invoices and active contracts</p>
            </div>
            <span className={styles.link}>View Finance</span>
          </div>

          <div className={styles.listContainer}>
            {data.invoices.filter(i => i.status === 'Overdue' || i.status === 'Sent' || i.status === 'Pending').slice(0, 2).map((inv, idx) => (
              <div key={`inv-${inv.id || idx}`} className={styles.listItem}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div className={styles.avatar} style={{ background: 'var(--rose-dim)', color: 'var(--rose)' }}>
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className={styles.listTitle}>{inv.client || inv.company?.name || 'Unknown'}</div>
                    <div className={styles.listSub}>
                      <span>{inv.id || `INV-${idx}`}</span>
                      <span>•</span>
                      <span style={{ color: inv.status === 'Overdue' ? 'var(--rose)' : 'var(--amber)' }}>{inv.status}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.listRight}>
                  <div className={styles.listRightValue} style={{ color: inv.status === 'Overdue' ? 'var(--rose)' : 'var(--emerald)' }}>
                    {formatCurrency(inv.amount || inv.total || 0)}
                  </div>
                  <div>Due: {inv.expires || inv.dueDate ? new Date(inv.dueDate || inv.expires).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>
            ))}
            {data.contracts.length > 0 && data.contracts.slice(0, 2).map((ctr, idx) => (
              <div key={`ctr-${ctr.id || idx}`} className={styles.listItem}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div className={styles.avatar} style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <div className={styles.listTitle}>{ctr.client || ctr.company?.name || 'Unknown'}</div>
                    <div className={styles.listSub}>
                      <span>{ctr.id || `CTR-${idx}`}</span>
                      <span>•</span>
                      <span style={{ color: ctr.status === 'Expiring' ? 'var(--rose)' : 'var(--emerald)' }}>{ctr.status || 'Active'}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.listRight}>
                  <div className={styles.listRightValue} style={{color: 'var(--text-primary)'}}>{formatCurrency(ctr.valuePerYear || ctr.value || 0)}/yr</div>
                  <div>Ends: {ctr.end || ctr.endDate ? new Date(ctr.end || ctr.endDate).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>
            ))}
            {data.invoices.length === 0 && data.contracts.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>No active financials found.</div>
            )}
          </div>
        </div>

        <div className={styles.listSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Team Activity Log</h3>
              <p className={styles.sectionSub}>Latest events across the workspace</p>
            </div>
            <span className={styles.link}>View Team</span>
          </div>

          <div className={styles.listContainer}>
            {data.activities.length > 0 ? data.activities.slice(0, 4).map((act, idx) => (
              <div key={act.id || idx} className={styles.listItem}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: `var(--${act.dot || 'purple'})` }}></div>
                  <div>
                    <div className={styles.listTitle} style={{ fontSize: '13px' }}>
                      {act.title || act.description || <span>Activity from <strong style={{color:'var(--text-primary)'}}>{act.user?.name || act.assignee || 'System'}</strong></span>}
                    </div>
                    {act.amount && <div className={styles.listSub}>Value: {act.amount}</div>}
                    {act.campaign && <div className={styles.listSub}>Campaign: {act.campaign}</div>}
                  </div>
                </div>
                <div className={styles.listRight}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{act.time || (act.createdAt ? new Date(act.createdAt).toLocaleTimeString() : 'Recently')}</div>
                </div>
              </div>
            )) : <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>No recent activities found.</div>}
          </div>
        </div>
      </section>

    </div>
  );
}
