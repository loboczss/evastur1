import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = "admin@evastur.com";
  const password = "123456"; // ⚠️ troque depois!

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
