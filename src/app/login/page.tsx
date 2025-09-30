'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    setBusy(false);
    if (!r.ok) { setErr(data?.error ?? 'Falha no login'); return; }
    // Decide o destino por papel
    const roles: string[] = data?.roles ?? [];
    router.push(roles.includes('admin') || roles.includes('superadmin') ? '/admin' : '/');
  };

  return (
    <main className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="mb-4 text-2xl font-extrabold">Entrar</h1>
        <div className="mb-3">
          <label className="block text-sm font-medium">Email</label>
          <input className="mt-1 w-full rounded border px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Senha</label>
          <input type="password" className="mt-1 w-full rounded border px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
        <button disabled={busy} className="w-full rounded-full bg-black px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-50">
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
        <p className="mt-3 text-center text-sm">
          Não tem conta? <a href="/register" className="text-indigo-600 hover:underline">Cadastre-se</a>
        </p>
      </form>
    </main>
  );
}
