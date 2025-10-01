'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEditMode } from '@/hooks/useEditMode';

type CurrentUser = { id: number; name: string; email: string; roles: string[] } | null;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<CurrentUser>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const isMountedRef = useRef(true);
  const { isEditing, enableEdit, disableEdit } = useEditMode();
  const router = useRouter();

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // shrink + sombra ao rolar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    setLoadingMe(true);
    try {
      const r = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' });
      const data = await r.json();
      if (!isMountedRef.current) return;
      setUser(data?.user ?? null);
    } catch {
      if (!isMountedRef.current) return;
      setUser(null);
    } finally {
      if (!isMountedRef.current) return;
      setLoadingMe(false);
    }
  }, []);

  // checa sessão atual
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    const onAuthChange = () => {
      fetchCurrentUser();
    };

    window.addEventListener('auth-change', onAuthChange);
    return () => {
      window.removeEventListener('auth-change', onAuthChange);
    };
  }, [fetchCurrentUser]);

  const isAdmin = useMemo(
    () => !!user?.roles?.some((r) => r === 'admin' || r === 'superadmin'),
    [user]
  );
  const isSuperAdmin = useMemo(() => !!user?.roles?.some((r) => r === 'superadmin'), [user]);

  const handleEditButtonClick = () => {
    if (!isSuperAdmin) return;
    if (isEditing) {
      disableEdit();
    } else {
      enableEdit();
    }
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setUser(null);
    setMenuOpen(false);
    router.push('/');
    router.refresh();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'));
    }
  };

  const navLeft = [
    { name: 'Home', href: '/' },
    { name: 'Pacotes', href: '/pacotes' },
  ];
  const navRight = [{ name: 'Sobre Nós', href: '/sobre' }];

  const linkCls =
    'relative group inline-flex items-center gap-1 text-gray-700 hover:text-black transition-colors';
  const underline =
    'pointer-events-none absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-500 group-hover:w-full';

  return (
    <motion.nav
      initial={false}
      animate={{
        height: scrolled ? 64 : 80,
        backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'rgb(255,255,255)',
        boxShadow: scrolled ? '0 8px 24px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
      className="fixed top-0 left-0 z-50 w-full backdrop-blur-md"
      role="navigation"
      aria-label="Principal"
    >
      {/* linha sutil no topo ao rolar */}
      <motion.div
        className="h-[2px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0 }}
        style={{ transformOrigin: 'left' }}
      />
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Esquerda */}
        <div className="hidden items-center gap-8 text-lg font-medium md:flex">
          {navLeft.map((item, i) => (
            <motion.div key={item.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link href={item.href} className={linkCls}>
                <span>{item.name}</span>
                <span className={underline} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Logo central com micro animação */}
        <Link href="/" className="flex items-center" aria-label="Ir para a página inicial">
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            <Image
              src="/evastur-logo.png"
              alt="Logo Evastur"
              width={scrolled ? 70 : 90}
              height={scrolled ? 70 : 90}
              className="drop-shadow-md"
              priority
            />
          </motion.div>
        </Link>

        {/* Direita + CTAs */}
        <div className="hidden items-center gap-8 text-lg font-medium md:flex">
          {navRight.map((item, i) => (
            <motion.div key={item.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link href={item.href} className={linkCls}>
                <span>{item.name}</span>
                <span className={underline} />
              </Link>
            </motion.div>
          ))}

          {!loadingMe && isSuperAdmin && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <button
                type="button"
                onClick={handleEditButtonClick}
                className={`rounded-full px-5 py-2 font-semibold shadow-md transition-all focus:outline-none focus:ring-2 ${
                  isEditing
                    ? 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300'
                    : 'text-gray-800 bg-white border border-gray-200 hover:shadow-lg focus:ring-gray-300'
                }`}
                aria-pressed={isEditing}
              >
                {isEditing ? 'Sair do modo de edição' : 'Editar Página'}
              </button>
            </motion.div>
          )}

          {/* Admin visível só para admin/superadmin */}
          {!loadingMe && isAdmin && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-full px-5 py-2 font-semibold text-white shadow-md transition-all duration-500 hover:scale-[1.03] hover:shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-[length:200%_200%] animate-gradient-x focus:outline-none focus:ring-2 focus:ring-indigo-300"
                aria-label="Área administrativa"
              >
                <span>Admin</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9.4V7.5a4.5 4.5 0 10-9 0v1.9M4.5 10.5h15v9a1.5 1.5 0 01-1.5 1.5h-12A1.5 1.5 0 014.5 19.5v-9z" /></svg>
              </Link>
            </motion.div>
          )}

          {/* Se NÃO logado → Login */}
          {!loadingMe && !user && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Link
                href="/login"
                className="rounded-full px-5 py-2 font-semibold text-white shadow-md transition-all duration-500 hover:scale-[1.03] hover:shadow-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-[length:200%_200%] animate-gradient-x focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                Login
              </Link>
            </motion.div>
          )}

          {/* Se logado → Sair */}
          {!loadingMe && user && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
              <button
                onClick={handleLogout}
                className="rounded-full px-5 py-2 font-semibold text-gray-800 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Sair"
              >
                Sair
              </button>
            </motion.div>
          )}
        </div>

        {/* Botão Mobile */}
        <button
          className="md:hidden rounded-full p-2 text-2xl text-gray-800 transition-transform hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Menu Mobile (slide + fade) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="md:hidden"
          >
            <div className="mx-3 mb-3 rounded-2xl bg-white/95 p-6 shadow-xl ring-1 ring-black/5">
              <div className="flex flex-col gap-4 text-lg font-medium text-gray-800">
                {[...navLeft, ...navRight].map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-md px-3 py-2 hover:bg-gray-100"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Editar página (apenas superadmin) */}
                {!loadingMe && isSuperAdmin && (
                  <button
                    type="button"
                    onClick={handleEditButtonClick}
                    className={`rounded-full px-4 py-2 text-center font-semibold shadow-md transition-all ${
                      isEditing
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-white text-gray-800 border border-gray-200 hover:shadow-lg'
                    }`}
                    aria-pressed={isEditing}
                  >
                    {isEditing ? 'Sair do modo de edição' : 'Editar Página'}
                  </button>
                )}

                {/* Admin no mobile (apenas admin/superadmin) */}
                {!loadingMe && isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full px-4 py-2 text-center font-semibold text-white shadow-md transition-all hover:shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-[length:200%_200%] animate-gradient-x"
                  >
                    Admin
                  </Link>
                )}

                {/* Login / Sair no mobile */}
                {!loadingMe && !user && (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full px-4 py-2 text-center font-semibold text-white shadow-md transition-all hover:shadow-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-[length:200%_200%] animate-gradient-x"
                  >
                    Login
                  </Link>
                )}
                {!loadingMe && user && (
                  <button
                    onClick={handleLogout}
                    className="rounded-full px-4 py-2 text-center font-semibold text-gray-800 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    Sair
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
