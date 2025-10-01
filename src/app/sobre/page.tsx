'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Users,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Globe2,
  Trophy,
  Waypoints,
  Star,
  Clock,
  ChevronRight,
  Award,
  Target,
  Zap,
} from 'lucide-react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1920&q=80',
];

export default function SobrePage() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 0.4], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);

  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setBgIndex((i) => (i + 1) % HERO_IMAGES.length), 6500);
    return () => clearInterval(id);
  }, []);

  const VALUES = useMemo(
    () => [
      {
        icon: HeartHandshake,
        title: 'Cuidado humano',
        text: 'Atendimento próximo, transparente e sem robozice. Gente que resolve.',
        color: 'from-rose-500 to-pink-500',
      },
      {
        icon: ShieldCheck,
        title: 'Confiança',
        text: 'Selecionamos parceiros sólidos e roteiros seguros para você viajar leve.',
        color: 'from-blue-500 to-cyan-500',
      },
      {
        icon: Sparkles,
        title: 'Personalização',
        text: 'Sua viagem do seu jeito: estilo, ritmo, orçamento e experiências.',
        color: 'from-purple-500 to-pink-500',
      },
      {
        icon: Award,
        title: 'Condições reais',
        text: 'Ofertas honestas, sem letrinha miúda. O combinado é o entregue.',
        color: 'from-orange-500 to-red-500',
      },
      {
        icon: Globe2,
        title: 'Alcance global',
        text: 'Rede de fornecedores no mundo inteiro para achar a melhor opção.',
        color: 'from-green-500 to-teal-500',
      },
      {
        icon: Trophy,
        title: 'Excelência',
        text: 'Obsessão por detalhe e uma régua alta de qualidade do início ao fim.',
        color: 'from-indigo-500 to-purple-500',
      },
    ],
    []
  );

  const STATS = [
    { icon: Users, label: 'Viajantes atendidos', value: '15.000+', color: 'from-blue-500 to-cyan-500' },
    { icon: Waypoints, label: 'Roteiros criados', value: '2.300+', color: 'from-purple-500 to-pink-500' },
    { icon: Star, label: 'Avaliação média', value: '4.9/5', color: 'from-yellow-500 to-orange-500' },
    { icon: Clock, label: 'Tempo de resposta', value: '< 5 min', color: 'from-green-500 to-teal-500' },
  ];

  const TIMELINE = [
    { year: '1998', title: 'Nasce a Evastur', text: 'Primeiros clientes, muita vontade e um propósito claro.' },
    { year: '2016', title: 'Rede global', text: 'Parcerias internacionais e curadoria mais robusta.' },
    { year: '2022', title: 'Expansão de serviços', text: 'Cruzeiros, experiências exclusivas e grupos.' },
    { year: 'Hoje', title: 'Próximo nível', text: 'Tecnologia + cuidado humano para escalar sem perder o toque.' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900">
      {/* HERO SECTION */}
      <section className="relative isolate w-full overflow-hidden min-h-[100svh] md:min-h-[850px]">
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
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <Target className="w-4 h-4 text-yellow-400" />
                    <span className="text-white text-sm font-medium">Nossa missão</span>
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1]"
                >
                  <span className="bg-gradient-to-r from-white via-white to-gray-200 bg-clip-text text-transparent">
                    Quem somos
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                    por trás das suas
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                    melhores memórias
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mt-6 text-xl md:text-2xl text-white/90 font-light leading-relaxed"
                >
                  A Evastur nasceu para transformar o &quot;um dia eu vou&quot; em &quot;quando é a próxima?&quot; — unindo curadoria humana, tecnologia e parceiros confiáveis.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="mt-8 flex flex-wrap gap-4"
                >
                  <a
                    href="#historia"
                    className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-gray-900 font-semibold overflow-hidden transition-all hover:scale-105"
                  >
                    <span className="relative z-10">Nossa história</span>
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                  </a>
                  <a
                    href="#valores"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 bg-white/5 text-white font-semibold backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/50"
                  >
                    Nossos valores
                  </a>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
                  <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
                    <div className="grid grid-cols-2 gap-4">
                      {STATS.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                            className="text-center p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                          >
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg mb-2`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
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

      {/* HISTÓRIA SECTION */}
      <section id="historia" className="py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              Nossa jornada
            </span>
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Nossa história
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-700 leading-relaxed">
                Começamos pequenos, com um objetivo grande: tirar viagens do papel com leveza, qualidade e um atendimento realmente humano. De lá pra cá, crescemos sem abrir mão do nosso jeitinho: ouvir, entender e cuidar.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Hoje conectamos viajantes a experiências no mundo todo: do bate-volta que vira história ao sabático que muda perspectivas. E seguimos movidos pelo que importa: ver você voltar sorrindo.
              </p>
            </motion.div>

            <div className="relative">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-8 pb-8 last:pb-0"
                >
                  <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 shadow-lg" />
                  {i !== TIMELINE.length - 1 && (
                    <div className="absolute left-[7px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-pink-200 to-purple-200" />
                  )}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-purple-900 text-sm font-bold mb-2">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALORES SECTION */}
      <section id="valores" className="py-24 bg-gradient-to-b from-gray-50 to-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-900 text-sm font-semibold mb-4">
              <ShieldCheck className="w-4 h-4" />
              O que nos move
            </span>
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Nossos valores
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group relative"
                >
                  <div className="relative h-full p-8 rounded-3xl bg-white border border-gray-200 shadow-lg overflow-hidden transition-all hover:shadow-2xl">
                    <div className={`absolute inset-0 bg-gradient-to-br ${v.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    
                    <div className={`relative inline-flex p-3 rounded-2xl bg-gradient-to-br ${v.color} shadow-lg mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{v.text}</p>
                    
                    <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${v.color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EQUIPE SECTION */}
      <section id="equipe" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Nossa equipe
            </h2>
            <p className="mt-4 text-xl text-gray-600">Especialistas apaixonados por criar experiências inesquecíveis</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <div className="relative h-full bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={`https://images.unsplash.com/photo-15${i}22480510-0a0666b70f7b?auto=format&fit=crop&w=1200&q=70`}
                      alt={`Membro ${i}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900">Nome {i}</h3>
                    <p className="text-gray-600 mt-1">Especialista em Viagens</p>
                    <div className="flex justify-center gap-1 mt-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}