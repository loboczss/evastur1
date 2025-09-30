'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import AddPackageModal from './AddPackageModal';
import { useCanManagePackages } from '@/hooks/useCanManagePackages';

export default function AddPackageButton() {
  const canAdd = useCanManagePackages();
  const [open, setOpen] = useState(false);

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
