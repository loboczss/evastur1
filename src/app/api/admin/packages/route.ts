import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, hasAdminRights } from '@/lib/auth';
import { randomUUID } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const actor = await getSessionUser();
    if (!actor) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    if (!hasAdminRights(actor.roles)) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });

    const form = await req.formData();

    const title = String(form.get('title') ?? '').trim();
    const price = form.get('price') ? String(form.get('price')) : null;
    const startDate = form.get('startDate') ? new Date(String(form.get('startDate'))) : null;
    const endDate = form.get('endDate') ? new Date(String(form.get('endDate'))) : null;
    const days = form.get('days') ? Number(form.get('days')) : null;
    const location = form.get('location') ? String(form.get('location')) : null;
    const description = form.get('description') ? String(form.get('description')) : null;

    if (!title) return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 });

    const slug = title
      .toLowerCase()
      .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
      .replace(/(^-|-$)/g, '') + '-' + randomUUID().slice(0, 8);

    // Salvar imagens (até 5)
    const files: File[] = [];
    for (let i = 0; i < 5; i++) {
      const f = form.get(`images[${i}]`);
      if (f && f instanceof File) files.push(f);
    }

    const publicDir = path.join(process.cwd(), 'public', 'uploads', 'packages');
    await mkdir(publicDir, { recursive: true });

    const savedUrls: string[] = [];
    for (const f of files) {
      const ext = (f.name.split('.').pop() || 'jpg').toLowerCase();
      const fname = `${slug}-${randomUUID()}.${ext}`;
      const buf = Buffer.from(await f.arrayBuffer());
      await writeFile(path.join(publicDir, fname), buf);
      savedUrls.push(`/uploads/packages/${fname}`);
    }

    const created = await prisma.package.create({
      data: {
        title,
        slug,
        description: description || null,
        price: price ? new prisma.Prisma.Decimal(price) : null,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        days: days || undefined,
        location: location || null,
        images: {
          create: savedUrls.map((url, idx) => ({ url, order: idx })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('POST /api/admin/packages', e);
    return NextResponse.json({ error: 'Erro ao criar pacote' }, { status: 500 });
  }
}
