'use client';

import { useEffect, useState } from 'react';
import EditableText from '@/components/EditableText';

export default function SobrePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
      {/* Hero Section */}
      <section
        className={`max-w-5xl mx-auto px-6 py-20 text-center transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        <EditableText
          as="h1"
          id="about.hero.title"
          defaultContent="[Título do Banco]"
          className="text-4xl md:text-5xl font-extrabold mb-6"
        />
        <EditableText
          as="p"
          id="about.hero.subtitle"
          defaultContent="[Descrição curta do Banco]"
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
        />
      </section>

      {/* Nossa História */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <EditableText
            as="h2"
            id="about.history.title"
            defaultContent="Nossa História"
            className="text-2xl font-bold"
          />
          <EditableText
            as="p"
            id="about.history.content"
            defaultContent="[Texto História do Banco]"
            className="text-gray-600 leading-relaxed"
          />
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg">
          {/* Imagem do banco */}
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
            <EditableText
              as="span"
              id="about.history.image"
              defaultContent="[Imagem do Banco]"
            />
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-white/80 backdrop-blur-sm py-16">
        <div className="max-w-6xl mx-auto px-6">
          <EditableText
            as="h2"
            id="about.values.title"
            defaultContent="Nossos Valores"
            className="text-2xl md:text-3xl font-bold text-center mb-12"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {/* Loop com valores vindos do banco */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-8 text-center"
              >
                <EditableText
                  as="div"
                  id={`about.values.${i}.icon`}
                  defaultContent={`[Ícone ${i}]`}
                  className="text-4xl mb-4"
                />
                <EditableText
                  as="h3"
                  id={`about.values.${i}.title`}
                  defaultContent={`[Título Valor ${i}]`}
                  className="text-xl font-semibold mb-2"
                />
                <EditableText
                  as="p"
                  id={`about.values.${i}.description`}
                  defaultContent={`[Descrição Valor ${i}]`}
                  className="text-gray-600"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <EditableText
          as="h2"
          id="about.team.title"
          defaultContent="Nossa Equipe"
          className="text-2xl md:text-3xl font-bold text-center mb-12"
        />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {/* Loop equipe vindo do banco */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                <EditableText
                  as="span"
                  id={`about.team.${i}.photo`}
                  defaultContent={`[Foto ${i}]`}
                />
              </div>
              <div className="p-4 text-center">
                <EditableText
                  as="h3"
                  id={`about.team.${i}.name`}
                  defaultContent={`[Nome ${i}]`}
                  className="font-semibold text-lg"
                />
                <EditableText
                  as="p"
                  id={`about.team.${i}.role`}
                  defaultContent={`[Cargo ${i}]`}
                  className="text-gray-500 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
