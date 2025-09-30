import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/admin/roles
 * Lista todos os papéis com permissões associadas
 */
export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
    });
    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error('❌ Erro no GET /roles:', error);
    return NextResponse.json({ error: 'Erro ao buscar papéis' }, { status: 500 });
  }
}

/**
 * POST /api/admin/roles
 * Cria um novo papel
 * Body esperado: { name, description?, permissionIds?: number[] }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, permissionIds } = body;

    if (!name) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const newRole = await prisma.role.create({
      data: {
        name,
        description,
        permissions: permissionIds
          ? {
              create: permissionIds.map((permissionId: number) => ({
                permission: { connect: { id: permissionId } },
              })),
            }
          : undefined,
      },
      include: { permissions: { include: { permission: true } } },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error('❌ Erro no POST /roles:', error);
    return NextResponse.json({ error: 'Erro ao criar papel' }, { status: 500 });
  }
}
