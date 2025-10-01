'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Plane, Hotel, Ship, MapPin, Sparkles, TicketPercent, Clock } from 'lucide-react';
import { usePackages } from '@/hooks/usePackages';
import type { PackageDTO } from '@/types/package';

// Card de pesquisa central (dinâmico p/ evitar SSR do framer)
const HeroSearch = dynamic(() => import('@/components/HeroSearch'), { ssr: false });

/** Imagens do hero (curadoria “premium”) */
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80', // praia turquesa
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80', // cidade noite
  'https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?auto=format&fit=crop&w=1920&q=80', // montanha neblina
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1920&q=80', // cruzeiro/porto
];

export default function HomePage() {
  // Parallax + Ken Burns leve
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 0.4], [0, -50]);

  // Cross-fade de fundo
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setBgIndex((i) => (i + 1) % HERO_IMAGES.length), 6500);
    return () => clearInterval(id);
  }, []);

  // Benefícios (ícones)
  const BENEFITS = useMemo(
    () => [
      { icon: Plane,  title: 'Passagens aéreas',       text: 'Rotas e tarifas excelentes, sem labirinto.' },
      { icon: Hotel,  title: 'Hotéis & resorts',        text: 'Curadoria real, localização e avaliações de verdade.' },
      { icon: Ship,   title: 'Cruzeiros',               text: 'Entretenimento completo e roteiros inesquecíveis.' },
      { icon: MapPin, title: 'Passeios & experiências', text: 'Viva o destino além do cartão-postal.' },
      { icon: TicketPercent, title: 'Ofertas legítimas', text: 'Condições transparentes e sem pegadinhas.' },
      { icon: Sparkles, title: 'Sob medida',            text: 'Roteiros do seu jeito, do início ao fim.' },
    ],
    []
  );

  // “Alguns pacotes” (preview)
  const { packages: pacotes, loading, error } = usePackages();
  const preview: PackageDTO[] = useMemo(() => (pacotes || []).slice(0, 6), [pacotes]);

  return (
    <main className="min-h-screen bg-white text-gray-900 pt-safe-header">
      {/* ===========================
          HERO — agora com altura segura p/ mobile
         =========================== */}
      <section
  id="topo"
  className="
    relative isolate
    w-full overflow-hidden
    scroll-mt-[var(--header-h)]
    min-h-[calc(100svh-var(--header-h))] md:min-h-[720px]
    pt-6 sm:pt-8 md:pt-10
    pb-28 sm:pb-16 md:pb-12
  "
>
  {/* Fundo animado (cross-fade + parallax + ken burns) */}
  <div className="absolute inset-0 z-0">
    <AnimatePresence initial={false} mode="sync">
      <motion.div
        key={bgIndex}
        style={{ y: yHero, backgroundImage: `url("${HERO_IMAGES[bgIndex]}")` }}
        className="absolute inset-0 bg-center bg-cover"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 1.25, ease: 'easeInOut' }}
      />
    </AnimatePresence>

    {/* Partículas / glow sutil */}
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0.28 }}
      animate={{ opacity: [0.28, 0.4, 0.28] }}
      transition={{ duration: 8, repeat: Infinity }}
      style={{
        background:
          'radial-gradient(1200px 600px at 30% 20%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(1000px 600px at 70% 70%, rgba(255,255,255,0.12), transparent 60%)',
      }}
    />
  </div>

  {/* Overlays (não bloqueiam clique e ficam na mesma camada do BG) */}
  <div className="absolute inset-0 pointer-events-none z-0 bg-black/35" />
  {/* FADE apenas inferior */}
  <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none z-0 bg-gradient-to-b from-transparent to-white" />

  {/* Conteúdo do hero (sempre acima do BG/overlays) */}
  <div className="relative z-10 flex h-full items-end">
    <div className="max-w-6xl mx-auto px-6 w-full">
      <div className="grid lg:grid-cols-2 gap-10 items-end">
        {/* Bloco esquerdo */}
        <div className="max-w-2xl">
          <motion.div
            className="mb-4 flex lg:block justify-center lg:justify-start"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/evastur-logo.png"
              alt="Evastur"
              className="h-12 w-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow"
          >
            Sonhos que viram viagens: passagens, cruzeiros, hotéis e experiências.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-3 text-lg md:text-xl text-white/95"
          >
            Conte com a Evastur para cuidar de cada detalhe. Você só escolhe para onde quer sorrir primeiro.
          </motion.p>

          <div className="mt-6 hidden lg:flex gap-3">
            <a
              href="#buscar"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-gray-900 shadow hover:shadow-lg transition"
            >
              Pesquisar agora
            </a>
            <a
              href="#beneficios"
              className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur hover:bg-white/20 transition"
            >
              Por que a Evastur?
            </a>
          </div>
        </div>

        {/* Card de busca — com respiro real no mobile */}
        <motion.div
          id="buscar"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="lg:justify-self-end w-full mt-10 sm:mt-8 md:mt-6"
        >
          <HeroSearch />
        </motion.div>
      </div>
    </div>
  </div>

  {/* Indicadores do background */}
  <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex gap-2">
    {HERO_IMAGES.map((_, i) => (
      <div
        key={i}
        className={`h-1.5 rounded-full transition-all ${i === bgIndex ? 'w-8 bg-white' : 'w-3 bg-white/70'}`}
      />
    ))}
  </div>
