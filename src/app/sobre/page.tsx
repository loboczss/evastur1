'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Plane,
  Hotel,
  Ship,
  MapPin,
  Sparkles,
  TicketPercent,
  Users,
  HeartHandshake,
  ShieldCheck,
  Clock,
  Globe2,
  Trophy,
  Waypoints,
  Handshake,
  Star,
} from 'lucide-react';

/**
 * Hero: imagens “premium” (troque à vontade)
 */
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80', // praia turquesa
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80', // cidade noite
  'https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?auto=format&fit=crop&w=1920&q=80', // montanha neblina
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1920&q=80', // cruzeiro/porto
];

export default function SobrePage() {
  // Parallax + leve zoom (Ken Burns)
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 0.4], [0, -40]);

  // Cross-fade automático
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setBgIndex((i) => (i + 1) % HERO_IMAGES.length), 6500);
    return () => clearInterval(id);
  }, []);

  // Valores/Princípios
  const VALUES = useMemo(
    () => [
      {
        icon: HeartHandshake,
        title: 'Cuidado humano',
        text: 'Atendimento próximo, transparente e sem robozice. Gente que resolve.',
      },
      {
        icon: ShieldCheck,
        title: 'Confiança',
        text: 'Selecionamos parceiros sólidos e roteiros seguros para você viajar leve.',
      },
      {
        icon: Sparkles,
        title: 'Personalização',
        text: 'Sua viagem do seu jeito: estilo, ritmo, orçamento e experiências.',
      },
      {
        icon: TicketPercent,
        title: 'Condições reais',
        text: 'Ofertas honestas, sem letrinha miúda. O combinado é o entregue.',
      },
      {
        icon: Globe2,
        title: 'Alcance global',
        text: 'Rede de fornecedores no mundo inteiro para achar a melhor opção.',
      },
      {
        icon: Trophy,
        title: 'Excelência',
        text: 'Obssessão por detalhe e uma régua alta de qualidade do início ao fim.',
      },
    ],
    []
  );

  // Números de impacto (exemplo estático; adapte ao seu back)
  const STATS = [
    { icon: Users, label: 'Viajantes atendidos', value: '15.000+' },
    { icon: Waypoints, label: 'Roteiros criados', value: '2.300+' },
    { icon: Star, label: 'Avaliação média', value: '4.9/5' },
    { icon: Clock, label: 'Tempo médio de resposta', value: '< 5 min' },
  ];

  // Serviços (para mostrar amplitude: passagens, hotéis, cruzeiros…)
  const SERVICES = [
    { icon: Plane, title: 'Passagens aéreas', text: 'As melhores rotas e tarifas para cada perfil.' },
    { icon: Hotel, title: 'Hotéis & resorts', text: 'Localização estratégica e avaliações reais.' },
    { icon: Ship, title: 'Cruzeiros', text: 'Diversão completa em alto mar para todas as idades.' },
    { icon: MapPin, title: 'Passeios & experiências', text: 'Saia do óbvio e viva o destino de verdade.' },
    { icon: Handshake, title: 'Corporativo & grupos', text: 'Gestão ponta a ponta, com escala e controle.' },
    { icon: Sparkles, title: 'Viagens sob medida', text: 'Roteiros exclusivos desenhados para você.' },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* ===========================
          HERO sobre nós — cinematográfico
         =========================== */}
      <section className="relative h-[68vh] min-h-[560px] w-full overflow-hidden">
        {/* Camada das fotos (cross-fade + parallax + ken burns) */}
        <div className="absolute inset-0">
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={bgIndex}
              style={{ y: yHero, backgroundImage: `url("${HERO_IMAGES[bgIndex]}")` }}
              className="absolute inset-0 bg-center bg-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.25, ease: 'easeInOut' }}
            />
          </AnimatePresence>

          {/* brilho/partículas sutis */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0.22 }}
            animate={{ opacity: [0.22, 0.35, 0.22] }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{
              background:
                'radial-gradient(1200px 600px at 30% 20%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(1000px 600px at 70% 70%, rgba(255,255,255,0.12), transparent 60%)',
            }}
          />
        </div>

        {/* sobreposição escura + FADE somente na borda inferior */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-white" />

        {/* Conteúdo hero */}
        <div className="relative z-10 flex h-full items-center">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-2xl"
              >
                {/* Logo (se quiser, exiba aqui também) */}
                <div className="mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/evastur-logo.png"
                    alt="Evastur"
                    className="h-12 w-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
                  />
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow">
                  Quem somos por trás das suas melhores memórias.
                </h1>
                <p className="mt-3 text-lg md:text-xl text-white/95">
                  A Evastur nasceu para transformar o “um dia eu vou” em “quando é a próxima?” —
                  unindo curadoria humana, tecnologia e parceiros confiáveis.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href="#historia"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-gray-900 shadow hover:shadow-lg transition"
                  >
                    Nossa história
                  </a>
                  <a
                    href="#valores"
                    className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur hover:bg-white/20 transition"
                  >
                    Nossos valores
                  </a>
                </div>
              </motion.div>

              {/* “Cartão” de serviços em destaque */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-full"
              >
                <div className="relative isolate rounded-3xl border border-white/20 bg-white/15 p-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/20">
                  <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-white/40 via-white/10 to-white/0" />
                  <div className="grid grid-cols-2 gap-4">
                    {SERVICES.slice(0, 4).map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <motion.div
                          key={s.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.05 * i }}
                          className="rounded-2xl bg-white/90 p-4 shadow-sm backdrop-blur hover:shadow-md transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-gray-900 text-white p-2">
                              <Icon size={18} />
                            </div>
                            <p className="font-semibold text-gray-900">{s.title}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-sm text-white">
                    Tudo que você precisa para viajar melhor, em um só lugar.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================
          Nossa história (timeline)
         =========================== */}
      <section id="historia" className="max-w-6xl mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold tracking-tight text-center"
        >
          Nossa história
        </motion.h2>

        <div className="mt-10 grid lg:grid-cols-2 gap-10 items-start">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <p className="text-gray-600 leading-relaxed">
              Começamos pequenos, com um objetivo grande: tirar viagens do papel com leveza,
              qualidade e um atendimento realmente humano. De lá pra cá, crescemos sem abrir mão
              do nosso jeitinho: ouvir, entender e cuidar.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Hoje conectamos viajantes a experiências no mundo todo: do bate-volta que vira história
              ao sabático que muda perspectivas. E seguimos movidos pelo que importa: ver você voltar sorrindo.
            </p>
          </motion.div>

          {/* Linha do tempo com animação */}
          <motion.ol
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="relative border-s border-gray-200 space-y-8 ps-6"
          >
            {[
              { year: '1998', title: 'Nasce a Evastur', text: 'Primeiros clientes, muita vontade e um propósito claro.' },
              { year: '2016', title: 'Rede global', text: 'Parcerias internacionais e curadoria mais robusta.' },
              { year: '2022', title: 'Expansão de serviços', text: 'Cruzeiros, experiências exclusivas e grupos.' },
              { year: 'Hoje', title: 'Próximo nível', text: 'Tecnologia + cuidado humano para escalar sem perder o toque.' },
            ].map((t) => (
              <li key={t.title}>
                <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-pink-600" />
                <time className="mb-1 block text-sm font-semibold text-pink-700">{t.year}</time>
                <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
                <p className="text-gray-600">{t.text}</p>
              </li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ===========================
          Valores (muitos ícones)
         =========================== */}
      <section id="valores" className="bg-white/90 backdrop-blur-sm py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-center"
          >
            Nossos valores
          </motion.h2>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-gray-900 text-white p-2 shadow-sm">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-lg font-semibold">{v.title}</h3>
                    </div>
                    <p className="mt-3 text-gray-600">{v.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===========================
          Números de confiança
         =========================== */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold tracking-tight text-center"
        >
          Resultados que nos orgulham
        </motion.h2>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-2 w-10 h-10 rounded-lg bg-gray-900 text-white grid place-content-center">
                  <Icon size={20} />
                </div>
                <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===========================
          Equipe (cartões com animação)
         =========================== */}
      <section id="equipe" className="max-w-6xl mx-auto px-6 pb-18">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold tracking-tight text-center"
        >
          Nossa equipe
        </motion.h2>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45 }}
              className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100"
            >
              <div className="relative h-52 w-full overflow-hidden bg-gray-200">
                {/* imagens reais podem vir do seu back (p.imagem) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://images.unsplash.com/photo-15${i}22480510-0a0666b70f7b?auto=format&fit=crop&w=1200&q=70`}
                  alt="Membro da equipe"
                  className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-gray-900">Nome {i}</h3>
                <p className="text-sm text-gray-500">Especialista em Viagens</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
