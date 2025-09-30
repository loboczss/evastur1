// app/api/leads/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(leads);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const lead = await prisma.lead.create({ data });
    return NextResponse.json(lead, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Erro' }, { status: 400 });
  }
}
