import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * POST /api/auth/register
 * Body: { name: string; email: string; password: string; phone?: string }
 * Efeito: cria usuário com role 'comum'
 */
export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'name, email e password são obrigatórios' },
        { status: 400 }
      );
    }

    // Verifica se já existe
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      );
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Busca papel "comum"
    const commonRole = await prisma.role.findUnique({ where: { name: 'comum' } });
    if (!commonRole) {
      return NextResponse.json(
        { error: 'Papel "comum" não encontrado. Rode o seed novamente.' },
        { status: 500 }
      );
    }

    // Cria usuário e vincula papel "comum"
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        roles: {
          create: [{ roleId: commonRole.id }],
        },
      },
      include: {
        roles: { include: { role: true } },
      },
    });

    // (Opcional) Você pode auto-logar o usuário aqui criando sessão + cookie.
    // Vamos fazer isso na rota /api/auth/login no próximo passo para manter claro.

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles.map((r) => r.role.name),
      },
      { status: 201 }
    );
  } catch (err: any) {
    // Prisma unique
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 });
    }
    console.error('❌ register error:', err);
    return NextResponse.json({ error: 'Erro interno no cadastro' }, { status: 500 });
  }
}
