'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Plane, Hotel, Ship, MapPin, Sparkles, TicketPercent, Clock, Star, Users, Shield, ChevronRight } from 'lucide-react';
import { usePackages } from '@/hooks/usePackages';
import type { PackageDTO } from '@/types/package';

const HeroSearch = dynamic(() => import('@/components/HeroSearch'), { ssr: false });

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1920&q=80',
];

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 0.4], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);

  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setBgIndex((i) => (i + 1) % HERO_IMAGES.length), 6500);
    return () => clearInterval(id);
  }, []);

  const BENEFITS = useMemo(
    () => [
      { icon: Plane, title: 'Passagens aéreas', text: 'Rotas e tarifas excelentes, sem labirinto.', color: 'from-blue-500 to-cyan-500' },
      { icon: Hotel, title: 'Hotéis & resorts', text: 'Curadoria real, localização e avaliações de verdade.', color: 'from-purple-500 to-pink-500' },
      { icon: Ship, title: 'Cruzeiros', text: 'Entretenimento completo e roteiros inesquecíveis.', color: 'from-orange-500 to-red-500' },
      { icon: MapPin, title: 'Passeios & experiências', text: 'Viva o destino além do cartão-postal.', color: 'from-green-500 to-teal-500' },
      { icon: TicketPercent, title: 'Ofertas legítimas', text: 'Condições transparentes e sem pegadinhas.', color: 'from-indigo-500 to-purple-500' },
      { icon: Sparkles, title: 'Sob medida', text: 'Roteiros do seu jeito, do início ao fim.', color: 'from-pink-500 to-rose-500' },
    ],
    []
  );

  const { packages: pacotes, loading, error } = usePackages();
  const preview: PackageDTO[] = useMemo(() => (pacotes || []).slice(0, 6), [pacotes]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900">
      {/* HERO SECTION - Ultra Modern */}
      <section
        id="topo"
        className="relative isolate w-full overflow-hidden min-h-[100svh] md:min-h-[850px]"
      >
        {/* Animated Background with Enhanced Effects */}
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

          {/* Animated Gradient Overlay */}
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

        {/* Glass Morphism Overlay */}
        <div className="absolute inset-0 z-0 backdrop-blur-[2px] bg-gradient-to-b from-transparent via-transparent to-white" />

        {/* Content Container */}
        <div className="relative z-10 flex h-full items-center pt-20">
          <div className="max-w-7xl mx-auto px-6 w-full py-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-white text-sm font-medium">A melhor agência de viagens do Brasil</span>
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1]"
                >
                  <span className="bg-gradient-to-r from-white via-white to-gray-200 bg-clip-text text-transparent">
                    Transforme sonhos
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                    em aventuras
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mt-6 text-xl md:text-2xl text-white/90 font-light leading-relaxed"
                >
                  Passagens, cruzeiros, hotéis e experiências únicas. Deixe cada detalhe com a gente.
                </motion.p>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mt-10 flex gap-8"
                >
                  <div>
                    <p className="text-3xl font-bold text-white">15K+</p>
                    <p className="text-sm text-white/80">Clientes felizes</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">50+</p>
                    <p className="text-sm text-white/80">Destinos</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">4.9★</p>
                    <p className="text-sm text-white/80">Avaliação</p>
                  </div>
                </motion.div>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="mt-8 flex flex-wrap gap-4"
                >
                  <a
                    href="#buscar"
                    className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-gray-900 font-semibold overflow-hidden transition-all hover:scale-105"
                  >
                    <span className="relative z-10">Começar agora</span>
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                  </a>
                  <a
                    href="#beneficios"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 bg-white/5 text-white font-semibold backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/50"
                  >
                    Saiba mais
                  </a>
                </motion.div>
              </div>

              {/* Search Card with Glass Effect */}
              <motion.div
                id="buscar"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:justify-self-end w-full"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
                  <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                    <HeroSearch />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
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

      {/* BENEFITS SECTION - Card Based Design */}
      <section id="beneficios" className="relative py-24 scroll-mt-[var(--header-h)]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 text-sm font-semibold mb-4">
              <Shield className="w-4 h-4" />
              Garantia de qualidade
            </span>
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Por que escolher a Evastur?
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Somos especialistas em transformar viagens em experiências inesquecíveis
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group relative"
                >
                  <div className="relative h-full p-8 rounded-3xl bg-white border border-gray-200 shadow-lg overflow-hidden transition-all hover:shadow-2xl">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${b.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    
                    {/* Icon with Gradient */}
                    <div className={`relative inline-flex p-3 rounded-2xl bg-gradient-to-br ${b.color} shadow-lg mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{b.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{b.text}</p>
                    
                    {/* Decorative Element */}
                    <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${b.color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PACKAGES SECTION - Premium Cards */}
      <section id="pacotes" className="py-24 bg-gradient-to-b from-gray-50 to-white scroll-mt-[var(--header-h)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Destinos em destaque
              </h2>
              <p className="mt-2 text-gray-600">Oportunidades imperdíveis selecionadas para você</p>
            </motion.div>
            <Link
              href="/pacotes"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              Ver todos
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

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

          {!loading && !error && preview.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Ship className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Nenhum pacote disponível no momento.</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {preview.map((p, i) => {
              const capa = p.imagens?.[0];
              return (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative"
                >
                  <Link href={`/pacotes/${p.id}`}>
                    <div className="relative h-full bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                      {/* Image Container */}
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
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg">
                          <p className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {p.preco || 'Consulte'}
                          </p>
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-sm font-semibold flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {p.dias ? `${p.dias} dias` : 'A definir'}
                        </div>
                      </div>

                      {/* Content */}
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

                        {/* Rating */}
                        <div className="flex items-center gap-4">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">4.9 (238 avaliações)</span>
                        </div>

                        {/* Hover CTA */}
                        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                            Ver detalhes
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA - Modern Gradient Design */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500" />
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              backgroundImage: [
                'radial-gradient(circle at 20% 50%, white 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, white 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, white 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
              <Users className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Junte-se a mais de 15.000 viajantes</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-white">
              Sua próxima aventura
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                começa aqui
              </span>
            </h2>

            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Do orçamento ao check-in, cuidamos de cada detalhe. Você só precisa escolher o destino dos seus sonhos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                href="/pacotes"
                className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-gray-900 font-bold text-lg shadow-2xl transition-all hover:scale-105"
              >
                <span>Explorar pacotes</span>
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </Link>
              
              <a
                href="#contato"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl border-2 border-white/50 bg-white/10 backdrop-blur-md text-white font-bold text-lg transition-all hover:bg-white/20 hover:border-white"
              >
                <span>Falar com consultor</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center items-center gap-8 pt-12">
              <div className="flex items-center gap-2 text-white/80">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Pagamento seguro</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Star className="w-5 h-5" />
                <span className="text-sm font-medium">Melhor preço garantido</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Suporte 24/7</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}