</section>

      {/* ===========================
          Benefícios
         =========================== */}
      <section id="beneficios" className="relative scroll-mt-[var(--header-h)]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold tracking-tight text-center"
          >
            Por que viajar com a Evastur
          </motion.h2>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: i * 0.03 }}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-gray-900 text-white p-2 shadow-sm">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-lg font-semibold">{b.title}</h3>
                    </div>
                    <p className="mt-3 text-gray-600">{b.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===========================
          Prévia: “Alguns pacotes”
         =========================== */}
      <section id="pacotes" className="max-w-6xl mx-auto px-6 pb-18 scroll-mt-[var(--header-h)]">
        <div className="flex items-end justify-between gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold tracking-tight"
          >
            Algumas oportunidades para você
          </motion.h2>
          <Link
            href="/pacotes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-pink-700 hover:text-pink-800 transition"
          >
            Ver todos os pacotes <ArrowRight size={16} />
          </Link>
        </div>

        {loading && <p className="mt-6 text-center text-gray-500">Carregando pacotes…</p>}
        {!loading && error && <p className="mt-6 text-center text-red-500">{error}</p>}
        {!loading && !error && preview.length === 0 && (
          <p className="mt-6 text-center text-gray-500">Nenhum pacote disponível no momento.</p>
        )}

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {preview.map((p, i) => {
            const capa = p.imagens?.[0];
            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.04, duration: 0.45 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100"
              >
                <div className="relative h-44 w-full overflow-hidden bg-gray-200">
                  {capa ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={capa} alt={p.nome} className="h-full w-full object-cover transition group-hover:scale-[1.03]" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      Imagem indisponível
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                <div className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{p.nome}</h3>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin size={16} /> {p.local || 'Destino a definir'}
                      </p>
                    </div>
                    <div className="rounded-md bg-gray-900 px-2 py-1 text-xs font-semibold text-white flex items-center gap-1">
                      <Clock size={14} />
                      {p.dias ? `${p.dias}d` : 'Dias?'}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3">
                    {p.resumo || p.descricao || 'Descrição em breve.'}
                  </p>

                  <div className="mt-auto flex items-center justify-between text-sm">
                    <span className="text-xl font-extrabold text-gray-900">{p.preco || 'Preço a consultar'}</span>
                    <Link href={`/pacotes/${p.id}`} className="text-pink-700 hover:text-pink-800 font-semibold">
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* ===========================
          CTA final
         =========================== */}
      <section className="bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold"
          >
            Pronto para dar play na sua próxima viagem?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-3 text-gray-600 max-w-2xl mx-auto"
          >
            Do orçamento ao roteiro final, cuidamos de tudo com transparência e agilidade.
            Você só precisa escolher o destino.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8"
          >
            <Link
              href="/pacotes"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-white font-semibold
                         bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600
                         shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              Ver todos os pacotes <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
