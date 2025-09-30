'use client';

import { motion } from 'framer-motion';
import type { Role, User } from '@/hooks/useAdminUsers';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function UserRow({
  u, i, roles, currentRole, busy,
  onDoubleClick, onChangeRole, onEdit, onDelete,
}: {
  u: User; i: number; roles: Role[]; currentRole: Role['name']; busy: boolean;
  onDoubleClick: () => void; onChangeRole: (roleName: Role['name']) => void;
  onEdit: () => void; onDelete: () => void;
}) {
  const showRole = ['comum', 'admin', 'superadmin'].filter((r) => roles.some((x) => x.name === r));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.035 }}
      whileHover={{ backgroundColor: 'rgba(249,250,251,0.8)' }}
      onDoubleClick={onDoubleClick}
      className="group grid grid-cols-12 items-center border-t px-5 py-4"
    >
      {/* Usuário */}
      <div className="col-span-4 flex min-w-0 items-start gap-3">
        <motion.div
          whileHover={{ scale: 1.05, rotate: 1 }}
          className="mt-0.5 grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow"
        >
          {u.name.split(' ').slice(0, 2).map((s) => s[0]?.toUpperCase()).join('')}
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
      <div className="col-span-3 min-w-0 pr-2">
        <div className="truncate text-gray-800" title={u.email}>{u.email}</div>
      </div>

      {/* Telefone */}
      <div className="col-span-1 min-w-0 pr-2">
        <div className="truncate text-gray-800" title={u.phone || '-'}>{u.phone || '-'}</div>
      </div>

      {/* Permissão */}
      <div className="col-span-2">
        <div className="relative">
          <select
            disabled={busy || roles.length === 0}
            className="w-full cursor-pointer rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed"
            value={currentRole}
            onChange={(e) => onChangeRole(e.target.value as Role['name'])}
            title="Alterar permissão"
          >
            {showRole.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <span className="pointer-events-none absolute -inset-0.5 -z-10 rounded-full opacity-0 blur-md transition group-hover:opacity-40 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30" />
        </div>
      </div>

      {/* Ações */}
      <div className="col-span-2 ml-auto flex min-w-[220px] items-center justify-end gap-2 pr-2">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-900 shadow-sm transition hover:shadow-md"
          title="Editar"
        >
          <PencilSquareIcon className="h-5 w-5" />
          Editar
        </button>
        <button
          onClick={onDelete}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700 shadow-sm transition hover:bg-red-100 disabled:opacity-50"
          title="Excluir"
        >
          <TrashIcon className="h-5 w-5" />
          Excluir
        </button>
      </div>
    </motion.div>
  );
}
