import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

// Unified stage set — matches the Lead stage dropdown so Leads, Deals,
// and Pipelines all speak the same stage vocabulary.
const unifiedStages = [
  { key: 'new',         label: 'New',         color: 'new',         headerColor: '#3b82f6', defaultProbability: 10,  order: 0 },
  { key: 'engaged',     label: 'Engaged',     color: 'engaged',     headerColor: '#7c5cbf', defaultProbability: 25,  order: 1 },
  { key: 'qualified',   label: 'Qualified',   color: 'qualified',   headerColor: '#f59e0b', defaultProbability: 40,  order: 2 },
  { key: 'proposal',    label: 'Proposal',    color: 'proposal',    headerColor: '#6366f1', defaultProbability: 65,  order: 3 },
  { key: 'negotiation', label: 'Negotiation', color: 'negotiation', headerColor: '#f97316', defaultProbability: 85,  order: 4 },
  { key: 'won',         label: 'Won',         color: 'won',         headerColor: '#10b981', defaultProbability: 100, order: 5, isClosing: true, isWon: true },
  { key: 'lost',        label: 'Lost',        color: 'lost',        headerColor: '#f43f5e', defaultProbability: 0,   order: 6, isClosing: true },
];

const pipelineDefs = [
  { name: 'Web Dev / Website Projects', icon: '🌐', isDefault: true, stages: unifiedStages },
  { name: 'Marketing Retainer', icon: '📈', stages: unifiedStages },
  { name: 'SaaS / Product', icon: '💻', stages: unifiedStages },
  { name: 'Influencer / Content', icon: '✨', stages: unifiedStages },
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

  // Pipelines — reset and reseed every run so stage definitions always match
  // pipelineDefs above. Deals referencing a deleted pipeline just have their
  // pipelineId set to null (see onDelete: SetNull in schema.prisma); their
  // pipelineStageKey string is left untouched and can be reassigned in the UI.
  await prisma.pipeline.deleteMany();
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
  console.log('Reset and reseeded 4 pipelines with unified stages.');

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
