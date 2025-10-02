import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureBootstrap } from '@/lib/bootstrap';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export async function GET() {
  try {
    await ensureBootstrap();

    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: { images: { orderBy: { order: 'asc' } } },
    });

    const data = packages.map((pkg) => ({
      id: String(pkg.id),
      nome: pkg.title,
      resumo: pkg.location ?? pkg.description ?? undefined,
      descricao: pkg.description ?? undefined,
      preco: pkg.price ? currencyFormatter.format(pkg.price.toNumber()) : undefined,
      dias: pkg.days ?? undefined,
      dataIda: pkg.startDate ? pkg.startDate.toISOString() : undefined,
      dataVolta: pkg.endDate ? pkg.endDate.toISOString() : undefined,
      local: pkg.location ?? undefined,
      imagens: pkg.images.map((img) => img.url),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/packages', error);
    return NextResponse.json({ error: 'Não foi possível carregar os pacotes' }, { status: 500 });
  }
}
