// src/app/api/leads/[id]/route.ts
import type { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Ctx = { params: { id: string } };

type LeadUpdatePayload = Partial<{
  name: string;
  email: string;
  phone: string | null;
  destination: string | null;
  notes: string | null;
}>;

const toNullableString = (value: unknown) => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (value === null) return null;
  return undefined;
};

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
  const payload = (await req.json()) as LeadUpdatePayload | null;
  const data: Prisma.LeadUpdateInput = {};
  if (payload) {
    if (typeof payload.name === 'string') data.name = payload.name;
    if (typeof payload.email === 'string') data.email = payload.email;
    const phone = toNullableString(payload.phone);
    if (phone !== undefined) data.phone = phone;
    const destination = toNullableString(payload.destination);
    if (destination !== undefined) data.destination = destination;
    const notes = toNullableString(payload.notes);
    if (notes !== undefined) data.notes = notes;
  }
  try {
    const lead = await prisma.lead.update({ where: { id }, data });
    return NextResponse.json(lead);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro';
    return NextResponse.json({ error: message }, { status: 400 });
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
