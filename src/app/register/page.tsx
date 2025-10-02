'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const id = setTimeout(() => nameRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, []);

  const emailOk = /\S+@\S+\.\S+/.test(email);
  const nameOk = name.trim().length >= 2;
  const passOk = password.length >= 4;
  const canSubmit = nameOk && emailOk && passOk && !busy;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email, password }),
      });
      const data = await r.json();
      setBusy(false);
      if (!r.ok) {
        setErr(data?.error ?? 'Falha no cadastro');
        return;
      }
      // encaminha para login após cadastro
      router.push('/login');
      router.refresh();
    } catch {
      setErr('Não foi possível concluir o cadastro. Tente novamente.');
      setBusy(false);
    }
  };

  return (
    <main className="relative min-h-screen pt-safe-header bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Background decorativo: mesmo da LoginPage */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      {/* Barra de progresso quando busy */}
      <motion.div
        aria-hidden
        className="sticky top-[var(--header-h,0px)] z-30 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 origin-left shadow-lg"
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
          className="w-full max-w-md"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-3xl blur-2xl" />

            {/* Card principal */}
            <div className="relative rounded-3xl bg-white/95 p-8 shadow-2xl border border-white/50 backdrop-blur-xl">
              {/* Logo + título */}
              <div className="mb-8 flex flex-col items-center text-center">
                <motion.div whileHover={{ scale: 1.04 }}>
                  <Image
                    src="/evastur-logo.png"
                    alt="Evastur"
                    width={96}
                    height={96}
                    priority
                    className="drop-shadow-lg"
                  />
                </motion.div>
                <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900">Criar conta</h1>
                <p className="mt-2 text-sm text-gray-700">
                  Preencha seus dados para começar a usar.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="grid gap-5">
                {/* Nome */}
                <label className="block text-sm">
                  <span className="mb-2 block font-semibold text-gray-800">Nome</span>
                  <div className="relative group">
                    <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                    <input
                      ref={nameRef}
                      type="text"
                      autoComplete="name"
                      placeholder="Seu nome completo"
                      className={`w-full rounded-2xl border-2 bg-white px-12 py-4 text-base font-semibold text-gray-900 placeholder:text-gray-500 placeholder:opacity-100 caret-purple-600 shadow-sm outline-none transition-all
                        ${name && !nameOk ? 'border-red-300 focus:ring-4 focus:ring-red-300/10 focus:border-red-500' : 'border-gray-200 focus:ring-4 focus:ring-purple-300/10 focus:border-purple-500'}
                      `}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </label>

                {/* Email */}
                <label className="block text-sm">
                  <span className="mb-2 block font-semibold text-gray-800">Email</span>
                  <div className="relative group">
                    <EnvelopeIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="voce@exemplo.com"
                      className={`w-full rounded-2xl border-2 bg-white px-12 py-4 text-base font-semibold text-gray-900 placeholder:text-gray-500 placeholder:opacity-100 caret-purple-600 shadow-sm outline-none transition-all
                        ${email && !emailOk ? 'border-red-300 focus:ring-4 focus:ring-red-300/10 focus:border-red-500' : 'border-gray-200 focus:ring-4 focus:ring-purple-300/10 focus:border-purple-500'}
                      `}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </label>

                {/* Senha */}
                <label className="block text-sm">
                  <span className="mb-2 block font-semibold text-gray-800">Senha</span>
                  <div className="relative group">
                    <LockClosedIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="w-full rounded-2xl border-2 border-gray-200 bg-white px-12 py-4 pr-12 text-base font-semibold text-gray-900 placeholder:text-gray-500 placeholder:opacity-100 caret-purple-600 shadow-sm outline-none transition-all focus:ring-4 focus:ring-purple-300/10 focus:border-purple-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPass ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-600">Mínimo 4 caracteres.</span>
                    <a href="/login" className="font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                      Já tem conta? Entrar
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
                      className="flex items-center gap-2 rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                      role="alert"
                    >
                      <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                      {err}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Botão */}
                <button
                  disabled={!canSubmit}
                  className="group relative inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 px-5 py-4 text-base font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-purple-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-[0.98] overflow-hidden"
                >
                  <span className="relative z-10">
                    {busy ? 'Cadastrando…' : 'Criar conta'}
                  </span>
                  {!busy && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  )}
                </button>

                {/* Link auxiliar */}
                <p className="mt-2 text-center text-sm text-gray-700">
                  Já tem conta?{' '}
                  <a
                    href="/login"
                    className="font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Entrar
                  </a>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
