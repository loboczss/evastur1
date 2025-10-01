import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const SESSION_COOKIE = 'session_id';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SessionUser = { id: number; roles: string[] } | null;

async function getSessionUser(): Promise<SessionUser> {
  try {
    const cookieStore = await cookies();
    const sid = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sid) return null;

    const session = await prisma.authSession.findUnique({
      where: { id: sid },
      include: { user: { include: { roles: { include: { role: true } } } } },
    });

    if (!session || session.expiresAt < new Date()) return null;

    const roles = session.user.roles.map((r) => r.role.name);
    return { id: session.user.id, roles };
  } catch (error) {
    console.error('Erro ao recuperar sessão', error);
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const key = searchParams.get('key');

  if (!path) {
    return NextResponse.json({ error: 'Parâmetro "path" é obrigatório' }, { status: 400 });
  }

  try {
    if (key) {
      const entry = await prisma.editableContent.findUnique({
        where: { path_key: { path, key } },
      });
      return NextResponse.json({ content: entry?.content ?? null }, { status: 200 });
    }

    const entries = await prisma.editableContent.findMany({
      where: { path },
      select: { key: true, content: true },
    });

    return NextResponse.json({ contents: entries }, { status: 200 });
  } catch (error) {
    console.error('Erro no GET /api/content', error);
    return NextResponse.json({ error: 'Erro ao carregar conteúdos editáveis' }, { status: 500 });
  }
}

type UpdatePayload = {
  path: string;
  key: string;
  content: string;
};

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  if (!user.roles.includes('superadmin')) {
    return NextResponse.json({ error: 'Sem permissão para salvar edições' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const updatesRaw = (body as { updates?: unknown })?.updates;
  if (!Array.isArray(updatesRaw) || updatesRaw.length === 0) {
    return NextResponse.json({ error: 'Nenhuma atualização enviada' }, { status: 400 });
  }

  const updates: UpdatePayload[] = [];
  for (const item of updatesRaw) {
    if (!item || typeof item !== 'object') continue;
    const path = (item as { path?: unknown }).path;
    const key = (item as { key?: unknown }).key;
    const content = (item as { content?: unknown }).content;

    if (typeof path !== 'string' || typeof key !== 'string') continue;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const normalizedContent =
      typeof content === 'string' ? content : content !== undefined && content !== null ? String(content) : '';

    updates.push({ path: normalizedPath, key, content: normalizedContent });
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'Nenhum conteúdo válido para atualizar' }, { status: 400 });
  }

  try {
    const persisted = await Promise.all(
      updates.map((update) =>
        prisma.editableContent.upsert({
          where: { path_key: { path: update.path, key: update.key } },
          create: { path: update.path, key: update.key, content: update.content },
          update: { content: update.content },
        })
      )
    );

    return NextResponse.json(
      {
        updated: persisted.map((item) => ({
          path: item.path,
          key: item.key,
          content: item.content,
          updatedAt: item.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro no PUT /api/content', error);
    return NextResponse.json({ error: 'Erro ao salvar conteúdos' }, { status: 500 });
  }
}
