'use client';

import type { FC, MouseEvent as ReactMouseEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  Star,
  Calendar,
  Users,
  Ship,
  type LucideIcon,
} from 'lucide-react';

type TravelPackage = {
  id: string;
  nome: string;
  local: string;
  dias: number;
  preco: string;
  resumo: string;
  dataIda: string;
  dataVolta: string;
  imagens: string[];
  descricao?: string;
};

type UsePackagesResult = {
  packages: TravelPackage[];
  loading: boolean;
  error: null;
  removeLocal: (id: TravelPackage['id']) => void;
};

// Mock dos hooks - substitua pelos seus hooks reais
const usePackages = (): UsePackagesResult => {
  const [packages, setPackages] = useState<TravelPackage[]>([
    {
      id: '1',
      nome: 'Cancún Premium',
      local: 'Cancún, México',
      dias: 7,
      preco: 'R$ 4.500',
      resumo: 'Resort all-inclusive com praia paradisíaca e gastronomia internacional.',
      dataIda: '2025-03-15',
      dataVolta: '2025-03-22',
      imagens: ['https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80']
    },
    {
      id: '2',
      nome: 'Paris Romântico',
      local: 'Paris, França',
      dias: 10,
      preco: 'R$ 8.900',
      resumo: 'Tour completo pela cidade luz com guia exclusivo e hospedagem boutique.',
      dataIda: '2025-04-10',
      dataVolta: '2025-04-20',
      imagens: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80']
    },
    {
      id: '3',
      nome: 'Caribe Incrível',
      local: 'Punta Cana, República Dominicana',
      dias: 8,
      preco: 'R$ 5.200',
      resumo: 'Resort de luxo com atividades aquáticas e entretenimento para toda família.',
      dataIda: '2025-05-05',
      dataVolta: '2025-05-13',
      imagens: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80']
    }
  ]);

  const removeLocal = (id: TravelPackage['id']) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    packages,
    loading: false,
    error: null,
    removeLocal,
  };
};

const useCanManagePackages = (): boolean => false;

type PackageModalProps = {
  open: boolean;
  onClose: () => void;
  data: TravelPackage | null;
};

