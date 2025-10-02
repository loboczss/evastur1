'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
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
  Image as ImageIcon,
  Shield,
  Star
} from 'lucide-react';
import type { PackageDTO } from '@/types/package';
import EditableText from './EditableText';

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
              className="relative w-full max-w-4xl"
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 rounded-3xl blur-2xl" />
              
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="grid lg:grid-cols-[1fr,340px]">
                  {/* Área de imagem com altura fixa */}
                  <div className="relative bg-gray-900 h-[340px] lg:h-[450px]">
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
                            <img
                              src={imgs[idx]}
                              alt={`${data.nome} - Imagem ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        </AnimatePresence>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                        {max > 1 && (
                          <>
                            <button
                              onClick={prev}
                              aria-label="Anterior"
                              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-xl hover:bg-white hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 group"
                            >
                              <ChevronLeft className="w-5 h-5 text-gray-900 group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <button
                              onClick={next}
                              aria-label="Próxima"
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-xl hover:bg-white hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 group"
                            >
                              <ChevronRight className="w-5 h-5 text-gray-900 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md">
                              <span className="text-white text-sm font-bold">{idx + 1} / {max}</span>
                            </div>

                            <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
                              {imgs.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setIdx(i)}
                                  aria-label={`Ver imagem ${i + 1}`}
                                  className={`transition-all ${
                                    i === idx 
                                      ? 'w-8 h-2 bg-white rounded-full' 
                                      : 'w-2 h-2 bg-white/60 rounded-full hover:bg-white/80 hover:scale-125'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <ImageIcon className="w-16 h-16 mb-3 opacity-50" />
                        <EditableText
                          as="span"
                          id="packages.modal.emptyGallery"
                          defaultContent="[Carrossel do DB (0 imagens)]"
                          className="text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Painel lateral de detalhes */}
                  <div className="flex flex-col bg-gradient-to-br from-white to-gray-50">
                    {/* Header do painel */}
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h2 className="text-xl font-black text-gray-900 leading-tight">
                          {data.nome || '[Nome do pacote]'}
                        </h2>
                        <button
                          ref={closeBtnRef}
                          onClick={onClose}
                          aria-label="Fechar"
                          className="p-2 -mt-1 -mr-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                        >
                          <X className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {(data as any).local || 'Destino a definir'}
                        </span>
                      </div>
                    </div>

                    {/* Conteúdo scrollável */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      {/* Preço destacado */}
                      <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <div className="relative">
                          <div className="flex items-center gap-2 mb-1">
                            <Banknote className="w-5 h-5" />
                            <span className="text-sm font-semibold opacity-90">A partir de</span>
                          </div>
                          <div className="text-2xl font-black">{formatPrice(data.preco)}</div>
                        </div>
                      </div>

                      {/* Informações em grid */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-blue-100">
                              <Clock className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-500">Duração</span>
                          </div>
                          <div className="text-base font-black text-gray-900">
                            {typeof (data as any).dias === 'number' ? `${(data as any).dias} dias` : 'A definir'}
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-green-100">
                              <Star className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-500">Avaliação</span>
                          </div>
                          <div className="text-lg font-black text-gray-900">4.9/5</div>
                        </div>

                        <div className="col-span-2 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-purple-100">
                              <Calendar className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-500">Datas</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div>
                              <div className="text-xs text-gray-500 mb-0.5">Ida</div>
                              <div className="font-bold text-gray-900">
                                {data.dataIda ? new Date(data.dataIda).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : (
                                  <EditableText as="span" id="packages.modal.departurePlaceholder" defaultContent="[Data ida]" />
                                )}
                              </div>
                            </div>
                            <div className="text-gray-300">→</div>
                            <div>
                              <div className="text-xs text-gray-500 mb-0.5">Volta</div>
                              <div className="font-bold text-gray-900">
                                {data.dataVolta ? new Date(data.dataVolta).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : (
                                  <EditableText as="span" id="packages.modal.returnPlaceholder" defaultContent="[Data volta]" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Descrição */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <h3 className="text-sm font-bold text-gray-900">Sobre este pacote</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {data.resumo || data.descricao || 'Em breve adicionaremos mais informações sobre este pacote incrível.'}
                        </p>
                      </div>

                      {/* Benefits */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Shield className="w-3.5 h-3.5 text-green-600" />
                          <span>Cancelamento grátis</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Shield className="w-3.5 h-3.5 text-blue-600" />
                          <span>Suporte 24/7</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer fixo com CTA */}
                    <div className="p-5 border-t border-gray-100 bg-white">
                      <button
                        className="group relative w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          <EditableText
                            as="span"
                            id="packages.modal.cta"
                            defaultContent="[CTA Reservar (DB)]"
                          />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      </button>
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