import 'dotenv/config';
import prismaPkg from '@prisma/client';
import bcrypt from 'bcrypt';

const { PrismaClient } = prismaPkg as typeof import('@prisma/client');

const FALLBACK_POSTGRES_URL = 'postgresql://evastur:evastur@localhost:5432/evastur';

const connectionString =
  process.env.DIRECT_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  FALLBACK_POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    'Não encontramos uma string de conexão para o banco. Defina DIRECT_URL, POSTGRES_URL_NON_POOLING ou DATABASE_URL antes de criar o superadmin.',
  );
}

const prisma = new PrismaClient({ datasources: { db: { url: connectionString } } });

async function main() {
  const email = "admin@evastur.com";
  const password = "admin123"; // ⚠️ troque depois!

  // Gera hash da senha
  const hash = await bcrypt.hash(password, 10);

  // Garante que o papel superadmin exista
  const role = await prisma.role.upsert({
    where: { name: "superadmin" },
    update: {},
    create: { name: "superadmin", description: "Controle total" },
  });

  // Cria o usuário
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Super Admin",
      email,
      passwordHash: hash,
      isActive: true,
    },
  });

  // Vincula user -> role
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id },
  });

  console.log("✅ Superadmin criado:", user);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
