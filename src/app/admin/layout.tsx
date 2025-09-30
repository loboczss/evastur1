// src/app/admin/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies(); // 🔧
  const sid = cookieStore.get('session_id')?.value;
  if (!sid) redirect('/login');

  const session = await prisma.authSession.findUnique({
    where: { id: sid },
    include: { user: { include: { roles: { include: { role: true } } } } },
  });

  if (!session || session.expiresAt < new Date()) redirect('/login');

  // (opcional) checar se tem acesso à /admin
  const roleNames = session.user.roles.map((r) => r.role.name);
  if (!roleNames.includes('admin') && !roleNames.includes('superadmin')) {
    redirect('/'); // ou 403
  }

  return <>{children}</>;
}