const PackageModal: FC<PackageModalProps> = ({ open, onClose, data }) => {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={(e: ReactMouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="relative h-64">
          {data.imagens?.[0] ? (
            <Image
              src={data.imagens[0]}
              alt={data.nome}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
              Sem imagem disponível
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:bg-white transition"
          >
            ✕
          </button>
        </div>
        <div className="p-8">
          <h2 className="text-3xl font-black text-gray-900">{data.nome}</h2>
          <p className="text-gray-600 mt-2">{data.local}</p>
          <p className="text-gray-700 mt-4">{data.resumo}</p>
          <div className="mt-6 flex gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>{data.dias} dias</span>
            </div>
            <div className="text-2xl font-black text-purple-600">{data.preco}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AddPackageButton: FC = () => (
  <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition">
    + Novo Pacote
  </button>
);

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1920&q=80',
];

const HEADLINES = [
  'Pacotes inteligentes para viajar mais gastando menos.',
  'Voos, hotéis e experiências selecionadas a dedo.',
  'Curadoria humana, tecnologia de ponta e preço justo.',
  'Seu próximo destino começa com um clique.',
];

export default function PacotesPage() {
  const { packages: pacotes, loading, error, removeLocal } = usePackages();
  const canManage = useCanManagePackages();

  const [open, setOpen] = useState<boolean>(false);
  const [current, setCurrent] = useState<TravelPackage | null>(null);
  const [deletingId, setDeletingId] = useState<TravelPackage['id'] | null>(null);

  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 0.4], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);

  const [bgIndex, setBgIndex] = useState<number>(0);
  const [headlineIndex, setHeadlineIndex] = useState<number>(0);

  useEffect(() => {
    const id = setInterval(() => setBgIndex((i) => (i + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setHeadlineIndex((i) => (i + 1) % HEADLINES.length), 3500);
    return () => clearInterval(id);
  }, []);

  type Highlight = {
    icon: LucideIcon;
    title: string;
    text: string;
    color: string;
  };

  const HIGHLIGHTS = useMemo<Highlight[]>(
    () => [
      {
        icon: Plane,
        title: 'Voos com melhor custo-benefício',
        text: 'Roteiros otimizados para economizar tempo e dinheiro sem abrir mão do conforto.',
        color: 'from-blue-500 to-cyan-500',
      },
      {
        icon: Hotel,
        title: 'Hospedagens testadas',
        text: 'Selecionadas por localização, avaliação e estrutura real, não só por fotos.',
        color: 'from-purple-500 to-pink-500',
      },
      {
        icon: MapPin,
        title: 'Experiências locais',
        text: 'Passeios autênticos para você viver o destino além do cartão-postal.',
        color: 'from-green-500 to-teal-500',
      },
      {
        icon: ShieldCheck,
        title: 'Atendimento dedicado',
        text: 'Suporte antes, durante e depois — sem filas e sem robozice.',
        color: 'from-orange-500 to-red-500',
      },
      {
        icon: BadgePercent,
        title: 'Ofertas relâmpago',
        text: 'Oportunidades reais com estoque limitado. Perdeu, só na próxima.',
        color: 'from-indigo-500 to-purple-500',
      },
      {
        icon: Sparkles,
        title: 'Roteiros personalizáveis',
        text: 'Ajuste datas, passeios e hospedagens em minutos, sem dor de cabeça.',
        color: 'from-pink-500 to-rose-500',
      },
    ],
    []
  );

  const [hlIndex, setHlIndex] = useState<number>(0);
  const goPrev = () => setHlIndex((i) => (i - 1 + HIGHLIGHTS.length) % HIGHLIGHTS.length);
  const goNext = () => setHlIndex((i) => (i + 1) % HIGHLIGHTS.length);

  const abrir = (pkg: TravelPackage) => {
    setCurrent(pkg);
    setOpen(true);
  };

  const excluir = async (pkg: TravelPackage) => {
    if (!canManage) return;
    if (!confirm(`Deseja realmente excluir o pacote "${pkg.nome}"?`)) return;
    setDeletingId(pkg.id);
    try {
      const res = await fetch(`/api/admin/packages/${pkg.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir');
      removeLocal(pkg.id);
      if (current?.id === pkg.id) {
        setOpen(false);
        setCurrent(null);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir pacote');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900">
      {/* HERO SECTION */}
      <section className="relative isolate w-full overflow-hidden min-h-[90vh] md:min-h-[700px]">
        <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0 z-0">
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={bgIndex}
              style={{ y: yHero, backgroundImage: `url("${HERO_IMAGES[bgIndex]}")` }}
              className="absolute inset-0 bg-center bg-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </AnimatePresence>

          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)',
                'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)',
                'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </motion.div>

        <div className="absolute inset-0 z-0 backdrop-blur-[2px] bg-gradient-to-b from-transparent via-transparent to-white" />

        <div className="relative z-10 flex h-full items-center pt-20">
          <div className="max-w-7xl mx-auto px-6 w-full py-20">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-white text-sm font-medium">Pacotes exclusivos</span>
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1]"
                >
                  <span className="bg-gradient-to-r from-white via-white to-gray-200 bg-clip-text text-transparent">
                    Viaje melhor
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                    com pacotes pensados
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                    para pessoas reais
                  </span>
                </motion.h1>

                <div className="h-14 mt-6 relative">
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mt-8 flex flex-wrap items-center gap-4"
                >
                  <a
                    href="#pacotes"
                    className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-gray-900 font-semibold overflow-hidden transition-all hover:scale-105"
                  >
                    <span className="relative z-10">Ver pacotes</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                  </a>
                  <a
                    href="#como-funciona"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 bg-white/5 text-white font-semibold backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/50"
                  >
                    Como funciona
                  </a>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <AddPackageButton />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex gap-3">
          {HERO_IMAGES.map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === bgIndex ? 'w-12 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              whileHover={{ scale: 1.2 }}
              onClick={() => setBgIndex(i)}
            />
          ))}
        </div>
      </section>

      {/* BENEFITS CAROUSEL */}
      <section id="como-funciona" className="py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Por que nossos pacotes valem a pena
              </h2>
            </motion.div>

            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                className="rounded-full border border-gray-200 bg-white p-3 shadow-lg hover:shadow-xl transition hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                className="rounded-full border border-gray-200 bg-white p-3 shadow-lg hover:shadow-xl transition hover:scale-105"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={hlIndex}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: 3 }, (_, index) => index).map((k) => {
                const item = HIGHLIGHTS[(hlIndex + k) % HIGHLIGHTS.length];
                const Icon = item.icon;
                return (
                  <motion.div
                    key={`${item.title}-${k}`}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="group relative"
                  >
                    <div className="relative h-full p-8 rounded-3xl bg-white border border-gray-200 shadow-lg overflow-hidden transition-all hover:shadow-2xl">
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                      
                      <div className={`relative inline-flex p-3 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.text}</p>
                      
                      <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${item.color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* PACKAGES GRID */}
      <section id="pacotes" className="py-24 bg-gradient-to-b from-gray-50 to-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Destinos disponíveis
            </h2>
            <p className="mt-4 text-xl text-gray-600">Escolha seu próximo destino e comece a sonhar</p>
          </motion.div>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-12 text-red-500 bg-red-50 rounded-2xl">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && pacotes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Ship className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Nenhum pacote disponível no momento.</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pacotes.map((p, i) => {
              const capa = p.imagens?.[0];
              return (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative cursor-pointer"
                  onClick={() => abrir(p)}
                >
                  <div className="relative h-full bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                    <div className="relative h-56 overflow-hidden">
                      {capa ? (
                        <Image
                          src={capa}
                          alt={p.nome}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-gray-400" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg">
                        <p className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {p.preco || 'Consulte'}
                        </p>
                      </div>

                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-sm font-semibold flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {p.dias ? `${p.dias} dias` : 'A definir'}
                      </div>

                      {canManage && (
                        <button
                          onClick={(e: ReactMouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            excluir(p);
                          }}
                          className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition"
                          disabled={deletingId === p.id}
                        >
                          {deletingId === p.id ? 'Removendo…' : 'Excluir'}
                        </button>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-1">
                        {p.nome}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-gray-500 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">{p.local || 'Destino a definir'}</span>
                      </div>

                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {p.resumo || p.descricao || 'Uma experiência única te espera neste destino incrível.'}
                      </p>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }, (_, index) => index).map((starIndex) => (
                            <Star key={starIndex} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">4.9 (238 avaliações)</span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{p.dataIda ? new Date(p.dataIda).toLocaleDateString() : 'A definir'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>2-4 pessoas</span>
                        </div>
                      </div>

                      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                          Ver detalhes
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <PackageModal open={open} onClose={() => setOpen(false)} data={current} />
    </main>
  );
}