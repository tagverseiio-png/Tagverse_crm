'use client';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

const pageInfo: Record<string, { title: string; sub: string }> = {
  dashboard: { title: 'Dashboard', sub: 'Overview of your pipeline, revenue & automation' },
  activity: { title: 'Activity Feed', sub: 'Real-time log of all CRM actions and events' },
  leads: { title: 'Leads', sub: 'Manage all lead scoring and sources' },
  pipeline: { title: 'Pipeline', sub: 'Deal stages from New Enquiry to Closed Win' },
  deals: { title: 'Deals', sub: 'All active and historical deals' },
  quotes: { title: 'Quotes', sub: 'Create and send proposals with line items' },
  invoices: { title: 'Invoices', sub: 'Track billing, payment status and overdue' },
  contracts: { title: 'Contracts', sub: 'Manage signed contracts and e-signatures' },
  payments: { title: 'Payments', sub: 'Payment history and Stripe integration' },
  email: { title: 'Email Marketing', sub: 'Cold outreach, templates and drip sequences' },
  social: { title: 'Social & Content', sub: 'Schedule posts across all platforms' },
  seo: { title: 'SEO / AEO', sub: 'Keyword rankings and AI answer engine visibility' },
  tasks: { title: 'Task Manager', sub: 'All assigned and automated tasks' },
  calendar: { title: 'Calendar', sub: 'Appointments, deadlines and team schedule' },
  team: { title: 'Team', sub: 'Manage team members, roles and permissions' },
  analytics: { title: 'Analytics', sub: 'Pipeline funnels, revenue charts and lead sources' },
  reports: { title: 'Reports', sub: 'Weekly auto-generated performance reports' },
  automation: { title: 'Automation (n8n)', sub: 'Lead ingestion, routing and trigger workflows' },
  integrations: { title: 'Integrations', sub: 'Connected apps, social APIs, and payment gateways' },
  webhooks: { title: 'Webhooks', sub: 'Inbound and outbound webhook management' },
  settings: { title: 'Settings', sub: 'Account, team and notification preferences' },
};

interface Props { activePage: string; }

export default function Topbar({ activePage }: Props) {
  const page = pageInfo[activePage] || { title: 'Tagverse CRM', sub: '' };
  const { theme, setTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{page.title}</div>
        <div className="topbar-sub">{page.sub}</div>
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
          <span style={{ fontSize: 13 }}>🔍</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Search anything...</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 20, background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>⌘K</span>
        </div>



        <button className="btn btn-ghost" style={{ position: 'relative' }}>
          🔔
          <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, background: 'var(--rose)', borderRadius: '50%', border: '1px solid var(--bg-secondary)' }} />
        </button>

        <div style={{ position: 'relative' }}>
          <div 
            className="user-pill" 
            style={{
              marginLeft: '12px',
              cursor: 'pointer',
              background: 'rgba(123, 47, 255, 0.18)',
              border: '1px solid rgba(155, 48, 255, 0.35)',
              borderRadius: '999px',
              padding: '5px 12px 5px 6px',
            }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="user-avatar" style={{
              background: 'linear-gradient(135deg, #7B2FFF, #9B30FF)',
              boxShadow: '0 0 10px rgba(155, 48, 255, 0.5)',
              border: '2px solid rgba(255,255,255,0.25)',
            }}>JL</div>
            <div className="user-info">
              <div className="name" style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>Jose L.</div>
              <div className="role" style={{ color: 'rgba(224, 208, 255, 0.7)', fontSize: 10 }}>Administrator</div>
            </div>
            <span style={{ fontSize: 10, color: 'rgba(224,208,255,0.6)', marginLeft: '8px', transform: isProfileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
          </div>

          {isProfileOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: 220,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              padding: '8px',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Jose L.</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>jose@tagverse.com</div>
              </div>
              {[
                { icon: '👤', label: 'My Profile' },
                { icon: '⚙️', label: 'Account Settings' },
                { icon: '💳', label: 'Billing & Plan' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10 }} className="dropdown-item hover-bg">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
              <div style={{ padding: '8px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Appearance</div>
                <div className="theme-switcher" style={{ width: '100%', padding: 4, display: 'flex' }}>
                  {(['light', 'dark', 'system'] as const).map(t => (
                    <button
                      key={t}
                      onClick={(e) => { e.stopPropagation(); setTheme(t); }}
                      className={`theme-btn ${theme === t ? 'active' : ''}`}
                      title={`Switch to ${t} theme`}
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <span className="theme-icon">
                        {t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '💻'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              <div style={{ padding: '8px 12px', fontSize: 13, color: 'var(--rose)', cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10 }} className="dropdown-item hover-bg">
                <span>🚪</span>
                <span>Sign out</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
