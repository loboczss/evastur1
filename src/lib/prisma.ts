import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const FALLBACK_POSTGRES_URL = 'postgresql://evastur:evastur@localhost:5432/evastur';

const resolveConnectionString = () =>
  process.env.POSTGRES_PRISMA_URL ??
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  FALLBACK_POSTGRES_URL;

const getOrCreatePrismaClient = () => {
  const connectionString = resolveConnectionString();
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL (ou POSTGRES_PRISMA_URL) não foi definido. Configure as variáveis de ambiente do banco antes de iniciar o app.',
    );
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      datasources: { db: { url: connectionString } },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  return globalForPrisma.prisma;
};

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getOrCreatePrismaClient();
    const value = Reflect.get(client, prop, receiver);

    return typeof value === 'function' ? value.bind(client) : value;
  },
});
