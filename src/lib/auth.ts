// src/lib/auth.ts
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function getSessionUser() {
  const cookieStore = await cookies(); // 🔧 agora é async
  const sid = cookieStore.get('session_id')?.value;
  if (!sid) return null;

  const session = await prisma.authSession.findUnique({
    where: { id: sid },
    include: { user: { include: { roles: { include: { role: true } } } } },
  });

  if (!session || session.expiresAt < new Date()) return null;

  const roleNames = session.user.roles.map((r) => r.role.name);
  return { id: session.user.id, roles: roleNames };
}

export function hasAdminRights(roles: string[] | undefined) {
  const r = roles ?? [];
  return r.includes('admin') || r.includes('superadmin');
}
