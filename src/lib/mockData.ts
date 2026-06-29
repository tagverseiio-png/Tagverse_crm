export const store = {
  companies: [
    { id:'c1', name:'Acme Corp',      industry:'SaaS',        stage:'Negotiation', dealValue:85000, owner:'m1', health:92, logo:'AC', color:'#6366f1' },
    { id:'c2', name:'BrightWave',     industry:'FinTech',     stage:'Proposal',    dealValue:62000, owner:'m2', health:74, logo:'BW', color:'#0ea5e9' },
    { id:'c3', name:'NovaTech',       industry:'Hardware',    stage:'Qualified',   dealValue:43000, owner:'m3', health:58, logo:'NT', color:'#f59e0b' },
    { id:'c4', name:'Zenith Retail',  industry:'E-commerce',  stage:'Lead',        dealValue:29000, owner:'m2', health:81, logo:'ZR', color:'#10b981' },
    { id:'c5', name:'CoreLogic',      industry:'Analytics',   stage:'Closed Won',  dealValue:110000,owner:'m1', health:97, logo:'CL', color:'#8b5cf6' },
  ],
  contacts: [
    { id:'ct1', name:'Rajan Mehta',   company:'c1', role:'CTO',        email:'rajan@acme.io',    avatar:'RM', lastContact:'2026-06-25' },
    { id:'ct2', name:'Priya Nair',    company:'c2', role:'CFO',        email:'priya@brightwave.io',avatar:'PN', lastContact:'2026-06-24' },
    { id:'ct3', name:'Kiran Das',     company:'c3', role:'CEO',        email:'kiran@novatech.io', avatar:'KD', lastContact:'2026-06-26' },
    { id:'ct4', name:'Sneha Reddy',   company:'c4', role:'VP Sales',   email:'sneha@zenith.io',   avatar:'SR', lastContact:'2026-06-22' },
    { id:'ct5', name:'Arjun Sharma',  company:'c5', role:'Head of IT', email:'arjun@corelogic.io',avatar:'AS', lastContact:'2026-06-27' },
  ],
  deals: [
    { id:'d1', title:'Acme Corp — Enterprise Plan',  company:'c1', value:85000,  stage:'Negotiation', closeDateTarget:'2026-07-15', owner:'m1' },
    { id:'d2', title:'BrightWave — Growth Package',  company:'c2', value:62000,  stage:'Proposal',    closeDateTarget:'2026-07-30', owner:'m2' },
    { id:'d3', title:'NovaTech — Starter Bundle',    company:'c3', value:43000,  stage:'Qualified',   closeDateTarget:'2026-08-10', owner:'m3' },
    { id:'d4', title:'CoreLogic — Full Suite',       company:'c5', value:110000, stage:'Closed Won',  closeDateTarget:'2026-06-20', owner:'m1' },
  ],
  members: [
    { id:'m1', name:'Arjun S.',  avatar:'AS', color:'#6366f1' },
    { id:'m2', name:'Priya N.',  avatar:'PN', color:'#0ea5e9' },
    { id:'m3', name:'Kiran D.',  avatar:'KD', color:'#f59e0b' },
  ],
  activities: [
    { id:'a1',  type:'meeting',  time:'09:00', title:'Acme Corp — Contract review call',       company:'c1', owner:'m1', status:'upcoming',  duration:'45 min',    linkedDeal:'d1' },
    { id:'a2',  type:'task',     time:'10:00', title:'Send revised proposal to BrightWave',    company:'c2', owner:'m2', status:'in-progress',priority:'urgent',    linkedDeal:'d2' },
    { id:'a3',  type:'deadline', time:'11:00', title:'NovaTech deal close target',             company:'c3', owner:'m3', status:'upcoming',  note:'Follow up EOD', linkedDeal:'d3' },
    { id:'a4',  type:'meeting',  time:'11:30', title:'BrightWave product demo',                company:'c2', owner:'m2', status:'upcoming',  duration:'60 min',    linkedDeal:'d2' },
    { id:'a5',  type:'task',     time:'12:00', title:'Update CRM pipeline for CoreLogic',     company:'c5', owner:'m1', status:'done',       priority:'normal',    linkedDeal:'d4' },
    { id:'a6',  type:'followup', time:'13:00', title:'Follow up — Sneha Reddy re: Zenith',    company:'c4', owner:'m2', status:'upcoming',  contact:'ct4',        linkedDeal:null },
    { id:'a7',  type:'task',     time:'14:00', title:'Prepare Q3 sales report',               company:null,  owner:'m1', status:'in-progress',priority:'high',     linkedDeal:null },
    { id:'a8',  type:'meeting',  time:'15:00', title:'Internal pipeline review — all hands',  company:null,  owner:'m1', status:'upcoming',  duration:'30 min',    linkedDeal:null },
    { id:'a9',  type:'deadline', time:'17:00', title:'Submit monthly KPI deck to leadership', company:null,  owner:'m3', status:'upcoming',  note:'Board deck',    linkedDeal:null },
    { id:'a10', type:'task',     time:'17:30', title:'Log meeting notes — Acme call',         company:'c1', owner:'m1', status:'upcoming',  priority:'normal',    linkedDeal:'d1' },
  ],

  // ── Activity Page ──────────────────────────────────────────────
  upcomingEvents: [
    {
      group: 'Tomorrow',
      events: [
        { title: 'Onboarding Call — BrightWave Team', time: '09:30 AM', owner: 'Priya N.', color: 'var(--blue-light)' },
        { title: 'Quarterly Review Deadline',          time: '16:00 PM', owner: 'Arjun S.', color: 'var(--rose-light)' },
      ],
    },
    {
      group: 'Day After Tomorrow',
      events: [
        { title: 'Strategic alignment with Acme CMO', time: '11:00 AM', owner: 'Arjun S.', color: 'var(--amber-light)' },
      ],
    },
  ],

  productivityTracker: {
    dailyGoalPct: 75,
    label: 'Daily Goal Target',
  },

  // ── Assets Page ────────────────────────────────────────────────
  assetsKpis: [
    { label: 'Total files',   value: '612',    delta: 'Across all folders', color: 'purple'  },
    { label: 'Storage used',  value: '4.8 GB', delta: 'of 10 GB',           color: 'blue'    },
    { label: 'Images',        value: '440',    delta: '72% of total',       color: 'emerald' },
    { label: 'Videos',        value: '38',     delta: '6% of total',        color: 'amber'   },
  ],

  assetsFolders: [
    { name: 'Brand guidelines',       count: 24,  icon: '📁', color: 'var(--rose-light)'   },
    { name: 'Campaign creatives',     count: 118, icon: '📁', color: 'var(--purple-light)' },
    { name: 'Product screenshots',    count: 76,  icon: '📁', color: 'var(--blue-light)'   },
    { name: 'Social media templates', count: 92,  icon: '📁', color: 'var(--amber-light)'  },
    { name: 'Videos & reels',         count: 38,  icon: '📁', color: 'var(--emerald-light)'},
  ],

  assets: [
    { name: 'hero-banner-v3.png',      type: 'Image', size: '1.2 MB', folder: 'Campaign creatives', badge: 'rose',    icon: '🖼️' },
    { name: 'brand-kit-2025.pdf',      type: 'PDF',   size: '4.4 MB', folder: 'Brand guidelines',   badge: 'purple',  icon: '📄' },
    { name: 'product-demo-final.mp4',  type: 'Video', size: '84 MB',  folder: 'Videos & reels',     badge: 'emerald', icon: '🎥' },
  ],

  recentUploads: [
    { name: 'hero-banner-v3.png',     size: '1.2 MB', date: 'Jun 23', icon: '🖼️', bg: 'var(--rose-dim)',    color: 'var(--rose-light)'   },
    { name: 'brand-kit-2025.pdf',     size: '4.4 MB', date: 'Jun 21', icon: '📄', bg: 'var(--blue-dim)',    color: 'var(--blue-light)'   },
    { name: 'product-demo-final.mp4', size: '84 MB',  date: 'Jun 19', icon: '🎥', bg: 'var(--emerald-dim)', color: 'var(--emerald-light)'},
  ],
};

export function getCompanyById(id: string) {
  return store.companies.find(c => c.id === id);
}

export function getContactById(id: string) {
  return store.contacts.find(c => c.id === id);
}

export function getDealById(id: string) {
  return store.deals.find(d => d.id === id);
}

export function getMemberById(id: string) {
  return store.members.find(m => m.id === id);
}

