import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/admin/roles/[id]
 * Retorna um papel específico com permissões
 */
type ParamsCtx = { params: Promise<{ id: string }> };

async function parseId(context: ParamsCtx) {
  const { id } = await context.params;
  return Number(id);
}

export async function GET(
  _request: NextRequest,
  context: ParamsCtx
) {
  try {
    const id = await parseId(context);
    const role = await prisma.role.findUnique({
      where: { id },
      include: { permissions: { include: { permission: true } } },
    });

    if (!role) {
      return NextResponse.json({ error: 'Papel não encontrado' }, { status: 404 });
    }

    return NextResponse.json(role, { status: 200 });
  } catch (error) {
    console.error('❌ Erro no GET /roles/[id]:', error);
    return NextResponse.json({ error: 'Erro ao buscar papel' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/roles/[id]
 * Atualiza um papel
 * Body esperado: { name?, description?, permissionIds?: number[] }
 */
export async function PUT(
  request: NextRequest,
  context: ParamsCtx
) {
  try {
    const id = await parseId(context);
    const body = await request.json();
    const { name, description, permissionIds } = body;

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        permissions: permissionIds
          ? {
              deleteMany: {}, // remove vínculos antigos
              create: permissionIds.map((permissionId: number) => ({
                permission: { connect: { id: permissionId } },
              })),
            }
          : undefined,
      },
      include: { permissions: { include: { permission: true } } },
    });

    return NextResponse.json(updatedRole, { status: 200 });
  } catch (error) {
    console.error('❌ Erro no PUT /roles/[id]:', error);
    return NextResponse.json({ error: 'Erro ao atualizar papel' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/roles/[id]
 * Remove um papel
 */
export async function DELETE(
  _request: NextRequest,
  context: ParamsCtx
) {
  try {
    const id = await parseId(context);
    await prisma.role.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Papel deletado com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('❌ Erro no DELETE /roles/[id]:', error);
    return NextResponse.json({ error: 'Erro ao deletar papel' }, { status: 500 });
  }
}
