'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Role } from '@/hooks/useAdminUsers';
import { XMarkIcon, UserPlusIcon, UserCircleIcon, EnvelopeIcon, PhoneIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function CreateUserModal({
  open,
  roles,
  onClose,
  onCreate,
  creating = false,
}: {
  open: boolean;
  roles: Role[];
  onClose: () => void;
  onCreate: (payload: { name: string; email: string; phone?: string; roleName?: Role['name'] }) => Promise<void>;
  creating?: boolean;
}) {
  const [form, setForm] = useState<{ name: string; email: string; phone?: string; roleName?: Role['name'] }>({
    name: '',
    email: '',
    phone: '',
    roleName: roles.find(r => r.name === 'comum') ? 'comum' : roles[0]?.name,
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: '',
        email: '',
        phone: '',
        roleName: roles.find(r => r.name === 'comum') ? 'comum' : roles[0]?.name,
      });
      document.body.classList.add('overflow-hidden');
      return () => document.body.classList.remove('overflow-hidden');
    }
  }, [open, roles]);

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
            className="fixed left-1/2 top-1/2 w-[95vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <UserPlusIcon className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Adicionar usuário</h3>
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

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Permissão inicial</span>
                <div className="relative">
                  <ShieldCheckIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <select
                    className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-10 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-300"
                    value={form.roleName}
                    onChange={(e) => setForm((f) => ({ ...f, roleName: e.target.value as Role['name'] }))}
                  >
                    {['comum', 'admin', 'superadmin']
                      .filter(n => roles.some(r => r.name === n))
                      .map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </label>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 bg-gray-50 px-5 py-3">
              <button onClick={onClose} className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200/60">
                Cancelar
              </button>
              <button
                onClick={() => onCreate(form)}
                disabled={creating}
                className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow hover:brightness-110 disabled:opacity-50"
              >
                {creating ? 'Criando…' : 'Criar usuário'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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