export function formatCurrency(num: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export const analyticsData = {
  Deals: {
    kpi: {
      sum:   { value: '$85,420', delta: '+12.5%', isUp: true },
      count: { value: '450',     delta: '+5.2%',  isUp: true },
      avg:   { value: '$4,200',  delta: '+1.1%',  isUp: true },
    },
    bar: [
      { name: 'Jan', spend: 0, revenue: 12000 },
      { name: 'Feb', spend: 0, revenue: 15000 },
      { name: 'Mar', spend: 0, revenue: 11000 },
      { name: 'Apr', spend: 0, revenue: 19000 },
    ],
    donut: [
      { name: 'Enterprise', value: 45 },
      { name: 'Mid-Market', value: 30 },
      { name: 'SMB',        value: 25 },
    ],
    funnel: [
      { name: 'Leads',     value: 1200, fill: 'var(--blue)'    },
      { name: 'Qualified', value: 850,  fill: 'var(--purple)'  },
      { name: 'Proposal',  value: 420,  fill: 'var(--emerald)' },
      { name: 'Won',       value: 150,  fill: 'var(--rose)'    },
    ],
  },
  Accounts: {
    kpi: {
      count: { value: '142',   delta: '+3',    isUp: true  },
      avg:   { value: '1.2%',  delta: '-0.4%', isUp: false },
      sum:   { value: '1,420', delta: '+15',   isUp: true  },
    },
    bar: [
      { name: 'Q1', spend: 0, revenue: 40 },
      { name: 'Q2', spend: 0, revenue: 55 },
      { name: 'Q3', spend: 0, revenue: 30 },
      { name: 'Q4', spend: 0, revenue: 17 },
    ],
    donut: [
      { name: 'Active',   value: 142 },
      { name: 'Inactive', value: 12  },
      { name: 'Churned',  value: 5   },
    ],
    funnel: [
      { name: 'Total Accounts', value: 500, fill: 'var(--blue)'    },
      { name: 'Active',         value: 350, fill: 'var(--purple)'  },
      { name: 'Engaged',        value: 200, fill: 'var(--emerald)' },
      { name: 'Expanding',      value: 80,  fill: 'var(--rose)'    },
    ],
  },
  Campaigns: {
    kpi: {
      avg:   { value: '284%',     delta: '+24.2%', isUp: true },
      sum:   { value: '$45,000',  delta: '+10.5%', isUp: true },
      count: { value: '12',       delta: '+2',     isUp: true },
    },
    bar: [
      { name: 'Meta Ads',   spend: 4000, revenue: 8000 },
      { name: 'LinkedIn',   spend: 3000, revenue: 5500 },
      { name: 'Google Ads', spend: 2000, revenue: 9800 },
      { name: 'TikTok',     spend: 2780, revenue: 3908 },
      { name: 'Email',      spend: 1890, revenue: 4800 },
    ],
    donut: [
      { name: 'Social', value: 45 },
      { name: 'Search', value: 35 },
      { name: 'Email',  value: 20 },
    ],
    funnel: [
      { name: 'Impressions', value: 50000, fill: 'var(--blue)'    },
      { name: 'Clicks',      value: 12000, fill: 'var(--purple)'  },
      { name: 'Signups',     value: 3000,  fill: 'var(--emerald)' },
      { name: 'Purchases',   value: 800,   fill: 'var(--rose)'    },
    ],
  },
  Leads: {
    kpi: {
      count: { value: '1,284',    delta: '+18.4%', isUp: true },
      avg:   { value: '12 days',  delta: '-2 days',isUp: true },
      sum:   { value: '$120,000', delta: '+5.0%',  isUp: true },
    },
    bar: [
      { name: 'Week 1', spend: 0, revenue: 320 },
      { name: 'Week 2', spend: 0, revenue: 450 },
      { name: 'Week 3', spend: 0, revenue: 290 },
      { name: 'Week 4', spend: 0, revenue: 510 },
    ],
    donut: [
      { name: 'Organic Search', value: 400 },
      { name: 'Direct',         value: 300 },
      { name: 'Social',         value: 300 },
      { name: 'Referral',       value: 200 },
    ],
    funnel: [
      { name: 'Raw Leads',    value: 2500, fill: 'var(--blue)'    },
      { name: 'MQLs',         value: 1200, fill: 'var(--purple)'  },
      { name: 'SQLs',         value: 600,  fill: 'var(--emerald)' },
      { name: 'Opportunities',value: 250,  fill: 'var(--rose)'    },
    ],
  },
};

export const analyticsInitialLayout = [
  { i: 'w1', x: 0, y: 0,  w: 3, h: 4,  minW: 2, minH: 3 },
  { i: 'w2', x: 3, y: 0,  w: 3, h: 4,  minW: 2, minH: 3 },
  { i: 'w3', x: 6, y: 0,  w: 3, h: 4,  minW: 2, minH: 3 },
  { i: 'w4', x: 9, y: 0,  w: 3, h: 4,  minW: 2, minH: 3 },
  { i: 'w5', x: 0, y: 4,  w: 8, h: 10, minW: 4, minH: 8 },
  { i: 'w6', x: 8, y: 4,  w: 4, h: 10, minW: 3, minH: 8 },
  { i: 'w7', x: 0, y: 14, w: 4, h: 10, minW: 3, minH: 8 },
  { i: 'w8', x: 4, y: 14, w: 4, h: 10, minW: 3, minH: 8 },
  { i: 'w9', x: 8, y: 14, w: 4, h: 10, minW: 3, minH: 8 },
];

export const analyticsInitialWidgets = [
  { id: 'w1', type: 'kpi',    title: 'Monthly Revenue',           config: { module: 'Deals',     metric: 'sum',   colorTheme: 'blue'    } },
  { id: 'w2', type: 'kpi',    title: 'Active Clients',            config: { module: 'Accounts',  metric: 'count', colorTheme: 'purple'  } },
  { id: 'w3', type: 'kpi',    title: 'Avg ROI',                   config: { module: 'Campaigns', metric: 'avg',   colorTheme: 'emerald' } },
  { id: 'w4', type: 'kpi',    title: 'Churn Rate',                config: { module: 'Accounts',  metric: 'avg',   colorTheme: 'rose'    } },
  { id: 'w5', type: 'area',   title: 'Revenue Trend (YoY)',       config: { module: 'Deals',     metric: 'sum',   colorTheme: 'blue'    } },
  { id: 'w6', type: 'donut',  title: 'Leads by Source',           config: { module: 'Leads',     metric: 'count', colorTheme: 'purple'  } },
  { id: 'w7', type: 'funnel', title: 'Sales Pipeline Conversion', config: { module: 'Deals',     metric: 'count', colorTheme: 'emerald' } },
  { id: 'w8', type: 'bar',    title: 'Platform ROI Analysis',     config: { module: 'Campaigns', metric: 'sum',   colorTheme: 'rose'    } },
  { id: 'w9', type: 'pie',    title: 'Account Distribution',      config: { module: 'Accounts',  metric: 'count', colorTheme: 'amber'   } },
];

export const analyticsFilterOptions = {
  dateRange: [
    { value: 'today',   label: 'Today'        },
    { value: 'week',    label: 'This Week'     },
    { value: 'month',   label: 'This Month'    },
    { value: '30days',  label: 'Last 30 Days'  },
    { value: 'quarter', label: 'This Quarter'  },
    { value: 'year',    label: 'This Year'     },
  ],
  pipeline: [
    { value: 'all',       label: 'All Pipelines'      },
    { value: 'sales',     label: 'Sales Pipeline'     },
    { value: 'marketing', label: 'Marketing Pipeline' },
    { value: 'renewals',  label: 'Renewals'           },
  ],
  owner: [
    { value: 'all',        label: 'All Owners'      },
    { value: 'me',         label: 'Assigned to Me'  },
    { value: 'unassigned', label: 'Unassigned'      },
  ],
  tag: [
    { value: 'all',        label: 'All Tags'   },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'smb',        label: 'SMB'        },
    { value: 'vip',        label: 'VIP'        },
  ],
};

// Widget type catalog (icons are added in the component since they're JSX)
export const analyticsWidgetTypes = [
  { type: 'kpi',    label: 'KPI Card',     desc: 'Single metric summary with sparkline',    color: 'blue'    },
  { type: 'bar',    label: 'Bar Chart',    desc: 'Compare categories across a dimension',   color: 'purple'  },
  { type: 'line',   label: 'Line Chart',   desc: 'View trends over time',                   color: 'emerald' },
  { type: 'pie',    label: 'Pie Chart',    desc: 'Part-to-whole ratio (solid)',              color: 'amber'   },
  { type: 'donut',  label: 'Donut Chart',  desc: 'Part-to-whole ratio (hollow)',             color: 'rose'    },
  { type: 'funnel', label: 'Funnel Chart', desc: 'Conversion rates across stages',           color: 'blue'    },
  { type: 'area',   label: 'Area Chart',   desc: 'Volume trends over time',                  color: 'purple'  },
];

