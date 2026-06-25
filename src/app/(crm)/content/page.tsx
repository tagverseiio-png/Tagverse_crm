'use client';
import { useState, useMemo } from 'react';

// ── Types ───────────────────────────────────────────────────────────────────
type Comment = { id: string; author: string; avatar: string; text: string; date: string };
type HistoryEntry = { date: string; action: string; user: string };
type ContentItem = {
  id: string; title: string; type: string; campaign: string;
  funnelStage: string; persona: string; author: string; owner: string;
  lastEdited: string; status: string; priority: string; dueDate: string;
  description: string; comments: Comment[]; history: HistoryEntry[];
};

// ── Static Config ────────────────────────────────────────────────────────────
const CONTENT_TYPES = [
  { id: 'Blog', label: 'Blog Post', colorClass: 'badge blue', icon: 'ti-file-text' },
  { id: 'Email', label: 'Email Newsletter', colorClass: 'badge purple', icon: 'ti-mail' },
  { id: 'Newsletter', label: 'Bi-weekly Newsletter', colorClass: 'badge indigo', icon: 'ti-send' },
  { id: 'Landing Page', label: 'Landing Page', colorClass: 'badge rose', icon: 'ti-layout-board-split' },
  { id: 'Case Study', label: 'Case Study', colorClass: 'badge amber', icon: 'ti-briefcase' },
  { id: 'Social Post', label: 'Social Post', colorClass: 'badge emerald', icon: 'ti-share' },
  { id: 'Ad Copy', label: 'Ad Copy', colorClass: 'badge blue', icon: 'ti-sparkles' },
  { id: 'Video Script', label: 'Video Script', colorClass: 'badge rose', icon: 'ti-video' },
  { id: 'WhatsApp Template', label: 'WhatsApp Broadcast', colorClass: 'badge emerald', icon: 'ti-message-circle' },
  { id: 'Knowledge Base Article', label: 'KB Article', colorClass: 'badge purple', icon: 'ti-books' }
];

const STAGES = [
  { id: 'Ideas', label: 'Backlog / Ideas', dotColor: 'var(--text-muted)' },
  { id: 'Draft', label: 'Drafting', dotColor: 'var(--amber)' },
  { id: 'In Review', label: 'In Review', dotColor: 'var(--blue)' },
  { id: 'Approved', label: 'Approved', dotColor: 'var(--emerald)' },
  { id: 'Scheduled', label: 'Scheduled', dotColor: 'var(--purple)' },
  { id: 'Published', label: 'Published', dotColor: 'var(--rose)' },
  { id: 'Archived', label: 'Archived', dotColor: 'var(--text-muted)' }
];

const FUNNEL_STAGES = ['Awareness', 'Consideration', 'Decision', 'Retention'];
const PERSONAS = ['Founder', 'CEO', 'Marketing Manager', 'Sales Manager', 'Agency Owner', 'Developer', 'Customer'];
const CAMPAIGNS = ['Summer Product Launch 2026', 'Inbound SEO Engine', 'Customer Success Highlights', 'SaaS Growth Playbook', 'Lead Gen Q2', 'Re-engagement Campaign'];

const WORKFLOW_STEPS = [
  { step: 1, label: 'Ideation & Write-up', icon: 'ti-pencil' },
  { step: 2, label: 'Manager Review', icon: 'ti-eye', active: true },
  { step: 3, label: 'Approval Confirmed', icon: 'ti-check' },
  { step: 4, label: 'Schedule & Publish', icon: 'ti-calendar' },
];

