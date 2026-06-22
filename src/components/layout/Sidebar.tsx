'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const topNavItems = [
  { id: 'dashboard', icon: '⬡', label: 'Dashboard', path: '/dashboard' },
  { id: 'overview', icon: '📈', label: 'Overview', path: '/overview' },
  { id: 'activity', icon: '🔔', label: 'Activity Feed', path: '/activity' },
];

const navGroups = [
  {
    id: 'crm',
    label: 'CRM',
    icon: '👥',
    items: [
      { id: 'leads', icon: '🎯', label: 'Leads', path: '/leads' },
      { id: 'contacts', icon: '📇', label: 'Contacts', path: '/contacts' },
      { id: 'pipeline', icon: '🛤️', label: 'Pipelines', path: '/pipeline' },
      { id: 'deals', icon: '🤝', label: 'Deals', path: '/deals' },
      { id: 'funnel', icon: '🔽', label: 'Funnel', path: '/funnel' },
    ],
  },
  {
    id: 'revenue',
    label: 'Revenue Hub',
    icon: '💲',
    items: [
      { id: 'quotes', icon: '📄', label: 'Quotes', path: '/quotes' },
      { id: 'invoices', icon: '🧾', label: 'Invoices', path: '/invoices' },
      { id: 'contracts', icon: '✍️', label: 'Contracts', path: '/contracts' },
      { id: 'payments', icon: '💳', label: 'Payments', path: '/payments' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: '📢',
    items: [
      { id: 'content', icon: '📝', label: 'Content Hub', path: '/content' },
      { id: 'assets', icon: '🗂️', label: 'Assets', path: '/assets' },
      { id: 'campaigns', icon: '🚀', label: 'Campaigns', path: '/campaigns' },
      { id: 'calendar', icon: '📅', label: 'Scheduling Calendar', path: '/marketing-calendar' },
      { id: 'social', icon: '📱', label: 'Social Media Manager', path: '/social' },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    icon: '📚',
    items: [
      { id: 'projects', icon: '🏗️', label: 'Projects', path: '/projects' },
      { id: 'tasks', icon: '✅', label: 'Task Manager', path: '/tasks' },
      { id: 'workspace-calendar', icon: '📆', label: 'Calendar', path: '/calendar' },
      { id: 'team', icon: '👥', label: 'Team', path: '/team' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '📊',
    items: [
      { id: 'analytics-dash', icon: '📈', label: 'Analytics Dashboard', path: '/analytics' },
      { id: 'reports', icon: '📋', label: 'Reports', path: '/reports' },
    ],
  },
  {
    id: 'integration',
    label: 'Integration Hub',
    icon: '⚙',
    items: [
      { id: 'automation', icon: '🤖', label: 'Automation Engine', path: '/automation' },
      { id: 'webhooks', icon: '🔗', label: 'Webhook Manager', path: '/webhooks' },
      { id: 'api', icon: '🚪', label: 'API Gateway', path: '/api' },
      { id: 'mcp', icon: '🖥️', label: 'MCP Server', path: '/mcp' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    crm: true,
  });

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside 
      className="sidebar"
      style={{ 
        background: '#f4f7fb',
        color: '#0f172a',
        '--text-primary': '#0f172a',
        '--text-secondary': '#334155',
        '--text-muted': '#64748b',
        '--border': '#e2e8f0',
        '--bg-card-hover': 'rgba(0, 0, 0, 0.06)',
        '--blue-dim': '#dbeafe',
        '--blue-light': '#1d4ed8',
        '--purple-dim': '#dbeafe',
        '--purple-light': '#1d4ed8',
      } as React.CSSProperties}
    >
      <div className="sidebar-logo">
        <div className="logo-mark" style={{ background: '#1d4ed8', color: '#ffffff', boxShadow: 'none' }}>T</div>
        <div>
          <div className="logo-text">Tagverse</div>
          <div className="logo-sub">CRM Platform</div>
        </div>
      </div>

      <div className="sidebar-content" style={{ overflowY: 'auto', padding: '12px 8px' }}>
        <div style={{ marginBottom: 16 }}>
          {topNavItems.map((item) => {
            const isActive = pathname === item.path || (item.path === '/dashboard' && pathname === '/');
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                <span className="icon">{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {navGroups.map((group) => {
          const isOpen = openGroups[group.id];
          return (
            <div key={group.id} className="sidebar-group" style={{ marginBottom: 8 }}>
              <button
                onClick={() => toggleGroup(group.id)}
                className="sidebar-item"
                style={{
                  width: '100%',
                  background: isOpen ? 'var(--bg-card-hover)' : 'transparent',
                  border: '1px solid',
                  borderColor: isOpen ? 'var(--border)' : 'transparent',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  justifyContent: 'space-between',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="icon" style={{ fontSize: 16 }}>{group.icon}</span>
                  <span style={{ fontWeight: 600 }}>{group.label}</span>
                </div>
                <span style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  fontSize: 10,
                  opacity: 0.6
                }}>▼</span>
              </button>

              {isOpen && (
                <div style={{
                  marginLeft: '20px',
                  paddingLeft: '12px',
                  borderLeft: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  marginTop: 6
                }}>
                  {group.items.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.id}
                        href={item.path}
                        style={{
                          textDecoration: 'none',
                          fontSize: 12,
                          color: isActive ? 'var(--blue-light)' : 'var(--text-secondary)',
                          padding: '6px 8px',
                          borderRadius: 6,
                          background: isActive ? 'var(--blue-dim)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          transition: 'all 0.2s',
                        }}
                      >
                        <span style={{ fontSize: 14, opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {isActive && <span style={{ color: 'var(--blue-light)', fontSize: 10 }}>✓</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <Link href="/settings" className="sidebar-item" style={{ textDecoration: 'none', marginBottom: 12 }}>
          <span className="icon">⚙</span>
          <span style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Settings</div>
            <div style={{ fontSize: 9, opacity: 0.5, marginTop: 2, textTransform: 'uppercase' }}>System Configuration</div>
          </span>
        </Link>
        <div className="user-pill">
          <div className="user-avatar">JL</div>
          <div className="user-info">
            <div className="name">Jose L.</div>
            <div className="role">Administrator</div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>•••</span>
        </div>
      </div>
    </aside>
  );
}