export const analyticsWidgetTypeOptions = [
  { value: 'kpi',    label: 'KPI Card'           },
  { value: 'bar',    label: 'Bar Chart'           },
  { value: 'line',   label: 'Line Chart'          },
  { value: 'area',   label: 'Area Chart'          },
  { value: 'pie',    label: 'Pie Chart (Solid)'   },
  { value: 'donut',  label: 'Donut Chart (Hollow)'},
  { value: 'funnel', label: 'Funnel Chart'        },
];

export const analyticsModules = [
  { value: 'Deals',     label: 'Deals'     },
  { value: 'Leads',     label: 'Leads'     },
  { value: 'Accounts',  label: 'Accounts'  },
  { value: 'Campaigns', label: 'Campaigns' },
];

export const analyticsMetrics = [
  { value: 'count', label: 'Count (Record Count)' },
  { value: 'sum',   label: 'Sum (Total Value)'    },
  { value: 'avg',   label: 'Average'              },
];

export const analyticsColorThemes = ['blue', 'purple', 'emerald', 'rose'] as const;

// ─── Calendar ─────────────────────────────────────────────────────────────────

export const calendarPresetColors = [
  '#7c5cbf', '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#6366f1', '#ec4899',
];

// ─── Campaigns ────────────────────────────────────────────────────────────────

export const campaignsKpis = [
  { label: 'Active campaigns', value: '6',     delta: '+2 this month',       trend: 'up', color: 'purple'  },
  { label: 'Total reach',      value: '48K',   delta: 'Across all channels', trend: 'up', color: 'blue'    },
  { label: 'Avg. open rate',   value: '28.4%', delta: '+3.1% vs last mo.',   trend: 'up', color: 'emerald' },
  { label: 'Conversions',      value: '312',   delta: '+22% this month',     trend: 'up', color: 'amber'   },
];

export const campaignsInitial = [
  { name: 'Q3 product launch',    channel: 'Email',  budget: '₹80K',  spent: '₹52K', dates: 'Jun 1 – Jul 15',  status: 'Active', badgeChannel: 'purple', badgeStatus: 'emerald' },
  { name: 'Referral drive — June',channel: 'Social', budget: '₹30K',  spent: '₹12K', dates: 'Jun 10 – Jun 30', status: 'Active', badgeChannel: 'blue',   badgeStatus: 'emerald' },
  { name: 'Re-engagement blast',  channel: 'Email',  budget: '₹15K',  spent: '—',    dates: 'Jul 1 – Jul 10',  status: 'Draft',  badgeChannel: 'purple', badgeStatus: 'amber'   },
  { name: 'Google Ads — brand',   channel: 'Paid',   budget: '₹1.2L', spent: '₹1.2L',dates: 'May 1 – May 31', status: 'Done',   badgeChannel: 'rose',   badgeStatus: 'rose'    },
  { name: 'Webinar promo',        channel: 'Social', budget: '₹20K',  spent: '₹8K',  dates: 'Jun 20 – Jul 5',  status: 'Paused', badgeChannel: 'blue',   badgeStatus: 'amber'   },
];

export const campaignStats = [
  { label: 'Impressions', value: '24,810', color: 'var(--blue)'    },
  { label: 'Clicks',      value: '3,420',  color: 'var(--purple)'  },
  { label: 'Conversions', value: '312',    color: 'var(--emerald)' },
  { label: 'CTR',         value: '13.8%',  color: 'var(--amber)'   },
];

export const campaignChannelBadge: Record<string, string> = {
  Email: 'purple', Social: 'blue', Paid: 'rose', Content: 'emerald',
};

export const campaignStatusBadge: Record<string, string> = {
  Draft: 'amber', Active: 'emerald', Paused: 'amber', Done: 'rose',
};

// ─── Contacts ─────────────────────────────────────────────────────────────────

export const contactsInitial = [
  { id: 1, name: 'Rahul Verma',   company: 'TechNova',      role: 'CEO',            phone: '+91 98765 11111', email: 'rahul@technova.in',       owner: 'JS', lastContact: '2 days ago',  created: '1 month ago',  tags: ['Decision Maker', 'VIP'] },
  { id: 2, name: 'Sneha Kapoor',  company: 'CreativeMinds', role: 'Marketing Head', phone: '+91 98112 22222', email: 'sneha@creativeminds.in',  owner: 'SA', lastContact: '1 week ago',  created: '3 weeks ago',  tags: ['Influencer'] },
  { id: 3, name: 'Anil Desai',    company: 'LogisticsPro',  role: 'Operations',     phone: '+91 97001 33333', email: 'anil@logisticspro.com',  owner: 'JS', lastContact: 'Just now',     created: '2 months ago', tags: ['Vendor'] },
  { id: 4, name: 'Pooja Singh',   company: 'RetailChain',   role: 'Procurement',    phone: '+91 96543 44444', email: 'pooja@retailchain.in',   owner: 'AM', lastContact: '5 days ago',  created: '1 week ago',   tags: ['Client'] },
];

export const contactsStaticKpis = [
  { label: 'Recently Added',    value: '12', color: 'purple'  },
  { label: 'Key Accounts',      value: '8',  color: 'amber'   },
  { label: 'Engaged Contacts',  value: '24', color: 'emerald' },
];

// ─── Content Hub ──────────────────────────────────────────────────────────────

export const contentTypes = [
  { id: 'Blog',                    label: 'Blog Post',             colorClass: 'badge blue',   icon: 'ti-file-text'           },
  { id: 'Email',                   label: 'Email Newsletter',      colorClass: 'badge purple', icon: 'ti-mail'                },
  { id: 'Newsletter',              label: 'Bi-weekly Newsletter',  colorClass: 'badge indigo', icon: 'ti-send'                },
  { id: 'Landing Page',            label: 'Landing Page',          colorClass: 'badge rose',   icon: 'ti-layout-board-split'  },
  { id: 'Case Study',              label: 'Case Study',            colorClass: 'badge amber',  icon: 'ti-briefcase'           },
  { id: 'Social Post',             label: 'Social Post',           colorClass: 'badge emerald',icon: 'ti-share'               },
  { id: 'Ad Copy',                 label: 'Ad Copy',               colorClass: 'badge blue',   icon: 'ti-sparkles'            },
  { id: 'Video Script',            label: 'Video Script',          colorClass: 'badge rose',   icon: 'ti-video'               },
  { id: 'WhatsApp Template',       label: 'WhatsApp Broadcast',    colorClass: 'badge emerald',icon: 'ti-message-circle'      },
  { id: 'Knowledge Base Article',  label: 'KB Article',            colorClass: 'badge purple', icon: 'ti-books'               },
];

export const contentStages = [
  { id: 'Ideas',     label: 'Backlog / Ideas', dotColor: 'var(--text-muted)' },
  { id: 'Draft',     label: 'Drafting',        dotColor: 'var(--amber)'      },
  { id: 'In Review', label: 'In Review',       dotColor: 'var(--blue)'       },
  { id: 'Approved',  label: 'Approved',        dotColor: 'var(--emerald)'    },
  { id: 'Scheduled', label: 'Scheduled',       dotColor: 'var(--purple)'     },
  { id: 'Published', label: 'Published',       dotColor: 'var(--rose)'       },
  { id: 'Archived',  label: 'Archived',        dotColor: 'var(--text-muted)' },
];

export const contentFunnelStages = ['Awareness', 'Consideration', 'Decision', 'Retention'];

export const contentPersonas = ['Founder', 'CEO', 'Marketing Manager', 'Sales Manager', 'Agency Owner', 'Developer', 'Customer'];

export const contentCampaigns = [
  'Summer Product Launch 2026', 'Inbound SEO Engine', 'Customer Success Highlights',
  'SaaS Growth Playbook', 'Lead Gen Q2', 'Re-engagement Campaign',
];

export const contentWorkflowSteps = [
  { step: 1, label: 'Ideation & Write-up',  icon: 'ti-pencil'   },
  { step: 2, label: 'Manager Review',        icon: 'ti-eye',     active: true },
  { step: 3, label: 'Approval Confirmed',    icon: 'ti-check'    },
  { step: 4, label: 'Schedule & Publish',    icon: 'ti-calendar' },
];

