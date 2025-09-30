'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PackageModal from './PackageModal';
import type { PackageDTO } from '@/types/package';
import { usePackages } from '@/hooks/usePackages';

export default function FeaturedPackages() {
  const { packages, loading, error } = usePackages();
  const items: PackageDTO[] = packages.slice(0, 6);

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<PackageDTO | null>(null);

  const openModal = (pkg: PackageDTO) => {
    setCurrent(pkg);
    setOpen(true);
  };

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            [Título dos principais pacotes (DB)]
          </h2>
          <p className="mt-2 text-gray-600">[Descrição curta (DB)]</p>
        </div>

        {loading && (
          <p className="text-center text-gray-500">Carregando pacotes em destaque…</p>
        )}

        {!loading && error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="text-center text-gray-500">Nenhum pacote cadastrado até o momento.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((it, idx) => (
            <motion.button
              key={it.id}
              type="button"
              onClick={() => openModal(it)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: idx * 0.05 }}
              className="text-left rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <div className="h-40 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                {it.imagens?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.imagens[0]} alt={it.nome} className="h-full w-full object-cover" />
                ) : (
                  'Imagem indisponível'
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{it.nome || '[Nome DB]'}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {it.resumo || it.descricao || 'Descrição em breve.'}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-extrabold text-gray-900">{it.preco || 'Preço a consultar'}</span>
                  <span className="rounded-full px-3 py-1 text-white text-sm font-semibold
                                   bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-[length:200%_200%] animate-gradient-x">
                    Ver detalhes
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Modal */}
      <PackageModal open={open} onClose={() => setOpen(false)} data={current} />
    </>
  );
}
