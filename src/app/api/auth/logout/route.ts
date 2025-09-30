// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const SESSION_COOKIE = 'session_id';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const cookieStore = await cookies(); // 🔧
  const sid = cookieStore.get(SESSION_COOKIE)?.value;
  if (sid) {
    await prisma.authSession.deleteMany({ where: { id: sid } }).catch(() => {});
  }
  // limpa cookie no cliente
  cookieStore.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return NextResponse.json({ ok: true });
}
