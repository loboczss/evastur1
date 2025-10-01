'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Role } from '@/hooks/useAdminUsers';
import {
  XMarkIcon,
  UserPlusIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

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
  const defaultRole = roles.find((r) => r.name === 'comum') ? 'comum' : roles[0]?.name;
  const [form, setForm] = useState<{ name: string; email: string; phone?: string; roleName?: Role['name'] }>({
    name: '',
    email: '',
    phone: '',
    roleName: defaultRole,
  });

  const panelRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  // Reabre limpo + trava o scroll da página
  useEffect(() => {
    if (!open) return;
    setForm({ name: '', email: '', phone: '', roleName: defaultRole });
    document.body.classList.add('overflow-hidden');
    // foco inicial no nome
    const id = setTimeout(() => nameInputRef.current?.focus(), 10);
    return () => {
      clearTimeout(id);
      document.body.classList.remove('overflow-hidden');
    };
  }, [open, defaultRole]);

  // Fecha com ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Validação simples
  const emailOk = /\S+@\S+\.\S+/.test(form.email);
  const canSubmit = form.name.trim().length > 1 && emailOk && !!form.roleName && !creating;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await onCreate(form);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onMouseDown={(e) => {
            // clique fora fecha
            if (e.currentTarget === e.target) onClose();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay limpo de admin (sem fotos) */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

          {/* Painel */}
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-user-title"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="
              relative w-[95vw] max-w-xl max-h-[85vh]
              overflow-hidden rounded-2xl bg-white
              shadow-2xl ring-1 ring-black/10
              flex flex-col
            "
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-slate-900 to-slate-700 px-5 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-white/15 p-1.5 ring-1 ring-white/20">
                    <UserPlusIcon className="h-5 w-5" />
                  </div>
                  <h3 id="create-user-title" className="text-lg font-semibold">
                    Adicionar usuário
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-md p-1.5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                  aria-label="Fechar"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Barra de progresso quando creating */}
              <motion.div
                className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: creating ? 1 : 0 }}
                transition={creating ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
                style={{ transformOrigin: 'left' }}
              />
            </div>

            {/* Body (scrollável) */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-4">
                <Field
                  icon={<UserCircleIcon className="h-5 w-5 text-gray-400" />}
                  label="Nome"
                  placeholder="Ex.: Maria Silva"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  inputRef={nameInputRef}
                  required
                />

                <Field
                  icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                  label="Email"
                  type="email"
                  placeholder="Ex.: maria@empresa.com"
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  required
                  error={form.email ? !emailOk : false}
                  helper={form.email && !emailOk ? 'Informe um email válido.' : undefined}
                />

                <Field
                  icon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
                  label="Telefone"
                  type="tel"
                  placeholder="(DDD) 9xxxx-xxxx"
                  value={form.phone ?? ''}
                  onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                />

                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-gray-700">Permissão inicial</span>
                  <div className="relative">
                    <ShieldCheckIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <select
                      className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-10 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                      value={form.roleName}
                      onChange={(e) => setForm((f) => ({ ...f, roleName: e.target.value as Role['name'] }))}
                    >
                      {['comum', 'admin', 'superadmin']
                        .filter((n) => roles.some((r) => r.name === n))
                        .map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                    </select>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer sticky */}
            <div className="flex items-center justify-end gap-2 bg-slate-50/80 px-5 py-3">
              <button
                onClick={onClose}
                className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200/60 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="
                  inline-flex items-center gap-2
                  rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow
                  hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-gray-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {creating && (
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
                  </svg>
                )}
                {creating ? 'Criando…' : 'Criar usuário'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ===========================
 * Campo reutilizável com animações suaves
 * =========================== */
function Field({
  icon,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  inputRef,
  required,
  error,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  required?: boolean;
  error?: boolean;
  helper?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
        <input
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-white px-10 py-2 text-sm shadow-sm outline-none transition
            ${error ? 'border-rose-300 focus:ring-2 focus:ring-rose-300' : 'border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300'}
          `}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={helper ? `${label}-helper` : undefined}
        />
      </div>
      <AnimatePresence>
        {helper && (
          <motion.p
            id={`${label}-helper`}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            className="mt-1 text-xs text-rose-600"
          >
            {helper}
          </motion.p>
        )}
      </AnimatePresence>
    </label>
  );
}