// ── Seed Data ────────────────────────────────────────────────────────────────
const INITIAL_CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'cnt-1', title: '10 Game-Changing AI Workflows for Marketing Teams', type: 'Blog',
    campaign: 'Inbound SEO Engine', funnelStage: 'Awareness', persona: 'Marketing Manager',
    author: 'Sarah Jenkins', owner: 'Sarah Jenkins', lastEdited: '2026-06-22',
    status: 'In Review', priority: 'High', dueDate: '2026-06-28',
    description: 'A deep-dive blueprint explaining how small-to-medium marketing agencies can hook up LLMs to their CRM to automate content generation, pipeline monitoring, and lead scoring.',
    comments: [
      { id: 'c1', author: 'Markus Vance', avatar: 'MV', text: 'Excellent Sarah. Make sure the SEO section highlights our Shopify integration.', date: '2026-06-23' },
      { id: 'c2', author: 'Sarah Jenkins', avatar: 'SJ', text: 'Good catch! Added a paragraph on sync speed and trigger webhooks.', date: '2026-06-24' }
    ],
    history: [
      { date: '2026-06-20', action: 'Created draft', user: 'Sarah Jenkins' },
      { date: '2026-06-22', action: 'Submitted for Review', user: 'Sarah Jenkins' }
    ]
  },
  {
    id: 'cnt-2', title: 'Welcome & Onboarding Sequence for Enterprise Signups', type: 'Email',
    campaign: 'Re-engagement Campaign', funnelStage: 'Retention', persona: 'Customer',
    author: 'Markus Vance', owner: 'Markus Vance', lastEdited: '2026-06-24',
    status: 'Draft', priority: 'Medium', dueDate: '2026-06-30',
    description: 'A 5-part email series guiding a user from system configuration to their first collaborative workspace, ensuring high Day-7 retention.',
    comments: [],
    history: [{ date: '2026-06-24', action: 'Created draft', user: 'Markus Vance' }]
  },
  {
    id: 'cnt-3', title: 'How Acme Corp Boosted MQL Pipeline by 240% using CRM Automation', type: 'Case Study',
    campaign: 'Customer Success Highlights', funnelStage: 'Decision', persona: 'CEO',
    author: 'Emily Thorne', owner: 'Emily Thorne', lastEdited: '2026-06-15',
    status: 'Published', priority: 'High', dueDate: '2026-06-18',
    description: 'Exposing granular metrics detailing Acme Corps deployment of multi-touch automated drip programs coupled with customized webhooks.',
    comments: [
      { id: 'c3', author: 'Alex Chen', avatar: 'AC', text: 'This piece converts like crazy. Lets reuse this on the next Webinar!', date: '2026-06-19' }
    ],
    history: [
      { date: '2026-06-12', action: 'Created draft', user: 'Emily Thorne' },
      { date: '2026-06-14', action: 'Approved', user: 'Markus Vance' },
      { date: '2026-06-18', action: 'Published to Web & Assets', user: 'Emily Thorne' }
    ]
  },
  {
    id: 'cnt-4', title: 'The Ultimate Guide to CRM Marketing Automation in 2026', type: 'Newsletter',
    campaign: 'SaaS Growth Playbook', funnelStage: 'Consideration', persona: 'Founder',
    author: 'Sarah Jenkins', owner: 'Sarah Jenkins', lastEdited: '2026-06-23',
    status: 'Scheduled', priority: 'High', dueDate: '2026-06-26',
    description: 'Comprehensive e-book style newsletter targeting startup founders, listing modern tools, costs, strategies, and templates.',
    comments: [],
    history: [
      { date: '2026-06-18', action: 'Created draft', user: 'Sarah Jenkins' },
      { date: '2026-06-22', action: 'Approved & Scheduled', user: 'Alex Chen' }
    ]
  },
  {
    id: 'cnt-5', title: 'Launch Webinar: Automating Lead Scoring & Assignment Rules', type: 'Video Script',
    campaign: 'Summer Product Launch 2026', funnelStage: 'Consideration', persona: 'Sales Manager',
    author: 'Alex Chen', owner: 'Alex Chen', lastEdited: '2026-06-20',
    status: 'Approved', priority: 'High', dueDate: '2026-06-25',
    description: 'Live interactive presentation mapping custom pipelines. Handouts will include dynamic CSV upload templates.',
    comments: [],
    history: [
      { date: '2026-06-15', action: 'Draft ready', user: 'Alex Chen' },
      { date: '2026-06-20', action: 'Approved by Marketing Manager', user: 'Markus Vance' }
    ]
  },
  {
    id: 'cnt-6', title: 'Developer SDK Quickstart: Custom Webhook Subscriptions', type: 'Knowledge Base Article',
    campaign: 'Summer Product Launch 2026', funnelStage: 'Consideration', persona: 'Developer',
    author: 'Devon Knight', owner: 'Devon Knight', lastEdited: '2026-06-22',
    status: 'Published', priority: 'Medium', dueDate: '2026-06-24',
    description: 'Clear structural code blocks showing how programmers can spin up serverless functions to trigger off lead stages.',
    comments: [], history: []
  },
  {
    id: 'cnt-7', title: 'Are you wasting 15+ hours/week on manual data entries?', type: 'Ad Copy',
    campaign: 'Lead Gen Q2', funnelStage: 'Awareness', persona: 'Agency Owner',
    author: 'Sarah Jenkins', owner: 'Sarah Jenkins', lastEdited: '2026-06-21',
    status: 'Ideas', priority: 'Low', dueDate: '2026-07-05',
    description: 'Punchy social ad designs positioning the marketing hub as the key to saving human coordination capital.',
    comments: [], history: []
  },
  {
    id: 'cnt-8', title: 'Product Launch WhatsApp Flash: 20% discount on Early Access', type: 'WhatsApp Template',
    campaign: 'Summer Product Launch 2026', funnelStage: 'Decision', persona: 'Founder',
    author: 'Alex Chen', owner: 'Alex Chen', lastEdited: '2026-06-24',
    status: 'In Review', priority: 'High', dueDate: '2026-06-29',
    description: 'Flash broadcast campaign promoting early-bird pricing, targeting warm leads via WhatsApp business automation.',
    comments: [], history: [{ date: '2026-06-24', action: 'Submitted for Review', user: 'Alex Chen' }]
  }
];

