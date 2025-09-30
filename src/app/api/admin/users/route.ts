import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/admin/users
 * Lista todos os usuários com seus papéis
 */
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('❌ Erro no GET /users:', error);
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}

/**
 * POST /api/admin/users
 * Cria um novo usuário
 * Body esperado: { name, email, phone?, roleIds?: number[] }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, roleIds } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios' }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        roles: roleIds
          ? {
              create: roleIds.map((roleId: number) => ({
                role: { connect: { id: roleId } },
              })),
            }
          : undefined,
      },
      include: {
        roles: { include: { role: true } },
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('❌ Erro no POST /users:', error);
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
  }
}
