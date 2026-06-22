'use client';
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

        {/* Theme Switcher Button */}
        <div className="theme-switcher">
          {(['light', 'dark', 'system'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`theme-btn ${theme === t ? 'active' : ''}`}
              title={`Switch to ${t} theme`}
            >
              <span className="theme-icon">
                {t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '💻'}
              </span>
              <span style={{ textTransform: 'capitalize' }}>{t}</span>
            </button>
          ))}
        </div>

        <button className="btn btn-ghost" style={{ position: 'relative' }}>
          🔔
          <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, background: 'var(--rose)', borderRadius: '50%', border: '1px solid var(--bg-secondary)' }} />
        </button>


      </div>
    </div>
  );
}
