import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

type Ctx = { params: { id: string } };

async function getSessionUser() {
  const sid = cookies().get('session_id')?.value;
  if (!sid) return null;
  const session = await prisma.authSession.findUnique({
    where: { id: sid },
    include: { user: { include: { roles: { include: { role: true } } } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  const roleNames = session.user.roles.map(r => r.role.name);
  return { id: session.user.id, roles: roleNames };
}

/** GET /api/admin/users/[id] */
export async function GET(_req: Request, { params }: Ctx) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(params.id) },
      include: { roles: { include: { role: true } } },
    });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    return NextResponse.json(user, { status: 200 });
  } catch (e) {
    console.error('GET /users/[id]', e);
    return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 });
  }
}

/** PUT /api/admin/users/[id]  Body: { name?, email?, phone?, isActive?, roleIds?: number[], password?: string } */
export async function PUT(req: Request, { params }: Ctx) {
  try {
    const actor = await getSessionUser();
    if (!actor) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    if (!actor.roles.includes('admin') && !actor.roles.includes('superadmin')) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, phone, isActive, roleIds, password } = body ?? {};
    const data: any = { name, email, phone, isActive };

    // troca de senha só por superadmin
    if (password && actor.roles.includes('superadmin')) {
      data.passwordHash = await bcrypt.hash(String(password), 10);
    }

    const updated = await prisma.user.update({
      where: { id: Number(params.id) },
      data: {
        ...data,
        roles: Array.isArray(roleIds)
          ? {
              deleteMany: {},
              create: roleIds.map((roleId: number) => ({ role: { connect: { id: roleId } } })),
            }
          : undefined,
      },
      include: { roles: { include: { role: true } } },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    console.error('PUT /users/[id]', e);
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
  }
}

/** DELETE /api/admin/users/[id] */
export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const actor = await getSessionUser();
    if (!actor) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    if (!actor.roles.includes('admin') && !actor.roles.includes('superadmin')) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    await prisma.user.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: 'Usuário deletado com sucesso' }, { status: 200 });
  } catch (e) {
    console.error('DELETE /users/[id]', e);
    return NextResponse.json({ error: 'Erro ao deletar usuário' }, { status: 500 });
  }
}
