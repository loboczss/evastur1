'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PackageDTO } from '@/types/package';

export function usePackages() {
  const [packages, setPackages] = useState<PackageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/packages', { cache: 'no-store' });
      if (!response.ok) throw new Error('Falha ao carregar pacotes');
      const data = (await response.json()) as PackageDTO[];
      setPackages(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar pacotes', err);
      setPackages([]);
      setError('Não foi possível carregar os pacotes no momento.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removeLocal = useCallback((id: string) => {
    setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
  }, []);

  return { packages, loading, error, reload: load, removeLocal };
}

export default usePackages;
