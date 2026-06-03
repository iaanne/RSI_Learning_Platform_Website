// lib/db.ts
// =============================================================================
// Prisma Client Singleton
// Mencegah multiple instance di Next.js dev mode (hot reload)
// Referensi: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
// =============================================================================

import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export default db;