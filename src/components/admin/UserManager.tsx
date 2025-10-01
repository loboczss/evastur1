'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '@/hooks/useAdminUsers';
import {
  PlusCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

type FormState = { name: string; email: string; phone: string };

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '' });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const abortRef = useRef<AbortController | null>(null);

  // ----------------------------------
  // Fetch usuários (com cancelamento)
  // ----------------------------------
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch('/api/admin/users', { signal: controller.signal, cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao carregar usuários');
      const data = (await res.json()) as User[];
      setUsers(data);
    } catch (err: any) {
      if (err?.name !== 'AbortError') setError(err?.message || 'Erro ao carregar usuários');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    return () => abortRef.current?.abort();
  }, []);

  // ----------------------------------
  // Busca / filtro em memória
  // ----------------------------------
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFiltered(users);
      return;
    }
    setFiltered(
      users.filter((u) => {
        const r = u.roles?.map((x) => x.role?.name).join(', ') ?? '';
        return (
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          (u.phone ?? '').toLowerCase().includes(q) ||
          r.toLowerCase().includes(q)
        );
      })
    );
  }, [users, query]);

  // ----------------------------------
  // Validação leve do formulário
  // ----------------------------------
  const emailOk = /\S+@\S+\.\S+/.test(form.email);
  const nameOk = form.name.trim().length >= 2;
  const canSubmit = nameOk && emailOk && !creating;

  // ----------------------------------
  // Criar usuário (otimista)
  // ----------------------------------
  const createUser = async () => {
    if (!canSubmit) return;
    setCreating(true);
    setError(null);

    const payload = { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || undefined };

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Falha ao criar usuário');
      }
      const newUser = data as User;
      setUsers((prev) => [...prev, newUser]);
      setForm({ name: '', email: '', phone: '' });
    } catch (err: any) {
      setError(err?.message || 'Erro ao criar usuário');
    } finally {
      setCreating(false);
    }
  };

  // submit com Enter no último input
  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') createUser();
  };

  // ----------------------------------
  // UI
  // ----------------------------------
  return (
    <div className="pt-safe-header">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Usuários</h2>
          <p className="text-sm text-gray-600">Crie, pesquise e visualize os usuários da plataforma.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:shadow transition"
            title="Recarregar"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Recarregar
          </button>
        </div>
      </div>

      {/* Barra de busca + Form */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        {/* Busca */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Nome, email, telefone ou papel…"
              className="w-full rounded-lg border border-gray-200 bg-white px-10 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Form de criação */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Adicionar usuário</label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            <Field
              className="lg:col-span-2"
              icon={<UserCircleIcon className="h-5 w-5 text-gray-400" />}
              placeholder="Nome completo"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              autoComplete="name"
              error={!!form.name && !nameOk}
            />
            <Field
              className="lg:col-span-3"
              icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
              type="email"
              placeholder="email@exemplo.com"
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              autoComplete="email"
              error={!!form.email && !emailOk}
            />
            <Field
              className="lg:col-span-2"
              icon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
              type="tel"
              placeholder="(DDD) 9xxxx-xxxx"
              value={form.phone}
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              onKeyDown={onKeyPress}
              autoComplete="tel"
            />

            <div className="sm:col-span-2 lg:col-span-7 flex items-center justify-end">
              <button
                onClick={createUser}
                disabled={!canSubmit}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
              >
                <PlusCircleIcon className="h-5 w-5" />
                {creating ? 'Criando…' : 'Adicionar'}
              </button>
            </div>
          </div>
          {/* Ajuda/erro do form */}
          <AnimatePresence>
            {(!nameOk || !emailOk) && (form.name || form.email) && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-2 flex items-center gap-2 text-xs text-rose-600"
              >
                <ExclamationTriangleIcon className="h-4 w-4" />
                {(!nameOk && form.name) ? 'O nome deve ter pelo menos 2 caracteres.' : null}
                {!emailOk && form.email ? ' Informe um email válido.' : null}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Alert de erro de carregamento/criação */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Desktop: tabela */}
        <div className="hidden md:block max-h-[60vh] overflow-auto scrollbar-h">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur text-sm">
              <tr className="text-gray-600">
                <th className="px-4 py-2 font-semibold">Nome</th>
                <th className="px-4 py-2 font-semibold">Email</th>
                <th className="px-4 py-2 font-semibold">Telefone</th>
                <th className="px-4 py-2 font-semibold">Papéis</th>
              </tr>
            </thead>
            <tbody>
              {/* skeleton */}
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`sk-${i}`} className="border-t">
                    <td className="px-4 py-3">
                      <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-56 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}

              <AnimatePresence initial={false}>
                {!loading &&
                  filtered.map((u) => (
                    <motion.tr
                      key={u.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="border-t hover:bg-gray-50/70"
                    >
                      <td className="px-4 py-3">{u.name}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.phone ?? '-'}</td>
                      <td className="px-4 py-3">{u.roles?.map((r) => r.role?.name).join(', ') || '-'}</td>
                    </motion.tr>
                  ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile: cards empilhados */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`skm-${i}`} className="p-4">
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200 mb-2" />
                <div className="h-4 w-56 animate-pulse rounded bg-gray-200 mb-2" />
                <div className="h-4 w-28 animate-pulse rounded bg-gray-200 mb-2" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            ))}

          {!loading && filtered.length === 0 && (
            <div className="p-6 text-center text-gray-500">Nenhum usuário encontrado.</div>
          )}

          <AnimatePresence initial={false}>
            {!loading &&
              filtered.map((u) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-4"
                >
                  <div className="text-base font-semibold">{u.name}</div>
                  <div className="text-sm text-gray-600">{u.email}</div>
                  <div className="mt-1 text-sm text-gray-600">{u.phone ?? '-'}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {u.roles?.map((r) => r.role?.name).join(', ') || '-'}
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------
 * Campo reutilizável com ícone
 * ---------------------------------- */
function Field({
  className,
  icon,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  onKeyDown,
  error,
}: {
  className?: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: boolean;
}) {
  return (
    <div className={className}>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete={autoComplete}
          className={`w-full rounded-lg border bg-white px-10 py-2 text-sm shadow-sm outline-none transition
            ${error ? 'border-rose-300 focus:ring-2 focus:ring-rose-300' : 'border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300'}
          `}
          aria-invalid={!!error}
        />
      </div>
    </div>
  );
}
