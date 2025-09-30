'use client';

import { useEffect, useState } from 'react';

export function useCanManagePackages() {
  const [canManage, setCanManage] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch('/api/auth/me', {
          cache: 'no-store',
          credentials: 'include',
        });
        if (!response.ok) return;
        const data = await response.json();
        const roles: string[] = data?.user?.roles ?? [];
        if (!active) return;
        setCanManage(roles.includes('admin') || roles.includes('superadmin'));
      } catch (error) {
        console.error('Erro ao verificar permissões do usuário', error);
        if (active) setCanManage(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return canManage;
}

export default useCanManagePackages;
