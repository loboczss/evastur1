'use client';

import { useEffect, useMemo, useState, CSSProperties, MouseEventHandler } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import PackageModal from './PackageModal';
import type { PackageDTO } from '@/types/package';
import { usePackages } from '@/hooks/usePackages';
import EditableText from './EditableText';
import {
  MapPin, Calendar, Users, Star, BadgePercent, Plane, ArrowRight, Sparkles
} from 'lucide-react';

/** Extensão do seu DTO com campos opcionais que você usa no card */
export type PackageVM = PackageDTO & {
  categoria?: string;
  cidade?: string;
  dias?: number;
  pessoas?: number;
  avaliacao?: number;
  desconto?: number;
};

function formatPrice(preco: unknown) {
  if (typeof preco === 'number') {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);
  }
  if (typeof preco === 'string' && preco.trim().length) return preco;
  return 'Preço a consultar';
}

function IconPill({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-800 shadow">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

/** Carousel de imagens com crossfade; pausa no hover */
function ImageCarousel({
  images,
  alt,
  onMouseMove,
  onMouseLeave,
}: {
  images: string[];
  alt: string;
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const hasImgs = images && images.length > 0;

  useEffect(() => {
    if (!hasImgs) return;
    const t = setInterval(() => {
      if (!paused) setIdx((i) => (i + 1) % images.length);
    }, 3500);
    return () => clearInterval(t);
  }, [images, paused, hasImgs]);

  if (!hasImgs) {
    return (
      <div className="relative aspect-[16/10] w-full bg-gray-200 flex items-center justify-center text-gray-500">
        Imagem indisponível
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-t-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={(e) => { setPaused(false); onMouseLeave?.(e); }}
      onMouseMove={onMouseMove}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={images[idx]}
          src={images[idx]}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-4 rounded-full transition-all ${i === idx ? 'bg-white/90' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 backdrop-blur-xl shadow-2xl" aria-hidden>
      <div className="aspect-[16/10] bg-gray-200/70 shimmer" />
      <div className="p-5">
        <div className="h-5 w-2/3 rounded-md bg-gray-200/70 shimmer" />
        <div className="mt-3 h-4 w-full rounded-md bg-gray-200/70 shimmer" />
        <div className="mt-2 h-4 w-5/6 rounded-md bg-gray-200/70 shimmer" />
        <div className="mt-5 flex items-center justify-between">
          <div className="h-6 w-28 rounded-full bg-gray-200/70 shimmer" />
          <div className="h-7 w-24 rounded-full bg-gray-200/70 shimmer" />
        </div>
      </div>
    </div>
  );
}

/** Card isolado: hooks seguros e tipagem correta */
function PackageCard({
  item,
  delay,
  onOpen,
}: {
  item: PackageVM;
  delay: number;
  onOpen: (pkg: PackageVM) => void;
}) {
  const imgs = (item.imagens ?? []).filter(Boolean);

  // Hooks aqui (fora de loop/callback): OK ✅
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rotateX = useTransform(mvY, [-40, 40], [6, -6]);
  const rotateY = useTransform(mvX, [-40, 40], [-6, 6]);

  const updateFromEvent = (el: Element, clientX: number, clientY: number) => {
    const rect = el.getBoundingClientRect();
    const relX = clientX - rect.left - rect.width / 2;
    const relY = clientY - rect.top - rect.height / 2;
    mvX.set(relX / 4);
    mvY.set(relY / 4);
  };

  // Handlers específicos por elemento (tipos corretos)
  const handleMoveBtn: MouseEventHandler<HTMLButtonElement> = (e) => {
    updateFromEvent(e.currentTarget, e.clientX, e.clientY);
  };
  const handleLeaveBtn: MouseEventHandler<HTMLButtonElement> = () => {
    mvX.set(0); mvY.set(0);
  };
  const handleMoveDiv: MouseEventHandler<HTMLDivElement> = (e) => {
    updateFromEvent(e.currentTarget, e.clientX, e.clientY);
  };
  const handleLeaveDiv: MouseEventHandler<HTMLDivElement> = () => {
    mvX.set(0); mvY.set(0);
  };

  const transformStyle: CSSProperties['transformStyle'] = 'preserve-3d';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay, type: 'spring', stiffness: 220, damping: 22 }}
      className="group relative"
    >
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-orange-500/30 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

      <motion.button
        type="button"
        onClick={() => onOpen(item)}
        role="button"
        aria-label={`Ver detalhes do pacote ${item.nome ?? 'pacote'}`}
        className="relative w-full overflow-hidden rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300/30"
        style={{ rotateX, rotateY, transformStyle }}
        onMouseMove={handleMoveBtn}
        onMouseLeave={handleLeaveBtn}
      >
        {/* Topo com carousel */}
        <div className="relative">
          <ImageCarousel
            images={imgs}
            alt={item.nome ?? 'Pacote'}
            onMouseMove={handleMoveDiv}
            onMouseLeave={handleLeaveDiv}
          />

          {/* Badges esquerda */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {(item.categoria || item.cidade) && (
              <IconPill icon={MapPin}>{item.categoria ?? item.cidade}</IconPill>
            )}
            {typeof item.dias === 'number' && (
              <IconPill icon={Calendar}>{item.dias} dias</IconPill>
            )}
            {typeof item.pessoas === 'number' && (
              <IconPill icon={Users}>{item.pessoas} pessoas</IconPill>
            )}
          </div>

          {/* Badges direita */}
          <div className="absolute right-3 top-3 flex flex-wrap gap-2">
            {typeof item.desconto === 'number' && item.desconto > 0 && (
              <IconPill icon={BadgePercent}>-{item.desconto}%</IconPill>
            )}
            {typeof item.avaliacao === 'number' && item.avaliacao > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/95 text-white px-3 py-1 text-xs font-bold shadow">
                <Star className="h-3.5 w-3.5 fill-current" />
                {item.avaliacao.toFixed(1)}
              </span>
            )}
          </div>

          {/* Sparkles sutis no hover */}
          <motion.div
            className="pointer-events-none absolute right-3 bottom-3"
            initial={{ opacity: 0, y: 6 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="h-5 w-5 text-white/90 drop-shadow" />
          </motion.div>
        </div>

        {/* Corpo */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-gray-900 line-clamp-1">
              {item.nome || '[Nome DB]'}
            </h3>
            <span className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white h-8 w-8 shadow">
              <Plane className="h-4 w-4" />
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {item.resumo || item.descricao || 'Descrição em breve.'}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-xl font-black text-gray-900">
              {formatPrice(item.preco)}
            </span>

            {/* CTA com sheen */}
            <span className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white
                             bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500
                             transition-all group-hover:scale-[1.02]">
              Ver detalhes
              <ArrowRight className="h-4 w-4" />
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent
                               opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 rounded-full" />
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/5 group-hover:ring-purple-500/20 transition" />
      </motion.button>
    </motion.div>
  );
}

export default function FeaturedPackages() {
  const { packages, loading, error } = usePackages();
  const items: PackageVM[] = useMemo(() => {
    // Se seu DTO real já tiver esses campos, pode remover o cast.
    return packages.slice(0, 6) as PackageVM[];
  }, [packages]);

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<PackageVM | null>(null);

  const openModal = (pkg: PackageVM) => { setCurrent(pkg); setOpen(true); };

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <EditableText
            as="h2"
            id="home.packages.title"
            defaultContent="[Título dos principais pacotes (DB)]"
            className="text-3xl md:text-4xl font-extrabold text-gray-900"
          />
          <EditableText
            as="p"
            id="home.packages.subtitle"
            defaultContent="[Descrição curta (DB)]"
            className="mt-2 text-gray-600"
          />
        </div>

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={`sk-${i}`} />)}
          </div>
        )}

        {!loading && error && <p className="text-center text-red-600 font-medium">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="text-center text-gray-500">Nenhum pacote cadastrado até o momento.</p>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((it, idx) => (
              <PackageCard key={it.id} item={it} delay={idx * 0.05} onOpen={openModal} />
            ))}
          </div>
        )}
      </section>

      <PackageModal open={open} onClose={() => setOpen(false)} data={current as PackageDTO | null} />
    </>
  );
}
