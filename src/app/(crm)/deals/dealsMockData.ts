export const pipelines = [
  { id: 'web_dev', label: 'Web Dev / Website Projects', icon: '🌐', deals: 4 },
  { id: 'marketing', label: 'Marketing Retainer', icon: '📈', deals: 5 },
  { id: 'saas', label: 'SaaS / Product', icon: '💻', deals: 2 },
  { id: 'influencer', label: 'Influencer / Content', icon: '✨', deals: 3 },
];

export const pipelineStageConfig: Record<string, Record<string, { label: string; color: string; headerColor: string; defaultProbability: number; isClosing?: boolean; isWon?: boolean }>> = {
  web_dev: {
    new_enquiry: { label: 'New Enquiry', color: 'new', headerColor: '#3b82f6', defaultProbability: 10 },
    discovery: { label: 'Discovery Call', color: 'engaged', headerColor: '#7c5cbf', defaultProbability: 25 },
    proposal: { label: 'Proposal Sent', color: 'proposal', headerColor: '#6366f1', defaultProbability: 65 },
    negotiation: { label: 'Negotiation', color: 'negotiation', headerColor: '#f97316', defaultProbability: 85 },
    won: { label: 'Closed Win', color: 'won', headerColor: '#10b981', defaultProbability: 100, isClosing: true, isWon: true },
    lost: { label: 'Closed Lost', color: 'lost', headerColor: '#f43f5e', defaultProbability: 0, isClosing: true, isWon: false },
  },
  marketing: {
    lead: { label: 'Lead', color: 'new', headerColor: '#3b82f6', defaultProbability: 10 },
    qualified: { label: 'Qualified', color: 'qualified', headerColor: '#f59e0b', defaultProbability: 40 },
    pitch: { label: 'Pitch/Strategy Call', color: 'engaged', headerColor: '#7c5cbf', defaultProbability: 50 },
    proposal: { label: 'Proposal Sent', color: 'proposal', headerColor: '#6366f1', defaultProbability: 65 },
    negotiation: { label: 'Negotiation', color: 'negotiation', headerColor: '#f97316', defaultProbability: 85 },
    won: { label: 'Onboarded', color: 'won', headerColor: '#10b981', defaultProbability: 100, isClosing: true, isWon: true },
    lost: { label: 'Lost', color: 'lost', headerColor: '#f43f5e', defaultProbability: 0, isClosing: true, isWon: false },
  },
  saas: {
    demo_req: { label: 'Demo Requested', color: 'new', headerColor: '#3b82f6', defaultProbability: 10 },
    demo_done: { label: 'Demo Done', color: 'engaged', headerColor: '#7c5cbf', defaultProbability: 30 },
    trial: { label: 'Trial', color: 'qualified', headerColor: '#f59e0b', defaultProbability: 50 },
    negotiation: { label: 'Negotiation', color: 'negotiation', headerColor: '#f97316', defaultProbability: 85 },
    won: { label: 'Subscribed', color: 'won', headerColor: '#10b981', defaultProbability: 100, isClosing: true, isWon: true },
    lost: { label: 'Churned/Lost', color: 'lost', headerColor: '#f43f5e', defaultProbability: 0, isClosing: true, isWon: false },
  },
  influencer: {
    enquiry: { label: 'Enquiry', color: 'new', headerColor: '#3b82f6', defaultProbability: 10 },
    brief: { label: 'Brief Shared', color: 'engaged', headerColor: '#7c5cbf', defaultProbability: 40 },
    quote: { label: 'Quote Sent', color: 'proposal', headerColor: '#6366f1', defaultProbability: 65 },
    negotiation: { label: 'Negotiation', color: 'negotiation', headerColor: '#f97316', defaultProbability: 85 },
    won: { label: 'Confirmed', color: 'won', headerColor: '#10b981', defaultProbability: 100, isClosing: true, isWon: true },
    lost: { label: 'Lost', color: 'lost', headerColor: '#f43f5e', defaultProbability: 0, isClosing: true, isWon: false },
  }
};

