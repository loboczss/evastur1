'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';

type RegisteredEditable = {
  element: HTMLElement;
  path: string;
  editableId: string;
  setContent: (value: string) => void;
};

export type EditModeContextValue = {
  isEditing: boolean;
  enableEdit: () => void;
  disableEdit: () => void;
  toggleEdit: () => void;
  registerEditable: (key: string, editable: RegisteredEditable) => void;
  unregisterEditable: (key: string) => void;
};

export const EditModeContext = createContext<EditModeContextValue | undefined>(undefined);

type Props = {
  children: ReactNode;
};

function isElementVisible(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

export default function EditModeProvider({ children }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const pathname = usePathname();
  const trackedElements = useRef(new Map<HTMLElement, string | null>());
  const registeredEditables = useRef(new Map<string, RegisteredEditable>());

  const enableEdit = useCallback(() => setIsEditing(true), []);
  const disableEdit = useCallback(() => setIsEditing(false), []);
  const toggleEdit = useCallback(() => setIsEditing((prev) => !prev), []);

  const enableEditingForElement = useCallback((element: HTMLElement) => {
    if (!isElementVisible(element)) return;
    if (element.dataset.inlineEditing === 'true') return;
    trackedElements.current.set(element, element.getAttribute('contenteditable'));
    element.setAttribute('contenteditable', 'true');
    element.dataset.inlineEditing = 'true';
    element.classList.add('inline-editing-element');
  }, []);

  const disableEditingForElement = useCallback((element: HTMLElement) => {
    if (!document.body.contains(element)) return;
    const previousValue = trackedElements.current.get(element) ?? element.getAttribute('contenteditable');
    if (previousValue === null || previousValue === '' || previousValue === undefined) {
      element.removeAttribute('contenteditable');
    } else {
      element.setAttribute('contenteditable', previousValue);
    }
    element.classList.remove('inline-editing-element');
    delete element.dataset.inlineEditing;
    trackedElements.current.delete(element);
  }, []);

  const registerEditable = useCallback(
    (key: string, editable: RegisteredEditable) => {
      if (!editable.element) return;
      registeredEditables.current.set(key, editable);

      if (!isEditing) return;
      if (typeof window === 'undefined') return;

      window.requestAnimationFrame(() => {
        if (!document.body.contains(editable.element)) return;
        enableEditingForElement(editable.element);
      });
    },
    [enableEditingForElement, isEditing]
  );

  const unregisterEditable = useCallback(
    (key: string) => {
      const editable = registeredEditables.current.get(key);
      if (!editable) return;
      if (editable.element.dataset.inlineEditing === 'true') {
        disableEditingForElement(editable.element);
      }
      registeredEditables.current.delete(key);
    },
    [disableEditingForElement]
  );

  const clearEditingState = useCallback(() => {
    if (typeof window === 'undefined') return;
    trackedElements.current.forEach((_, element) => {
      disableEditingForElement(element);
    });
    trackedElements.current.clear();
  }, [disableEditingForElement]);

  useEffect(() => {
    if (!isEditing) {
      clearEditingState();
      return;
    }

    if (typeof window === 'undefined') return;

    window.requestAnimationFrame(() => {
      registeredEditables.current.forEach((editable) => {
        if (!document.body.contains(editable.element)) return;
        enableEditingForElement(editable.element);
      });
    });
  }, [clearEditingState, enableEditingForElement, isEditing]);

  useEffect(() => {
    if (!isEditing) return;
    const id = window.requestAnimationFrame(() => {
      registeredEditables.current.forEach((editable) => {
        if (!document.body.contains(editable.element)) return;
        enableEditingForElement(editable.element);
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [enableEditingForElement, isEditing, pathname]);

  useEffect(() => {
    if (!isEditing) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) return undefined;
    const timeout = window.setTimeout(() => {
      document.body.classList.add('editing-mode-active');
    }, 0);
    return () => {
      window.clearTimeout(timeout);
      document.body.classList.remove('editing-mode-active');
    };
  }, [isEditing]);

  const handleSave = useCallback(async () => {
    if (saving) return;
    if (typeof window === 'undefined') return;

    const updates: { path: string; key: string; content: string; registryKey: string }[] = [];
    registeredEditables.current.forEach((editable, registryKey) => {
      if (!document.body.contains(editable.element)) return;
      const content = editable.element.innerHTML ?? '';
      updates.push({ path: editable.path, key: editable.editableId, content, registryKey });
    });

    if (updates.length === 0) {
      alert('Nenhum conteúdo editável encontrado para salvar.');
      disableEdit();
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: updates.map(({ path, key, content }) => ({ path, key, content })) }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message = typeof body?.error === 'string' ? body.error : 'Não foi possível salvar as edições.';
        setStatus({ type: 'error', message });
        return;
      }

      updates.forEach(({ registryKey, content }) => {
        const editable = registeredEditables.current.get(registryKey);
        editable?.setContent(content);
      });

      alert('Edições salvas com sucesso!');
      setStatus(null);
      disableEdit();
    } catch (error) {
      console.error('Erro ao salvar edições', error);
      setStatus({ type: 'error', message: 'Erro inesperado ao salvar as edições.' });
    } finally {
      setSaving(false);
    }
  }, [disableEdit, saving]);

  const value = useMemo<EditModeContextValue>(
    () => ({ isEditing, enableEdit, disableEdit, toggleEdit, registerEditable, unregisterEditable }),
    [disableEdit, enableEdit, isEditing, registerEditable, toggleEdit, unregisterEditable]
  );

  return (
    <EditModeContext.Provider value={value}>
      {children}
      {isEditing && (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2">
          <span className="rounded-full bg-indigo-500/90 px-4 py-1 text-sm font-medium text-white shadow-lg">
            Modo edição ativo
          </span>
          {status && (
            <span
              className={`rounded-full px-4 py-1 text-xs font-medium shadow transition ${
                status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {status.message}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
              saving ? 'bg-emerald-400 cursor-not-allowed opacity-90' : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            {saving ? 'Salvando…' : 'Salvar Edições'}
          </button>
        </div>
      )}
    </EditModeContext.Provider>
  );
}
