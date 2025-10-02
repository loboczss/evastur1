import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { prisma } from './prisma';

const permissionsSeed: Array<{ key: string; description?: string }> = [
  { key: 'users.read', description: 'Listar usuários' },
  { key: 'users.write', description: 'Criar/editar usuários e papéis do usuário' },
  { key: 'users.delete', description: 'Excluir usuários' },
  { key: 'roles.read', description: 'Listar papéis' },
  { key: 'roles.write', description: 'Criar/editar papéis' },
  { key: 'roles.delete', description: 'Excluir papéis' },
  { key: 'permissions.read', description: 'Listar permissões' },
  { key: 'permissions.write', description: 'Criar/editar permissões' },
  { key: 'permissions.delete', description: 'Excluir permissões' },
];

const globalBootstrap = globalThis as unknown as {
  __evasturBootstrapPromise?: Promise<void>;
};

async function bootstrapOnce() {
  for (const permission of permissionsSeed) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: { description: permission.description },
      create: permission,
    });
  }

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

  const allPerms = await prisma.permission.findMany({ select: { id: true, key: true } });

  const adminPermKeys = new Set([
    'users.read',
    'users.write',
    'users.delete',
    'roles.read',
    'permissions.read',
  ]);

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

  await prisma.rolePermission.deleteMany({ where: { roleId: superadmin.id } });
  for (const perm of allPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superadmin.id, permissionId: perm.id } },
      update: {},
      create: { roleId: superadmin.id, permissionId: perm.id },
    });
  }

  await prisma.rolePermission.deleteMany({ where: { roleId: comum.id } });

  const pkgCount = await prisma.package.count();
  if (pkgCount === 0) {
    const demoPackages = [
      {
        title: 'Foz do Iguaçu Essencial',
        slug: `foz-do-iguacu-${randomUUID().slice(0, 8)}`,
        description: 'Conheça as Cataratas do Iguaçu com hospedagem confortável e passeios guiados.',
        price: new Prisma.Decimal('1899.90'),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        days: 4,
        location: 'Foz do Iguaçu - PR',
        images: [
          'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Gramado & Canela Romântico',
        slug: `gramado-canela-${randomUUID().slice(0, 8)}`,
        description: 'Pacote romântico com hospedagem em hotel boutique, passeio na Rua Coberta e tour de vinhos.',
        price: new Prisma.Decimal('2590.00'),
        startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        days: 6,
        location: 'Gramado - RS',
        images: [
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Nordeste Paradise All Inclusive',
        slug: `nordeste-paradise-${randomUUID().slice(0, 8)}`,
        description: '7 noites em resort pé na areia com tudo incluso, traslado e passeios exclusivos.',
        price: new Prisma.Decimal('4999.99'),
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString(),
        days: 7,
        location: 'Maceió - AL',
        images: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
        ],
      },
    ];

    for (const pkg of demoPackages) {
      await prisma.package.create({
        data: {
          title: pkg.title,
          slug: pkg.slug,
          description: pkg.description,
          price: pkg.price,
          startDate: pkg.startDate ? new Date(pkg.startDate) : undefined,
          endDate: pkg.endDate ? new Date(pkg.endDate) : undefined,
          days: pkg.days,
          location: pkg.location,
          images: {
            create: pkg.images.map((url, idx) => ({ url, order: idx })),
          },
        },
      });
    }
  }
}

export function ensureBootstrap() {
  if (!globalBootstrap.__evasturBootstrapPromise) {
    globalBootstrap.__evasturBootstrapPromise = bootstrapOnce().catch((err) => {
      console.error('Erro ao inicializar dados básicos', err);
      globalBootstrap.__evasturBootstrapPromise = undefined;
      throw err;
    });
  }

  return globalBootstrap.__evasturBootstrapPromise;
}
