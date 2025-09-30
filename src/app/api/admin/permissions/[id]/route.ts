import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Ctx = { params: { id: string } };

/**
 * GET /api/admin/permissions/[id]
 */
export async function GET(_req: Request, { params }: Ctx) {
  try {
    const id = Number(params.id);
    const perm = await prisma.permission.findUnique({ where: { id } });
    if (!perm) return NextResponse.json({ error: 'Permissão não encontrada' }, { status: 404 });
    return NextResponse.json(perm, { status: 200 });
  } catch (error) {
    console.error('❌ Erro no GET /permissions/[id]:', error);
    return NextResponse.json({ error: 'Erro ao buscar permissão' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/permissions/[id]
 * Body: { key?: string; description?: string }
 */
export async function PUT(request: Request, { params }: Ctx) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const { key, description } = body ?? {};

    const updated = await prisma.permission.update({
      where: { id },
      data: { key, description },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'key já existe' }, { status: 409 });
    }
    console.error('❌ Erro no PUT /permissions/[id]:', error);
    return NextResponse.json({ error: 'Erro ao atualizar permissão' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/permissions/[id]
 * Remove vínculos (RolePermission) e depois a permissão
 */
export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const id = Number(params.id);

    // Limpa vínculos com papéis antes (SQLite-friendly)
    await prisma.rolePermission.deleteMany({ where: { permissionId: id } });

    await prisma.permission.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Erro no DELETE /permissions/[id]:', error);
    return NextResponse.json({ error: 'Erro ao deletar permissão' }, { status: 500 });
  }
}
