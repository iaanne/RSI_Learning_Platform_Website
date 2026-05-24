// lib/db.ts
// =============================================================================
// Prisma Client Singleton
// Mencegah multiple instance di Next.js dev mode (hot reload)
// Referensi: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
// =============================================================================

import "dotenv/config"; // Memastikan Prisma Client otomatis membaca DATABASE_URL dari file .env
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export default db;