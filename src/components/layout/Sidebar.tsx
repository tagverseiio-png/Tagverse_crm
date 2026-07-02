'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Hexagon, LineChart, Bell, Users, Target, Contact, GitBranch, Handshake, Filter,
  CircleDollarSign, FileText, Receipt, PenTool, CreditCard, Megaphone, Edit3,
  FolderOpen, Rocket, CalendarDays, Smartphone, Briefcase, Building, CheckSquare,
  Calendar, UsersRound, BarChart2, TrendingUp, ClipboardList, Settings, Bot,
  Link as LinkIcon, DoorOpen, Cpu, Truck
} from 'lucide-react';

const topNavItems = [
  { id: 'dashboard', icon: <Hexagon size={18} />, label: 'Dashboard', path: '/dashboard' },
  { id: 'overview', icon: <LineChart size={18} />, label: 'Overview', path: '/overview' },
  { id: 'activity', icon: <Bell size={18} />, label: 'Activity Feed', path: '/activity' },
];

const navGroups = [
  {
    id: 'crm',
    label: 'CRM',
    icon: <Users size={18} />,
    items: [
      { id: 'leads', icon: <Target size={16} />, label: 'Leads', path: '/leads' },
      { id: 'contacts', icon: <Contact size={16} />, label: 'Contacts', path: '/contacts' },
      { id: 'pipeline', icon: <GitBranch size={16} />, label: 'Pipelines', path: '/pipeline' },
      { id: 'deals', icon: <Handshake size={16} />, label: 'Deals', path: '/deals' },
      { id: 'funnel', icon: <Filter size={16} />, label: 'Funnel', path: '/funnel' },
    ],
  },
  {
    id: 'revenue',
    label: 'Revenue Hub',
    icon: <CircleDollarSign size={18} />,
    items: [
      { id: 'quotes', icon: <FileText size={16} />, label: 'Quotation', path: '/quotes' },
      { id: 'invoices', icon: <Receipt size={16} />, label: 'Invoices', path: '/invoices' },
      { id: 'contracts', icon: <PenTool size={16} />, label: 'Contracts', path: '/contracts' },
      { id: 'payments', icon: <CreditCard size={16} />, label: 'Payments', path: '/payments' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: <Megaphone size={18} />,
    items: [
      { id: 'content', icon: <Edit3 size={16} />, label: 'Content Hub', path: '/content' },
      { id: 'assets', icon: <FolderOpen size={16} />, label: 'Assets', path: '/assets' },
      { id: 'campaigns', icon: <Rocket size={16} />, label: 'Campaigns', path: '/campaigns' },
      { id: 'calendar', icon: <CalendarDays size={16} />, label: 'Scheduling Calendar', path: '/marketing-calendar' },
      { id: 'social', icon: <Smartphone size={16} />, label: 'Social Media Manager', path: '/social' },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    icon: <Briefcase size={18} />,
    items: [
      { id: 'projects', icon: <Building size={16} />, label: 'Projects', path: '/projects' },
      { id: 'tasks', icon: <CheckSquare size={16} />, label: 'Task Manager', path: '/tasks' },
      { id: 'workspace-calendar', icon: <Calendar size={16} />, label: 'Calendar', path: '/calendar' },
      { id: 'team', icon: <UsersRound size={16} />, label: 'Team', path: '/team' },
      { id: 'deliveries', icon: <Truck size={16} />, label: 'Deliveries', path: '/deliveries' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart2 size={18} />,
    items: [
      { id: 'analytics-dash', icon: <TrendingUp size={16} />, label: 'Analytics Dashboard', path: '/analytics' },
      { id: 'reports', icon: <ClipboardList size={16} />, label: 'Reports', path: '/reports' },
    ],
  },
  {
    id: 'integration',
    label: 'Integration Hub',
    icon: <Settings size={18} />,
    items: [
      { id: 'automation', icon: <Bot size={16} />, label: 'Automation Engine', path: '/automation' },
      { id: 'webhooks', icon: <LinkIcon size={16} />, label: 'Webhook Manager', path: '/webhooks' },
      { id: 'api', icon: <DoorOpen size={16} />, label: 'API Gateway', path: '/api' },
      { id: 'mcp', icon: <Cpu size={16} />, label: 'MCP Server', path: '/mcp' },
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
        background: '#6B00CC',
        color: '#FFFFFF',
        '--sidebar-width': isCollapsed ? '72px' : '240px',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '--text-primary': '#FFFFFF',
        '--text-secondary': '#E0D0FF',
        '--text-muted': 'rgba(224,208,255,0.5)',
        '--border': 'rgba(155,48,255,0.2)',
        '--bg-card': 'rgba(255,255,255,0.08)',
        '--bg-card-hover': 'rgba(255,255,255,0.14)',
        '--blue-dim': 'rgba(155,48,255,0.2)',
        '--blue-light': '#FFFFFF',
        '--purple-dim': 'rgba(123,47,255,0.22)',
        '--purple-light': '#E0D0FF',
      } as React.CSSProperties}
    >
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/logo.png"
            alt="Tagverse.io Logo"
            style={{
              width: isCollapsed ? 32 : 40,
              height: isCollapsed ? 32 : 40,
              borderRadius: '50%',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              objectFit: 'contain',
              background: '#ffffff'
            }}
          />
          <div style={{
            opacity: isCollapsed ? 0 : 1,
            maxWidth: isCollapsed ? 0 : 200,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div className="logo-text">TAGVERSE.IO</div>
          </div>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            marginLeft: isCollapsed ? 0 : 'auto',
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.2)',
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
          <span className="icon"><Settings size={18} /></span>
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

