'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PackageModal from '@/components/PackageModal';
import AddPackageButton from '@/components/packages/AddPackageButton'; // ✅ botão com checagem de permissão
import type { PackageDTO } from '@/types/package';
import { usePackages } from '@/hooks/usePackages';
import { useCanManagePackages } from '@/hooks/useCanManagePackages';
import { useEditMode } from '@/hooks/useEditMode';

export default function PacotesPage() {
  const { packages: pacotes, loading, error, removeLocal } = usePackages();
  const canManage = useCanManagePackages();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<PackageDTO | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { isEditing } = useEditMode();
  const [heroBackground, setHeroBackground] = useState('/pacotes-hero.jpg');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const { scrollYProgress } = useScroll();
  // Parallax suave na hero (imagem “sobe” levemente ao rolar)
  const yHero = useTransform(scrollYProgress, [0, 0.3], [0, -40]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const abrir = (pkg: PackageDTO) => {
    setCurrent(pkg);
    setOpen(true);
  };

  const excluir = async (pkg: PackageDTO) => {
    if (!canManage) return;
    if (!confirm(`Deseja realmente excluir o pacote "${pkg.nome}"?`)) return;
    setDeletingId(pkg.id);
    try {
      const res = await fetch(`/api/admin/packages/${pkg.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Falha ao excluir pacote');
      }
      removeLocal(pkg.id);
      if (current?.id === pkg.id) {
        setOpen(false);
        setCurrent(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir pacote';
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleBackgroundChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setHeroBackground(url);
    event.target.value = '';
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO com bg + overlay + parallax */}
      <section className="relative h-[56vh] min-h-[420px] w-full overflow-hidden">
        <motion.div
          style={{ y: yHero, backgroundImage: `url('${heroBackground}')` }}
          className="absolute inset-0 bg-center bg-cover"
        />
        {/* overlays para contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-white/0" />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

        <div className="relative z-10 flex h-full items-center">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl md:text-5xl font-extrabold text-white drop-shadow"
                >
                  [Título Pacotes (DB)]
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="mt-3 max-w-2xl text-white/90"
                >
                  [Descrição curta (DB)]
                </motion.p>
              </div>

              {/* ✅ Botão visível só para admin/superadmin (AddPackageButton faz a checagem) */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="flex flex-col items-start gap-2 self-start sm:self-end"
              >
                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full border border-white/70 bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-white/60"
                    >
                      Mudar Foto de Fundo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBackgroundChange}
                    />
                  </>
                )}
                <AddPackageButton />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Grade de pacotes */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        {loading && <p className="text-center text-gray-500">Carregando pacotes…</p>}

        {!loading && error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && pacotes.length === 0 && (
          <p className="text-center text-gray-500">Nenhum pacote cadastrado até o momento.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pacotes.map((p, i) => {
            const capa = p.imagens?.[0];
            return (
              <motion.article
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => abrir(p)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    abrir(p);
                  }
                }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <div className="relative h-40 w-full overflow-hidden bg-gray-200">
                  {capa ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={capa} alt={p.nome} className="h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      Imagem indisponível
                    </div>
                  )}
                  <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />

                  {canManage && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        excluir(p);
                      }}
                      className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-black/80"
                      disabled={deletingId === p.id}
                    >
                      {deletingId === p.id ? 'Removendo…' : 'Excluir'}
                    </button>
                  )}
                </div>

                <div className="flex h-full flex-col gap-3 p-5">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{p.nome}</h3>
                    <p className="text-sm text-gray-500">{p.local || 'Destino a definir'}</p>
                  </div>

                  <p className="text-sm text-gray-600">
                    {p.resumo || p.descricao || 'Descrição em breve.'}
                  </p>

                  <div className="mt-auto flex items-center justify-between text-sm">
                    <span className="text-xl font-extrabold text-gray-900">{p.preco || 'Preço a consultar'}</span>
                    <div className="text-right text-xs text-gray-500">
                      <p>{p.dias ? `${p.dias} dia(s)` : 'Dias a definir'}</p>
                      <p>
                        {p.dataIda ? new Date(p.dataIda).toLocaleDateString() : 'Ida a definir'}
                        {' '}•{' '}
                        {p.dataVolta ? new Date(p.dataVolta).toLocaleDateString() : 'Volta a definir'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Modal (popup) com carrossel e animações */}
      <PackageModal open={open} onClose={() => setOpen(false)} data={current} />
    </main>
  );
}
