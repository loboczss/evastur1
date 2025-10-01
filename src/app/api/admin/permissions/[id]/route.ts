import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type RouteContext = { params: Promise<{ id: string }> };

async function extractId(context: RouteContext) {
  const { id: rawId } = await context.params;
  return Number(rawId);
}

/**
 * GET /api/admin/permissions/[id]
 */
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const id = await extractId(context);
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
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const id = await extractId(context);
    const body = (await request.json()) as Partial<{ key: string; description?: string | null }> | null;
    const { key, description } = body ?? {};
    const sanitizedKey = typeof key === 'string' ? key.trim() : undefined;
    const sanitizedDescription =
      typeof description === 'string' ? description : description === null ? null : undefined;

    const updated = await prisma.permission.update({
      where: { id },
      data: {
        key: sanitizedKey && sanitizedKey.length > 0 ? sanitizedKey : undefined,
        description: sanitizedDescription,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
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
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const id = await extractId(context);

    // Limpa vínculos com papéis antes (SQLite-friendly)
    await prisma.rolePermission.deleteMany({ where: { permissionId: id } });

    await prisma.permission.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Erro no DELETE /permissions/[id]:', error);
    return NextResponse.json({ error: 'Erro ao deletar permissão' }, { status: 500 });
  }
}
