import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const connectionString =
  process.env.DIRECT_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error(
    'Não encontramos uma string de conexão para o banco. Defina DIRECT_URL, POSTGRES_URL_NON_POOLING ou DATABASE_URL antes de rodar o seed.',
  );
}

const prisma = new PrismaClient({ datasources: { db: { url: connectionString } } });

async function main() {
  /* ========= 1) Permissões base ========= */
  // Você pode expandir depois (ex: packages.read/write/delete, etc.)
  const permissionsSeed: Array<{ key: string; description?: string }> = [
    { key: 'users.read',   description: 'Listar usuários' },
    { key: 'users.write',  description: 'Criar/editar usuários e papéis do usuário' },
    { key: 'users.delete', description: 'Excluir usuários' },

    { key: 'roles.read',   description: 'Listar papéis' },
    { key: 'roles.write',  description: 'Criar/editar papéis' },
    { key: 'roles.delete', description: 'Excluir papéis' },

    { key: 'permissions.read',  description: 'Listar permissões' },
    { key: 'permissions.write', description: 'Criar/editar permissões' },
    { key: 'permissions.delete',description: 'Excluir permissões' },
  ];

  for (const p of permissionsSeed) {
    await prisma.permission.upsert({
      where: { key: p.key },
      update: { description: p.description },
      create: p,
    });
  }

  /* ========= 2) Papéis ========= */
  const comum = await prisma.role.upsert({
    where: { name: 'comum' },
    update: {},
    create: { name: 'comum', description: 'Usuário padrão' },
  });

  const admin = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', description: 'Gerenciador de usuários' },
  });

  const superadmin = await prisma.role.upsert({
    where: { name: 'superadmin' },
    update: {},
    create: { name: 'superadmin', description: 'Controle total do sistema' },
  });

  /* ========= 3) Vincular permissões aos papéis ========= */
  const allPerms = await prisma.permission.findMany({ select: { id: true, key: true } });

  // Admin: gerencia usuários (CRUD), pode ver papéis e permissões
  const adminPermKeys = new Set([
    'users.read', 'users.write', 'users.delete',
    'roles.read',
    'permissions.read',
  ]);

  // Limpa e vincula para ADMIN
  await prisma.rolePermission.deleteMany({ where: { roleId: admin.id } });
  for (const perm of allPerms) {
    if (adminPermKeys.has(perm.key)) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: admin.id, permissionId: perm.id } },
        update: {},
        create: { roleId: admin.id, permissionId: perm.id },
      });
    }
  }

  // SUPERADMIN: todas as permissões
  await prisma.rolePermission.deleteMany({ where: { roleId: superadmin.id } });
  for (const perm of allPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superadmin.id, permissionId: perm.id } },
      update: {},
      create: { roleId: superadmin.id, permissionId: perm.id },
    });
  }

  // COMUM: nenhuma permissão explícita por padrão (aplique permissões de leitura mínimas se quiser)
  await prisma.rolePermission.deleteMany({ where: { roleId: comum.id } });

  /* ========= 4) Superadmin inicial ========= */
  const email = process.env.ADMIN_EMAIL ?? 'admin@evastur.com';
  const plain = process.env.ADMIN_PASSWORD ?? 'admin123';
  if (!process.env.ADMIN_PASSWORD) {
    console.warn('⚠️  ADMIN_PASSWORD não definido no .env — usando senha padrão "admin123" (apenas DEV).');
  }
  const passwordHash = await bcrypt.hash(plain, 10);

  const superUser = await prisma.user.upsert({
    where: { email },
    update: { name: 'Superadmin', isActive: true, passwordHash },
    create: { name: 'Superadmin', email, isActive: true, passwordHash },
  });

  // Garante VÍNCULO do user → superadmin
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superUser.id, roleId: superadmin.id } },
    update: {},
    create: { userId: superUser.id, roleId: superadmin.id },
  });

  console.log('✅ Seed concluído: roles & permissions + superadmin prontos.');
}

main()
  .catch((e) => {
    console.error('❌ Seed falhou:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
