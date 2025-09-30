// src/app/api/leads/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'id inválido' }, { status: 400 });
  }
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PUT(req: Request, { params }: Ctx) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'id inválido' }, { status: 400 });
  }
  const data = await req.json();
  try {
    const lead = await prisma.lead.update({ where: { id }, data });
    return NextResponse.json(lead);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Erro' }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'id inválido' }, { status: 400 });
  }
  try {
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    // Se não existir, responde 404 em vez de 500
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
