import { useState } from 'react';
import { MapPin, Calendar, Users, Search, Plane } from 'lucide-react';

export default function HeroSearch() {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [dataIda, setDataIda] = useState('');
  const [dataVolta, setDataVolta] = useState('');
  const [passageiros, setPassageiros] = useState(2);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log({ origem, destino, dataIda, dataVolta, passageiros });
  };

  return (
    <div className="w-full p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-gray-900">Planeje sua viagem</h3>
            <p className="text-sm text-gray-600 mt-1">Encontre as melhores ofertas para seu destino</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
            <Plane className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="grid gap-4">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Origem
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                placeholder="De onde você sai?"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none font-medium"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Destino
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-600 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Para onde vai?"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ida
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <input
                  type="date"
                  value={dataIda}
                  onChange={(e) => setDataIda(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Volta
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <input
                  type="date"
                  value={dataVolta}
                  onChange={(e) => setDataVolta(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium"
                />
              </div>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Passageiros
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <select
                value={passageiros}
                onChange={(e) => setPassageiros(Number(e.target.value))}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-medium appearance-none cursor-pointer"
              >
                <option value={1}>1 pessoa</option>
                <option value={2}>2 pessoas</option>
                <option value={3}>3 pessoas</option>
                <option value={4}>4 pessoas</option>
                <option value={5}>5+ pessoas</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="group relative w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-lg shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <Search className="w-6 h-6" />
            Buscar pacotes
          </span>
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>

        <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Cancelamento grátis</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Melhor preço garantido</span>
          </div>
        </div>
      </div>
    </div>
  );
}