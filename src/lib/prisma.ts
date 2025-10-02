import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const resolveConnectionString = () => {
  const connection =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.DIRECT_URL ??
    process.env.POSTGRES_DATABASE_URL;

  return connection;
};

const getOrCreatePrismaClient = () => {
  const connectionString = resolveConnectionString();

  if (!connectionString) {
    throw new Error(
      'Nenhuma variável de conexão com o banco foi encontrada. Defina DATABASE_URL, POSTGRES_PRISMA_URL, POSTGRES_URL, POSTGRES_URL_NON_POOLING, DIRECT_URL ou POSTGRES_DATABASE_URL antes de iniciar o app.',
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
