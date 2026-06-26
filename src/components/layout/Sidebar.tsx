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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside 
      className="sidebar"
      style={{ 
        background: '#0078d4',
        color: '#f8fafc',
        '--sidebar-width': isCollapsed ? '72px' : '240px',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '--text-primary': '#f8fafc',
        '--text-secondary': '#94a3b8',
        '--text-muted': '#475569',
        '--border': '#1e293b',
        '--bg-card': '#0f172a',
        '--bg-card-hover': '#1e293b',
        '--blue-dim': '#2563eb',
        '--blue-light': '#ffffff',
        '--purple-dim': '#1e1b4b',
        '--purple-light': '#a855f7',
      } as React.CSSProperties}
    >
      <div className="sidebar-logo">
        <div className="logo-mark" style={{ background: '#1d4ed8', color: '#ffffff', boxShadow: 'none' }}>T</div>
        <div style={{
          opacity: isCollapsed ? 0 : 1,
          maxWidth: isCollapsed ? 0 : 200,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div className="logo-text">Tagverse</div>
          <div className="logo-sub">CRM Platform</div>
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            marginLeft: isCollapsed ? 0 : 'auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: '#ffffff',
            cursor: 'pointer',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            transition: 'all 0.2s',
            userSelect: 'none',
            outline: 'none'
          }}
          className="hover-bg"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? '»' : '«'} 
        </button>
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
                style={{ textDecoration: 'none', justifyContent: isCollapsed ? 'center' : 'flex-start', color: '#ffffff' }}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="icon">{item.icon}</span>
                <span style={{ 
                  opacity: isCollapsed ? 0 : 1,
                  maxWidth: isCollapsed ? 0 : 200,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  marginLeft: isCollapsed ? 0 : 10
                }}>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {navGroups.map((group) => {
          const isOpen = openGroups[group.id];
          return (
            <div key={group.id} className="sidebar-group" style={{ marginBottom: 8 }}>
              <button
                onClick={() => { 
                  if (isCollapsed) {
                    setIsCollapsed(false);
                    setOpenGroups(prev => ({ ...prev, [group.id]: true }));
                  } else {
                    toggleGroup(group.id);
                  }
                }}
                className="sidebar-item"
                style={{
                  width: '100%',
                  background: isOpen && !isCollapsed ? 'var(--bg-card-hover)' : 'transparent',
                  border: '1px solid',
                  borderColor: isOpen && !isCollapsed ? 'var(--border)' : 'transparent',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#ffffff'
                }}
                title={isCollapsed ? group.label : undefined}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: isCollapsed ? 'center' : 'flex-start', width: '100%' }}>
                  <span className="icon" style={{ fontSize: 16 }}>{group.icon}</span>
                  <span style={{ 
                    fontWeight: 600,
                    opacity: isCollapsed ? 0 : 1,
                    maxWidth: isCollapsed ? 0 : 200,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}>{group.label}</span>
                </div>
                <span style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: 10,
                  opacity: isCollapsed ? 0 : 0.6,
                  maxWidth: isCollapsed ? 0 : 20,
                  overflow: 'hidden'
                }}>▼</span>
              </button>

              {isOpen && !isCollapsed && (
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
                          color: isActive ? 'var(--blue-light)' : '#ffffff',
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
        <Link href="/settings" className="sidebar-item" style={{ textDecoration: 'none', marginBottom: 12, justifyContent: isCollapsed ? 'center' : 'flex-start', color: '#ffffff' }} title={isCollapsed ? "Settings" : undefined}>
          <span className="icon">⚙</span>
          <span style={{ 
            opacity: isCollapsed ? 0 : 1,
            maxWidth: isCollapsed ? 0 : 200,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            marginLeft: isCollapsed ? 0 : 10
          }}>
            <div style={{ fontWeight: 600 }}>Settings</div>
            <div style={{ fontSize: 9, opacity: 0.5, marginTop: 2, textTransform: 'uppercase' }}>System Configuration</div>
          </span>
        </Link>
      </div>
    </aside>
  );
}

