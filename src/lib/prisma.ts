/**
 * prisma.ts
 *
 * Instantiates and exports a single, global instance of the Prisma Client.
 * Leverages the PrismaNeon driver adapter to connect to Neon Postgres in
 * Prisma 7.
 *
 * Author: Natalie Phua
 * Date Created: 9/26/2026
 */

import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  // 1. Bind the Neon connection string to Prisma 7's Neon adapter
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });

  // 2. Instantiate the client with the adapter configuration
  prismaInstance = new PrismaClient({
    adapter,
    log: ["query"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;
