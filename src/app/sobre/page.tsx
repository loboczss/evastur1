'use client';

import { useEffect, useState } from 'react';

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
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          {/* Título vindo do banco */}
          [Título do Banco]
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          {/* Subtítulo/descrição vindo do banco */}
          [Descrição curta do Banco]
        </p>
      </section>

      {/* Nossa História */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Nossa História</h2>
          <p className="text-gray-600 leading-relaxed">
            {/* Texto de história vindo do banco */}
            [Texto História do Banco]
          </p>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg">
          {/* Imagem do banco */}
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
            [Imagem do Banco]
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-white/80 backdrop-blur-sm py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Nossos Valores
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Loop com valores vindos do banco */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-8 text-center"
              >
                <div className="text-4xl mb-4">[Ícone {i}]</div>
                <h3 className="text-xl font-semibold mb-2">
                  [Título Valor {i}]
                </h3>
                <p className="text-gray-600">[Descrição Valor {i}]</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Nossa Equipe
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {/* Loop equipe vindo do banco */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                [Foto {i}]
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">[Nome {i}]</h3>
                <p className="text-gray-500 text-sm">[Cargo {i}]</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
