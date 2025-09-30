'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import AddPackageModal from './AddPackageModal';

export default function AddPackageButton() {
  const [canAdd, setCanAdd] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/auth/me', {
          cache: 'no-store',
          credentials: 'include',
        });
        const data = await r.json();
        const roles: string[] = data?.user?.roles ?? [];
        setCanAdd(roles.includes('admin') || roles.includes('superadmin'));
      } catch {}
    })();
  }, []);

  if (!canAdd) return null;

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2 font-semibold text-white shadow transition hover:brightness-110"
        whileTap={{ scale: 0.98 }}
      >
        <PlusIcon className="h-5 w-5" />
        Adicionar pacotes
      </motion.button>

      <AddPackageModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