export const contentInitialItems = [
  {
    id: 'cnt-1', title: '10 Game-Changing AI Workflows for Marketing Teams', type: 'Blog',
    campaign: 'Inbound SEO Engine', funnelStage: 'Awareness', persona: 'Marketing Manager',
    author: 'Sarah Jenkins', owner: 'Sarah Jenkins', lastEdited: '2026-06-22',
    status: 'In Review', priority: 'High', dueDate: '2026-06-28',
    description: 'A deep-dive blueprint explaining how small-to-medium marketing agencies can hook up LLMs to their CRM to automate content generation, pipeline monitoring, and lead scoring.',
    comments: [
      { id: 'c1', author: 'Markus Vance', avatar: 'MV', text: 'Excellent Sarah. Make sure the SEO section highlights our Shopify integration.', date: '2026-06-23' },
      { id: 'c2', author: 'Sarah Jenkins', avatar: 'SJ', text: 'Good catch! Added a paragraph on sync speed and trigger webhooks.', date: '2026-06-24' },
    ],
    history: [
      { date: '2026-06-20', action: 'Created draft', user: 'Sarah Jenkins' },
      { date: '2026-06-22', action: 'Submitted for Review', user: 'Sarah Jenkins' },
    ],
  },
  {
    id: 'cnt-2', title: 'Welcome & Onboarding Sequence for Enterprise Signups', type: 'Email',
    campaign: 'Re-engagement Campaign', funnelStage: 'Retention', persona: 'Customer',
    author: 'Markus Vance', owner: 'Markus Vance', lastEdited: '2026-06-24',
    status: 'Draft', priority: 'Medium', dueDate: '2026-06-30',
    description: 'A 5-part email series guiding a user from system configuration to their first collaborative workspace, ensuring high Day-7 retention.',
    comments: [],
    history: [{ date: '2026-06-24', action: 'Created draft', user: 'Markus Vance' }],
  },
  {
    id: 'cnt-3', title: 'How Acme Corp Boosted MQL Pipeline by 240% using CRM Automation', type: 'Case Study',
    campaign: 'Customer Success Highlights', funnelStage: 'Decision', persona: 'CEO',
    author: 'Emily Thorne', owner: 'Emily Thorne', lastEdited: '2026-06-15',
    status: 'Published', priority: 'High', dueDate: '2026-06-18',
    description: 'Exposing granular metrics detailing Acme Corps deployment of multi-touch automated drip programs coupled with customized webhooks.',
    comments: [
      { id: 'c3', author: 'Alex Chen', avatar: 'AC', text: 'This piece converts like crazy. Lets reuse this on the next Webinar!', date: '2026-06-19' },
    ],
    history: [
      { date: '2026-06-12', action: 'Created draft', user: 'Emily Thorne' },
      { date: '2026-06-14', action: 'Approved', user: 'Markus Vance' },
      { date: '2026-06-18', action: 'Published to Web & Assets', user: 'Emily Thorne' },
    ],
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
      { date: '2026-06-22', action: 'Approved & Scheduled', user: 'Alex Chen' },
    ],
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
      { date: '2026-06-20', action: 'Approved by Marketing Manager', user: 'Markus Vance' },
    ],
  },
  {
    id: 'cnt-6', title: 'Developer SDK Quickstart: Custom Webhook Subscriptions', type: 'Knowledge Base Article',
    campaign: 'Summer Product Launch 2026', funnelStage: 'Consideration', persona: 'Developer',
    author: 'Devon Knight', owner: 'Devon Knight', lastEdited: '2026-06-22',
    status: 'Published', priority: 'Medium', dueDate: '2026-06-24',
    description: 'Clear structural code blocks showing how programmers can spin up serverless functions to trigger off lead stages.',
    comments: [], history: [],
  },
  {
    id: 'cnt-7', title: 'Are you wasting 15+ hours/week on manual data entries?', type: 'Ad Copy',
    campaign: 'Lead Gen Q2', funnelStage: 'Awareness', persona: 'Agency Owner',
    author: 'Sarah Jenkins', owner: 'Sarah Jenkins', lastEdited: '2026-06-21',
    status: 'Ideas', priority: 'Low', dueDate: '2026-07-05',
    description: 'Punchy social ad designs positioning the marketing hub as the key to saving human coordination capital.',
    comments: [], history: [],
  },
  {
    id: 'cnt-8', title: 'Product Launch WhatsApp Flash: 20% discount on Early Access', type: 'WhatsApp Template',
    campaign: 'Summer Product Launch 2026', funnelStage: 'Decision', persona: 'Founder',
    author: 'Alex Chen', owner: 'Alex Chen', lastEdited: '2026-06-24',
    status: 'In Review', priority: 'High', dueDate: '2026-06-29',
    description: 'Flash broadcast campaign promoting early-bird pricing, targeting warm leads via WhatsApp business automation.',
    comments: [], history: [{ date: '2026-06-24', action: 'Submitted for Review', user: 'Alex Chen' }],
  },
];

// ─── Contracts ────────────────────────────────────────────────────────────────

export const contractsInitial = [
  { id: '#CTR-055', client: 'Arka Systems',    valuePerYear: 480000, start: 'Jan 1 2025',  end: 'Dec 31 2025', progress: 48, status: 'Active'            },
  { id: '#CTR-054', client: 'Nexus Retail',    valuePerYear: 240000, start: 'Mar 1 2025',  end: 'Feb 28 2026', progress: 30, status: 'Pending Signature'  },
  { id: '#CTR-053', client: 'Indra Logistics', valuePerYear: 960000, start: 'Jul 1 2024',  end: 'Jun 30 2025', progress: 91, status: 'Expiring'           },
  { id: '#CTR-052', client: 'Vega Partners',   valuePerYear: 180000, start: 'Feb 1 2025',  end: 'Jan 31 2026', progress: 35, status: 'Active'            },
  { id: '#CTR-051', client: 'BlueStar Media',  valuePerYear: 120000, start: 'Apr 1 2025',  end: 'Mar 31 2026', progress: 20, status: 'Active'            },
] as const;

