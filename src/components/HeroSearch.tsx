'use client';

import { useState } from 'react';
import {
  CalendarIcon,
  PhoneIcon,
  UserIcon,
  MapPinIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

type SearchForm = {
  origem: string;
  destino: string;
  ida: string;
  volta: string;
  nome: string;
  telefone: string;
};

export default function HeroSearch() {
  const [form, setForm] = useState<SearchForm>({
    origem: '',
    destino: '',
    ida: '',
    volta: '',
    nome: '',
    telefone: '',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar com /api/orcamentos ou /api/leads (Prisma)
    console.log('Form (placeholder):', form);
    alert('Form pronto pra integrar ao DB 😉');
  };

  const inputBase =
    'w-full h-12 rounded-lg border border-gray-300 bg-white/80 px-4 outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition text-sm';

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-16">
        {/* Título + subtítulo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
            [Título principal do banco]
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            [Descrição principal curta do banco]
          </p>
        </div>

        {/* GRID: mobile 1 col, tablet 2 cols, desktop 6 cols */}
        <form
          onSubmit={onSubmit}
          className="grid gap-4 rounded-2xl bg-white/90 backdrop-blur-md p-6 shadow-xl
                     grid-cols-1 sm:grid-cols-2 lg:grid-cols-6"
        >
          {/* Origem */}
          <div className="min-w-0">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Origem</label>
            <div className="relative">
              <MapPinIcon className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                placeholder="[Cidade de origem]"
                className={`${inputBase} pl-10`}
                value={form.origem}
                onChange={(e) => setForm({ ...form, origem: e.target.value })}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Destino */}
          <div className="min-w-0">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Destino</label>
            <div className="relative">
              <MapPinIcon className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                placeholder="[Cidade de destino]"
                className={`${inputBase} pl-10`}
                value={form.destino}
                onChange={(e) => setForm({ ...form, destino: e.target.value })}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Ida */}
          <div className="min-w-0">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Ida</label>
            <div className="relative">
              <CalendarIcon className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                className={`${inputBase} pl-10`}
                value={form.ida}
                onChange={(e) => setForm({ ...form, ida: e.target.value })}
              />
            </div>
          </div>

          {/* Volta */}
          <div className="min-w-0">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Volta</label>
            <div className="relative">
              <CalendarIcon className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                className={`${inputBase} pl-10`}
                value={form.volta}
                onChange={(e) => setForm({ ...form, volta: e.target.value })}
              />
            </div>
          </div>

          {/* Nome */}
          <div className="min-w-0">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Nome</label>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                placeholder="[Seu nome]"
                className={`${inputBase} pl-10`}
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Telefone */}
          <div className="min-w-0">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Telefone</label>
            <div className="relative">
              <PhoneIcon className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                inputMode="tel"
                placeholder="[DDD+Número]"
                className={`${inputBase} pl-10`}
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Botão – ocupa a linha inteira */}
          <div className="sm:col-span-2 lg:col-span-6 mt-2">
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 w-full rounded-full px-8 py-4 text-white text-lg font-semibold
                         bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-[length:200%_200%]
                         shadow-md hover:shadow-lg transition-all duration-500 hover:scale-[1.01] animate-gradient-x"
            >
              <PaperAirplaneIcon className="h-5 w-5 -rotate-45 transition-transform group-hover:-translate-y-0.5" />
              [Texto botão do banco]
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
