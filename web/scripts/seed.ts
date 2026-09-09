import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Seeding an account is opt-in and credentials come from the environment, so no
// password ever lives in version control. Set SEED_ADMIN_EMAIL and
// SEED_ADMIN_PASSWORD to provision an ELITE account; leave them unset to skip.
async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log(
      'Skipping admin seed: set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to provision one.'
    );
    return;
  }

  if (password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 12 characters.');
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: process.env.SEED_ADMIN_NAME ?? 'Admin',
      password: hashed,
      subscriptionTier: 'ELITE',
    },
  });

  console.log(`Seeded admin account for ${email}.`);
}

main()
  .catch((e: unknown) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
