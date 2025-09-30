import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/admin/permissions
 * Lista todas as permissões
 */
export async function GET() {
  try {
    const data = await prisma.permission.findMany({
      orderBy: { key: 'asc' },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('❌ Erro no GET /permissions:', error);
    return NextResponse.json({ error: 'Erro ao buscar permissões' }, { status: 500 });
  }
}

/**
 * POST /api/admin/permissions
 * Cria uma permissão
 * Body: { key: string; description?: string }
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{ key: string; description?: string | null }> | null;
    const { key, description } = body ?? {};
    if (typeof key !== 'string' || !key.trim()) {
      return NextResponse.json({ error: 'key é obrigatório' }, { status: 400 });
    }

    const created = await prisma.permission.create({
      data: {
        key: key.trim(),
        description: typeof description === 'string' || description === null ? description : undefined,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'key já existe' }, { status: 409 });
    }
    console.error('❌ Erro no POST /permissions:', error);
    return NextResponse.json({ error: 'Erro ao criar permissão' }, { status: 500 });
  }
}
