'use client';

import { useEffect, useMemo, useState } from 'react';

export type Role = { id: number; name: 'comum' | 'admin' | 'superadmin' | string };
export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  roles: { role: Role }[];
  createdAt?: string;
};

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    const [u, r] = await Promise.all([
      fetch('/api/admin/users', { cache: 'no-store' }).then((x) => x.json()),
      fetch('/api/admin/roles', { cache: 'no-store' }).then((x) => x.json()),
    ]);
    setUsers(u);
    setRoles(r.map((x: any) => ({ id: x.id, name: x.name })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const roleByName = (name: Role['name']) => roles.find((r) => r.name === name);
  const userRoleName = (u: User) => {
    const names = u.roles?.map((rr) => rr.role.name) ?? [];
    if (names.includes('superadmin')) return 'superadmin';
    if (names.includes('admin')) return 'admin';
    if (names.includes('comum')) return 'comum';
    return names[0] || 'comum';
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone || '').toLowerCase().includes(q)
    );
  }, [users, query]);

  const changeRole = async (u: User, newRoleName: Role['name']) => {
    const role = roleByName(newRoleName);
    if (!role) return;
    setBusyId(u.id);
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleIds: [role.id] }),
    });
    setBusyId(null);
    if (res.ok) {
      const updated = await res.json();
      setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
    }
  };

  const removeUser = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    setBusyId(null);
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const updateUser = async (id: number, payload: Partial<User> & { password?: string }) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers((prev) => prev.map((x) => (x.id === id ? updated : x)));
      return updated as User;
    }
    throw new Error('Falha ao salvar');
  };

  const createUser = async (payload: { name: string; email: string; phone?: string; roleName?: Role['name'] }) => {
    const roleId = payload.roleName ? roleByName(payload.roleName)?.id : undefined;
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        roleIds: roleId ? [roleId] : undefined,
      }),
    });
    if (!res.ok) throw new Error('Falha ao criar usuário');
    const created = await res.json();
    setUsers((prev) => [...prev, created]);
    return created as User;
  };

  return {
    users,
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
    reload: load,
  };
}
