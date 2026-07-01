import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// prisma.config.ts is loaded without automatic .env parsing (Prisma 7),
// so .env is loaded explicitly here for the Migrate/CLI datasource URL below.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
});
