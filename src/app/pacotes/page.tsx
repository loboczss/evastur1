'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PackageModal from '@/components/PackageModal';
import AddPackageButton from '@/components/packages/AddPackageButton'; // ✅ botão com checagem de permissão
import type { PackageDTO } from '@/types/package';

export default function PacotesPage() {
  // ⚠️ Placeholders – troque por dados do DB (fetch/SSR)
  const pacotes: PackageDTO[] = [
    { id: 'p1', nome: '[Nome 1]', resumo: '[Resumo 1]', preco: '[Preço 1]', imagens: [] },
    { id: 'p2', nome: '[Nome 2]', resumo: '[Resumo 2]', preco: '[Preço 2]', imagens: [] },
    { id: 'p3', nome: '[Nome 3]', resumo: '[Resumo 3]', preco: '[Preço 3]', imagens: [] },
    { id: 'p4', nome: '[Nome 4]', resumo: '[Resumo 4]', preco: '[Preço 4]', imagens: [] },
    { id: 'p5', nome: '[Nome 5]', resumo: '[Resumo 5]', preco: '[Preço 5]', imagens: [] },
    { id: 'p6', nome: '[Nome 6]', resumo: '[Resumo 6]', preco: '[Preço 6]', imagens: [] },
  ];

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<PackageDTO | null>(null);

  const { scrollYProgress } = useScroll();
  // Parallax suave na hero (imagem “sobe” levemente ao rolar)
  const yHero = useTransform(scrollYProgress, [0, 0.3], [0, -40]);

  const abrir = (pkg: PackageDTO) => {
    setCurrent(pkg);
    setOpen(true);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO com bg + overlay + parallax */}
      <section className="relative h-[56vh] min-h-[420px] w-full overflow-hidden">
        <motion.div
          style={{ y: yHero, backgroundImage: `url('/pacotes-hero.jpg')` }}
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
                className="self-start sm:self-end"
              >
                <AddPackageButton />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Grade de pacotes */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pacotes.map((p, i) => (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => abrir(p)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              className="group text-left rounded-2xl overflow-hidden bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              {/* imagem do pacote */}
              <div className="relative h-40 w-full overflow-hidden bg-gray-200">
                {/* Quando tiver DB: <img src={p.imagens?.[0]} ... /> */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  [Imagem do pacote]
                </div>
                {/* brilho no hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* conteúdo */}
              <div className="p-5">
                <h3 className="text-lg font-semibold">{p.nome || '[Nome DB]'}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {p.resumo || '[Resumo DB]'}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-extrabold text-gray-900">
                    {p.preco || '[Preço]'}
                  </span>
                  <span className="rounded-full px-3 py-1 text-white text-sm font-semibold
                    bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
                    bg-[length:200%_200%] animate-gradient-x shadow">
                    Ver detalhes
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Modal (popup) com carrossel e animações */}
      <PackageModal open={open} onClose={() => setOpen(false)} data={current} />
    </main>
  );
}
