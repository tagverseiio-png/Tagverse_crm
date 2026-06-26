export const mockAnalyticsData = {
  Deals: {
    kpi: {
      sum: { value: '$85,420', delta: '+12.5%', isUp: true },
      count: { value: '450', delta: '+5.2%', isUp: true },
      avg: { value: '$4,200', delta: '+1.1%', isUp: true }
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
      { name: 'SMB', value: 25 },
    ]
  },
  Accounts: {
    kpi: {
      count: { value: '142', delta: '+3', isUp: true },
      avg: { value: '1.2%', delta: '-0.4%', isUp: false }, // Using avg for churn rate mock
      sum: { value: '1,420', delta: '+15', isUp: true }
    },
    bar: [
      { name: 'Q1', spend: 0, revenue: 40 },
      { name: 'Q2', spend: 0, revenue: 55 },
      { name: 'Q3', spend: 0, revenue: 30 },
      { name: 'Q4', spend: 0, revenue: 17 },
    ],
    donut: [
      { name: 'Active', value: 142 },
      { name: 'Inactive', value: 12 },
      { name: 'Churned', value: 5 },
    ]
  },
  Campaigns: {
    kpi: {
      avg: { value: '284%', delta: '+24.2%', isUp: true },
      sum: { value: '$45,000', delta: '+10.5%', isUp: true },
      count: { value: '12', delta: '+2', isUp: true }
    },
    bar: [
      { name: 'Meta Ads', spend: 4000, revenue: 8000 },
      { name: 'LinkedIn', spend: 3000, revenue: 5500 },
      { name: 'Google Ads', spend: 2000, revenue: 9800 },
      { name: 'TikTok', spend: 2780, revenue: 3908 },
      { name: 'Email', spend: 1890, revenue: 4800 },
    ],
    donut: [
      { name: 'Social', value: 45 },
      { name: 'Search', value: 35 },
      { name: 'Email', value: 20 },
    ]
  },
  Leads: {
    kpi: {
      count: { value: '1,284', delta: '+18.4%', isUp: true },
      avg: { value: '12 days', delta: '-2 days', isUp: true },
      sum: { value: '$120,000', delta: '+5.0%', isUp: true }
    },
    bar: [
      { name: 'Week 1', spend: 0, revenue: 320 },
      { name: 'Week 2', spend: 0, revenue: 450 },
      { name: 'Week 3', spend: 0, revenue: 290 },
      { name: 'Week 4', spend: 0, revenue: 510 },
    ],
    donut: [
      { name: 'Organic Search', value: 400 },
      { name: 'Direct', value: 300 },
      { name: 'Social', value: 300 },
      { name: 'Referral', value: 200 },
    ]
  }
};
