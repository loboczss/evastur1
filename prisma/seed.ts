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

  console.log('✅ Roles e permissões atualizados e superadmin pronto.');

  /* ========= 5) Pacotes de exemplo ========= */
  type PackageSeed = {
    title: string;
    slug: string;
    description: string;
    price: string;
    startDate: Date;
    endDate: Date;
    days: number;
    location: string;
    images: string[];
  };

  const packagesSeed: PackageSeed[] = [
    {
      title: 'Paris Romântica',
      slug: 'paris-romantica',
      description:
        'Sete noites em Paris com city tour completo, passeio pelo Rio Sena e visita guiada ao Louvre. Hospedagem em hotel 4 estrelas com café da manhã incluso.',
      price: '7999.90',
      startDate: new Date('2024-11-05'),
      endDate: new Date('2024-11-12'),
      days: 7,
      location: 'Paris, França',
      images: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1920&q=80',
      ],
    },
    {
      title: 'Nordeste Essencial',
      slug: 'nordeste-essencial',
      description:
        'Descubra os paraísos de Maceió e Maragogi com passeios às piscinas naturais, buggy nas dunas e experiência gastronômica regional. Inclui aéreo e traslados.',
      price: '3899.00',
      startDate: new Date('2024-10-18'),
      endDate: new Date('2024-10-25'),
      days: 7,
      location: 'Maceió & Maragogi, Brasil',
      images: [
        'https://images.unsplash.com/photo-1526402460759-99adb65ab148?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1496412705862-e0088f16f791?auto=format&fit=crop&w=1920&q=80',
      ],
    },
    {
      title: 'Aventura Andina',
      slug: 'aventura-andina',
      description:
        'Experiência pelos Andes com passagem por Cusco, Valle Sagrado e Machu Picchu. Guia em português e ingressos inclusos. Perfeito para viajantes exploradores.',
      price: '5299.50',
      startDate: new Date('2024-09-07'),
      endDate: new Date('2024-09-14'),
      days: 7,
      location: 'Cusco & Machu Picchu, Peru',
      images: [
        'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1533636721434-0e2d61030955?auto=format&fit=crop&w=1920&q=80',
      ],
    },
  ];

  for (const pkg of packagesSeed) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {
        title: pkg.title,
        description: pkg.description,
        price: pkg.price,
        startDate: pkg.startDate,
        endDate: pkg.endDate,
        days: pkg.days,
        location: pkg.location,
        isActive: true,
        images: {
          deleteMany: {},
          create: pkg.images.map((url, index) => ({ url, order: index })),
        },
      },
      create: {
        title: pkg.title,
        slug: pkg.slug,
        description: pkg.description,
        price: pkg.price,
        startDate: pkg.startDate,
        endDate: pkg.endDate,
        days: pkg.days,
        location: pkg.location,
        isActive: true,
        images: {
          create: pkg.images.map((url, index) => ({ url, order: index })),
        },
      },
    });
  }


  console.log('✅ Seed concluído: pacotes de exemplo disponíveis.');
}

main()
  .catch((e) => {
    console.error('❌ Seed falhou:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
