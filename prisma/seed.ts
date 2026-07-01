import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@tagverse.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@tagverse.com',
      passwordHash,
      role: 'admin',
    },
  });

  const existingSettings = await prisma.organizationSettings.findFirst();
  if (!existingSettings) {
    await prisma.organizationSettings.create({
      data: {
        companyName: 'Tagverse',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
      },
    });
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
