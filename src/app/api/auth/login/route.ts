import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const SESSION_COOKIE = 'session_id';
const SESSION_DAYS = 7;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'email e password são obrigatórios' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }
    if (!user.isActive) {
      return NextResponse.json({ error: 'Usuário inativo' }, { status: 403 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

    // opcional: limpar sessões antigas do usuário
    await prisma.authSession.deleteMany({ where: { userId: user.id, expiresAt: { lt: new Date() } } });

    const session = await prisma.authSession.create({
      data: { userId: user.id, expiresAt },
    });

    const res = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles.map(r => r.role.name),
    });

    res.cookies.set(SESSION_COOKIE, session.id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: expiresAt,
    });

    return res;
  } catch (e) {
    console.error('login error:', e);
    return NextResponse.json({ error: 'Erro no login' }, { status: 500 });
  }
}
