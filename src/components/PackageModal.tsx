'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import type { PackageDTO } from '@/types/package';

type Props = {
  open: boolean;
  onClose: () => void;
  data: PackageDTO | null; // quando null, não renderiza
};

export default function PackageModal({ open, onClose, data }: Props) {
  const [idx, setIdx] = useState(0);
  const max = Math.min(data?.imagens?.length ?? 0, 5);
  const overlayRef = useRef<HTMLDivElement>(null);

  // trava scroll do body
  useEffect(() => {
    if (open) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  // reset índice ao abrir novo pacote
  useEffect(() => {
    setIdx(0);
  }, [open, data?.id]);

  // fechar com ESC
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [onClose]);

  if (!open || !data) return null;

  const prev = () => setIdx((i) => (i - 1 + max) % max);
  const next = () => setIdx((i) => (i + 1) % max);

  const imgs = (data.imagens ?? []).slice(0, 5);
  const hasImgs = imgs.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          // fecha ao clicar fora do card
          if (e.target === overlayRef.current) onClose();
        }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed left-1/2 top-1/2 w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0.95, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.98, opacity: 0, y: 8 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        >
          <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {data.nome || '[Nome do pacote do DB]'}
              </h3>
              <button
                aria-label="Fechar"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="grid md:grid-cols-2 gap-0">
              {/* Carrossel */}
              <div className="relative bg-gray-100 aspect-[4/3] md:aspect-auto md:h-full">
                {hasImgs ? (
                  <>
                    <div className="relative h-full w-full overflow-hidden">
                      <AnimatePresence initial={false} mode="popLayout">
                        <motion.img
                          key={idx}
                          src={imgs[idx] /* URL da imagem do DB */}
                          alt={`Imagem ${idx + 1}`}
                          className="h-full w-full object-cover"
                          initial={{ opacity: 0, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.35 }}
                        />
                      </AnimatePresence>
                    </div>

                    {/* setas */}
                    {max > 1 && (
                      <>
                        <button
                          aria-label="Anterior"
                          onClick={prev}
                          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white transition"
                        >
                          <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
                        </button>
                        <button
                          aria-label="Próxima"
                          onClick={next}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white transition"
                        >
                          <ChevronRightIcon className="h-6 w-6 text-gray-800" />
                        </button>
                      </>
                    )}

                    {/* dots */}
                    {max > 1 && (
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                        {imgs.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setIdx(i)}
                            className={`h-2.5 w-2.5 rounded-full transition ${
                              i === idx ? 'bg-gray-900 scale-110' : 'bg-gray-400'
                            }`}
                            aria-label={`Ir para imagem ${i + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-500">
                    [Carrossel do DB (0 imagens)]
                  </div>
                )}
              </div>

              {/* Detalhes */}
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Resumo</p>
                  <p className="text-gray-800">
                    {data.resumo || '[Resumo do pacote do DB]'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Preço</p>
                    <p className="font-semibold text-gray-900">
                      {data.preco || '[Preço do DB]'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Dias</p>
                    <p className="font-semibold text-gray-900">
                      {data.dias ?? '[Qtd dias DB]'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Ida</p>
                    <p className="font-semibold text-gray-900">
                      {data.dataIda ? new Date(data.dataIda).toLocaleDateString() : '[Data ida DB]'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Volta</p>
                    <p className="font-semibold text-gray-900">
                      {data.dataVolta ? new Date(data.dataVolta).toLocaleDateString() : '[Data volta DB]'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Evento / Observações</p>
                  <p className="text-gray-800">
                    {data.evento || '[Informações de evento do DB]'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Sobre o lugar</p>
                  <p className="text-gray-800">
                    {data.descricao || '[Texto sobre o destino (DB)]'}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    className="w-full rounded-full px-6 py-3 text-white font-semibold
                               bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-[length:200%_200%]
                               shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-500 animate-gradient-x"
                  >
                    [CTA Reservar (DB)]
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
