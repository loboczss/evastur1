'use client';

import { useEffect, useState } from 'react';

type Permission = {
  id: number;
  key: string;
  description: string | null;
};

type RolePermission = {
  permission: Permission;
};

type Role = {
  id: number;
  name: string;
  description: string | null;
  permissions: RolePermission[];
};

export default function RoleManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [form, setForm] = useState({ name: '', description: '', permissionIds: [] as number[] });

  // Carregar papéis e permissões
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [roleRes, permRes] = await Promise.all([
          fetch('/api/admin/roles'),
          fetch('/api/admin/permissions'),
        ]);
        if (!roleRes.ok || !permRes.ok) throw new Error('Falha ao carregar dados');
        const [roleData, permData] = (await Promise.all([
          roleRes.json(),
          permRes.json(),
        ])) as [Role[], Permission[]];
        if (active) {
          setRoles(roleData);
          setPermissions(permData);
        }
      } catch (error) {
        console.error(error);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const togglePermission = (id: number) => {
    setForm((prev) => {
      const exists = prev.permissionIds.includes(id);
      return {
        ...prev,
        permissionIds: exists
          ? prev.permissionIds.filter((p) => p !== id)
          : [...prev.permissionIds, id],
      };
    });
  };

  // Criar papel
  const createRole = async () => {
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await res.json();
      if (!res.ok) {
        console.error(payload);
        return;
      }
      const newRole = payload as Role;
      setRoles((prev) => [...prev, newRole]);
      setForm({ name: '', description: '', permissionIds: [] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gerenciar Papéis</h2>

      {/* Form */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Nome do Papel"
          className="border rounded px-3 py-2 w-full"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descrição"
          className="border rounded px-3 py-2 w-full"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Seleção de permissões */}
        <div className="flex flex-wrap gap-2">
          {permissions.map((perm) => (
            <label key={perm.id} className="flex items-center space-x-1 border px-2 py-1 rounded">
              <input
                type="checkbox"
                checked={form.permissionIds.includes(perm.id)}
                onChange={() => togglePermission(perm.id)}
              />
              <span>{perm.key}</span>
            </label>
          ))}
        </div>

        <button
          onClick={createRole}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Adicionar Papel
        </button>
      </div>

      {/* Lista */}
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2">Nome</th>
            <th className="px-3 py-2">Descrição</th>
            <th className="px-3 py-2">Permissões</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="px-3 py-2">{r.name}</td>
              <td className="px-3 py-2">{r.description ?? '-'}</td>
              <td className="px-3 py-2">
                {r.permissions.map((p) => p.permission.key).join(', ') || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
