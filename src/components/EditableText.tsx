'use client';

import { memo, useEffect, useMemo, useRef, useState, type ElementType, type Ref } from 'react';
import { usePathname } from 'next/navigation';
import { useEditMode } from '@/hooks/useEditMode';

type Props = {
  id: string;
  defaultContent: string;
  as?: ElementType;
  className?: string;
};

const contentCache = new Map<string, string>();

function EditableTextBase({ id, defaultContent, as: component = 'span', className }: Props) {
  const pathname = usePathname();
  const { registerEditable, unregisterEditable } = useEditMode();
  const [content, setContent] = useState(defaultContent);
  const ref = useRef<HTMLElement | null>(null);
  const registryKey = useMemo(() => `${pathname}::${id}`, [pathname, id]);

  useEffect(() => {
    contentCache.set(registryKey, content);
  }, [content, registryKey]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    registerEditable(registryKey, {
      element: node,
      path: pathname,
      editableId: id,
      setContent: (value: string) => {
        setContent(value);
        contentCache.set(registryKey, value);
      },
    });
    return () => {
      unregisterEditable(registryKey);
    };
  }, [id, pathname, registerEditable, unregisterEditable, registryKey]);

  useEffect(() => {
    let active = true;
    const cached = contentCache.get(registryKey);
    if (cached !== undefined) {
      setContent(cached);
      return () => {
        active = false;
      };
    }

    (async () => {
      try {
        const res = await fetch(
          `/api/content?path=${encodeURIComponent(pathname)}&key=${encodeURIComponent(id)}`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error('Falha ao carregar conteúdo');
        const data = await res.json();
        if (!active) return;
        const value = typeof data?.content === 'string' && data.content !== null ? data.content : defaultContent;
        setContent(value);
        contentCache.set(registryKey, value);
      } catch {
        if (!active) return;
        setContent(defaultContent);
        contentCache.set(registryKey, defaultContent);
      }
    })();

    return () => {
      active = false;
    };
  }, [defaultContent, id, pathname, registryKey]);

  const ComponentTag = component as ElementType;

  return (
    <ComponentTag
      ref={ref as unknown as Ref<HTMLElement>}
      className={className}
      data-editable-id={id}
      data-editable-path={pathname}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default memo(EditableTextBase);
