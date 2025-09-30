'use client';

import { useEffect, useState } from 'react';

export default function UserManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  // Carregar usuários
  useEffect(() => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error(err));
  }, []);

  // Criar usuário
  const createUser = async () => {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const newUser = await res.json();
    setUsers((prev) => [...prev, newUser]);
    setForm({ name: '', email: '', phone: '' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gerenciar Usuários</h2>

      {/* Formulário */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Nome"
          className="border rounded px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border rounded px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Telefone"
          className="border rounded px-3 py-2"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button
          onClick={createUser}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Adicionar
        </button>
      </div>

      {/* Lista */}
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2">Nome</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Telefone</th>
            <th className="px-3 py-2">Papéis</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="px-3 py-2">{u.name}</td>
              <td className="px-3 py-2">{u.email}</td>
              <td className="px-3 py-2">{u.phone ?? '-'}</td>
              <td className="px-3 py-2">
                {u.roles.map((r: any) => r.role.name).join(', ') || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
