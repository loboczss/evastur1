'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);

  // foco inicial
  useEffect(() => {
    const id = setTimeout(() => emailRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, []);

  const emailOk = /\S+@\S+\.\S+/.test(email);
  const canSubmit = emailOk && password.length >= 4 && !busy;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok) {
        setErr(data?.error ?? 'Falha no login');
        setBusy(false);
        return;
      }

      // dispara atualização global da sessão
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-change'));
      }

      const roles: string[] = data?.roles ?? [];
      const destination = roles.includes('admin') || roles.includes('superadmin') ? '/admin' : '/';
      router.push(destination);
      router.refresh();
    } catch (e) {
      setErr('Não foi possível conectar. Tente novamente.');
      setBusy(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // envia ao apertar Enter no campo senha
      onSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <main className="relative min-h-screen pt-safe-header bg-white">
      {/* Camada visual de fundo (sutil, sem atrapalhar) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-95"
        style={{
          background:
            'radial-gradient(1200px 600px at 8% -8%, #eef2ff 0%, transparent 55%), radial-gradient(900px 500px at 108% -18%, #ffe4e6 0%, transparent 55%)',
        }}
      />

      {/* Barra de progresso fina quando busy */}
      <motion.div
        aria-hidden
        className="sticky top-[var(--header-h,0px)] z-30 h-0.5 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: busy ? 1 : 0 }}
        transition={busy ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.25 }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Conteúdo central */}
      <div className="relative z-10 grid min-h-[calc(100vh-var(--header-h,0px))] place-items-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          className="w-full max-w-md rounded-2xl bg-white/90 p-6 shadow-xl ring-1 ring-black/5 backdrop-blur"
        >
          {/* Logo + título */}
          <div className="mb-6 flex flex-col items-center text-center">
            <motion.div whileHover={{ scale: 1.04 }}>
              <Image
                src="/evastur-logo.png"
                alt="Evastur"
                width={96}
                height={96}
                priority
                className="drop-shadow-sm"
              />
            </motion.div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900">Entrar</h1>
            <p className="mt-1 text-sm text-gray-600">Bem-vindo de volta. Acesse sua conta para continuar.</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="grid gap-4">
            {/* Email */}
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700">Email</span>
              <div className="relative">
                <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  ref={emailRef}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  className={`w-full rounded-lg border bg-white px-10 py-2 text-sm shadow-sm outline-none transition
                    ${email && !emailOk ? 'border-rose-300 focus:ring-2 focus:ring-rose-300' : 'border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300'}
                  `}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </label>

            {/* Senha */}
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700">Senha</span>
              <div className="relative">
                <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 bg-white px-10 py-2 pr-11 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={onKeyDown}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-600 hover:bg-gray-100"
                  aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPass ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-gray-500">Mínimo 4 caracteres.</span>
                <a href="/forgot" className="font-medium text-indigo-600 hover:underline">
                  Esqueci minha senha
                </a>
              </div>
            </label>

            {/* Erro */}
            <AnimatePresence>
              {err && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"
                  role="alert"
                >
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  {err}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Botão */}
            <button
              disabled={!canSubmit}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
            >
              {busy ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
                  </svg>
                  Entrando…
                </>
              ) : (
                'Entrar'
              )}
            </button>

            {/* Links auxiliares */}
            <p className="mt-1 text-center text-sm text-gray-600">
              Não tem conta?{' '}
              <a href="/register" className="font-semibold text-indigo-600 hover:underline">
                Cadastre-se
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
