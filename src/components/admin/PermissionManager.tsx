'use client';

import { useEffect, useState } from 'react';

export default function PermissionManager() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [form, setForm] = useState({ key: '', description: '' });

  // Carregar permissões
  useEffect(() => {
    fetch('/api/admin/permissions')
      .then((res) => res.json())
      .then(setPermissions)
      .catch(console.error);
  }, []);

  // Criar permissão
  const createPermission = async () => {
    const res = await fetch('/api/admin/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const newPerm = await res.json();
    setPermissions((prev) => [...prev, newPerm]);
    setForm({ key: '', description: '' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gerenciar Permissões</h2>

      {/* Form */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Key (ex: users.read)"
          className="border rounded px-3 py-2 w-full"
          value={form.key}
          onChange={(e) => setForm({ ...form, key: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descrição"
          className="border rounded px-3 py-2 w-full"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button
          onClick={createPermission}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Adicionar Permissão
        </button>
      </div>

      {/* Lista */}
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2">Key</th>
            <th className="px-3 py-2">Descrição</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-3 py-2">{p.key}</td>
              <td className="px-3 py-2">{p.description ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
