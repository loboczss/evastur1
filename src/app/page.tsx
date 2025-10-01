'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import EditableText from '@/components/EditableText';

// Import dinâmico (evita SSR de framer-motion em alguns hosts)
const HeroSearch = dynamic(() => import('@/components/HeroSearch'), { ssr: false });
const ImageCarousel = dynamic(() => import('@/components/ImageCarousel'), { ssr: false });
const FeaturedPackages = dynamic(() => import('@/components/FeaturedPackages'), { ssr: false });

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO + Form estilo Skyscanner */}
      <HeroSearch />

      {/* Carrossel de imagens (banners) */}
      <ImageCarousel />

      {/* Principais Pacotes */}
      <FeaturedPackages />

      {/* CTA final */}
      <section className="bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <EditableText
              as="h2"
              id="home.final.title"
              defaultContent="[Título da chamada final (DB)]"
              className="text-3xl md:text-4xl font-extrabold"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <EditableText
              as="p"
              id="home.final.description"
              defaultContent="[Descrição curta da chamada final (DB)]"
              className="mt-3 text-gray-600 max-w-2xl mx-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8"
          >
            <Link
              href="/pacotes"
              className="inline-flex items-center rounded-full px-8 py-3 text-white font-semibold
              bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-[length:200%_200%]
              shadow-md hover:shadow-lg transition-all duration-500 hover:scale-[1.02] animate-gradient-x"
            >
              <EditableText
                as="span"
                id="home.final.cta"
                defaultContent="[CTA ver pacotes (DB)]"
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
