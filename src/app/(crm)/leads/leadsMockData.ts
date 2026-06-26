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

export const initialLeads: Lead[] = [
  { id: 1, name: 'Riya Sharma', company: 'BloomAds', phone: '+91 98765 43210', email: 'riya@bloomads.in', source: 'Meta Ads', stage: 'new', score: 82, owner: 'JS', whatsapp: true, created: '2m ago', intent: 'SEO + Social' },
  { id: 2, name: 'Arjun Mehta', company: 'GrowthLab', phone: '+91 98112 33445', email: 'arjun@growthlab.io', source: 'Website Form', stage: 'engaged', score: 71, owner: 'SA', whatsapp: true, created: '28m ago', intent: 'Email Marketing' },
  { id: 3, name: 'Priya K.', company: 'NexaDigital', phone: '+91 97001 22334', email: 'priya@nexa.co', source: 'Referral', stage: 'engaged', score: 67, owner: 'JS', whatsapp: false, created: '1h ago', intent: 'Full CRM' },
  { id: 4, name: 'Sameer P.', company: 'MediaCo', phone: '+91 96543 11222', email: 'sameer@mediaco.in', source: 'LinkedIn', stage: 'qualified', score: 88, owner: 'AM', whatsapp: true, created: '3h ago', intent: 'Social Media' },
  { id: 5, name: 'Divya T.', company: 'BrandNest', phone: '+91 95432 10111', email: 'divya@brandnest.com', source: 'Meta Ads', stage: 'qualified', score: 91, owner: 'SA', whatsapp: true, created: '5h ago', intent: 'SEO + Content' },
  { id: 6, name: 'Raj Verma', company: 'ScaleUp', phone: '+91 94321 09000', email: 'raj@scaleup.in', source: 'LinkedIn DM', stage: 'proposal', score: 94, owner: 'JS', whatsapp: true, created: '1d ago', intent: 'Full CRM + Revenue' },
  { id: 7, name: 'Ananya S.', company: 'ClickFarm', phone: '+91 93210 08999', email: 'ananya@clickfarm.io', source: 'Cold Email', stage: 'negotiation', score: 78, owner: 'AM', whatsapp: false, created: '2d ago', intent: 'Analytics' },
  { id: 8, name: 'Vikram L.', company: 'AdSphere', phone: '+91 92109 07888', email: 'vikram@adsphere.com', source: 'Referral', stage: 'negotiation', score: 85, owner: 'JS', whatsapp: true, created: '2d ago', intent: 'Email + Social' },
  { id: 9, name: 'Nisha D.', company: 'BoldMark', phone: '+91 91098 06777', email: 'nisha@boldmark.in', source: 'Meta Ads', stage: 'won', score: 97, owner: 'SA', whatsapp: true, created: '5d ago', intent: 'Full Suite' },
  { id: 10, name: 'Mohit B.', company: 'SprintCo', phone: '+91 90987 05666', email: 'mohit@sprintco.io', source: 'Cold Email', stage: 'lost', score: 40, owner: 'AM', whatsapp: false, created: '7d ago', intent: 'SEO' },
];

export const stageFilters = ['all', 'new', 'engaged', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
export const sources = ['Meta Ads', 'Website Form', 'Referral', 'LinkedIn', 'LinkedIn DM', 'Cold Email', 'Other'];
export const stages = ['new', 'engaged', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
