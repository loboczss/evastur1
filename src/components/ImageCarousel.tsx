'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Slide = {
  id: string;
  // Substituir por src, alt vindos do banco
  placeholderLabel: string;
};

const AUTOPLAY_MS = 3500;

export default function ImageCarousel() {
  const [index, setIndex] = useState(0);
  const slides: Slide[] = [
    { id: '1', placeholderLabel: '[Banner 1 do Banco]' },
    { id: '2', placeholderLabel: '[Banner 2 do Banco]' },
    { id: '3', placeholderLabel: '[Banner 3 do Banco]' },
  ];

  const timer = useRef<number | null>(null);

  useEffect(() => {
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [slides.length]);

  return (
    <section className="max-w-6xl mx-auto px-6 pb-8">
      <div className="relative aspect-[16/6] w-full overflow-hidden rounded-2xl bg-gray-200">
        {slides.map((s, i) => (
          <motion.div
            key={s.id}
            className="absolute inset-0 flex items-center justify-center text-gray-600 text-xl"
            initial={false}
            animate={{ x: (i - index) * 100 + '%' }}
            transition={{ type: 'spring', stiffness: 90, damping: 18 }}
          >
            {/* Trocar por <Image src=... /> vindo do banco */}
            {s.placeholderLabel}
          </motion.div>
        ))}

        {/* Pontinhos */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i === index ? 'bg-gray-800 scale-110' : 'bg-gray-400'
              }`}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
