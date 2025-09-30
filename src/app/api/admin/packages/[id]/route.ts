import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, hasAdminRights } from '@/lib/auth';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const actor = await getSessionUser();
    if (!actor) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    if (!hasAdminRights(actor.roles)) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });

    const packageId = Number(params.id);
    if (!Number.isInteger(packageId)) {
      return NextResponse.json({ error: 'Identificador inválido' }, { status: 400 });
    }

    const existing = await prisma.package.findUnique({
      where: { id: packageId },
      include: { images: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Pacote não encontrado' }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.packageImage.deleteMany({ where: { packageId } }),
      prisma.package.delete({ where: { id: packageId } }),
    ]);

    await Promise.all(
      existing.images.map(async (image) => {
        const relativePath = image.url.startsWith('/') ? image.url.slice(1) : image.url;
        const fullPath = path.join(process.cwd(), 'public', relativePath);
        try {
          await unlink(fullPath);
        } catch (err) {
          console.warn('Não foi possível remover imagem do pacote', fullPath, err);
        }
      })
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/admin/packages/[id]', error);
    return NextResponse.json({ error: 'Erro ao excluir pacote' }, { status: 500 });
  }
}
