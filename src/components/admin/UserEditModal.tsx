'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '@/hooks/useAdminUsers';
import { XMarkIcon, UserCircleIcon, EnvelopeIcon, PhoneIcon, CheckCircleIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function UserEditModal({
  open,
  user,
  onClose,
  onSave,
  saving = false,
}: {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (payload: { name: string; email: string; phone?: string; isActive: boolean; password?: string }) => Promise<void>;
  saving?: boolean;
}) {
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    isActive: user?.isActive ?? true,
    password: '',
  });
  const [canEditPassword, setCanEditPassword] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      isActive: user?.isActive ?? true,
      password: '',
    });
  }, [user]);

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

  // Quem está logado pode trocar senha?
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await r.json();
        const roles: string[] = data?.user?.roles ?? [];
        if (alive) setCanEditPassword(roles.includes('superadmin'));
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  const submit = async () => {
    const payload: any = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      isActive: form.isActive,
    };
    if (canEditPassword && form.password.trim()) payload.password = form.password.trim();
    await onSave(payload);
  };

  return (
    <AnimatePresence>
      {open && user && (
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
            className="fixed left-1/2 top-1/2 w-[95vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <UserCircleIcon className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Editar usuário</h3>
              </div>
              <button onClick={onClose} className="rounded-md p-1 hover:bg-white/10">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 p-6">
              <Field
                icon={<UserCircleIcon className="h-5 w-5 text-gray-400" />}
                label="Nome"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              />
              <Field
                icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              />
              <Field
                icon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
                label="Telefone"
                value={form.phone ?? ''}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              />

              <label className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                <span className="inline-flex items-center gap-1">
                  <CheckCircleIcon className="h-4 w-4 text-emerald-500" /> Usuário ativo
                </span>
              </label>

              {canEditPassword && (
                <div className="text-sm">
                  <span className="mb-1 block font-medium text-gray-700">Nova senha (apenas superadmin)</span>
                  <div className="relative">
                    <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Deixe em branco para não alterar"
                      className="w-full rounded-lg border border-gray-200 bg-white px-10 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-300"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-gray-200 bg-white p-1 shadow-sm"
                      title={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPwd ? <EyeSlashIcon className="h-5 w-5 text-gray-600" /> : <EyeIcon className="h-5 w-5 text-gray-600" />}
                    </button>
                  </div>
                </div>
              )}
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
                {saving ? 'Salvando…' : 'Salvar alterações'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Campo com ícone embutido */
function Field({
  icon, label, value, onChange, type = 'text',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
        <input
          type={type}
          className="w-full rounded-lg border border-gray-200 bg-white px-10 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-300"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </label>
  );
}
