'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Banknote, 
  Clock,
  Sparkles,
  Shield,
  Star,
  Users,
  CheckCircle2,
  Heart,
  ImageIcon
} from 'lucide-react';

type PackageDTO = {
  id: string;
  nome: string;
  preco?: number | string;
  imagens?: string[];
  local?: string;
  dias?: number;
  dataIda?: string;
  dataVolta?: string;
  resumo?: string;
  descricao?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  data: PackageDTO | null;
};

function formatPrice(preco: unknown): string {
  if (typeof preco === 'number') {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);
  }
  if (typeof preco === 'string' && preco.trim().length) return preco;
  return 'Preço a consultar';
}

export default function PackageModal({ open, onClose, data }: Props) {
  const [idx, setIdx] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const imgs = useMemo(() => (data?.imagens ?? []).slice(0, 5).filter(Boolean), [data?.imagens]);
  const max = imgs.length;
  const hasImgs = max > 0;

  useEffect(() => {
    if (open) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setIdx(0);
    const id = setTimeout(() => closeBtnRef.current?.focus(), 30);
    return () => clearTimeout(id);
  }, [open, data?.id]);

  useEffect(() => {
    if (!open) return;
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (max > 1) {
        if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + max) % max);
        if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % max);
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [open, onClose, max]);

  if (!open || !data) return null;

  const prev = () => setIdx((i) => (i - 1 + max) % max);
  const next = () => setIdx((i) => (i + 1) % max);
  const locationLabel = data.local?.trim() || 'Destino paradisíaco';
  const durationLabel = typeof data.dias === 'number' ? `${data.dias} dias` : 'A definir';

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onMouseDown={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
      >
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={data.nome || 'Detalhes do pacote'}
              className="relative w-full max-w-5xl"
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 rounded-3xl blur-2xl" />
              
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="grid lg:grid-cols-[1.2fr,400px]">
                  {/* Área de imagem */}
                  <div className="relative bg-gray-900 h-[380px] lg:h-[550px]">
                    {hasImgs ? (
                      <div className="relative w-full h-full">
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                              key={idx}
                              className="absolute inset-0"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4, ease: 'easeInOut' }}
                            >
                              <Image
                                src={imgs[idx]}
                                alt={`${data.nome ?? 'Pacote'} - Imagem ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                priority={idx === 0}
                              />
                            </motion.div>
                          </AnimatePresence>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                        {max > 1 && (
                          <>
                            <button
                              onClick={prev}
                              aria-label="Anterior"
                              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl hover:bg-white hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 group"
                            >
                              <ChevronLeft className="w-6 h-6 text-gray-900 group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <button
                              onClick={next}
                              aria-label="Próxima"
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl hover:bg-white hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 group"
                            >
                              <ChevronRight className="w-6 h-6 text-gray-900 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                            <div className="absolute top-5 left-5 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md">
                              <span className="text-white text-sm font-bold">{idx + 1} / {max}</span>
                            </div>

                            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5">
                              {imgs.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setIdx(i)}
                                  aria-label={`Ver imagem ${i + 1}`}
                                  className={`transition-all ${
                                    i === idx 
                                      ? 'w-10 h-2.5 bg-white rounded-full shadow-lg' 
                                      : 'w-2.5 h-2.5 bg-white/60 rounded-full hover:bg-white/80 hover:scale-125'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}

                        <button className="absolute top-5 right-5 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all group">
                          <Heart className="w-5 h-5 text-white group-hover:fill-white transition-all" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gradient-to-br from-gray-800 to-gray-900">
                        <ImageIcon className="w-20 h-20 mb-4 opacity-30" />
                        <span className="text-sm font-medium">Nenhuma imagem disponível</span>
                      </div>
                    )}
                  </div>

                  {/* Painel lateral */}
                  <div className="flex flex-col bg-gradient-to-br from-white via-gray-50 to-white">
                    <div className="relative p-6 border-b border-gray-100">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-full blur-3xl -z-10" />
                      
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h2 className="text-2xl font-black text-gray-900 leading-tight pr-8">
                          {data.nome || 'Pacote Incrível'}
                        </h2>
                        <button
                          ref={closeBtnRef}
                          onClick={onClose}
                          aria-label="Fechar"
                          className="absolute top-4 right-4 p-2.5 rounded-full hover:bg-gray-100 transition-all hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                        >
                          <X className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <div className="p-1.5 rounded-lg bg-pink-100">
                          <MapPin className="w-4 h-4 text-pink-600" />
                        </div>
                        <span className="text-sm font-semibold">{locationLabel}</span>
                      </div>

                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold shadow-lg">
                        <Star className="w-4 h-4 fill-white" />
                        <span>4.9</span>
                        <span className="text-white/80">·</span>
                        <span className="font-medium">238 avaliações</span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="relative p-5 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white overflow-hidden shadow-xl"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
                        <div className="relative">
                          <div className="flex items-center gap-2 mb-2">
                            <Banknote className="w-5 h-5" />
                            <span className="text-sm font-semibold opacity-90">A partir de</span>
                          </div>
                          <div className="text-3xl font-black mb-1">{formatPrice(data.preco)}</div>
                          <p className="text-xs text-white/80 font-medium">Parcelamento disponível</p>
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
                              <Clock className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Duração</span>
                          </div>
                          <div className="text-xl font-black text-gray-900">{durationLabel}</div>
                        </div>

                        <div className="p-4 rounded-xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100">
                              <Users className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Grupo</span>
                          </div>
                          <div className="text-xl font-black text-gray-900">2-8 pax</div>
                        </div>

                        <div className="col-span-2 p-4 rounded-xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
                              <Calendar className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Período da viagem</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-gray-500 mb-1 font-semibold">Embarque</div>
                              <div className="text-lg font-black text-gray-900">
                                {data.dataIda ? new Date(data.dataIda).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'A definir'}
                              </div>
                            </div>
                            <div className="text-gray-300 text-2xl">→</div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500 mb-1 font-semibold">Retorno</div>
                              <div className="text-lg font-black text-gray-900">
                                {data.dataVolta ? new Date(data.dataVolta).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'A definir'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                          <h3 className="text-base font-black text-gray-900">Sobre este pacote</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {data.resumo || data.descricao || 'Prepare-se para uma experiência inesquecível! Este pacote foi cuidadosamente elaborado para proporcionar momentos únicos e memoráveis.'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-gray-900 mb-3">O que está incluso</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>Passagens aéreas ida e volta</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>Hospedagem com café da manhã</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>Traslados aeroporto-hotel</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>Seguro viagem</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 p-2.5 rounded-lg bg-green-50 border border-green-100">
                          <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>Cancelamento grátis</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                          <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>Suporte 24/7</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-white">
                      <button
                        className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-black text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Reservar agora
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      </button>
                      <p className="text-center text-xs text-gray-500 mt-3">
                        Parcele em até 12x sem juros
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}