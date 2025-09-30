'use client';

import { useEffect, useState } from 'react';

type Lead = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  destination?: string;
  notes?: string;
  createdAt: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    notes: '',
  });

  async function load() {
    setLoading(true);
    const res = await fetch('/api/leads', { cache: 'no-store' });
    const data = await res.json();
    setLeads(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      destination: form.destination.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setForm({ name: '', email: '', phone: '', destination: '', notes: '' });
      await load();
    } else {
      const err = await res.json();
      alert('Erro: ' + (err?.error ?? ''));
    }
  }

  async function onDelete(id: number) {
    if (!confirm('Excluir este lead?')) return;
    const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    if (res.ok) await load();
  }

  return (
    <main className="min-h-dvh p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Leads (Orçamentos)</h1>

      <form onSubmit={onSubmit} className="grid gap-3 p-4 rounded-xl border">
        <div className="grid gap-1">
          <label className="text-sm">Nome *</label>
          <input
            className="border rounded px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm">Email *</label>
          <input
            type="email"
            className="border rounded px-3 py-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm">Telefone</label>
          <input
            className="border rounded px-3 py-2"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm">Destino</label>
          <input
            className="border rounded px-3 py-2"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm">Observações</label>
          <textarea
            className="border rounded px-3 py-2"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="mt-2 bg-black text-white rounded px-4 py-2 hover:opacity-90"
        >
          Salvar
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Lista</h2>
        {loading ? (
          <p>Carregando…</p>
        ) : leads.length === 0 ? (
          <p>Nenhum lead ainda.</p>
        ) : (
          <ul className="grid gap-2">
            {leads.map((l) => (
              <li key={l.id} className="border rounded p-3 flex items-start justify-between">
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-sm text-gray-600">{l.email}{l.phone ? ` • ${l.phone}` : ''}</div>
                  <div className="text-sm">{l.destination}</div>
                  {l.notes && <div className="text-sm italic">{l.notes}</div>}
                  <div className="text-xs text-gray-500">
                    {new Date(l.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => onDelete(l.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
