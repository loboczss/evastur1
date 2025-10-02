'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  X,
  Image as ImageIcon,
  MapPin,
  Calendar,
  DollarSign,
  Type,
  Clock,
  FileText,
  Sparkles,
  Upload
} from 'lucide-react';

type FormState = {
  title: string;
  price: string;
  startDate: string;
  endDate: string;
  days: string;
  location: string;
  description: string;
  images: File[];
};

export default function AddPackageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: '',
    price: '',
    startDate: '',
    endDate: '',
    days: '',
    location: '',
    description: '',
    images: [],
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.classList.add('overflow-hidden');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('overflow-hidden');
    };
  }, [open, onClose]);

  const previews = useMemo(() => form.images.map((f) => URL.createObjectURL(f)), [form.images]);

  const onPickImages = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).slice(0, 5);
    setForm((f) => ({ ...f, images: list }));
  };

  const submit = async () => {
    if (!form.title.trim()) {
      alert('Informe o título do pacote.');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      if (form.price) fd.append('price', form.price.replace(',', '.'));
      if (form.startDate) fd.append('startDate', form.startDate);
      if (form.endDate) fd.append('endDate', form.endDate);
      if (form.days) fd.append('days', form.days);
      if (form.location) fd.append('location', form.location);
      if (form.description) fd.append('description', form.description);
      form.images.forEach((img, i) => fd.append(`images[${i}]`, img));

      const res = await fetch('/api/admin/packages', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Falha ao criar pacote');
      }
      onClose();
      location.reload();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro';
      alert(message || 'Erro');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          onMouseDown={(e) => { if (e.currentTarget === e.target) onClose(); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className="relative w-full max-w-4xl"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 rounded-3xl blur-2xl" />
                
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                  {/* Header com Gradient */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
                    
                    <div className="relative flex items-center justify-between px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-white">Novo Pacote</h3>
                          <p className="text-white/80 text-sm font-medium">Crie uma experiência inesquecível</p>
                        </div>
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                      >
                        <X className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-8">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Título */}
                      <div className="md:col-span-2">
                        <Field
                          label="Título do Pacote"
                          value={form.title}
                          onChange={(v) => setForm((f) => ({ ...f, title: v }))}
                          icon={<Type className="w-5 h-5 text-purple-500" />}
                          placeholder="Ex: Pacote Caribe Paradisíaco"
                          required
                        />
                      </div>

                      {/* Preço */}
                      <Field
                        label="Preço"
                        value={form.price}
                        onChange={(v) => setForm((f) => ({ ...f, price: v }))}
                        icon={<DollarSign className="w-5 h-5 text-green-500" />}
                        placeholder="R$ 5.000,00"
                      />

                      {/* Dias */}
                      <Field
                        label="Duração (dias)"
                        type="number"
                        value={form.days}
                        onChange={(v) => setForm((f) => ({ ...f, days: v }))}
                        icon={<Clock className="w-5 h-5 text-blue-500" />}
                        placeholder="7"
                      />

                      {/* Data Ida */}
                      <Field
                        label="Data de Ida"
                        type="date"
                        value={form.startDate}
                        onChange={(v) => setForm((f) => ({ ...f, startDate: v }))}
                        icon={<Calendar className="w-5 h-5 text-orange-500" />}
                      />

                      {/* Data Volta */}
                      <Field
                        label="Data de Volta"
                        type="date"
                        value={form.endDate}
                        onChange={(v) => setForm((f) => ({ ...f, endDate: v }))}
                        icon={<Calendar className="w-5 h-5 text-red-500" />}
                      />

                      {/* Local */}
                      <div className="md:col-span-2">
                        <Field
                          label="Destino"
                          value={form.location}
                          onChange={(v) => setForm((f) => ({ ...f, location: v }))}
                          icon={<MapPin className="w-5 h-5 text-pink-500" />}
                          placeholder="Cancún, México"
                        />
                      </div>

                      {/* Descrição */}
                      <div className="md:col-span-2">
                        <label className="block">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
                              <FileText className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="font-bold text-gray-900">Descrição</span>
                          </div>
                          <textarea
                            rows={4}
                            className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition-all focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            placeholder="Descreva os principais atrativos deste pacote..."
                          />
                        </label>
                      </div>

                      {/* Upload de Imagens */}
                      <div className="md:col-span-2">
                        <label className="block">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
                              <ImageIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-bold text-gray-900">Imagens</span>
                            <span className="text-sm text-gray-500">(até 5 fotos)</span>
                          </div>
                          
                          <div className="relative group">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => onPickImages(e.target.files)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gradient-to-br from-gray-50 to-white transition-all group-hover:border-purple-400 group-hover:bg-purple-50/50">
                              <div className="flex flex-col items-center gap-3 text-center">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 group-hover:scale-110 transition-transform">
                                  <Upload className="w-8 h-8 text-purple-600" />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 mb-1">Clique para fazer upload</p>
                                  <p className="text-sm text-gray-500">PNG, JPG ou WEBP até 10MB</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {previews.length > 0 && (
                            <div className="grid grid-cols-5 gap-3 mt-4">
                              {previews.map((src, i) => (
                                <div
                                  key={i}
                                  className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-md hover:shadow-xl transition-all hover:scale-105"
                                >
                                  <Image
                                    src={src}
                                    alt={`Pré-visualização ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 20vw, 160px"
                                    unoptimized
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-900">
                                    {i + 1}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-3 bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-t border-gray-100">
                    <button
                      onClick={onClose}
                      className="px-6 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={submit}
                      disabled={saving}
                      className="group relative px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg overflow-hidden transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {saving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Criar Pacote
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  icon,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 mb-3">
        {icon && <div className="p-1.5 rounded-lg bg-gray-50">{icon}</div>}
        <span className="font-bold text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </div>
      <input
        type={type}
        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition-all focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}