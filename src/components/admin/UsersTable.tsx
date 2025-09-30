'use client';

import { memo, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Role, User } from '@/hooks/useAdminUsers';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  FaceFrownIcon,
} from '@heroicons/react/24/outline';
import UserEditModal from './UserEditModal';
import CreateUserModal from './CreateUserModal';

/* =========================================
   UsersTable – visual novo, profissional
   ========================================= */

export default function UsersTable({
  users,
  roles,
  loading,
  busyId,
  query,
  setQuery,
  userRoleName,
  onChangeRole,
  onDelete,
  onUpdate,
  onReload,
  onCreate,
}: {
  users: User[];
  roles: Role[];
  loading: boolean;
  busyId: number | null;
  query: string;
  setQuery: (v: string) => void;
  userRoleName: (u: User) => Role['name'];
  onChangeRole: (u: User, roleName: Role['name']) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, payload: Partial<User> & { password?: string }) => Promise<User>;
  onReload: () => Promise<void>;
  onCreate: (payload: { name: string; email: string; phone?: string; roleName?: Role['name'] }) => Promise<User>;
}) {
  const [editing, setEditing] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // para não recalcular ao digitar
  const visibleUsers = useMemo(() => users, [users]);

  return (
    <>
      {/* TOPBAR */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Usuários</h1>
          <p className="text-gray-600">Gerencie permissões, edite e exclua contas.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Buscar por nome, email ou telefone…"
              className="w-[300px] rounded-full border border-gray-200 bg-white/80 px-10 py-2 shadow-sm outline-none backdrop-blur-md focus:ring-2 focus:ring-indigo-300"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar usuários"
            />
          </div>

          <button
            onClick={onReload}
            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 font-semibold text-gray-800 shadow-sm backdrop-blur transition hover:shadow-md"
            title="Recarregar"
            aria-label="Recarregar lista"
          >
            <ArrowPathIcon className="h-5 w-5 transition group-hover:-rotate-180" />
            Recarregar
          </button>

          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2 font-semibold text-white shadow transition hover:brightness-110"
            title="Adicionar usuário"
            aria-label="Adicionar usuário"
          >
            <PlusIcon className="h-5 w-5" />
            Adicionar
          </button>
        </div>
      </div>

      {/* CARD + SCROLL HORIZONTAL */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl bg-white/85 shadow-xl ring-1 ring-gray-200 backdrop-blur"
        >
          {/* scroller horizontal (aplique estilos bonitos à classe .scrollbar-h no globals.css) */}
          <div className="overflow-x-auto scrollbar-h">
            {/* largura mínima para forçar a barra quando necessário */}
            <div className="min-w-[1120px]">
              {/* HEADER sticky dentro do scroller */}
              <div className="grid grid-cols-[1.4fr_1.2fr_0.7fr_0.9fr_0.9fr] items-center border-b bg-gradient-to-r from-white to-gray-50 px-5 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap sticky top-0">
                <div>Usuário</div>
                <div>Email</div>
                <div>Telefone</div>
                <div>Permissão</div>
                <div className="text-right pr-2">Ações</div>
              </div>

              {/* BODY */}
              <AnimatePresence initial={false}>
                {loading ? (
                  <SkeletonRows />
                ) : visibleUsers.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 px-8 py-16 text-gray-500"
                  >
                    <FaceFrownIcon className="h-6 w-6" />
                    Nenhum usuário encontrado.
                  </motion.div>
                ) : (
                  visibleUsers.map((u, i) => (
                    <Row
                      key={u.id}
                      i={i}
                      u={u}
                      roles={roles}
                      busy={busyId === u.id}
                      currentRole={userRoleName(u)}
                      onDoubleClick={() => setEditing(u)}
                      onChangeRole={(role) => onChangeRole(u, role)}
                      onEdit={() => setEditing(u)}
                      onDelete={() => onDelete(u.id)}
                    />
                  ))
                )}
              </AnimatePresence>

              {/* espaçador para não colar na barra */}
              <div className="h-1" />
            </div>
          </div>
        </motion.div>

        {/* brilho conic sutil na borda */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="pointer-events-none absolute -inset-px rounded-2xl [background:conic-gradient(from_180deg_at_50%_50%,#a78bfa33,#f472b633,#22d3ee33,#a78bfa33)]"
          style={{ mask: 'linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)', WebkitMask: 'linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)' }}
        />
      </div>

      {/* MODAL EDITAR */}
      <UserEditModal
        open={!!editing}
        user={editing}
        saving={saving}
        onClose={() => setEditing(null)}
        onSave={async (payload) => {
          if (!editing) return;
          setSaving(true);
          try {
            const updated = await onUpdate(editing.id, payload);
            setEditing(updated);
            setEditing(null);
          } finally {
            setSaving(false);
          }
        }}
      />

      {/* MODAL CRIAR */}
      <CreateUserModal
        open={createOpen}
        roles={roles}
        creating={creating}
        onClose={() => setCreateOpen(false)}
        onCreate={async (payload) => {
          setCreating(true);
          try {
            await onCreate(payload);
            setCreateOpen(false);
          } finally {
            setCreating(false);
          }
        }}
      />
    </>
  );
}

/* =====================
   Row – linha da tabela
   ===================== */

const Row = memo(function Row({
  u,
  i,
  roles,
  currentRole,
  busy,
  onDoubleClick,
  onChangeRole,
  onEdit,
  onDelete,
}: {
  u: User;
  i: number;
  roles: Role[];
  currentRole: Role['name'];
  busy: boolean;
  onDoubleClick: () => void;
  onChangeRole: (roleName: Role['name']) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const showRole = ['comum', 'admin', 'superadmin'].filter((r) => roles.some((x) => x.name === r));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.035 }}
      whileHover={{ backgroundColor: 'rgba(249,250,251,0.8)' }}
      onDoubleClick={onDoubleClick}
      className="grid grid-cols-[1.4fr_1.2fr_0.7fr_0.9fr_0.9fr] items-center border-t px-5 py-4"
    >
      {/* Usuário */}
      <div className="flex min-w-0 items-start gap-3">
        <motion.div
          whileHover={{ scale: 1.05, rotate: 1 }}
          className="mt-0.5 grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow"
          aria-hidden
        >
          {u.name.split(' ').slice(0, 2).map((s) => s[0]?.toUpperCase()).join('') || 'U'}
        </motion.div>
        <div className="min-w-0 pr-2">
          <div className="break-words font-semibold leading-snug text-gray-900">{u.name}</div>
          <div className="mt-0.5 text-xs">
            {u.isActive ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">Ativo</span>
            ) : (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">Inativo</span>
            )}
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="min-w-0 pr-2">
        <div className="truncate text-gray-800" title={u.email}>{u.email}</div>
      </div>

      {/* Telefone */}
      <div className="min-w-0 pr-2">
        <div className="truncate text-gray-800" title={u.phone || '-'}>{u.phone || '-'}</div>
      </div>

      {/* Permissão */}
      <div>
        <div className="relative">
          <select
            disabled={busy || roles.length === 0}
            className="w-full cursor-pointer rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed"
            value={currentRole}
            onChange={(e) => onChangeRole(e.target.value as Role['name'])}
            aria-label={`Alterar permissão de ${u.name}`}
          >
            {showRole.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <span className="pointer-events-none absolute -inset-0.5 -z-10 rounded-full opacity-0 blur-md transition group-hover:opacity-40 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30" />
        </div>
      </div>

      {/* Ações – largura fixa para não cortar */}
      <div className="ml-auto flex min-w-[230px] items-center justify-end gap-2 pr-2">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-900 shadow-sm transition hover:shadow-md"
          aria-label={`Editar ${u.name}`}
        >
          <PencilSquareIcon className="h-5 w-5" />
          Editar
        </button>
        <button
          onClick={onDelete}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700 shadow-sm transition hover:bg-red-100 disabled:opacity-50"
          aria-label={`Excluir ${u.name}`}
        >
          <TrashIcon className="h-5 w-5" />
          Excluir
        </button>
      </div>
    </motion.div>
  );
});

/* =====================
   Skeleton de carregamento
   ===================== */

function SkeletonRows() {
  const rows = new Array(6).fill(0);
  return (
    <div className="divide-y">
      {rows.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="grid grid-cols-[1.4fr_1.2fr_0.7fr_0.9fr_0.9fr] items-center px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-4 w-56 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-44 animate-pulse rounded-full bg-gray-200" />
          <div className="ml-auto flex gap-2">
            <div className="h-8 w-16 animate-pulse rounded-full bg-gray-200" />
            <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
