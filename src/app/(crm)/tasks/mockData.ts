export const REPS = [
  { id: 'r1', name: 'Arjun S.', avatar: 'AS' },
  { id: 'r2', name: 'Priya N.', avatar: 'PN' },
  { id: 'r3', name: 'Kiran D.', avatar: 'KD' },
  { id: 'r4', name: 'Sarah C.', avatar: 'SC' },
  { id: 'r5', name: 'John D.', avatar: 'JD' },
];

export const STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed'];

export const DEALS = [
  { id: 'd1', title: 'Acme Corp — Enterprise Plan', value: 85000, stage: 'Negotiation', rep: 'r1' },
  { id: 'd2', title: 'BrightWave — Growth Package', value: 62000, stage: 'Proposal', rep: 'r2' },
  { id: 'd3', title: 'NovaTech — Starter Bundle', value: 43000, stage: 'Qualified', rep: 'r3' },
  { id: 'd4', title: 'Zenith Retail — Full Suite', value: 110000, stage: 'Closed', rep: 'r1' },
  { id: 'd5', title: 'CoreLogic — API Access', value: 25000, stage: 'Lead', rep: 'r4' },
  { id: 'd6', title: 'Nexus Retail — Expansion', value: 55000, stage: 'Proposal', rep: 'r5' },
  { id: 'd7', title: 'Indra Logistics — Platform', value: 140000, stage: 'Negotiation', rep: 'r3' },
  { id: 'd8', title: 'Vega Partners — Pilot', value: 15000, stage: 'Qualified', rep: 'r2' },
];

export const INITIAL_TASKS = [
  { id: 't1', title: 'Send final contract for review', dealId: 'd1', rep: 'r1', due: '2026-06-25', done: false, lastActivity: 1 },
  { id: 't2', title: 'Schedule product demo', dealId: 'd2', rep: 'r2', due: '2026-06-28', done: false, lastActivity: 2 },
  { id: 't3', title: 'Send initial pitch deck', dealId: 'd5', rep: 'r4', due: '2026-06-22', done: true, lastActivity: 5 },
  { id: 't4', title: 'Follow up on technical requirements', dealId: 'd3', rep: 'r3', due: '2026-06-29', done: false, lastActivity: 4 },
  { id: 't5', title: 'Draft proposal document', dealId: 'd6', rep: 'r5', due: '2026-06-30', done: false, lastActivity: 1 },
  { id: 't6', title: 'Discuss pricing objections', dealId: 'd7', rep: 'r3', due: '2026-06-26', done: false, lastActivity: 0 },
  { id: 't7', title: 'Confirm pilot scope', dealId: 'd8', rep: 'r2', due: '2026-07-02', done: false, lastActivity: 3 },
  { id: 't8', title: 'Onboarding kickoff', dealId: 'd4', rep: 'r1', due: '2026-06-20', done: true, lastActivity: 10 },
  { id: 't9', title: 'Legal review of redlines', dealId: 'd1', rep: 'r1', due: '2026-06-27', done: false, lastActivity: 1 },
  { id: 't10', title: 'Security questionnaire completion', dealId: 'd7', rep: 'r3', due: '2026-06-24', done: true, lastActivity: 2 },
  { id: 't11', title: 'Identify decision makers', dealId: 'd5', rep: 'r4', due: '2026-06-26', done: false, lastActivity: 4 },
  { id: 't12', title: 'Prepare ROI calculator', dealId: 'd2', rep: 'r2', due: '2026-06-29', done: false, lastActivity: 2 },
  { id: 't13', title: 'Check in on budget approval', dealId: 'd3', rep: 'r3', due: '2026-06-25', done: false, lastActivity: 6 },
  { id: 't14', title: 'Review competitor analysis', dealId: 'd8', rep: 'r2', due: '2026-06-28', done: true, lastActivity: 3 },
  { id: 't15', title: 'Procurement vendor setup', dealId: 'd4', rep: 'r1', due: '2026-06-22', done: true, lastActivity: 8 },
  { id: 't16', title: 'Draft case study for reference', dealId: 'd6', rep: 'r5', due: '2026-07-01', done: false, lastActivity: 1 },
  { id: 't17', title: 'Executive alignment meeting', dealId: 'd7', rep: 'r3', due: '2026-06-28', done: false, lastActivity: 0 },
  { id: 't18', title: 'Send standard NDA', dealId: 'd5', rep: 'r4', due: '2026-06-21', done: true, lastActivity: 5 },
  { id: 't19', title: 'Review integration docs', dealId: 'd1', rep: 'r1', due: '2026-06-26', done: false, lastActivity: 1 },
  { id: 't20', title: 'Follow up after demo', dealId: 'd2', rep: 'r2', due: '2026-06-25', done: true, lastActivity: 2 },
];

export const TODAY = new Date('2026-06-29');
