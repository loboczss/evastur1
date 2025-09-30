'use client';

import { motion } from 'framer-motion';
import UsersTable from '@/components/admin/UsersTable';
import { useAdminUsers } from '@/hooks/useAdminUsers';

export default function AdminPage() {
  const {
    users, roles, loading, busyId,
    query, setQuery, filtered,
    userRoleName, changeRole, removeUser, updateUser, createUser, reload
  } = useAdminUsers();

  return (
    <main className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#eef2ff_0%,transparent_50%),radial-gradient(900px_500px_at_110%_-20%,#ffe4e6_0%,transparent_50%)] pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-7xl px-6"
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
