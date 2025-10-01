'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Phone, User, MapPin, SendHorizonal, Plane } from 'lucide-react';

type SearchForm = {
  origem: string;
  destino: string;
  ida: string;
  volta: string;
  nome: string;
  telefone: string;
};

type TripType = 'round' | 'oneway';

export default function HeroSearch() {
  const [tripType, setTripType] = useState<TripType>('round');
  const [form, setForm] = useState<SearchForm>({
    origem: '',
    destino: '',
    ida: '',
    volta: '',
    nome: '',
    telefone: '',
  });

  const inputBase =
    'w-full h-12 rounded-xl border border-white/30 bg-white/85 px-4 outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition text-sm backdrop-blur';

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.origem || !form.destino || !form.ida || (tripType === 'round' && !form.volta)) {
      alert('Preencha origem, destino e data(s) para pesquisar.');
      return;
    }
    console.log({ tripType, ...form });
    alert('Busca pronta para integrar ao backend.');
  };

  const subtitle = useMemo(
    () => (tripType === 'round' ? 'Compare ida e volta instantaneamente.' : 'Encontre a melhor tarifa só de ida.'),
    [tripType]
  );

  return (
    <section className="relative">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="
          relative isolate w-full max-w-2xl
          rounded-3xl border border-white/20 bg-white/15 p-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/20
          /* margem pequena interna p/ não encostar no fade inferior do hero */
          mt-2
        "
      >
        {/* brilho sutil */}
        <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-white/40 via-white/10 to-white/0" />

        {/* Header */}
        <div className="relative mb-4">
          <div className="flex items-center gap-2 text-white/95">
            <div className="rounded-lg bg-white/20 p-2 ring-1 ring-white/30">
              <Plane size={18} />
            </div>
            <h3 className="text-lg font-bold drop-shadow">Busque suas passagens com a Evastur</h3>
          </div>
          <p className="mt-1 text-sm text-white/85">{subtitle}</p>
        </div>

        {/* Tipo de viagem */}
        <div className="relative mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTripType('round')}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              tripType === 'round' ? 'bg-white text-gray-900 shadow' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Ida e volta
          </button>
          <button
            type="button"
            onClick={() => setTripType('oneway')}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              tripType === 'oneway' ? 'bg-white text-gray-900 shadow' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Só ida
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-white/90">Origem</label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-700" />
              <input
                placeholder="Ex.: São Paulo (GRU)"
                className={`${inputBase} pl-10`}
                value={form.origem}
                onChange={(e) => setForm({ ...form, origem: e.target.value })}
                autoComplete="off"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-white/90">Destino</label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-700" />
              <input
                placeholder="Ex.: Fortaleza (FOR)"
                className={`${inputBase} pl-10`}
                value={form.destino}
                onChange={(e) => setForm({ ...form, destino: e.target.value })}
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-white/90">Ida</label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-700" />
              <input
                type="date"
                className={`${inputBase} pl-10`}
                value={form.ida}
                onChange={(e) => setForm({ ...form, ida: e.target.value })}
              />
            </div>
          </div>

          {tripType === 'round' && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-white/90">Volta</label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-700" />
                <input
                  type="date"
                  className={`${inputBase} pl-10`}
                  value={form.volta}
                  onChange={(e) => setForm({ ...form, volta: e.target.value })}
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-white/90">Nome</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-700" />
              <input
                placeholder="Como podemos te chamar?"
                className={`${inputBase} pl-10`}
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                autoComplete="name"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-white/90">Telefone</label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-700" />
              <input
                type="tel"
                inputMode="tel"
                placeholder="DDD + número"
                className={`${inputBase} pl-10`}
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                autoComplete="tel"
              />
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.985 }}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-white text-lg font-semibold
                     bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600
                     shadow-md hover:shadow-lg transition-all duration-300"
        >
          <SendHorizonal className="h-5 w-5 -rotate-12" />
          Buscar passagens agora
        </motion.button>

        <p className="mt-2 text-[11px] text-white/85">
          Sem taxas ocultas. Tarifas atualizadas com cias aéreas e parceiros.
        </p>
      </motion.form>
    </section>
  );
}
