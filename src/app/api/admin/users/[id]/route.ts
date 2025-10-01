import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type ParamsCtx = { params: Promise<{ id: string }> };

async function parseId(context: ParamsCtx) {
  const { id } = await context.params;
  return Number(id);
}

async function getSessionUser() {
  const cookieStore = await cookies();
  const sid = cookieStore.get('session_id')?.value;
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
export async function GET(_req: NextRequest, context: ParamsCtx) {
  try {
    const id = await parseId(context);
    const user = await prisma.user.findUnique({
      where: { id },
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
type UpdatePayload = {
  name?: string;
  email?: string;
  phone?: string | null;
  isActive?: boolean;
  roleIds?: unknown;
  password?: string;
};

export async function PUT(req: NextRequest, context: ParamsCtx) {
  try {
    const actor = await getSessionUser();
    if (!actor) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    if (!actor.roles.includes('admin') && !actor.roles.includes('superadmin')) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }
    const id = await parseId(context);
    const body = (await req.json()) as UpdatePayload | null;
    const { name, email, phone, isActive, roleIds, password } = body ?? {};
    const data: Prisma.UserUpdateInput = {};
    if (typeof name === 'string') data.name = name;
    if (typeof email === 'string') data.email = email;
    if (typeof phone === 'string') {
      data.phone = phone || null;
    } else if (phone === null) {
      data.phone = null;
    }
    if (typeof isActive === 'boolean') data.isActive = isActive;

    // troca de senha só por superadmin
    if (typeof password === 'string' && password && actor.roles.includes('superadmin')) {
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    const sanitizedRoleIds = Array.isArray(roleIds)
      ? roleIds
          .map((value) => {
            if (typeof value === 'number') return value;
            if (typeof value === 'string') return Number.parseInt(value, 10);
            return Number.NaN;
          })
          .filter((value) => Number.isInteger(value))
      : undefined;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        roles:
          sanitizedRoleIds !== undefined
            ? {
                deleteMany: {},
                create: sanitizedRoleIds.map((roleId) => ({ role: { connect: { id: roleId } } })),
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
export async function DELETE(_req: NextRequest, context: ParamsCtx) {
  try {
    const actor = await getSessionUser();
    if (!actor) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    if (!actor.roles.includes('admin') && !actor.roles.includes('superadmin')) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }
    const id = await parseId(context);
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: 'Usuário deletado com sucesso' }, { status: 200 });
  } catch (e) {
    console.error('DELETE /users/[id]', e);
    return NextResponse.json({ error: 'Erro ao deletar usuário' }, { status: 500 });
  }
}
