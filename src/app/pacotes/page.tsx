'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

import PackageModal from '@/components/PackageModal';
import AddPackageButton from '@/components/packages/AddPackageButton';
import type { PackageDTO } from '@/types/package';
import { usePackages } from '@/hooks/usePackages';
import { useCanManagePackages } from '@/hooks/useCanManagePackages';

// Ícones (sem emoji)
import {
  Plane,
  Hotel,
  MapPin,
  ShieldCheck,
  BadgePercent,
  Sparkles,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/** ===========================
 * HERO: imagens (cross-fade + parallax + leve Ken Burns)
 * =========================== */
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80', // praia turquesa
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80', // cidade noite
  'https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?auto=format&fit=crop&w=1920&q=80', // montanha neblina
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1920&q=80', // cruzeiro/porto
];

/** Headline rotativa — frases curtas e vendedoras */
const HEADLINES = [
  'Pacotes inteligentes para viajar mais gastando menos.',
  'Voos, hotéis e experiências selecionadas a dedo.',
  'Curadoria humana, tecnologia de ponta e preço justo.',
  'Seu próximo destino começa com um clique.',
];

export default function PacotesPage() {
  const { packages: pacotes, loading, error, removeLocal } = usePackages();
  const canManage = useCanManagePackages();

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<PackageDTO | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Parallax do BG
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 0.3], [0, -40]);

  // Índices de carrossel
  const [bgIndex, setBgIndex] = useState(0);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setBgIndex((i) => (i + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const id = setInterval(() => setHeadlineIndex((i) => (i + 1) % HEADLINES.length), 3500);
    return () => clearInterval(id);
  }, []);

  // Destaques (cards com ícones) em carrossel simples
  const HIGHLIGHTS = useMemo(
    () => [
      {
        icon: Plane,
        title: 'Voos com melhor custo-benefício',
        text: 'Roteiros otimizados para economizar tempo e dinheiro sem abrir mão do conforto.',
      },
      {
        icon: Hotel,
        title: 'Hospedagens testadas',
        text: 'Selecionadas por localização, avaliação e estrutura real, não só por fotos.',
      },
      {
        icon: MapPin,
        title: 'Experiências locais',
        text: 'Passeios autênticos para você viver o destino além do cartão-postal.',
      },
      {
        icon: ShieldCheck,
        title: 'Atendimento dedicado',
        text: 'Suporte antes, durante e depois — sem filas e sem robozice.',
      },
      {
        icon: BadgePercent,
        title: 'Ofertas relâmpago',
        text: 'Oportunidades reais com estoque limitado. Perdeu, só na próxima.',
      },
      {
        icon: Sparkles,
        title: 'Roteiros personalizáveis',
        text: 'Ajuste datas, passeios e hospedagens em minutos, sem dor de cabeça.',
      },
    ],
    []
  );

  const [hlIndex, setHlIndex] = useState(0);
  const goPrev = () => setHlIndex((i) => (i - 1 + HIGHLIGHTS.length) % HIGHLIGHTS.length);
  const goNext = () => setHlIndex((i) => (i + 1) % HIGHLIGHTS.length);

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

  return (
    <main className="min-h-screen bg-white text-gray-900 pt-safe-header">
      {/* ===========================
          HERO — isolado, com fade inferior e altura segura no mobile
         =========================== */}
      <section
        className="
          relative isolate w-full overflow-hidden scroll-mt-[var(--header-h)]
          min-h-[calc(80svh-var(--header-h))] md:min-h-[640px]
          pt-6 sm:pt-8 md:pt-10
          pb-24 sm:pb-16
        "
      >
        {/* Camadas de fundo (cross-fade + parallax + ken burns leve) */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={bgIndex}
              style={{ y: yHero, backgroundImage: `url("${HERO_IMAGES[bgIndex]}")` }}
              className="absolute inset-0 bg-center bg-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </AnimatePresence>

          {/* Glow/grade animada sutil */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0.35 }}
            animate={{ opacity: [0.35, 0.5, 0.35] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background:
                'radial-gradient(1200px 600px at 20% 30%, rgba(255,255,255,0.25), transparent 60%), radial-gradient(900px 500px at 80% 60%, rgba(255,255,255,0.15), transparent 60%)',
            }}
          />
        </div>

        {/* Overlays (não bloqueiam clique) + fade só na borda inferior */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none z-0 bg-gradient-to-b from-transparent to-white" />

        {/* Conteúdo do hero */}
        <div className="relative z-10 flex h-full items-center">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                {/* Título fixo (mais padding top vem do pt-safe-header) */}
                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow"
                >
                  Viaje melhor com pacotes pensados para pessoas reais.
                </motion.h1>

                {/* Headline rotativa */}
                <div className="h-14 mt-3 relative">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={headlineIndex}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.5 }}
                      className="text-lg md:text-xl text-white/95"
                    >
                      {HEADLINES[headlineIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* CTA dupla */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <motion.a
                    href="#pacotes"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-gray-900 shadow hover:shadow-lg transition"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Ver pacotes disponíveis <ArrowRight size={18} />
                  </motion.a>
                  <motion.a
                    href="#como-funciona"
                    className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur hover:bg-white/20 transition"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Como funciona
                  </motion.a>
                </div>
              </div>

              {/* Ação administrativa */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="flex flex-col items-start gap-2 self-start sm:self-end"
              >
                <AddPackageButton />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Indicadores do background */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === bgIndex ? 'w-8 bg-white' : 'w-3 bg-white/60'}`}
            />
          ))}
        </div>
      </section>

      {/* ===========================
          Carrossel de destaques
         =========================== */}
      <section id="como-funciona" className="relative scroll-mt-[var(--header-h)]">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-white to-white/0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        />
        <div className="max-w-6xl mx-auto px-6 py-12 relative">
          <div className="flex items-center justify-between">
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold tracking-tight"
            >
              Por que nossos pacotes valem a pena
            </motion.h2>

            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                className="rounded-full border border-gray-200 bg-white p-2 shadow-sm hover:shadow transition"
                aria-label="Anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={goNext}
                className="rounded-full border border-gray-200 bg-white p-2 shadow-sm hover:shadow transition"
                aria-label="Próximo"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="relative mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={hlIndex}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Array.from({ length: 3 }).map((_, k) => {
                  const item = HIGHLIGHTS[(hlIndex + k) % HIGHLIGHTS.length];
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={`${item.title}-${k}`}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.45 }}
                      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-gray-900 text-white p-2 shadow-sm">
                            <Icon size={20} />
                          </div>
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                        </div>
                        <p className="mt-3 text-gray-600">{item.text}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ===========================
          Grade de pacotes
         =========================== */}
      <section id="pacotes" className="max-w-6xl mx-auto px-6 pb-16 scroll-mt-[var(--header-h)]">
        {loading && <p className="text-center text-gray-500">Carregando pacotes…</p>}
        {!loading && error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && pacotes.length === 0 && (
          <p className="text-center text-gray-500">Nenhum pacote cadastrado até o momento.</p>
        )}

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pacotes.map((p, i) => {
            const capa = p.imagens?.[0];
            return (
              <motion.article
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => { setCurrent(p); setOpen(true); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setCurrent(p);
                    setOpen(true);
                  }
                }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.04, duration: 0.45 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <div className="relative h-44 w-full overflow-hidden bg-gray-200">
                  {capa ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={capa}
                      alt={p.nome}
                      className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      Imagem indisponível
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  {canManage && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        (async () => { await excluir(p); })();
                      }}
                      className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-black/80"
                      disabled={deletingId === p.id}
                    >
                      {deletingId === p.id ? 'Removendo…' : 'Excluir'}
                    </button>
                  )}
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
                    <div className="text-right text-xs text-gray-500">
                      <p>
                        {p.dataIda ? new Date(p.dataIda).toLocaleDateString() : 'Ida a definir'} •{' '}
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

      {/* Modal */}
      <PackageModal open={open} onClose={() => setOpen(false)} data={current} />
    </main>
  );
}
