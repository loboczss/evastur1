'use client';

import { motion } from 'framer-motion';
import UsersTable from '@/components/admin/UsersTable';
import { useAdminUsers } from '@/hooks/useAdminUsers';

export default function AdminPage() {
  const {
    roles,
    loading,
    busyId,
    query,
    setQuery,
    filtered,
    userRoleName,
    changeRole,
    removeUser,
    updateUser,
    createUser,
    reload,
  } = useAdminUsers();

  return (
    <main className="pt-safe-header relative min-h-screen bg-white">
      {/* Camada de gradiente por cima do branco */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-95"
        style={{
          background:
            'radial-gradient(1200px 600px at 8% -8%, #eef2ff 0%, transparent 55%), radial-gradient(900px 500px at 108% -18%, #ffe4e6 0%, transparent 55%)',
        }}
      />

      {/* Barra de progresso fina quando loading (fica acima do gradiente) */}
      <motion.div
        aria-hidden
        className="relative sticky top-[var(--header-h)] z-20 h-0.5 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: loading ? 1 : 0 }}
        transition={loading ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.25 }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Cabeçalho */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-4 md:pt-6">
        <motion.nav
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600"
          aria-label="breadcrumbs"
        >
          <span className="hover:text-gray-900">Administração</span>
          <span className="mx-1.5 text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Usuários</span>
        </motion.nav>

        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900"
        >
          Painel de Usuários
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mt-1 mb-5 text-gray-600"
        >
          Gerencie contas, permissões e mantenha a casa em ordem. Sem ruído, só produtividade.
        </motion.p>
      </header>

      {/* Conteúdo */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16"
      >
        <UsersTable
          users={filtered}
          roles={roles}
          loading={loading}
          busyId={busyId}
          query={query}
          setQuery={setQuery}
          userRoleName={userRoleName}
          onChangeRole={changeRole}
          onDelete={removeUser}
          onUpdate={updateUser}
          onCreate={createUser}
          onReload={reload}
        />
      </motion.div>
    </main>
  );
}
