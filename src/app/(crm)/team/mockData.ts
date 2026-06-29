export const reps = [
  { id: '1', name: 'Alex Johnson', role: 'Senior Rep', avatar: 'AJ', dept: 'Sales', color: '#10b981', dealsClosed: 42, revenue: 125000, tasksDone: 85, workloadScore: 80, expertise: ['Enterprise', 'Tech'], points: 4200, level: 5 },
  { id: '2', name: 'Sarah Miller', role: 'Sales Rep', avatar: 'SM', dept: 'Sales', color: '#f59e0b', dealsClosed: 28, revenue: 84000, tasksDone: 62, workloadScore: 45, expertise: ['SMB', 'Retail'], points: 2850, level: 4 },
  { id: '3', name: 'Mike Davis', role: 'Sales Rep', avatar: 'MD', dept: 'Sales', color: '#3b82f6', dealsClosed: 35, revenue: 95000, tasksDone: 70, workloadScore: 60, expertise: ['Mid-Market', 'Finance'], points: 3500, level: 4 },
  { id: '4', name: 'Elena Rodriguez', role: 'SDR', avatar: 'ER', dept: 'Sales', color: '#8b5cf6', dealsClosed: 15, revenue: 30000, tasksDone: 110, workloadScore: 90, expertise: ['Outbound', 'Cold Calling'], points: 2100, level: 3 },
  { id: '5', name: 'David Chen', role: 'Account Exec', avatar: 'DC', dept: 'Sales', color: '#ec4899', dealsClosed: 20, revenue: 75000, tasksDone: 45, workloadScore: 30, expertise: ['Renewals', 'Tech'], points: 2600, level: 3 },
  { id: '6', name: 'Lisa Taylor', role: 'VP Sales', avatar: 'LT', dept: 'Management', color: '#06b6d4', dealsClosed: 5, revenue: 250000, tasksDone: 20, workloadScore: 75, expertise: ['Strategic', 'Enterprise'], points: 5500, level: 6 },
];

export const deals = [
  { id: 'd1', name: 'Acme Corp Upgrade', value: 25000, status: 'In Progress', repId: '1', tags: ['Enterprise', 'Tech'], lastUpdate: '2 hours ago' },
  { id: 'd2', name: 'TechStart License', value: 8500, status: 'New', repId: null, tags: ['SMB', 'Tech'], lastUpdate: '10 mins ago' },
  { id: 'd3', name: 'Global Retail Pos', value: 45000, status: 'In Progress', repId: '2', tags: ['Retail'], lastUpdate: '1 day ago' },
  { id: 'd4', name: 'FinServe Cloud', value: 60000, status: 'New', repId: null, tags: ['Enterprise', 'Finance'], lastUpdate: '30 mins ago' },
  { id: 'd5', name: 'Local Shop POS', value: 3000, status: 'In Progress', repId: '4', tags: ['SMB', 'Retail'], lastUpdate: '5 hours ago' },
  { id: 'd6', name: 'MegaBank System', value: 120000, status: 'Won', repId: '6', tags: ['Strategic', 'Finance'], lastUpdate: '2 days ago' },
  { id: 'd7', name: 'EduTech Platform', value: 15000, status: 'Lost', repId: '3', tags: ['Mid-Market', 'Tech'], lastUpdate: '1 week ago' },
  { id: 'd8', name: 'HealthCorp Software', value: 55000, status: 'New', repId: null, tags: ['Enterprise'], lastUpdate: '1 hour ago' },
  { id: 'd9', name: 'AutoParts CRM', value: 12000, status: 'In Progress', repId: '5', tags: ['Mid-Market', 'Renewals'], lastUpdate: '4 hours ago' },
  { id: 'd10', name: 'MediaGroup Ads', value: 32000, status: 'Won', repId: '1', tags: ['Enterprise'], lastUpdate: '3 days ago' }
];

export const rolesMatrix = [
  { id: 'r1', name: 'Admin', modules: { deals: { view: true, edit: true, delete: true }, contacts: { view: true, edit: true, delete: true }, reports: { view: true, edit: true, delete: true }, settings: { view: true, edit: true, delete: true } } },
  { id: 'r2', name: 'Manager', modules: { deals: { view: true, edit: true, delete: false }, contacts: { view: true, edit: true, delete: false }, reports: { view: true, edit: false, delete: false }, settings: { view: false, edit: false, delete: false } } },
  { id: 'r3', name: 'Sales Rep', modules: { deals: { view: true, edit: true, delete: false }, contacts: { view: true, edit: true, delete: false }, reports: { view: false, edit: false, delete: false }, settings: { view: false, edit: false, delete: false } } },
  { id: 'r4', name: 'Viewer', modules: { deals: { view: true, edit: false, delete: false }, contacts: { view: true, edit: false, delete: false }, reports: { view: true, edit: false, delete: false }, settings: { view: false, edit: false, delete: false } } },
];

export const activityFeed = [
  { id: 'a1', type: 'deal', repId: '1', action: 'moved deal Acme Corp Upgrade to', target: 'Negotiation', time: '10 mins ago', emojis: ['🔥', '👍'] },
  { id: 'a2', type: 'task', repId: '4', action: 'completed task', target: 'Call 10 leads', time: '45 mins ago', emojis: ['🎉'] },
  { id: 'a3', type: 'email', repId: '2', action: 'sent proposal to', target: 'Global Retail Pos', time: '2 hours ago', emojis: [] },
  { id: 'a4', type: 'deal', repId: '6', action: 'closed won', target: 'MegaBank System', time: '5 hours ago', emojis: ['🚀', '💰', '👏'] },
  { id: 'a5', type: 'task', repId: '3', action: 'added note to', target: 'EduTech Platform', time: '1 day ago', emojis: [] },
];