export type Deal = {
  id: number;
  name: string;
  client: string;
  value: number;
  pipelineId: string;
  stage: string;
  owner: string;
  ownerFull: string;
  tags: string[];
  probability: number;
  daysInStage: number;
  nextFollowUp: string;
  source: string;
  serviceType: string;
  expectedClose: string;
  lastContact: string;
  notes: string;
  created: string;
};

export const initialDeals: Deal[] = [
  { id: 1, name: 'Website Redesign Project', client: 'BloomAds', value: 450000, pipelineId: 'web_dev', stage: 'proposal', owner: 'JS', ownerFull: 'Jose L.', tags: ['SEO', 'Web Dev'], probability: 65, daysInStage: 3, nextFollowUp: 'Tomorrow', source: 'Meta Ads', serviceType: 'Web Dev / Website Projects', expectedClose: 'Jul 15', lastContact: '1d ago', notes: 'Eager to start.', created: '2d ago' },
  { id: 2, name: 'Social Media Campaign', client: 'GrowthLab', value: 180000, pipelineId: 'marketing', stage: 'proposal', owner: 'SA', ownerFull: 'Sarah A.', tags: ['Social', 'Content'], probability: 65, daysInStage: 16, nextFollowUp: 'Today', source: 'Referral', serviceType: 'Marketing Retainer', expectedClose: 'Jun 30', lastContact: '2w ago', notes: 'Stuck in legal.', created: '5d ago' },
  { id: 3, name: 'Full CRM Implementation', client: 'NexaDigital', value: 720000, pipelineId: 'saas', stage: 'negotiation', owner: 'JS', ownerFull: 'Jose L.', tags: ['CRM', 'Enterprise'], probability: 85, daysInStage: 8, nextFollowUp: 'Jun 25', source: 'LinkedIn', serviceType: 'SaaS / Product', expectedClose: 'Aug 01', lastContact: '3d ago', notes: 'Reviewing contracts.', created: '12d ago' },
  { id: 4, name: 'Email Marketing Suite', client: 'MediaCo', value: 95000, pipelineId: 'marketing', stage: 'lead', owner: 'AM', ownerFull: 'Alex M.', tags: ['Email', 'Automation'], probability: 10, daysInStage: 1, nextFollowUp: 'Today', source: 'Cold Email', serviceType: 'Marketing Retainer', expectedClose: 'Sep 10', lastContact: 'Just now', notes: '', created: '1d ago' },
  { id: 5, name: 'Brand Identity Package', client: 'BrandNest', value: 310000, pipelineId: 'web_dev', stage: 'discovery', owner: 'SA', ownerFull: 'Sarah A.', tags: ['Design', 'Branding'], probability: 25, daysInStage: 4, nextFollowUp: 'Jun 26', source: 'Website Form', serviceType: 'Web Dev / Website Projects', expectedClose: 'Jul 20', lastContact: '2d ago', notes: '', created: '6d ago' },
  { id: 6, name: 'SEO Audit & Strategy', client: 'ScaleUp', value: 165000, pipelineId: 'marketing', stage: 'won', owner: 'JS', ownerFull: 'Jose L.', tags: ['SEO', 'Analytics'], probability: 100, daysInStage: 0, nextFollowUp: '—', source: 'Referral', serviceType: 'Marketing Retainer', expectedClose: 'Closed', lastContact: '1w ago', notes: '', created: '18d ago' },
];

export const notifications = [
  { id: 1, type: 'deal', text: 'Raj Verma moved to Negotiation stage', time: '5m ago', read: false },
  { id: 2, type: 'assign', text: 'You were assigned "Analytics Dashboard"', time: '12m ago', read: false },
  { id: 3, type: 'followup', text: 'Follow-up reminder: GrowthLab call today', time: '30m ago', read: false },
  { id: 4, type: 'deal', text: 'BoldMark deal closed — ₹4.2L won!', time: '1h ago', read: true },
  { id: 5, type: 'assign', text: 'Sarah A. assigned "Influencer Campaign"', time: '2h ago', read: true },
  { id: 6, type: 'followup', text: 'Follow-up with MediaCo overdue', time: '3h ago', read: true },
];
