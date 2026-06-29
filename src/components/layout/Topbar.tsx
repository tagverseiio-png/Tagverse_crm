'use client';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { chatHistoryInitial } from '@/lib/mockData';

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
const RioLogo = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#rio-line-grad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <defs>
      <linearGradient id="rio-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7B2FFF" />
        <stop offset="100%" stopColor="#C084FC" />
      </linearGradient>
    </defs>
    <path d="M 3 16 L 3 10 C 3 6.5 8 6.5 8 10 C 8 12.5 3 12.5 3 13.5 L 8 16 L 12 16 L 12 10 L 12 16 L 16 16 C 16 12 22 12 22 16 C 22 20 16 20 16 16" />
    <circle cx="12" cy="6" r="1.5" fill="#C084FC" stroke="none" />
  </svg>
);

interface Props { activePage: string; }

export default function Topbar({ activePage }: Props) {
  const page = pageInfo[activePage] || { title: 'Tagverse CRM', sub: '' };
  const { theme, setTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'agent', text: string }[]>([]);
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState(chatHistoryInitial);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [chatKey, setChatKey] = useState(0);

  const handleLoadChat = (newMessages: any[]) => {
    setMessages(newMessages);
    setChatKey(prev => prev + 1);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: chatMessage }]);
    setChatMessage('');

    // Simulate API delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'agent',
        text: 'I am analyzing your request. (Backend API integration goes here)'
      }]);
    }, 1000);
  };

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
          <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 20, background: 'var(--border)', padding: '1px 6px', borderRadius: 4 }}>⌘K</span>
        </div>

        {/* TG Agent Button */}
        <button
          className="btn btn-ghost hover-bg"
          onClick={() => setIsChatOpen(true)}
          style={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.1), rgba(155, 48, 255, 0.15))',
            color: 'var(--purple)',
            border: '1px solid rgba(123, 47, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(123, 47, 255, 0.1)'
          }}
          title="Ask Rio"
        >
          <RioLogo size={24} />
        </button>

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
              <div className="name" style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>Jose L.</div>
              <div className="role" style={{ color: 'var(--text-muted)', fontSize: 10 }}>Administrator</div>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: '8px', transform: isProfileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
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

      {/* Chat Agent Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.05) 0%, rgba(192, 132, 252, 0.15) 50%, rgba(123, 47, 255, 0.05) 100%)',
        backgroundColor: 'var(--bg-card)', /* Fallback/base color */
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundSize: '200% 200%',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        animation: 'gradientMove 8s ease infinite',
        opacity: isChatOpen ? 1 : 0,
        visibility: isChatOpen ? 'visible' : 'hidden',
        pointerEvents: isChatOpen ? 'auto' : 'none',
        transform: isChatOpen ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.98)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <style>{`
            @keyframes gradientMove {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes chatSwitch {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        {/* Main Layout Container */}
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>

          {/* History Sidebar */}
          <div style={{
            width: isChatSidebarOpen ? 280 : 0,
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'var(--bg-main)',
            borderRight: isChatSidebarOpen ? '1px solid var(--border)' : 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
          }}>
            <div style={{
              width: 280, padding: '24px 20px', display: 'flex', flexDirection: 'column', height: '100%',
              opacity: isChatSidebarOpen ? 1 : 0,
              transform: isChatSidebarOpen ? 'translateX(0)' : 'translateX(-15px)',
              transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>History</h2>
                <button onClick={() => handleLoadChat([])} style={{ 
                  background: '#5452F6', 
                  color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px',
                  fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(84, 82, 246, 0.25)'
                }} className="hover-opacity">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                  Chat
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {chatHistory.map((item) => (
                  <div 
                    key={item.id} 
                    onMouseLeave={() => setActiveDropdown(null)}
                    onClick={() => handleLoadChat(item.messages as any)}
                    style={{ 
                      padding: '12px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                      position: 'relative', overflow: 'visible'
                    }} className="hover-bg chat-history-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    
                    {editingHistoryId === item.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setChatHistory(prev => prev.map(h => h.id === item.id ? { ...h, title: editTitle } : h));
                            setEditingHistoryId(null);
                          }
                        }}
                        onBlur={() => {
                          setChatHistory(prev => prev.map(h => h.id === item.id ? { ...h, title: editTitle } : h));
                          setEditingHistoryId(null);
                        }}
                        style={{
                          flex: 1, background: 'transparent', border: '1px solid var(--purple)', outline: 'none',
                          color: 'var(--text-primary)', fontSize: 13, padding: '2px 4px', borderRadius: 4, width: '100%'
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{item.title}</span>
                    )}
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === item.id ? null : item.id);
                      }}
                      style={{ 
                        background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                        padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }} 
                      className="hover-opacity" 
                      title="Options"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>

                    {activeDropdown === item.id && (
                      <div style={{
                        position: 'absolute', right: 8, top: 32, background: 'var(--bg-card)', 
                        border: '1px solid var(--border)', borderRadius: 6, padding: 4, zIndex: 100,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', minWidth: 100
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingHistoryId(item.id);
                            setEditTitle(item.title);
                            setActiveDropdown(null);
                          }}
                          style={{
                            background: 'transparent', border: 'none', color: 'var(--text-primary)',
                            padding: '6px 12px', fontSize: 12, cursor: 'pointer', textAlign: 'left',
                            display: 'flex', alignItems: 'center', gap: 8, borderRadius: 4
                          }} className="hover-bg"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                          Rename
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatHistory(prev => prev.filter(h => h.id !== item.id));
                            setActiveDropdown(null);
                          }}
                          style={{
                            background: 'transparent', border: 'none', color: 'var(--rose)',
                            padding: '6px 12px', fontSize: 12, cursor: 'pointer', textAlign: 'left',
                            display: 'flex', alignItems: 'center', gap: 8, borderRadius: 4
                          }} className="hover-bg"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setIsChatSidebarOpen(!isChatSidebarOpen)}
              style={{
                position: 'absolute',
                left: 16,
                top: 18,
                zIndex: 10,
                width: 28, height: 28,
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'background 0.2s, border-color 0.2s'
              }}
              className="hover-bg"
              title="Toggle History"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isChatSidebarOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            {/* Top Bar of Chat */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              paddingLeft: 60,
              borderBottom: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 8,
                  background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.05), rgba(155, 48, 255, 0.1))',
                  border: '1px solid rgba(123, 47, 255, 0.2)'
                }}>
                  <RioLogo size={22} />
                </div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 15 }}>Ask Rio</span>
              </div>
              <button
                onClick={() => setIsChatSidebarOpen(false)} // Close sidebar when closing chat
                style={{ display: 'none' }}
              />
              <button
                onClick={() => { setIsChatOpen(false); setIsChatSidebarOpen(false); }}
                style={{
                  background: 'transparent', border: 'none', fontSize: 20,
                  color: 'var(--text-muted)', cursor: 'pointer', padding: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%',
                  width: 36, height: 36
                }}
                className="hover-bg"
              >
                ✕
              </button>
            </div>

            {/* Chat Content */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <div key={chatKey} style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 24px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                animation: 'chatSwitch 0.3s ease-out forwards'
              }}>
                {messages.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h1 style={{
                      fontSize: 22,
                      fontWeight: 700,
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      letterSpacing: '-0.3px'
                    }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #7B2FFF, #C084FC)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block'
                      }}>
                        Hi, Rio
                      </span>
                      <span>👋</span>
                    </h1>
                    <p style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      marginBottom: 28,
                      textAlign: 'center',
                      maxWidth: 480,
                      lineHeight: 1.5
                    }}>
                      Ask anything about your CRM data and get instant insights to make better business decisions.
                    </p>
                  </div>
                ) : (
                  <div style={{ width: '100%', maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 24 }}>
                    {messages.map((msg, idx) => (
                      <div key={idx} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        display: 'flex',
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-end',
                        gap: 8,
                        maxWidth: '85%'
                      }}>
                        {msg.role === 'user' ? (
                          <div className="user-avatar" style={{
                            background: 'linear-gradient(135deg, #7B2FFF, #9B30FF)',
                            width: 28, height: 28, fontSize: 11, flexShrink: 0
                          }}>JL</div>
                        ) : (
                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 28, height: 28, borderRadius: 8,
                            background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.05), rgba(155, 48, 255, 0.1))',
                            border: '1px solid rgba(123, 47, 255, 0.2)', flexShrink: 0
                          }}>
                            <RioLogo size={18} />
                          </div>
                        )}
                        <div style={{
                          background: msg.role === 'user' ? 'var(--purple)' : 'var(--bg-card)',
                          color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                          padding: '14px 18px',
                          borderRadius: 18,
                          borderBottomRightRadius: msg.role === 'user' ? 4 : 18,
                          borderBottomLeftRadius: msg.role === 'agent' ? 4 : 18,
                          border: msg.role === 'agent' ? '1px solid var(--border)' : 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}>
                          <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: '100%',
                  maxWidth: 700,
                  position: 'relative',
                  background: 'var(--bg-card)',
                  borderRadius: 16,
                  border: isInputFocused ? '1px solid rgba(123, 47, 255, 0.25)' : '1px solid rgba(123, 47, 255, 0.08)',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 130,
                  transform: isInputFocused ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow: isInputFocused
                    ? '0 20px 50px rgba(123, 47, 255, 0.2), 0 10px 20px rgba(0, 0, 0, 0.05)'
                    : '0 8px 30px rgba(123, 47, 255, 0.04)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <textarea
                    placeholder="Message Rio for key data insights."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    style={{
                      width: '100%',
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      resize: 'none',
                      fontFamily: 'inherit',
                      padding: 0,
                      lineHeight: 1.5
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 12 }}>
                    <button style={{
                      background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6, borderRadius: '50%'
                    }} className="hover-bg" title="Use Microphone">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                      </svg>
                    </button>
                    <button style={{
                      background: 'rgba(123, 47, 255, 0.1)', border: 'none', color: 'var(--purple)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%',
                      transition: 'background 0.2s'
                    }} className="hover-bg-purple" title="Send Message" onClick={handleSendMessage}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(-1px) translateY(1px)' }}>
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
