'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import EditableText from '@/components/EditableText';

type Slide = {
  id: string;
  defaultContent: string;
};

const AUTOPLAY_MS = 5000;

export default function ImageCarousel() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  
  const slides: Slide[] = [
    { id: 'home.carousel.banner1', defaultContent: '[Banner 1 do Banco]' },
    { id: 'home.carousel.banner2', defaultContent: '[Banner 2 do Banco]' },
    { id: 'home.carousel.banner3', defaultContent: '[Banner 3 do Banco]' },
  ];

  const timer = useRef<number | null>(null);

  const goToSlide = (newIndex: number) => {
    setDirection(newIndex > index ? 1 : -1);
    setIndex(newIndex);
  };

  const goNext = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % slides.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      timer.current = window.setInterval(goNext, AUTOPLAY_MS);
    }
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [isPlaying, index, slides.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="relative group">
        {/* Container do Carrossel */}
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl">
          {/* Slides com AnimatePresence */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Gradiente de fundo animado */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20" />
              
              {/* Conteúdo do Slide */}
              <div className="relative z-10 text-center px-8">
                <EditableText
                  as="div"
                  id={slides[index].id}
                  defaultContent={slides[index].defaultContent}
                  className="text-3xl md:text-5xl font-black text-gray-700"
                />
              </div>

              {/* Efeito de brilho sutil */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlay escuro nas bordas */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/5 via-transparent to-black/10" />

          {/* Botões de Navegação */}
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 backdrop-blur-md text-gray-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-white active:scale-95"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 backdrop-blur-md text-gray-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-white active:scale-95"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Botão Play/Pause */}
          <button
            onClick={togglePlayPause}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 active:scale-95"
            aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Indicadores (Dots) */}
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className="group/dot relative"
                aria-label={`Ir para slide ${i + 1}`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index
                      ? 'w-10 bg-white shadow-lg'
                      : 'w-2 bg-white/50 group-hover/dot:bg-white/70 group-hover/dot:scale-125'
                  }`}
                />
                {/* Progress bar para slide ativo */}
                {i === index && isPlaying && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Contador de Slides */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            {index + 1} / {slides.length}
          </div>
        </div>

        {/* Reflexo decorativo */}
        <div className="absolute -bottom-8 inset-x-0 h-8 bg-gradient-to-b from-gray-900/5 to-transparent rounded-b-3xl blur-xl" />
      </div>
    </section>
  );
}