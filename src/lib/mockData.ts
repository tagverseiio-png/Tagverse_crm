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
  ]
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
