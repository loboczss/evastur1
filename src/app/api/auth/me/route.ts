// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const SESSION_COOKIE = 'session_id';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies(); // 🔧
    const sid = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sid) return NextResponse.json({ user: null });

    const session = await prisma.authSession.findUnique({
      where: { id: sid },
      include: {
        user: {
          include: {
            roles: { include: { role: true } },
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ user: null });
    }

    const user = session.user;
    const roles = user.roles.map((r) => r.role.name);
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, roles },
    });
  } catch (e) {
    return NextResponse.json({ user: null });
  }
}