export const contractStatusBadge: Record<string, string> = {
  Active:              'badge emerald',
  'Pending Signature': 'badge amber',
  Expiring:            'badge rose',
  Terminated:          'badge',
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardKpis = [
  { label: 'Total Leads',      value: '1,284', delta: '+18% this week',      trend: 'up',   color: 'purple',  icon: '👤' },
  { label: 'Active Deals',     value: '47',    delta: '+5 new today',        trend: 'up',   color: 'blue',    icon: '🤝' },
  { label: 'Monthly Revenue',  value: '₹2.4L', delta: '+12% vs last month',  trend: 'up',   color: 'emerald', icon: '💰' },
  { label: 'Invoices Overdue', value: '3',     delta: '−2 from last week',   trend: 'down', color: 'amber',   icon: '🧾' },
  { label: 'Email Open Rate',  value: '34.2%', delta: '+3.1% this campaign', trend: 'up',   color: 'rose',    icon: '✉'  },
];

export const dashboardPipelineStages = [
  { id: 'new',         label: 'New Enquiry',    color: 'new',         deals: [
    { name: 'Riya Sharma', company: 'BloomAds',   value: '₹45K', owner: 'JS' },
    { name: 'Karthik R.',  company: 'TechVibe',   value: '₹80K', owner: 'AM' },
    { name: 'Meera N.',    company: 'FreshBrand', value: '₹30K', owner: 'JS' },
  ]},
  { id: 'engaged',     label: 'Engaged',        color: 'engaged',     deals: [
    { name: 'Arjun Mehta', company: 'GrowthLab',   value: '₹1.2L', owner: 'SA' },
    { name: 'Priya K.',    company: 'NexaDigital', value: '₹60K',  owner: 'JS' },
  ]},
  { id: 'qualified',   label: 'Qualified',      color: 'qualified',   deals: [
    { name: 'Sameer P.', company: 'MediaCo',   value: '₹95K',  owner: 'AM' },
    { name: 'Divya T.',  company: 'BrandNest', value: '₹2.1L', owner: 'SA' },
  ]},
  { id: 'proposal',    label: 'Proposal Sent',  color: 'proposal',    deals: [
    { name: 'Raj Verma', company: 'ScaleUp', value: '₹1.8L', owner: 'JS' },
  ]},
  { id: 'negotiation', label: 'Negotiation',    color: 'negotiation', deals: [
    { name: 'Ananya S.', company: 'ClickFarm', value: '₹3.5L', owner: 'AM' },
    { name: 'Vikram L.', company: 'AdSphere',  value: '₹2.8L', owner: 'JS' },
  ]},
  { id: 'won',         label: 'Closed Win',     color: 'won',         deals: [
    { name: 'Nisha D.', company: 'BoldMark', value: '₹4.2L', owner: 'SA' },
  ]},
  { id: 'lost',        label: 'Closed Lose',    color: 'lost',        deals: [
    { name: 'Mohit B.', company: 'SprintCo', value: '₹70K', owner: 'AM' },
  ]},
];

export const dashboardFunnel = [
  { stage: 'New Enquiry', count: 186, pct: 100, color: 'var(--blue)'    },
  { stage: 'Engaged',     count: 124, pct: 67,  color: 'var(--purple)'  },
  { stage: 'Qualified',   count: 82,  pct: 44,  color: 'var(--amber)'   },
  { stage: 'Proposal',    count: 45,  pct: 24,  color: 'var(--purple)'  },
  { stage: 'Negotiation', count: 28,  pct: 15,  color: 'var(--amber)'   },
  { stage: 'Closed Win',  count: 19,  pct: 10,  color: 'var(--emerald)' },
];

export const dashboardRecentLeads = [
  { name: 'Riya Sharma', company: 'BloomAds',   source: 'Meta Ads',    stage: 'new',      score: 82, owner: 'JS', time: '2m ago'  },
  { name: 'Arjun Mehta', company: 'GrowthLab',  source: 'Website Form',stage: 'engaged',  score: 71, owner: 'SA', time: '28m ago' },
  { name: 'Priya K.',    company: 'NexaDigital', source: 'Referral',    stage: 'engaged',  score: 67, owner: 'JS', time: '1h ago'  },
  { name: 'Raj Verma',   company: 'ScaleUp',    source: 'LinkedIn DM', stage: 'proposal', score: 91, owner: 'JS', time: '3h ago'  },
  { name: 'Divya T.',    company: 'BrandNest',  source: 'Meta Ads',    stage: 'qualified', score: 88, owner: 'SA', time: '5h ago'  },
];

// Activity feed text contains JSX so only structured data lives here
export const dashboardActivityItems = [
  { dot: 'purple', leadName: 'Riya Sharma',   stage: 'Engaged',       extra: '',                               time: '2m ago'  },
  { dot: 'emerald', invoice: '#1047',          action: 'marked as Paid',amount: '₹1.8L',                       time: '14m ago' },
  { dot: 'blue',   source: 'n8n / Meta Ads',  assignee: 'Arjun Mehta',                                         time: '28m ago' },
  { dot: 'amber',  quote: '#Q-2041',           client: 'ScaleUp',       amount: '₹1.8L',                       time: '1h ago'  },
  { dot: 'rose',   leadCount: 12,              campaign: 'drip sequence',                                        time: '2h ago'  },
  { dot: 'purple', task: 'Follow up — NexaDigital', owner: 'JS',                                                time: '3h ago'  },
  { dot: 'blue',   post: 'Instagram post',    campaign: 'SummerSocial',                                         time: '4h ago'  },
];

export const dashboardTasks = [
  { title: 'Follow up — NexaDigital proposal',  due: 'Today 4pm',  priority: 'high',   owner: 'JS' },
  { title: 'Book discovery call — GrowthLab',   due: 'Today 6pm',  priority: 'high',   owner: 'SA' },
  { title: 'Send revised quote — ScaleUp',       due: 'Tomorrow',   priority: 'medium', owner: 'JS' },
  { title: 'Review SEO report — BoldMark',       due: 'Thu',        priority: 'low',    owner: 'AM' },
];

export const dashboardWorkflows = [
  { name: 'Lead Ingestion Pipeline',   runs: '1,204', lastRun: '2m ago',  status: 'active' },
  { name: 'Stage Change Automation',   runs: '384',   lastRun: '14m ago', status: 'active' },
  { name: 'Billing Cron (Daily 9am)',  runs: '62',    lastRun: '5h ago',  status: 'active' },
  { name: 'Weekly Report Generator',   runs: '12',    lastRun: '2d ago',  status: 'active' },
];

// ─── Deliveries ───────────────────────────────────────────────────────────────

export const deliveriesColumns = [
  { id: 'pending', title: 'Pending / Scheduled', color: 'blue' },
  { id: 'out', title: 'Out for Delivery', color: 'emerald' },
  { id: 'delivered', title: 'Delivered', color: 'purple' },
  { id: 'issues', title: 'Issues / Returns', color: 'rose' }
];

export const deliveriesData = [
  {
    id: 'DEL-1042',
    client: 'Ilara Hotel & Spa',
    address: 'OMR Road, Chennai',
    items: ['10x 5L Hand Wash', '5x 5L Floor Cleaner'],
    status: 'pending',
    agent: null,
    date: '2026-06-29',
    priority: 'High'
  },
  {
    id: 'DEL-1043',
    client: 'Khader Bhai Biriyani',
    address: 'Anna Nagar, Chennai',
    items: ['20x 5L Dishwash', '2x 5L Glass Cleaner'],
    status: 'out',
    agent: 'Thamizh T.',
    date: '2026-06-29',
    priority: 'Medium'
  },
  {
    id: 'DEL-1044',
    client: 'Hot Dosai',
    address: 'T-Nagar, Chennai',
    items: ['15x 5L Toilet Cleaner'],
    status: 'delivered',
    agent: 'Jatin M.',
    date: '2026-06-29',
    podImage: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=150&h=150&fit=crop',
    priority: 'Low'
  },
  {
    id: 'DEL-1045',
    client: 'Yalis Restaurant',
    address: 'Velachery, Chennai',
    items: ['5x 5L Hand Wash'],
    status: 'issues',
    agent: 'Manoj K.',
    date: '2026-06-29',
    issueNote: 'Client requested reschedule (Shop closed)',
    priority: 'Medium'
  }
];

// ─── Field Monitoring ─────────────────────────────────────────────────────────

export const fieldMonitoringKpis = [
  { label: 'Total Agents', value: '12', delta: 'All assigned', color: 'blue' },
  { label: 'Active in Field', value: '8', delta: '+2 from morning', color: 'emerald' },
  { label: 'Deliveries Today', value: '45/60', delta: '75% completion', color: 'purple' },
  { label: 'Idle / Alerts', value: '2', delta: 'Requires attention', color: 'rose' },
];

export const fieldMonitoringAgents = [
  { id: 1, name: 'Jatin M.', status: 'Active', location: 'Opal Hotel Area', battery: '85%', tasksCompleted: 8, lastUpdate: '2 mins ago', phone: '+91 9876543210' },
  { id: 2, name: 'Thamizh T.', status: 'On Delivery', location: 'Khader Bhai Biriyani', battery: '62%', tasksCompleted: 12, lastUpdate: 'Just now', phone: '+91 9876543211' },
  { id: 3, name: 'Rahul S.', status: 'Offline', location: 'Depot (Chennai)', battery: '---', tasksCompleted: 0, lastUpdate: 'Last seen 12h ago', phone: '+91 9876543212' },
  { id: 4, name: 'Manoj K.', status: 'Idle', location: 'Yalis Restaurant (Nearby)', battery: '40%', tasksCompleted: 5, lastUpdate: '15 mins ago', phone: '+91 9876543213' },
  { id: 5, name: 'Surya V.', status: 'Active', location: 'Hot Dosai Zone', battery: '91%', tasksCompleted: 4, lastUpdate: '5 mins ago', phone: '+91 9876543214' },
];

export const fieldMonitoringFeed = [
  { id: 101, agent: 'Thamizh T.', action: 'Delivered', target: 'Khader Bhai Biriyani (4x 5L Cans)', time: 'Just now', iconType: 'check' },
  { id: 102, agent: 'Jatin M.', action: 'Checked In', target: 'Opal Hotel', time: '2 mins ago', iconType: 'mapPin' },
  { id: 103, agent: 'Manoj K.', action: 'Alert', target: 'Idle for >15 mins', time: '5 mins ago', iconType: 'alert' },
  { id: 104, agent: 'Surya V.', action: 'Order Picked', target: 'Depot', time: '45 mins ago', iconType: 'package' },
  { id: 105, agent: 'Jatin M.', action: 'Closed Deal', target: 'Hot Dosai (New Client)', time: '1 hr ago', iconType: 'activity' },
];

// ─── Funnel ───────────────────────────────────────────────────────────────────

export const funnelKpis = [
  { label: 'Conversion Rate', value: '18.2%', delta: '+2.4%', isUp: true, icon: '📈', color: 'blue' },
  { label: 'Avg. Time to Close', value: '42 Days', delta: '-5 Days', isUp: true, icon: '⏱', color: 'emerald' },
  { label: 'Revenue Velocity', value: '$12.4K / Day', delta: '+12%', isUp: true, icon: '📊', color: 'purple' },
  { label: 'Leakage Amount', value: '$420.5K', delta: '+4.2%', isUp: false, icon: '📉', color: 'rose' },
];

export const funnelData = [
  { stage: 'LEADS', value: 840, conversion: '72%', totalPct: '100%', color: 'var(--blue)' },
  { stage: 'QUALIFIED', value: 605, conversion: '62%', totalPct: '72%', color: 'var(--purple)' },
  { stage: 'PROPOSAL', value: 375, conversion: '63%', totalPct: '45%', color: 'var(--amber)' },
  { stage: 'NEGOTIATION', value: 236, conversion: '64%', totalPct: '28%', color: 'var(--rose)' },
  { stage: 'CLOSING', value: 151, conversion: '-', totalPct: '18%', color: 'var(--emerald)' },
];

export const funnelPerformanceMetrics = [
  { name: 'Lead Entry', volume: '840 deals', value: '$2.1M', time: '4 days', dropoff: '28%', dropColor: 'var(--text-secondary)' },
  { name: 'Qualification', volume: '605 deals', value: '$1.8M', time: '12 days', dropoff: '38%', dropColor: 'var(--rose)' },
  { name: 'Demo/Proposal', volume: '375 deals', value: '$1.2M', time: '18 days', dropoff: '37%', dropColor: 'var(--text-secondary)' },
  { name: 'Negotiation', volume: '236 deals', value: '$840K', time: '22 days', dropoff: '36%', dropColor: 'var(--text-secondary)' },
  { name: 'Closing', volume: '151 deals', value: '$560K', time: '7 days', dropoff: '12%', dropColor: 'var(--text-secondary)' },
];

export const funnelAiInsights = [
  { title: 'Leakage in Qualification', text: '38% drop-off at Qualification is higher than your team average (24%). Verify if BANT criteria is too strict.', type: 'warning' },
  { title: 'Bottleneck at Demo Stage', text: 'Average time in Proposal/Demo stage has increased to 18 days. Consider automated follow-up sequences.', type: 'warning' },
  { title: 'Closing High Velocity', text: 'Win rate at negotiation is up 5% this month. Great performance on discount management!', type: 'success' },
];

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const invoicesData = [
  { id: '#INV-2091', client: 'Nexus Retail',    amount: 85000,  sentOn: 'Jun 12', expires: 'Jun 26', status: 'Sent'    },
  { id: '#INV-2090', client: 'BlueStar Media',  amount: 45500,  sentOn: 'Jun 8',  expires: 'Jun 22', status: 'Overdue' },
  { id: '#INV-2089', client: 'Arka Systems',    amount: 120000, sentOn: 'Jun 1',  expires: 'Jun 15', status: 'Paid'    },
  { id: '#INV-2088', client: 'Vega Partners',   amount: 60000,  sentOn: 'May 25', expires: 'Jun 8',  status: 'Overdue' },
  { id: '#INV-2087', client: 'Indra Logistics', amount: 240000, sentOn: 'May 18', expires: 'Jun 1',  status: 'Paid'    },
  { id: '#INV-2086', client: 'GrowthLab Inc.',  amount: 35000,  sentOn: 'May 10', expires: 'May 24', status: 'Draft'   },
];

export const invoicesStatusBadge: Record<string, string> = {
  Draft:   'badge',
  Sent:    'badge amber',
  Paid:    'badge emerald',
  Overdue: 'badge rose',
};

// ─── Leads ────────────────────────────────────────────────────────────────────

export type Lead = {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  source: string;
  stage: string;
  score: number;
  owner: string;
  whatsapp: boolean;
  created: string;
  intent: string;
};

export const leadsInitial: Lead[] = [
  { id: 1,  name: 'Riya Sharma', company: 'BloomAds',   phone: '+91 98765 43210', email: 'riya@bloomads.in',   source: 'Meta Ads',     stage: 'new',         score: 82, owner: 'JS', whatsapp: true,  created: '2m ago',  intent: 'SEO + Social'        },
  { id: 2,  name: 'Arjun Mehta', company: 'GrowthLab',  phone: '+91 98112 33445', email: 'arjun@growthlab.io', source: 'Website Form', stage: 'engaged',     score: 71, owner: 'SA', whatsapp: true,  created: '28m ago', intent: 'Email Marketing'     },
  { id: 3,  name: 'Priya K.',    company: 'NexaDigital', phone: '+91 97001 22334', email: 'priya@nexa.co',      source: 'Referral',     stage: 'engaged',     score: 67, owner: 'JS', whatsapp: false, created: '1h ago',  intent: 'Full CRM'            },
  { id: 4,  name: 'Sameer P.',   company: 'MediaCo',    phone: '+91 96543 11222', email: 'sameer@mediaco.in',  source: 'LinkedIn',     stage: 'qualified',   score: 88, owner: 'AM', whatsapp: true,  created: '3h ago',  intent: 'Social Media'        },
  { id: 5,  name: 'Divya T.',    company: 'BrandNest',  phone: '+91 95432 10111', email: 'divya@brandnest.com',source: 'Meta Ads',     stage: 'qualified',   score: 91, owner: 'SA', whatsapp: true,  created: '5h ago',  intent: 'SEO + Content'       },
  { id: 6,  name: 'Raj Verma',   company: 'ScaleUp',    phone: '+91 94321 09000', email: 'raj@scaleup.in',     source: 'LinkedIn DM',  stage: 'proposal',    score: 94, owner: 'JS', whatsapp: true,  created: '1d ago',  intent: 'Full CRM + Revenue'  },
  { id: 7,  name: 'Ananya S.',   company: 'ClickFarm',  phone: '+91 93210 08999', email: 'ananya@clickfarm.io',source: 'Cold Email',   stage: 'negotiation', score: 78, owner: 'AM', whatsapp: false, created: '2d ago',  intent: 'Analytics'           },
  { id: 8,  name: 'Vikram L.',   company: 'AdSphere',   phone: '+91 92109 07888', email: 'vikram@adsphere.com',source: 'Referral',     stage: 'negotiation', score: 85, owner: 'JS', whatsapp: true,  created: '2d ago',  intent: 'Email + Social'      },
  { id: 9,  name: 'Nisha D.',    company: 'BoldMark',   phone: '+91 91098 06777', email: 'nisha@boldmark.in',  source: 'Meta Ads',     stage: 'won',         score: 97, owner: 'SA', whatsapp: true,  created: '5d ago',  intent: 'Full Suite'          },
  { id: 10, name: 'Mohit B.',    company: 'SprintCo',   phone: '+91 90987 05666', email: 'mohit@sprintco.io',  source: 'Cold Email',   stage: 'lost',        score: 40, owner: 'AM', whatsapp: false, created: '7d ago',  intent: 'SEO'                 },
];

export const leadsStageFilters = ['all', 'new', 'engaged', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

export const leadsSources = ['Meta Ads', 'Website Form', 'Referral', 'LinkedIn', 'LinkedIn DM', 'Cold Email', 'Other'];

export const leadsStages = ['new', 'engaged', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

// ─── Payments ─────────────────────────────────────────────────────────────────

export type Payment = {
  id: string; client: string; invoiceId: string; amount: number;
  date: string; method: 'UPI' | 'NEFT' | 'Cheque' | 'Pending';
  status: 'Received' | 'Pending' | 'Failed';
};

export const paymentsData: Payment[] = [
  { id: '#PAY-881', client: 'Arka Systems',    invoiceId: 'INV-2089', amount: 120000, date: 'Jun 14',  method: 'NEFT',    status: 'Received' },
  { id: '#PAY-880', client: 'BlueStar Media',  invoiceId: 'INV-2090', amount: 45500,  date: 'Jun 12',  method: 'Cheque',  status: 'Failed'   },
  { id: '#PAY-879', client: 'Indra Logistics', invoiceId: 'INV-2087', amount: 240000, date: 'Jun 9',   method: 'UPI',     status: 'Received' },
  { id: '#PAY-878', client: 'Nexus Retail',    invoiceId: 'INV-2091', amount: 85000,  date: '—',       method: 'Pending', status: 'Pending'  },
  { id: '#PAY-877', client: 'Vega Partners',   invoiceId: 'INV-2088', amount: 60000,  date: 'May 30',  method: 'NEFT',    status: 'Failed'   },
  { id: '#PAY-876', client: 'GrowthLab Inc.',  invoiceId: 'INV-2085', amount: 35000,  date: 'May 25',  method: 'UPI',     status: 'Received' },
];

export const paymentsRecentActivity = [
  { icon: 'ti-circle-check', iconBg: 'var(--emerald-dim)', iconColor: 'var(--emerald-light)', title: '₹1,20,000 received — Arka Systems',    meta: 'INV-2089 · Jun 14 · NEFT'          },
  { icon: 'ti-circle-x',     iconBg: 'var(--rose-dim)',    iconColor: 'var(--rose-light)',    title: '₹45,500 failed — BlueStar Media',      meta: 'INV-2090 · Jun 12 · Cheque returned' },
  { icon: 'ti-circle-check', iconBg: 'var(--emerald-dim)', iconColor: 'var(--emerald-light)', title: '₹2,40,000 received — Indra Logistics',  meta: 'INV-2087 · Jun 9 · UPI'             },
  { icon: 'ti-clock',        iconBg: 'var(--amber-dim)',   iconColor: 'var(--amber)',         title: '₹85,000 pending — Nexus Retail',       meta: 'INV-2091 · Due Jun 26'              },
];

export const paymentsCollectionMethods = [
  { label: 'UPI / Online', amount: '₹5.4L', pct: 55, color: 'var(--emerald)' },
  { label: 'NEFT / Wire',  amount: '₹3.2L', pct: 33, color: 'var(--blue)'    },
  { label: 'Cheque',       amount: '₹1.2L', pct: 12, color: 'var(--amber)'   },
];

export const paymentsStatusBadge: Record<string, string> = {
  Received: 'badge emerald',
  Pending:  'badge amber',
  Failed:   'badge rose',
};

// ─── Marketing Calendar ───────────────────────────────────────────────────────

export type ScheduledEvent = {
  id: number; date: number; title: string; channel: string; time: string;
  type: string; author: string; badgeChannel: string; badgeStatus: string;
  status: string; color: string; company?: string; client?: string;
};

export const marketingCalendarChannelColor: Record<string, string> = {
  LinkedIn: 'var(--blue)', Twitter: 'var(--blue)', Instagram: 'var(--rose)',
  Email: 'var(--purple)', Blog: 'var(--emerald)', YouTube: 'var(--rose)',
};

export const marketingCalendarChannelBadge: Record<string, string> = {
  LinkedIn: 'blue', Twitter: 'blue', Instagram: 'rose',
  Email: 'purple', Blog: 'emerald', YouTube: 'rose',
};

export const marketingCalendarAuthors = ['Priya S.', 'Anita K.', 'Rohan M.'];

export const marketingCalendarEvents: ScheduledEvent[] = [
  { id: 1,  date: 5,  title: 'Product Launch Teaser',        channel: 'LinkedIn',  time: '9:00 AM',  type: 'Social',  author: 'Priya S.', badgeChannel: 'blue',    badgeStatus: 'emerald', status: 'Published', color: 'var(--blue)'    },
  { id: 2,  date: 10, title: 'Summer Sale Announce',          channel: 'Twitter',   time: '11:00 AM', type: 'Social',  author: 'Anita K.', badgeChannel: 'blue',    badgeStatus: 'emerald', status: 'Published', color: 'var(--blue)'    },
  { id: 3,  date: 12, title: 'Mid-Month Newsletter',          channel: 'Email',     time: '8:00 AM',  type: 'Email',   author: 'Rohan M.', badgeChannel: 'purple',  badgeStatus: 'emerald', status: 'Published', color: 'var(--purple)'  },
  { id: 4,  date: 16, title: 'Feature Spotlight Video',       channel: 'YouTube',   time: '3:00 PM',  type: 'Video',   author: 'Priya S.', badgeChannel: 'rose',    badgeStatus: 'amber',   status: 'Scheduled', color: 'var(--rose)'    },
  { id: 5,  date: 18, title: 'Customer Success Story',        channel: 'Blog',      time: '10:00 AM', type: 'Content', author: 'Anita K.', badgeChannel: 'emerald', badgeStatus: 'amber',   status: 'Scheduled', color: 'var(--emerald)' },
  { id: 6,  date: 20, title: 'Webinar Invite',                channel: 'Email',     time: '9:00 AM',  type: 'Email',   author: 'Rohan M.', badgeChannel: 'purple',  badgeStatus: 'amber',   status: 'Scheduled', color: 'var(--purple)'  },
  { id: 7,  date: 24, title: 'LinkedIn post — case study',    channel: 'LinkedIn',  time: '10:00 AM', type: 'Social',  author: 'Priya S.', badgeChannel: 'blue',    badgeStatus: 'amber',   status: 'Scheduled', color: 'var(--blue)'    },
  { id: 8,  date: 24, title: 'Q3 Goals Overview',             channel: 'Blog',      time: '2:00 PM',  type: 'Content', author: 'Anita K.', badgeChannel: 'emerald', badgeStatus: 'amber',   status: 'Scheduled', color: 'var(--emerald)' },
  { id: 9,  date: 25, title: 'Partner Announcement',          channel: 'Twitter',   time: '12:00 PM', type: 'Social',  author: 'Rohan M.', badgeChannel: 'blue',    badgeStatus: 'amber',   status: 'Scheduled', color: 'var(--blue)'    },
  { id: 10, date: 26, title: 'June Newsletter',               channel: 'Email',     time: '9:00 AM',  type: 'Email',   author: 'Rohan M.', badgeChannel: 'purple',  badgeStatus: 'amber',   status: 'Scheduled', color: 'var(--purple)'  },
  { id: 11, date: 28, title: 'Instagram reel — product demo', channel: 'Instagram', time: '3:00 PM',  type: 'Social',  author: 'Anita K.', badgeChannel: 'rose',    badgeStatus: 'amber',   status: 'Scheduled', color: 'var(--rose)'    },
  { id: 12, date: 30, title: 'Blog: Q3 outlook',              channel: 'Blog',      time: '8:00 AM',  type: 'Content', author: 'Priya S.', badgeChannel: 'emerald', badgeStatus: 'amber',   status: 'Scheduled', color: 'var(--emerald)' },
];

// ─── Pipeline ─────────────────────────────────────────────────────────────────

export const pipelineInitial = [
  {
    id: 'new', label: 'New Enquiry', color: 'new', headerColor: 'var(--blue)',
    deals: [
      { id: 1, name: 'Riya Sharma', company: 'BloomAds', value: 45000, owner: 'JS', days: 0, source: 'Meta Ads' },
      { id: 2, name: 'Karthik R.', company: 'TechVibe', value: 80000, owner: 'AM', days: 1, source: 'Form' },
    ],
  },
  {
    id: 'sample', label: 'Sample Delivered', color: 'engaged', headerColor: 'var(--purple)',
    deals: [
      { id: 4, name: 'Hotel Manager', company: 'Ilara Hotel & Spa', value: 120000, owner: 'SA', days: 3, source: 'WhatsApp' },
      { id: 5, name: 'Purchase Head', company: 'Yalis Restaurant', value: 60000, owner: 'JS', days: 2, source: 'WhatsApp' },
    ],
  },
  {
    id: 'quote', label: 'Quote Sent', color: 'qualified', headerColor: 'var(--amber)',
    deals: [
      { id: 6, name: 'Procurement', company: 'Educational Inst.', value: 95000, owner: 'AM', days: 5, source: 'WhatsApp' },
      { id: 7, name: 'Divya T.', company: 'BrandNest', value: 210000, owner: 'SA', days: 4, source: 'Meta Ads' },
    ],
  },
  {
    id: 'negotiation', label: 'Negotiation', color: 'negotiation', headerColor: 'var(--amber)',
    deals: [
      { id: 9, name: 'Owner', company: 'Hot Dosai', value: 350000, owner: 'AM', days: 12, source: 'Cold Email' },
    ],
  },
  {
    id: 'confirmed', label: 'Order Confirmed', color: 'won', headerColor: 'var(--emerald)',
    deals: [
      { id: 11, name: 'Khader Bhai', company: 'Khader Bhai Biriyani', value: 420000, owner: 'SA', days: 18, source: 'WhatsApp' },
    ],
  },
];

export const pipelineWhatsAppActivity = [
  { id: 1, sender: 'Client', text: 'Hi, we need some samples for our hotel. Can you deliver 5L hand wash and floor cleaner?', time: '10:30 AM', date: '27/06/2026' },
  { id: 2, sender: 'Agent (Thamizh T.)', text: 'Priority - samples needed for Ilara Hotel & Spa. Added to queue.', time: '10:45 AM', date: '27/06/2026', internal: true },
  { id: 3, sender: 'Agent (Thamizh T.)', text: 'Sample Delivered at Ilara Hotel. Awaiting feedback.', time: '02:15 PM', date: '28/06/2026', internal: true },
  { id: 4, sender: 'Client', text: 'Thanks. The samples look good. Can you send a quote for 1000+ cans?', time: '11:00 AM', date: 'Today' },
];

// ─── Quotes ───────────────────────────────────────────────────────────────────

export const quotesInitial = [
  { id: '#Q-1042', client: 'Arka Systems', amount: 120000, sentOn: 'Jun 10', expires: 'Jun 30', status: 'Sent' },
  { id: '#Q-1041', client: 'Nexus Retail', amount: 85000, sentOn: 'Jun 8', expires: 'Jun 28', status: 'Accepted' },
  { id: '#Q-1040', client: 'Indra Logistics', amount: 240000, sentOn: 'Jun 5', expires: 'Jun 25', status: 'Sent' },
  { id: '#Q-1039', client: 'Vega Partners', amount: 60000, sentOn: 'May 28', expires: 'Jun 17', status: 'Expired' },
  { id: '#Q-1038', client: 'BlueStar Media', amount: 45500, sentOn: 'May 20', expires: 'Jun 10', status: 'Accepted' },
  { id: '#Q-1037', client: 'GrowthLab Inc.', amount: 95000, sentOn: 'May 15', expires: 'Jun 4', status: 'Draft' },
];

// ─── Workspace ────────────────────────────────────────────────────────────────

export const workspaceInitialMembers = [
  { id: 'm1', name: 'Sarah Connor', role: 'Admin', department: 'Management', avatar: 'SC', email: 'sarah@acme.co' },
  { id: 'm2', name: 'John Doe', role: 'Member', department: 'Engineering', avatar: 'JD', email: 'john@acme.co' },
  { id: 'm3', name: 'Ellen Ripley', role: 'Member', department: 'Design', avatar: 'ER', email: 'ripley@acme.co' },
  { id: 'm4', name: 'Marcus Wright', role: 'Guest', department: 'Marketing', avatar: 'MW', email: 'marcus@acme.co' }
];

export const workspaceInitialProjects = [
  { id: 'p1', name: 'Brand Identity Redesign', status: 'Active', members: ['m3', 'm4'], linkedDeal: 'deal-102', progress: 0, budget: { est: 25000, actual: 18500 }, color: '#6366f1' },
  { id: 'p2', name: 'API Integration Sprint', status: 'Active', members: ['m2'], linkedDeal: 'deal-105', progress: 0, budget: { est: 45000, actual: 32000 }, color: '#3b82f6' },
  { id: 'p3', name: 'SaaS Beta Launch Prep', status: 'Planning', members: ['m1', 'm2', 'm3'], linkedDeal: 'deal-109', progress: 0, budget: { est: 80000, actual: 5000 }, color: '#10b981' }
];

export const workspaceInitialTasks = [
  { id: 't1', title: 'Complete high-fidelity dashboard wireframes', projectId: 'p1', owner: 'm3', status: 'In Progress', priority: 'High', due: '2026-06-28', parentType: 'project', tags: ['design', 'ui'] },
  { id: 't2', title: 'Refactor Auth middleware for token expiration', projectId: 'p2', owner: 'm2', status: 'To Do', priority: 'High', due: '2026-06-26', parentType: 'project', tags: ['backend', 'security'] },
  { id: 't3', title: 'Draft email onboarding sequence copy', projectId: 'p3', owner: 'm4', status: 'To Do', priority: 'Normal', due: '2026-06-30', parentType: 'project', tags: ['copywriting', 'marketing'] },
  { id: 't4', title: 'Conduct user research database schema validation', projectId: 'p2', owner: 'm2', status: 'Done', priority: 'Low', due: '2026-06-22', parentType: 'project', tags: ['database'] },
  { id: 't5', title: 'Write unit tests for Stripe payment webhooks', projectId: 'p2', owner: 'm2', status: 'In Progress', priority: 'Urgent', due: '2026-06-25', parentType: 'project', tags: ['stripe', 'testing'] },
  { id: 't6', title: 'Finalize brand color palette system styles', projectId: 'p1', owner: 'm3', status: 'Done', priority: 'Normal', due: '2026-06-20', parentType: 'project', tags: ['design', 'branding'] },
  { id: 't7', title: 'Define SLA protocols and response times documentation', projectId: null, owner: 'm1', status: 'To Do', priority: 'Normal', due: '2026-07-02', parentType: null, tags: ['docs'] },
  { id: 't8', title: 'Set up Google Analytics marketing dashboard pixels', projectId: 'p3', owner: 'm4', status: 'To Do', priority: 'Low', due: '2026-06-27', parentType: 'project', tags: ['analytics'] }
];

export const workspaceInitialEvents = [
  { id: 'e1', title: 'Sprint Planning Alignment', date: '2026-06-25', time: '10:00', attendees: ['m1', 'm2', 'm3'], linkedRecord: { type: 'project', id: 'p2' }, color: '#3b82f6' },
  { id: 'e2', title: 'UI Design Review', date: '2026-06-25', time: '14:30', attendees: ['m1', 'm3'], linkedRecord: { type: 'project', id: 'p1' }, color: '#6366f1' },
  { id: 'e3', title: 'Marketing Sync Meeting', date: '2026-06-26', time: '11:00', attendees: ['m1', 'm4'], linkedRecord: null, color: '#10b981' },
  { id: 'e4', title: 'Prisma DB Migration Rollout', date: '2026-06-22', time: '09:00', attendees: ['m2'], linkedRecord: { type: 'project', id: 'p2' }, color: '#3b82f6' },
  { id: 'e5', title: 'Client Feedback Call', date: '2026-06-29', time: '15:00', attendees: ['m1', 'm3'], linkedRecord: { type: 'project', id: 'p1' }, color: '#6366f1' }
];

// ─── Social Media ─────────────────────────────────────────────────────────────

export const socialKpis = [
  { label: 'Total followers', value: '24.6K', delta: '+480 this month',       trend: 'up',   color: 'purple'  },
  { label: 'Posts this month', value: '38',   delta: 'Across 3 channels',     trend: 'up',   color: 'blue'    },
  { label: 'Avg. engagement',  value: '5.8%', delta: '+1.2% vs last mo.',     trend: 'up',   color: 'emerald' },
  { label: 'Pending approval', value: '5',    delta: 'Needs review',          trend: 'down', color: 'rose'    },
];

export const socialPlatforms = [
  {
    name: 'LinkedIn', handle: '@YourBrand', followers: '11.2K', icon: 'in',
    colorBg: 'var(--blue-dim)', colorText: 'var(--blue-light)', growth: '68%', barColor: 'var(--blue)',
    metrics: [{ v: '6.1%', l: 'Eng. rate' }, { v: '18', l: 'Posts' }, { v: '4.2K', l: 'Impressions' }],
  },
  {
    name: 'Instagram', handle: '@YourBrand', followers: '9.4K', icon: 'ig',
    colorBg: 'var(--rose-dim)', colorText: 'var(--rose-light)', growth: '52%', barColor: 'var(--rose)',
    metrics: [{ v: '7.3%', l: 'Eng. rate' }, { v: '14', l: 'Posts' }, { v: '3.8K', l: 'Impressions' }],
  },
  {
    name: 'Twitter / X', handle: '@YourBrand', followers: '4.0K', icon: '𝕏',
    colorBg: 'var(--emerald-dim)', colorText: 'var(--emerald-light)', growth: '28%', barColor: 'var(--emerald)',
    metrics: [{ v: '3.2%', l: 'Eng. rate' }, { v: '6', l: 'Posts' }, { v: '1.1K', l: 'Impressions' }],
  },
];

export const socialPendingPosts = [
  { platform: 'LinkedIn',  colorText: 'var(--blue-light)', text: 'Excited to share our latest case study on how Arka Systems improved retention by 42% using our platform...' },
  { platform: 'Instagram', colorText: 'var(--rose-light)', text: "🚀 Big things are coming this July. Stay tuned for our Q3 product launch — you won't want to miss it." },
];
