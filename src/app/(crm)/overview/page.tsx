'use client';

import React from 'react';
// ── Inline SVG icons (replaces lucide-react dependency) ──────────────────────
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
const Clock = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
import { store, formatCurrency, getCompanyById, getContactById, getDealById } from '@/lib/mockData';
import styles from './overview.module.css';

export default function OverviewPage() {
  const activeDealsCount = store.deals.filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost').length;
  const pipelineValue = store.deals.filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost').reduce((sum, d) => sum + d.value, 0);
  const openTasksCount = store.activities.filter(a => a.type === 'task' && a.status !== 'done').length;
  const overdueItemsCount = store.activities.filter(a => a.type === 'deadline' && a.status === 'overdue').length;

  const funnelStages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
  const funnelData = funnelStages.map(stage => {
    const stageDeals = store.deals.filter(d => d.stage === stage);
    return {
      stage,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + d.value, 0)
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
            <div className={styles.cardValue} style={{ color: 'var(--amber-light)' }}>{openTasksCount}</div>
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
            <div className={styles.cardTitle}>Overdue Items</div>
            <div className={styles.cardValue} style={{ color: 'var(--rose-light)' }}>{overdueItemsCount}</div>
            <div className={`${styles.cardChange} ${styles.changeNegative}`}>
              <TrendingDown size={14} />
              <span>Requires attention</span>
            </div>
          </div>
          <div className={`${styles.cardIcon} ${styles.cardIconRose}`}>
            <Clock size={20} />
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
          {store.companies.map(company => (
            <div key={company.id} className={styles.companyCard}>
              <div className={styles.companyHeader}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div className={styles.companyLogo} style={{ backgroundColor: company.color }}>
                    {company.logo}
                  </div>
                  <div>
                    <h4 className={styles.companyName}>{company.name}</h4>
                    <span className={styles.companyIndustry}>{company.industry}</span>
                  </div>
                </div>
                <div className={`${styles.companyStage} ${
                  company.stage === 'Closed Won' ? styles.stageWon :
                  company.stage === 'Lead' ? styles.stageLead :
                  styles.stageActive
                }`}>
                  {company.stage}
                </div>
              </div>
              <div className={styles.companyMetrics}>
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>Pipeline</span>
                  <span className={styles.metricValue}>{formatCurrency(company.dealValue)}</span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>Health</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div className={styles.healthBar}>
                      <div className={styles.healthFill} style={{ width: `${company.health}%` }}></div>
                    </div>
                    <span className={styles.metricValue} style={{ color: 'var(--emerald-light)' }}>{company.health}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* SECTION C: Mini Pipeline Funnel */}
      <section className={styles.funnelSection}>
        <div>
          <h2 className={styles.sectionTitle}>Pipeline Progression</h2>
          <p className={styles.sectionSub}>Distribution of company portfolios and their total valuations</p>
        </div>

        <div className={styles.funnelGrid}>
          {funnelData.map((stage, idx) => {
            const colors = [
              { color: 'var(--text-secondary)' },
              { color: 'var(--blue-light)', bg: 'var(--blue-dim)' },
              { color: 'var(--amber-light)', bg: 'var(--amber-dim)' },
              { color: 'var(--purple-light)', bg: 'var(--purple-dim)' },
              { color: 'var(--emerald-light)', bg: 'var(--emerald-dim)' }
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
      </section>

      {/* SECTION D: Two Column Grid */}
      <section className={styles.twoColumnGrid}>
        
        {/* Column Left: Recent Contacts */}
        <div className={styles.listSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Recent Engagement</h3>
              <p className={styles.sectionSub}>Latest active contacts</p>
            </div>
            <span className={styles.link}>View All</span>
          </div>

          <div className={styles.listContainer}>
            {store.contacts.slice(0, 4).map(contact => {
              const company = getCompanyById(contact.company);
              return (
                <div key={contact.id} className={styles.listItem}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div className={styles.avatar}>{contact.avatar}</div>
                    <div>
                      <div className={styles.listTitle}>{contact.name}</div>
                      <div className={styles.listSub}>
                        <span>{contact.role}</span>
                        <span>•</span>
                        <span style={{ color: 'var(--text-primary)' }}>{company?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.listRight}>
                    {new Date(contact.lastContact).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column Right: Top Deals */}
        <div className={styles.listSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Top Weighted Deals</h3>
              <p className={styles.sectionSub}>Highest priority transactions</p>
            </div>
            <span className={styles.link}>Analyze Pipeline</span>
          </div>

          <div className={styles.listContainer}>
            {[...store.deals].sort((a, b) => b.value - a.value).slice(0, 4).map((deal, index) => {
              const company = getCompanyById(deal.company);
              return (
                <div key={deal.id} className={styles.listItem}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div className={styles.avatar} style={{ background: 'var(--blue-dim)', color: 'var(--blue-light)' }}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className={styles.listTitle}>{deal.title}</div>
                      <div className={styles.listSub}>
                        <span style={{ background: 'var(--bg-glass)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{company?.name}</span>
                        <span>{deal.stage}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.listRight}>
                    <div className={styles.listRightValue}>{formatCurrency(deal.value)}</div>
                    <div>{new Date(deal.closeDateTarget).toLocaleDateString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>
    </div>
  );
}
