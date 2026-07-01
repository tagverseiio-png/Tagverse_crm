import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

const pipelineDefs = [
  {
    name: 'Web Dev / Website Projects', icon: '🌐', isDefault: true,
    stages: [
      { key: 'new_enquiry', label: 'New Enquiry',    color: 'new',         headerColor: '#3b82f6', defaultProbability: 10,  order: 0 },
      { key: 'discovery',   label: 'Discovery Call', color: 'engaged',     headerColor: '#7c5cbf', defaultProbability: 25,  order: 1 },
      { key: 'proposal',    label: 'Proposal Sent',  color: 'proposal',    headerColor: '#6366f1', defaultProbability: 65,  order: 2 },
      { key: 'negotiation', label: 'Negotiation',    color: 'negotiation', headerColor: '#f97316', defaultProbability: 85,  order: 3 },
      { key: 'won',         label: 'Closed Win',     color: 'won',         headerColor: '#10b981', defaultProbability: 100, order: 4, isClosing: true, isWon: true },
      { key: 'lost',        label: 'Closed Lost',    color: 'lost',        headerColor: '#f43f5e', defaultProbability: 0,   order: 5, isClosing: true },
    ],
  },
  {
    name: 'Marketing Retainer', icon: '📈',
    stages: [
      { key: 'lead',        label: 'Lead',                color: 'new',         headerColor: '#3b82f6', defaultProbability: 10,  order: 0 },
      { key: 'qualified',   label: 'Qualified',           color: 'qualified',   headerColor: '#f59e0b', defaultProbability: 40,  order: 1 },
      { key: 'pitch',       label: 'Pitch/Strategy Call', color: 'engaged',     headerColor: '#7c5cbf', defaultProbability: 50,  order: 2 },
      { key: 'proposal',    label: 'Proposal Sent',       color: 'proposal',    headerColor: '#6366f1', defaultProbability: 65,  order: 3 },
      { key: 'negotiation', label: 'Negotiation',         color: 'negotiation', headerColor: '#f97316', defaultProbability: 85,  order: 4 },
      { key: 'won',         label: 'Onboarded',           color: 'won',         headerColor: '#10b981', defaultProbability: 100, order: 5, isClosing: true, isWon: true },
      { key: 'lost',        label: 'Lost',                color: 'lost',        headerColor: '#f43f5e', defaultProbability: 0,   order: 6, isClosing: true },
    ],
  },
  {
    name: 'SaaS / Product', icon: '💻',
    stages: [
      { key: 'demo_req',    label: 'Demo Requested', color: 'new',         headerColor: '#3b82f6', defaultProbability: 10,  order: 0 },
      { key: 'demo_done',   label: 'Demo Done',      color: 'engaged',     headerColor: '#7c5cbf', defaultProbability: 30,  order: 1 },
      { key: 'trial',       label: 'Trial',          color: 'qualified',   headerColor: '#f59e0b', defaultProbability: 50,  order: 2 },
      { key: 'negotiation', label: 'Negotiation',    color: 'negotiation', headerColor: '#f97316', defaultProbability: 85,  order: 3 },
      { key: 'won',         label: 'Subscribed',     color: 'won',         headerColor: '#10b981', defaultProbability: 100, order: 4, isClosing: true, isWon: true },
      { key: 'lost',        label: 'Churned/Lost',   color: 'lost',        headerColor: '#f43f5e', defaultProbability: 0,   order: 5, isClosing: true },
    ],
  },
  {
    name: 'Influencer / Content', icon: '✨',
    stages: [
      { key: 'enquiry',     label: 'Enquiry',     color: 'new',         headerColor: '#3b82f6', defaultProbability: 10,  order: 0 },
      { key: 'brief',       label: 'Brief Shared',color: 'engaged',     headerColor: '#7c5cbf', defaultProbability: 40,  order: 1 },
      { key: 'quote',       label: 'Quote Sent',  color: 'proposal',    headerColor: '#6366f1', defaultProbability: 65,  order: 2 },
      { key: 'negotiation', label: 'Negotiation', color: 'negotiation', headerColor: '#f97316', defaultProbability: 85,  order: 3 },
      { key: 'won',         label: 'Confirmed',   color: 'won',         headerColor: '#10b981', defaultProbability: 100, order: 4, isClosing: true, isWon: true },
      { key: 'lost',        label: 'Lost',        color: 'lost',        headerColor: '#f43f5e', defaultProbability: 0,   order: 5, isClosing: true },
    ],
  },
];

async function main() {
  // Admin user
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@tagverse.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@tagverse.com', passwordHash, role: 'admin' },
  });

  // Org settings
  const existingSettings = await prisma.organizationSettings.findFirst();
  if (!existingSettings) {
    await prisma.organizationSettings.create({
      data: { companyName: 'Tagverse', currency: 'INR', timezone: 'Asia/Kolkata' },
    });
  }

  // Pipelines (idempotent — skip if any pipeline exists)
  const pipelineCount = await prisma.pipeline.count();
  if (pipelineCount === 0) {
    for (const def of pipelineDefs) {
      await prisma.pipeline.create({
        data: {
          name: def.name,
          icon: def.icon,
          isDefault: def.isDefault ?? false,
          stages: { create: def.stages },
        },
      });
    }
    console.log('Seeded 4 pipelines with stages.');
  }

  console.log('Seed complete. Login with admin@tagverse.com / password123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