// ── Component ────────────────────────────────────────────────────────────────
export default function ContentHubPage() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'library' | 'approvals'>('pipeline');
  const [contentItems, setContentItems] = useState<ContentItem[]>(INITIAL_CONTENT_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCampaign, setFilterCampaign] = useState('All');
  const [filterPersona, setFilterPersona] = useState('All');
  const [filterFunnel, setFilterFunnel] = useState('All');

  // Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('Blog');
  const [modalCampaign, setModalCampaign] = useState(CAMPAIGNS[0]);
  const [modalPriority, setModalPriority] = useState('Medium');
  const [modalStage, setModalStage] = useState('Ideas');
  const [modalDesc, setModalDesc] = useState('');

  // Detail Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'general' | 'collaboration' | 'timeline'>('general');
  const [newCommentText, setNewCommentText] = useState('');

  // ── Derived ────────────────────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    return contentItems.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchSearch = item.title.toLowerCase().includes(q) || item.campaign.toLowerCase().includes(q) || item.author.toLowerCase().includes(q);
      return matchSearch
        && (filterType === 'All' || item.type === filterType)
        && (filterStatus === 'All' || item.status === filterStatus)
        && (filterCampaign === 'All' || item.campaign === filterCampaign)
        && (filterPersona === 'All' || item.persona === filterPersona)
        && (filterFunnel === 'All' || item.funnelStage === filterFunnel);
    });
  }, [contentItems, searchQuery, filterType, filterStatus, filterCampaign, filterPersona, filterFunnel]);

  const inReviewCount = contentItems.filter(i => i.status === 'In Review').length;

  const getTypeData = (typeName: string) => CONTENT_TYPES.find(t => t.id === typeName) || CONTENT_TYPES[0];

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleUpdateStatus = (itemId: string, newStatus: string) =>
    setContentItems(prev => prev.map(item => item.id === itemId ? { ...item, status: newStatus } : item));

  const handleDelete = (id: string) => {
    setContentItems(prev => prev.filter(i => i.id !== id));
    setDrawerOpen(false);
  };

  const openModalForNew = (stageId = 'Ideas') => {
    setModalTitle(''); setModalType('Blog'); setModalCampaign(CAMPAIGNS[0]);
    setModalPriority('Medium'); setModalStage(stageId); setModalDesc('');
    setEditingId(null); setIsModalOpen(true);
  };

  const openModalForEdit = (item: ContentItem) => {
    setModalTitle(item.title); setModalType(item.type); setModalCampaign(item.campaign);
    setModalPriority(item.priority); setModalStage(item.status); setModalDesc(item.description);
    setEditingId(item.id); setIsModalOpen(true);
  };

  const openDrawer = (item: ContentItem) => {
    setSelectedItem(item);
    setActiveDetailTab('general');
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (!modalTitle.trim()) return;
    if (editingId) {
      setContentItems(prev => prev.map(item =>
        item.id === editingId ? { ...item, title: modalTitle, type: modalType, campaign: modalCampaign, priority: modalPriority, status: modalStage, description: modalDesc } : item
      ));
    } else {
      setContentItems(prev => [...prev, {
        id: `cnt-${Math.random().toString(36).substr(2, 9)}`,
        title: modalTitle, type: modalType, campaign: modalCampaign,
        funnelStage: 'Awareness', persona: 'Customer',
        author: 'Current User', owner: 'Current User',
        lastEdited: new Date().toISOString().split('T')[0],
        status: modalStage, priority: modalPriority,
        dueDate: new Date().toISOString().split('T')[0],
        description: modalDesc, comments: [], history: []
      }]);
    }
    setIsModalOpen(false);
  };

  const handleApprove = (id: string) => {
    handleUpdateStatus(id, 'Approved');
    if (selectedItem?.id === id) setSelectedItem(prev => prev ? { ...prev, status: 'Approved' } : prev);
  };

  const handleReject = (id: string) => {
    const reason = window.prompt('Specify review feedback or correction guidance:');
    if (reason) {
      handleUpdateStatus(id, 'Draft');
      if (selectedItem?.id === id) setSelectedItem(prev => prev ? { ...prev, status: 'Draft' } : prev);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedItem) return;
    const comment: Comment = {
      id: `c-${Math.random().toString(36).substr(2, 9)}`,
      author: 'You', avatar: 'YO', text: newCommentText,
      date: new Date().toISOString().split('T')[0]
    };
    setContentItems(prev => prev.map(item =>
      item.id === selectedItem.id ? { ...item, comments: [...item.comments, comment] } : item
    ));
    setSelectedItem(prev => prev ? { ...prev, comments: [...prev.comments, comment] } : prev);
    setNewCommentText('');
  };

  // ── Shared sub-components ──────────────────────────────────────────────────
  const KanbanCard = ({ item, stage }: { item: ContentItem; stage: typeof STAGES[0] }) => {
    const typeData = getTypeData(item.type);
    return (
      <div className="card kanban-card" style={{ padding: 16, cursor: 'pointer', position: 'relative' }} onClick={() => openDrawer(item)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <span className={typeData.colorClass} style={{ fontSize: 11, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className={`ti ${typeData.icon}`}></i> {item.type}
          </span>
          {item.priority === 'High' && <i className="ti ti-flame" style={{ color: 'var(--rose)', fontSize: 16 }}></i>}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14, lineHeight: 1.4 }}>{item.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
          <i className="ti ti-rocket" style={{ color: 'var(--purple)' }}></i>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.campaign}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--purple-dim)', color: 'var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>
              {item.author.split(' ').map(n => n[0]).join('')}
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.dueDate}</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {stage.id !== 'Ideas' && (
              <button className="kanban-action-btn" onClick={e => { e.stopPropagation(); const idx = STAGES.findIndex(s => s.id === stage.id); handleUpdateStatus(item.id, STAGES[idx - 1].id); }}>
                <i className="ti ti-chevron-left"></i>
              </button>
            )}
            {stage.id !== 'Archived' && (
              <button className="kanban-action-btn" onClick={e => { e.stopPropagation(); const idx = STAGES.findIndex(s => s.id === stage.id); handleUpdateStatus(item.id, STAGES[idx + 1].id); }}>
                <i className="ti ti-chevron-right"></i>
              </button>
            )}
          </div>
        </div>
        <button onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
          style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}
          className="kanban-delete-btn">✕</button>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%', overflow: 'hidden' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-file-text" style={{ color: 'var(--purple)', fontSize: 24 }}></i> Content Hub
          </div>
          <div className="section-sub" style={{ fontSize: 13, marginTop: 4 }}>Manage marketing assets, campaigns, and pipelines across your team.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Segmented Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 8, padding: 4, border: '1px solid var(--border)' }}>
            {([
              { id: 'pipeline', label: 'Pipeline', icon: 'ti-layout-kanban' },
              { id: 'library', label: 'Library', icon: 'ti-folder' },
              { id: 'approvals', label: 'Approvals', icon: 'ti-check', badge: inReviewCount > 0 ? inReviewCount : null },
            ] as Array<{id: "pipeline" | "library" | "approvals", label: string, icon: string, badge?: number | null}>).map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
                  boxShadow: activeTab === tab.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: 'none', padding: '6px 16px', fontSize: 13, fontWeight: 500, borderRadius: 6,
                  cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 6
                }}>
                <i className={`ti ${tab.icon}`}></i> {tab.label}
                {tab.badge && <span style={{ background: 'var(--amber)', color: 'white', fontSize: 10, padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>{tab.badge}</span>}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => openModalForNew('Ideas')}>
            <i className="ti ti-plus"></i> New Content
          </button>
        </div>
      </div>

      {/* ── Workspace ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* PIPELINE */}
        {activeTab === 'pipeline' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ position: 'relative', width: 240 }}>
                <i className="ti ti-search" style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }}></i>
                <input type="text" placeholder="Search pipeline..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
              </div>
              <select value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
                <option value="All">All Campaigns</option>
                {CAMPAIGNS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, flex: 1 }} className="scrollbar-thin">
              {STAGES.map(stage => {
                const stageItems = filteredItems.filter(i => i.status === stage.id);
                return (
                  <div key={stage.id} style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', borderRadius: 12, padding: '16px 12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '0 6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: stage.dotColor, boxShadow: `0 0 8px ${stage.dotColor}80` }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{stage.label}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 12, border: '1px solid var(--border)' }}>{stageItems.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', flex: 1 }} className="scrollbar-thin">
                      {stageItems.length === 0
                        ? <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, border: '1px dashed var(--border)', borderRadius: 8, margin: '4px' }}>No content</div>
                        : stageItems.map(item => <KanbanCard key={item.id} item={item} stage={stage} />)
                      }
                      <button className="kanban-add-btn"
                        style={{ border: '1px dashed var(--border)', borderRadius: 8, padding: '10px', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s', marginTop: 4 }}
                        onClick={() => openModalForNew(stage.id)}>+ Add Content</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LIBRARY */}
        {activeTab === 'library' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflow: 'hidden' }}>
            <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: '16px 20px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <i className="ti ti-search" style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }}></i>
                <input type="text" placeholder="Search by title, author, campaign..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
              </div>
              <div style={{ width: 1, height: 24, background: 'var(--border)' }}></div>
              {[
                { val: filterType, set: setFilterType, opts: ['All Types', ...CONTENT_TYPES.map(t => t.id)] },
                { val: filterStatus, set: setFilterStatus, opts: ['All Stages', ...STAGES.map(s => s.id)] },
                { val: filterFunnel, set: setFilterFunnel, opts: ['All Funnels', ...FUNNEL_STAGES] },
                { val: filterPersona, set: setFilterPersona, opts: ['All Personas', ...PERSONAS] },
              ].map((f, i) => (
                <select key={i} value={f.val} onChange={e => f.set(e.target.value)} className="library-filter">
                  {f.opts.map(o => <option key={o} value={o.startsWith('All') ? 'All' : o}>{o}</option>)}
                </select>
              ))}
              <button className="btn btn-ghost" style={{ color: 'var(--rose-light)' }} onClick={() => { setSearchQuery(''); setFilterType('All'); setFilterStatus('All'); setFilterFunnel('All'); setFilterPersona('All'); setFilterCampaign('All'); }}>
                <i className="ti ti-x"></i> Clear
              </button>
            </div>
            <div className="card table-wrap" style={{ flex: 1, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 10 }}>
                  <tr>
                    <th style={{ width: '28%' }}>Content Title</th>
                    <th style={{ width: '14%' }}>Type</th>
                    <th style={{ width: '18%' }}>Campaign / Strategy</th>
                    <th style={{ width: '12%' }}>Status</th>
                    <th style={{ width: '14%' }}>Owner & Date</th>
                    <th style={{ width: '14%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => {
                    const td = getTypeData(item.type);
                    return (
                      <tr key={item.id} className="library-row" onClick={() => openDrawer(item)} style={{ cursor: 'pointer' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{item.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.id}</div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span className={td.colorClass} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <i className={`ti ${td.icon}`}></i> {item.type}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{item.campaign}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item.funnelStage} • {item.persona}</div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: STAGES.find(s => s.id === item.status)?.dotColor || 'var(--text-muted)' }} />
                            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{item.status}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 4 }}>{item.author}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Due: {item.dueDate}</div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="kanban-action-btn" title="Edit" onClick={e => { e.stopPropagation(); openModalForEdit(item); }}><i className="ti ti-edit"></i></button>
                            <button className="kanban-action-btn" title="Delete" onClick={e => { e.stopPropagation(); handleDelete(item.id); }}><i className="ti ti-trash"></i></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredItems.length === 0 && (
                    <tr><td colSpan={6} style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <i className="ti ti-search" style={{ fontSize: 32, marginBottom: 12, display: 'block', opacity: 0.5 }}></i>
                      <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>No content found</div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* APPROVALS */}
        {activeTab === 'approvals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%', overflowY: 'auto' }}>

            {/* Workflow Lifecycle Steps */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Workflow Lifecycle</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {WORKFLOW_STEPS.map((wf, idx) => (
                  <div key={wf.step} style={{ position: 'relative' }}>
                    <div style={{
                      padding: '14px 16px', borderRadius: 10, textAlign: 'center',
                      background: wf.active ? 'var(--purple-dim)' : 'var(--bg-secondary)',
                      border: `1px solid ${wf.active ? 'var(--purple-dim)' : 'var(--border)'}`,
                    }}>
                      <i className={`ti ${wf.icon}`} style={{ fontSize: 20, color: wf.active ? 'var(--purple-light)' : 'var(--text-muted)', marginBottom: 8, display: 'block' }}></i>
                      <div style={{ fontSize: 11, fontWeight: 600, color: wf.active ? 'var(--purple-light)' : 'var(--text-secondary)' }}>Step {wf.step}</div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: wf.active ? 'var(--text-primary)' : 'var(--text-muted)', marginTop: 4 }}>{wf.label}</div>
                    </div>
                    {idx < WORKFLOW_STEPS.length - 1 && (
                      <i className="ti ti-chevron-right" style={{ position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16, zIndex: 2 }}></i>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Awaiting Sign-off</h3>
                <span className="badge" style={{ background: 'var(--amber-dim)', color: 'var(--amber)' }}>{inReviewCount} Pending</span>
              </div>

              {inReviewCount === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 12 }}>
                  <i className="ti ti-check" style={{ fontSize: 32, marginBottom: 12, display: 'block', color: 'var(--emerald)' }}></i>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>All caught up!</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>No drafts require review at the moment.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 20 }}>
                  {contentItems.filter(i => i.status === 'In Review').map(item => {
                    const td = getTypeData(item.type);
                    return (
                      <div key={item.id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                              <span className={td.colorClass} style={{ fontSize: 11, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <i className={`ti ${td.icon}`}></i> {item.type}
                              </span>
                              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>• {item.campaign}</span>
                            </div>
                            <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0, cursor: 'pointer' }} onClick={() => openDrawer(item)}>{item.title}</h4>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: 6, flexShrink: 0 }}>Due: {item.dueDate}</span>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 8, lineHeight: 1.6 }}>
                          {item.description || 'No description provided.'}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}><strong>Creator:</strong> {item.author}</span>
                          <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => handleReject(item.id)} className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--rose)' }}>
                              <i className="ti ti-thumb-down"></i> Send back to Draft
                            </button>
                            <button onClick={() => handleApprove(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--emerald)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                              <i className="ti ti-thumb-up"></i> Approve Asset
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Detail Drawer ── */}
      {drawerOpen && selectedItem && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex', justifyContent: 'flex-end' }}>
          {/* Backdrop */}
          <div onClick={() => setDrawerOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />

          {/* Drawer Panel */}
          <div className="detail-drawer" style={{
            position: 'relative', zIndex: 1, width: 480, background: 'var(--bg-card)',
            borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.15)'
          }}>
            {/* Drawer Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span className={getTypeData(selectedItem.type).colorClass} style={{ fontSize: 11, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <i className={`ti ${getTypeData(selectedItem.type).icon}`}></i> {selectedItem.type}
                </span>
                <button onClick={() => setDrawerOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}>✕</button>
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>{selectedItem.title}</h2>
            </div>

            {/* Drawer Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 24px', background: 'var(--bg-card)' }}>
              {([
                { id: 'general', label: 'Metadata' },
                { id: 'collaboration', label: `Comments (${selectedItem.comments.length})` },
                { id: 'timeline', label: 'History' }
              ] as const).map(t => (
                <button key={t.id} onClick={() => setActiveDetailTab(t.id)}
                  style={{
                    padding: '12px 4px', marginRight: 20, fontSize: 13, fontWeight: 600,
                    color: activeDetailTab === t.id ? 'var(--purple-light)' : 'var(--text-secondary)',
                    borderBottom: `2px solid ${activeDetailTab === t.id ? 'var(--purple)' : 'transparent'}`,
                    background: 'transparent', border: 'none',
                    borderBottomWidth: 2,
                    borderBottomStyle: 'solid',
                    borderBottomColor: activeDetailTab === t.id ? 'var(--purple)' : 'transparent',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}>{t.label}</button>
              ))}
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }} className="scrollbar-thin">
              
              {/* Metadata Tab */}
              {activeDetailTab === 'general' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>Brief / Description</div>
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 8, margin: 0, lineHeight: 1.6 }}>
                      {selectedItem.description || 'No formal briefing documented.'}
                    </p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                    {[
                      { label: 'Campaign', value: selectedItem.campaign },
                      { label: 'Funnel Stage', value: selectedItem.funnelStage },
                      { label: 'Target Persona', value: selectedItem.persona },
                      { label: 'Workflow Status', value: selectedItem.status },
                      { label: 'Assigned Owner', value: selectedItem.author },
                      { label: 'Due Date', value: selectedItem.dueDate },
                    ].map(f => (
                      <div key={f.label}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 4 }}>{f.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Collaboration Tab */}
              {activeDetailTab === 'collaboration' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {selectedItem.comments.length === 0
                    ? <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0', fontSize: 13 }}>No messages logged yet.</p>
                    : selectedItem.comments.map(c => (
                      <div key={c.id} style={{ display: 'flex', gap: 10, padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--purple-dim)', color: 'var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                          {c.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{c.author}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.date}</span>
                          </div>
                          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{c.text}</p>
                        </div>
                      </div>
                    ))}
                  {/* Comment Input */}
                  <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <input type="text" placeholder="Type a comment..." value={newCommentText} onChange={e => setNewCommentText(e.target.value)}
                      style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                    <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px' }}>Send</button>
                  </form>
                </div>
              )}

              {/* Timeline Tab */}
              {activeDetailTab === 'timeline' && (
                <div>
                  {selectedItem.history.length === 0
                    ? <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0', fontSize: 13 }}>No history recorded yet.</p>
                    : (
                      <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {selectedItem.history.map((h, idx) => (
                          <div key={idx} style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: -26, top: 4, width: 10, height: 10, borderRadius: '50%', background: 'var(--purple)', border: '2px solid var(--bg-card)' }} />
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{h.date}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{h.action}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>by {h.user}</div>
                          </div>
                        ))}
                      </div>
                    )
                  }
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', gap: 10 }}>
              {selectedItem.status === 'In Review' ? (
                <>
                  <button onClick={() => handleReject(selectedItem.id)} className="btn btn-ghost" style={{ flex: 1, color: 'var(--rose)', justifyContent: 'center' }}>
                    <i className="ti ti-thumb-down" style={{ marginRight: 6 }}></i>Send Back
                  </button>
                  <button onClick={() => handleApprove(selectedItem.id)} style={{ flex: 1, background: 'var(--emerald)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <i className="ti ti-thumb-up"></i>Approve Draft
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { openModalForEdit(selectedItem); setDrawerOpen(false); }} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                    <i className="ti ti-edit" style={{ marginRight: 6 }}></i>Edit
                  </button>
                  <button onClick={() => setDrawerOpen(false)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Close</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 520, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)', boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{editingId ? 'Edit Content' : 'Create New Content'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>Content Title</label>
                <input type="text" value={modalTitle} onChange={e => setModalTitle(e.target.value)} placeholder="e.g. Q3 Launch Blog Post"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>Content Type</label>
                  <select value={modalType} onChange={e => setModalType(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }}>
                    {CONTENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>Campaign</label>
                  <select value={modalCampaign} onChange={e => setModalCampaign(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }}>
                    {CAMPAIGNS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>Priority</label>
                  <select value={modalPriority} onChange={e => setModalPriority(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>Stage</label>
                  <select value={modalStage} onChange={e => setModalStage(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }}>
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>Description / Creative Brief</label>
                <textarea rows={3} value={modalDesc} onChange={e => setModalDesc(e.target.value)} placeholder="Insert context guidelines or primary goal statements..."
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontSize: 13 }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {editingId
                ? <button className="btn btn-ghost" style={{ color: 'var(--rose)' }} onClick={() => { handleDelete(editingId); setIsModalOpen(false); }}>Delete</button>
                : <div />}
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>{editingId ? 'Save Changes' : 'Create Content'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Scoped Styles ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-thin::-webkit-scrollbar { height: 6px; width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
        
        .kanban-card { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s !important; }
        .kanban-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: var(--purple-dim) !important; }
        .kanban-delete-btn { opacity: 0; transition: opacity 0.2s; }
        .kanban-card:hover .kanban-delete-btn { opacity: 1; }
        .kanban-delete-btn:hover { color: var(--rose-light) !important; }
        .kanban-add-btn:hover { background: var(--bg-card) !important; border-color: var(--purple-dim) !important; color: var(--purple-light) !important; }

        .kanban-action-btn {
          width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
          border-radius: 6px; background: transparent; color: var(--text-secondary);
          border: 1px solid transparent; transition: all 0.2s; cursor: pointer;
        }
        .kanban-action-btn:hover { background: var(--bg-secondary); color: var(--text-primary); border-color: var(--border); }

        .library-filter { padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-primary); font-size: 13px; outline: none; transition: border-color 0.2s; }
        .library-filter:focus, .library-filter:hover { border-color: var(--purple-dim); }

        .library-row { border-bottom: 1px solid var(--border); transition: background 0.2s; }
        .library-row:hover { background: var(--bg-secondary); }

        .detail-drawer { animation: slideInRight 0.25s ease; }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      ` }} />
    </div>
  );
}
