import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Test admin account (hidden - do not expose)
  const testPassword = await bcrypt.hash('1$zROmioM5', 12);
  await prisma.user.upsert({
    where: { email: 'abacus-d6dffe7a@example.com' },
    update: {},
    create: {
      email: 'abacus-d6dffe7a@example.com',
      name: 'Admin',
      password: testPassword,
      subscriptionTier: 'ELITE',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e: any) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
