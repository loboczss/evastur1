// app/api/leads/route.ts
import type { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type LeadCreatePayload = {
  name?: string;
  email?: string;
  phone?: string | null;
  destination?: string | null;
  notes?: string | null;
};

const toNullableString = (value: unknown) => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (value === null) return null;
  return undefined;
};

export async function GET() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(leads);
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as LeadCreatePayload | null;
    if (typeof payload?.name !== 'string' || !payload.name.trim()) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }
    if (typeof payload.email !== 'string' || !payload.email.trim()) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
    }

    const leadData: Prisma.LeadCreateInput = {
      name: payload.name.trim(),
      email: payload.email.trim(),
    };

    const phone = toNullableString(payload.phone);
    if (phone !== undefined) leadData.phone = phone;
    const destination = toNullableString(payload.destination);
    if (destination !== undefined) leadData.destination = destination;
    const notes = toNullableString(payload.notes);
    if (notes !== undefined) leadData.notes = notes;

    const lead = await prisma.lead.create({ data: leadData });
    return NextResponse.json(lead, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
