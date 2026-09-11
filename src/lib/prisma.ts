import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrisma() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

function isTransientDbError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /connection|closed|reset|10054|timed out|can't reach|server has closed/i.test(message);
}

export async function withPrismaRetry<T>(fn: () => Promise<T>, attempts = 2): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isTransientDbError(error) || i === attempts - 1) throw error;
      await prisma.$disconnect().catch(() => undefined);
    }
  }
  throw lastError;
}
