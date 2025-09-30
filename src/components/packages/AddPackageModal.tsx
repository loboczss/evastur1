'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  PhotoIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

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
    const list = Array.from(files).slice(0, 5); // limita a 5
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

      const res = await fetch('/api/admin/packages', { method: 'POST', body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Falha ao criar pacote');
      }
      // sucesso
      onClose();
      // opcional: recarregar lista da página /pacotes (se ela usar SWR/ReactQuery, basta invalidar)
      // por enquanto, um refresh simples:
      location.reload();
    } catch (e: any) {
      alert(e.message || 'Erro');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          onMouseDown={(e) => { if (e.currentTarget === e.target) onClose(); }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            className="fixed left-1/2 top-1/2 w-[96vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <PencilSquareIcon className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Adicionar pacote</h3>
              </div>
              <button onClick={onClose} className="rounded-md p-1 hover:bg-white/10">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Body */}
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <Field label="Título" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />

              <Field
                label="Preço (opcional)"
                value={form.price}
                onChange={(v) => setForm((f) => ({ ...f, price: v }))}
                icon={<CurrencyDollarIcon className="h-5 w-5 text-gray-400" />}
              />

              <Field
                label="Data de ida (opcional)"
                type="date"
                value={form.startDate}
                onChange={(v) => setForm((f) => ({ ...f, startDate: v }))}
                icon={<CalendarDaysIcon className="h-5 w-5 text-gray-400" />}
              />

              <Field
                label="Data de volta (opcional)"
                type="date"
                value={form.endDate}
                onChange={(v) => setForm((f) => ({ ...f, endDate: v }))}
                icon={<CalendarDaysIcon className="h-5 w-5 text-gray-400" />}
              />

              <Field
                label="Dias (opcional)"
                type="number"
                value={form.days}
                onChange={(v) => setForm((f) => ({ ...f, days: v }))}
              />

              <Field
                label="Local (opcional)"
                value={form.location}
                onChange={(v) => setForm((f) => ({ ...f, location: v }))}
                icon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
              />

              <label className="md:col-span-2 block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Descrição (opcional)</span>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-300"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </label>

              {/* Imagens */}
              <label className="md:col-span-2 block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Imagens (até 5)</span>
                <div className="flex flex-col gap-3">
                  <div className="relative flex items-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => onPickImages(e.target.files)}
                      className="block w-full cursor-pointer rounded-lg border border-dashed border-gray-300 bg-white px-3 py-8 text-sm text-gray-600 file:hidden"
                    />
                    <PhotoIcon className="pointer-events-none absolute right-3 h-6 w-6 text-gray-400" />
                  </div>
                  {previews.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                      {previews.map((src, i) => (
                        <div key={i} className="overflow-hidden rounded-lg border bg-white shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`preview-${i}`} className="h-28 w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 bg-gray-50 px-5 py-3">
              <button onClick={onClose} className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200/60">
                Cancelar
              </button>
              <button
                onClick={submit}
                disabled={saving}
                className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow hover:brightness-110 disabled:opacity-50"
              >
                {saving ? 'Salvando…' : 'Salvar pacote'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label, value, onChange, type = 'text', icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
        <input
          type={type}
          className={`w-full rounded-lg border border-gray-200 bg-white ${icon ? 'pl-10' : 'px-3'} py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-300`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </label>
  );
}
